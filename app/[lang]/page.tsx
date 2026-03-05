import type { Metadata } from "next";

import { GalleryTabs } from "@/components/landing/GalleryTabs";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
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
    ? "Kstyleshot | K-Style Portrait Tool"
    : "Kstyleshot | 케이스타일 포트레이트 툴";
  const description = isEn
    ? "Upload one selfie and generate K-style portrait directions with hair, outfit, and backdrop flow."
    : "셀카 한 장으로 헤어, 의상, 배경 흐름에 맞춘 케이스타일 포트레이트 가이드를 시작하세요.";

  return {
    title,
    description,
    keywords: isEn
      ? ["k-style portrait", "selfie styling", "hair outfit backdrop", "kstyleshot"]
      : ["케이스타일", "셀카 스타일링", "헤어 의상 배경", "kstyleshot"],
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
          url: toAbsoluteAssetUrl("/visuals/landing/hero-scene.svg"),
          width: 1200,
          height: 630,
          alt: isEn ? "Kstyleshot landing hero" : "Kstyleshot 랜딩 히어로"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [toAbsoluteAssetUrl("/visuals/landing/hero-scene.svg")]
    }
  };
}

export default function LandingPage() {
  return (
    <div className="stack">
      <HeroSection />
      <HowItWorks />
      <GalleryTabs />
      <PricingSection />
    </div>
  );
}
