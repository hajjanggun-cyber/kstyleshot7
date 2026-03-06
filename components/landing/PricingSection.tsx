"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function PricingSection() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "en";
  const t = useTranslations("landing.pricing");

  return (
    <section className="lp-pricing">
      <div className="lp-pricing-inner">
        <div>
          <p className="lp-pricing-label">Simple Pricing</p>
          <h2 className="lp-pricing-title">{t("title")}</h2>
          <p className="lp-pricing-body muted">{t("body")}</p>
          <p className="lp-pricing-note muted">{t("note")}</p>
        </div>
        <div className="lp-pricing-right">
          <span className="lp-pricing-badge">$3.99</span>
          <Link className="lp-cta-btn lp-cta-btn--sm" href={`/${lang}/create/upload`}>
            Try now →
          </Link>
        </div>
      </div>
    </section>
  );
}
