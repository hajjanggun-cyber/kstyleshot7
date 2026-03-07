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
      </div>
      <div className="lp-cta-wrap">
        <Link className="lp-cta-btn" href={`/${lang}/create/upload`}>
          {t("start")} →
        </Link>
      </div>
      <div className="sr-only">
        <p>{t("eyebrow")}</p>
        <p>{t("title")}</p>
        <p>{t("description")}</p>
      </div>
    </section>
  );
}
