import { FinalResult } from "@/components/create/FinalResult";
import { StepProgress } from "@/components/create/StepProgress";

export default function DonePage() {
  return (
    <div className="stack">
      <StepProgress current="done" />
      <FinalResult />
    </div>
  );
}

