import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations({ locale: lang, namespace: "create.page" });
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

  return (
    <CreateShell
      blockedSteps={["outfit", "location"]}
      current="create"
      description={allowDemoFlow ? t("descriptionDemo") : t("descriptionProd")}
      title={t("title")}
    >
      <ApiReadinessPanel />
      <section className="card stack">
        <h2>{t("consentTitle")}</h2>
        <AgeGate />
        <ConsentCheckbox />
      </section>
      <section className="card stack">
        <h2>{t("checkoutTitle")}</h2>
        <CreateCheckoutActions lang={lang} />
      </section>
    </CreateShell>
  );
}
