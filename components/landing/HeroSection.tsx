"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "en";
  const t = useTranslations("landing.hero");

  return (
    <section className="hero card">
      <div className="hero-overlay" />
      <div className="hero-content stack">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1>
          {t("titlePrefix")} <span className="hot">K-POP</span> {t("titleSuffix")}
        </h1>
        <p className="muted">{t("description")}</p>
        <div className="actions">
          <Link className="button" href={`/${lang}/create`}>
            {t("start")}
          </Link>
          <a className="button secondary" href="#trending">
            {t("gallery")}
          </a>
        </div>
      </div>
      <div className="hero-badges" aria-hidden>
        <span>{t("badge1")}</span>
        <span>{t("badge2")}</span>
        <span>{t("badge3")}</span>
      </div>
    </section>
  );
}
