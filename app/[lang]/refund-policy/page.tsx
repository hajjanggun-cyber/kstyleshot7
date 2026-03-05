import { getTranslations } from "next-intl/server";

type RefundPolicyPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function RefundPolicyPage({ params }: RefundPolicyPageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "legal.refund" });

  return (
    <section className="card stack">
      <h1>{t("title")}</h1>
      <p className="muted">{t("description")}</p>
    </section>
  );
}
