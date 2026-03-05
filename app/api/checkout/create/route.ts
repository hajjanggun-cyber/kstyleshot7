import { randomUUID } from "node:crypto";

import { getRequestId, jsonError, jsonOk, logApiEvent } from "@/lib/api-response";
import { isLocalCheckoutFallbackEnabled } from "@/lib/local-mode";
import {
  PolarApiError,
  createConfirmedJob,
  createPolarCheckout,
  createSessionToken,
  getCheckoutTtlSeconds,
  normalizeLocale
} from "@/lib/polar";
import { getRedis } from "@/lib/redis";

function hasPolarCheckoutEnv(): boolean {
  return Boolean(
    process.env.POLAR_ACCESS_TOKEN?.trim() &&
    process.env.POLAR_PRODUCT_ID?.trim()
  );
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const payload = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = normalizeLocale(payload.locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const baseUrl = appUrl.replace(/\/$/, "");
  const canUseLocalFallback = isLocalCheckoutFallbackEnabled();

  if (!hasPolarCheckoutEnv() && canUseLocalFallback) {
    try {
      const redis = getRedis();
      const checkoutId = `local-checkout-${randomUUID()}`;
      const orderId = `local-order-${randomUUID()}`;
      const sessionToken = createSessionToken();
      const ttlSeconds = getCheckoutTtlSeconds();
      const job = createConfirmedJob({
        orderId,
        checkoutId,
        sessionToken
      });

      await redis.set(`checkout:${checkoutId}`, orderId, { ex: ttlSeconds });
      await redis.set(`session:${sessionToken}`, orderId, { ex: ttlSeconds });
      await redis.set(`job:${orderId}`, job, { ex: ttlSeconds });

      const checkoutUrl = `${baseUrl}/${locale}/create/upload?checkout_id=${encodeURIComponent(checkoutId)}`;

      logApiEvent("warn", {
        requestId,
        route: "POST /api/checkout/create",
        message: "Using local checkout fallback because Polar env is missing.",
        details: {
          locale,
          checkoutId,
          orderId
        }
      });

      return jsonOk(requestId, {
        ok: true,
        checkoutId,
        checkoutUrl,
        mode: "local_fallback"
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create a local fallback checkout.";

      logApiEvent("error", {
        requestId,
        route: "POST /api/checkout/create",
        message,
        details: {
          mode: "local_fallback"
        }
      });

      return jsonError(requestId, {
        status: 500,
        message
      });
    }
  }

  try {
    const checkout = await createPolarCheckout({
      appUrl,
      locale
    });

    logApiEvent("info", {
      requestId,
      route: "POST /api/checkout/create",
      message: "Checkout session created.",
      details: {
        locale,
        checkoutId: checkout.checkoutId
      }
    });

    return jsonOk(requestId, {
      ok: true,
      checkoutId: checkout.checkoutId,
      checkoutUrl: checkout.checkoutUrl
    });
  } catch (error) {
    const status =
      error instanceof PolarApiError ? error.status : error instanceof Error ? 500 : 500;
    const message =
      error instanceof Error ? error.message : "Unable to create a Polar checkout right now.";

    logApiEvent("error", {
      requestId,
      route: "POST /api/checkout/create",
      message,
      details: {
        status
      }
    });

    return jsonError(requestId, { status, message });
  }
}

