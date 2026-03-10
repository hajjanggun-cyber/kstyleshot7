const FAL_SUBMIT_URL = "https://queue.fal.run/fal-ai/fashn/tryon/v1.5";
const FAL_QUEUE_BASE = "https://queue.fal.run/fal-ai/fashn";

function getFalAuthHeader(): string {
  const key = process.env.FAL_KEY?.trim();
  if (!key) throw new FalApiError("Missing FAL_KEY environment variable.", 500);
  return `Key ${key}`;
}

export class FalApiError extends Error {
  readonly status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "FalApiError";
    this.status = status;
  }
}

/** Starts a FASHN v1.5 try-on job — returns request_id */
export async function startFashnTryOnJob(input: {
  modelImageDataUrl: string;
  garmentImageDataUrl: string;
  clothType?: string;
}): Promise<string> {
  const res = await fetch(FAL_SUBMIT_URL, {
    method: "POST",
    headers: {
      Authorization: getFalAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_image: input.modelImageDataUrl,
      garment_image: input.garmentImageDataUrl,
      category: "auto",
      mode: "balanced",
      garment_photo_type: "auto",
      moderation_level: "permissive",
      num_samples: 1,
      segmentation_free: true,
      output_format: "png",
    }),
    cache: "no-store",
  }).catch(() => {
    throw new FalApiError("Unable to reach fal.ai API.", 502);
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = payload?.detail ?? payload?.message ?? `fal.ai error ${res.status}`;
    throw new FalApiError(msg, res.status >= 400 && res.status < 500 ? 400 : 502);
  }

  const requestId = payload?.request_id as string | undefined;
  if (!requestId) throw new FalApiError("fal.ai response missing request_id.", 502);

  return requestId;
}

/** Polls FASHN job status — returns status + outputUrl when done */
export async function pollFashnJob(requestId: string): Promise<{
  status: "processing" | "succeeded" | "failed";
  outputUrl: string | null;
  rawStatus?: string;
  debugPayload?: unknown;
}> {
  const statusRes = await fetch(
    `${FAL_QUEUE_BASE}/requests/${requestId}/status`,
    {
      headers: { Authorization: getFalAuthHeader() },
      cache: "no-store",
    }
  ).catch(() => {
    throw new FalApiError("Unable to reach fal.ai status API.", 502);
  });

  const statusPayload = await statusRes.json().catch(() => null);
  const rawStatus = statusPayload?.status as string | undefined;
  const debugPayload = { httpStatus: statusRes.status, body: statusPayload };

  if (rawStatus === "FAILED") return { status: "failed", outputUrl: null, rawStatus, debugPayload };
  if (rawStatus !== "COMPLETED") return { status: "processing", outputUrl: null, rawStatus, debugPayload };

  // Fetch result
  const resultRes = await fetch(
    `${FAL_QUEUE_BASE}/requests/${requestId}`,
    {
      headers: { Authorization: getFalAuthHeader() },
      cache: "no-store",
    }
  ).catch(() => {
    throw new FalApiError("Unable to fetch fal.ai result.", 502);
  });

  const result = await resultRes.json().catch(() => null);
  const outputUrl = (result?.images as Array<{ url: string }> | undefined)?.[0]?.url ?? null;

  return { status: "succeeded", outputUrl };
}
