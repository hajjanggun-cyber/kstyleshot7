import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type CookiePolicyPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: CookiePolicyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const canonical = toAbsoluteUrl(`/${lang}/cookie-policy`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/cookie-policy`);
  return {
    alternates: { canonical, languages },
  };
}

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
