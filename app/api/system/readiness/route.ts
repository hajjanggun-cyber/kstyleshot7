import { NextResponse } from "next/server";

import { getSystemReadiness } from "@/lib/env-readiness";

export const maxDuration = 15;

export async function GET() {
  return NextResponse.json({
    ok: true,
    ...getSystemReadiness()
  });
}
