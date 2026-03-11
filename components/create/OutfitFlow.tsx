"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingModal } from "@/components/create/LoadingModal";
import { referenceTemplates } from "@/data/referenceTemplates";
import { useCreateStore } from "@/store/createStore";

export function OutfitFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const {
    hair,
    hairPreviewUrl,
    setOutfitChosen,
    pickOutfit,
    setFinalPredictionId,
    setFinalImageUrl,
    setStatus,
  } = useCreateStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleGenerate() {
    if (!selectedId || !hairPreviewUrl || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setFinalImageUrl(null);

    try {
      const res = await fetch("/api/final/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseImageUrl: hairPreviewUrl,
          referenceTemplateId: selectedId,
        }),
      });

      const data = (await res.json()) as { predictionId?: string; error?: string };
      if (!res.ok || !data.predictionId) {
        throw new Error(data.error || "final_render_failed");
      }

      setOutfitChosen([selectedId]);
      pickOutfit(selectedId);
      setStatus("final_processing");
      setFinalPredictionId(data.predictionId);
      router.push(`/${lang}/create/done`);
    } catch {
      setSubmitError(
        lang === "ko" ? "최종 합성을 시작할 수 없습니다." : "Unable to start the final render."
      );
      setIsSubmitting(false);
    }
  }

  if (!hair.picked || !hairPreviewUrl) {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>
            {"<-"}
          </Link>
          <h2 className="ot-nav-title">{lang === "ko" ? "참조 이미지 선택" : "Choose a reference"}</h2>
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

  return (
    <div className="ot-root">
      {isSubmitting ? (
        <LoadingModal
          badge={lang === "ko" ? "최종 합성 시작 중" : "Final render starting"}
          backdropImageUrl={hairPreviewUrl}
          description={
            lang === "ko"
              ? "선택한 헤어는 유지한 채, 얼굴 각도와 분위기에 맞춰 장면, 조명, 구도를 정리하고 있습니다."
              : "Keeping your selected hair intact while aligning the scene, lighting, and composition to your face and mood."
          }
          title={
            lang === "ko"
              ? "선택한 스타일로 최종 이미지를 준비하는 중"
              : "Preparing your final image"
          }
        />
      ) : null}

      <nav className="ot-nav">
        <Link className="ot-back-btn" href={`/${lang}/create/hair`}>
          {"<-"}
        </Link>
        <h2 className="ot-nav-title">{lang === "ko" ? "참조 이미지 선택" : "Choose a reference"}</h2>
        <div className="ot-nav-spacer" />
      </nav>

      <div className="ot-dots">
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--active" />
        <div className="ot-dot" />
      </div>

      {submitError ? <p className="up-error">{submitError}</p> : null}

      <div className="ot-compare">
        <div className="ot-compare-card ot-compare-card--ai">
          <img alt="Selected hair result" className="ot-compare-img" src={hairPreviewUrl} />
          <span className="ot-compare-label">
            {lang === "ko" ? "선택된 헤어 결과" : "Selected hair result"}
          </span>
        </div>
      </div>

      <div className="ot-compare-sub">
        <h2 className="ot-avatar-title">
          {lang === "ko" ? "장소와 분위기가 담긴 참조 이미지를 선택하세요" : "Select a reference image"}
        </h2>
        <p className="ot-avatar-sub">
          {lang === "ko"
            ? "선택한 참조 이미지를 바탕으로, 방금 고른 헤어 결과를 유지한 채 최종 합성이 진행됩니다."
            : "The final render keeps your selected hair result while applying the chosen reference style."}
        </p>
      </div>

      <div className="ot-grid">
        {referenceTemplates.map((template) => {
          const isSelected = selectedId === template.id;
          return (
            <button
              className={`ot-card${isSelected ? " ot-card--selected" : ""}`}
              key={template.id}
              onClick={() => setSelectedId(template.id)}
              type="button"
            >
              <div className="ot-card-img" style={{ backgroundImage: `url(${template.thumbnailUrl})` }} />
              <div className="ot-card-info">
                <div className="ot-card-name-row">
                  <span className="ot-card-name">{template.title}</span>
                  {isSelected ? <span className="ot-card-check">✓</span> : null}
                </div>
                <span className="ot-card-sub">{template.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="ot-bottom">
        <button
          className="up-next-btn up-next-btn--active"
          disabled={!selectedId || isSubmitting}
          onClick={handleGenerate}
          type="button"
        >
          {isSubmitting
            ? lang === "ko"
              ? "최종 합성을 시작하는 중..."
              : "Starting final render..."
            : lang === "ko"
              ? "이 스타일로 합성하기"
              : "Create with this style"}
        </button>
      </div>
    </div>
  );
}
