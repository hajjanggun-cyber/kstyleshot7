import { NextResponse } from "next/server";

import {
  PolarApiError,
  createPolarCheckout,
  normalizeLocale
} from "@/lib/polar";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = normalizeLocale(payload.locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const checkout = await createPolarCheckout({
      appUrl,
      locale
    });

    return NextResponse.json({
      ok: true,
      checkoutId: checkout.checkoutId,
      checkoutUrl: checkout.checkoutUrl
    });
  } catch (error) {
    const status =
      error instanceof PolarApiError ? error.status : error instanceof Error ? 500 : 500;
    const message =
      error instanceof Error ? error.message : "Unable to create a Polar checkout right now.";

    return NextResponse.json({ ok: false, message }, { status });
  }
}

