"use client";

import { useMemo } from "react";
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

  function handleReset() {
    revokeIfBlobUrl(store.photoBlobUrl);
    store.hair.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    store.outfit.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    store.location.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    store.reset();
    router.push(`/${lang}`);
  }

  return (
    <section className="card stack">
      <h1>Final result</h1>
      <p className="muted">
        This is a local end-to-end UX preview. Replace the mock previews with real generated assets
        when the providers are wired.
      </p>
      {finalResult ? (
        <div className="summary-grid">
          <div className="preview-frame">
            <img alt="Final selected result" src={finalResult.blobUrl} />
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
              <button className="button secondary" onClick={handleReset} type="button">
                Delete local data
              </button>
            </div>
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
