"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { JobStatus, SessionStatusResponse } from "@/types";
import { useCreateStore } from "@/store/createStore";

const SESSION_STORAGE_KEY = "kstyleshot.create.session";
const POLL_INTERVAL_MS = 1500;

type StoredSession = {
  checkoutId: string;
  orderId: string;
  sessionToken: string;
  status: JobStatus;
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
    ) return null;
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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    revokeObjectUrl(photoBlobUrl);
    const nextBlobUrl = URL.createObjectURL(file);
    setPhotoBlobUrl(nextBlobUrl);
    if (!checkoutIdFromUrl && allowDemoFlow) ensureDemoSession();
  }

  function handleContinue() {
    if (!allowDemoFlow && !photoBlobUrl) return;
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

  // TODO: restore payment gate — canContinue = Boolean(photoBlobUrl) && (checkoutIdFromUrl ? isPaidSessionReady && Boolean(sessionToken) : allowDemoFlow)
  const canContinue = allowDemoFlow || (Boolean(photoBlobUrl) && isPaidSessionReady && Boolean(sessionToken));

  return (
    <div className="up-root">
      {/* Nav */}
      <nav className="up-nav">
        <Link className="up-back-btn" href={`/${lang}`}>
          ←
        </Link>
        <h2 className="up-nav-title">{tf("navTitle")}</h2>
      </nav>

      {/* Progress dots */}
      <div className="up-dots">
        <div className="up-dot up-dot--active" />
        <div className="up-dot" />
        <div className="up-dot" />
        <div className="up-dot" />
      </div>

      <main className="up-main">
        {/* Heading */}
        <div className="up-head">
          <h1 className="up-head-title">{tf("heading")}</h1>
          <p className="up-head-sub">{tf("sub")}</p>
        </div>

        {/* Error notice */}
        {pollError ? <p className="up-error">{pollError}</p> : null}

        {/* Photo source picker / preview */}
        {photoBlobUrl ? (
          <div className="up-preview-wrap">
            <img alt="Your uploaded photo" className="up-preview-img" src={photoBlobUrl} />
            <div className="up-preview-actions">
              <button className="up-reshot-btn" onClick={() => cameraInputRef.current?.click()} type="button">
                <span>📸</span> {tf("cameraBtn")}
              </button>
              <button className="up-reshot-btn" onClick={() => fileInputRef.current?.click()} type="button">
                <span>🖼</span> {tf("uploadBtn")}
              </button>
            </div>
          </div>
        ) : (
          <div className="up-source-wrap">
            <p className="up-source-label">{tf("chooseMethod")}</p>
            <div className="up-source-cards">
              <button
                className="up-source-card"
                onClick={() => cameraInputRef.current?.click()}
                type="button"
              >
                <span className="up-source-icon">📸</span>
                <span className="up-source-name">{tf("cameraBtn")}</span>
                <span className="up-source-sub">{tf("cameraSub")}</span>
              </button>
              <button
                className="up-source-card"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <span className="up-source-icon">🖼</span>
                <span className="up-source-name">{tf("uploadBtn")}</span>
                <span className="up-source-sub">{tf("uploadSub")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
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

        {/* Photo Guide */}
        <div className="up-guide">
          <h3 className="up-guide-title">
            <span className="up-guide-icon">💡</span>
            {tf("guideTitle")}
          </h3>
          <div className="up-guide-grid">
            <div className="up-guide-item"><span className="up-guide-check">✓</span>{tf("guide1")}</div>
            <div className="up-guide-item"><span className="up-guide-check">✓</span>{tf("guide2")}</div>
            <div className="up-guide-item"><span className="up-guide-check">✓</span>{tf("guide3")}</div>
            <div className="up-guide-item"><span className="up-guide-check">✓</span>{tf("guide4")}</div>
          </div>
        </div>

        {/* Trending */}
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

      {/* Fixed bottom bar */}
      <div className="up-bottom">
        <button
          className={`up-next-btn${canContinue ? " up-next-btn--active" : ""}`}
          disabled={!canContinue}
          onClick={handleContinue}
          type="button"
        >
          {checkoutIdFromUrl && isPollingSession ? tf("verifying") : tf("nextBtn")}
        </button>
      </div>
    </div>
  );
}
