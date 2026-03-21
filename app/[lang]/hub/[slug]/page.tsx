import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HubArticle } from "@/components/hub/HubArticle";
import { HubMdxPage } from "@/components/hub/HubMdxPage";
import { hubArticles } from "@/data/hubArticles";
import { getFirstImageSrc, getMdxArticle } from "@/lib/mdx";
import { SITE_NAME, buildLocaleAlternatesAbsolute, getSiteUrl } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  const mdx = getMdxArticle(lang, slug);
  if (mdx) {
    const { frontmatter: fm } = mdx;
    const canonical = `${getSiteUrl()}/${lang}/hub/${slug}`;
    const authors = fm.authorName ? [fm.authorName] : undefined;
    const firstImageSrc = getFirstImageSrc(mdx.content);
    const articleImage = fm.ogImage ?? (firstImageSrc ? `${getSiteUrl()}${firstImageSrc}` : undefined);

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

  const legacy = hubArticles[slug];
  if (legacy) {
    return { title: legacy.title };
  }

  return {};
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;

  const mdx = getMdxArticle(lang, slug);
  if (mdx) {
    const { frontmatter: fm } = mdx;
    const canonical = `${getSiteUrl()}/${lang}/hub/${slug}`;
    const firstImageSrc = getFirstImageSrc(mdx.content);
    const articleImage = fm.ogImage ?? (firstImageSrc ? `${getSiteUrl()}${firstImageSrc}` : undefined);
    const breadcrumbHomeLabel = lang === "ko" ? "홈" : "Home";
    const breadcrumbHubLabel = lang === "ko" ? "허브" : "Hub";
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: fm.title,
          description: fm.description,
          datePublished: fm.publishedAt,
          url: canonical,
          inLanguage: lang === "ko" ? "ko-KR" : "en-US",
          image: articleImage ? [articleImage] : undefined,
          author: fm.authorName
            ? {
                "@type": "Person",
                name: fm.authorName,
              }
            : undefined,
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

  const legacy = hubArticles[slug];
  if (!legacy) notFound();

  return <HubArticle article={legacy} />;
}
