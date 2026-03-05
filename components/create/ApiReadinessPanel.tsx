"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ReadinessStep = "checkout" | "session" | "hair" | "outfit" | "cutout";

type ReadinessPayload = {
  ok: true;
  generatedAt: string;
  environment: string;
  allReady: boolean;
  checks: Array<{ key: string; ready: boolean }>;
  steps: Array<{
    step: ReadinessStep;
    ready: boolean;
    blocked: boolean;
    missingEnv: string[];
    note: string;
  }>;
};

function toErrorMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

export function ApiReadinessPanel() {
  const [payload, setPayload] = useState<ReadinessPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReadiness = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/system/readiness", {
        method: "GET",
        cache: "no-store"
      });
      const json = (await response.json().catch(() => null)) as
        | ReadinessPayload
        | { ok?: false; message?: string }
        | null;

      if (!response.ok || !json || !("ok" in json) || !json.ok) {
        throw new Error(toErrorMessage(json, "Unable to load system readiness."));
      }

      setPayload(json);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load system readiness."
      );
      setPayload(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReadiness();
  }, [loadReadiness]);

  const blockingSteps = useMemo(
    () => payload?.steps.filter((step) => !step.blocked && !step.ready) ?? [],
    [payload]
  );

  return (
    <section className="card stack">
      <div className="actions">
        <strong>System preflight</strong>
        <button className="button secondary" onClick={() => void loadReadiness()} type="button">
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {payload ? (
        <p className="muted">
          Environment: <span className="inline-code">{payload.environment}</span>. Last check:{" "}
          <span className="inline-code">{payload.generatedAt}</span>.
        </p>
      ) : null}

      {errorMessage ? <div className="notice">{errorMessage}</div> : null}

      {payload ? (
        <>
          <div className="status-list">
            {payload.steps.map((step) => (
              <div className="status-row" key={step.step}>
                <div className="stack">
                  <strong>{step.step}</strong>
                  <span className="muted">{step.note}</span>
                  {step.missingEnv.length > 0 ? (
                    <span className="inline-code">Missing: {step.missingEnv.join(", ")}</span>
                  ) : null}
                </div>
                <span
                  className={`status-chip ${
                    step.blocked ? "is-blocked" : step.ready ? "is-ready" : "is-missing"
                  }`}
                >
                  {step.blocked ? "blocked" : step.ready ? "ready" : "missing"}
                </span>
              </div>
            ))}
          </div>

          {blockingSteps.length > 0 ? (
            <div className="notice">
              Complete the missing keys above before running full checkout-to-hair E2E.
            </div>
          ) : (
            <div className="notice">Checkout, session, and hair prerequisites are ready.</div>
          )}
        </>
      ) : null}
    </section>
  );
}
