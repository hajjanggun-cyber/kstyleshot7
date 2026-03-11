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

const HAIR_POLL_INTERVAL_MS = 3000;
const HAIR_POLL_MAX_ATTEMPTS = 40;
const MAX_HAIR_RESULTS = 2;

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
  const [pickedResultId, setPickedResultId] = useState<string | null>(null);
  const [predictionStates, setPredictionStates] = useState<HairPollState[]>([]);
  const [pollSeed, setPollSeed] = useState(0);
  const predictionStatesRef = useRef<HairPollState[]>([]);
  const resultCardsRef = useRef<StepResult[]>([]);
  const pollAttemptRef = useRef(0);

  useEffect(() => {
    predictionStatesRef.current = predictionStates;
  }, [predictionStates]);

  useEffect(() => {
    resultCardsRef.current = resultCards;
  }, [resultCards]);

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
      const nextResults: StepResult[] = nextStates.map((state) => ({
        id: state.id,
        blobUrl: state.outputUrl ?? "",
        downloaded: false,
        selected: false,
      }));

      const mergedResults = [
        ...resultCardsRef.current,
        ...nextResults.filter(
          (nextResult) => !resultCardsRef.current.some((currentResult) => currentResult.id === nextResult.id)
        ),
      ].slice(0, MAX_HAIR_RESULTS);

      setHairChosen(mergedResults.map((result) => result.id));
      setHairResults(mergedResults);
      setResultCards(mergedResults);
      setSelectedStyleIds([]);
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

        if (nextStates.some((state) => state.failed)) {
          stopWithError(
            lang === "ko"
              ? "Replicate 헤어 생성에 실패했습니다. 다른 사진이나 스타일로 다시 시도해 주세요."
              : "Replicate hair generation failed. Try a different photo or hairstyle."
          );
          return;
        }

        if (nextStates.every((state) => state.outputUrl)) {
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
  }, [isGenerating, lang, pollSeed, selectedStyleIds, setHairChosen, setHairResults, setStatus]);

  const generatedStyleIds = new Set(resultCards.map((result) => result.id));
  const selectedStyleId = selectedStyleIds[0] ?? null;
  const hasOneResult = resultCards.length === 1;
  const hasTwoResults = resultCards.length === 2;
  const canGenerate =
    selectedStyleIds.length === 1 &&
    !isGenerating &&
    resultCards.length < MAX_HAIR_RESULTS &&
    (!selectedStyleId || !generatedStyleIds.has(selectedStyleId));
  const canContinue = resultCards.some((result) => result.id === pickedResultId);

  function toggleStyle(id: string) {
    setGenerationError("");

    if (generatedStyleIds.has(id)) {
      setGenerationError(
        lang === "ko"
          ? "이미 생성한 헤어입니다. 다른 스타일 1개를 선택해 비교해 주세요."
          : "This hairstyle is already generated. Select one different style to compare."
      );
      return;
    }

    setSelectedStyleIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [id];
    });
  }

  async function handleGenerate() {
    if (!canGenerate || !photoBlobUrl || !selectedStyleId) {
      return;
    }

    setGenerationError("");
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

      const selectedStyle = hairStyles.find((style) => style.id === selectedStyleId);
      if (!selectedStyle) {
        throw new Error("missing_style");
      }

      const res = await fetch("/api/hair/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoDataUrl,
          haircutName: selectedStyle.haircut,
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

      const responses: HairPollState[] = [
        {
          id: selectedStyle.id,
          predictionId: data.predictionId,
          outputUrl: null,
          failed: false,
        },
      ];

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
            ? "헤어 생성을 시작할 수 없습니다."
            : "Unable to start hair generation."
      );
    }
  }

  function handlePickResult(result: StepResult) {
    setPickedResultId(result.id);
    setHairPreviewUrl(result.blobUrl);
  }

  async function handleContinue() {
    const selectedResult = resultCards.find((result) => result.id === pickedResultId);
    if (!selectedResult) {
      return;
    }

    setHairPreviewUrl(selectedResult.blobUrl);
    pickHair(selectedResult.id);

    fetch("/api/hair/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hairId: selectedResult.id,
        previewUrl: selectedResult.blobUrl,
      }),
    }).catch(console.error);

    router.push(`/${lang}/create/outfit`);
  }

  const resultHeadline = hasTwoResults
    ? lang === "ko"
      ? "사진 2개가 준비되었습니다"
      : "Two hairstyle results are ready"
    : lang === "ko"
      ? "첫 번째 헤어 결과가 준비되었습니다"
      : "Your first hairstyle result is ready";

  const resultMessage = hasTwoResults
    ? lang === "ko"
      ? "사진 2개 중 하나를 선택하면 다음 단계로 이동합니다."
      : "Choose one of the two results to continue to the next step."
    : lang === "ko"
      ? "마음에 들면 지금 결과를 선택해 다음으로 갈 수 있습니다. 비교하려면 헤어 1개를 더 선택하세요."
      : "You can continue with this result now, or select one more hairstyle to compare.";

  return (
    <div className="hr-root">
      {isGenerating ? (
        <div className="ot-synth-overlay">
          <div className="ot-synth-ring" />
          <div>
            <p className="ot-synth-title">
              {lang === "ko"
                ? "얼굴형과 분위기에 맞게 헤어를 정교하게 맞추는 중"
                : "Refining the hairstyle to match your features"}
            </p>
            <p className="ot-synth-sub">
              {lang === "ko"
                ? "원래 인상은 유지하면서 선택한 헤어만 자연스럽게 적용하고 있습니다.\n잠시만 기다려 주세요."
                : "Keeping your original look intact while applying the selected style naturally.\nJust a moment."}
            </p>
          </div>
          <p className="ot-synth-badge">{lang === "ko" ? "헤어 생성 중" : "Hair in progress"}</p>
        </div>
      ) : null}

      <nav className="hr-nav">
        <Link className="hr-back-btn" href={`/${lang}/create/upload`}>
          {"<-"}
        </Link>
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
            {resultCards.length > 0
              ? lang === "ko"
                ? `${resultCards.length}개 결과 준비됨`
                : `${resultCards.length} result${resultCards.length > 1 ? "s" : ""} ready`
              : selectedStyleIds.length > 0
                ? `${selectedStyleIds.length}${lang === "ko" ? "개 선택됨" : " selected"}`
                : lang === "ko"
                  ? "헤어 1개를 선택하세요"
                  : "Select 1 hairstyle"}
          </p>
        </div>
        <div className="hr-strip-ai-badge">AI</div>
      </div>

      {generationError ? <p className="up-error">{generationError}</p> : null}

      <div className="hr-section">
        <div className="hr-section-hd">
          <span className="hr-section-pill">{lang === "ko" ? "스타일" : "STYLE"}</span>
          <span className="hr-section-hint">
            {hasTwoResults
              ? lang === "ko"
                ? "비교 완료"
                : "Comparison ready"
              : hasOneResult
                ? lang === "ko"
                  ? "추가 1개 선택"
                  : "Select 1 more"
                : lang === "ko"
                  ? "1개만 선택"
                  : "Choose 1"}
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
            const isGenerated = generatedStyleIds.has(style.id);
            return (
              <button
                className={`hr-card${isSelected ? " hr-card--sel" : ""}`}
                disabled={isGenerated}
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                style={{
                  opacity: isGenerated ? 0.5 : 1,
                  cursor: isGenerated ? "not-allowed" : "pointer",
                  backgroundImage: style.thumbnail
                    ? `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%),url(${style.thumbnail})`
                    : `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%),${style.colorHint}`,
                }}
                type="button"
              >
                {isSelected ? <span className="hr-card-check" aria-hidden>✓</span> : null}
                {isGenerated ? (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.68)",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "4px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {lang === "ko" ? "생성됨" : "Ready"}
                  </span>
                ) : null}
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
                <span className="hr-swatch-name">{lang === "ko" ? color.nameKo : color.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {resultCards.length > 0 ? (
        <div style={{ paddingBottom: 120 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #f59e0b22, #f59e0b11)",
              border: "1.5px solid #f59e0b88",
              borderRadius: 12,
              padding: "14px 16px",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", margin: 0 }}>{resultHeadline}</p>
            <p style={{ fontSize: 13, color: "#a16207", margin: "6px 0 0" }}>{resultMessage}</p>
          </div>
          <div className="ot-grid">
            {resultCards.map((result) => {
              const isPicked = pickedResultId === result.id;
              return (
                <div key={result.id} style={{ position: "relative" }}>
                  <button
                    className="ot-card"
                    onClick={() => handlePickResult(result)}
                    type="button"
                    style={{
                      width: "100%",
                      border: isPicked ? "2px solid #f59e0b" : "2px solid transparent",
                      boxShadow: isPicked ? "0 0 0 4px rgba(245, 158, 11, 0.14)" : "none",
                      transform: isPicked ? "translateY(-2px)" : "none",
                      transition: "all 180ms ease",
                    }}
                  >
                    <img
                      alt=""
                      className="ot-card-img"
                      src={result.blobUrl}
                      style={{
                        height: 320,
                        objectFit: "contain",
                        objectPosition: "center top",
                      }}
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
                          background: isPicked
                            ? "linear-gradient(135deg, #f59e0b, #ea580c)"
                            : "rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          borderRadius: 8,
                          padding: "8px 0",
                          textAlign: "center",
                          letterSpacing: 0.3,
                        }}
                      >
                        {isPicked
                          ? lang === "ko"
                            ? "선택됨"
                            : "Selected"
                          : lang === "ko"
                            ? "이 결과 선택"
                            : "Select this result"}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="hr-bottom" style={{ display: "grid", gap: 12 }}>
        {resultCards.length < MAX_HAIR_RESULTS ? (
          <button
            className={`hr-cta${canGenerate ? " hr-cta--on" : ""}${isGenerating ? " hr-cta--loading" : ""}`}
            onClick={handleGenerate}
            disabled={!canGenerate}
            type="button"
            style={
              hasOneResult
                ? {
                    background: "#fff7ed",
                    color: "#9a3412",
                    border: "1px solid #fdba74",
                  }
                : undefined
            }
          >
            {isGenerating
              ? lang === "ko"
                ? "헤어를 생성하는 중..."
                : "Generating hair..."
              : hasOneResult
                ? lang === "ko"
                  ? "추가 헤어 1개 생성"
                  : "Generate 1 more"
                : selectedStyleIds.length === 1
                  ? lang === "ko"
                    ? "헤어 생성"
                    : "Generate preview"
                  : lang === "ko"
                    ? "헤어 1개를 선택하세요"
                    : "Select 1 hairstyle"}
          </button>
        ) : null}

        {resultCards.length > 0 ? (
          <button
            className={`hr-cta${canContinue ? " hr-cta--on" : ""}`}
            disabled={!canContinue}
            onClick={handleContinue}
            type="button"
          >
            {hasTwoResults
              ? canContinue
                ? lang === "ko"
                  ? "선택한 헤어로 다음 단계"
                  : "Continue with selected hair"
                : lang === "ko"
                  ? "사진 2개 중 1개를 선택하세요"
                  : "Select 1 of the 2 results"
              : canContinue
                ? lang === "ko"
                  ? "이 헤어로 다음 단계"
                  : "Continue with this hair"
                : lang === "ko"
                  ? "결과 사진 1개를 선택하세요"
                  : "Select the result to continue"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
