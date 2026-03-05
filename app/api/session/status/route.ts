import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
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
      status: job.status
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
