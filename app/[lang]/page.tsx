import type { Metadata } from "next";

import { GalleryTabs } from "@/components/landing/GalleryTabs";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import { buildLocaleAlternates } from "@/lib/seo";

type LandingPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang === "ko" ? "ko" : "en";

  return {
    title: safeLang === "en" ? "kstyleshot | K-Style Portrait Tool" : "kstyleshot | 케이스타일 포트레이트",
    description:
      safeLang === "en"
        ? "Upload one selfie and create a K-style portrait flow with hair, outfit, and backdrop."
        : "셀카 한 장으로 헤어, 의상, 배경 선택 기반 케이스타일 포트레이트를 만들어보세요.",
    alternates: {
      canonical: `/${safeLang}`,
      languages: buildLocaleAlternates((locale) => `/${locale}`)
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
