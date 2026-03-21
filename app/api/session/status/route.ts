import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
import {
  createConfirmedJob,
  createSessionToken,
  fetchPolarCheckoutOrder,
  getCheckoutTtlSeconds
} from "@/lib/polar";
import { getRedis } from "@/lib/redis";
import type { KVJob, SessionStatusResponse } from "@/types";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const { searchParams } = new URL(request.url);
  const checkoutId = searchParams.get("checkoutId") ?? searchParams.get("checkout_id");

  if (!checkoutId) {
    return jsonError(requestId, {
      status: 400,
      message: "checkoutId is required."
    });
  }

  try {
    const redis = getRedis();
    const orderId = await redis.get<string>(`checkout:${checkoutId}`);

    if (!orderId) {
      // Webhook may not have arrived yet — fall back to direct Polar API check
      try {
        const polarOrder = await fetchPolarCheckoutOrder(checkoutId);
        if (polarOrder) {
          const sessionToken = createSessionToken();
          const job = createConfirmedJob({
            orderId: polarOrder.orderId,
            checkoutId,
            sessionToken,
            customerEmail: polarOrder.customerEmail
          });
          const ttl = getCheckoutTtlSeconds();
          await redis.set(`checkout:${checkoutId}`, job.orderId, { ex: ttl });
          await redis.set(`session:${job.sessionToken}`, job.orderId, { ex: ttl });
          await redis.set(`job:${job.orderId}`, job, { ex: ttl });

          logApiEvent("info", {
            requestId,
            route: "GET /api/session/status",
            message: "Session created via Polar API fallback.",
            details: { checkoutId, orderId: job.orderId }
          });

          const ready: SessionStatusResponse = {
            ready: true,
            orderId: job.orderId,
            sessionToken: job.sessionToken,
            status: job.status,
            customerEmail: job.customerEmail ? "registered" : null
          };
          return jsonOk(requestId, ready);
        }
      } catch {
        // Fallback failed — continue to pending response
      }

      const response: SessionStatusResponse = {
        ready: false,
        status: "pending"
      };
      return jsonOk(requestId, response, 202);
    }

    const job = await redis.get<KVJob>(`job:${orderId}`);
    if (!job) {
      const response: SessionStatusResponse = {
        ready: false,
        status: "pending"
      };
      return jsonOk(requestId, response, 202);
    }

    const response: SessionStatusResponse = {
      ready: true,
      orderId: job.orderId,
      sessionToken: job.sessionToken,
      status: job.status,
      customerEmail: job.customerEmail ?? null
    };

    logApiEvent("info", {
      requestId,
      route: "GET /api/session/status",
      message: "Session ready.",
      details: {
        checkoutId,
        orderId: job.orderId,
        status: job.status
      }
    });

    return jsonOk(requestId, response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to read the current session state.";

    logApiEvent("error", {
      requestId,
      route: "GET /api/session/status",
      message,
      details: {
        checkoutId
      }
    });

    return jsonError(requestId, {
      status: 500,
      message
    });
  }
}
