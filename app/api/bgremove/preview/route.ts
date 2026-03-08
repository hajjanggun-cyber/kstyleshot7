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

    // Fetch external image (e.g. fal.ai CDN) server-side → convert to base64
    // so Replicate doesn't need to access potentially restricted/expiring URLs
    let inputForReplicate: string = imageUrl;
    if (!imageUrl.startsWith("data:")) {
      const res = await fetch(imageUrl, { cache: "no-store" }).catch(() => null);
      if (res && res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const mime = res.headers.get("content-type") ?? "image/png";
        inputForReplicate = `data:${mime};base64,${buffer.toString("base64")}`;
      }
    }

    const predictionId = await startBgRemovalJob(inputForReplicate);
    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
