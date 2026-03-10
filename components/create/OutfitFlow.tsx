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
    setOutfitPreviewUrl,
    setOutfitPredictionId,
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

  // Poll FAL.ai for outfit synthesis result
  useEffect(() => {
    if (!synthPredictionId || !isSynthesizing) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) {
        setIsSynthesizing(false);
        setSynthError(true);
        clearInterval(interval);
        return;
      }
      try {
        const res = await fetch(`/api/outfit/poll?predictionId=${synthPredictionId}`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setOutfitPreviewUrl(data.outputUrl);
          setOutfitPredictionId(synthPredictionId);
          clearInterval(interval);
          setIsSynthesizing(false);
          if (pendingChosenId) {
            navigateNext(pendingChosenId);
          }
        } else if (data.status === "failed") {
          setSynthError(true);
          setIsSynthesizing(false);
          clearInterval(interval);
        }
      } catch {
        // retry next tick
      }
    }, 3000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const chosen = selectedId ?? "demo-outfit";
    const outfit = outfits.find((o) => o.id === chosen);

    const sourceUrl = hairPreviewUrl ?? photoBlobUrl;
    if (!sourceUrl || !outfit?.garmentImage) {
      navigateNext(chosen);
      return;
    }

    setSynthError(false);
    setIsSynthesizing(true);
    setPendingChosenId(chosen);

    try {
      const photoDataUrl = await normalizePhotoForAI(sourceUrl);
      const res = await fetch("/api/outfit/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoDataUrl,
          garmentImagePath: outfit.garmentImage,
          clothType: outfit.clothType ?? "overall",
        }),
      });
      const data = await res.json() as { predictionId?: string; error?: string };
      if (!res.ok || !data.predictionId) {
        setSynthError(true);
        setIsSynthesizing(false);
        return;
      }
      setSynthPredictionId(data.predictionId);
    } catch {
      setSynthError(true);
      setIsSynthesizing(false);
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
      {/* Outfit synthesis overlay */}
      {isSynthesizing && (
        <div className="ot-synth-overlay">
          <div className="ot-synth-ring" />
          <div>
            <p className="ot-synth-title">
              {lang === "ko" ? "AI 의상 합성 중" : "AI Outfit Styling"}
            </p>
            <p className="ot-synth-sub">
              {lang === "ko"
                ? "fal-ai/fashn으로 의상을 입히는 중이에요.\n잠깐만 기다려 주세요."
                : "Applying outfit with fal-ai/fashn.\nThis usually takes about a minute."}
            </p>
          </div>
          <p className="ot-synth-badge">✦ AI Processing</p>
        </div>
      )}

      {/* Error banner */}
      {synthError && (
        <div className="ot-synth-overlay">
          <div>
            <p className="ot-synth-title">
              {lang === "ko" ? "의상 합성에 실패했어요" : "Outfit synthesis failed"}
            </p>
            <p className="ot-synth-sub">
              {lang === "ko"
                ? "다시 시도해주세요."
                : "Please try again."}
            </p>
          </div>
          <button
            className="ot-synth-badge"
            type="button"
            onClick={() => { setSynthError(false); handleApply(); }}
          >
            {lang === "ko" ? "⟳ 재시도" : "⟳ Retry"}
          </button>
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
          {isSynthesizing
            ? (lang === "ko" ? "합성 중…" : "Styling…")
            : t("nextBtn")}
        </button>
      </div>
    </div>
  );
}
