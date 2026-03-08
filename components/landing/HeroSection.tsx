"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "en";
  const t = useTranslations("landing.hero");

  return (
    <section className="lp-hero">
      <div className="lp-hero-visual">
        <img
          alt="Kstyleshot landing hero showing an AI-generated K-style portrait"
          className="lp-hero-img"
          fetchPriority="high"
          src="/visuals/landing/seoul-kstyle-landing-hero.webp"
        />
        <div className="lp-hero-fade" />
        <div className="lp-hero-overlay">
          <p className="lp-hero-eyebrow">{t("eyebrow")}</p>
          <h1 className="lp-hero-h1">{t("title")}</h1>
          <p className="lp-hero-sub">{t("description")}</p>
          <Link className="lp-cta-btn" href={`/${lang}/create/intro`}>
            {t("start")}
          </Link>
        </div>
      </div>
    </section>
  );
}
