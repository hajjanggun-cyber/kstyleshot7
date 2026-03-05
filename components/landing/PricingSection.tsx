"use client";

import { useTranslations } from "next-intl";

export function PricingSection() {
  const t = useTranslations("landing.pricing");

  return (
    <section className="card stack">
      <div className="section-head">
        <h2>{t("title")}</h2>
        <span className="count-badge">$3.99</span>
      </div>
      <p>{t("body")}</p>
      <p className="muted">{t("note")}</p>
    </section>
  );
}
