import { Redis } from "@upstash/redis";

import { isLocalRedisFallbackEnabled } from "@/lib/local-mode";

type RedisSetOptions = {
  ex?: number;
  nx?: boolean;
};

export type RedisLike = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, options?: RedisSetOptions): Promise<"OK" | null>;
  del(...keys: string[]): Promise<number>;
};

type LocalRedisEntry = {
  value: unknown;
  expiresAtMs: number | null;
};

let redisClient: RedisLike | null = null;
const localStore = new Map<string, LocalRedisEntry>();

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

function hasRedisEnv(): boolean {
  return requiredRedisVars.every((key) => {
    const value = process.env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

function isExpired(entry: LocalRedisEntry): boolean {
  return typeof entry.expiresAtMs === "number" && entry.expiresAtMs <= Date.now();
}

function getLocalEntry(key: string): LocalRedisEntry | null {
  const entry = localStore.get(key);
  if (!entry) {
    return null;
  }

  if (isExpired(entry)) {
    localStore.delete(key);
    return null;
  }

  return entry;
}

function createLocalRedisClient(): RedisLike {
  return {
    async get<T>(key: string): Promise<T | null> {
      const entry = getLocalEntry(key);
      return entry ? (entry.value as T) : null;
    },
    async set(
      key: string,
      value: unknown,
      options?: RedisSetOptions
    ): Promise<"OK" | null> {
      const current = getLocalEntry(key);

      if (options?.nx && current) {
        return null;
      }

      const expiresAtMs =
        typeof options?.ex === "number" && Number.isFinite(options.ex) && options.ex > 0
          ? Date.now() + Math.floor(options.ex * 1000)
          : null;

      localStore.set(key, {
        value,
        expiresAtMs
      });

      return "OK";
    },
    async del(...keys: string[]): Promise<number> {
      let deleted = 0;

      for (const key of keys) {
        if (localStore.delete(key)) {
          deleted += 1;
        }
      }

      return deleted;
    }
  };
}

export function getRedis(): RedisLike {
  if (redisClient) {
    return redisClient;
  }

  if (hasRedisEnv()) {
    redisClient = Redis.fromEnv() as unknown as RedisLike;
    return redisClient;
  }

  if (isLocalRedisFallbackEnabled()) {
    redisClient = createLocalRedisClient();
    return redisClient;
  }

  assertRedisEnv();
  redisClient = Redis.fromEnv() as unknown as RedisLike;
  return redisClient;
}

