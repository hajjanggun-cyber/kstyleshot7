"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingModal } from "@/components/create/LoadingModal";
import { referenceTemplates } from "@/data/referenceTemplates";
import { hairStyles } from "@/data/hairStyles";
import { useCreateStore } from "@/store/createStore";

type Phase = "idle" | "face_swap_loading" | "face_swap_preview" | "haircut_loading";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40;

async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function OutfitFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const {
    hair,
    hairColor,
    hairPreviewUrl,
    photoBlobUrl,
    setOutfitChosen,
    pickOutfit,
    setFaceSwapImageUrl,
    setFaceSwapPredictionId,
    setFinalPredictionId,
    setStatus,
  } = useCreateStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [faceSwapResultUrl, setFaceSwapResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pollAttemptRef = useRef(0);
  const faceSwapPredictionIdRef = useRef<string | null>(null);

  const haircutName = hairStyles.find((s) => s.id === hair.picked)?.haircut ?? "";
  const selectedTemplate = referenceTemplates.find((t) => t.id === selectedId);

  // face-swap 폴링
  useEffect(() => {
    if (phase !== "face_swap_loading") return;

    pollAttemptRef.current = 0;
    let cancelled = false;

    const tick = async () => {
      if (cancelled || !faceSwapPredictionIdRef.current) return;

      pollAttemptRef.current += 1;
      if (pollAttemptRef.current > POLL_MAX_ATTEMPTS) {
        if (!cancelled) {
          setError(lang === "ko" ? "합성 시간이 초과되었습니다." : "Face-swap timed out.");
          setPhase("idle");
        }
        return;
      }

      try {
        const res = await fetch(`/api/final/poll?predictionId=${faceSwapPredictionIdRef.current}`, {
          cache: "no-store",
        });
        const data = (await res.json().catch(() => ({}))) as {
          status?: string;
          outputUrl?: string;
          error?: string;
        };

        if (!res.ok) throw new Error(data.error ?? "poll_failed");
        if (data.status === "failed" || data.status === "canceled") {
          throw new Error(lang === "ko" ? "얼굴 합성에 실패했습니다." : "Face-swap failed.");
        }

        if (data.status === "succeeded" && data.outputUrl) {
          if (!cancelled) {
            setFaceSwapImageUrl(data.outputUrl);
            setFaceSwapResultUrl(data.outputUrl);
            setPhase("face_swap_preview");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : lang === "ko" ? "합성 중 오류가 발생했습니다." : "An error occurred.");
          setPhase("idle");
        }
      }
    };

    void tick();
    const interval = window.setInterval(() => { void tick(); }, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [phase, lang, setFaceSwapImageUrl]);

  async function handleStartFaceSwap() {
    if (!selectedId || !photoBlobUrl || !haircutName || phase !== "idle") return;

    setError("");
    setPhase("face_swap_loading");

    try {
      const selfieDataUrl = await blobUrlToDataUrl(photoBlobUrl);

      const res = await fetch("/api/final/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfieUrl: selfieDataUrl,
          referenceTemplateId: selectedId,
          haircutName,
          hairColor: hairColor ?? "Black",
        }),
      });

      const data = (await res.json()) as { predictionId?: string; error?: string };
      if (!res.ok || !data.predictionId) {
        throw new Error(data.error ?? "face_swap_start_failed");
      }

      faceSwapPredictionIdRef.current = data.predictionId;
      setFaceSwapPredictionId(data.predictionId);
      setOutfitChosen([selectedId]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message :
          lang === "ko" ? "합성을 시작할 수 없습니다." : "Unable to start face-swap."
      );
      setPhase("idle");
    }
  }

  async function handleFinalize() {
    if (!faceSwapResultUrl || !haircutName || phase !== "face_swap_preview") return;

    setPhase("haircut_loading");
    setError("");

    try {
      const res = await fetch("/api/final/haircut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceSwapImageUrl: faceSwapResultUrl,
          haircutName,
          hairColor: hairColor ?? "Black",
        }),
      });

      const data = (await res.json()) as { predictionId?: string; ok?: boolean; error?: string };
      if (!res.ok || !data.predictionId) {
        throw new Error(data.error ?? "haircut_start_failed");
      }

      pickOutfit(selectedId!);
      setStatus("final_processing");
      setFinalPredictionId(data.predictionId);
      router.push(`/${lang}/create/done`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message :
          lang === "ko" ? "최종 합성을 시작할 수 없습니다." : "Unable to start final render."
      );
      setPhase("face_swap_preview");
    }
  }

  if (!hair.picked || !hairPreviewUrl) {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>{"<-"}</Link>
          <h2 className="ot-nav-title">{lang === "ko" ? "참조 이미지 선택" : "Choose a reference"}</h2>
          <div className="ot-nav-spacer" />
        </nav>
        <div className="ot-missing">
          <p>{lang === "ko" ? "먼저 헤어 결과 1개를 선택해 주세요." : "Pick one hair result first."}</p>
          <Link className="ot-missing-link" href={`/${lang}/create/hair`}>
            {lang === "ko" ? "헤어로 이동" : "Go to hair"}
          </Link>
        </div>
      </div>
    );
  }

  // face-swap 로딩 중
  if (phase === "face_swap_loading") {
    return (
      <LoadingModal
        badge={lang === "ko" ? "얼굴 합성 중" : "Face-swap in progress"}
        backdropImageUrl={selectedTemplate?.thumbnailUrl ?? hairPreviewUrl}
        title={lang === "ko" ? "경복궁 한복에 얼굴을 합성하는 중" : "Placing your face onto the template"}
        description={
          lang === "ko"
            ? "선택한 템플릿에 얼굴을 자연스럽게 합성하고 있습니다. 약 10~15초 소요됩니다."
            : "Blending your face into the selected template. This takes about 10–15 seconds."
        }
      />
    );
  }

  // face-swap 결과 확인 단계
  if (phase === "face_swap_preview") {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <button className="ot-back-btn" onClick={() => setPhase("idle")} type="button">{"<-"}</button>
          <h2 className="ot-nav-title">{lang === "ko" ? "합성 결과 확인" : "Review result"}</h2>
          <div className="ot-nav-spacer" />
        </nav>

        <div style={{ padding: "16px 16px 0" }}>
          <div style={{
            background: "linear-gradient(135deg, #f59e0b22, #f59e0b11)",
            border: "1.5px solid #f59e0b88",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 16,
            textAlign: "center",
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", margin: 0 }}>
              {lang === "ko" ? "경복궁 한복 합성 완료!" : "Face-swap complete!"}
            </p>
            <p style={{ fontSize: 13, color: "#a16207", margin: "6px 0 0" }}>
              {lang === "ko"
                ? `선택하신 [${hairStyles.find(s => s.id === hair.picked)?.name ?? hair.picked}] 헤어로 최종 완성할까요?`
                : `Ready to apply your selected [${hairStyles.find(s => s.id === hair.picked)?.name ?? hair.picked}] hairstyle?`}
            </p>
          </div>

          {faceSwapResultUrl ? (
            <img
              alt={lang === "ko" ? "얼굴 합성 결과" : "Face-swap result"}
              src={faceSwapResultUrl}
              style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 480 }}
            />
          ) : null}
        </div>

        {error ? <p className="up-error" style={{ margin: "12px 16px 0" }}>{error}</p> : null}

        <div className="ot-bottom" style={{ display: "grid", gap: 12 }}>
          <button
            className="up-next-btn up-next-btn--active"
            disabled={phase !== "face_swap_preview"}
            onClick={handleFinalize}
            type="button"
          >
            {lang === "ko" ? "최종 완성하기" : "Apply hairstyle & finish"}
          </button>
          <button
            className="up-next-btn"
            onClick={() => { setPhase("idle"); setFaceSwapResultUrl(null); }}
            type="button"
            style={{ background: "transparent", border: "1px solid #444", color: "#aaa" }}
          >
            {lang === "ko" ? "다른 템플릿 선택" : "Choose different template"}
          </button>
        </div>
      </div>
    );
  }

  // haircut 로딩 중
  if (phase === "haircut_loading") {
    return (
      <LoadingModal
        badge={lang === "ko" ? "헤어 합성 중" : "Applying hairstyle"}
        backdropImageUrl={faceSwapResultUrl ?? hairPreviewUrl}
        title={lang === "ko" ? "K-POP 헤어를 적용하는 중" : "Applying K-POP hairstyle"}
        description={
          lang === "ko"
            ? "선택한 헤어스타일을 최종 이미지에 적용하고 있습니다. 약 30~60초 소요됩니다."
            : "Applying your selected hairstyle to the final image. This takes about 30–60 seconds."
        }
      />
    );
  }

  // idle — 템플릿 선택 화면
  return (
    <div className="ot-root">
      <nav className="ot-nav">
        <Link className="ot-back-btn" href={`/${lang}/create/hair`}>{"<-"}</Link>
        <h2 className="ot-nav-title">{lang === "ko" ? "참조 이미지 선택" : "Choose a reference"}</h2>
        <div className="ot-nav-spacer" />
      </nav>

      <div className="ot-dots">
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--active" />
        <div className="ot-dot" />
      </div>

      {error ? <p className="up-error">{error}</p> : null}

      <div className="ot-compare">
        <div className="ot-compare-card ot-compare-card--ai">
          <img alt="Selected hair result" className="ot-compare-img" src={hairPreviewUrl} />
          <span className="ot-compare-label">
            {lang === "ko" ? "선택된 헤어 결과" : "Selected hair result"}
          </span>
        </div>
      </div>

      <div className="ot-compare-sub">
        <h2 className="ot-avatar-title">
          {lang === "ko" ? "합성할 배경 템플릿을 선택하세요" : "Select a background template"}
        </h2>
        <p className="ot-avatar-sub">
          {lang === "ko"
            ? "템플릿을 선택하면 얼굴 합성 후 선택한 헤어스타일로 최종 완성됩니다."
            : "After selecting a template, your face will be swapped in, then your chosen hairstyle applied."}
        </p>
      </div>

      <div className="ot-grid">
        {referenceTemplates.map((template) => {
          const isSelected = selectedId === template.id;
          return (
            <button
              className={`ot-card${isSelected ? " ot-card--selected" : ""}`}
              key={template.id}
              onClick={() => setSelectedId(template.id)}
              type="button"
            >
              <div className="ot-card-img" style={{ backgroundImage: `url(${template.thumbnailUrl})` }} />
              <div className="ot-card-info">
                <div className="ot-card-name-row">
                  <span className="ot-card-name">{template.title}</span>
                  {isSelected ? <span className="ot-card-check">✓</span> : null}
                </div>
                <span className="ot-card-sub">{template.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="ot-bottom">
        <button
          className="up-next-btn up-next-btn--active"
          disabled={!selectedId}
          onClick={handleStartFaceSwap}
          type="button"
        >
          {lang === "ko" ? "이 템플릿으로 합성 시작" : "Start face-swap with this template"}
        </button>
      </div>
    </div>
  );
}
