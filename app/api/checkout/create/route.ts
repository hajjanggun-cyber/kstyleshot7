import { NextResponse } from "next/server";

import {
  assertPolarEnv,
  buildCheckoutCancelUrl,
  buildCheckoutSuccessUrl
} from "@/lib/polar";
import { jsonNotImplemented } from "@/lib/jobs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = payload.locale ?? "en";

  try {
    assertPolarEnv();
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: (error as Error).message },
      { status: 500 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return jsonNotImplemented(
    `Create a Polar checkout here. successUrl=${buildCheckoutSuccessUrl(
      appUrl,
      locale
    )} cancelUrl=${buildCheckoutCancelUrl(appUrl, locale)}`
  );
}

