import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

const requiredRedisVars = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN"
] as const;

export function assertRedisEnv(): void {
  for (const key of requiredRedisVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required Redis environment variable: ${key}`);
    }
  }
}

export function getRedis(): Redis {
  if (redisClient) {
    return redisClient;
  }

  assertRedisEnv();
  redisClient = Redis.fromEnv();
  return redisClient;
}

