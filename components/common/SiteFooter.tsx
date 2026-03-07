"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const t = useTranslations("header");

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="site-footer-nav">
          <Link href={`/${lang}/terms`}>{t("terms")}</Link>
          <Link href={`/${lang}/privacy`}>
            {lang === "ko" ? "개인정보처리방침" : "Privacy Policy"}
          </Link>
          <Link href={`/${lang}/refund-policy`}>
            {lang === "ko" ? "환불정책" : "Refund Policy"}
          </Link>
        </nav>
        <p className="site-footer-copy">© 2026 Kstyleshot. Unofficial fan tool.</p>
      </div>
    </footer>
  );
}
