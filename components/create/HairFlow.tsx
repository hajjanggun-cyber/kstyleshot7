"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { hairColors } from "@/data/hairColors";
import { HAIR_CATEGORIES, hairStyles } from "@/data/hairStyles";
import { normalizePhotoForAI } from "@/lib/canvas";
import { useCreateStore } from "@/store/createStore";
import type { HairCategory, StepResult } from "@/types";

type HairPollState = {
  id: string;
  predictionId: string;
  outputUrl: string | null;
  failed: boolean;
};

const TEST_DUPLICATE_FIRST_HAIR_ONLY = false;
const HAIR_POLL_INTERVAL_MS = 3000;
const HAIR_POLL_MAX_ATTEMPTS = 40;

export function HairFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const {
    photoBlobUrl,
    setHairChosen,
    setHairColor,
    setHairPreviewUrl,
    setHairResults,
    pickHair,
    setStatus,
  } = useCreateStore();

  const [activeCategory, setActiveCategory] = useState<HairCategory>("daily");
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [resultCards, setResultCards] = useState<StepResult[]>([]);
  const [predictionStates, setPredictionStates] = useState<HairPollState[]>([]);
  const [pollSeed, setPollSeed] = useState(0);
  const predictionStatesRef = useRef<HairPollState[]>([]);
  const pollAttemptRef = useRef(0);

  useEffect(() => {
    predictionStatesRef.current = predictionStates;
  }, [predictionStates]);

  useEffect(() => {
    if (!isGenerating || predictionStatesRef.current.length === 0) {
      return;
    }

    pollAttemptRef.current = 0;
    let cancelled = false;

    const stopWithError = (message: string) => {
      if (cancelled) {
        return;
      }

      setIsGenerating(false);
      setStatus("hair_selecting");
      setGenerationError(message);
    };

    const finalizeResults = (nextStates: HairPollState[]) => {
      const nextResults: StepResult[] = TEST_DUPLICATE_FIRST_HAIR_ONLY
        ? selectedStyleIds.map((styleId) => ({
            id: styleId,
            blobUrl: nextStates[0]?.outputUrl ?? "",
            downloaded: false,
            selected: false,
          }))
        : nextStates.map((state) => ({
            id: state.id,
            blobUrl: state.outputUrl ?? "",
            predictionId: state.predictionId,
            downloaded: false,
            selected: false,
          }));

      setHairChosen(selectedStyleIds);
      setHairResults(nextResults);
      setResultCards(nextResults);
      setIsGenerating(false);
    };

    const tick = async () => {
      if (cancelled) {
        return;
      }

      pollAttemptRef.current += 1;
      if (pollAttemptRef.current > HAIR_POLL_MAX_ATTEMPTS) {
        stopWithError(lang === "ko" ? "헤어 생성 시간이 초과되었습니다." : "Hair generation timed out.");
        return;
      }

      try {
        const currentStates = predictionStatesRef.current;
        const nextStates = await Promise.all(
          currentStates.map(async (state) => {
            if (state.outputUrl || state.failed) {
              return state;
            }

            const res = await fetch(`/api/hair/poll?predictionId=${state.predictionId}`, {
              cache: "no-store",
            });
            const data = (await res.json().catch(() => ({}))) as {
              status?: string;
              outputUrl?: string;
              error?: string;
              message?: string;
            };

            if (!res.ok) {
              throw new Error(data.error || data.message || "hair_poll_failed");
            }

            if (data.status === "failed" || data.status === "canceled") {
              return {
                ...state,
                failed: true,
              };
            }

            return {
              ...state,
              outputUrl: data.outputUrl ?? null,
              failed: false,
            };
          })
        );

        if (cancelled) {
          return;
        }

        predictionStatesRef.current = nextStates;
        setPredictionStates(nextStates);

        const hasFailure = nextStates.some((state) => state.failed);
        if (hasFailure) {
          stopWithError(
            lang === "ko"
              ? "Replicate 헤어 생성이 실패했습니다. 다른 스타일이나 사진으로 다시 시도해 주세요."
              : "Replicate hair generation failed. Try a different photo or hairstyle."
          );
          return;
        }

        const allCompleted = nextStates.every((state) => state.outputUrl);
        if (allCompleted) {
          finalizeResults(nextStates);
        }
      } catch (error) {
        const message =
          error instanceof Error && error.message !== "hair_poll_failed"
            ? error.message
            : lang === "ko"
              ? "Replicate 상태 확인에 실패했습니다. 잠시 후 다시 시도해 주세요."
              : "Unable to check Replicate job status. Please try again.";
        stopWithError(message);
      }
    };

    void tick();
    const interval = window.setInterval(() => {
      void tick();
    }, HAIR_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [
    isGenerating,
    lang,
    pollSeed,
    selectedStyleIds,
    setHairChosen,
    setHairResults,
    setStatus,
  ]);

  function toggleStyle(id: string) {
    setGenerationError("");
    setResultCards([]);
    setPredictionStates([]);
    setPollSeed(0);
    predictionStatesRef.current = [];
    pollAttemptRef.current = 0;
    setSelectedStyleIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 2) {
        return [...current.slice(1), id];
      }

      return [...current, id];
    });
  }

  async function handleGenerate() {
    if (isGenerating || selectedStyleIds.length !== 2 || !photoBlobUrl) {
      return;
    }

    setGenerationError("");
    setResultCards([]);
    setPredictionStates([]);
    setPollSeed(0);
    predictionStatesRef.current = [];
    pollAttemptRef.current = 0;
    setIsGenerating(true);
    setStatus("hair_processing");

    try {
      const photoDataUrl = await normalizePhotoForAI(photoBlobUrl);
      const selectedColor = hairColors.find((item) => item.id === selectedColorId);
      if (selectedColor) {
        setHairColor(selectedColor.replicateValue);
      }

      const selectedStyles = selectedStyleIds
        .map((id) => hairStyles.find((style) => style.id === id))
        .filter((style): style is NonNullable<typeof style> => Boolean(style));

      const stylesToGenerate = TEST_DUPLICATE_FIRST_HAIR_ONLY
        ? selectedStyles.slice(0, 1)
        : selectedStyles;

      const responses = await Promise.all(
        stylesToGenerate.map(async (style) => {
          const res = await fetch("/api/hair/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              photoDataUrl,
              haircutName: style.haircut,
              hairColor: selectedColor?.replicateValue ?? "Black",
            }),
          });

          if (!res.ok) {
            const errorData = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
            throw new Error(errorData.error || errorData.message || "hair_preview_failed");
          }

          const data = (await res.json()) as { predictionId?: string };
          if (!data.predictionId) {
            throw new Error("missing_prediction_id");
          }

          return {
            id: style.id,
            predictionId: data.predictionId,
            outputUrl: null,
            failed: false,
          } satisfies HairPollState;
        })
      );

      predictionStatesRef.current = responses;
      setPredictionStates(responses);
      setPollSeed((current) => current + 1);
    } catch (error) {
      setIsGenerating(false);
      setStatus("hair_selecting");
      setGenerationError(
        error instanceof Error && error.message && error.message !== "hair_preview_failed"
          ? error.message
          : lang === "ko"
            ? "헤어 생성 시작에 실패했습니다."
            : "Unable to start hair generation."
      );
    }
  }

  async function handlePickResult(result: StepResult & { predictionId?: string }) {
    setHairPreviewUrl(result.blobUrl);
    pickHair(result.id);

    // ✅ Fire-and-forget call to the selection endpoint
    fetch("/api/hair/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hairId: result.id,
        previewUrl: result.blobUrl,
        predictionId: result.predictionId,
      }),
    }).catch(console.error);

    router.push(`/${lang}/create/outfit`);
  }

  return (
    <div className="hr-root">
      {isGenerating ? (
        <div className="ot-synth-overlay">
          <div className="ot-synth-ring" />
          <div>
            <p className="ot-synth-title">
              {lang === "ko"
                ? "얼굴선에 맞춰 헤어를 정교하게 맞추는 중"
                : "Refining the hairstyle to match your features"}
            </p>
            <p className="ot-synth-sub">
              {lang === "ko"
                ? "원래 인상은 그대로 두고, 선택한 스타일만 자연스럽게 입히고 있어요.\n잠시만 기다려 주세요."
                : "Keeping your original look intact while applying the selected style naturally.\nJust a moment."}
            </p>
          </div>
          <p className="ot-synth-badge">
            {lang === "ko" ? "헤어 완성 중" : "Hair in progress"}
          </p>
        </div>
      ) : null}

      <nav className="hr-nav">
        <Link className="hr-back-btn" href={`/${lang}/create/upload`}>←</Link>
        <span className="hr-step-tag">STEP 2 / 4</span>
        <div className="hr-nav-right" />
      </nav>

      <div className="hr-strip">
        {photoBlobUrl ? (
          <img className="hr-strip-img" src={photoBlobUrl} alt="" />
        ) : (
          <div className="hr-strip-img" style={{ background: "#2a1c10" }} />
        )}
        <div className="hr-strip-meta">
          <p className="hr-strip-kicker">{lang === "ko" ? "내 사진" : "MY PHOTO"}</p>
          <p className="hr-strip-val">
            {selectedStyleIds.length > 0
              ? `${selectedStyleIds.length}${lang === "ko" ? "개 선택됨" : " selected"}`
              : lang === "ko"
                ? "헤어 2개를 선택하세요"
                : "Select 2 hairstyles"}
          </p>
        </div>
        <div className="hr-strip-ai-badge">AI</div>
      </div>

      {generationError ? <p className="up-error">{generationError}</p> : null}

      <div className="hr-section">
        <div className="hr-section-hd">
          <span className="hr-section-pill">{lang === "ko" ? "스타일" : "STYLE"}</span>
          <span className="hr-section-hint">
            {lang === "ko" ? "최대 2개까지 선택" : "Choose up to 2"}
          </span>
        </div>

        <div className="hr-tabs-wrap">
          <div className="hr-tabs">
            {HAIR_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`hr-tab${activeCategory === cat.key ? " hr-tab--active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
                type="button"
              >
                {lang === "ko" ? cat.labelKo : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="hr-grid">
          {hairStyles.filter((item) => item.category === activeCategory).map((style) => {
            const isSelected = selectedStyleIds.includes(style.id);
            return (
              <button
                className={`hr-card${isSelected ? " hr-card--sel" : ""}`}
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                style={{
                  backgroundImage: style.thumbnail
                    ? `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%),url(${style.thumbnail})`
                    : `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%),${style.colorHint}`,
                }}
                type="button"
              >
                {isSelected ? <span className="hr-card-check" aria-hidden>✓</span> : null}
                <span className="hr-card-name">{style.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hr-section hr-section--color">
        <div className="hr-section-hd">
          <span className="hr-section-pill">{lang === "ko" ? "컬러" : "COLOR"}</span>
          <span className="hr-section-hint">
            {lang === "ko" ? "선택 안 하면 AI가 결정" : "Optional"}
          </span>
        </div>
        <div className="hr-color-rail">
          {hairColors.map((color) => {
            const isSelected = selectedColorId === color.id;
            return (
              <button
                className={`hr-swatch-btn${isSelected ? " hr-swatch-btn--sel" : ""}`}
                key={color.id}
                onClick={() => setSelectedColorId(isSelected ? null : color.id)}
                type="button"
              >
                <span className="hr-swatch" style={{ background: color.swatch }} />
                <span className="hr-swatch-name">
                  {lang === "ko" ? color.nameKo : color.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {resultCards.length > 0 ? (
        <div style={{ paddingBottom: 120 }}>
          <div style={{
            background: "linear-gradient(135deg, #f59e0b22, #f59e0b11)",
            border: "1.5px solid #f59e0b88",
            borderRadius: 12,
            padding: "12px 16px",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", margin: 0 }}>
              {lang === "ko" ? "✨ 헤어 결과 2장이 완성되었어요!" : "✨ 2 hair results are ready!"}
            </p>
            <p style={{ fontSize: 13, color: "#f59e0bcc", margin: "4px 0 0" }}>
              {lang === "ko" ? "아래 사진 중 마음에 드는 1장을 눌러 다음 단계로 이동하세요." : "Tap a photo below to proceed to the next step."}
            </p>
          </div>
          <div className="ot-grid">
            {resultCards.map((result) => (
              <div key={result.id} style={{ position: "relative" }}>
                <button
                  className="ot-card"
                  onClick={() => handlePickResult(result)}
                  type="button"
                  style={{ width: "100%" }}
                >
                  <div
                    className="ot-card-img"
                    style={{ backgroundImage: `url(${result.blobUrl})`, height: 320 }}
                  />
                  <div className="ot-card-info">
                    <div className="ot-card-name-row">
                      <span className="ot-card-name">
                        {hairStyles.find((style) => style.id === result.id)?.name ?? result.id}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: "8px 0",
                        textAlign: "center",
                        letterSpacing: 0.3,
                      }}
                    >
                      {lang === "ko" ? "이 사진으로 진행하기 →" : "Pick this photo →"}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="hr-bottom">
        <button
          className={`hr-cta${selectedStyleIds.length === 2 && !isGenerating ? " hr-cta--on" : ""}${isGenerating ? " hr-cta--loading" : ""}`}
          onClick={handleGenerate}
          disabled={selectedStyleIds.length !== 2 || isGenerating}
          type="button"
        >
          {isGenerating
            ? lang === "ko" ? "헤어를 정리하는 중..." : "Refining your hair..."
            : selectedStyleIds.length === 2
              ? lang === "ko" ? "헤어 2개 생성" : "Generate 2 previews"
              : lang === "ko" ? "헤어 2개를 선택하세요" : "Select 2 hairstyles"}
        </button>
      </div>
    </div>
  );
}
