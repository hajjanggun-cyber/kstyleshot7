import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";
import {
  SITE_NAME,
  buildLocaleAlternatesAbsolute,
  getOgLocale,
  getSiteUrl,
  toAbsoluteAssetUrl,
} from "@/lib/seo";

type HubLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang === "en" ? "en" : "ko";
  const isEn = safeLang === "en";
  const canonical = `${getSiteUrl()}/${safeLang}/hub`;

  const title = isEn
    ? "K-Style & Seoul Travel Hub — Guides & Tips"
    : "K스타일 & 서울 여행 허브 — 가이드 & 팁";
  const description = isEn
    ? "Browse all K-beauty, Seoul photo spot, and travel guides curated by Kstyleshot."
    : "K뷰티, 서울 포토존, 여행 가이드를 한 곳에서 확인하세요.";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLocaleAlternatesAbsolute((locale) => `/${locale}/hub`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: getOgLocale(safeLang as AppLocale),
      type: "website",
      images: [
        {
          url: toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp"),
          width: 1600,
          height: 894,
          alt: isEn ? "Kstyleshot hub" : "Kstyleshot 허브",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp")],
    },
  };
}

/* Hub section uses its own full-screen layout — no global SiteHeader */
export default function HubLayout({ children }: HubLayoutProps) {
  return <div className="hf-shell">{children}</div>;
}
