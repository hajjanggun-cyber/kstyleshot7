"use client";

import { useTranslations } from "next-intl";

export function GalleryTabs() {
  const t = useTranslations("landing.trending");

  return (
    <section className="card stack" id="trending">
      <div className="section-head">
        <h2>{t("title")}</h2>
        <span className="muted">{t("explore")}</span>
      </div>
      <div className="grid four">
        <article className="trend-card trend-cyber">
          <strong>{t("item1.name")}</strong>
          <span>{t("item1.uses")}</span>
        </article>
        <article className="trend-card trend-soft">
          <strong>{t("item2.name")}</strong>
          <span>{t("item2.uses")}</span>
        </article>
        <article className="trend-card trend-street">
          <strong>{t("item3.name")}</strong>
          <span>{t("item3.uses")}</span>
        </article>
        <article className="trend-card trend-clean">
          <strong>{t("item4.name")}</strong>
          <span>{t("item4.uses")}</span>
        </article>
      </div>
    </section>
  );
}
