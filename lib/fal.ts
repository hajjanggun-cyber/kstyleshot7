const FAL_BASE = "https://queue.fal.run";
const FAL_OUTFIT_MODEL = "fal-ai/cat-vton";

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

/** Starts a cat-vton try-on job — returns request_id */
export async function startFashnTryOnJob(input: {
  modelImageDataUrl: string;
  garmentImageDataUrl: string;
  clothType?: string;
}): Promise<string> {
  const res = await fetch(`${FAL_BASE}/${FAL_OUTFIT_MODEL}`, {
    method: "POST",
    headers: {
      Authorization: getFalAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      human_image_url: input.modelImageDataUrl,
      garment_image_url: input.garmentImageDataUrl,
      cloth_type: input.clothType ?? "overall",
      image_size: "portrait_4_3",
      num_inference_steps: 30,
      guidance_scale: 2.5,
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

/** Polls cat-vton job status — returns status + outputUrl when done */
export async function pollFashnJob(requestId: string): Promise<{
  status: "processing" | "succeeded" | "failed";
  outputUrl: string | null;
}> {
  const statusRes = await fetch(
    `${FAL_BASE}/${FAL_OUTFIT_MODEL}/requests/${requestId}/status`,
    {
      headers: { Authorization: getFalAuthHeader() },
      cache: "no-store",
    }
  ).catch(() => {
    throw new FalApiError("Unable to reach fal.ai status API.", 502);
  });

  const statusPayload = await statusRes.json().catch(() => null);
  const rawStatus = statusPayload?.status as string | undefined;

  if (rawStatus === "FAILED") return { status: "failed", outputUrl: null };
  if (rawStatus !== "COMPLETED") return { status: "processing", outputUrl: null };

  // Fetch result
  const resultRes = await fetch(
    `${FAL_BASE}/${FAL_OUTFIT_MODEL}/requests/${requestId}`,
    {
      headers: { Authorization: getFalAuthHeader() },
      cache: "no-store",
    }
  ).catch(() => {
    throw new FalApiError("Unable to fetch fal.ai result.", 502);
  });

  const result = await resultRes.json().catch(() => null);
  // cat-vton output: { image: { url: string } }
  const outputUrl = (result?.image?.url as string | undefined) ?? null;

  return { status: "succeeded", outputUrl };
}
