import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
import { getJobFromRequest, saveJob } from "@/lib/jobs";
import { getRedis } from "@/lib/redis";
import type { KVJob } from "@/types";

type SelectRequestBody = {
  step?: string;
  selectedId?: string;
};

function withUpdatedTime(job: KVJob): KVJob {
  return {
    ...job,
    updatedAt: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const job = await getJobFromRequest(request);
  if (!job) {
    return jsonError(requestId, { status: 401, message: "Unauthorized." });
  }

  const payload = (await request.json().catch(() => ({}))) as SelectRequestBody;
  if (payload.step !== "hair") {
    return jsonError(requestId, {
      status: 501,
      message: "Only the hair selection step is implemented right now."
    });
  }

  const selectedId = typeof payload.selectedId === "string" ? payload.selectedId.trim() : "";
  if (!selectedId) {
    return jsonError(requestId, {
      status: 400,
      message: "selectedId is required."
    });
  }

  if (job.status !== "hair_completed") {
    return jsonError(requestId, {
      status: 409,
      message: `Cannot select a hair result from status=${job.status}.`
    });
  }

  const selectedResult = job.generatedResults.hair.find((result) => result.id === selectedId);
  if (!selectedResult) {
    return jsonError(requestId, {
      status: 400,
      message: "selectedId is not part of generated hair results."
    });
  }

  const nextJob = withUpdatedTime({
    ...job,
    status: "outfit_selecting",
    currentStep: "outfit",
    pickedStyles: {
      ...job.pickedStyles,
      hair: selectedId
    }
  });

  const redis = getRedis();
  await saveJob(redis, nextJob);

  logApiEvent("info", {
    requestId,
    route: "POST /api/jobs/select",
    message: "Hair result selected.",
    details: {
      orderId: nextJob.orderId,
      selectedId
    }
  });

  return jsonOk(requestId, {
    ok: true,
    step: "hair",
    selectedId,
    nextStatus: nextJob.status
  });
}
