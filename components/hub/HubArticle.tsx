"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import type { HubArticle, ContentBlock } from "@/data/hubArticles";

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "paragraph":
      return <p className="ha-paragraph" key={idx}>{block.text}</p>;

    case "heading":
      return <h2 className="ha-heading" key={idx}>{block.text}</h2>;

    case "bullets":
      return (
        <ul className="ha-bullets" key={idx}>
          {block.items.map((item, i) => (
            <li className="ha-bullet-item" key={i}>
              <span className="ha-bullet-star" aria-hidden>★</span>
              <span>
                {item.label ? <strong className="ha-bullet-label">{item.label}: </strong> : null}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );

    case "summary":
      return (
        <div className="ha-summary" key={idx}>
          <div className="ha-summary-head">
            <span className="ha-summary-icon">✦</span>
            <h3 className="ha-summary-title">Quick Summary</h3>
          </div>
          <div className="ha-summary-list">
            {block.items.map((item, i) => (
              <div className="ha-summary-row" key={i}>
                <span className="ha-summary-num">0{i + 1}</span>
                <p className="ha-summary-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

type HubArticleProps = {
  article: HubArticle;
};

export function HubArticle({ article }: HubArticleProps) {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "en";

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // silent
    }
  }

  return (
    <div className="ha-root">
      {/* Nav */}
      <nav className="ha-nav">
        <Link className="ha-nav-back" href={`/${lang}/hub`} aria-label="Back">←</Link>
        <span className="ha-nav-title">K-Insights</span>
        <button className="ha-nav-share" onClick={handleShare} type="button" aria-label="Share">
          ↗
        </button>
      </nav>

      {/* Hero header */}
      <header className="ha-hero" style={{ background: article.headerGradient }}>
        <div className="ha-hero-badge">
          {article.category} • {article.readTime}
        </div>
        <h1 className="ha-hero-title">{article.title}</h1>
        <div className="ha-hero-author">
          <div className="ha-author-avatar" aria-hidden>
            {article.authorName[0]}
          </div>
          <span className="ha-author-name">
            {article.authorName} · {article.authorRole}
          </span>
        </div>
      </header>

      {/* Pull quote */}
      <section className="ha-quote-wrap">
        <div className="ha-quote-card">
          <span className="ha-quote-mark" aria-hidden>❝</span>
          <p className="ha-quote-text">{article.pullQuote}</p>
        </div>
      </section>

      {/* Article body */}
      <article className="ha-body">
        {article.blocks.map((block, i) => renderBlock(block, i))}
      </article>

      {/* Up Next */}
      {article.nextSlug && article.nextTitle ? (
        <div className="ha-next-wrap">
          <Link className="ha-next-card" href={`/${lang}/hub/${article.nextSlug}`}>
            <div className="ha-next-shine" aria-hidden />
            <div className="ha-next-content">
              <p className="ha-next-label">Up Next</p>
              <h4 className="ha-next-title">{article.nextTitle}</h4>
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
