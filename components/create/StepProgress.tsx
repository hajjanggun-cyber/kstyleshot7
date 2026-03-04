type StepKey = "upload" | "hair" | "outfit" | "location" | "done";

type StepProgressProps = {
  current: StepKey;
};

const steps: StepKey[] = ["upload", "hair", "outfit", "location", "done"];

export function StepProgress({ current }: StepProgressProps) {
  return (
    <nav className="card step-strip">
      <div className="step-row">
        {steps.map((step) => (
          <div
            className={step === current ? "step-pill is-current" : "step-pill"}
            key={step}
          >
            {step}
          </div>
        ))}
      </div>
    </nav>
  );
}
