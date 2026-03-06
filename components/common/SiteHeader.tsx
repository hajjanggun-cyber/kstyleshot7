"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type SiteHeaderProps = {
  lang: string;
};

export function SiteHeader({ lang }: SiteHeaderProps) {
  const t = useTranslations("header");

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" href={`/${lang}`}>
          <span className="brand-dot" aria-hidden>
            *
          </span>
          <strong>K-StyleMagic</strong>
        </Link>
        <nav className="site-nav" aria-label={t("ariaLabel")}>
          <Link href={`/${lang}`}>{t("home")}</Link>
          <Link href={`/${lang}/hub`}>{t("lookbook")}</Link>
          <Link href={`/${lang}/create/upload`}>{t("create")}</Link>
        </nav>
        <div className="site-actions" aria-hidden>
          <span className="icon-dot" />
          <span className="icon-dot" />
        </div>
      </div>
    </header>
  );
}
