import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
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
  icons: {
    icon: [{ url: "/icon" }],
    shortcut: [{ url: "/icon" }],
    apple: [{ url: "/icon" }]
  },
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
        url: toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp"),
        width: 1600,
        height: 894,
        alt: "kstyleshot hero visual"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp")]
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const lang = (await headers()).get("x-next-intl-locale") ?? "ko";
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: toAbsoluteAssetUrl("/visuals/landing/seoul-kstyle-landing-hero.webp")
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
    <html lang={lang} suppressHydrationWarning>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q3QEDGYL0D"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q3QEDGYL0D');
          `}
        </Script>
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vwzsa1j310");
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
