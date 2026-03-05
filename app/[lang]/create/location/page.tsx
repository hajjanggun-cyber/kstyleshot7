"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BackgroundSelector } from "@/components/create/BackgroundSelector";
import { CreateShell } from "@/components/create/CreateShell";
import { ResultGrid } from "@/components/create/ResultGrid";
import { backgrounds } from "@/data/backgrounds";
import { createMockStepResults } from "@/lib/mockResults";
import { useCreateStore } from "@/store/createStore";

export default function LocationPage() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const { outfit, location, setLocationChosen, setLocationResults, pickLocation, setStatus } =
    useCreateStore();
  const [isCompositing, setIsCompositing] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const itemLookup = useMemo(
    () =>
      Object.fromEntries(
        backgrounds.map((item) => [item.id, { name: item.name, detail: item.mood }])
      ),
    []
  );

  function toggleSelection(id: string) {
    if (location.chosen.includes(id)) {
      setLocationChosen(location.chosen.filter((currentId) => currentId !== id));
      setSelectedResultId(null);
      return;
    }

    if (location.chosen.length >= 2) {
      return;
    }

    setLocationChosen([...location.chosen, id]);
    setSelectedResultId(null);
  }

  async function handleComposite() {
    if (!outfit.picked || location.chosen.length !== 2 || isCompositing) {
      return;
    }

    setStatus("location_selecting");
    setIsCompositing(true);
    setSelectedResultId(null);
    await new Promise((resolve) => setTimeout(resolve, 850));
    setLocationResults(createMockStepResults("location", location.chosen, itemLookup));
    setIsCompositing(false);
  }

  function handleContinue() {
    if (!selectedResultId) {
      return;
    }

    pickLocation(selectedResultId);
    router.push(`/${lang}/create/done`);
  }

  if (!outfit.picked) {
    return (
      <CreateShell
        current="location"
        description="A selected outfit is required before background compositing."
        title="Choose 2 backdrops"
      >
        <section className="card stack">
          <h2>Outfit step required</h2>
          <p className="muted">
            Finish the outfit step first. This page expects a selected cutout-ready outfit.
          </p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/outfit`}>
              Go to outfit
            </Link>
          </div>
        </section>
      </CreateShell>
    );
  }

  return (
    <CreateShell
      current="location"
      description="Pick two Seoul backdrops, generate composites, then select the final winner."
      title="Choose 2 backdrops"
    >
      <section className="card stack mock-panel">
        <div className="section-head">
          <h2>Cutout/composite status</h2>
          <span className="mock-chip">SIMULATED</span>
        </div>
        <p className="muted">
          Transparent cutout and final composite are currently mocked. Wire real cutout provider
          before production release.
        </p>
      </section>
      <BackgroundSelector
        ctaDisabled={location.chosen.length !== 2 || isCompositing}
        ctaLabel={isCompositing ? "Compositing..." : "Create composite previews"}
        items={backgrounds.map((item) => ({
          id: item.id,
          name: item.name,
          detail: item.mood,
          thumbnail: item.thumbUrl,
          tags: [item.mood]
        }))}
        onSubmit={handleComposite}
        onToggle={toggleSelection}
        selectedIds={location.chosen}
      />
      {isCompositing ? (
        <section className="card stack">
          <h2>Compositing local previews</h2>
          <p className="muted">
            Simulating the final browser-side canvas composite stage.
          </p>
        </section>
      ) : null}
      <ResultGrid
        description="Choose the final background result before finishing the flow."
        emptyMessage="Select two backgrounds and click create composite previews."
        onSelect={setSelectedResultId}
        results={location.results.map((result) => ({
          id: result.id,
          name: itemLookup[result.id]?.name ?? result.id,
          blobUrl: result.blobUrl,
          detail: "Mock composite output"
        }))}
        selectedId={selectedResultId}
        title="Composite preview results"
      />
      <div className="actions">
        <button
          className="button"
          disabled={!selectedResultId}
          onClick={handleContinue}
          type="button"
        >
          Finish and review
        </button>
      </div>
    </CreateShell>
  );
}
