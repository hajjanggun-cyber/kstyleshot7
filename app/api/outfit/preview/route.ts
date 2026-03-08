import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

import { startFashnTryOnJob, FalApiError } from "@/lib/fal";

export const maxDuration = 10;

// Only allow /outfits/*.jpeg|jpg|webp|png
function sanitizeGarmentPath(p: string): string | null {
  if (!/^\/outfits\/[\w\-]+\.(jpeg|jpg|webp|png)$/.test(p)) return null;
  return p;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      photoDataUrl?: unknown;
      garmentImagePath?: unknown;
      clothType?: unknown;
    };

    const { photoDataUrl, garmentImagePath, clothType } = body;

    if (typeof photoDataUrl !== "string" || !photoDataUrl) {
      return NextResponse.json({ error: "Missing photoDataUrl" }, { status: 400 });
    }
    if (typeof garmentImagePath !== "string" || !garmentImagePath) {
      return NextResponse.json({ error: "Missing garmentImagePath" }, { status: 400 });
    }

    const safePath = sanitizeGarmentPath(garmentImagePath);
    if (!safePath) {
      return NextResponse.json({ error: "Invalid garmentImagePath" }, { status: 400 });
    }

    // Read garment from filesystem → base64 data URL
    const filePath = join(process.cwd(), "public", safePath);
    const fileBuffer = await readFile(filePath);
    const ext = safePath.split(".").pop()!;
    const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";
    const garmentDataUrl = `data:${mime};base64,${fileBuffer.toString("base64")}`;

    const predictionId = await startFashnTryOnJob({
      modelImageDataUrl: photoDataUrl,
      garmentImageDataUrl: garmentDataUrl,
      clothType: typeof clothType === "string" ? clothType : "overall",
    });

    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof FalApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
