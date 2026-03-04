const requiredPolarVars = [
  "POLAR_ACCESS_TOKEN",
  "POLAR_WEBHOOK_SECRET",
  "POLAR_PRODUCT_ID"
] as const;

export function assertPolarEnv(): void {
  for (const key of requiredPolarVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required Polar environment variable: ${key}`);
    }
  }
}

export function buildCheckoutSuccessUrl(appUrl: string, locale: string): string {
  const base = appUrl.replace(/\/$/, "");
  return `${base}/${locale}/create/upload?checkout_id={CHECKOUT_ID}`;
}

export function buildCheckoutCancelUrl(appUrl: string, locale: string): string {
  const base = appUrl.replace(/\/$/, "");
  return `${base}/${locale}/create`;
}

export function parseWebhookEvent(body: string): unknown {
  return JSON.parse(body);
}

export function isSupportedPaymentEvent(event: unknown): boolean {
  if (!event || typeof event !== "object") {
    return false;
  }

  const type = (event as { type?: string }).type;
  return type === "order.paid";
}

