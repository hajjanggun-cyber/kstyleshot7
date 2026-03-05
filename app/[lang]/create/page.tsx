import { AgeGate } from "@/components/create/AgeGate";
import { ApiReadinessPanel } from "@/components/create/ApiReadinessPanel";
import { ConsentCheckbox } from "@/components/create/ConsentCheckbox";
import { CreateCheckoutActions } from "@/components/create/CreateCheckoutActions";
import { CreateShell } from "@/components/create/CreateShell";

type CreatePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CreatePage({ params }: CreatePageProps) {
  const { lang } = await params;
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

  return (
    <CreateShell
      blockedSteps={["outfit", "location"]}
      current="create"
      description={
        allowDemoFlow
          ? "Start checkout for the real paid flow. Development-only demo path is still available."
          : "Start checkout for the real paid flow. Production requires a verified paid session."
      }
      title="Create session"
    >
      <ApiReadinessPanel />
      <section className="card stack">
        <h2>Consent checkpoint</h2>
        <AgeGate />
        <ConsentCheckbox />
      </section>
      <section className="card stack">
        <h2>Checkout</h2>
        <CreateCheckoutActions lang={lang} />
      </section>
    </CreateShell>
  );
}
