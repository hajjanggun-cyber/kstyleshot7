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
          <Link href={`/${lang}/terms`}>약관</Link>
          <Link href={`/${lang}/privacy`}>개인정보처리방침</Link>
          <Link href={`/${lang}/refund-policy`}>환불정책</Link>
        </nav>
        <p className="site-footer-copy">© 2026 Kstyleshot. Unofficial fan tool.</p>
      </div>
    </footer>
  );
}
