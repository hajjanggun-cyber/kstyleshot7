"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { hairStyles } from "@/data/hairStyles";
import { useCreateStore } from "@/store/createStore";

type Category = "trendy" | "bangs" | "waves";

const CATEGORY_KEYS: { key: Category; labelKey: "cat1" | "cat2" | "cat3" }[] = [
  { key: "trendy", labelKey: "cat1" },
  { key: "bangs", labelKey: "cat2" },
  { key: "waves", labelKey: "cat3" },
];

const POPULAR_COMBOS = [
  {
    label: "Cold Silver + Sharp Face",
    color: "linear-gradient(160deg, #bdc3c7, #95a5a6, #d7dee3)",
  },
  {
    label: "Peach Bloom + Round Face",
    color: "linear-gradient(160deg, #f8b4d9, #ffc0cb, #ffb3ba)",
  },
  {
    label: "Midnight Bangs + Oval Face",
    color: "linear-gradient(160deg, #1a1a2e, #16213e, #0f3460)",
  },
];

export function HairFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const t = useTranslations("flow.hair");

  const { photoBlobUrl, setHairChosen, setStatus } = useCreateStore();

  const [activeCategory, setActiveCategory] = useState<Category>("trendy");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = hairStyles.filter((s) => s.category === activeCategory);
  const selectedStyle = hairStyles.find((s) => s.id === selectedId);

  function handleSelect(id: string) {
    const next = id === selectedId ? null : id;
    setSelectedId(next);
    if (next) {
      setHairChosen([next]);
      setStatus("outfit_selecting");
      router.push(`/${lang}/create/outfit`);
    }
  }

  function handleNext() {
    // TODO: restore — if (!selectedId) return;
    setHairChosen(selectedId ? [selectedId] : ["demo-hair"]);
    setStatus("outfit_selecting");
    router.push(`/${lang}/create/outfit`);
  }

  if (!photoBlobUrl) {
    return (
      <div className="hr-root">
        <nav className="hr-nav">
          <Link className="hr-back-btn" href={`/${lang}/create/upload`}>←</Link>
          <h2 className="hr-nav-title">{t("navTitle")}</h2>
          <div className="hr-nav-right" />
        </nav>
        <div className="hr-missing">
          <p>{t("noPhoto")}</p>
          <Link className="hr-missing-link" href={`/${lang}/create/upload`}>
            {t("goUpload")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-root">
      {/* Nav */}
      <nav className="hr-nav">
        <Link className="hr-back-btn" href={`/${lang}/create/upload`}>←</Link>
        <h2 className="hr-nav-title">{t("navTitle")}</h2>
        <div className="hr-nav-right">
          <button className="hr-help-btn" type="button">?</button>
        </div>
      </nav>

      {/* Progress dots — 2nd active */}
      <div className="hr-dots">
        <div className="hr-dot hr-dot--done" />
        <div className="hr-dot hr-dot--active" />
        <div className="hr-dot" />
        <div className="hr-dot" />
      </div>

      {/* Preview */}
      <div className="hr-preview-wrap">
        <div className="hr-preview">
          <img
            alt="Your photo"
            className="hr-preview-img"
            src={photoBlobUrl}
          />
          <div className="hr-preview-fade" />
          <div className="hr-preview-info">
            <div className="hr-preview-tag">
              <p className="hr-preview-label">{t("currentSelection")}</p>
              <p className="hr-preview-name">
                {selectedStyle ? selectedStyle.name : t("none")}
              </p>
            </div>
            <button className="hr-preview-magic" type="button">✦</button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="hr-tabs-wrap">
        <div className="hr-tabs">
          {CATEGORY_KEYS.map((cat) => (
            <button
              className={`hr-tab${activeCategory === cat.key ? " hr-tab--active" : ""}`}
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              type="button"
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Style grid */}
      <div className="hr-grid">
        {filtered.map((style) => {
          const isSelected = selectedId === style.id;
          return (
            <button
              className={`hr-card${isSelected ? " hr-card--selected" : ""}`}
              key={style.id}
              onClick={() => handleSelect(style.id)}
              style={{
                backgroundImage: style.thumbnail
                  ? `linear-gradient(0deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,0) 55%),url(${style.thumbnail})`
                  : `linear-gradient(0deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,0) 55%),${style.colorHint ?? "#2a1a10"}`,
              }}
              type="button"
            >
              {isSelected ? <span className="hr-card-check">✓</span> : null}
              <span className="hr-card-name">{style.name}</span>
            </button>
          );
        })}
      </div>

      {/* Popular combos */}
      <div className="hr-combos">
        <h3 className="hr-combos-title">
          <span className="hr-combos-star">✦</span>
          {t("popularTitle")}
        </h3>
        <div className="hr-combos-scroll">
          {POPULAR_COMBOS.map((combo, i) => (
            <div className="hr-combo-card" key={i}>
              <div
                className="hr-combo-img"
                style={{ backgroundImage: combo.color }}
              />
              <p className="hr-combo-label">{combo.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="hr-bottom">
        <button
          className="up-next-btn up-next-btn--active"
          onClick={handleNext}
          type="button"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}
