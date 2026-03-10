import { getRequestId, jsonError, jsonOk } from "@/lib/api-response";
import { pollPredictions } from "@/lib/replicate";

export const maxDuration = 10;

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const { searchParams } = new URL(request.url);
  const predictionId = searchParams.get("predictionId")?.trim() ?? "";

  if (!predictionId) {
    return jsonError(requestId, { status: 400, message: "predictionId is required." });
  }

  try {
    const [prediction] = await pollPredictions([predictionId]);
    return jsonOk(requestId, {
      ok: true,
      status: prediction.status,
      outputUrl: prediction.outputUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Poll failed.";
    return jsonError(requestId, { status: 502, message });
  }
}
