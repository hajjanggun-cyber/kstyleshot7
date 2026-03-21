import { getRedis } from "@/lib/redis";

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

/**
 * Fixed-window rate limiter backed by Upstash Redis (or in-memory fallback).
 * Not perfectly atomic under extreme concurrency, but sufficient to block bot abuse.
 */
export async function checkRateLimit(
  ip: string,
  route: string,
  limitPerMinute: number
): Promise<RateLimitResult> {
  const redis = getRedis();
  const window = Math.floor(Date.now() / 60_000); // 1-minute bucket
  const key = `rate:${route}:${ip}:${window}`;

  const current = (await redis.get<number>(key)) ?? 0;

  if (current >= limitPerMinute) {
    const secondsUntilNextWindow = 60 - (Math.floor(Date.now() / 1_000) % 60);
    return { allowed: false, retryAfterSeconds: secondsUntilNextWindow };
  }

  await redis.set(key, current + 1, { ex: 120 });
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0].trim();
  }
  return "unknown";
}
