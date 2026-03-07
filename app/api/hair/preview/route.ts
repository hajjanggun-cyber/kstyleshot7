import { getRequestId, jsonError, jsonOk } from "@/lib/api-response";
import { startHairVariantJobs } from "@/lib/replicate";

export const maxDuration = 60;

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  if (!process.env.REPLICATE_API_TOKEN?.trim()) {
    return jsonError(requestId, { status: 503, message: "Replicate not configured." });
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const photoDataUrl = typeof body.photoDataUrl === "string" ? body.photoDataUrl : "";
  const haircutName = typeof body.haircutName === "string" ? body.haircutName.trim() : "";
  const hairColor = typeof body.hairColor === "string" ? body.hairColor.trim() : "Random";

  if (!photoDataUrl.startsWith("data:image/")) {
    return jsonError(requestId, { status: 400, message: "photoDataUrl must be an image data URL." });
  }
  if (!haircutName) {
    return jsonError(requestId, { status: 400, message: "haircutName is required." });
  }

  try {
    const [result] = await startHairVariantJobs({
      photoDataUrl,
      variants: [{ id: "preview", haircut: haircutName, hairColor }],
    });

    return jsonOk(requestId, {
      ok: true,
      outputUrl: result.outputUrl,
      predictionId: result.predictionId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hair preview failed.";
    return jsonError(requestId, { status: 502, message });
  }
}
