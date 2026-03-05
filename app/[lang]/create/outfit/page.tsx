"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { CreateShell } from "@/components/create/CreateShell";
import { ResultGrid } from "@/components/create/ResultGrid";
import { StyleSelector } from "@/components/create/StyleSelector";
import { outfits } from "@/data/outfits";
import { createMockStepResults } from "@/lib/mockResults";
import { useCreateStore } from "@/store/createStore";

export default function OutfitPage() {
  const t = useTranslations("create.outfit");
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const { hair, outfit, setOutfitChosen, setOutfitResults, pickOutfit, setStatus } =
    useCreateStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreparingCutout, setIsPreparingCutout] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const itemLookup = useMemo(
    () =>
      Object.fromEntries(
        outfits.map((item) => [item.id, { name: item.name, detail: item.description }])
      ),
    []
  );

  function toggleSelection(id: string) {
    if (outfit.chosen.includes(id)) {
      setOutfitChosen(outfit.chosen.filter((currentId) => currentId !== id));
      setSelectedResultId(null);
      return;
    }

    if (outfit.chosen.length >= 2) {
      return;
    }

    setOutfitChosen([...outfit.chosen, id]);
    setSelectedResultId(null);
  }

  async function handleGenerate() {
    if (!hair.picked || outfit.chosen.length !== 2 || isGenerating) {
      return;
    }

    setStatus("outfit_processing");
    setIsGenerating(true);
    setSelectedResultId(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOutfitResults(createMockStepResults("outfit", outfit.chosen, itemLookup));
    setIsGenerating(false);
  }

  async function handleContinue() {
    if (!selectedResultId || isPreparingCutout) {
      return;
    }

    pickOutfit(selectedResultId);
    setIsPreparingCutout(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("location_selecting");
    router.push(`/${lang}/create/location`);
  }

  if (!hair.picked) {
    return (
      <CreateShell
        current="outfit"
        description={t("missingHairDescription")}
        title={t("shellTitle")}
      >
        <section className="card stack">
          <h2>{t("missingHairTitle")}</h2>
          <p className="muted">{t("missingHairBody")}</p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/hair`}>
              {t("goHair")}
            </Link>
          </div>
        </section>
      </CreateShell>
    );
  }

  return (
    <CreateShell
      current="outfit"
      description={t("shellDescription")}
      title={t("shellTitle")}
    >
      <section className="card stack mock-panel">
        <div className="section-head">
          <h2>{t("mockTitle")}</h2>
          <span className="mock-chip">{t("mockBadge")}</span>
        </div>
        <p className="muted">{t("mockDescription")}</p>
      </section>
      <StyleSelector
        ctaDisabled={outfit.chosen.length !== 2 || isGenerating}
        ctaLabel={isGenerating ? t("generating") : t("generate")}
        title={t("selectorTitle")}
        description={t("selectorDescription")}
        items={outfits.map((item) => ({
          id: item.id,
          name: item.name,
          detail: item.description,
          thumbnail: item.thumbnail,
          tags: item.tags
        }))}
        onSubmit={handleGenerate}
        onToggle={toggleSelection}
        selectedIds={outfit.chosen}
      />
      {isGenerating ? (
        <section className="card stack">
          <h2>{t("processingTitle")}</h2>
          <p className="muted">{t("processingDescription")}</p>
        </section>
      ) : null}
      {isPreparingCutout ? (
        <section className="card stack">
          <h2>{t("cutoutTitle")}</h2>
          <p className="muted">{t("cutoutDescription")}</p>
        </section>
      ) : null}
      <ResultGrid
        description={t("resultDescription")}
        emptyMessage={t("resultEmpty")}
        onSelect={setSelectedResultId}
        results={outfit.results.map((result) => ({
          id: result.id,
          name: itemLookup[result.id]?.name ?? result.id,
          blobUrl: result.blobUrl,
          detail: t("resultDetail")
        }))}
        selectedId={selectedResultId}
        title={t("resultTitle")}
      />
      <div className="actions">
        <button
          className="button"
          disabled={!selectedResultId || isPreparingCutout}
          onClick={handleContinue}
          type="button"
        >
          {t("continue")}
        </button>
      </div>
    </CreateShell>
  );
}
