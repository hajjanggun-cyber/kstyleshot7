"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { BackgroundSelector } from "@/components/create/BackgroundSelector";
import { CreateShell } from "@/components/create/CreateShell";
import { ResultGrid } from "@/components/create/ResultGrid";
import { backgrounds } from "@/data/backgrounds";
import { createMockStepResults } from "@/lib/mockResults";
import { useCreateStore } from "@/store/createStore";

export default function LocationPage() {
  const t = useTranslations("create.location");
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
        description={t("missingOutfitDescription")}
        title={t("shellTitle")}
      >
        <section className="card stack">
          <h2>{t("missingOutfitTitle")}</h2>
          <p className="muted">{t("missingOutfitBody")}</p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/outfit`}>
              {t("goOutfit")}
            </Link>
          </div>
        </section>
      </CreateShell>
    );
  }

  return (
    <CreateShell
      current="location"
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
      <BackgroundSelector
        ctaDisabled={location.chosen.length !== 2 || isCompositing}
        ctaLabel={isCompositing ? t("compositing") : t("generate")}
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
          <h2>{t("processingTitle")}</h2>
          <p className="muted">{t("processingDescription")}</p>
        </section>
      ) : null}
      <ResultGrid
        description={t("resultDescription")}
        emptyMessage={t("resultEmpty")}
        onSelect={setSelectedResultId}
        results={location.results.map((result) => ({
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
          disabled={!selectedResultId}
          onClick={handleContinue}
          type="button"
        >
          {t("continue")}
        </button>
      </div>
    </CreateShell>
  );
}
