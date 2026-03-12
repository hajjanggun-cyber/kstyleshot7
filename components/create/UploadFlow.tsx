"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { JobStatus, SessionStatusResponse } from "@/types";
import { useCreateStore } from "@/store/createStore";

const SESSION_STORAGE_KEY = "kstyleshot.create.session";
const POLL_INTERVAL_MS = 1500;
// Tuned for upper-body portraits where the face is clear but shoulders still remain visible.
const FACE_RATIO_TOO_CLOSE = 0.38;
const FACE_RATIO_TOO_FAR = 0.06;
const FACE_CENTER_X_MIN = 0.20;
const FACE_CENTER_X_MAX = 0.80;
const FACE_CENTER_Y_MIN = 0.14;
const FACE_CENTER_Y_MAX = 0.68;

type StoredSession = {
  checkoutId: string;
  orderId: string;
  sessionToken: string;
  status: JobStatus;
};

type FaceWarningState =
  | "none"
  | "checking"
  | "no_face"
  | "too_close"
  | "too_far"
  | "off_center"
  | "pass";

type FaceValidationResult = {
  state: FaceWarningState;
  ratio: number | null;
};

const TRENDING = [
  { label: "Sparkle UI", style: "Glow Concept", color: "#f48c25" },
  { label: "V-Shape", style: "Urban Style", color: "#9D50FF" },
  { label: "Peach Glass", style: "Idol Core", color: "#FF4EBD" },
];

function revokeObjectUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

