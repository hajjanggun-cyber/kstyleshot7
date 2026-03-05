export type StepKey = "create" | "upload" | "hair" | "outfit" | "location" | "done";

type StepProgressProps = {
  current: StepKey;
  blockedSteps?: StepKey[];
  compact?: boolean;
};

const steps: Array<{ key: StepKey; label: string }> = [
  { key: "create", label: "Create" },
  { key: "upload", label: "Upload" },
  { key: "hair", label: "Hair" },
  { key: "outfit", label: "Outfit" },
  { key: "location", label: "Background" },
  { key: "done", label: "Done" }
];

export function StepProgress({ current, blockedSteps = [], compact = false }: StepProgressProps) {
  const currentIndex = steps.findIndex((step) => step.key === current);

  return (
    <nav className={compact ? "step-strip is-compact" : "step-strip"} aria-label="Create flow steps">
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
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
