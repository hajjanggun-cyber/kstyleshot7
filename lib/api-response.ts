import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

type LogLevel = "info" | "warn" | "error";

function sanitize(value: string): string {
  return value.replace(/[^\w.\-:/]/g, "_");
}

export function getRequestId(request: Request): string {
  const fromHeader =
    request.headers.get("x-request-id") ??
    request.headers.get("x-correlation-id") ??
    "";
  const safeHeader = sanitize(fromHeader.trim());
  return safeHeader || randomUUID();
}

export function jsonOk<T extends Record<string, unknown>>(
  requestId: string,
  body: T,
  status = 200
): NextResponse {
  return NextResponse.json(
    {
      ...body,
      requestId
    },
    { status }
  );
}

export function jsonError(
  requestId: string,
  input: {
    status: number;
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  }
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      message: input.message,
      code: input.code,
      ...input.details,
      requestId
    },
    { status: input.status }
  );
}

export function logApiEvent(
  level: LogLevel,
  input: {
    requestId: string;
    route: string;
    message: string;
    details?: Record<string, unknown>;
  }
): void {
  const payload = JSON.stringify({
    level,
    route: input.route,
    requestId: input.requestId,
    message: input.message,
    ...input.details
  });

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}
