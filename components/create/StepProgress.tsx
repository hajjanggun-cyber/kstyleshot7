"use client";

import { useTranslations } from "next-intl";

export type StepKey = "create" | "upload" | "hair" | "outfit" | "location" | "done";

type StepProgressProps = {
  current: StepKey;
  blockedSteps?: StepKey[];
  compact?: boolean;
};

const steps: Array<{ key: StepKey }> = [
  { key: "create" },
  { key: "upload" },
  { key: "hair" },
  { key: "outfit" },
  { key: "location" },
  { key: "done" }
];

export function StepProgress({ current, blockedSteps = [], compact = false }: StepProgressProps) {
  const t = useTranslations("create.steps");
  const currentIndex = steps.findIndex((step) => step.key === current);

  return (
    <nav className={compact ? "step-strip is-compact" : "step-strip"} aria-label={t("ariaLabel")}>
      <div className="step-row">
        {steps.map((step, index) => {
          const isBlocked = blockedSteps.includes(step.key);
          const stateClass = isBlocked
            ? "is-blocked"
            : index < currentIndex
              ? "is-done"
              : index === currentIndex
                ? "is-current"
                : "is-upcoming";

          return (
            <div className={`step-pill ${stateClass}`} key={step.key}>
              <span className="step-number">{index + 1}</span>
              <span>{t(step.key)}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
