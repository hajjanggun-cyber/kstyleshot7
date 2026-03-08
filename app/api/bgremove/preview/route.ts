import { NextRequest, NextResponse } from "next/server";

import { startBgRemovalJob, ReplicateApiError } from "@/lib/replicate";

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { imageUrl?: unknown };
    const { imageUrl } = body;

    if (typeof imageUrl !== "string" || !imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
    }

    const predictionId = await startBgRemovalJob(imageUrl);
    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      console.error("[bgremove] Replicate error:", err.status, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[bgremove] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
