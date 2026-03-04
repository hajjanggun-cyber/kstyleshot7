import { AgeGate } from "@/components/create/AgeGate";
import { ConsentCheckbox } from "@/components/create/ConsentCheckbox";
import { CreateCheckoutActions } from "@/components/create/CreateCheckoutActions";

type CreatePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CreatePage({ params }: CreatePageProps) {
  const { lang } = await params;

  return (
    <section className="card stack">
      <p className="muted">Step 1</p>
      <h1>Create session</h1>
      <p className="muted">
        This step can now start a real checkout flow. The local demo path is still available when
        you want to test the front-end without live credentials.
      </p>
      <AgeGate />
      <ConsentCheckbox />
      <CreateCheckoutActions lang={lang} />
    </section>
  );
}
