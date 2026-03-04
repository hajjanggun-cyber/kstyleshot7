import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllBlogCategoryParams,
  getBlogCategoryPageData
} from "@/lib/blog";

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
    title: `${data.category.name} | kstyleshot Blog`,
    description: data.category.description
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { lang, category } = await params;
  const data = await getBlogCategoryPageData(lang, category);

  if (!data) {
    notFound();
  }

  const { posts } = data;

  return (
    <main className="stack">
      <section className="card stack blog-hero">
        <div className="actions">
          <Link className="button secondary" href={`/blog/${lang}`}>
            {lang === "en" ? "Back to language hub" : "언어 허브로 돌아가기"}
          </Link>
          <Link className="button" href={`/${lang}/create`}>
            {lang === "en" ? "Try kstyleshot" : "바로 체험하기"}
          </Link>
        </div>
        <p className="muted">{lang === "en" ? "Category landing" : "카테고리 랜딩"}</p>
        <h1>{data.category.name}</h1>
        <p className="muted">{data.category.description}</p>
        <div className="actions">
          <span className="count-badge">
            {posts.length} {lang === "en" ? "posts" : "개 포스트"}
          </span>
        </div>
      </section>

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
                {lang === "en" ? "Read article" : "글 읽기"}
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="card stack">
          <div className="empty-state">
            {lang === "en"
              ? "This category landing is ready, but the next post batch has not been published yet."
              : "카테고리 랜딩은 먼저 열어뒀고, 다음 포스트 배치가 아직 들어오지 않은 상태입니다."}
          </div>
        </section>
      )}
    </main>
  );
}
