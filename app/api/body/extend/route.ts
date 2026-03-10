import { NextRequest, NextResponse } from "next/server";

import { startBodyExtendJob, ReplicateApiError } from "@/lib/replicate";

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl : "";
  const maskDataUrl = typeof body.maskDataUrl === "string" ? body.maskDataUrl : "";

  if (!imageDataUrl.startsWith("data:image/") || !maskDataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "Missing or invalid imageDataUrl / maskDataUrl" }, { status: 400 });
  }

  try {
    const predictionId = await startBodyExtendJob({ imageDataUrl, maskDataUrl });
    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
