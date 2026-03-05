import {
  isLocalCheckoutFallbackEnabled,
  isLocalGenerationEnabled,
  isLocalRedisFallbackEnabled,
  isLocalRuntime
} from "@/lib/local-mode";

export type ReadinessStep = "checkout" | "session" | "hair" | "outfit" | "cutout";

export type StepReadiness = {
  step: ReadinessStep;
  ready: boolean;
  blocked: boolean;
  missingEnv: string[];
  note: string;
};

export type SystemReadiness = {
  generatedAt: string;
  environment: string;
  allReady: boolean;
  checks: Array<{ key: string; ready: boolean }>;
  steps: StepReadiness[];
};

const CHECKOUT_KEYS = ["POLAR_ACCESS_TOKEN", "POLAR_PRODUCT_ID", "NEXT_PUBLIC_APP_URL"] as const;
const SESSION_KEYS = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] as const;
const HAIR_KEYS = ["REPLICATE_API_TOKEN"] as const;

function isEnvKeyReady(key: string): boolean {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0;
}

function getMissingEnv(keys: readonly string[]): string[] {
  return keys.filter((key) => !isEnvKeyReady(key));
}

export function getSystemReadiness(): SystemReadiness {
  const localRuntime = isLocalRuntime();
  const localCheckoutFallback = isLocalCheckoutFallbackEnabled();
  const localRedisFallback = isLocalRedisFallbackEnabled();
  const localGenerationFallback = isLocalGenerationEnabled();

  const checkoutMissing = getMissingEnv(CHECKOUT_KEYS);
  const sessionMissing = getMissingEnv(SESSION_KEYS);
  const hairMissing = getMissingEnv(HAIR_KEYS);

  const checkoutReady = checkoutMissing.length === 0 || (localRuntime && localCheckoutFallback);
  const sessionReady = sessionMissing.length === 0 || (localRuntime && localRedisFallback);
  const hairReady = hairMissing.length === 0 || (localRuntime && localGenerationFallback);

  const steps: StepReadiness[] = [
    {
      step: "checkout",
      ready: checkoutReady,
      blocked: false,
      missingEnv: checkoutMissing,
      note:
        checkoutMissing.length === 0
          ? "Polar checkout creation and callback URL."
          : localCheckoutFallback
            ? "Local checkout fallback is enabled for development."
            : "Polar checkout creation and callback URL."
    },
    {
      step: "session",
      ready: sessionReady,
      blocked: false,
      missingEnv: sessionMissing,
      note:
        sessionMissing.length === 0
          ? "Webhook session handshake via Upstash Redis."
          : localRedisFallback
            ? "Local Redis fallback is enabled for development."
            : "Webhook session handshake via Upstash Redis."
    },
    {
      step: "hair",
      ready: hairReady,
      blocked: false,
      missingEnv: hairMissing,
      note:
        hairMissing.length === 0
          ? "Hair prediction start/poll via Replicate."
          : localGenerationFallback
            ? "Local generation fallback is enabled for development."
            : "Hair prediction start/poll via Replicate."
    },
    {
      step: "outfit",
      ready: false,
      blocked: true,
      missingEnv: [],
      note: "Commercially permitted outfit provider is not selected yet."
    },
    {
      step: "cutout",
      ready: false,
      blocked: true,
      missingEnv: [],
      note: "Commercially permitted cutout provider is not selected yet."
    }
  ];

  const allTrackedKeys = [...CHECKOUT_KEYS, ...SESSION_KEYS, ...HAIR_KEYS];
  const checks = allTrackedKeys.map((key) => ({
    key,
    ready: isEnvKeyReady(key)
  }));

  const allReady = steps
    .filter((step) => !step.blocked)
    .every((step) => step.ready);

  return {
    generatedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
    allReady,
    checks,
    steps
  };
}
