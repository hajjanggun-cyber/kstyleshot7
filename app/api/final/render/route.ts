import { NextRequest, NextResponse } from "next/server";

import { referenceTemplates } from "@/data/referenceTemplates";
import { ReplicateApiError, startFaceSwapJob } from "@/lib/replicate";

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      selfieUrl?: unknown;
      referenceTemplateId?: unknown;
    };

    const selfieUrl =
      typeof body.selfieUrl === "string" ? body.selfieUrl.trim() : "";
    const referenceTemplateId =
      typeof body.referenceTemplateId === "string" ? body.referenceTemplateId.trim() : "";

    if (!selfieUrl) {
      return NextResponse.json({ error: "Missing selfieUrl" }, { status: 400 });
    }

    if (!referenceTemplateId) {
      return NextResponse.json({ error: "Missing referenceTemplateId" }, { status: 400 });
    }

    const template = referenceTemplates.find((item) => item.id === referenceTemplateId);
    if (!template) {
      return NextResponse.json({ error: "Unknown referenceTemplateId" }, { status: 400 });
    }

    const predictionId = await startFaceSwapJob({
      inputImageUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${template.templateImageUrl}`,
      swapImageUrl: selfieUrl,
    });

    return NextResponse.json({ predictionId });
  } catch (error) {
    if (error instanceof ReplicateApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[final/render]", error);
    return NextResponse.json({ error: "Face-swap render failed" }, { status: 500 });
  }
}
