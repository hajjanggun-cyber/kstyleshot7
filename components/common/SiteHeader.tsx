"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type SiteHeaderProps = {
  lang: string;
};

export function SiteHeader({ lang }: SiteHeaderProps) {
  const t = useTranslations("header");
  const pathname = usePathname();

  function switchLang(next: string) {
    // Replace the leading /lang segment with /next
    return pathname.replace(/^\/[^/]+/, `/${next}`);
  }

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
        <div className="lang-toggle" role="group" aria-label="Language">
          <Link
            className={`lang-toggle-btn${lang === "ko" ? " lang-toggle-btn--active" : ""}`}
            href={switchLang("ko")}
            aria-current={lang === "ko" ? "true" : undefined}
          >
            KO
          </Link>
          <span className="lang-toggle-sep" aria-hidden>|</span>
          <Link
            className={`lang-toggle-btn${lang === "en" ? " lang-toggle-btn--active" : ""}`}
            href={switchLang("en")}
            aria-current={lang === "en" ? "true" : undefined}
          >
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
