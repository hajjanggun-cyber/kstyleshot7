import { getRequestId, jsonError, jsonOk } from "@/lib/api-response";
import { getJobFromRequest } from "@/lib/jobs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ReplicateApiError, startHairPreviewJob } from "@/lib/replicate";

// Just starts the job — no waiting. Stays well within Vercel Hobby 10s limit.
export const maxDuration = 10;

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  const job = await getJobFromRequest(request);
  if (!job) {
    return jsonError(requestId, { status: 401, message: "Unauthorized." });
  }

  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(ip, "hair-preview", 20);
  if (!rateLimit.allowed) {
    return jsonError(requestId, {
      status: 429,
      message: `Too many requests. Retry after ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  if (!process.env.REPLICATE_API_TOKEN?.trim()) {
    return jsonError(requestId, { status: 503, message: "Replicate not configured." });
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(requestId, {
      status: 400,
      message: "Invalid or oversized request body.",
    });
  }

  const photoDataUrl = typeof body.photoDataUrl === "string" ? body.photoDataUrl : "";
  const haircutName = typeof body.haircutName === "string" ? body.haircutName.trim() : "";
  const hairColor = typeof body.hairColor === "string" ? body.hairColor.trim() : "No change";

  if (!photoDataUrl.startsWith("data:image/")) {
    return jsonError(requestId, { status: 400, message: "photoDataUrl must be an image data URL." });
  }
  if (!haircutName) {
    return jsonError(requestId, { status: 400, message: "haircutName is required." });
  }

  try {
    const predictionId = await startHairPreviewJob({ photoDataUrl, haircutName, hairColor });

    return jsonOk(requestId, { ok: true, predictionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hair preview failed.";
    const status = error instanceof ReplicateApiError ? error.status : 502;
    return jsonError(requestId, { status, message });
  }
}
