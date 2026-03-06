import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllBlogCategoryParams,
  getBlogCategories,
  getBlogCategoryPageData
} from "@/lib/blog";
import { buildLocaleAlternates, getOgLocale, toAbsoluteAssetUrl, toAbsoluteUrl } from "@/lib/seo";

const RELATED_CATEGORY_MAP: Record<string, string[]> = {
  "product-faq": ["hair", "photo-technique"],
  hair: ["product-faq", "photo-technique"],
  "photo-technique": ["hair", "product-faq"],
  "beauty-prep": ["photo-technique", "outfit-styling"],
  "outfit-styling": ["hair", "backdrop-mood"],
  "backdrop-mood": ["outfit-styling", "seasonal-trend"],
  "seasonal-trend": ["backdrop-mood", "hair"]
};

type BlogCategoryPageProps = {
  params: Promise<{ lang: string; category: string }>;
};

export async function generateStaticParams() {
  return getAllBlogCategoryParams();
}

export async function generateMetadata({
  params
}: BlogCategoryPageProps): Promise<Metadata> {
  const { lang, category } = await params;
  const data = await getBlogCategoryPageData(lang, category);

  if (!data) {
    return {
      title: "Category not found"
    };
  }

  return {
    title: `${data.category.name} Style Guide`,
    description: data.category.description,
    keywords: [data.category.name, "kstyleshot", "style guide", "category"],
    alternates: {
      canonical: `/blog/${lang}/category/${category}`,
      languages: buildLocaleAlternates((locale) => `/blog/${locale}/category/${category}`)
    },
    openGraph: {
      type: "website",
      url: `/blog/${lang}/category/${category}`,
      title: `${data.category.name} Style Guide`,
      description: data.category.description,
      locale: getOgLocale(lang === "ko" ? "ko" : "en"),
      alternateLocale: [getOgLocale(lang === "en" ? "ko" : "en")],
      images: [
        {
          url: toAbsoluteAssetUrl("/visuals/blog/category.svg"),
          width: 1200,
          height: 630,
          alt: data.category.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.category.name} Style Guide`,
      description: data.category.description,
      images: [toAbsoluteAssetUrl("/visuals/blog/category.svg")]
    }
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { lang, category } = await params;
  const [data, categories] = await Promise.all([
    getBlogCategoryPageData(lang, category),
    getBlogCategories(lang)
  ]);

  if (!data) {
    notFound();
  }

  const { posts } = data;
  const relatedCategorySlugs = RELATED_CATEGORY_MAP[category] ?? [];
  const relatedCategoryLookup = new Map(categories.map((entry) => [entry.slug, entry]));
  const isEn = lang === "en";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.category.name,
    description: data.category.description,
    url: toAbsoluteUrl(`/blog/${lang}/category/${category}`),
    inLanguage: lang,
    hasPart: posts.slice(0, 20).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: toAbsoluteUrl(`/blog/${lang}/${post.slug}`)
    }))
  };

  const recommendedPosts: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
    reason: string;
  }> = [];
  const seen = new Set<string>();

  for (const post of posts.slice(0, 3)) {
    if (seen.has(post.slug)) {
      continue;
    }

    seen.add(post.slug);
    recommendedPosts.push({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      category: post.category,
      reason: isEn ? "Top post in this category" : "이 카테고리의 대표 글"
    });
  }

  for (const relatedSlug of relatedCategorySlugs) {
    const relatedCategory = relatedCategoryLookup.get(relatedSlug);
    if (!relatedCategory) {
      continue;
    }

    for (const post of relatedCategory.posts.slice(0, 2)) {
      if (seen.has(post.slug)) {
        continue;
      }

      seen.add(post.slug);
      recommendedPosts.push({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        category: post.category,
        reason: isEn
          ? `Related from ${relatedCategory.name}`
          : `${relatedCategory.name} 카테고리의 연관 글`
      });

      if (recommendedPosts.length >= 6) {
        break;
      }
    }

    if (recommendedPosts.length >= 6) {
      break;
    }
  }

  return (
    <main className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="card stack">
        <div className="actions">
          <Link className="button secondary" href={`/blog/${lang}`}>
            {isEn ? "Back to language hub" : "언어 허브로 돌아가기"}
          </Link>
          <Link className="button" href={`/${lang}/create`}>
            {isEn ? "Try kstyleshot" : "kstyleshot 시작하기"}
          </Link>
        </div>
        <p className="muted">{isEn ? "Category landing" : "카테고리 랜딩"}</p>
        <h1>{data.category.name}</h1>
        <p className="muted">{data.category.description}</p>
        <div className="actions">
          <span className="count-badge">{posts.length} posts</span>
        </div>
      </section>

      {recommendedPosts.length > 0 ? (
        <section className="card stack">
          <p className="muted">
            {isEn ? "Recommended reading path" : "추천 읽기 순서"}
          </p>
          <h2>
            {isEn ? "Start with these linked articles" : "아래 연관 글부터 읽어보세요"}
          </h2>
          <div className="grid two">
            {recommendedPosts.map((post) => (
              <article className="card stack" key={post.slug}>
                <div className="actions">
                  <span className="count-badge">{post.category}</span>
                  <span className="muted">{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="muted">{post.description}</p>
                <span className="muted">{post.reason}</span>
                <Link className="button secondary" href={`/blog/${lang}/${post.slug}`}>
                  {isEn ? "Read article" : "글 읽기"}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section className="grid two">
          {posts.map((post) => (
            <article className="card stack" key={post.slug}>
              <div className="actions">
                <span className="count-badge">{post.date}</span>
                <span className="muted">{post.updated}</span>
              </div>
              <h2>{post.title}</h2>
              <p className="muted">{post.description}</p>
              <div className="actions">
                {post.tags.map((tag) => (
                  <span className="muted" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
              <Link className="button secondary" href={`/blog/${lang}/${post.slug}`}>
                {isEn ? "Read article" : "글 읽기"}
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="card stack">
          <div className="empty-state">
            {isEn
              ? "This category landing is ready, but the next post batch has not been published yet."
              : "카테고리 랜딩은 준비되어 있으며, 다음 포스트 배치가 아직 발행되지 않은 상태입니다."}
          </div>
        </section>
      )}
    </main>
  );
}
