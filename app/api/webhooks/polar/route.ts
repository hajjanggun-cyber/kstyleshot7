import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
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
  const requestId = getRequestId(request);
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

    logApiEvent("error", {
      requestId,
      route: "POST /api/webhooks/polar",
      message,
      details: { status }
    });

    return jsonError(requestId, { status, message });
  }

  if (!isSupportedPaymentEvent(event)) {
    return jsonOk(requestId, { ok: true, ignored: true });
  }

  const paidOrder = extractPaidOrder(event);
  if (!paidOrder) {
    return jsonError(requestId, {
      status: 400,
      message: "Webhook payload is missing order or checkout identifiers."
    });
  }

  try {
    const redis = getRedis();
    const eventKey = `webhook:event:${paidOrder.eventId}`;
    const eventLocked = await redis.set(eventKey, "1", {
      ex: getWebhookEventTtlSeconds(),
      nx: true
    });

    if (eventLocked !== "OK") {
      logApiEvent("warn", {
        requestId,
        route: "POST /api/webhooks/polar",
        message: "Duplicate webhook event ignored.",
        details: {
          eventId: paidOrder.eventId,
          orderId: paidOrder.orderId,
          checkoutId: paidOrder.checkoutId
        }
      });

      return jsonOk(requestId, {
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

    logApiEvent("info", {
      requestId,
      route: "POST /api/webhooks/polar",
      message: "Paid order session persisted.",
      details: {
        eventId: paidOrder.eventId,
        orderId: job.orderId,
        checkoutId: job.checkoutId
      }
    });

    return jsonOk(requestId, {
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

    logApiEvent("error", {
      requestId,
      route: "POST /api/webhooks/polar",
      message,
      details: {
        status,
        eventId: paidOrder.eventId,
        orderId: paidOrder.orderId,
        checkoutId: paidOrder.checkoutId
      }
    });

    return jsonError(requestId, { status, message });
  }
}

