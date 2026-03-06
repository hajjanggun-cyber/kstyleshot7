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
      <div className="hero-visual-frame">
        <img
          alt="Kstyleshot landing main visual"
          className="hero-main-visual"
          fetchPriority="high"
          src="/visuals/landing/main.png"
        />
      </div>
      <div className="hero-actions">
        <Link className="button" href={`/${lang}/create`}>
          {t("start")}
        </Link>
        <a className="button secondary" href="#trending">
          {t("gallery")}
        </a>
      </div>
      <div className="sr-only">
        <p>{t("eyebrow")}</p>
        <p>
          {t("titlePrefix")} K-POP {t("titleSuffix")}
        </p>
        <p>{t("description")}</p>
        <p>{t("badge1")}</p>
        <p>{t("badge2")}</p>
        <p>{t("badge3")}</p>
      </div>
    </section>
  );
}
