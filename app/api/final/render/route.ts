import { NextRequest, NextResponse } from "next/server";

import { referenceTemplates } from "@/data/referenceTemplates";
import { ReplicateApiError, startFluxKontextProJob } from "@/lib/replicate";

export const maxDuration = 20;

function buildFinalPrompt(templatePrompt: string, negativePrompt: string): string {
  return [
    "Keep the face and hairstyle from the base image exactly the same.",
    "Do not change the person's identity, facial structure, hairstyle, or hair color.",
    "Preserve the same person while applying the requested fashion scene.",
    templatePrompt,
    "Create a realistic Korean fashion editorial image with natural body proportions and clean detail.",
    `Avoid: ${negativePrompt}.`,
  ].join(" ");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      baseImageUrl?: unknown;
      referenceTemplateId?: unknown;
    };

    const baseImageUrl =
      typeof body.baseImageUrl === "string" ? body.baseImageUrl.trim() : "";
    const referenceTemplateId =
      typeof body.referenceTemplateId === "string" ? body.referenceTemplateId.trim() : "";

    if (!baseImageUrl) {
      return NextResponse.json({ error: "Missing baseImageUrl" }, { status: 400 });
    }

    if (!referenceTemplateId) {
      return NextResponse.json({ error: "Missing referenceTemplateId" }, { status: 400 });
    }

    const template = referenceTemplates.find((item) => item.id === referenceTemplateId);
    if (!template) {
      return NextResponse.json({ error: "Unknown referenceTemplateId" }, { status: 400 });
    }

    const predictionId = await startFluxKontextProJob({
      imageUrl: baseImageUrl,
      prompt: buildFinalPrompt(template.prompt, template.negativePrompt),
    });

    return NextResponse.json({ predictionId });
  } catch (error) {
    if (error instanceof ReplicateApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[final/render]", error);
    return NextResponse.json({ error: "Final render failed" }, { status: 500 });
  }
}
