"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ResultGrid } from "@/components/create/ResultGrid";
import { StepProgress } from "@/components/create/StepProgress";
import { StyleSelector } from "@/components/create/StyleSelector";
import { outfits } from "@/data/outfits";
import { createMockStepResults } from "@/lib/mockResults";
import { useCreateStore } from "@/store/createStore";

export default function OutfitPage() {
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
      <div className="stack">
        <StepProgress current="outfit" />
        <section className="card stack">
          <h1>Hair step required</h1>
          <p className="muted">
            Finish the hair selection first so the outfit step has a selected base.
          </p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/hair`}>
              Go to hair
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="stack">
      <StepProgress current="outfit" />
      <StyleSelector
        ctaDisabled={outfit.chosen.length !== 2 || isGenerating}
        ctaLabel={isGenerating ? "Generating..." : "Generate outfit previews"}
        title="Choose 2 outfits"
        description="The real provider is not selected yet, but the UX now behaves like a proper choose-generate-pick flow."
        items={outfits.map((item) => ({
          id: item.id,
          name: item.name,
          detail: item.description
        }))}
        onSubmit={handleGenerate}
        onToggle={toggleSelection}
        selectedIds={outfit.chosen}
      />
      {isGenerating ? (
        <section className="card stack">
          <h2>Generating local outfit previews</h2>
          <p className="muted">
            This simulates the async generation stage while the commercial provider decision is still pending.
          </p>
        </section>
      ) : null}
      {isPreparingCutout ? (
        <section className="card stack">
          <h2>Preparing transparent cutout</h2>
          <p className="muted">
            Simulating the background removal step before moving into the composite stage.
          </p>
        </section>
      ) : null}
      <ResultGrid
        description="Download either preview, then choose the one that moves to the cutout step."
        emptyMessage="Select two outfits and click generate to create previews."
        onSelect={setSelectedResultId}
        results={outfit.results.map((result) => ({
          id: result.id,
          name: itemLookup[result.id]?.name ?? result.id,
          blobUrl: result.blobUrl,
          detail: "Mock outfit output"
        }))}
        selectedId={selectedResultId}
        title="Outfit preview results"
      />
      <div className="actions">
        <button
          className="button"
          disabled={!selectedResultId || isPreparingCutout}
          onClick={handleContinue}
          type="button"
        >
          Continue to backgrounds
        </button>
      </div>
    </div>
  );
}
