"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { DownloadButton } from "@/components/common/DownloadButton";
import { useCreateStore } from "@/store/createStore";

function revokeIfBlobUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function FinalResult() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const store = useCreateStore();
  const [shareNotice, setShareNotice] = useState("");
  const lang = params.lang ?? "en";

  const finalResult = useMemo(() => {
    const selectedLocation =
      store.location.results.find((result) => result.id === store.location.picked) ??
      store.location.results[0];
    if (selectedLocation) {
      return selectedLocation;
    }

    const selectedOutfit =
      store.outfit.results.find((result) => result.id === store.outfit.picked) ??
      store.outfit.results[0];
    if (selectedOutfit) {
      return selectedOutfit;
    }

    return (
      store.hair.results.find((result) => result.id === store.hair.picked) ??
      store.hair.results[0] ??
      null
    );
  }, [
    store.hair.picked,
    store.hair.results,
    store.location.picked,
    store.location.results,
    store.outfit.picked,
    store.outfit.results
  ]);

  function clearLocalState() {
    revokeIfBlobUrl(store.photoBlobUrl);
    store.hair.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    store.outfit.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    store.location.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    store.reset();
  }

  function handleReset() {
    clearLocalState();
    router.push(`/${lang}`);
  }

  function handleTryAnother() {
    clearLocalState();
    router.push(`/${lang}/create`);
  }

  async function handleShare() {
    const sharePayload = {
      title: "K-StyleMagic result",
      text: "I just completed my K-style transformation.",
      url: typeof window !== "undefined" ? window.location.href : ""
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(sharePayload);
        setShareNotice("Share sheet opened.");
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(sharePayload.url);
        setShareNotice("Result link copied to clipboard.");
        return;
      }

      setShareNotice("Sharing is not available in this browser.");
    } catch {
      setShareNotice("Share action was cancelled or blocked.");
    }
  }

  async function handleCopyTag() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText("#KStyleMagic");
        setShareNotice("Hashtag copied: #KStyleMagic");
        return;
      }
    } catch {
      setShareNotice("Unable to copy hashtag.");
      return;
    }

    setShareNotice("Clipboard is unavailable in this browser.");
  }

  return (
    <section className="card stack">
      <div className="section-head">
        <h2>Final result</h2>
        <span className="status-chip is-ready">Ready</span>
      </div>
      <p className="muted">
        Review your selected result, download it, then clear local data before starting another run.
      </p>
      {finalResult ? (
        <div className="summary-grid">
          <div className="stack">
            <div className="preview-frame final-preview">
              <img alt="Final selected result" src={finalResult.blobUrl} />
            </div>
            <div className="actions quick-share-row">
              <button className="quick-action" onClick={handleShare} type="button">
                Share
              </button>
              <button className="quick-action" onClick={handleCopyTag} type="button">
                Hashtag
              </button>
              <span className="quick-hint">Tag your post with #KStyleMagic</span>
            </div>
          </div>
          <div className="card stack">
            <div className="meta-list">
              <div className="meta-row">
                <span className="muted">Order</span>
                <strong>{store.orderId || "demo-order"}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">Session</span>
                <strong>{store.sessionToken || "demo-session"}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">Hair</span>
                <strong>{store.hair.picked || "-"}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">Outfit</span>
                <strong>{store.outfit.picked || "-"}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">Background</span>
                <strong>{store.location.picked || "-"}</strong>
              </div>
            </div>
            <div className="actions">
              <DownloadButton
                filename="final-preview.jpg"
                href={finalResult.blobUrl}
                label="Download final"
              />
              <button className="button secondary" onClick={handleShare} type="button">
                Share with friends
              </button>
              <button className="button secondary" onClick={handleTryAnother} type="button">
                Try another style
              </button>
              <button className="button secondary" onClick={handleReset} type="button">
                Delete local data
              </button>
            </div>
            {shareNotice ? <div className="notice">{shareNotice}</div> : null}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          No final preview is available yet. Complete the flow before visiting this page.
        </div>
      )}
    </section>
  );
}
