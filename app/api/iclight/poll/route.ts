import { NextRequest, NextResponse } from "next/server";

import { getPrediction, ReplicateApiError } from "@/lib/replicate";

export async function GET(request: NextRequest) {
  const predictionId = request.nextUrl.searchParams.get("predictionId");
  if (!predictionId) {
    return NextResponse.json({ error: "Missing predictionId" }, { status: 400 });
  }

  try {
    const prediction = await getPrediction(predictionId);
    return NextResponse.json({
      status: prediction.status,
      outputUrl: prediction.outputUrl ?? undefined,
      error: prediction.error ?? undefined,
    });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
