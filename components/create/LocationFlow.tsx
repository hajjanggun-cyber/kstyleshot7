"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { backgrounds } from "@/data/backgrounds";
import { useCreateStore } from "@/store/createStore";

function makeFilename(prefix: string, ext = "jpg"): string {
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `kstyleshot-${prefix}-${y}${mo}${d}-${h}${mi}${s}.${ext}`;
}

async function downloadImage(proxyUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = `${proxyUrl}&filename=${encodeURIComponent(filename)}`;
  a.download = filename;
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

  const {
    photoBlobUrl,
    outfit,
    hair,
    hairPreviewUrl,
    hairPredictionId,
    setHairPreviewUrl,
    outfitPreviewUrl,
    outfitPredictionId,
    setOutfitPreviewUrl,
    bgRemovedUrl,
    bgRemovedPredictionId,
    setBgRemovedUrl,
    setBgRemovedPredictionId,
    setCompositeUrl,
    setCompositePredictionId,
    setLocationChosen,
    pickLocation,
    setStatus,
  } = useCreateStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompositing, setIsCompositing] = useState(false);
  const [compositeError, setCompositeError] = useState(false);
  const [compositeLocalPredId, setCompositeLocalPredId] = useState<string | null>(null);
  const [pendingChosenId, setPendingChosenId] = useState<string | null>(null);
  const [isDownloadingHair, setIsDownloadingHair] = useState(false);
  const [isDownloadingOutfit, setIsDownloadingOutfit] = useState(false);

  // Poll for hair result in case OutfitFlow unmounted before polling completed
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
      } catch {/* retry */ }
    }, 3000);

    return () => clearInterval(interval);
  }, [hairPreviewUrl, hairPredictionId, setHairPreviewUrl]);

  // Auto-start BG removal: outfit result → hair result (fallback when outfit synthesis bypassed)
  useEffect(() => {
    if (bgRemovedUrl || bgRemovedPredictionId) return;
    const sourceUrl = outfitPreviewUrl ?? hairPreviewUrl;
    if (!sourceUrl) return;

    fetch("/api/bgremove/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: sourceUrl }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { predictionId?: string } | null) => {
        if (data?.predictionId) setBgRemovedPredictionId(data.predictionId);
      })
      .catch(() => {/* ignore */ });
  }, [outfitPreviewUrl, hairPreviewUrl, bgRemovedUrl, bgRemovedPredictionId, setBgRemovedPredictionId]);

  // Poll for BG removal result
  useEffect(() => {
    if (bgRemovedUrl || !bgRemovedPredictionId) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) {
        clearInterval(interval);
        setBgRemovedPredictionId(null); // unblock button on timeout
        return;
      }
      try {
        const res = await fetch(`/api/bgremove/poll?predictionId=${bgRemovedPredictionId}`);
        if (!res.ok) return;
        const data = (await res.json()) as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setBgRemovedUrl(data.outputUrl);
          clearInterval(interval);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
          setBgRemovedPredictionId(null); // unblock button on failure
        }
      } catch {/* retry */ }
    }, 3000);

    return () => clearInterval(interval);
  }, [bgRemovedUrl, bgRemovedPredictionId, setBgRemovedUrl, setBgRemovedPredictionId]);

  // Poll for outfit try-on result
  useEffect(() => {
    if (outfitPreviewUrl || !outfitPredictionId) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) { clearInterval(interval); return; }
      try {
        const res = await fetch(`/api/outfit/poll?predictionId=${outfitPredictionId}`);
        if (!res.ok) return;
        const data = (await res.json()) as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setOutfitPreviewUrl(data.outputUrl);
          clearInterval(interval);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
        }
      } catch {
        // retry next tick
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [outfitPreviewUrl, outfitPredictionId, setOutfitPreviewUrl]);

  async function handleDownloadHair() {
    if (!hairPreviewUrl || isDownloadingHair) return;
    setIsDownloadingHair(true);
    try {
      await downloadImage(`/api/hair/download?url=${encodeURIComponent(hairPreviewUrl)}`, makeFilename("hair"));
    } finally {
      setIsDownloadingHair(false);
    }
  }

  async function handleDownloadOutfit() {
    if (!outfitPreviewUrl || isDownloadingOutfit) return;
    setIsDownloadingOutfit(true);
    try {
      await downloadImage(`/api/hair/download?url=${encodeURIComponent(outfitPreviewUrl)}`, makeFilename("outfit"));
    } finally {
      setIsDownloadingOutfit(false);
    }
  }

  const selectedBg = backgrounds.find((b) => b.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  // Poll for composite result, navigate when done
  useEffect(() => {
    if (!compositeLocalPredId || !isCompositing || !pendingChosenId) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) {
        clearInterval(interval);
        setCompositeError(true);
        setTimeout(() => {
          pickLocation(pendingChosenId);
          router.push(`/${lang}/create/done`);
        }, 2000);
        return;
      }
      try {
        const res = await fetch(`/api/composite/poll?predictionId=${compositeLocalPredId}`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setCompositeUrl(data.outputUrl);
          clearInterval(interval);
          pickLocation(pendingChosenId);
          router.push(`/${lang}/create/done`);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
          setCompositeError(true);
          setTimeout(() => {
            pickLocation(pendingChosenId);
            router.push(`/${lang}/create/done`);
          }, 2000);
        }
      } catch {/* retry */}
    }, 3000);

    return () => clearInterval(interval);
  }, [compositeLocalPredId, isCompositing, pendingChosenId]);

  async function handleGenerate() {
    if (isGenerating || isCompositing) return;
    const chosen = selectedId ?? "demo-location";
    const bg = backgrounds.find((b) => b.id === chosen);

    setLocationChosen([chosen]);
    setStatus("composite_completed");
    setPendingChosenId(chosen);

    if (!bgRemovedUrl || !bg?.fullUrl) {
      pickLocation(chosen);
      router.push(`/${lang}/create/done`);
      return;
    }

    setIsGenerating(true);
    setIsCompositing(true);

    try {
      const res = await fetch("/api/composite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personUrl: bgRemovedUrl, backgroundPath: bg.fullUrl }),
      });
      if (res.ok) {
        const data = await res.json() as { predictionId?: string };
        if (data.predictionId) {
          setCompositePredictionId(data.predictionId);
          setCompositeLocalPredId(data.predictionId);
          return; // polling useEffect will navigate
        }
      }
    } catch {/* fall through */}

    // API 실패 시 에러 표시 후 이동
    setCompositeError(true);
    setTimeout(() => {
      pickLocation(chosen);
      router.push(`/${lang}/create/done`);
    }, 2000);
  }


  return (
    <div className="lc-root">
      {/* Full-screen compositing overlay */}
      {isCompositing && (
        <div className="ot-synth-overlay">
          {compositeError ? null : <div className="ot-synth-ring" />}
          <div>
            <p className="ot-synth-title">
              {compositeError
                ? (lang === "ko" ? "배경 합성에 실패했어요" : "Composite failed")
                : (lang === "ko" ? "AI가 배경을 합성하는 중이에요" : "AI is compositing your background")}
            </p>
            <p className="ot-synth-sub">
              {compositeError
                ? (lang === "ko" ? "원본 사진으로 계속 진행합니다…" : "Continuing with your original photo…")
                : (lang === "ko"
                    ? "합성이 완료되면 자동으로 결과 페이지로 이동합니다.\n잠깐만 기다려 주세요."
                    : "We'll take you to the result the moment it's ready.\nUsually takes about a minute.")}
            </p>
          </div>
          <p className="ot-synth-badge">{compositeError ? "⚠ Error" : "✦ AI Processing"}</p>
        </div>
      )}
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
          {(bgRemovedUrl || hairPreviewUrl || photoBlobUrl) ? (
            <img
              alt="Your styled avatar"
              className="lc-preview-avatar"
              src={bgRemovedUrl || hairPreviewUrl || photoBlobUrl || ""}
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

        {/* ── AI Results download row ── */}
        {(hairPreviewUrl || outfitPredictionId) ? (
          <div className="lc-dl-row">
            {hairPreviewUrl ? (
              <div className="lc-dl-card">
                <img className="lc-dl-img" src={hairPreviewUrl} alt="AI hair result" />
                <div className="lc-dl-info">
                  <p className="lc-dl-kicker">
                    {lang === "ko" ? "AI 헤어 완료" : "AI Hair Result"}
                  </p>
                  <p className="lc-dl-name">
                    {hair.chosen[0]?.replace(/-/g, " ") ?? "Hair Style"}
                  </p>
                  <button
                    className={`lc-dl-btn${isDownloadingHair ? " lc-dl-btn--loading" : ""}`}
                    disabled={isDownloadingHair}
                    onClick={handleDownloadHair}
                    type="button"
                  >
                    {isDownloadingHair
                      ? (lang === "ko" ? "다운로드 중…" : "Downloading…")
                      : (lang === "ko" ? "⬇ 헤어 저장" : "⬇ Save Hair")}
                  </button>
                </div>
              </div>
            ) : null}

            {outfitPredictionId ? (
              <div className="lc-dl-card lc-dl-card--outfit">
                {outfitPreviewUrl ? (
                  <img className="lc-dl-img" src={outfitPreviewUrl} alt="AI outfit result" />
                ) : (
                  <div className="lc-dl-pending">
                    <span className="ot-compare-spinner" />
                  </div>
                )}
                <div className="lc-dl-info">
                  <p className="lc-dl-kicker">
                    {lang === "ko" ? "AI 의상 합성" : "AI Outfit Result"}
                  </p>
                  <p className="lc-dl-name">
                    {outfit.picked?.replace(/-/g, " ") ?? "Outfit"}
                  </p>
                  {outfitPreviewUrl ? (
                    <button
                      className={`lc-dl-btn${isDownloadingOutfit ? " lc-dl-btn--loading" : ""}`}
                      disabled={isDownloadingOutfit}
                      onClick={handleDownloadOutfit}
                      type="button"
                    >
                      {isDownloadingOutfit
                        ? (lang === "ko" ? "다운로드 중…" : "Downloading…")
                        : (lang === "ko" ? "⬇ 의상 저장" : "⬇ Save Outfit")}
                    </button>
                  ) : (
                    <p className="lc-dl-status">
                      {lang === "ko" ? "AI 합성 중…" : "AI processing…"}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
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
          disabled={isGenerating || isCompositing || (!bgRemovedUrl && !!bgRemovedPredictionId)}
          onClick={handleGenerate}
          type="button"
        >
          {(!bgRemovedUrl && !!bgRemovedPredictionId) ? (
            <>{lang === "ko" ? "인물 추출 중..." : "Extracting subject..."}</>
          ) : (
            <>{t("nextBtn")}</>
          )}
        </button>
      </div>
    </div>
  );
}
