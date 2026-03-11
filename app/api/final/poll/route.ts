import { NextRequest, NextResponse } from "next/server";

import { getPrediction, ReplicateApiError } from "@/lib/replicate";

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  try {
    const predictionId = request.nextUrl.searchParams.get("predictionId")?.trim();
    if (!predictionId) {
      return NextResponse.json({ error: "Missing predictionId" }, { status: 400 });
    }

    const prediction = await getPrediction(predictionId);

    return NextResponse.json({
      status: prediction.status,
      outputUrl: prediction.outputUrl,
      error: prediction.error,
    });
  } catch (error) {
    if (error instanceof ReplicateApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[final/poll]", error);
    return NextResponse.json({ error: "Final poll failed" }, { status: 500 });
  }
}
