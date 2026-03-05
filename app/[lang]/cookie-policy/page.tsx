import { getTranslations } from "next-intl/server";

type CookiePolicyPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CookiePolicyPage({ params }: CookiePolicyPageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "legal.cookie" });

  return (
    <section className="card stack">
      <div className="preview-frame legal-hero">
        <img alt={t("title")} loading="lazy" src="/visuals/legal/cookie.svg" />
      </div>
      <h1>{t("title")}</h1>
      <p className="muted">{t("description")}</p>
    </section>
  );
}
