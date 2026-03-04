import { NextResponse } from "next/server";

import { getRedis } from "@/lib/redis";
import type { KVJob, SessionStatusResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkoutId = searchParams.get("checkoutId") ?? searchParams.get("checkout_id");

  if (!checkoutId) {
    return NextResponse.json(
      { ok: false, message: "checkoutId is required." },
      { status: 400 }
    );
  }

  try {
    const redis = getRedis();
    const orderId = await redis.get<string>(`checkout:${checkoutId}`);

    if (!orderId) {
      const response: SessionStatusResponse = {
        ready: false,
        status: "pending"
      };
      return NextResponse.json(response, { status: 202 });
    }

    const job = await redis.get<KVJob>(`job:${orderId}`);
    if (!job) {
      const response: SessionStatusResponse = {
        ready: false,
        status: "pending"
      };
      return NextResponse.json(response, { status: 202 });
    }

    const response: SessionStatusResponse = {
      ready: true,
      orderId: job.orderId,
      sessionToken: job.sessionToken,
      status: job.status
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to read the current session state.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
