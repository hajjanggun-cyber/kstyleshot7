"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { hairStyles } from "@/data/hairStyles";
import { outfits } from "@/data/outfits";
import { backgrounds } from "@/data/backgrounds";
import { useCreateStore } from "@/store/createStore";

function revokeIfBlobUrl(url: string | null) {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
}

export function DoneFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const store = useCreateStore();

  const [shareNotice, setShareNotice] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [iclightAsked, setIclightAsked] = useState(false);
  const [iclightLoading, setIclightLoading] = useState(false);
  const [compositeError, setCompositeError] = useState(false);

  // Poll for flux-kontext-dev composite result
  useEffect(() => {
    const predId = store.compositePredictionId;
    if (!predId || store.compositeUrl) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) { clearInterval(interval); setCompositeError(true); return; }
      try {
        const res = await fetch(`/api/composite/poll?predictionId=${predId}`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          store.setCompositeUrl(data.outputUrl);
          clearInterval(interval);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
          setCompositeError(true);
        }
      } catch {/* retry */}
    }, 3000);

    return () => clearInterval(interval);
  }, [store.compositePredictionId, store.compositeUrl]);

  // Poll for ic-light relight result
  useEffect(() => {
    const predId = store.iclightPredictionId;
    if (!predId || store.iclightUrl) return;

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) { clearInterval(interval); setIclightLoading(false); return; }
      try {
        const res = await fetch(`/api/iclight/poll?predictionId=${predId}`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          store.setIclightUrl(data.outputUrl);
          setIclightLoading(false);
          clearInterval(interval);
        } else if (data.status === "failed" || data.status === "canceled") {
          setIclightLoading(false);
          clearInterval(interval);
        }
      } catch {/* retry */}
    }, 3000);

    return () => clearInterval(interval);
  }, [store.iclightPredictionId, store.iclightUrl]);

  async function handleApplyIcLight() {
    const bgId = store.location.picked;
    const subjectUrl = store.bgRemovedUrl;
    if (!bgId || !subjectUrl) return;

    const bg = backgrounds.find((b) => b.id === bgId);
    if (!bg) return;

    setIclightLoading(true);
    setIclightAsked(true);
    try {
      const res = await fetch("/api/iclight/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectUrl, backgroundPath: bg.fullUrl }),
      });
      if (!res.ok) {
        setIclightLoading(false);
        return;
      }
      const data = await res.json() as { predictionId?: string };
      if (data.predictionId) {
        store.setIclightPredictionId(data.predictionId);
      } else {
        setIclightLoading(false);
      }
    } catch {
      setIclightLoading(false);
    }
  }

  const hairName = hairStyles.find((h) => h.id === store.hair.chosen[0])?.name ?? store.hair.chosen[0] ?? "—";
  const outfitName = outfits.find((o) => o.id === store.outfit.picked)?.name ?? store.outfit.picked ?? "—";
  const bgName = backgrounds.find((b) => b.id === store.location.picked)?.name ?? store.location.picked ?? "—";
  const bgHint = backgrounds.find((b) => b.id === store.location.picked)?.colorHint;

  // Best available result image — ic-light > composite > fallbacks
  const resultUrl =
    store.iclightUrl ??
    store.compositeUrl ??
    store.outfitPreviewUrl ??
    store.hairPreviewUrl ??
    store.photoBlobUrl ??
    null;

  function clearAndReset() {
    revokeIfBlobUrl(store.photoBlobUrl);
    store.hair.results.forEach((r) => revokeIfBlobUrl(r.blobUrl));
    store.outfit.results.forEach((r) => revokeIfBlobUrl(r.blobUrl));
    store.location.results.forEach((r) => revokeIfBlobUrl(r.blobUrl));
    store.reset();
  }

  async function handleDownload() {
    if (!resultUrl || downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kstyleshot-result.jpg";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    const payload = {
      title: "My K-Pop Virtual Shoot",
      text: "Check out my K-Pop style transformation! #KStyleShot",
      url: typeof window !== "undefined" ? window.location.origin : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareNotice("Shared!");
        return;
      }
      await navigator.clipboard.writeText(payload.url);
      setShareNotice("Link copied!");
    } catch {
      setShareNotice("Sharing unavailable");
    }
    setTimeout(() => setShareNotice(""), 2500);
  }

  function handleTryAnother() {
    clearAndReset();
    router.push(`/${lang}/create/upload`);
  }

  return (
    <div className="dn-root">
      {/* Nav */}
      <nav className="dn-nav">
        <h2 className="dn-nav-title">Your K-Pop Shoot</h2>
        <button
          className="dn-restart-btn"
          onClick={handleTryAnother}
          type="button"
        >
          ↺ New
        </button>
      </nav>

      {/* Result image */}
      <div className="dn-result-wrap">
        <div
          className="dn-result-frame"
          style={{ backgroundImage: bgHint ?? "linear-gradient(160deg,#1a1a2e,#0d1a2e)" }}
        >
          {resultUrl ? (
            <img alt="Your K-Pop result" className="dn-result-img" src={resultUrl} />
          ) : compositeError ? (
            <div className="dn-result-ph">
              <span className="dn-result-ph-icon">⚠</span>
              <p>{lang === "ko" ? "배경 합성에 실패했어요. 배경을 다시 선택해 주세요." : "Background synthesis failed. Please go back and try again."}</p>
            </div>
          ) : store.compositePredictionId ? (
            <div className="dn-result-ph">
              <span className="ot-compare-spinner" />
              <p>{lang === "ko" ? "AI가 배경을 합성하는 중…" : "AI is blending your background…"}</p>
            </div>
          ) : (
            <div className="dn-result-ph">
              <span className="dn-result-ph-icon">✦</span>
              <p>Your composite result will appear here</p>
            </div>
          )}
          {/* Congrats overlay */}
          <div className="dn-result-badge">
            <span className="dn-result-badge-star">✦</span>
            <span className="dn-result-badge-text">Idol Ready</span>
          </div>
        </div>
      </div>

      {/* ic-light relight prompt — shown when composite is ready, not yet applied */}
      {store.compositeUrl && !store.iclightUrl && !iclightAsked && store.bgRemovedUrl && store.location.picked ? (
        <div className="dn-iclight-banner">
          <p className="dn-iclight-msg">
            {lang === "ko"
              ? "✦ 결과가 완성됐어요. AI 조명 보정을 적용하면 피부톤과 배경이 더 자연스럽게 어우러져요. 약 30초가 추가됩니다. 적용할까요?"
              : "✦ Your result is ready. Applying AI lighting correction will make your skin tone and background blend more naturally. It takes about 30 seconds. Apply?"}
          </p>
          <div className="dn-iclight-btns">
            <button
              className="dn-iclight-apply"
              onClick={handleApplyIcLight}
              type="button"
            >
              {lang === "ko" ? "보정 적용 ✦" : "Apply Enhancement ✦"}
            </button>
            <button
              className="dn-iclight-skip"
              onClick={() => setIclightAsked(true)}
              type="button"
            >
              {lang === "ko" ? "지금 이대로 저장" : "Keep as is"}
            </button>
          </div>
        </div>
      ) : null}

      {/* ic-light loading overlay */}
      {iclightLoading ? (
        <div className="ot-synth-overlay">
          <div className="ot-synth-ring" />
          <div>
            <p className="ot-synth-title">
              {lang === "ko" ? "AI 조명 보정 중이에요" : "AI is applying lighting correction"}
            </p>
            <p className="ot-synth-sub">
              {lang === "ko"
                ? "피부톤과 배경이 자연스럽게 어우러지도록 보정하고 있어요.\n잠깐만 기다려 주세요."
                : "Blending your skin tone and background naturally.\nUsually takes about 30 seconds."}
            </p>
          </div>
          <p className="ot-synth-badge">✦ AI Processing</p>
        </div>
      ) : null}

      {/* Summary chips */}
      <div className="dn-summary">
        <div className="dn-chip-row">
          <div className="dn-chip">
            <span className="dn-chip-icon">💇</span>
            <div>
              <p className="dn-chip-label">Hair</p>
              <p className="dn-chip-val">{hairName}</p>
            </div>
          </div>
          <div className="dn-chip">
            <span className="dn-chip-icon">👗</span>
            <div>
              <p className="dn-chip-label">Outfit</p>
              <p className="dn-chip-val">{outfitName}</p>
            </div>
          </div>
          <div className="dn-chip">
            <span className="dn-chip-icon">📍</span>
            <div>
              <p className="dn-chip-label">Location</p>
              <p className="dn-chip-val">{bgName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="dn-actions">
        <button
          className={`dn-btn dn-btn--download${downloading ? " dn-btn--loading" : ""}`}
          disabled={!resultUrl || downloading}
          onClick={handleDownload}
          type="button"
        >
          {downloading ? "Saving…" : "⬇ Download"}
        </button>
        <button
          className="dn-btn dn-btn--share"
          onClick={handleShare}
          type="button"
        >
          ↗ Share
        </button>
      </div>

      {shareNotice ? <p className="dn-notice">{shareNotice}</p> : null}

      {/* Hashtag row */}
      <div className="dn-hashtags">
        {["#KStyleShot", "#KpopIdol", "#VirtualShoot"].map((tag) => (
          <button
            className="dn-hashtag"
            key={tag}
            onClick={async () => {
              await navigator.clipboard.writeText(tag).catch(() => {});
              setShareNotice(`${tag} copied!`);
              setTimeout(() => setShareNotice(""), 2000);
            }}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Try again / home */}
      <div className="dn-footer-links">
        <button className="dn-link-btn" onClick={handleTryAnother} type="button">
          Try Another Style
        </button>
        <Link className="dn-link-btn" href={`/${lang}`}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
