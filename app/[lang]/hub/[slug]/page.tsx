import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HubArticle } from "@/components/hub/HubArticle";
import { HubMdxPage } from "@/components/hub/HubMdxPage";
import { hubArticles } from "@/data/hubArticles";
import { getMdxArticle } from "@/lib/mdx";
import { buildLocaleAlternatesAbsolute, getSiteUrl } from "@/lib/seo";

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
        type: "article",
        publishedTime: fm.publishedAt,
        authors,
        images: fm.ogImage ? [{ url: fm.ogImage }] : undefined,
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

  // MDX file takes priority (new content)
  const mdx = getMdxArticle(lang, slug);
  if (mdx) {
    const { frontmatter: fm } = mdx;
    const canonical = `${getSiteUrl()}/${lang}/hub/${slug}`;
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
          image: fm.ogImage ? [fm.ogImage] : undefined,
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
              item: getSiteUrl() + `/${lang}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: breadcrumbHubLabel,
              item: getSiteUrl() + `/${lang}/hub`,
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

  // Fallback: legacy TypeScript article data
  const legacy = hubArticles[slug];
  if (!legacy) notFound();

  return <HubArticle article={legacy} />;
}
