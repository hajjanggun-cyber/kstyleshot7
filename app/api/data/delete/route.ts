import { NextResponse } from "next/server";

import { getRedis } from "@/lib/redis";
import { getJobFromRequest } from "@/lib/jobs";

export async function POST(request: Request) {
  const job = await getJobFromRequest(request);
  if (!job) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const redis = getRedis();

  await redis.del(`job:${job.orderId}`);
  await redis.del(`session:${job.sessionToken}`);
  await redis.del(`checkout:${job.checkoutId}`);

  return NextResponse.json({
    ok: true,
    deleted: true,
    message: "Server-side session keys were removed. The client must revoke Blob URLs."
  });
}
