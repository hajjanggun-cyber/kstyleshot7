import { NextRequest, NextResponse } from "next/server";

import { startOutfitTryOnJob, ReplicateApiError } from "@/lib/replicate";

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      photoDataUrl?: unknown;
      garmentImagePath?: unknown;
    };

    const { photoDataUrl, garmentImagePath } = body;

    if (typeof photoDataUrl !== "string" || !photoDataUrl) {
      return NextResponse.json({ error: "Missing photoDataUrl" }, { status: 400 });
    }
    if (typeof garmentImagePath !== "string" || !garmentImagePath) {
      return NextResponse.json({ error: "Missing garmentImagePath" }, { status: 400 });
    }

    // Build an absolute public URL so Replicate can fetch the garment image
    const origin = request.nextUrl.origin;
    const garmentImageUrl = `${origin}${garmentImagePath}`;

    const predictionId = await startOutfitTryOnJob({ photoDataUrl, garmentImageUrl });
    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
