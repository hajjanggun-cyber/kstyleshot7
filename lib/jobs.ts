import { NextResponse } from "next/server";

import { getRedis } from "@/lib/redis";
import type { KVJob } from "@/types";

const AUTHORIZATION_PREFIX = "Bearer ";

export function readSessionTokenFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith(AUTHORIZATION_PREFIX)) {
    return null;
  }

  return header.slice(AUTHORIZATION_PREFIX.length).trim() || null;
}

export async function getOrderIdFromSessionToken(
  sessionToken: string
): Promise<string | null> {
  const redis = getRedis();
  const orderId = await redis.get<string>(`session:${sessionToken}`);
  return orderId ?? null;
}

export async function getJobByOrderId(orderId: string): Promise<KVJob | null> {
  const redis = getRedis();
  const job = await redis.get<KVJob>(`job:${orderId}`);
  return job ?? null;
}

export async function getJobFromRequest(request: Request): Promise<KVJob | null> {
  const token = readSessionTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const orderId = await getOrderIdFromSessionToken(token);
  if (!orderId) {
    return null;
  }

  return getJobByOrderId(orderId);
}

export function jsonNotImplemented(message: string, status = 501): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      implemented: false,
      message
    },
    { status }
  );
}

