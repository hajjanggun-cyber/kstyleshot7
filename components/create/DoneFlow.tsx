"use client";

import { useState } from "react";
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

  const hairName = hairStyles.find((h) => h.id === store.hair.chosen[0])?.name ?? store.hair.chosen[0] ?? "—";
  const outfitName = outfits.find((o) => o.id === store.outfit.picked)?.name ?? store.outfit.picked ?? "—";
  const bgName = backgrounds.find((b) => b.id === store.location.picked)?.name ?? store.location.picked ?? "—";
  const bgHint = backgrounds.find((b) => b.id === store.location.picked)?.colorHint;

  // Best available result image — composite first, then fallbacks
  const resultUrl =
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
