import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

import { startIcLightJob, uploadToReplicateFiles, ReplicateApiError } from "@/lib/replicate";

export const maxDuration = 20;

function sanitizeBackgroundPath(bgPath: string): string | null {
  if (!/^\/backgrounds\/[\w\-]+\.(png|webp)$/.test(bgPath)) return null;
  return bgPath;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      subjectUrl?: unknown;
      backgroundPath?: unknown;
    };

    const { subjectUrl, backgroundPath } = body;

    if (typeof subjectUrl !== "string" || !subjectUrl) {
      return NextResponse.json({ error: "Missing subjectUrl" }, { status: 400 });
    }
    if (typeof backgroundPath !== "string" || !backgroundPath) {
      return NextResponse.json({ error: "Missing backgroundPath" }, { status: 400 });
    }

    const safeBgPath = sanitizeBackgroundPath(backgroundPath);
    if (!safeBgPath) {
      return NextResponse.json({ error: "Invalid backgroundPath" }, { status: 400 });
    }

    // Read background from filesystem and upload to Replicate Files
    // — works in all environments (local and production)
    const bgFilePath = join(process.cwd(), "public", safeBgPath);
    const bgBuffer = await readFile(bgFilePath);
    const ext = safeBgPath.endsWith(".webp") ? "image/webp" : "image/png";
    const backgroundImageUrl = await uploadToReplicateFiles(bgBuffer, ext);

    const predictionId = await startIcLightJob({
      subjectImageUrl: subjectUrl,
      backgroundImageUrl,
    });

    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      console.error("[iclight] Replicate error:", err.status, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[iclight]", err);
    return NextResponse.json({ error: "ic-light job failed" }, { status: 500 });
  }
}
