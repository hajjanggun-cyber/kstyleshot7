import { hairStyles } from "@/data/hairStyles";
import { outfits } from "@/data/outfits";
import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
import { getJobFromRequest, saveJob } from "@/lib/jobs";
import { createLocalGeneratedResults } from "@/lib/local-generation";
import { isLocalGenerationEnabled } from "@/lib/local-mode";
import { ReplicateApiError, startHairVariantJobs } from "@/lib/replicate";
import { getRedis } from "@/lib/redis";
import type { KVJob, JobStatus } from "@/types";

export const maxDuration = 60;

const HAIR_STARTABLE_STATUSES = new Set<JobStatus>([
  "payment_confirmed",
  "upload_pending",
  "hair_selecting",
  "hair_completed",
  "failed"
]);
const OUTFIT_STARTABLE_STATUSES = new Set<JobStatus>([
  "outfit_selecting",
  "outfit_completed",
  "failed"
]);
const CUTOUT_STARTABLE_STATUSES = new Set<JobStatus>([
  "outfit_completed",
  "cutout_processing",
  "location_selecting",
  "failed"
]);

type StartRequestBody = {
  step?: string;
  styleIds?: unknown;
  photoDataUrl?: unknown;
  selectedId?: unknown;
};

function parseStyleIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const unique = Array.from(
    new Set(
      raw.filter(
        (value): value is string => typeof value === "string" && Boolean(value.trim())
      )
    )
  );

  return unique.slice(0, 2);
}

function withUpdatedTime(job: KVJob): KVJob {
  return {
    ...job,
    updatedAt: new Date().toISOString()
  };
}

