import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
import { getRedis } from "@/lib/redis";
import { getJobFromRequest } from "@/lib/jobs";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const job = await getJobFromRequest(request);
  if (!job) {
    return jsonError(requestId, { status: 401, message: "Unauthorized." });
  }

  const redis = getRedis();

  await redis.del(`job:${job.orderId}`);
  await redis.del(`session:${job.sessionToken}`);
  await redis.del(`checkout:${job.checkoutId}`);

  logApiEvent("info", {
    requestId,
    route: "POST /api/data/delete",
    message: "Server-side session keys deleted.",
    details: {
      orderId: job.orderId,
      checkoutId: job.checkoutId
    }
  });

  return jsonOk(requestId, {
    ok: true,
    deleted: true,
    message: "Server-side session keys were removed. The client must revoke Blob URLs."
  });
}
