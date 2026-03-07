"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { hairStyles } from "@/data/hairStyles";
import { hairColors } from "@/data/hairColors";
import { useCreateStore } from "@/store/createStore";

async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function HairFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const t = useTranslations("flow.hair");

  const { photoBlobUrl, setHairChosen, setHairColor, setHairPreviewUrl, setStatus } = useCreateStore();

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedStyle = hairStyles.find((s) => s.id === selectedStyleId);
  const selectedColor = hairColors.find((c) => c.id === selectedColorId);
  const colorLabel = selectedColor
    ? lang === "ko" ? selectedColor.nameKo : selectedColor.nameEn
    : null;

  async function handleNext() {
    if (isLoading) return;
    setIsLoading(true);

    const styleId = selectedStyleId ?? "demo-hair";
    setHairChosen([styleId]);
    if (selectedColor) setHairColor(selectedColor.replicateValue);
    setStatus("outfit_selecting");

    // Call Replicate hair preview API if we have a photo and a real style
    if (photoBlobUrl && selectedStyle) {
      try {
        const photoDataUrl = await blobUrlToDataUrl(photoBlobUrl);
        const res = await fetch("/api/hair/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photoDataUrl,
            haircutName: selectedStyle.name,
            hairColor: selectedColor?.replicateValue ?? "Random",
          }),
        });
        if (res.ok) {
          const data = await res.json() as { outputUrl?: string };
          if (data.outputUrl) setHairPreviewUrl(data.outputUrl);
        }
      } catch {
        // non-fatal — outfit page will just show original
      }
    }

    router.push(`/${lang}/create/outfit`);
  }

  if (!photoBlobUrl) {
    return (
      <div className="hr-root">
        <nav className="hr-nav">
          <Link className="hr-back-btn" href={`/${lang}/create/upload`}>←</Link>
          <span className="hr-nav-title">{t("navTitle")}</span>
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

      {/* ── Nav ── */}
      <nav className="hr-nav">
        <Link className="hr-back-btn" href={`/${lang}/create/upload`}>←</Link>
        <span className="hr-step-tag">STEP 2 / 4</span>
        <div className="hr-nav-right" />
      </nav>

      {/* ── Compact photo strip ── */}
      <div className="hr-strip">
        <img className="hr-strip-img" src={photoBlobUrl} alt="" />
        <div className="hr-strip-meta">
          <p className="hr-strip-kicker">{lang === "ko" ? "내 사진" : "MY PHOTO"}</p>
          <p className="hr-strip-val">
            {selectedStyle ? selectedStyle.name : "—"}
            {colorLabel ? (
              <span className="hr-strip-color-dot"> · {colorLabel}</span>
            ) : null}
          </p>
        </div>
        <div className="hr-strip-ai-badge">AI</div>
      </div>

      {/* ── Style section ── */}
      <div className="hr-section">
        <div className="hr-section-hd">
          <span className="hr-section-pill">{lang === "ko" ? "스타일" : "STYLE"}</span>
          <span className="hr-section-hint">
            {lang === "ko" ? "원하는 헤어를 선택하세요" : "Pick a look"}
          </span>
        </div>
        <div className="hr-grid">
          {hairStyles.map((style) => {
            const sel = selectedStyleId === style.id;
            return (
              <button
                className={`hr-card${sel ? " hr-card--sel" : ""}`}
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                style={{
                  backgroundImage: style.thumbnail
                    ? `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%),url(${style.thumbnail})`
                    : `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%),${style.colorHint}`,
                }}
                type="button"
              >
                {sel && (
                  <span className="hr-card-check" aria-hidden>✓</span>
                )}
                <span className="hr-card-name">{style.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Color section ── */}
      <div className="hr-section hr-section--color">
        <div className="hr-section-hd">
          <span className="hr-section-pill">{lang === "ko" ? "컬러" : "COLOR"}</span>
          <span className="hr-section-hint">
            {lang === "ko" ? "선택 안 하면 AI가 결정" : "Skip to let AI decide"}
          </span>
        </div>
        <div className="hr-color-rail">
          {hairColors.map((color) => {
            const sel = selectedColorId === color.id;
            return (
              <button
                className={`hr-swatch-btn${sel ? " hr-swatch-btn--sel" : ""}`}
                key={color.id}
                onClick={() =>
                  setSelectedColorId(sel ? null : color.id)
                }
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

      {/* ── Bottom CTA ── */}
      <div className="hr-bottom">
        <button
          className={`hr-cta${selectedStyleId && !isLoading ? " hr-cta--on" : ""}${isLoading ? " hr-cta--loading" : ""}`}
          onClick={handleNext}
          disabled={isLoading}
          type="button"
        >
          {isLoading
            ? lang === "ko" ? "AI 처리 중…" : "AI Processing…"
            : selectedStyleId
              ? lang === "ko" ? "다음 단계 →" : "Next Step →"
              : lang === "ko" ? "스타일을 선택하세요" : "Select a style first"}
        </button>
      </div>

    </div>
  );
}
