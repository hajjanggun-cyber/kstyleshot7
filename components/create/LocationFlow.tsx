"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { backgrounds } from "@/data/backgrounds";
import { useCreateStore } from "@/store/createStore";

async function downloadImage(proxyUrl: string) {
  const a = document.createElement("a");
  a.href = proxyUrl;
  a.download = "kstyleshot-hair.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const SAMPLE_SHOOTS = [
  { color: "linear-gradient(160deg, #1a2a40, #2a3a60, #1a2030)" },
  { color: "linear-gradient(160deg, #2a1a30, #4a2a50, #2a1a40)" },
  { color: "linear-gradient(160deg, #3a2010, #5a3820, #3a2818)" },
  { color: "linear-gradient(160deg, #1a3010, #2a4820, #1a3018)" },
];

export function LocationFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const t = useTranslations("flow.location");

  const { photoBlobUrl, outfit, hair, hairPreviewUrl, setLocationChosen, pickLocation, setStatus } =
    useCreateStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (!hairPreviewUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadImage(`/api/hair/download?url=${encodeURIComponent(hairPreviewUrl)}`);
    } finally {
      setIsDownloading(false);
    }
  }

  const selectedBg = backgrounds.find((b) => b.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  async function handleGenerate() {
    if (isGenerating) return;
    // TODO: restore — if (!selectedId || isGenerating) return;
    setIsGenerating(true);
    const chosen = selectedId ?? "demo-location";
    setLocationChosen([chosen]);
    setStatus("composite_completed");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    pickLocation(chosen);
    router.push(`/${lang}/create/done`);
  }

  if (!outfit.picked) {
    return (
      <div className="lc-root">
        <nav className="lc-nav">
          <Link className="lc-back-btn" href={`/${lang}/create/outfit`}>←</Link>
          <h2 className="lc-nav-title">{t("navTitle")}</h2>
          <div className="lc-nav-spacer" />
        </nav>
        <div className="lc-missing">
          <p>{t("noOutfit")}</p>
          <Link className="lc-missing-link" href={`/${lang}/create/outfit`}>
            {t("goOutfit")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lc-root">
      {/* Nav */}
      <nav className="lc-nav">
        <Link className="lc-back-btn" href={`/${lang}/create/outfit`}>←</Link>
        <h2 className="lc-nav-title">{t("navTitle")}</h2>
        <button className="lc-help-btn" type="button">?</button>
      </nav>

      {/* Progress — 4th of 5 active */}
      <div className="lc-dots">
        <div className="lc-dot lc-dot--done" />
        <div className="lc-dot lc-dot--done" />
        <div className="lc-dot lc-dot--done" />
        <div className="lc-dot lc-dot--active" />
        <div className="lc-dot" />
      </div>

      <main className="lc-main">
        {/* Large preview */}
        <div className="lc-preview">
          {/* Background layer */}
          <div
            className="lc-preview-bg"
            style={{
              backgroundImage: selectedBg?.colorHint ?? "linear-gradient(160deg,#1a1a2e,#0d1a2e)",
            }}
          />
          {/* Gradient fade */}
          <div className="lc-preview-fade" />
          {/* Avatar */}
          {photoBlobUrl ? (
            <img
              alt="Your styled avatar"
              className="lc-preview-avatar"
              src={photoBlobUrl}
            />
          ) : (
            <div className="lc-preview-avatar-ph">✦</div>
          )}
          {/* HUD */}
          <div className="lc-preview-hud">
            <div className="lc-hud-tag">
              <p className="lc-hud-label">{t("currentConcept")}</p>
              <p className="lc-hud-name">
                {selectedBg ? selectedBg.name : t("selectPrompt")}
              </p>
            </div>
            <button className="lc-hud-cam" type="button">📷</button>
          </div>
        </div>

        {/* ── Hair result download ── */}
        {hairPreviewUrl ? (
          <div className="lc-dl-card">
            <img className="lc-dl-img" src={hairPreviewUrl} alt="AI hair result" />
            <div className="lc-dl-info">
              <p className="lc-dl-kicker">
                {lang === "ko" ? "AI 헤어 합성 완료" : "AI Hair Result"}
              </p>
              <p className="lc-dl-name">
                {hair.chosen[0]?.replace(/-/g, " ") ?? "Hair Style"}
              </p>
              <button
                className={`lc-dl-btn${isDownloading ? " lc-dl-btn--loading" : ""}`}
                disabled={isDownloading}
                onClick={handleDownload}
                type="button"
              >
                {isDownloading
                  ? (lang === "ko" ? "다운로드 중…" : "Downloading…")
                  : (lang === "ko" ? "⬇ 사진 저장" : "⬇ Save Photo")}
              </button>
            </div>
          </div>
        ) : null}

        {/* Location picker */}
        <div className="lc-section">
          <div className="lc-section-head">
            <h3 className="lc-section-title">{t("pickTitle")}</h3>
            <span className="lc-count-badge">{backgrounds.length} OPTIONS</span>
          </div>
          <div className="lc-loc-grid">
            {backgrounds.map((bg) => {
              const isSelected = selectedId === bg.id;
              return (
                <button
                  className={`lc-loc-card${isSelected ? " lc-loc-card--selected" : ""}`}
                  key={bg.id}
                  onClick={() => handleSelect(bg.id)}
                  type="button"
                >
                  <div
                    className="lc-loc-bg"
                    style={{
                      backgroundImage: bg.thumbUrl
                        ? `url(${bg.thumbUrl})`
                        : bg.colorHint,
                    }}
                  />
                  <div className="lc-loc-fade" />
                  <p className="lc-loc-name">{bg.label ?? bg.name}</p>
                  {isSelected ? (
                    <span className="lc-loc-check">✓</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selections summary */}
        {(hair.chosen[0] || outfit.picked) ? (
          <div className="lc-summary">
            <h3 className="lc-summary-title">
              <span className="lc-summary-star">✦</span>
              {t("summaryTitle")}
            </h3>
            <div className="lc-summary-chips">
              {hair.chosen[0] ? (
                <span className="lc-chip">💇 {hair.chosen[0].replace(/-/g, " ")}</span>
              ) : null}
              {outfit.picked ? (
                <span className="lc-chip">👗 {outfit.picked.replace(/-/g, " ")}</span>
              ) : null}
              {selectedId ? (
                <span className="lc-chip lc-chip--loc">📍 {selectedBg?.name}</span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Successful Shoots */}
        <div className="lc-shoots">
          <div className="lc-shoots-head">
            <span className="lc-shoots-star">✦</span>
            <h3 className="lc-shoots-title">{t("shootsTitle")}</h3>
          </div>
          <div className="lc-shoots-scroll">
            {SAMPLE_SHOOTS.map((s, i) => (
              <div
                className="lc-shoot-card"
                key={i}
                style={{ backgroundImage: s.color }}
              >
                <span className="lc-shoot-label">Sample Result {i + 1}</span>
              </div>
            ))}
            <div className="lc-shoot-card lc-shoot-card--add">
              <span className="lc-shoot-plus">＋</span>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed bottom */}
      <div className="lc-bottom">
        <button
          className="up-next-btn up-next-btn--active"
          disabled={isGenerating}
          onClick={handleGenerate}
          type="button"
        >
          {isGenerating ? (
            <>
              <span className="lc-gen-spinner" />
              {t("generating")}
            </>
          ) : (
            <>{t("nextBtn")}</>
          )}
        </button>
      </div>
    </div>
  );
}
