"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { outfitTemplates, type OutfitCategory } from "@/data/outfits";
import { referenceTemplates, type BackgroundCategory } from "@/data/referenceTemplates";
import { useCreateStore } from "@/store/createStore";

type Step = "outfit" | "background";
type OutfitFilter = "all" | OutfitCategory;

const OUTFIT_FILTERS: { id: OutfitFilter; labelKo: string; labelEn: string }[] = [
  { id: "all", labelKo: "전체", labelEn: "All" },
  { id: "korean", labelKo: "캐주얼", labelEn: "Casual" },
  { id: "hanbok", labelKo: "한복", labelEn: "Hanbok" },
  { id: "street", labelKo: "스트릿", labelEn: "Street" },
  { id: "stage", labelKo: "포멀", labelEn: "Formal" },
];

const BG_CATEGORIES: { id: BackgroundCategory; labelKo: string; labelEn: string }[] = [
  { id: "hanbok", labelKo: "한복", labelEn: "Hanbok" },
  { id: "stage", labelKo: "무대", labelEn: "Stage" },
  { id: "street", labelKo: "스트릿", labelEn: "Street" },
  { id: "park", labelKo: "공원", labelEn: "Park" },
  { id: "seoul", labelKo: "서울", labelEn: "Seoul" },
];

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

  const [step, setStep] = useState<Step>("outfit");
  const [outfitFilter, setOutfitFilter] = useState<OutfitFilter>("all");
  const [bgCategory, setBgCategory] = useState<BackgroundCategory>("hanbok");
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sourceImageUrl = hairPreviewUrl ?? photoBlobUrl;
  const selectedOutfit = outfitTemplates.find((outfit) => outfit.id === selectedOutfitId) ?? null;

  const filteredOutfits = useMemo(() => {
    if (outfitFilter === "all") {
      return outfitTemplates;
    }

    return outfitTemplates.filter((outfit) => outfit.category === outfitFilter);
  }, [outfitFilter]);

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

  function handleSelectOutfit(id: string) {
    setSelectedOutfitId(id);
  }

  function handleMoveToBackground() {
    if (!selectedOutfitId) {
      return;
    }

    setStep("background");
  }

  async function handleSubmit() {
    if (!selectedOutfitId || !selectedBgId || submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const resolvedSourceImageUrl = sourceImageUrl as string;
      const hairPreviewDataUrl = resolvedSourceImageUrl.startsWith("blob:")
        ? await blobUrlToDataUrl(resolvedSourceImageUrl)
        : resolvedSourceImageUrl;

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
        err instanceof Error
          ? err.message
          : lang === "ko"
            ? "합성을 시작할 수 없습니다."
            : "Unable to start render."
      );
      setSubmitting(false);
    }
  }

  if (step === "outfit") {
    return (
      <div className="ot-root ot-root--selection">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>{"<-"}</Link>
          <h2 className="ot-nav-title">{lang === "ko" ? "의상 선택" : "Choose outfit"}</h2>
          <div className="ot-nav-spacer" />
        </nav>

        <div className="ot-dots">
          <div className="ot-dot ot-dot--done" />
          <div className="ot-dot ot-dot--done" />
          <div className="ot-dot ot-dot--active" />
          <div className="ot-dot" />
        </div>

        <div className="ot-compare">
          <div className="ot-compare-card ot-compare-card--ai">
            <img alt="Selected hair result" className="ot-compare-img" src={sourceImageUrl} />
            <span className="ot-compare-label">
              {lang === "ko" ? "선택한 헤어 결과" : "Selected hair result"}
            </span>
          </div>
        </div>

        <div className="ot-filter-shell">
          <div className="ot-filter-rail">
            {OUTFIT_FILTERS.map((filter) => {
              const active = outfitFilter === filter.id;
              return (
                <button
                  className={`ot-chip${active ? " ot-chip--active" : ""}`}
                  key={filter.id}
                  onClick={() => setOutfitFilter(filter.id)}
                  type="button"
                >
                  {lang === "ko" ? filter.labelKo : filter.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ot-grid ot-grid--airy">
          {filteredOutfits.map((outfit) => {
            const isSelected = selectedOutfitId === outfit.id;
            return (
              <button
                className={`ot-card ot-card--editorial${isSelected ? " ot-card--selected" : ""}`}
                key={outfit.id}
                onClick={() => handleSelectOutfit(outfit.id)}
                type="button"
              >
                <div className="ot-card-img" style={{ backgroundImage: `url(${outfit.thumbnailUrl})` }} />
                <div className="ot-card-info">
                  <div className="ot-card-name-row">
                    <span className="ot-card-name">{outfit.title}</span>
                    {isSelected ? (
                      <span className="ot-card-badge">{lang === "ko" ? "선택됨" : "Chosen"}</span>
                    ) : null}
                  </div>
                  <span className="ot-card-sub">{outfit.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedOutfit ? (
          <div className="ot-choice-panel">
            <div className="ot-choice-copy">
              <p className="ot-choice-title">
                {lang === "ko" ? "이 의상으로 할게요" : "This is the one."}
              </p>
              <p className="ot-choice-sub">
                {lang === "ko"
                  ? "선택한 의상으로 배경을 고르러 갈게요."
                  : "Let's find the perfect backdrop for this look."}
              </p>
            </div>
            <button
              className="ot-choice-cta"
              onClick={handleMoveToBackground}
              type="button"
            >
              {lang === "ko" ? "다음  배경 선택" : "Next  Choose Location"}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  const filteredBg = referenceTemplates.filter((background) => background.category === bgCategory);

  return (
    <div className="ot-root">
      <nav className="ot-nav">
        <button className="ot-back-btn" onClick={() => setStep("outfit")} type="button">{"<-"}</button>
        <h2 className="ot-nav-title">{lang === "ko" ? "배경 선택" : "Choose background"}</h2>
        <div className="ot-nav-spacer" />
      </nav>

      <div className="ot-dots">
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--active" />
      </div>

      {error ? <p className="up-error">{error}</p> : null}

      <div className="ot-filter-shell">
        <div className="ot-filter-rail">
          {BG_CATEGORIES.map((category) => (
            <button
              className={`ot-chip${bgCategory === category.id ? " ot-chip--active" : ""}`}
              key={category.id}
              onClick={() => setBgCategory(category.id)}
              type="button"
            >
              {lang === "ko" ? category.labelKo : category.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="ot-grid">
        {filteredBg.map((bg) => {
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
                  {isSelected ? <span className="ot-card-badge">{lang === "ko" ? "선택됨" : "Chosen"}</span> : null}
                </div>
                <span className="ot-card-sub">{bg.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="ot-bottom">
        <button
          className={`up-next-btn${selectedBgId && !submitting ? " up-next-btn--active" : ""}`}
          disabled={!selectedBgId || submitting}
          onClick={handleSubmit}
          type="button"
        >
          {submitting
            ? lang === "ko"
              ? "합성 시작 중..."
              : "Starting render..."
            : lang === "ko"
              ? "합성 시작"
              : "Start render"}
        </button>
      </div>
    </div>
  );
}
