import { getTranslations } from "next-intl/server";

type TermsPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "legal.terms" });

  return (
    <section className="card stack">
      <div className="preview-frame legal-hero">
        <img alt={t("title")} loading="lazy" src="/visuals/legal/terms.svg" />
      </div>
      <h1>{t("title")}</h1>
      <p className="muted">{t("description")}</p>
    </section>
  );
}
