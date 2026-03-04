import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogCategories, getBlogPosts } from "@/lib/blog";

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
      title: "Blog"
    };
  }

  return {
    title: lang === "en" ? "English Blog | kstyleshot" : "한국어 블로그 | kstyleshot",
    description:
      lang === "en"
        ? "Browse the English category hub for K-style portrait guides and styling explainers."
        : "케이스타일 셀카 준비, 헤어, 촬영 팁을 모은 한국어 블로그 허브입니다."
  };
}

export default async function BlogLangPage({ params }: BlogLangPageProps) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ko") {
    notFound();
  }
  const [posts, categories] = await Promise.all([getBlogPosts(lang), getBlogCategories(lang)]);
  const liveCategories = categories.filter((category) => category.count > 0);

  return (
    <main className="stack">
      <section className="card stack blog-hero">
        <div className="actions">
          <Link className="button secondary" href="/blog">
            Back to blog
          </Link>
          <Link className="button" href={`/${lang}/create`}>
            {lang === "en" ? "Try kstyleshot" : "바로 체험하기"}
          </Link>
        </div>
        <p className="muted">{lang === "en" ? "Language hub" : "언어별 허브"}</p>
        <h1>{lang === "en" ? "English editorial landing" : "한국어 블로그 랜딩"}</h1>
        <p className="muted">
          {lang === "en"
            ? "This language hub organizes the live posts by category so the blog can scale without feeling flat."
            : "카테고리 중심으로 글을 묶어, 포스팅 수가 늘어나도 구조가 무너지지 않게 정리한 허브입니다."}
        </p>
        <div className="actions">
          <span className="count-badge">{posts.length} posts live</span>
          <span className="count-badge">{liveCategories.length} active tracks</span>
          <span className="count-badge">{categories.length} planned tracks</span>
        </div>
      </section>

      <section className="card stack">
        <p className="muted">{lang === "en" ? "Explore by category" : "카테고리별로 보기"}</p>
        <h2>
          {lang === "en"
            ? "Category landing pages first, then deeper post batches"
            : "카테고리 허브를 먼저 깔고, 그 위에 포스트를 쌓는 구조"}
        </h2>
        <div className="grid three">
          {categories.map((category) => (
            <article className="card stack category-link-card" key={category.slug}>
              <div className="actions">
                <span className="count-badge">{category.name}</span>
                <span className="muted">
                  {category.count > 0
                    ? `${category.count} ${lang === "en" ? "posts" : "개 포스트"}`
                    : lang === "en"
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
                  {lang === "en"
                    ? "No live posts yet. This track is ready for the next batch."
                    : "아직 공개된 글은 없지만, 다음 배치용 트랙으로 열어둔 상태입니다."}
                </div>
              )}
              <Link className="button secondary" href={`/blog/${lang}/category/${category.slug}`}>
                {lang === "en" ? "Open category landing" : "카테고리 랜딩 열기"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="card stack">
        <p className="muted">{lang === "en" ? "Live posts" : "현재 공개된 글"}</p>
        <h2>{lang === "en" ? "Published articles" : "발행 가능한 현재 글 목록"}</h2>
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
                {lang === "en" ? "Read post" : "글 읽기"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

