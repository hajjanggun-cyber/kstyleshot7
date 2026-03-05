import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SITE_NAME, getSiteUrl, toAbsoluteAssetUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();
const defaultTitle = "Kstyleshot | K-Style Portrait & Styling Guide";
const defaultDescription =
  "Kstyleshot helps you create cleaner K-style portrait results with practical guidance on hair, outfit, and backdrop.";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? process.env.GOOGLE_SITE_VERIFICATION;
const naverVerification =
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? process.env.NAVER_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | kstyleshot"
  },
  description: defaultDescription,
  applicationName: SITE_NAME,
  keywords: [
    "k-style portrait",
    "korean style photo",
    "hair style guide",
    "photo styling",
    "kstyleshot"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: toAbsoluteAssetUrl("/visuals/landing/hero-scene.svg"),
        width: 1200,
        height: 630,
        alt: "kstyleshot hero visual"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [toAbsoluteAssetUrl("/visuals/landing/hero-scene.svg")]
  },
  verification: {
    google: googleVerification,
    other: naverVerification
      ? {
          "naver-site-verification": naverVerification
        }
      : undefined
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: toAbsoluteAssetUrl("/visuals/landing/hero-scene.svg")
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
      inLanguage: ["en", "ko"]
    }
  ];

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
