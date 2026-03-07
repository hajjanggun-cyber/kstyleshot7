import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DisclaimerBox } from "@/components/common/DisclaimerBox";
import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteHeader } from "@/components/common/SiteHeader";
import { routing } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      {/* Sets correct lang attribute on <html> for SEO — root layout can't access [lang] param */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="${lang}"` }} />
      <div className="page-shell">
        <SiteHeader lang={lang} />
        <main className="app-main stack">{children}</main>
        <div className="app-main">
          <DisclaimerBox />
        </div>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
