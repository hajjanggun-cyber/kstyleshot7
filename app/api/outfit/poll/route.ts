import { NextRequest, NextResponse } from "next/server";

import { pollFashnJob, FalApiError } from "@/lib/fal";

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const predictionId = request.nextUrl.searchParams.get("predictionId");

  if (!predictionId) {
    return NextResponse.json({ error: "Missing predictionId" }, { status: 400 });
  }

  try {
    const result = await pollFashnJob(predictionId);
    return NextResponse.json({
      status: result.status,
      outputUrl: result.outputUrl ?? undefined,
    });
  } catch (err) {
    if (err instanceof FalApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
