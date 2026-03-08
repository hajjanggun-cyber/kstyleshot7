import type { Metadata } from "next";

import { GalleryTabs } from "@/components/landing/GalleryTabs";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { HubPreview } from "@/components/landing/HubPreview";
import { PricingSection } from "@/components/landing/PricingSection";
import { buildLocaleAlternates, getOgLocale, toAbsoluteAssetUrl } from "@/lib/seo";

type LandingPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang === "ko" ? "ko" : "en";
  const isEn = safeLang === "en";
  const title = isEn
    ? "KStyleShot — AI K-Pop Style Makeover"
    : "KStyleShot — AI K뷰티 프로필 만들기";
  const description = isEn
    ? "Pick your hair, outfit, and backdrop. AI transforms your selfie into a K-pop style shot in under a minute."
    : "헤어, 의상, 배경을 고르면 AI가 내 사진을 K뷰티 프로필로 바꿔줍니다. 셀카 한 장으로 시작하세요.";

  return {
    title,
    description,
    keywords: isEn
      ? ["k-pop style makeover", "ai k-pop photo", "k-beauty profile", "kstyleshot"]
      : ["K뷰티 프로필", "AI 헤어 변환", "케이팝 스타일 변신", "kstyleshot"],
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

export default function LandingPage() {
  return (
    <div className="stack">
      <HeroSection />
      <HowItWorks />
      <GalleryTabs />
      <HubPreview />
      <PricingSection />
    </div>
  );
}
