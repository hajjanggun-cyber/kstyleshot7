import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import type { ArticleFrontmatter } from "@/lib/mdx";

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="ha-heading" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="ha-paragraph" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="ha-bullets" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="ha-bullet-item" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="ha-bullet-label" {...props} />
  ),
  hr: () => <hr className="ha-divider" />,
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link className="ha-inline-link" href={href ?? "#"} {...props}>
      {children}
    </Link>
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="ha-media" loading="lazy" {...props} />
  ),
};

type HubMdxPageProps = {
  frontmatter: ArticleFrontmatter;
  content: string;
  lang: string;
};

export async function HubMdxPage({ frontmatter, content, lang }: HubMdxPageProps) {
  async function noop() {
    "use server";
  }

  return (
    <div className="ha-root">
      {/* Nav */}
      <nav className="ha-nav">
        <Link className="ha-nav-back" href={`/${lang}/hub`} aria-label="Back">←</Link>
        <div className="ha-lang-toggle">
          <Link
            className={`ha-lang-btn${lang === "ko" ? " ha-lang-btn--active" : ""}`}
            href={`/ko/hub/${frontmatter.hreflangSlug}`}
          >
            KO
          </Link>
          <span className="ha-lang-divider">|</span>
          <Link
            className={`ha-lang-btn${lang === "en" ? " ha-lang-btn--active" : ""}`}
            href={`/en/hub/${frontmatter.hreflangSlug}`}
          >
            EN
          </Link>
        </div>
        <form action={noop}>
          <button className="ha-nav-share" type="submit" aria-label="Share">↗</button>
        </form>
      </nav>

      {/* Hero header */}
      <header className="ha-hero" style={{ background: frontmatter.headerGradient }}>
        <div className="ha-hero-badge">
          {frontmatter.category} • {frontmatter.readTime}
        </div>
        <h1 className="ha-hero-title">{frontmatter.title}</h1>
      </header>

      {/* Pull quote */}
      <section className="ha-quote-wrap">
        <div className="ha-quote-card">
          <span className="ha-quote-mark" aria-hidden>❝</span>
          <p className="ha-quote-text">{frontmatter.pullQuote}</p>
        </div>
      </section>

      {/* Article body — MDX rendered */}
      <article className="ha-body">
        <MDXRemote source={content} components={mdxComponents} />
      </article>

      {/* Up Next */}
      {frontmatter.nextSlug && frontmatter.nextTitle ? (
        <div className="ha-next-wrap">
          <Link className="ha-next-card" href={`/${lang}/hub/${frontmatter.nextSlug}`}>
            <div className="ha-next-shine" aria-hidden />
            <div className="ha-next-content">
              <p className="ha-next-label">Up Next</p>
              <h4 className="ha-next-title">{frontmatter.nextTitle}</h4>
            </div>
            <span className="ha-next-arrow" aria-hidden>→</span>
          </Link>
        </div>
      ) : null}

      {/* Bottom nav */}
      <nav className="ha-bottom-nav">
        <Link className="ha-bnav-item" href={`/${lang}/hub`}>
          <span className="ha-bnav-icon">⌂</span>
          <span className="ha-bnav-label">Home</span>
        </Link>
        <Link className="ha-bnav-item" href={`/${lang}/create`}>
          <span className="ha-bnav-icon">✦</span>
          <span className="ha-bnav-label">Style AI</span>
        </Link>
        <Link className="ha-bnav-item ha-bnav-item--active" href={`/${lang}/hub`}>
          <span className="ha-bnav-icon">📖</span>
          <span className="ha-bnav-label">Insights</span>
        </Link>
        <button className="ha-bnav-item" type="button">
          <span className="ha-bnav-icon">📅</span>
          <span className="ha-bnav-label">Events</span>
        </button>
        <button className="ha-bnav-item" type="button">
          <span className="ha-bnav-icon">👤</span>
          <span className="ha-bnav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
}
