import { randomUUID } from "node:crypto";
import { Webhook, WebhookVerificationError as StdWebhookVerificationError } from "standardwebhooks";

import type { KVJob, Locale } from "@/types";

const requiredCheckoutVars = ["POLAR_ACCESS_TOKEN", "POLAR_PRODUCT_ID"] as const;
const requiredWebhookVars = ["POLAR_WEBHOOK_SECRET"] as const;

const POLAR_API_BASE_URL = process.env.POLAR_API_BASE_URL ?? "https://api.polar.sh";
const CHECKOUT_TTL_SECONDS = 60 * 60 * 24;
const WEBHOOK_EVENT_TTL_SECONDS = 60 * 60 * 24 * 7;

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertEnv(keys: readonly string[], scope: string): void {
  for (const key of keys) {
    if (!process.env[key]) {
      throw new Error(`Missing required ${scope} environment variable: ${key}`);
    }
  }
}

function getNestedValue(value: unknown, path: readonly string[]): unknown {
  let current: unknown = value;

  for (const segment of path) {
    if (!isRecord(current)) {
      return null;
    }

    current = current[segment];
  }

  return current;
}

function pickString(value: unknown, paths: ReadonlyArray<readonly string[]>): string | null {
  for (const path of paths) {
    const candidate = getNestedValue(value, path);
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}



async function parsePolarJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new PolarApiError("Polar returned a non-JSON response.", 502);
  }
}

function extractCheckoutSession(payload: unknown): { checkoutId: string; checkoutUrl: string } {
  const checkoutId = pickString(payload, [
    ["id"],
    ["data", "id"],
    ["result", "id"]
  ]);

  const checkoutUrl = pickString(payload, [
    ["url"],
    ["data", "url"],
    ["result", "url"],
    ["checkoutUrl"],
    ["data", "checkoutUrl"]
  ]);

  if (!checkoutId || !checkoutUrl) {
    throw new PolarApiError("Polar checkout response is missing id or url.", 502);
  }

  return { checkoutId, checkoutUrl };
}

export class PolarApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "PolarApiError";
    this.status = status;
  }
}

export function assertPolarCheckoutEnv(): void {
  assertEnv(requiredCheckoutVars, "Polar checkout");
}

export function assertPolarWebhookEnv(): void {
  assertEnv(requiredWebhookVars, "Polar webhook");
}

export function assertPolarEnv(): void {
  assertPolarCheckoutEnv();
  assertPolarWebhookEnv();
}

export function normalizeLocale(locale: string | null | undefined): Locale {
  return locale === "ko" ? "ko" : "en";
}

export function getCheckoutTtlSeconds(): number {
  return CHECKOUT_TTL_SECONDS;
}

export function getWebhookEventTtlSeconds(): number {
  return WEBHOOK_EVENT_TTL_SECONDS;
}

export function buildCheckoutSuccessUrl(appUrl: string, locale: string): string {
  const base = appUrl.replace(/\/$/, "");
  const safeLocale = normalizeLocale(locale);
  return `${base}/${safeLocale}/create/upload?checkout_id={CHECKOUT_ID}`;
}

export function buildCheckoutCancelUrl(appUrl: string, locale: string): string {
  const base = appUrl.replace(/\/$/, "");
  const safeLocale = normalizeLocale(locale);
  return `${base}/${safeLocale}/create`;
}

