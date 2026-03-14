"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { outfitTemplates } from "@/data/outfits";
import { referenceTemplates } from "@/data/referenceTemplates";
import { useCreateStore } from "@/store/createStore";

async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function OutfitFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const {
    hair,
    hairPreviewUrl,
    photoBlobUrl,
    setOutfitChosen,
    pickOutfit,
    setBackgroundId,
    setFinalPredictionId,
    setStatus,
  } = useCreateStore();

  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sourceImageUrl = hairPreviewUrl ?? photoBlobUrl;

  if (!hair.picked || !sourceImageUrl) {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>{"<-"}</Link>
          <h2 className="ot-nav-title">{lang === "ko" ? "스타일 선택" : "Choose style"}</h2>
          <div className="ot-nav-spacer" />
        </nav>
        <div className="ot-missing">
          <p>{lang === "ko" ? "먼저 헤어 결과 1개를 선택해 주세요." : "Pick one hair result first."}</p>
          <Link className="ot-missing-link" href={`/${lang}/create/hair`}>
            {lang === "ko" ? "헤어로 이동" : "Go to hair"}
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (!selectedOutfitId || !selectedBgId || submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const hairPreviewDataUrl = sourceImageUrl!.startsWith("blob:")
        ? await blobUrlToDataUrl(sourceImageUrl!)
        : sourceImageUrl!;

      const res = await fetch("/api/final/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hairPreviewDataUrl,
          outfitTemplateId: selectedOutfitId,
          backgroundTemplateId: selectedBgId,
        }),
      });

      const data = (await res.json()) as { predictionId?: string; error?: string };
      if (!res.ok || !data.predictionId) {
        throw new Error(data.error ?? "render_start_failed");
      }

      setOutfitChosen([selectedOutfitId]);
      pickOutfit(selectedOutfitId);
      setBackgroundId(selectedBgId);
      setFinalPredictionId(data.predictionId);
      setStatus("final_processing");
      router.push(`/${lang}/create/done`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message :
          lang === "ko" ? "합성을 시작할 수 없습니다." : "Unable to start render."
      );
      setSubmitting(false);
    }
  }

  const canSubmit = Boolean(selectedOutfitId && selectedBgId && !submitting);

  return (
    <div className="ot-root">
      <nav className="ot-nav">
        <Link className="ot-back-btn" href={`/${lang}/create/hair`}>{"<-"}</Link>
        <h2 className="ot-nav-title">{lang === "ko" ? "스타일 선택" : "Choose style"}</h2>
        <div className="ot-nav-spacer" />
      </nav>

      <div className="ot-dots">
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--active" />
        <div className="ot-dot" />
      </div>

      {error ? <p className="up-error">{error}</p> : null}

      {/* 헤어 미리보기 */}
      <div className="ot-compare">
        <div className="ot-compare-card ot-compare-card--ai">
          <img alt="Selected hair result" className="ot-compare-img" src={sourceImageUrl} />
          <span className="ot-compare-label">
            {lang === "ko" ? "선택된 헤어 결과" : "Selected hair result"}
          </span>
        </div>
      </div>

      {/* 의상 선택 */}
      <div className="ot-compare-sub">
        <h2 className="ot-avatar-title">
          {lang === "ko" ? "1. 의상을 선택하세요" : "1. Select an outfit"}
        </h2>
      </div>

      {outfitTemplates.length === 0 ? (
        <div className="ot-missing" style={{ margin: "0 16px 24px" }}>
          <p style={{ fontSize: 14, color: "#888" }}>
            {lang === "ko" ? "의상 이미지 준비 중입니다." : "Outfit images coming soon."}
          </p>
        </div>
      ) : (
        <div className="ot-grid">
          {outfitTemplates.map((outfit) => {
            const isSelected = selectedOutfitId === outfit.id;
            return (
              <button
                className={`ot-card${isSelected ? " ot-card--selected" : ""}`}
                key={outfit.id}
                onClick={() => setSelectedOutfitId(outfit.id)}
                type="button"
              >
                <div className="ot-card-img" style={{ backgroundImage: `url(${outfit.thumbnailUrl})` }} />
                <div className="ot-card-info">
                  <div className="ot-card-name-row">
                    <span className="ot-card-name">{outfit.title}</span>
                    {isSelected ? <span className="ot-card-check">✓</span> : null}
                  </div>
                  <span className="ot-card-sub">{outfit.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 배경 선택 */}
      <div className="ot-compare-sub">
        <h2 className="ot-avatar-title">
          {lang === "ko" ? "2. 배경을 선택하세요" : "2. Select a background"}
        </h2>
      </div>

      <div className="ot-grid">
        {referenceTemplates.map((bg) => {
          const isSelected = selectedBgId === bg.id;
          return (
            <button
              className={`ot-card${isSelected ? " ot-card--selected" : ""}`}
              key={bg.id}
              onClick={() => setSelectedBgId(bg.id)}
              type="button"
            >
              <div className="ot-card-img" style={{ backgroundImage: `url(${bg.thumbnailUrl})` }} />
              <div className="ot-card-info">
                <div className="ot-card-name-row">
                  <span className="ot-card-name">{bg.title}</span>
                  {isSelected ? <span className="ot-card-check">✓</span> : null}
                </div>
                <span className="ot-card-sub">{bg.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="ot-bottom">
        <button
          className={`up-next-btn${canSubmit ? " up-next-btn--active" : ""}`}
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          {submitting
            ? lang === "ko" ? "합성 시작 중..." : "Starting render..."
            : lang === "ko" ? "합성 시작" : "Start render"}
        </button>
      </div>
    </div>
  );
}
