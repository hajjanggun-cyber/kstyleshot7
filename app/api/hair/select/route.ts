import { getRequestId, jsonError, jsonOk } from "@/lib/api-response";
import { getJobFromRequest } from "@/lib/jobs";

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  const job = await getJobFromRequest(request);
  if (!job) {
    return jsonError(requestId, { status: 401, message: "Unauthorized." });
  }

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