export async function createPolarCheckout(input: {
  appUrl: string;
  locale: string;
}): Promise<{ checkoutId: string; checkoutUrl: string }> {
  assertPolarCheckoutEnv();

  const locale = normalizeLocale(input.locale);
  const response = await fetch(`${POLAR_API_BASE_URL.replace(/\/$/, "")}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      products: [process.env.POLAR_PRODUCT_ID],
      success_url: buildCheckoutSuccessUrl(input.appUrl, locale),
      cancel_url: buildCheckoutCancelUrl(input.appUrl, locale),
      metadata: {
        locale
      }
    })
  }).catch(() => {
    throw new PolarApiError("Unable to reach Polar checkout API.", 502);
  });

  const payload = await parsePolarJson(response);

  if (!response.ok) {
    const message =
      pickString(payload, [["detail"], ["error"], ["message"]]) ??
      `Polar checkout request failed with status ${response.status}.`;
    throw new PolarApiError(message, response.status >= 400 && response.status < 500 ? 400 : 502);
  }

  return extractCheckoutSession(payload);
}

export function parseWebhookEvent(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    throw new PolarApiError("Webhook payload is not valid JSON.", 400);
  }
}

export function verifyPolarWebhookSignature(input: {
  body: string;
  headers: Headers;
}): void {
  assertPolarWebhookEnv();

  const rawSecret = process.env.POLAR_WEBHOOK_SECRET!;
  // polar_whs_ and whsec_ both store base64-encoded key — normalize to whsec_ for standardwebhooks
  const normalizedSecret = rawSecret.startsWith("polar_whs_")
    ? "whsec_" + rawSecret.slice(10)
    : rawSecret;

  try {
    const wh = new Webhook(normalizedSecret);
    wh.verify(input.body, {
      "webhook-id": input.headers.get("webhook-id") ?? "",
      "webhook-timestamp": input.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": input.headers.get("webhook-signature") ?? "",
    });
  } catch (error) {
    if (error instanceof StdWebhookVerificationError) {
      throw new PolarApiError(`Webhook verification failed: ${error.message}`, 401);
    }
    throw error;
  }
}

export function isSupportedPaymentEvent(event: unknown): boolean {
  if (!isRecord(event)) {
    return false;
  }

  return event.type === "order.paid";
}

export function extractPaidOrder(input: unknown): {
  eventId: string;
  orderId: string;
  checkoutId: string;
  customerEmail: string | null;
} | null {
  if (!isSupportedPaymentEvent(input)) {
    return null;
  }

  const orderId = pickString(input, [
    ["data", "order", "id"],
    ["data", "orderId"],
    ["data", "id"]
  ]);

  const checkoutId = pickString(input, [
    ["data", "checkout", "id"],
    ["data", "checkoutId"],
    ["data", "checkout_id"],
    ["data", "order", "checkout", "id"],
    ["data", "order", "checkoutId"],
    ["data", "order", "checkout_id"]
  ]);

  if (!orderId || !checkoutId) {
    return null;
  }

  const eventId =
    pickString(input, [["id"], ["eventId"]]) ?? `order.paid:${orderId}:${checkoutId}`;

  const customerEmail = pickString(input, [
    ["data", "customer", "email"],
    ["data", "order", "customer", "email"],
    ["data", "order", "billing_email"],
    ["data", "checkout", "customer_email"],
    ["data", "customer_email"],
    ["data", "email"]
  ]);

  return {
    eventId,
    orderId,
    checkoutId,
    customerEmail
  };
}

export async function fetchPolarCheckoutOrder(checkoutId: string): Promise<{
  orderId: string;
  customerEmail: string | null;
} | null> {
  assertPolarCheckoutEnv();

  const response = await fetch(
    `${POLAR_API_BASE_URL.replace(/\/$/, "")}/v1/checkouts/${encodeURIComponent(checkoutId)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`
      }
    }
  ).catch(() => null);

  if (!response || !response.ok) return null;

  const payload = await parsePolarJson(response).catch(() => null);
  if (!isRecord(payload)) return null;

  const status = pickString(payload, [["status"]]);
  if (status !== "succeeded") return null;

  const orderId = pickString(payload, [
    ["order", "id"],
    ["orderId"]
  ]);

  if (!orderId) return null;

  const customerEmail = pickString(payload, [
    ["customer", "email"],
    ["customer_email"],
    ["order", "customer", "email"],
    ["order", "billing_email"]
  ]);

  return { orderId, customerEmail };
}

export async function createPolarRefund(polarOrderId: string): Promise<void> {
  assertPolarCheckoutEnv();

  const response = await fetch(`${POLAR_API_BASE_URL.replace(/\/$/, "")}/v1/refunds`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ order_id: polarOrderId, reason: "other" })
  }).catch(() => {
    throw new PolarApiError("Unable to reach Polar refund API.", 502);
  });

  if (!response.ok) {
    const payload = await parsePolarJson(response).catch(() => null);
    const message =
      pickString(payload, [["detail"], ["error"], ["message"]]) ??
      `Polar refund failed with status ${response.status}.`;
    throw new PolarApiError(message, response.status >= 400 && response.status < 500 ? 400 : 502);
  }
}

export function createSessionToken(): string {
  return randomUUID();
}

export function createConfirmedJob(input: {
  orderId: string;
  checkoutId: string;
  sessionToken: string;
  customerEmail?: string | null;
  now?: Date;
}): KVJob {
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + CHECKOUT_TTL_SECONDS * 1000);
  const timestamp = now.toISOString();

  return {
    orderId: input.orderId,
    checkoutId: input.checkoutId,
    sessionToken: input.sessionToken,
    customerEmail: input.customerEmail ?? null,
    status: "payment_confirmed",
    currentStep: null,
    selectedStyles: {
      hair: [],
      outfit: [],
      location: []
    },
    pickedStyles: {
      hair: null,
      outfit: null,
      location: null
    },
    generatedResults: {
      hair: [],
      outfit: [],
      cutout: [],
      location: []
    },
    predictionIds: {
      hair: [],
      outfit: [],
      cutout: []
    },
    attempts: {
      hair: 0,
      outfit: 0,
      cutout: 0
    },
    failReason: null,
    refundRequested: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: expiresAt.toISOString()
  };
}

