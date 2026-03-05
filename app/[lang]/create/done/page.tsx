import { CreateShell } from "@/components/create/CreateShell";
import { FinalResult } from "@/components/create/FinalResult";

export default function DonePage() {
  return (
    <CreateShell
      current="done"
      description="Download your final image or clear local data to start a new session."
      title="You look amazing"
    >
      <FinalResult />
    </CreateShell>
  );
}
