"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { CreateShell } from "@/components/create/CreateShell";
import { ResultGrid } from "@/components/create/ResultGrid";
import { StyleSelector } from "@/components/create/StyleSelector";
import { hairStyles } from "@/data/hairStyles";
import { useCreateStore } from "@/store/createStore";
import type { JobStatus, StepResult } from "@/types";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 1000 * 120;

type HairStartResponse =
  | {
      ok: true;
      started: true;
      step: "hair";
      status: JobStatus;
      predictionIds: string[];
    }
  | {
      ok: false;
      message?: string;
    };

type HairStatusResponse =
  | {
      ok: true;
      ready: false;
      status: JobStatus;
    }
  | {
      ok: true;
      ready: true;
      status: JobStatus;
      results: Array<{ id: string; imageUrl: string }>;
    }
  | {
      ok: false;
      message?: string;
    };

type HairSelectResponse =
  | {
      ok: true;
      step: "hair";
      selectedId: string;
      nextStatus: JobStatus;
    }
  | {
      ok: false;
      message?: string;
    };

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function blobToDataUrl(
  blobUrl: string,
  errors: { read: string; serialize: string }
): Promise<string> {
  const response = await fetch(blobUrl);
  if (!response.ok) {
    throw new Error(errors.read);
  }

  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(errors.serialize));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(errors.serialize));
        return;
      }

      resolve(reader.result);
    };

    reader.readAsDataURL(blob);
  });
}

function toStepResults(results: Array<{ id: string; imageUrl: string }>): StepResult[] {
  return results.map((result) => ({
    id: result.id,
    blobUrl: result.imageUrl,
    downloaded: false,
    selected: false
  }));
}

function readErrorMessage(payload: unknown, fallback: string): string {
  let requestId = "";
  if (
    payload &&
    typeof payload === "object" &&
    "requestId" in payload &&
    typeof payload.requestId === "string"
  ) {
    requestId = payload.requestId;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    if (requestId) {
      return `${payload.message} (requestId: ${requestId})`;
    }

    return payload.message;
  }

  return fallback;
}

export default function HairPage() {
  const t = useTranslations("create.hair");
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";
  const { photoBlobUrl, hair, sessionToken, setHairChosen, setHairResults, pickHair, setStatus } =
    useCreateStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [generationNotice, setGenerationNotice] = useState("");
  const [generationError, setGenerationError] = useState("");

  const itemLookup = useMemo(
    () =>
      Object.fromEntries(
        hairStyles.map((item) => [item.id, { name: item.name, detail: item.prompt }])
      ),
    []
  );

  async function pollHairResults(token: string): Promise<StepResult[]> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      const response = await fetch("/api/jobs/status?step=hair", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as HairStatusResponse | null;

      if (!response.ok && response.status !== 202) {
        throw new Error(readErrorMessage(payload, t("errors.pollStatus")));
      }

      if (payload && payload.ok && payload.ready) {
        if (payload.results.length === 0) {
          throw new Error(t("errors.noResults"));
        }

        return toStepResults(payload.results);
      }

      await wait(POLL_INTERVAL_MS);
    }

    throw new Error(t("errors.timeout"));
  }

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

    if (!sessionToken || sessionToken.startsWith("demo-session-")) {
      setGenerationError(t("errors.paidSessionRequired"));
      return;
    }

    setStatus("hair_processing");
    setIsGenerating(true);
    setSelectedResultId(null);
    setGenerationError("");
    setGenerationNotice(t("notice.starting"));

    try {
      const photoDataUrl = await blobToDataUrl(photoBlobUrl, {
        read: t("errors.readImage"),
        serialize: t("errors.serializeImage")
      });
      const startResponse = await fetch("/api/jobs/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          step: "hair",
          styleIds: hair.chosen,
          photoDataUrl
        })
      });
      const startPayload = (await startResponse.json().catch(() => null)) as HairStartResponse | null;

      if (!startResponse.ok || !startPayload || !startPayload.ok) {
        throw new Error(readErrorMessage(startPayload, t("errors.start")));
      }

      setGenerationNotice(t("notice.polling"));
      const nextResults = await pollHairResults(sessionToken);
      setHairResults(nextResults);
      setGenerationNotice(t("notice.completed"));
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : t("errors.generate"));
      setGenerationNotice("");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleContinue() {
    if (!selectedResultId) {
      return;
    }

    if (!sessionToken || sessionToken.startsWith("demo-session-")) {
      setGenerationError(t("errors.verifiedSessionRequired"));
      return;
    }

    setGenerationError("");

    try {
      const response = await fetch("/api/jobs/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          step: "hair",
          selectedId: selectedResultId
        })
      });
      const payload = (await response.json().catch(() => null)) as HairSelectResponse | null;

      if (!response.ok || !payload || !payload.ok) {
        throw new Error(readErrorMessage(payload, t("errors.persist")));
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : t("errors.persist")
      );
      return;
    }

    pickHair(selectedResultId);
    router.push(`/${lang}/create/outfit`);
  }

  if (!photoBlobUrl) {
    return (
      <CreateShell
        current="hair"
        description={t("shellMissingDescription")}
        title={t("shellTitle")}
      >
        <section className="card stack">
          <h2>{t("missingUploadTitle")}</h2>
          <p className="muted">{t("missingUploadDescription")}</p>
          <div className="actions">
            <Link className="button" href={`/${lang}/create/upload`}>
              {t("goUpload")}
            </Link>
          </div>
        </section>
      </CreateShell>
    );
  }

  return (
    <CreateShell
      current="hair"
      description={t("shellDescription")}
      title={t("shellTitle")}
    >
      <StyleSelector
        ctaDisabled={hair.chosen.length !== 2 || isGenerating}
        ctaLabel={isGenerating ? t("generating") : t("generate")}
        title={t("selectorTitle")}
        description={t("selectorDescription")}
        items={hairStyles.map((item) => ({
          id: item.id,
          name: item.name,
          detail: item.prompt,
          thumbnail: item.thumbnail,
          tags: item.tags
        }))}
        onSubmit={handleGenerate}
        onToggle={toggleSelection}
        selectedIds={hair.chosen}
      />
      {isGenerating ? (
        <section className="card stack">
          <h2>{t("processingTitle")}</h2>
          <p className="muted">
            {t("processingDescription")}
          </p>
        </section>
      ) : null}
      {generationNotice ? <div className="notice">{generationNotice}</div> : null}
      {generationError ? <div className="notice">{generationError}</div> : null}
      <ResultGrid
        description={t("resultDescription")}
        emptyMessage={t("resultEmpty")}
        onSelect={setSelectedResultId}
        results={hair.results.map((result) => ({
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
