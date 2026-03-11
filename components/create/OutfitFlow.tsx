"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
    setCompositePredictionId,
    setCompositeUrl,
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
    setCompositeUrl(null);

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
      setStatus("composite_completed");
      setCompositePredictionId(data.predictionId);
      router.push(`/${lang}/create/done`);
    } catch {
      setSubmitError(lang === "ko" ? "최종 합성 시작에 실패했습니다." : "Unable to start the final render.");
      setIsSubmitting(false);
    }
  }

  if (!hair.picked || !hairPreviewUrl) {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>←</Link>
          <h2 className="ot-nav-title">{lang === "ko" ? "참조 이미지 선택" : "Choose a reference"}</h2>
          <div className="ot-nav-spacer" />
        </nav>
        <div className="ot-missing">
          <p>{lang === "ko" ? "먼저 헤어 결과 1장을 선택해 주세요." : "Pick one hair result first."}</p>
          <Link className="ot-missing-link" href={`/${lang}/create/hair`}>
            {lang === "ko" ? "헤어로 이동" : "Go to hair"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ot-root">
      <nav className="ot-nav">
        <Link className="ot-back-btn" href={`/${lang}/create/hair`}>←</Link>
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
          <img className="ot-compare-img" src={hairPreviewUrl} alt="Selected hair result" />
          <span className="ot-compare-label">
            {lang === "ko" ? "선택한 헤어 베이스" : "Selected hair base"}
          </span>
        </div>
      </div>

      <div className="ot-compare-sub">
        <h2 className="ot-avatar-title">
          {lang === "ko" ? "장소와 포즈가 포함된 참조 이미지를 선택하세요" : "Select a reference image"}
        </h2>
        <p className="ot-avatar-sub">
          {lang === "ko"
            ? "선택한 카드에 연결된 프롬프트가 실행되고, 헤어 합성 결과는 그대로 유지됩니다."
            : "The linked prompt will run while keeping the hair result as the base image."}
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
              <div
                className="ot-card-img"
                style={{ backgroundImage: `url(${template.thumbnailUrl})` }}
              />
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
            ? lang === "ko" ? "최종 합성 시작 중..." : "Starting final render..."
            : lang === "ko" ? "이 스타일로 완성하기" : "Create with this style"}
        </button>
      </div>
    </div>
  );
}
