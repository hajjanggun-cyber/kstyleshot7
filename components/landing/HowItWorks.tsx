"use client";

import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("landing.how");

  return (
    <section className="card stack">
      <div className="section-head">
        <h2>{t("title")}</h2>
      </div>
      <p className="muted">{t("description")}</p>
      <div className="grid three">
        <article className="card stack step-card">
          <div className="step-media">
            <img alt={t("step1.title")} loading="lazy" src="/visuals/landing/how-upload.svg" />
          </div>
          <span className="step-chip">1</span>
          <strong>{t("step1.title")}</strong>
          <span className="muted">{t("step1.body")}</span>
        </article>
        <article className="card stack step-card">
          <div className="step-media">
            <img alt={t("step2.title")} loading="lazy" src="/visuals/landing/how-style.svg" />
          </div>
          <span className="step-chip">2</span>
          <strong>{t("step2.title")}</strong>
          <span className="muted">{t("step2.body")}</span>
        </article>
        <article className="card stack step-card">
          <div className="step-media">
            <img alt={t("step3.title")} loading="lazy" src="/visuals/landing/how-finish.svg" />
          </div>
          <span className="step-chip">3</span>
          <strong>{t("step3.title")}</strong>
          <span className="muted">{t("step3.body")}</span>
        </article>
      </div>
    </section>
  );
}
