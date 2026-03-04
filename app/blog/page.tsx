import Link from "next/link";
import type { Metadata } from "next";

import { getBlogCategories, getRecentPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "kstyleshot Blog",
  description:
    "The central blog landing for K-style photo guides, upload prep, styling tips, and product explainers."
};

export default async function BlogIndexPage() {
  const [enCategories, koCategories, recentPosts] = await Promise.all([
    getBlogCategories("en"),
    getBlogCategories("ko"),
    getRecentPosts(6)
  ]);
  const totalEnPosts = enCategories.reduce((sum, category) => sum + category.count, 0);
  const totalKoPosts = koCategories.reduce((sum, category) => sum + category.count, 0);
  const totalPosts = totalEnPosts + totalKoPosts;
  const activeTracks = enCategories.filter((category) => category.count > 0).length;

  return (
    <main className="stack">
      <section className="card stack blog-hero">
        <span className="count-badge">Editorial Landing</span>
        <h1>kstyleshot Blog</h1>
        <p className="muted">
          This is the content hub for the styling guides, upload tips, and product explainers that
          support the main create flow.
        </p>
        <div className="actions">
          <span className="count-badge">{totalPosts} total posts</span>
          <span className="count-badge">{totalEnPosts} EN posts</span>
          <span className="count-badge">{totalKoPosts} KO posts</span>
          <span className="count-badge">{activeTracks} active tracks</span>
        </div>
        <div className="actions">
          <Link className="button" href="/blog/en">
            Browse English posts
          </Link>
          <Link className="button secondary" href="/blog/ko">
            한국어 글 보기
          </Link>
        </div>
      </section>

      <section className="grid two">
        <article className="card stack category-link-card">
          <p className="muted">English editorial hub</p>
          <h2>Search-friendly, conversion-close guides</h2>
          <p className="muted">
            Built around upload quality, hair direction, and product expectations.
          </p>
          <div className="actions">
            <span className="count-badge">{totalEnPosts} live posts</span>
            <span className="muted">
              {enCategories.filter((category) => category.count > 0).length} active categories
            </span>
          </div>
          <Link className="button secondary" href="/blog/en">
            Open English hub
          </Link>
        </article>
        <article className="card stack category-link-card">
          <p className="muted">한국어 콘텐츠 허브</p>
          <h2>실전 검색과 전환 중심 가이드</h2>
          <p className="muted">
            셀카 준비, 헤어 선택, 촬영 팁부터 제품 FAQ까지 한 흐름으로 정리합니다.
          </p>
          <div className="actions">
            <span className="count-badge">{totalKoPosts}개 공개됨</span>
            <span className="muted">
              {koCategories.filter((category) => category.count > 0).length}개 카테고리 운영 중
            </span>
          </div>
          <Link className="button secondary" href="/blog/ko">
            한국어 허브 열기
          </Link>
        </article>
      </section>

      <section className="card stack">
        <p className="muted">Seven content tracks</p>
        <h2>Structured like a publishable content system</h2>
        <div className="grid three">
          {enCategories.map((category, index) => (
            <article className="card stack category-link-card" key={category.slug}>
              <div className="actions">
                <span className="count-badge">{category.name}</span>
                <span className="muted">{koCategories[index]?.name}</span>
              </div>
              <p className="muted">{category.description}</p>
              <div className="category-meta">
                <span className="muted">EN {category.count}</span>
                <span className="muted">KO {koCategories[index]?.count ?? 0}</span>
              </div>
              <div className="actions">
                <Link className="button secondary" href={`/blog/en/category/${category.slug}`}>
                  EN track
                </Link>
                <Link className="button secondary" href={`/blog/ko/category/${category.slug}`}>
                  KO track
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>Recent posts</h2>
        <div className="grid two">
          {recentPosts.map((post) => (
            <article className="card stack" key={`${post.lang}-${post.slug}`}>
              <div className="actions">
                <span className="count-badge">{post.lang.toUpperCase()}</span>
                <span className="muted">{post.category}</span>
              </div>
              <strong>{post.title}</strong>
              <p className="muted">{post.description}</p>
              <Link className="button secondary" href={`/blog/${post.lang}/${post.slug}`}>
                Read post
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

