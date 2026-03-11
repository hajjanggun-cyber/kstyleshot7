import { NextRequest, NextResponse } from "next/server";

import { referenceTemplates } from "@/data/referenceTemplates";
import { ReplicateApiError, startFluxKontextProJob } from "@/lib/replicate";

export const maxDuration = 20;

function buildIdentityPreservationPrompt() {
  return [
    "Use the person in the base image exactly as-is.",
    "Preserve the face, identity, ethnicity, hairstyle, hair color, bangs, facial structure, skin tone, skin undertone, skin texture, eye shape, nose, lips, and jawline with 100% fidelity.",
    "Do not change the person, do not redesign the face, do not alter ethnicity or natural facial characteristics, and do not alter the hair in any way.",
  ].join(" ");
}

function buildQualityPrompt() {
  return [
    "Match the person's lighting to the scene naturally.",
    "Blend clothing, hair edges, and skin into the environment without artificial seams.",
    "Keep natural skin texture and realistic detail.",
    "Photorealistic Korean fashion editorial quality.",
  ].join(" ");
}

function buildFinalPrompt(templatePrompt: string, negativePrompt: string): string {
  return [
    buildIdentityPreservationPrompt(),
    templatePrompt,
    buildQualityPrompt(),
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
