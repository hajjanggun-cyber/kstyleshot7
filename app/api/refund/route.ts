import { NextRequest, NextResponse } from "next/server";

import { getJobFromRequest, saveJob } from "@/lib/jobs";
import { PolarApiError, createPolarRefund } from "@/lib/polar";
import { getRedis } from "@/lib/redis";

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  try {
    const job = await getJobFromRequest(request);
    if (!job) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (job.refundRequested) {
      return NextResponse.json({ ok: true, alreadyRequested: true });
    }

    await createPolarRefund(job.orderId);

    const redis = getRedis();
    await saveJob(redis, {
      ...job,
      refundRequested: true,
      status: "refunded",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof PolarApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[refund]", err);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}
