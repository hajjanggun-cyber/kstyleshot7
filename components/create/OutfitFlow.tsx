"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { outfits } from "@/data/outfits";
import { useCreateStore } from "@/store/createStore";
import { normalizePhotoForAI } from "@/lib/canvas";

type Category = "stage" | "street" | "award";

const CATEGORY_KEYS: { key: Category; labelKey: "cat1" | "cat2" | "cat3" }[] = [
  { key: "stage", labelKey: "cat1" },
  { key: "street", labelKey: "cat2" },
  { key: "award", labelKey: "cat3" },
];

const COMPLETE_LOOK = [
  {
    title: "Visual Inspiration",
    sub: 'How the selected outfit styles on stage',
    color: "linear-gradient(160deg, #0a0a1a, #1a2a40, #0d2040)",
  },
  {
    title: "Street Lookbook",
    sub: "Mix & match with your current selection",
    color: "linear-gradient(160deg, #1a3a1a, #2a5a30, #1a4020)",
  },
];

export function OutfitFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const t = useTranslations("flow.outfit");

  const {
    photoBlobUrl,
    hair,
    hairPreviewUrl,
    hairPredictionId,
    setHairPreviewUrl,
    setOutfitChosen,
    setOutfitPredictionId,
    setOutfitPreviewUrl,
    pickOutfit,
    setStatus,
  } = useCreateStore();

  const [activeCategory, setActiveCategory] = useState<Category>("stage");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthPredictionId, setSynthPredictionId] = useState<string | null>(null);
  const [pendingChosenId, setPendingChosenId] = useState<string | null>(null);
  const [synthError, setSynthError] = useState(false);

  // Poll Replicate for hair preview result
  useEffect(() => {
    if (hairPreviewUrl || !hairPredictionId) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) { clearInterval(interval); return; }
      try {
        const res = await fetch(`/api/hair/poll?predictionId=${hairPredictionId}`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setHairPreviewUrl(data.outputUrl);
          clearInterval(interval);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
        }
      } catch {
        // retry next tick
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [hairPreviewUrl, hairPredictionId, setHairPreviewUrl]);

  // Poll for outfit synthesis result, navigate when done
  useEffect(() => {
    if (!synthPredictionId || !isSynthesizing || !pendingChosenId) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) {
        clearInterval(interval);
        setSynthError(true);
        setTimeout(() => navigateNext(pendingChosenId), 2000);
        return;
      }
      try {
        const res = await fetch(`/api/outfit/poll?predictionId=${synthPredictionId}`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setOutfitPreviewUrl(data.outputUrl);
          clearInterval(interval);
          navigateNext(pendingChosenId);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
          setSynthError(true);
          setTimeout(() => navigateNext(pendingChosenId), 2000);
        }
      } catch {/* retry */}
    }, 3000);

    return () => clearInterval(interval);
  }, [synthPredictionId, isSynthesizing, pendingChosenId]);

  function navigateNext(chosen: string) {
    setOutfitChosen([chosen]);
    pickOutfit(chosen);
    setStatus("location_selecting");
    router.push(`/${lang}/create/location`);
  }

  const filtered = outfits.filter((o) => o.category === activeCategory);
  const selectedOutfit = outfits.find((o) => o.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  async function handleApply() {
    if (isSynthesizing) return;
    const chosen = selectedId ?? "demo-outfit";
    setPendingChosenId(chosen);

    if (!photoBlobUrl || !selectedId) {
      navigateNext(chosen);
      return;
    }

    const selectedOutfitData = outfits.find((o) => o.id === selectedId);
    if (!selectedOutfitData) {
      navigateNext(chosen);
      return;
    }

    setIsSynthesizing(true);

    try {
      // 헤어 합성 결과가 있으면 그걸 사용, 없으면 원본 폴백
      let dataUrl: string;
      if (hairPreviewUrl) {
        const hairRes = await fetch(hairPreviewUrl);
        const hairBlob = await hairRes.blob();
        const hairBlobUrl = URL.createObjectURL(hairBlob);
        dataUrl = await normalizePhotoForAI(hairBlobUrl);
        URL.revokeObjectURL(hairBlobUrl);
      } else {
        dataUrl = await normalizePhotoForAI(photoBlobUrl);
      }

      const res = await fetch("/api/outfit/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoDataUrl: dataUrl, garmentImagePath: selectedOutfitData.garmentImage, clothType: selectedOutfitData.clothType ?? "overall" }),
      });
      const data = res.ok ? await res.json() as { predictionId?: string } : null;

      if (data?.predictionId) {
        setOutfitPredictionId(data.predictionId);
        setSynthPredictionId(data.predictionId);
        // polling useEffect will navigate when done
      } else {
        setSynthError(true);
        setTimeout(() => navigateNext(chosen), 2000);
      }
    } catch {
      setSynthError(true);
      setTimeout(() => navigateNext(chosen), 2000);
    }
  }

  if (!hair.chosen.length) {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>←</Link>
          <h2 className="ot-nav-title">{t("navTitle")}</h2>
          <div className="ot-nav-spacer" />
        </nav>
        <div className="ot-missing">
          <p>{t("noHair")}</p>
          <Link className="ot-missing-link" href={`/${lang}/create/hair`}>
            {t("goHair")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ot-root">
      {/* Full-screen synthesis overlay */}
      {isSynthesizing && (
        <div className="ot-synth-overlay">
          {synthError ? null : <div className="ot-synth-ring" />}
          <div>
            <p className="ot-synth-title">
              {synthError
                ? (lang === "ko" ? "의상 합성에 실패했어요" : "Outfit synthesis failed")
                : (lang === "ko" ? "AI가 스타일링 중이에요" : "AI is styling your look")}
            </p>
            <p className="ot-synth-sub">
              {synthError
                ? (lang === "ko" ? "원본 사진으로 계속 진행합니다…" : "Continuing with your original photo…")
                : (lang === "ko"
                    ? "합성이 완료되면 자동으로 다음 단계로 이동합니다.\n잠깐만 기다려 주세요."
                    : "We'll take you to the next step the moment your outfit is ready.\nUsually takes about a minute.")}
            </p>
          </div>
          <p className="ot-synth-badge">{synthError ? "⚠ Error" : "✦ AI Processing"}</p>
        </div>
      )}
      {/* Nav */}
      <nav className="ot-nav">
        <Link className="ot-back-btn" href={`/${lang}/create/hair`}>←</Link>
        <h2 className="ot-nav-title">{t("navTitle")}</h2>
        <div className="ot-nav-spacer" />
      </nav>

      {/* Progress dots — 3rd active */}
      <div className="ot-dots">
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--active" />
        <div className="ot-dot" />
      </div>

      {/* Before / After comparison */}
      <div className="ot-compare">
        <div className="ot-compare-card">
          {photoBlobUrl ? (
            <img className="ot-compare-img" src={photoBlobUrl} alt="Original" />
          ) : (
            <div className="ot-compare-placeholder">👤</div>
          )}
          <span className="ot-compare-label">{lang === "ko" ? "원본" : "Before"}</span>
        </div>

        <div className="ot-compare-arrow">→</div>

        <div className="ot-compare-card ot-compare-card--ai">
          {hairPreviewUrl ? (
            <img className="ot-compare-img" src={hairPreviewUrl} alt="AI Hair" />
          ) : (
            <div className="ot-compare-pending">
              <span className="ot-compare-spinner" />
              <span className="ot-compare-pending-txt">
                {lang === "ko" ? "AI 합성 중" : "AI styling"}
              </span>
            </div>
          )}
          <span className="ot-compare-label">
            {hairPreviewUrl
              ? (lang === "ko" ? "AI 헤어" : "AI Hair")
              : (lang === "ko" ? "처리 중…" : "Processing…")}
          </span>
        </div>
      </div>

      <div className="ot-compare-sub">
        <h2 className="ot-avatar-title">{t("avatarTitle")}</h2>
        <p className="ot-avatar-sub">{t("avatarSub")}</p>
      </div>

      {/* Sticky category tabs */}
      <div className="ot-tabs-wrap">
        <div className="ot-tabs">
          {CATEGORY_KEYS.map((cat) => (
            <button
              className={`ot-tab${activeCategory === cat.key ? " ot-tab--active" : ""}`}
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              type="button"
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit grid */}
      <div className="ot-grid">
        {filtered.map((outfit) => {
          const isSelected = selectedId === outfit.id;
          return (
            <button
              className={`ot-card${isSelected ? " ot-card--selected" : ""}`}
              key={outfit.id}
              onClick={() => handleSelect(outfit.id)}
              type="button"
            >
              <div
                className="ot-card-img"
                style={{
                  backgroundImage: outfit.thumbnail
                    ? `url(${outfit.thumbnail})`
                    : outfit.colorHint,
                }}
              />
              <div className="ot-card-info">
                <div className="ot-card-name-row">
                  <span className="ot-card-name">{outfit.name}</span>
                  {isSelected ? (
                    <span className="ot-card-check">✓</span>
                  ) : null}
                </div>
                <span className="ot-card-sub">{outfit.description}</span>
              </div>
              {!isSelected ? (
                <span className="ot-card-heart">♡</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Complete the Look */}
      <div className="ot-complete">
        <h3 className="ot-complete-title">
          <span className="ot-complete-star">✦</span>
          Complete the Look
        </h3>
        <div className="ot-complete-scroll">
          {COMPLETE_LOOK.map((item, i) => (
            <div className="ot-inspire-card" key={i}>
              <div
                className="ot-inspire-img"
                style={{ backgroundImage: item.color }}
              />
              <p className="ot-inspire-name">{item.title}</p>
              <p className="ot-inspire-sub">
                {i === 0 && selectedOutfit
                  ? `How the "${selectedOutfit.name}" outfit styles on stage`
                  : item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="ot-bottom">
        <button
          className="up-next-btn up-next-btn--active"
          disabled={isSynthesizing}
          onClick={handleApply}
          type="button"
        >
          {isSynthesizing ? (
            <>
              <span className="ot-compare-spinner" />
              {lang === "ko" ? "AI 합성 중…" : "AI Synthesizing…"}
            </>
          ) : t("nextBtn")}
        </button>
      </div>
    </div>
  );
}
