import { NextRequest, NextResponse } from "next/server";

import { pollPredictions, ReplicateApiError } from "@/lib/replicate";

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const predictionId = request.nextUrl.searchParams.get("predictionId");

  if (!predictionId) {
    return NextResponse.json({ error: "Missing predictionId" }, { status: 400 });
  }

  try {
    const [result] = await pollPredictions([predictionId]);
    return NextResponse.json({
      status: result.status,
      outputUrl: result.outputUrl ?? undefined,
      error: result.error ?? undefined,
    });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
