"use client";

import { useTranslations } from "next-intl";

const TRANSFORMATIONS = [
  {
    title: "Midnight Seoul Palace",
    subtitle: "Cyberpunk Hanbok Style",
    accentColor: "#FF4EBD",
    afterSrc: "/visuals/landing/trend-cyber.svg",
    likes: "4.8k",
  },
  {
    title: "Vocalist Stage Red",
    subtitle: "Elegant Concert Look",
    accentColor: "#9D50FF",
    afterSrc: "/visuals/landing/trend-soft.svg",
    likes: "3.2k",
  },
  {
    title: "Street Idol Vibe",
    subtitle: "Urban K-Fashion",
    accentColor: "#FF834E",
    afterSrc: "/visuals/landing/trend-street.svg",
    likes: "2.1k",
  },
];

export function GalleryTabs() {
  const t = useTranslations("landing.trending");

  return (
    <section className="lp-gallery" id="trending">
      <div className="lp-gallery-head">
        <div>
          <h2 className="lp-gallery-title">{t("sectionTitle")}</h2>
          <p className="lp-gallery-sub">K-Idol Editorial Picks</p>
        </div>
        <span className="lp-gallery-more">{t("explore")} ›</span>
      </div>
      <div className="lp-gallery-scroll">
        {TRANSFORMATIONS.map((item, i) => (
          <div className="lp-transform-card lp-glass" key={i}>
            <div className="lp-transform-imgs">
              <div className="lp-transform-before">
                <span className="lp-transform-label">Base</span>
              </div>
              <div
                className="lp-transform-after"
                style={{ borderColor: `${item.accentColor}55` }}
              >
                <img alt={item.title} loading="lazy" src={item.afterSrc} />
                <span
                  className="lp-transform-label lp-transform-label--result"
                  style={{ background: item.accentColor }}
                >
                  Result
                </span>
              </div>
            </div>
            <div className="lp-transform-info">
              <div>
                <p className="lp-transform-name">{item.title}</p>
                <p className="lp-transform-style" style={{ color: item.accentColor }}>
                  {item.subtitle}
                </p>
              </div>
              <div className="lp-transform-likes">
                <span>♥</span>
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