function parseSelectedId(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

function hasReplicateToken(): boolean {
  return Boolean(process.env.REPLICATE_API_TOKEN?.trim());
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const job = await getJobFromRequest(request);
  if (!job) {
    return jsonError(requestId, { status: 401, message: "Unauthorized." });
  }

  const payload = (await request.json().catch(() => ({}))) as StartRequestBody;
  const step = payload.step;

  if (step !== "hair" && step !== "outfit" && step !== "cutout") {
    return jsonError(requestId, {
      status: 400,
      message: "step must be one of: hair, outfit, cutout."
    });
  }

  if (step === "hair") {
    if (!HAIR_STARTABLE_STATUSES.has(job.status)) {
      return jsonError(requestId, {
        status: 409,
        message: `Cannot start hair generation from status=${job.status}.`
      });
    }

    const styleIds = parseStyleIds(payload.styleIds);
    if (styleIds.length !== 2) {
      return jsonError(requestId, {
        status: 400,
        message: "styleIds must contain exactly two unique hair style ids."
      });
    }

    const styleLookup = Object.fromEntries(hairStyles.map((style) => [style.id, style]));
    if (!styleIds.every((styleId) => styleLookup[styleId])) {
      return jsonError(requestId, {
        status: 400,
        message: "styleIds include at least one unknown hair style id."
      });
    }

    const photoDataUrl = typeof payload.photoDataUrl === "string" ? payload.photoDataUrl : "";
    if (!photoDataUrl.startsWith("data:image/")) {
      return jsonError(requestId, {
        status: 400,
        message: "photoDataUrl must be an image data URL."
      });
    }

    try {
      const canUseRemote = hasReplicateToken();
      const canUseLocal = isLocalGenerationEnabled();

      if (!canUseRemote && !canUseLocal) {
        return jsonError(requestId, {
          status: 500,
          message: "No hair provider is available. Set REPLICATE_API_TOKEN or enable local fallback."
        });
      }

      let predictionIds: string[] = [];
      let generatedResults: Array<{ id: string; imageUrl: string }> = [];
      let mode: "replicate" | "local_fallback" = "replicate";

      if (canUseRemote) {
        predictionIds = await startHairVariantJobs({
          photoDataUrl,
          variants: styleIds.map((styleId) => ({
            id: styleId,
            prompt: styleLookup[styleId].prompt
          }))
        });
      } else {
        mode = "local_fallback";
        generatedResults = createLocalGeneratedResults(
          "hair",
          styleIds,
          Object.fromEntries(styleIds.map((styleId) => [styleId, styleLookup[styleId].name])),
          "Local hair fallback generation"
        );
      }

      const nextJob = withUpdatedTime({
        ...job,
        status: "hair_processing",
        currentStep: "hair",
        selectedStyles: {
          ...job.selectedStyles,
          hair: styleIds
        },
        pickedStyles: {
          ...job.pickedStyles,
          hair: null
        },
        generatedResults: {
          ...job.generatedResults,
          hair: generatedResults
        },
        predictionIds: {
          ...job.predictionIds,
          hair: predictionIds
        },
        attempts: {
          ...job.attempts,
          hair: job.attempts.hair + 1
        },
        failReason: null
      });

      const redis = getRedis();
      await saveJob(redis, nextJob);

      logApiEvent("info", {
        requestId,
        route: "POST /api/jobs/start",
        message: "Hair generation started.",
        details: {
          mode,
          orderId: nextJob.orderId,
          styleIds,
          predictionCount: predictionIds.length
        }
      });

      return jsonOk(requestId, {
        ok: true,
        started: true,
        step: "hair",
        mode,
        status: nextJob.status,
        predictionIds
      });
    } catch (error) {
      const status =
        error instanceof ReplicateApiError
          ? error.status
          : error instanceof Error
            ? 500
            : 500;
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start the hair generation job.";

      logApiEvent("error", {
        requestId,
        route: "POST /api/jobs/start",
        message,
        details: {
          step,
          status,
          orderId: job.orderId
        }
      });

      return jsonError(requestId, { status, message });
    }
  }

  if (step === "outfit") {
    if (!OUTFIT_STARTABLE_STATUSES.has(job.status)) {
      return jsonError(requestId, {
        status: 409,
        message: `Cannot start outfit generation from status=${job.status}.`
      });
    }

    if (!job.pickedStyles.hair) {
      return jsonError(requestId, {
        status: 409,
        message: "Complete hair selection before starting outfit generation."
      });
    }

    const styleIds = parseStyleIds(payload.styleIds);
    if (styleIds.length !== 2) {
      return jsonError(requestId, {
        status: 400,
        message: "styleIds must contain exactly two unique outfit ids."
      });
    }

    const outfitLookup = Object.fromEntries(outfits.map((item) => [item.id, item]));
    if (!styleIds.every((styleId) => outfitLookup[styleId])) {
      return jsonError(requestId, {
        status: 400,
        message: "styleIds include at least one unknown outfit id."
      });
    }

    const generatedResults = createLocalGeneratedResults(
      "outfit",
      styleIds,
      Object.fromEntries(styleIds.map((styleId) => [styleId, outfitLookup[styleId].name])),
      "Local outfit fallback generation"
    );

    const nextJob = withUpdatedTime({
      ...job,
      status: "outfit_processing",
      currentStep: "outfit",
      selectedStyles: {
        ...job.selectedStyles,
        outfit: styleIds
      },
      pickedStyles: {
        ...job.pickedStyles,
        outfit: null
      },
      generatedResults: {
        ...job.generatedResults,
        outfit: generatedResults
      },
      predictionIds: {
        ...job.predictionIds,
        outfit: []
      },
      attempts: {
        ...job.attempts,
        outfit: job.attempts.outfit + 1
      },
      failReason: null
    });

    const redis = getRedis();
    await saveJob(redis, nextJob);

    logApiEvent("info", {
      requestId,
      route: "POST /api/jobs/start",
      message: "Outfit generation started in local fallback mode.",
      details: {
        orderId: nextJob.orderId,
        styleIds
      }
    });

    return jsonOk(requestId, {
      ok: true,
      started: true,
      step: "outfit",
      mode: "local_fallback",
      status: nextJob.status,
      predictionIds: []
    });
  }

  if (!CUTOUT_STARTABLE_STATUSES.has(job.status)) {
    return jsonError(requestId, {
      status: 409,
      message: `Cannot start cutout generation from status=${job.status}.`
    });
  }

  const selectedId = parseSelectedId(payload.selectedId) || job.pickedStyles.outfit || "";
  if (!selectedId) {
    return jsonError(requestId, {
      status: 400,
      message: "selectedId is required for cutout start."
    });
  }

  const cutoutResults = createLocalGeneratedResults(
    "cutout",
    [selectedId],
    {
      [selectedId]: `Cutout: ${selectedId}`
    },
    "Local cutout fallback generation"
  );

  const nextJob = withUpdatedTime({
    ...job,
    status: "cutout_processing",
    currentStep: "cutout",
    generatedResults: {
      ...job.generatedResults,
      cutout: cutoutResults
    },
    predictionIds: {
      ...job.predictionIds,
      cutout: []
    },
    attempts: {
      ...job.attempts,
      cutout: job.attempts.cutout + 1
    },
    failReason: null
  });

  const redis = getRedis();
  await saveJob(redis, nextJob);

  logApiEvent("info", {
    requestId,
    route: "POST /api/jobs/start",
    message: "Cutout generation started in local fallback mode.",
    details: {
      orderId: nextJob.orderId,
      selectedId
    }
  });

  return jsonOk(requestId, {
    ok: true,
    started: true,
    step: "cutout",
    mode: "local_fallback",
    status: nextJob.status,
    predictionIds: []
  });
}
