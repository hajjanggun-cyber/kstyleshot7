import { NextResponse } from "next/server";

import { isSupportedPaymentEvent, parseWebhookEvent } from "@/lib/polar";
import { jsonNotImplemented } from "@/lib/jobs";

export const maxDuration = 30;

export async function POST(request: Request) {
  const body = await request.text();
  const event = parseWebhookEvent(body);

  if (!isSupportedPaymentEvent(event)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  return jsonNotImplemented(
    "Validate the Polar webhook with the SDK, then create checkout:, session:, and job: keys."
  );
}

