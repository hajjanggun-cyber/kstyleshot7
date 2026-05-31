import type { Metadata } from "next";

import { EditorialStandards } from "@/components/landing/EditorialStandards";
import { HeroSection } from "@/components/landing/HeroSection";
import { HubPreview } from "@/components/landing/HubPreview";
import { buildLocaleAlternates, getOgLocale, getSiteUrl, toAbsoluteAssetUrl } from "@/lib/seo";

type LandingPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang === "ko" ? "ko" : "en";
  const isEn = safeLang === "en";
  const title = isEn
    ? "K-StyleShot — Seoul, K-Beauty, and K-Fashion Guides"
    : "K-StyleShot — 서울, K뷰티, K패션 가이드";
  const description = isEn
    ? "Read practical K-style guides for Seoul photo spots, K-beauty routines, and Korean fashion decisions, reviewed with clear editorial standards."
    : "서울 포토존, K뷰티 루틴, 한국 패션 선택 기준을 에디토리얼 기준으로 정리한 실용 K-style 가이드입니다.";

  return {
    title,
    description,
    keywords: isEn
      ? ["K-style guide", "Seoul photo spots", "K-beauty guide", "K-fashion guide", "kstyleshot"]
      : ["K스타일 가이드", "서울 포토존", "K뷰티 가이드", "K패션 가이드", "kstyleshot"],
    alternates: {
      canonical: `/${safeLang}`,
      languages: buildLocaleAlternates((locale) => `/${locale}`)
    },
    openGraph: {
      type: "website",
      url: `/${safeLang}`,
      title,
      description,
      locale: getOgLocale(safeLang),
      alternateLocale: [getOgLocale(safeLang === "en" ? "ko" : "en")],
      images: [
        {
          url: toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp"),
          width: 1600,
          height: 894,
          alt: isEn ? "Kstyleshot landing hero" : "Kstyleshot 랜딩 히어로"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp")]
    }
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { lang } = await params;
  const safeLang = lang === "ko" ? "ko" : "en";
  const isEn = safeLang === "en";
  const siteUrl = getSiteUrl();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isEn
      ? "K-StyleShot editorial guide hub"
      : "K-StyleShot 에디토리얼 가이드 허브",
    url: `${siteUrl}/${safeLang}`,
    description: isEn
      ? "A bilingual guide collection covering Seoul locations, K-beauty routines, and Korean fashion choices."
      : "서울 명소, K뷰티 루틴, 한국 패션 선택 기준을 다루는 한국어/영어 가이드 모음입니다.",
    inLanguage: isEn ? "en-US" : "ko-KR",
    image: toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp")
  };

  return (
    <div className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <HeroSection />
      <HubPreview />
      <EditorialStandards />
    </div>
  );
}
