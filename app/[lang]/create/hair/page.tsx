"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ResultGrid } from "@/components/create/ResultGrid";
import { StepProgress } from "@/components/create/StepProgress";
import { StyleSelector } from "@/components/create/StyleSelector";
import { hairStyles } from "@/data/hairStyles";
import { createMockStepResults } from "@/lib/mockResults";
import { useCreateStore } from "@/store/createStore";

export default function HairPage() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const { photoBlobUrl, hair, setHairChosen, setHairResults, pickHair, setStatus } =
    useCreateStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const itemLookup = useMemo(
    () =>
      Object.fromEntries(
        hairStyles.map((item) => [item.id, { name: item.name, detail: item.prompt }])
      ),
    []
  );

  function toggleSelection(id: string) {
    if (hair.chosen.includes(id)) {
      setHairChosen(hair.chosen.filter((currentId) => currentId !== id));
      setSelectedResultId(null);
      return;
    }

    if (hair.chosen.length >= 2) {
      return;
    }

    setHairChosen([...hair.chosen, id]);
    setSelectedResultId(null);
  }

  async function handleGenerate() {
    if (!photoBlobUrl || hair.chosen.length !== 2 || isGenerating) {
      return;
    }

    setStatus("hair_processing");
    setIsGenerating(true);
    setSelectedResultId(null);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setHairResults(createMockStepResults("hair", hair.chosen, itemLookup));
    setIsGenerating(false);
  }

  function handleContinue() {
    if (!selectedResultId) {
      return;
    }

    pickHair(selectedResultId);
    router.push(`/${lang}/create/outfit`);
  }

  if (!photoBlobUrl) {
    return (
      <div className="stack">
        <StepProgress current="hair" />
        <section className="card stack">
          <h1>Upload required</h1>
          <p className="muted">
            Add a selfie first so the hair step has something to work from.
          </p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/upload`}>
              Go to upload
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="stack">
      <StepProgress current="hair" />
      <StyleSelector
        ctaDisabled={hair.chosen.length !== 2 || isGenerating}
        ctaLabel={isGenerating ? "Generating..." : "Generate hair previews"}
        title="Choose 2 hairstyles"
        description="This page now behaves like the real flow: pick two, generate mocked previews, choose one, then continue."
        items={hairStyles.map((item) => ({
          id: item.id,
          name: item.name,
          detail: item.prompt
        }))}
        onSubmit={handleGenerate}
        onToggle={toggleSelection}
        selectedIds={hair.chosen}
      />
      {isGenerating ? (
        <section className="card stack">
          <h2>Generating local previews</h2>
          <p className="muted">
            Simulating a polling phase so the UX behaves like the real async job flow.
          </p>
        </section>
      ) : null}
      <ResultGrid
        description="Download either preview, then mark one as the winner for the next stage."
        emptyMessage="Select two hairstyles and click generate to create previews."
        onSelect={setSelectedResultId}
        results={hair.results.map((result) => ({
          id: result.id,
          name: itemLookup[result.id]?.name ?? result.id,
          blobUrl: result.blobUrl,
          detail: "Mock hair output"
        }))}
        selectedId={selectedResultId}
        title="Hair preview results"
      />
      <div className="actions">
        <button
          className="button"
          disabled={!selectedResultId}
          onClick={handleContinue}
          type="button"
        >
          Continue to outfit
        </button>
      </div>
    </div>
  );
}
