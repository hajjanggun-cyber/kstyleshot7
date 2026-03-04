import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogPosts } from "@/lib/blog";

type BlogLangPageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default async function BlogLangPage({ params }: BlogLangPageProps) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ko") {
    notFound();
  }

  const posts = await getBlogPosts(lang);

  return (
    <main className="stack">
      <section className="card stack">
        <div className="actions">
          <Link className="button secondary" href="/blog">
            Back to blog
          </Link>
        </div>
        <p className="muted">Language: {lang.toUpperCase()}</p>
        <h1>{lang === "en" ? "English posts" : "한국어 포스팅"}</h1>
        <p className="muted">
          These pages are loaded from `.mdx` files inside `content/blog/{lang}`.
        </p>
      </section>

      <section className="grid two">
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
              Read post
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

