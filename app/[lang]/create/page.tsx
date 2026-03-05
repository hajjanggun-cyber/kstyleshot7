import { AgeGate } from "@/components/create/AgeGate";
import { ApiReadinessPanel } from "@/components/create/ApiReadinessPanel";
import { ConsentCheckbox } from "@/components/create/ConsentCheckbox";
import { CreateCheckoutActions } from "@/components/create/CreateCheckoutActions";

type CreatePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CreatePage({ params }: CreatePageProps) {
  const { lang } = await params;
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

  return (
    <section className="card stack">
      <p className="muted">Step 1</p>
      <h1>Create session</h1>
      <p className="muted">
        This step starts the real checkout flow.
        {allowDemoFlow
          ? " Local demo path is available only for development testing."
          : " Production flow requires a paid checkout session."}
      </p>
      <ApiReadinessPanel />
      <AgeGate />
      <ConsentCheckbox />
      <CreateCheckoutActions lang={lang} />
    </section>
  );
}
