"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { DownloadButton } from "@/components/common/DownloadButton";
import { useCreateStore } from "@/store/createStore";

function revokeIfBlobUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function FinalResult() {
  const t = useTranslations("create.finalResult");
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
      title: t("sharePayloadTitle"),
      text: t("sharePayloadText"),
      url: typeof window !== "undefined" ? window.location.href : ""
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(sharePayload);
        setShareNotice(t("shareSheetOpened"));
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(sharePayload.url);
        setShareNotice(t("linkCopied"));
        return;
      }

      setShareNotice(t("sharingUnavailable"));
    } catch {
      setShareNotice(t("shareCancelled"));
    }
  }

  async function handleCopyTag() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText("#KStyleMagic");
        setShareNotice(t("hashtagCopied"));
        return;
      }
    } catch {
      setShareNotice(t("hashtagCopyFailed"));
      return;
    }

    setShareNotice(t("clipboardUnavailable"));
  }

  return (
    <section className="card stack">
      <div className="section-head">
        <h2>{t("title")}</h2>
        <span className="status-chip is-ready">{t("ready")}</span>
      </div>
      <p className="muted">{t("description")}</p>
      {finalResult ? (
        <div className="summary-grid">
          <div className="stack">
            <div className="preview-frame final-preview">
              <img alt={t("previewAlt")} src={finalResult.blobUrl} />
            </div>
            <div className="actions quick-share-row">
              <button className="quick-action" onClick={handleShare} type="button">
                {t("share")}
              </button>
              <button className="quick-action" onClick={handleCopyTag} type="button">
                {t("hashtag")}
              </button>
              <span className="quick-hint">{t("quickHint")}</span>
            </div>
          </div>
          <div className="card stack">
            <div className="meta-list">
              <div className="meta-row">
                <span className="muted">{t("meta.order")}</span>
                <strong>{store.orderId || t("meta.demoOrder")}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">{t("meta.session")}</span>
                <strong>{store.sessionToken || t("meta.demoSession")}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">{t("meta.hair")}</span>
                <strong>{store.hair.picked || "-"}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">{t("meta.outfit")}</span>
                <strong>{store.outfit.picked || "-"}</strong>
              </div>
              <div className="meta-row">
                <span className="muted">{t("meta.background")}</span>
                <strong>{store.location.picked || "-"}</strong>
              </div>
            </div>
            <div className="actions">
              <DownloadButton
                filename="final-preview.jpg"
                href={finalResult.blobUrl}
                label={t("downloadFinal")}
              />
              <button className="button secondary" onClick={handleShare} type="button">
                {t("shareWithFriends")}
              </button>
              <button className="button secondary" onClick={handleTryAnother} type="button">
                {t("tryAnother")}
              </button>
              <button className="button secondary" onClick={handleReset} type="button">
                {t("deleteLocal")}
              </button>
            </div>
            {shareNotice ? <div className="notice">{shareNotice}</div> : null}
          </div>
        </div>
      ) : (
        <div className="empty-state">{t("empty")}</div>
      )}
    </section>
  );
}
