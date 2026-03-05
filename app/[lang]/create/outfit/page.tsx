"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CreateShell } from "@/components/create/CreateShell";
import { ResultGrid } from "@/components/create/ResultGrid";
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
      <CreateShell
        current="outfit"
        description="This stage requires a selected hair result from the previous step."
        title="Choose 2 outfits"
      >
        <section className="card stack">
          <h2>Hair step required</h2>
          <p className="muted">
            Finish the hair selection first so the outfit step has a selected base.
          </p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/hair`}>
              Go to hair
            </Link>
          </div>
        </section>
      </CreateShell>
    );
  }

  return (
    <CreateShell
      current="outfit"
      description="Outfit provider is still pending for commercial use, so this stage runs in mock mode."
      title="Choose 2 outfits"
    >
      <section className="card stack mock-panel">
        <div className="section-head">
          <h2>Provider status</h2>
          <span className="mock-chip">MOCK ONLY</span>
        </div>
        <p className="muted">
          Outfit generation is currently simulated for UX validation. Do not treat these results as
          production output.
        </p>
      </section>
      <StyleSelector
        ctaDisabled={outfit.chosen.length !== 2 || isGenerating}
        ctaLabel={isGenerating ? "Generating..." : "Generate outfit previews"}
        title="Outfit options"
        description="MVP mock stage: choose 2 outfits, generate 2 previews, then keep one."
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
    </CreateShell>
  );
}
