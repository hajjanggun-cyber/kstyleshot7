import { NextRequest, NextResponse } from "next/server";

import { getJobFromRequest, saveJob } from "@/lib/jobs";
import { createPolarRefund } from "@/lib/polar";
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

    // Always mark as refunded in DB regardless of Polar API result
    const redis = getRedis();
    await saveJob(redis, {
      ...job,
      refundRequested: true,
      status: "refunded",
      updatedAt: new Date().toISOString(),
    });

    // Attempt Polar refund — log failure but do not block the response
    try {
      await createPolarRefund(job.orderId);
    } catch (polarErr) {
      console.error("[refund] Polar API refund failed — marked in DB, manual follow-up required", {
        orderId: job.orderId,
        error: polarErr instanceof Error ? polarErr.message : String(polarErr),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[refund]", err);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}
