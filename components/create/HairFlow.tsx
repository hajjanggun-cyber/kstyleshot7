"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { hairStyles } from "@/data/hairStyles";
import { hairColors } from "@/data/hairColors";
import { useCreateStore } from "@/store/createStore";

type FlowStep = "style" | "color";

export function HairFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const t = useTranslations("flow.hair");

  const { photoBlobUrl, setHairChosen, setHairColor, setStatus } = useCreateStore();

  const [step, setStep] = useState<FlowStep>("style");
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const selectedStyle = hairStyles.find((s) => s.id === selectedStyleId);
  const selectedColor = hairColors.find((c) => c.id === selectedColorId);

  function handleStyleSelect(id: string) {
    setSelectedStyleId(id);
    setStep("color");
  }

  function handleColorSelect(id: string) {
    setSelectedColorId(id);
  }

  function handleNext() {
    setHairChosen(selectedStyleId ? [selectedStyleId] : ["demo-hair"]);
    if (selectedColor) {
      setHairColor(selectedColor.replicateValue);
    }
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
        {step === "color" ? (
          <button className="hr-back-btn" type="button" onClick={() => setStep("style")}>←</button>
        ) : (
          <Link className="hr-back-btn" href={`/${lang}/create/upload`}>←</Link>
        )}
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
                {selectedStyle
                  ? `${selectedStyle.name}${selectedColor ? ` · ${lang === "ko" ? selectedColor.nameKo : selectedColor.nameEn}` : ""}`
                  : t("none")}
              </p>
            </div>
            <button className="hr-preview-magic" type="button">✦</button>
          </div>
        </div>
      </div>

      {step === "style" ? (
        /* Style grid — all 6 styles, no category tabs */
        <div className="hr-grid">
          {hairStyles.map((style) => {
            const isSelected = selectedStyleId === style.id;
            return (
              <button
                className={`hr-card${isSelected ? " hr-card--selected" : ""}`}
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
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
      ) : (
        /* Color picker */
        <div className="hr-color-section">
          <h3 className="hr-color-title">
            {lang === "ko" ? "컬러 선택" : "Choose Color"}
          </h3>
          <div className="hr-color-row">
            {hairColors.map((color) => {
              const isSelected = selectedColorId === color.id;
              return (
                <button
                  className={`hr-color-btn${isSelected ? " hr-color-btn--selected" : ""}`}
                  key={color.id}
                  onClick={() => handleColorSelect(color.id)}
                  type="button"
                >
                  <span
                    className="hr-color-swatch"
                    style={{ background: color.swatch }}
                  />
                  <span className="hr-color-label">
                    {lang === "ko" ? color.nameKo : color.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
