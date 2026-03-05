"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("create.preflight");
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
        throw new Error(toErrorMessage(json, t("errors.load")));
      }

      setPayload(json);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t("errors.load"));
      setPayload(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

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
        <strong>{t("title")}</strong>
        <button className="button secondary" onClick={() => void loadReadiness()} type="button">
          {isLoading ? t("refreshing") : t("refresh")}
        </button>
      </div>

      {payload ? (
        <p className="muted">
          {t("environment")}: <span className="inline-code">{payload.environment}</span>. {t("lastCheck")}:{" "}
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
                  <strong>{t(`steps.${step.step}`)}</strong>
                  <span className="muted">{step.note}</span>
                  {step.missingEnv.length > 0 ? (
                    <span className="inline-code">{t("missing")}: {step.missingEnv.join(", ")}</span>
                  ) : null}
                </div>
                <span
                  className={`status-chip ${
                    step.blocked ? "is-blocked" : step.ready ? "is-ready" : "is-missing"
                  }`}
                >
                  {step.blocked ? t("status.blocked") : step.ready ? t("status.ready") : t("status.missing")}
                </span>
              </div>
            ))}
          </div>

          {blockingSteps.length > 0 ? (
            <div className="notice">{t("notice.missing")}</div>
          ) : (
            <div className="notice">{t("notice.ready")}</div>
          )}
        </>
      ) : null}
    </section>
  );
}
