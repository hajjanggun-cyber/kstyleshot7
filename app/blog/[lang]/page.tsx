import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogCategories, getBlogPosts } from "@/lib/blog";
import { buildLocaleAlternates, getOgLocale, toAbsoluteAssetUrl, toAbsoluteUrl } from "@/lib/seo";

type BlogLangPageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export async function generateMetadata({
  params
}: BlogLangPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ko") {
    return {
      title: "Style Guide"
    };
  }

  return {
    title: lang === "en" ? "English Style Guide" : "한국어 스타일 가이드",
    description:
      lang === "en"
        ? "Browse the English category hub for K-style portrait guides and styling explainers."
        : "실전형 케이스타일 촬영 가이드와 제품 설명 글을 모은 한국어 카테고리 허브입니다.",
    keywords:
      lang === "en"
        ? ["k-style guide", "kstyle blog", "portrait tips", "hair outfit backdrop"]
        : ["케이스타일 가이드", "스타일 블로그", "촬영 팁", "헤어 의상 배경"],
    alternates: {
      canonical: `/blog/${lang}`,
      languages: buildLocaleAlternates((locale) => `/blog/${locale}`)
    },
    openGraph: {
      type: "website",
      url: `/blog/${lang}`,
      title: lang === "en" ? "English Style Guide" : "한국어 스타일 가이드",
      description:
        lang === "en"
          ? "Browse the English category hub for K-style portrait guides and styling explainers."
          : "실전형 케이스타일 촬영 가이드와 제품 설명 글을 모은 한국어 카테고리 허브입니다.",
      locale: getOgLocale(lang),
      alternateLocale: [getOgLocale(lang === "en" ? "ko" : "en")],
      images: [
        {
          url: toAbsoluteAssetUrl("/visuals/blog/lang.svg"),
          width: 1200,
          height: 630,
          alt: lang === "en" ? "English style guide hub" : "한국어 스타일 가이드 허브"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: lang === "en" ? "English Style Guide" : "한국어 스타일 가이드",
      description:
        lang === "en"
          ? "Browse the English category hub for K-style portrait guides and styling explainers."
          : "실전형 케이스타일 촬영 가이드와 제품 설명 글을 모은 한국어 카테고리 허브입니다.",
      images: [toAbsoluteAssetUrl("/visuals/blog/lang.svg")]
    }
  };
}

export default async function BlogLangPage({ params }: BlogLangPageProps) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ko") {
    notFound();
  }

  const [posts, categories] = await Promise.all([getBlogPosts(lang), getBlogCategories(lang)]);
  const liveCategories = categories.filter((category) => category.count > 0);
  const isEn = lang === "en";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isEn ? "English Style Guide" : "한국어 스타일 가이드",
    url: toAbsoluteUrl(`/blog/${lang}`),
    inLanguage: lang,
    hasPart: posts.slice(0, 20).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: toAbsoluteUrl(`/blog/${lang}/${post.slug}`)
    }))
  };

  return (
    <main className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="card stack">
        <div className="actions">
          <Link className="button secondary" href="/blog">
            {isEn ? "Back to style guide" : "스타일 가이드로 돌아가기"}
          </Link>
          <Link className="button" href={`/${lang}/create`}>
            {isEn ? "Try kstyleshot" : "kstyleshot 시작하기"}
          </Link>
        </div>
        <p className="muted">{isEn ? "Language hub" : "언어 허브"}</p>
        <h1>{isEn ? "English style guide landing" : "한국어 스타일 가이드 랜딩"}</h1>
        <p className="muted">
          {isEn
            ? "This language hub organizes live posts by category so the blog can scale without feeling flat."
            : "카테고리별로 포스트를 묶어 운영해서 글 수가 늘어나도 탐색이 쉽게 유지됩니다."}
        </p>
        <div className="actions">
          <span className="count-badge">{posts.length} posts live</span>
          <span className="count-badge">{liveCategories.length} active tracks</span>
          <span className="count-badge">{categories.length} planned tracks</span>
        </div>
      </section>

      <section className="card stack">
        <p className="muted">{isEn ? "Explore by category" : "카테고리로 탐색"}</p>
        <h2>
          {isEn
            ? "Category landing pages first, then deeper post batches"
            : "카테고리 랜딩을 먼저 만들고, 그다음 배치 포스팅을 확장합니다"}
        </h2>
        <div className="grid three">
          {categories.map((category) => (
            <article className="card stack category-link-card" key={category.slug}>
              <div className="actions">
                <span className="count-badge">{category.name}</span>
                <span className="muted">
                  {category.count > 0
                    ? `${category.count} ${isEn ? "posts" : "개 포스트"}`
                    : isEn
                      ? "Planned"
                      : "준비 중"}
                </span>
              </div>
              <p className="muted">{category.description}</p>
              {category.featuredPost ? (
                <div className="notice">
                  <strong>{category.featuredPost.title}</strong>
                  <p className="muted">{category.featuredPost.description}</p>
                </div>
              ) : (
                <div className="empty-state">
                  {isEn
                    ? "No live posts yet. This track is ready for the next batch."
                    : "아직 공개된 글은 없지만, 다음 배치에서 바로 발행할 수 있도록 준비된 트랙입니다."}
                </div>
              )}
              <Link className="button secondary" href={`/blog/${lang}/category/${category.slug}`}>
                {isEn ? "Open category landing" : "카테고리 랜딩 열기"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="card stack">
        <p className="muted">{isEn ? "Live posts" : "현재 공개된 포스트"}</p>
        <h2>{isEn ? "Published articles" : "발행된 아티클"}</h2>
        <div className="grid two">
          {posts.map((post) => (
            <article className="card stack" key={post.slug}>
              <div className="actions">
                <span className="count-badge">{post.category}</span>
                <span className="muted">{post.date}</span>
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
                {isEn ? "Read post" : "글 읽기"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
