import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HubMdxPage } from "@/components/hub/HubMdxPage";
import { isAdsenseReviewHubSlug } from "@/data/adsenseReview";
import { getArticleSourceInfo } from "@/data/articleSources";
import { routing } from "@/i18n/routing";
import { getAllArticles, getAllSlugs, getFirstImageSrc, getMdxArticle } from "@/lib/mdx";
import { SITE_NAME, buildLocaleAlternatesAbsolute, getSiteUrl, toAbsoluteAssetUrl } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of getAllSlugs(locale)) {
      if (!isAdsenseReviewHubSlug(slug)) {
        continue;
      }

      params.push({ lang: locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isAdsenseReviewHubSlug(slug)) {
    notFound();
  }

  const mdx = getMdxArticle(lang, slug);
  if (mdx) {
    const { frontmatter: fm } = mdx;
    const sourceInfo = getArticleSourceInfo(fm.slug);
    const canonical = `${getSiteUrl()}/${lang}/hub/${slug}`;
    const authors = fm.authorName ? [fm.authorName] : undefined;
    const firstImageSrc = getFirstImageSrc(mdx.content);
    const articleImage = fm.ogImage
      ? toAbsoluteAssetUrl(fm.ogImage)
      : firstImageSrc
        ? toAbsoluteAssetUrl(firstImageSrc)
        : undefined;

    return {
      title: fm.title,
      description: fm.description,
      alternates: {
        canonical,
        languages: buildLocaleAlternatesAbsolute(
          (locale) => `/${locale}/hub/${fm.hreflangSlug}`
        ),
      },
      openGraph: {
        title: fm.title,
        description: fm.description,
        url: canonical,
        siteName: SITE_NAME,
        locale: lang === "ko" ? "ko_KR" : "en_US",
        type: "article",
        publishedTime: fm.publishedAt,
        modifiedTime: sourceInfo?.checkedAt ?? fm.publishedAt,
        authors,
        images: articleImage ? [{ url: articleImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: fm.title,
        description: fm.description,
        images: articleImage ? [articleImage] : undefined,
      },
    };
  }

  return {};
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;

  if (!isAdsenseReviewHubSlug(slug)) {
    notFound();
  }

  const mdx = getMdxArticle(lang, slug);
  if (mdx) {
    const { frontmatter: fm } = mdx;
    const sourceInfo = getArticleSourceInfo(fm.slug);
    const canonical = `${getSiteUrl()}/${lang}/hub/${slug}`;
    const firstImageSrc = getFirstImageSrc(mdx.content);
    const articleImage = fm.ogImage
      ? toAbsoluteAssetUrl(fm.ogImage)
      : firstImageSrc
        ? toAbsoluteAssetUrl(firstImageSrc)
        : undefined;
    const breadcrumbHomeLabel = lang === "ko" ? "홈" : "Home";
    const breadcrumbHubLabel = lang === "ko" ? "허브" : "Hub";
    const relatedArticles = getAllArticles(lang)
      .filter((a) => isAdsenseReviewHubSlug(a.slug) && a.category === fm.category && a.slug !== slug)
      .slice(0, 3)
      .map((a) => `${getSiteUrl()}/${lang}/hub/${a.slug}`);

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: fm.title,
          description: fm.description,
          datePublished: fm.publishedAt,
          dateModified: sourceInfo?.checkedAt ?? fm.publishedAt,
          url: canonical,
          inLanguage: lang === "ko" ? "ko-KR" : "en-US",
          image: articleImage ? [articleImage] : undefined,
          author: fm.authorName
            ? {
                "@type": "Person",
                name: fm.authorName,
              }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: getSiteUrl(),
          },
          reviewedBy: sourceInfo
            ? {
                "@type": "Organization",
                name: SITE_NAME,
                url: getSiteUrl(),
              }
            : undefined,
          citation: sourceInfo?.sources.map((source) => source.url),
          ...(relatedArticles.length > 0 && { relatedLink: relatedArticles }),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: breadcrumbHomeLabel,
              item: `${getSiteUrl()}/${lang}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: breadcrumbHubLabel,
              item: `${getSiteUrl()}/${lang}/hub`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: fm.title,
              item: canonical,
            },
          ],
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HubMdxPage frontmatter={fm} content={mdx.content} lang={lang} />
      </>
    );
  }

  notFound();
}
