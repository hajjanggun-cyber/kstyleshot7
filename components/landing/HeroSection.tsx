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
          alt="Kstyleshot – AI K-Style Virtual Shoot"
          className="lp-hero-img"
          fetchPriority="high"
          src="/visuals/landing/main.webp"
        />
        <div className="lp-hero-fade" />
      </div>
      <div className="lp-cta-wrap">
        <Link className="lp-cta-btn" href={`/${lang}/create/upload`}>
          {t("start")} →
        </Link>
        <p className="lp-cta-note">Unofficial. AI-generated results for fans.</p>
      </div>
      <div className="sr-only">
        <p>{t("eyebrow")}</p>
        <p>{t("titlePrefix")} K-POP {t("titleSuffix")}</p>
        <p>{t("description")}</p>
      </div>
    </section>
  );
}
