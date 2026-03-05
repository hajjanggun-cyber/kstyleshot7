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
          <div className="trend-media">
            <img alt={t("item1.name")} loading="lazy" src="/visuals/landing/trend-cyber.svg" />
          </div>
          <div className="trend-copy">
            <strong>{t("item1.name")}</strong>
            <span>{t("item1.uses")}</span>
          </div>
        </article>
        <article className="trend-card trend-soft">
          <div className="trend-media">
            <img alt={t("item2.name")} loading="lazy" src="/visuals/landing/trend-soft.svg" />
          </div>
          <div className="trend-copy">
            <strong>{t("item2.name")}</strong>
            <span>{t("item2.uses")}</span>
          </div>
        </article>
        <article className="trend-card trend-street">
          <div className="trend-media">
            <img alt={t("item3.name")} loading="lazy" src="/visuals/landing/trend-street.svg" />
          </div>
          <div className="trend-copy">
            <strong>{t("item3.name")}</strong>
            <span>{t("item3.uses")}</span>
          </div>
        </article>
        <article className="trend-card trend-clean">
          <div className="trend-media">
            <img alt={t("item4.name")} loading="lazy" src="/visuals/landing/trend-clean.svg" />
          </div>
          <div className="trend-copy">
            <strong>{t("item4.name")}</strong>
            <span>{t("item4.uses")}</span>
          </div>
        </article>
      </div>
    </section>
  );
}
