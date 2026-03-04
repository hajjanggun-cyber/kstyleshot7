import Link from "next/link";

import { AgeGate } from "@/components/create/AgeGate";
import { ConsentCheckbox } from "@/components/create/ConsentCheckbox";

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
        The payment backend is still a placeholder. You can enter the full UX flow now in local
        demo mode and wire the real Polar checkout next.
      </p>
      <AgeGate />
      <ConsentCheckbox />
      <div className="actions">
        <Link className="button" href={`/${lang}/create/upload`}>
          Open local demo flow
        </Link>
        <button className="button secondary" type="button">
          Wire Polar checkout next
        </button>
      </div>
    </section>
  );
}
