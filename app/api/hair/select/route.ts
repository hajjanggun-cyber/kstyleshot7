import { getRequestId, jsonError, jsonOk } from "@/lib/api-response";

// A lightweight endpoint to confirm the selected hair.
// In MVP, this acts mainly as a webhook or session-validation step.
// Once server-side session persistence (e.g. Vercel KV) is added,
// the selected hair ID and generating prediction base should be saved here.
export async function POST(request: Request) {
  const requestId = getRequestId(request);

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(requestId, {
      status: 400,
      message: "Invalid JSON body.",
    });
  }

  const { hairId, previewUrl, predictionId } = body;

  if (typeof hairId !== "string" || !hairId.trim()) {
    return jsonError(requestId, { status: 400, message: "hairId is required." });
  }

  // TODO: Add session verification and store the chosen hair result to DB/KV

  return jsonOk(requestId, {
    ok: true,
    message: "Hair selection confirmed",
    data: {
      hairId,
      previewUrl: typeof previewUrl === "string" ? previewUrl : null,
      predictionId: typeof predictionId === "string" ? predictionId : null,
    },
  });
}
