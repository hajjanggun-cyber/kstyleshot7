"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { outfits } from "@/data/outfits";
import { useCreateStore } from "@/store/createStore";

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
    pickOutfit,
    setStatus,
  } = useCreateStore();

  const [activeCategory, setActiveCategory] = useState<Category>("stage");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Poll Replicate for hair preview result
  useEffect(() => {
    if (hairPreviewUrl || !hairPredictionId) return;

    const interval = setInterval(async () => {
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

  const filtered = outfits.filter((o) => o.category === activeCategory);
  const selectedOutfit = outfits.find((o) => o.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  async function handleApply() {
    if (isApplying) return;
    setIsApplying(true);
    const chosen = selectedId ?? "demo-outfit";

    // Start outfit try-on in background (fire and forget)
    if (photoBlobUrl && selectedId) {
      const outfit = outfits.find((o) => o.id === selectedId);
      if (outfit) {
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = () => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(xhr.response as Blob);
            };
            xhr.onerror = reject;
            xhr.open("GET", photoBlobUrl);
            xhr.send();
          });
          const res = await fetch("/api/outfit/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photoDataUrl: dataUrl, garmentImagePath: outfit.garmentImage }),
          });
          if (res.ok) {
            const data = (await res.json()) as { predictionId?: string };
            if (data.predictionId) {
              setOutfitPredictionId(data.predictionId);
            }
          }
        } catch {
          // non-blocking — continue to next step
        }
      }
    }

    setOutfitChosen([chosen]);
    pickOutfit(chosen);
    setStatus("location_selecting");
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push(`/${lang}/create/location`);
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
          disabled={isApplying}
          onClick={handleApply}
          type="button"
        >
          {isApplying ? t("applying") : t("nextBtn")}
        </button>
      </div>
    </div>
  );
}
