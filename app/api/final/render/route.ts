import { NextRequest, NextResponse } from "next/server";

import { getJobFromRequest, saveJob } from "@/lib/jobs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getRedis } from "@/lib/redis";

import { outfitTemplates } from "@/data/outfits";
import { referenceTemplates } from "@/data/referenceTemplates";
import { ReplicateApiError, startNanaBananaJob, uploadToReplicateFiles } from "@/lib/replicate";

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  const job = await getJobFromRequest(request);
  if (!job) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (job.finalPredictionId) {
    return NextResponse.json({ predictionId: job.finalPredictionId });
  }

  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(ip, "final-render", 5);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Retry after ${rateLimit.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as {
      hairPreviewDataUrl?: unknown;
      outfitTemplateId?: unknown;
      backgroundTemplateId?: unknown;
    };

    const hairPreviewDataUrl =
      typeof body.hairPreviewDataUrl === "string" ? body.hairPreviewDataUrl.trim() : "";
    const outfitTemplateId =
      typeof body.outfitTemplateId === "string" ? body.outfitTemplateId.trim() : "";
    const backgroundTemplateId =
      typeof body.backgroundTemplateId === "string" ? body.backgroundTemplateId.trim() : "";

    if (!hairPreviewDataUrl) {
      return NextResponse.json({ error: "Missing hairPreviewDataUrl" }, { status: 400 });
    }
    if (!outfitTemplateId) {
      return NextResponse.json({ error: "Missing outfitTemplateId" }, { status: 400 });
    }
    if (!backgroundTemplateId) {
      return NextResponse.json({ error: "Missing backgroundTemplateId" }, { status: 400 });
    }

    const outfitTemplate = outfitTemplates.find((t) => t.id === outfitTemplateId);
    if (!outfitTemplate) {
      return NextResponse.json({ error: "Unknown outfitTemplateId" }, { status: 400 });
    }

    const bgTemplate = referenceTemplates.find((t) => t.id === backgroundTemplateId);
    if (!bgTemplate) {
      return NextResponse.json({ error: "Unknown backgroundTemplateId" }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

    // If already an HTTPS URL, use directly. Otherwise upload data URL to Replicate Files API.
    let hairImageUrl: string;
    if (hairPreviewDataUrl.startsWith("https://")) {
      hairImageUrl = hairPreviewDataUrl;
    } else {
      const match = hairPreviewDataUrl.match(/^data:([^;,]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json({ error: "hairPreviewDataUrl must be an HTTPS URL or data URL" }, { status: 400 });
      }
      const [, mimeType, base64] = match;
      const buffer = Buffer.from(base64, "base64");
      hairImageUrl = await uploadToReplicateFiles(buffer, mimeType);
    }

    const outfitImageUrl = `${appUrl}${outfitTemplate.imageUrl}`;
    const backgroundImageUrl = `${appUrl}${bgTemplate.templateImageUrl}`;

    const predictionId = await startNanaBananaJob({
      hairPreviewUrl: hairImageUrl,
      outfitImageUrl,
      backgroundImageUrl,
      sceneDescription: bgTemplate.sceneDescription,
    });

    const redis = getRedis();
    await saveJob(redis, { ...job, finalPredictionId: predictionId });

    return NextResponse.json({ predictionId });
  } catch (error) {
    if (error instanceof ReplicateApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[final/render]", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}
