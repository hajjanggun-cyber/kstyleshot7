"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function SiteFooter() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="site-footer-nav">
          <Link href={`/${lang}/about`}>
            {lang === "ko" ? "소개" : "About"}
          </Link>
          <Link href={`/${lang}/contact`}>
            {lang === "ko" ? "문의하기" : "Contact"}
          </Link>
          <Link href={`/${lang}/terms`}>
            {lang === "ko" ? "약관" : "Terms"}
          </Link>
          <Link href={`/${lang}/privacy`}>
            {lang === "ko" ? "개인정보처리방침" : "Privacy Policy"}
          </Link>
          <Link href={`/${lang}/refund-policy`}>
            {lang === "ko" ? "환불정책" : "Refund Policy"}
          </Link>
        </nav>
        <p className="site-footer-copy">
          © 2026 Kstyleshot. Seoul, K-beauty, and K-fashion editorial guides.
        </p>
      </div>
    </footer>
  );
}
