import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
import { getJobFromRequest, saveJob } from "@/lib/jobs";
import { pollPredictions, ReplicateApiError } from "@/lib/replicate";
import { getRedis } from "@/lib/redis";
import type { KVJob } from "@/types";

export const maxDuration = 30;

function withUpdatedTime(job: KVJob): KVJob {
  return {
    ...job,
    updatedAt: new Date().toISOString()
  };
}

type PollableStep = "hair" | "outfit" | "cutout";

function isPollableStep(value: string | null): value is PollableStep {
  return value === "hair" || value === "outfit" || value === "cutout";
}

async function persistJob(job: KVJob): Promise<void> {
  const redis = getRedis();
  await saveJob(redis, job);
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const job = await getJobFromRequest(request);
  if (!job) {
    return jsonError(requestId, { status: 401, message: "Unauthorized." });
  }

  const { searchParams } = new URL(request.url);
  const rawStep = searchParams.get("step") ?? "hair";

  if (!isPollableStep(rawStep)) {
    return jsonError(requestId, {
      status: 400,
      message: "step must be one of: hair, outfit, cutout."
    });
  }

  if (rawStep === "outfit") {
    if (job.generatedResults.outfit.length > 0 && job.status === "outfit_completed") {
      return jsonOk(requestId, {
        ok: true,
        ready: true,
        status: job.status,
        results: job.generatedResults.outfit
      });
    }

    if (job.status === "outfit_processing" && job.generatedResults.outfit.length > 0) {
      const completedJob = withUpdatedTime({
        ...job,
        status: "outfit_completed",
        currentStep: "outfit",
        failReason: null
      });
      await persistJob(completedJob);

      return jsonOk(requestId, {
        ok: true,
        ready: true,
        status: completedJob.status,
        results: completedJob.generatedResults.outfit
      });
    }

    return jsonOk(
      requestId,
      {
        ok: true,
        ready: false,
        status: job.status
      },
      202
    );
  }

  if (rawStep === "cutout") {
    if (job.generatedResults.cutout.length > 0 && job.status === "location_selecting") {
      return jsonOk(requestId, {
        ok: true,
        ready: true,
        status: job.status,
        results: job.generatedResults.cutout
      });
    }

    if (job.status === "cutout_processing" && job.generatedResults.cutout.length > 0) {
      const completedJob = withUpdatedTime({
        ...job,
        status: "location_selecting",
        currentStep: "location",
        failReason: null
      });
      await persistJob(completedJob);

      return jsonOk(requestId, {
        ok: true,
        ready: true,
        status: completedJob.status,
        results: completedJob.generatedResults.cutout
      });
    }

    return jsonOk(
      requestId,
      {
        ok: true,
        ready: false,
        status: job.status
      },
      202
    );
  }

  if (job.generatedResults.hair.length > 0 && job.status === "hair_completed") {
    return jsonOk(requestId, {
      ok: true,
      ready: true,
      status: job.status,
      results: job.generatedResults.hair
    });
  }

  if (job.status === "hair_processing" && job.generatedResults.hair.length > 0) {
    const completedJob = withUpdatedTime({
      ...job,
      status: "hair_completed",
      currentStep: "hair",
      failReason: null
    });
    await persistJob(completedJob);

    return jsonOk(requestId, {
      ok: true,
      ready: true,
      status: completedJob.status,
      results: completedJob.generatedResults.hair
    });
  }

  if (job.predictionIds.hair.length === 0) {
    return jsonOk(
      requestId,
      {
        ok: true,
        ready: false,
        status: job.status
      },
      202
    );
  }

  try {
    const predictions = await pollPredictions(job.predictionIds.hair);

    const failedPrediction = predictions.find(
      (prediction) => prediction.status === "failed" || prediction.status === "canceled"
    );
    if (failedPrediction) {
      const failedJob = withUpdatedTime({
        ...job,
        status: "failed",
        failReason: failedPrediction.error ?? `Prediction failed: ${failedPrediction.id}`
      });

      await persistJob(failedJob);

      logApiEvent("error", {
        requestId,
        route: "GET /api/jobs/status",
        message: failedJob.failReason ?? "Prediction failed.",
        details: {
          orderId: failedJob.orderId,
          predictionId: failedPrediction.id
        }
      });

      return jsonError(requestId, {
        status: 500,
        message: failedJob.failReason ?? "Prediction failed."
      });
    }

    const incomplete = predictions.some((prediction) => prediction.status === "processing");
    if (incomplete) {
      return jsonOk(
        requestId,
        {
          ok: true,
          ready: false,
          status: "hair_processing",
          predictions: predictions.map((prediction) => ({
            id: prediction.id,
            status: prediction.status
          }))
        },
        202
      );
    }

    const missingOutput = predictions.find((prediction) => !prediction.outputUrl);
    if (missingOutput) {
      const failedJob = withUpdatedTime({
        ...job,
        status: "failed",
        failReason: `Prediction completed without output: ${missingOutput.id}`
      });

      await persistJob(failedJob);

      logApiEvent("error", {
        requestId,
        route: "GET /api/jobs/status",
        message: failedJob.failReason ?? "Prediction output missing.",
        details: {
          orderId: failedJob.orderId,
          predictionId: missingOutput.id
        }
      });

      return jsonError(requestId, {
        status: 500,
        message: failedJob.failReason ?? "Prediction output missing."
      });
    }

    const completedResults = predictions.map((prediction, index) => ({
      id: job.selectedStyles.hair[index] ?? `hair-${index + 1}`,
      imageUrl: prediction.outputUrl ?? ""
    }));

    const completedJob = withUpdatedTime({
      ...job,
      status: "hair_completed",
      currentStep: "hair",
      generatedResults: {
        ...job.generatedResults,
        hair: completedResults
      },
      failReason: null
    });

    await persistJob(completedJob);

    logApiEvent("info", {
      requestId,
      route: "GET /api/jobs/status",
      message: "Hair predictions completed.",
      details: {
        orderId: completedJob.orderId,
        resultCount: completedResults.length
      }
    });

    return jsonOk(requestId, {
      ok: true,
      ready: true,
      status: completedJob.status,
      results: completedResults
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
        : "Unable to poll the hair generation status.";

    logApiEvent("error", {
      requestId,
      route: "GET /api/jobs/status",
      message,
      details: {
        status,
        orderId: job.orderId
      }
    });

    return jsonError(requestId, { status, message });
  }
}