async function normalizeImageForDetection(file: File, fallbackUrl: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  const MAX_DIMENSION = 1280;

  const drawScaled = (sourceWidth: number, sourceHeight: number, draw: () => void) => {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight));
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    draw();
  };

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      drawScaled(bitmap.width, bitmap.height, () => {
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      });
      bitmap.close();
      return canvas;
    } catch {
      // Fall through to HTMLImageElement loading below.
    }
  }

  const img = new Image();
  img.src = fallbackUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load uploaded image."));
  });

  drawScaled(img.naturalWidth, img.naturalHeight, () => {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  });

  return canvas;
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (
      typeof parsed.checkoutId !== "string" ||
      typeof parsed.orderId !== "string" ||
      typeof parsed.sessionToken !== "string" ||
      typeof parsed.status !== "string"
    ) {
      return null;
    }

    return {
      checkoutId: parsed.checkoutId,
      orderId: parsed.orderId,
      sessionToken: parsed.sessionToken,
      status: parsed.status as JobStatus,
    };
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function removeCheckoutIdFromUrl() {
  if (typeof window === "undefined") return;
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete("checkout_id");
  nextUrl.searchParams.delete("checkoutId");
  window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

function readApiErrorMessage(payload: unknown, fallback: string): string {
  let message = fallback;
  let requestId = "";

  if (payload && typeof payload === "object") {
    if ("message" in payload && typeof payload.message === "string") message = payload.message;
    if ("requestId" in payload && typeof payload.requestId === "string") requestId = payload.requestId;
  }

  return requestId ? `${message} (requestId: ${requestId})` : message;
}

function validateFaceBox(input: {
  imageWidth: number;
  imageHeight: number;
  width: number;
  height: number;
  originX: number;
  originY: number;
}): FaceValidationResult {
  const faceArea = input.width * input.height;
  const imageArea = input.imageWidth * input.imageHeight;
  const ratio = imageArea > 0 ? faceArea / imageArea : 0;
  const centerX = (input.originX + input.width / 2) / input.imageWidth;
  const centerY = (input.originY + input.height / 2) / input.imageHeight;

  if (ratio > FACE_RATIO_TOO_CLOSE) {
    return { state: "too_close", ratio };
  }

  if (ratio < FACE_RATIO_TOO_FAR) {
    return { state: "too_far", ratio };
  }

  if (
    centerX < FACE_CENTER_X_MIN ||
    centerX > FACE_CENTER_X_MAX ||
    centerY < FACE_CENTER_Y_MIN ||
    centerY > FACE_CENTER_Y_MAX
  ) {
    return { state: "off_center", ratio };
  }

  return { state: "pass", ratio };
}

type UploadFlowProps = {
  checkoutIdFromUrl?: string;
  allowDemoFlow?: boolean;
};

export function UploadFlow({ checkoutIdFromUrl = "", allowDemoFlow = false }: UploadFlowProps) {
  const t = useTranslations("create.photoUpload");
  const tf = useTranslations("flow.upload");
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const {
    checkoutId,
    sessionToken,
    photoBlobUrl,
    setCheckout,
    setPhotoBlobUrl,
    setSession,
    setStatus,
  } = useCreateStore();

  const lang = params.lang ?? "en";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isPollingSession, setIsPollingSession] = useState(false);
  const [isPaidSessionReady, setIsPaidSessionReady] = useState(false);
  const [pollError, setPollError] = useState("");
  const [faceWarning, setFaceWarning] = useState<FaceWarningState>("none");
  const [faceRatio, setFaceRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!checkoutIdFromUrl) {
      setPollError("");
      setIsPollingSession(false);
      setIsPaidSessionReady(false);
      return;
    }

    setCheckout(checkoutIdFromUrl);
    setIsPaidSessionReady(false);

    const cachedSession = readStoredSession();
    if (cachedSession && cachedSession.checkoutId === checkoutIdFromUrl) {
      setSession({
        orderId: cachedSession.orderId,
        sessionToken: cachedSession.sessionToken,
        status: cachedSession.status,
      });
      setIsPaidSessionReady(true);
      removeCheckoutIdFromUrl();
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const pollSession = async () => {
      setIsPollingSession(true);
      setPollError("");

      try {
        const response = await fetch(
          `/api/session/status?checkoutId=${encodeURIComponent(checkoutIdFromUrl)}`,
          { cache: "no-store" }
        );
        const payload = (await response.json().catch(() => null)) as
          | SessionStatusResponse
          | { ok?: false; message?: string }
          | null;

        if (!response.ok && response.status !== 202) {
          throw new Error(readApiErrorMessage(payload, t("errors.checkPaidSession")));
        }

        if (payload && "ready" in payload && payload.ready) {
          if (cancelled) return;
          writeStoredSession({
            checkoutId: checkoutIdFromUrl,
            orderId: payload.orderId,
            sessionToken: payload.sessionToken,
            status: payload.status,
          });
          setSession({
            orderId: payload.orderId,
            sessionToken: payload.sessionToken,
            status: payload.status,
          });
          setIsPaidSessionReady(true);
          setIsPollingSession(false);
          removeCheckoutIdFromUrl();
          return;
        }

        if (!cancelled) {
          timer = setTimeout(pollSession, POLL_INTERVAL_MS);
        }
      } catch (error) {
        if (cancelled) return;
        setIsPollingSession(false);
        setIsPaidSessionReady(false);
        setPollError(error instanceof Error ? error.message : t("errors.currentPaidSession"));
      }
    };

    void pollSession();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [allowDemoFlow, checkoutIdFromUrl, setCheckout, setSession, t]);

  function ensureDemoSession() {
    if (!allowDemoFlow || sessionToken) return;
    const resolvedCheckoutId = checkoutId || "local-demo";
    setSession({
      orderId: `demo-order-${resolvedCheckoutId}`,
      sessionToken: `demo-session-${resolvedCheckoutId}`,
      status: "payment_confirmed",
    });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    revokeObjectUrl(photoBlobUrl);

    const nextBlobUrl = URL.createObjectURL(file);
    setPhotoBlobUrl(nextBlobUrl);
    setFaceWarning("checking");
    setFaceRatio(null);

    if (!checkoutIdFromUrl && allowDemoFlow) ensureDemoSession();

    try {
      const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-assets/face_detection_full_range.tflite",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.35,
      });

      const normalizedCanvas = await normalizeImageForDetection(file, nextBlobUrl);
      const result = detector.detect(normalizedCanvas);
      detector.close();

      if (result.detections.length === 0) {
        setFaceWarning("no_face");
        setFaceRatio(null);
        return;
      }

      // Find the largest face by bounding box area
      let largestDetection = result.detections[0];
      let maxArea = 0;

      for (const det of result.detections) {
        const box = det.boundingBox;
        if (box && box.width && box.height) {
          const area = box.width * box.height;
          if (area > maxArea) {
            maxArea = area;
            largestDetection = det;
          }
        }
      }

      const boundingBox = largestDetection.boundingBox;
      if (
        !boundingBox ||
        boundingBox.width === undefined ||
        boundingBox.height === undefined ||
        boundingBox.originX === undefined ||
        boundingBox.originY === undefined
      ) {
        setFaceWarning("no_face");
        setFaceRatio(null);
        return;
      }

      const validation = validateFaceBox({
        imageWidth: normalizedCanvas.width,
        imageHeight: normalizedCanvas.height,
        width: boundingBox.width,
        height: boundingBox.height,
        originX: boundingBox.originX,
        originY: boundingBox.originY,
      });

      setFaceWarning(validation.state);
      setFaceRatio(validation.ratio);
    } catch {
      // Fallback pass if client-side detector cannot initialize.
      setFaceWarning("pass");
      setFaceRatio(null);
    }
  }

  function handleContinue() {
    if (!photoBlobUrl || faceWarning !== "pass") return;

    if (!checkoutIdFromUrl) {
      if (!allowDemoFlow) {
        setPollError(t("errors.checkoutRequired"));
        return;
      }
      ensureDemoSession();
    } else if (!isPaidSessionReady || !sessionToken) {
      setPollError(t("errors.stillPending"));
      return;
    }

    setStatus("hair_selecting");
    router.push(`/${lang}/create/hair`);
  }

  const canContinue =
    Boolean(photoBlobUrl) &&
    faceWarning === "pass" &&
    (checkoutIdFromUrl ? isPaidSessionReady && Boolean(sessionToken) : allowDemoFlow);

  const faceFeedback = (() => {
    switch (faceWarning) {
      case "checking":
        return {
          kind: "checking" as const,
          title: lang === "ko" ? "사진 구도를 분석하는 중" : "Analyzing photo framing",
          description:
            lang === "ko"
              ? "얼굴 위치와 상반신 구도가 다음 단계에 적합한지 확인하고 있습니다."
              : "Checking whether the face position and upper-body framing are suitable.",
        };
      case "no_face":
        return {
          kind: "warning" as const,
          title: lang === "ko" ? "얼굴을 찾을 수 없습니다" : "No face detected",
          description:
            lang === "ko"
              ? "정면 얼굴이 분명하게 보이는 사진을 올려 주세요. 측면, 뒷모습, 사물 사진은 통과할 수 없습니다."
              : "Please upload a photo with a clearly visible front-facing face. Side, back, or object photos cannot pass.",
        };
      case "too_close":
        return {
          kind: "warning" as const,
          title: lang === "ko" ? "얼굴이 너무 가깝습니다" : "Face is too close",
          description:
            lang === "ko"
              ? "어깨선이 보이도록 조금만 뒤로 물러나거나, 더 여유 있는 상반신 사진을 사용해 주세요."
              : "Step back slightly so the shoulders are visible, or use a roomier upper-body photo.",
        };
      case "too_far":
        return {
          kind: "warning" as const,
          title: lang === "ko" ? "얼굴이 너무 작습니다" : "Face is too small",
          description:
            lang === "ko"
              ? "이목구비가 더 잘 보이는 상반신 사진을 사용해 주세요. 전신에 가까운 사진은 품질이 떨어집니다."
              : "Use an upper-body photo where facial features are more visible. Full-body style shots reduce quality.",
        };
      case "off_center":
        return {
          kind: "warning" as const,
          title: lang === "ko" ? "얼굴이 화면 중앙에서 벗어났습니다" : "Face is off center",
          description:
            lang === "ko"
              ? "얼굴이 화면 중앙에 오고 어깨선이 함께 보이도록 다시 촬영해 주세요."
              : "Retake the photo so the face is centered and the shoulders remain visible.",
        };
      case "pass":
        return {
          kind: "success" as const,
          title: lang === "ko" ? "좋습니다. 상반신 구도가 확인되었습니다" : "Great. Upper-body framing looks good",
          description:
            lang === "ko"
              ? "얼굴과 어깨선이 다음 단계에 적합한 범위로 확인되었습니다."
              : "The face and shoulder framing look suitable for the next step.",
        };
      default:
        return null;
    }
  })();

  return (
    <div className="up-root">
      <nav className="up-nav">
        <Link className="up-back-btn" href={`/${lang}`}>
          {"<-"}
        </Link>
        <h2 className="up-nav-title">{tf("navTitle")}</h2>
      </nav>

      <div className="up-dots">
        <div className="up-dot up-dot--active" />
        <div className="up-dot" />
        <div className="up-dot" />
        <div className="up-dot" />
      </div>

      <main className="up-main">
        <div className="up-head">
          <h1 className="up-head-title">{tf("heading")}</h1>
          <p className="up-head-sub">{tf("sub")}</p>
        </div>

        {pollError ? <p className="up-error">{pollError}</p> : null}

        {photoBlobUrl ? (
          <div className="up-preview-wrap">
            <img alt="Your uploaded photo" className="up-preview-img" src={photoBlobUrl} />
            <div className="up-preview-actions">
              <button className="up-reshot-btn" onClick={() => cameraInputRef.current?.click()} type="button">
                <span>Cam</span> {tf("cameraBtn")}
              </button>
              <button className="up-reshot-btn" onClick={() => fileInputRef.current?.click()} type="button">
                <span>Up</span> {tf("uploadBtn")}
              </button>
            </div>
          </div>
        ) : (
          <div className="up-source-wrap">
            <p className="up-source-label">{tf("chooseMethod")}</p>
            <div className="up-source-cards">
              <button className="up-source-card" onClick={() => cameraInputRef.current?.click()} type="button">
                <span className="up-source-icon">Cam</span>
                <span className="up-source-name">{tf("cameraBtn")}</span>
                <span className="up-source-sub">{tf("cameraSub")}</span>
              </button>
              <button className="up-source-card" onClick={() => fileInputRef.current?.click()} type="button">
                <span className="up-source-icon">Up</span>
                <span className="up-source-name">{tf("uploadBtn")}</span>
                <span className="up-source-sub">{tf("uploadSub")}</span>
              </button>
            </div>
          </div>
        )}

        <input
          ref={cameraInputRef}
          accept="image/*"
          capture="user"
          className="up-input"
          onChange={handleFileChange}
          type="file"
        />
        <input
          ref={fileInputRef}
          accept="image/*"
          className="up-input"
          onChange={handleFileChange}
          type="file"
        />

        {faceFeedback ? (
          <div className={`up-face-warning${faceFeedback.kind === "success" ? " up-face-warning--success" : ""}`}>
            <p className="up-face-warning-title">{faceFeedback.title}</p>
            <p className="up-face-warning-desc">{faceFeedback.description}</p>
            {faceRatio !== null ? (
              <p className="up-face-warning-meta">
                {lang === "ko"
                  ? `얼굴 비율 ${(faceRatio * 100).toFixed(1)}%`
                  : `Face ratio ${(faceRatio * 100).toFixed(1)}%`}
              </p>
            ) : null}
            {faceFeedback.kind !== "success" && faceFeedback.kind !== "checking" ? (
              <button className="up-face-retry-btn" onClick={() => fileInputRef.current?.click()} type="button">
                {lang === "ko" ? "다른 사진 선택" : "Choose another photo"}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="up-guide">
          <h3 className="up-guide-title">
            <span className="up-guide-icon">Tip</span>
            {tf("guideTitle")}
          </h3>
          <div className="up-guide-grid">
            <div className="up-guide-item"><span className="up-guide-check">OK</span>{tf("guide1")}</div>
            <div className="up-guide-item"><span className="up-guide-check">OK</span>{tf("guide2")}</div>
            <div className="up-guide-item"><span className="up-guide-check">OK</span>{tf("guide3")}</div>
            <div className="up-guide-item"><span className="up-guide-check">OK</span>{tf("guide4")}</div>
          </div>
        </div>

        <div className="up-trending">
          <div className="up-trending-head">
            <h3 className="up-trending-title">{tf("trendingTitle")}</h3>
            <span className="up-trending-more">{tf("trendingMore")}</span>
          </div>
          <div className="up-trending-scroll">
            {TRENDING.map((item, i) => (
              <div className="up-trend-card" key={i}>
                <div className="up-trend-imgs">
                  <div className="up-trend-before" />
                  <div className="up-trend-after" style={{ borderColor: `${item.color}55` }} />
                  <span className="up-trend-badge" style={{ background: item.color }}>
                    {item.label}
                  </span>
                </div>
                <p className="up-trend-style">{item.style}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="up-bottom">
        <button
          className={`up-next-btn${canContinue ? " up-next-btn--active" : ""}`}
          disabled={!canContinue}
          onClick={handleContinue}
          type="button"
        >
          {checkoutIdFromUrl && isPollingSession
            ? tf("verifying")
            : faceWarning !== "pass" && photoBlobUrl
              ? lang === "ko"
                ? "상반신 사진을 확인해 주세요"
                : "Check your photo framing"
              : tf("nextBtn")}
        </button>
      </div>
    </div>
  );
}
