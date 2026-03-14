import { getRequestId, jsonError, jsonOk } from "@/lib/api-response";
import { ReplicateApiError, startHairFinalJob } from "@/lib/replicate";

// Just starts the job — no waiting.
export const maxDuration = 10;

export async function POST(request: Request) {
  const requestId = getRequestId(request);

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

  const faceSwapImageUrl = typeof body.faceSwapImageUrl === "string" ? body.faceSwapImageUrl.trim() : "";
  const haircutName = typeof body.haircutName === "string" ? body.haircutName.trim() : "";
  const hairColor = typeof body.hairColor === "string" ? body.hairColor.trim() : "Random";

  if (!faceSwapImageUrl) {
    return jsonError(requestId, { status: 400, message: "faceSwapImageUrl is required." });
  }
  if (!haircutName) {
    return jsonError(requestId, { status: 400, message: "haircutName is required." });
  }

  try {
    const predictionId = await startHairFinalJob({
      imageUrl: faceSwapImageUrl,
      haircutName,
      hairColor,
    });

    return jsonOk(requestId, { ok: true, predictionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Final haircut job failed.";
    const status = error instanceof ReplicateApiError ? error.status : 502;
    return jsonError(requestId, { status, message });
  }
}
