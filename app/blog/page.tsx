import Link from "next/link";
import type { Metadata } from "next";

import { getBlogCategories, getRecentPosts } from "@/lib/blog";
import { buildLocaleAlternates, toAbsoluteAssetUrl, toAbsoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "kstyleshot Style Guide",
  description:
    "The central style guide landing for K-style photo guides, upload prep, styling tips, and product explainers.",
  alternates: {
    canonical: "/blog",
    languages: buildLocaleAlternates((locale) => `/blog/${locale}`)
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "kstyleshot Style Guide",
    description:
      "The central style guide landing for K-style photo guides, upload prep, styling tips, and product explainers.",
    images: [
      {
        url: toAbsoluteAssetUrl("/visuals/blog/index.svg"),
        width: 1200,
        height: 630,
        alt: "kstyleshot style guide hub"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "kstyleshot Style Guide",
    description:
      "The central style guide landing for K-style photo guides, upload prep, styling tips, and product explainers.",
    images: [toAbsoluteAssetUrl("/visuals/blog/index.svg")]
  }
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "kstyleshot Style Guide",
    url: toAbsoluteUrl("/blog"),
    description:
      "The central style guide landing for K-style photo guides, upload prep, styling tips, and product explainers.",
    inLanguage: ["en", "ko"],
    hasPart: recentPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: toAbsoluteUrl(`/blog/${post.lang}/${post.slug}`)
    }))
  };

  return (
    <main className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="card stack blog-hero">
        <span className="count-badge">Style Guide Hub</span>
        <h1>kstyleshot Style Guide</h1>
        <p className="muted">
          This is the content hub for styling guides, upload tips, and product explainers that
          support the main create flow.
        </p>
        <div className="preview-frame blog-hero-media">
          <img alt="kstyleshot style guide hub" loading="lazy" src="/visuals/blog/index.svg" />
        </div>
        <div className="actions">
          <span className="count-badge">{totalPosts} total posts</span>
          <span className="count-badge">{totalEnPosts} EN posts</span>
          <span className="count-badge">{totalKoPosts} KO posts</span>
          <span className="count-badge">{activeTracks} active tracks</span>
        </div>
        <div className="actions">
          <Link className="button" href="/blog/en">
            Browse English guides
          </Link>
          <Link className="button secondary" href="/blog/ko">
            한국어 가이드 보기
          </Link>
        </div>
      </section>

      <section className="grid two">
        <article className="card stack category-link-card">
          <p className="muted">English style guide hub</p>
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
          <p className="muted">Korean style guide hub</p>
          <h2>Practical guides for search and conversion</h2>
          <p className="muted">
            Organized for upload prep, hair selection, photo technique, and product FAQ.
          </p>
          <div className="actions">
            <span className="count-badge">{totalKoPosts} live posts</span>
            <span className="muted">
              {koCategories.filter((category) => category.count > 0).length} active categories
            </span>
          </div>
          <Link className="button secondary" href="/blog/ko">
            Open Korean hub
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
