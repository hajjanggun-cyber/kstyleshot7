import Link from "next/link";

import { getRecentPosts } from "@/lib/blog";

export default async function BlogIndexPage() {
  const recentPosts = await getRecentPosts(6);

  return (
    <main className="stack">
      <section className="card stack">
        <p className="muted">Blog hub</p>
        <h1>kstyleshot Blog</h1>
        <p className="muted">
          The blog content lives in `content/blog`, while these routes render the file-based posts.
        </p>
        <div className="actions">
          <Link className="button" href="/blog/en">
            Browse English posts
          </Link>
          <Link className="button secondary" href="/blog/ko">
            한국어 글 보기
          </Link>
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

