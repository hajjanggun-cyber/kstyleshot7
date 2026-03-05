import { getTranslations } from "next-intl/server";

type PrivacyPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "legal.privacy" });

  return (
    <section className="card stack">
      <div className="preview-frame legal-hero">
        <img alt={t("title")} loading="lazy" src="/visuals/legal/privacy.svg" />
      </div>
      <h1>{t("title")}</h1>
      <p className="muted">{t("description")}</p>
    </section>
  );
}
