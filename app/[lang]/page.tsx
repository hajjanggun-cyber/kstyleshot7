import type { Metadata } from "next";

import { GalleryTabs } from "@/components/landing/GalleryTabs";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { HubPreview } from "@/components/landing/HubPreview";
import { PricingSection } from "@/components/landing/PricingSection";
import { buildLocaleAlternates, getOgLocale, getSiteUrl, toAbsoluteAssetUrl } from "@/lib/seo";

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

export default async function LandingPage({ params }: LandingPageProps) {
  const { lang } = await params;
  const safeLang = lang === "ko" ? "ko" : "en";
  const isEn = safeLang === "en";
  const siteUrl = getSiteUrl();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "KStyleShot",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/${safeLang}`,
    description: isEn
      ? "AI-powered K-pop style makeover — pick your hair, outfit, and backdrop to transform your selfie."
      : "AI 기반 K-pop 스타일 변신 — 헤어, 의상, 배경을 골라 셀카를 변환하세요.",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    image: toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp"),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: isEn
      ? [
          {
            "@type": "Question",
            name: "What is KStyleShot?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "KStyleShot is an AI-powered service that transforms your selfie into a K-pop style portrait. You pick a hairstyle, outfit, and backdrop, and AI generates the final image in under a minute.",
            },
          },
          {
            "@type": "Question",
            name: "How does the AI transformation work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload a clear selfie, choose from curated K-pop hairstyles and outfits, select a backdrop scene, and our AI composites everything into a professional-looking K-style photo.",
            },
          },
          {
            "@type": "Question",
            name: "Is my photo stored after generation?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Your uploaded photo is used only for the current session and is not permanently stored. Refer to our Privacy Policy for full details on data handling.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: "KStyleShot은 무엇인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "KStyleShot은 AI 기반으로 셀카를 K-pop 스타일 프로필로 변환하는 서비스입니다. 헤어, 의상, 배경을 선택하면 1분 내에 결과물이 생성됩니다.",
            },
          },
          {
            "@type": "Question",
            name: "AI 변환은 어떻게 작동하나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "정면 셀카를 업로드하고, 큐레이션된 K-pop 헤어와 의상을 선택한 뒤, 배경을 고르면 AI가 전문적인 K-style 사진으로 합성합니다.",
            },
          },
          {
            "@type": "Question",
            name: "사진은 생성 후에도 저장되나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "업로드한 사진은 현재 세션에서만 사용되며 영구 저장되지 않습니다. 자세한 데이터 처리 내용은 개인정보처리방침을 참고하세요.",
            },
          },
        ],
  };

  return (
    <div className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <HowItWorks />
      <GalleryTabs />
      <HubPreview />
      <PricingSection />
    </div>
  );
}
