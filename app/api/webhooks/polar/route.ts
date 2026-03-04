import { NextResponse } from "next/server";

import {
  PolarApiError,
  createConfirmedJob,
  createSessionToken,
  extractPaidOrder,
  getCheckoutTtlSeconds,
  getWebhookEventTtlSeconds,
  isSupportedPaymentEvent,
  parseWebhookEvent,
  verifyPolarWebhookSignature
} from "@/lib/polar";
import { getRedis } from "@/lib/redis";

export const maxDuration = 30;

export async function POST(request: Request) {
  const body = await request.text();
  let event: unknown;

  try {
    verifyPolarWebhookSignature({
      body,
      headers: request.headers
    });
    event = parseWebhookEvent(body);
  } catch (error) {
    const status =
      error instanceof PolarApiError ? error.status : error instanceof Error ? 500 : 500;
    const message =
      error instanceof Error ? error.message : "Unable to validate the Polar webhook.";

    return NextResponse.json({ ok: false, message }, { status });
  }

  if (!isSupportedPaymentEvent(event)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const paidOrder = extractPaidOrder(event);
  if (!paidOrder) {
    return NextResponse.json(
      { ok: false, message: "Webhook payload is missing order or checkout identifiers." },
      { status: 400 }
    );
  }

  try {
    const redis = getRedis();
    const eventKey = `webhook:event:${paidOrder.eventId}`;
    const eventLocked = await redis.set(eventKey, "1", {
      ex: getWebhookEventTtlSeconds(),
      nx: true
    });

    if (eventLocked !== "OK") {
      return NextResponse.json({
        ok: true,
        duplicate: true,
        orderId: paidOrder.orderId,
        checkoutId: paidOrder.checkoutId
      });
    }

    const sessionToken = createSessionToken();
    const job = createConfirmedJob({
      orderId: paidOrder.orderId,
      checkoutId: paidOrder.checkoutId,
      sessionToken
    });
    const ttlSeconds = getCheckoutTtlSeconds();

    try {
      await redis.set(`checkout:${job.checkoutId}`, job.orderId, { ex: ttlSeconds });
      await redis.set(`session:${job.sessionToken}`, job.orderId, { ex: ttlSeconds });
      await redis.set(`job:${job.orderId}`, job, { ex: ttlSeconds });
    } catch (error) {
      await redis.del(eventKey);
      throw error;
    }

    return NextResponse.json({
      ok: true,
      processed: true,
      orderId: job.orderId,
      checkoutId: job.checkoutId,
      sessionToken: job.sessionToken
    });
  } catch (error) {
    const status =
      error instanceof PolarApiError ? error.status : error instanceof Error ? 500 : 500;
    const message =
      error instanceof Error ? error.message : "Unable to persist the paid Polar session.";

    return NextResponse.json({ ok: false, message }, { status });
  }
}

