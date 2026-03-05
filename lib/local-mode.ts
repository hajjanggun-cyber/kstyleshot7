export function isLocalRuntime(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function isLocalRedisFallbackEnabled(): boolean {
  return isLocalRuntime() && process.env.KSTYLESHOT_LOCAL_REDIS !== "0";
}

export function isLocalCheckoutFallbackEnabled(): boolean {
  return isLocalRuntime() && process.env.KSTYLESHOT_LOCAL_CHECKOUT !== "0";
}

export function isLocalGenerationEnabled(): boolean {
  return isLocalRuntime() && process.env.KSTYLESHOT_DISABLE_LOCAL_GENERATION !== "1";
}
