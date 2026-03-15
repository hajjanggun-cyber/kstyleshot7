"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingModal } from "@/components/create/LoadingModal";
import { hairStyles } from "@/data/hairStyles";
import { outfitTemplates } from "@/data/outfits";
import { referenceTemplates } from "@/data/referenceTemplates";
import { useCreateStore } from "@/store/createStore";

function revokeIfBlobUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function buildDownloadTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}`;
}

const FINAL_PROGRESS_ROTATION_MS = 9000;

const FINAL_PROGRESS_MESSAGES = {
  ko: [
    "헤어 스타일을 맞추는 중",
    "의상을 자연스럽게 입히는 중",
    "배경 장면을 불러오는 중",
    "조명과 질감을 다듬는 중",
    "전체 장면의 균형을 맞추는 중",
    "당신만의 장면을 마무리하는 중",
    "거의 다 됐어요, 조금만 더요",
  ],
  en: [
    "Fitting your hair style to the scene",
    "Styling your outfit just right",
    "Placing you into the background",
    "Refining the light and texture",
    "Balancing the whole scene together",
    "Putting the final touches on your look",
    "Almost there just a few more seconds",
  ],
} as const;

export function DoneFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const {
    finalPredictionId,
    finalImageUrl,
    setFinalImageUrl,
    setStatus,
    hairPreviewUrl,
    photoBlobUrl,
    hair,
    outfit,
    backgroundId,
    reset,
  } = useCreateStore();

  const [downloading, setDownloading] = useState(false);
  const [downloadingHairId, setDownloadingHairId] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState("");
  const [finalError, setFinalError] = useState(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);

  useEffect(() => {
    if (!finalPredictionId || finalImageUrl) {
      return;
    }

    let retries = 0;
    const interval = setInterval(async () => {
      retries += 1;
      if (retries >= 40) {
        clearInterval(interval);
        setFinalError(true);
        return;
      }

      try {
        const res = await fetch(`/api/final/poll?predictionId=${finalPredictionId}`);
        if (!res.ok) {
          return;
        }

        const data = (await res.json()) as { status: string; outputUrl?: string };
        if (data.outputUrl) {
          setFinalImageUrl(data.outputUrl);
          setStatus("completed");
          clearInterval(interval);
        } else if (data.status === "failed" || data.status === "canceled") {
          clearInterval(interval);
          setFinalError(true);
        }
      } catch {
        // retry
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [finalPredictionId, finalImageUrl, setFinalImageUrl, setStatus]);

  useEffect(() => {
    if (!finalPredictionId || finalImageUrl || finalError) {
      setProgressMessageIndex(0);
      return;
    }

    const messages = lang === "ko" ? FINAL_PROGRESS_MESSAGES.ko : FINAL_PROGRESS_MESSAGES.en;
    const interval = window.setInterval(() => {
      setProgressMessageIndex((current) => Math.min(current + 1, messages.length - 1));
    }, FINAL_PROGRESS_ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [finalError, finalImageUrl, finalPredictionId, lang]);

  const hairName =
    hairStyles.find((item) => item.id === hair.picked)?.name ?? hair.picked ?? "-";
  const selectedOutfit =
    outfitTemplates.find((item) => item.id === outfit.chosen[0]) ?? null;
  const selectedBackground =
    referenceTemplates.find((item) => item.id === backgroundId) ?? null;
  const basePreviewUrl = hairPreviewUrl ?? photoBlobUrl ?? null;
  const resultUrl = finalImageUrl ?? basePreviewUrl;
  const isFinalProcessing = Boolean(finalPredictionId) && !finalImageUrl && !finalError;
  const progressMessages = lang === "ko" ? FINAL_PROGRESS_MESSAGES.ko : FINAL_PROGRESS_MESSAGES.en;
  const activeProgressMessage = progressMessages[progressMessageIndex] ?? progressMessages[0];
  const hairDownloadItems = hair.chosen
    .map((id) => {
      const result = hair.results.find((item) => item.id === id);
      const style = hairStyles.find((item) => item.id === id);
      return result
        ? {
            id,
            name: style?.name ?? id,
            imageUrl: result.blobUrl,
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  function clearAndReset() {
    revokeIfBlobUrl(photoBlobUrl);
    hair.results.forEach((result) => revokeIfBlobUrl(result.blobUrl));
    reset();
  }

  function handleTryAnother() {
    clearAndReset();
    router.push(`/${lang}/create/upload`);
  }

  async function handleDownload() {
    if (!resultUrl || downloading) {
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kstyleshot-final-${buildDownloadTimestamp()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function handleHairDownload(id: string, imageUrl: string) {
    if (!imageUrl || downloadingHairId) {
      return;
    }

    setDownloadingHairId(id);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kstyleshot-hair-${id}-${buildDownloadTimestamp()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingHairId(null);
    }
  }

  async function handleShare() {
    const payload = {
      title: "My K-StyleShot Result",
      text: "Check out my K-style portrait.",
      url: typeof window !== "undefined" ? window.location.origin : "",
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareNotice(lang === "ko" ? "공유되었습니다." : "Shared.");
      } else {
        await navigator.clipboard.writeText(payload.url);
        setShareNotice(lang === "ko" ? "링크가 복사되었습니다." : "Link copied.");
      }
    } catch {
      setShareNotice(lang === "ko" ? "공유를 사용할 수 없습니다." : "Sharing unavailable.");
    }

    setTimeout(() => setShareNotice(""), 2500);
  }

  return (
    <div className="dn-root">
      {isFinalProcessing ? (
        <LoadingModal
          badge={lang === "ko" ? "장면 생성 중" : "Creating Your Scene"}
          backdropImageUrl={basePreviewUrl}
          description={
            lang === "ko"
              ? "헤어, 의상, 배경을 하나의 자연스러운 장면으로\n완성하는 데 약 1분~1분 30초 정도 걸려요."
              : "We're blending your hair, outfit, and background\ninto one seamless scene - this usually takes about 1 to 1.5 minutes."
          }
          progressMessage={activeProgressMessage}
          title={
            lang === "ko"
              ? "선택한 스타일로 장면을 만들고 있어요"
              : "Putting your style into the scene"
          }
        />
      ) : null}

      <nav className="dn-nav">
        <h2 className="dn-nav-title">{lang === "ko" ? "최종 결과" : "Final Result"}</h2>
        <button className="dn-restart-btn" onClick={handleTryAnother} type="button">
          {lang === "ko" ? "새로 만들기" : "New"}
        </button>
      </nav>

      <div className="dn-result-wrap">
        <div className="dn-result-frame" style={{ backgroundImage: "linear-gradient(160deg,#1a1a2e,#0d1a2e)" }}>
          {resultUrl ? (
            <img alt="Final result" className="dn-result-img" src={resultUrl} />
          ) : finalError ? (
            <div className="dn-result-ph">
              <p>{lang === "ko" ? "최종 합성에 실패했습니다. 다시 시도해 주세요." : "Final render failed. Please try again."}</p>
            </div>
          ) : (
            <div className="dn-result-ph">
              <span className="ot-compare-spinner" />
              <p>
                {lang === "ko"
                  ? "헤어는 유지한 채 의상, 배경, 분위기를 화보 한 장으로 정리하는 중..."
                  : "Keeping your hair intact while composing the outfit, backdrop, and mood into one final editorial..."}
              </p>
            </div>
          )}
          <div className="dn-result-badge">
            <span className="dn-result-badge-text">{lang === "ko" ? "Final Editorial" : "Final Editorial"}</span>
          </div>
        </div>
      </div>

      <div className="dn-summary">
        <div className="dn-chip-row">
          <div className="dn-chip">
            <div>
              <p className="dn-chip-label">Hair</p>
              <p className="dn-chip-val">{hairName}</p>
            </div>
          </div>
          <div className="dn-chip">
            <div>
              <p className="dn-chip-label">{lang === "ko" ? "의상" : "Outfit"}</p>
              <p className="dn-chip-val">{selectedOutfit?.title ?? "-"}</p>
            </div>
          </div>
          <div className="dn-chip">
            <div>
              <p className="dn-chip-label">{lang === "ko" ? "배경" : "Background"}</p>
              <p className="dn-chip-val">{selectedBackground?.title ?? "-"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dn-actions">
        <button
          className={`dn-btn dn-btn--download${downloading ? " dn-btn--loading" : ""}`}
          disabled={!resultUrl || downloading}
          onClick={handleDownload}
          type="button"
        >
          {downloading ? (lang === "ko" ? "저장 중..." : "Saving...") : lang === "ko" ? "다운로드" : "Download"}
        </button>
        <button className="dn-btn dn-btn--share" onClick={handleShare} type="button">
          {lang === "ko" ? "공유" : "Share"}
        </button>
      </div>

      {hairDownloadItems.length > 0 ? (
        <div className="dn-summary">
          <div className="lc-section-head">
            <h3 className="lc-section-title">
              {lang === "ko" ? "선택한 헤어 2개 저장" : "Save the two hair options"}
            </h3>
          </div>
          <div className="ot-grid">
            {hairDownloadItems.map((item) => (
              <div className="ot-card" key={item.id}>
                <img
                  alt=""
                  className="ot-card-img"
                  src={item.imageUrl}
                  style={{
                    height: 260,
                    objectFit: "contain",
                    objectPosition: "center top",
                  }}
                />
                <div className="ot-card-info">
                  <div className="ot-card-name-row">
                    <span className="ot-card-name">{item.name}</span>
                  </div>
                  <button
                    className={`dn-btn dn-btn--download${downloadingHairId === item.id ? " dn-btn--loading" : ""}`}
                    disabled={downloadingHairId !== null}
                    onClick={() => handleHairDownload(item.id, item.imageUrl)}
                    type="button"
                  >
                    {downloadingHairId === item.id
                      ? lang === "ko" ? "저장 중..." : "Saving..."
                      : lang === "ko" ? "헤어 저장" : "Save hair"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {shareNotice ? <p className="dn-notice">{shareNotice}</p> : null}

      <div className="dn-hashtags">
        <Link className="dn-hashtag" href={`/${lang}/create/outfit`}>
          {lang === "ko" ? "다른 스타일 선택" : "Choose another style"}
        </Link>
      </div>
    </div>
  );
}
