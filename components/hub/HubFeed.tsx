"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { hubPosts, hubPostsEn, FILTER_CHIPS_KO, FILTER_CHIPS_EN, type HubPost } from "@/data/hubPosts";

/* ─── Category badge ─────────────────────────── */
function Badge({ label, style }: { label: string; style: HubPost["categoryStyle"] }) {
  const cls: Record<HubPost["categoryStyle"], string> = {
    pink: "hf-badge hf-badge--pink",
    cyan: "hf-badge hf-badge--cyan",
    "black-on-yellow": "hf-badge hf-badge--yellow",
    "white-on-pink": "hf-badge hf-badge--glass",
  };
  return <span className={cls[style]}>{label}</span>;
}

/* ─── Hero card ───────────────────────────────── */
function HeroCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <Link className="hf-hero" href={href} style={{ background: post.bg }}>
      <div className="hf-hero-top">
        <Badge label={post.category} style={post.categoryStyle} />
        <span className="hf-hero-star">★</span>
      </div>
      {post.watermark && (
        <span className="hf-hero-watermark" aria-hidden>
          {post.watermark}
        </span>
      )}
      <div className="hf-hero-body">
        <h3 className="hf-hero-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h3>
        <p className="hf-hero-sub" style={{ color: post.subtitleColor }}>
          {post.subtitle}
        </p>
        {post.cta && <span className="hf-hero-cta">{post.cta}</span>}
      </div>
    </Link>
  );
}

/* ─── Square card ─────────────────────────────── */
function SquareCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <Link className="hf-square" href={href} style={{ background: post.bg }}>
      <Badge label={post.category} style={post.categoryStyle} />
      {post.watermark && (
        <span className="hf-square-watermark" aria-hidden style={{ color: post.titleColor }}>
          {post.watermark}
        </span>
      )}
      <div className="hf-square-body">
        <h4 className="hf-square-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h4>
        {post.subtitle && (
          <p className="hf-square-sub" style={{ color: post.subtitleColor }}>
            {post.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ─── Tall card ───────────────────────────────── */
function TallCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <Link className="hf-tall" href={href} style={{ background: post.bg }}>
      <Badge label={post.category} style={post.categoryStyle} />
      <h4 className="hf-tall-title" style={{ color: post.titleColor }}>
        {post.title.split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </h4>
      {post.readers && (
        <div className="hf-tall-footer">
          <div className="hf-tall-avatars">
            <span className="hf-tall-avatar" />
            <span className="hf-tall-avatar" />
            <span className="hf-tall-avatar" />
          </div>
          <p className="hf-tall-readers">{post.readers}</p>
        </div>
      )}
    </Link>
  );
}

/* ─── Small card ──────────────────────────────── */
function SmallCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <Link className="hf-small" href={href} style={{ background: post.bg }}>
      <span
        className="hf-small-cat"
        style={{ color: post.categoryStyle === "cyan" ? "#ffffff" : "#f4258c" }}
      >
        {post.category}
      </span>
      <h4 className="hf-small-title" style={{ color: post.titleColor }}>
        {post.title}
      </h4>
      {post.watermarkIcon && (
        <span className="hf-small-icon" aria-hidden>{post.watermarkIcon}</span>
      )}
    </Link>
  );
}

/* ─── Wide card ───────────────────────────────── */
function WideCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <Link className="hf-wide" href={href} style={{ background: post.bg }}>
      <div>
        <span className="hf-wide-cat" style={{ color: post.titleColor }}>
          {post.category}
        </span>
        <h3 className="hf-wide-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h3>
      </div>
      <div className="hf-wide-arrow" style={{ color: post.titleColor }}>→</div>
    </Link>
  );
}

/* ─── Main feed ───────────────────────────────── */
export function HubFeed() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const isKo = lang === "ko";
  const posts = isKo ? hubPosts : hubPostsEn;
  const chips = isKo ? FILTER_CHIPS_KO : FILTER_CHIPS_EN;
  const [activeChip, setActiveChip] = useState(isKo ? "전체" : "All");
  const [search, setSearch] = useState("");

  return (
    <div className="hf-root">
      {/* Header */}
      <header className="hf-header">
        <span className="hf-header-icon">⊞</span>
        <h1 className="hf-header-title">K-Culture Hub</h1>
        <button className="hf-header-avatar" type="button">👤</button>
      </header>

      {/* Search */}
      <div className="hf-search-wrap">
        <div className="hf-search-box">
          <span className="hf-search-icon">🔍</span>
          <input
            className="hf-search-input"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 300+ Stories"
            type="text"
            value={search}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="hf-chips">
        {chips.map((chip) => (
          <button
            className={`hf-chip${activeChip === chip ? " hf-chip--active" : ""}`}
            key={chip}
            onClick={() => setActiveChip(chip)}
            type="button"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <div className="hf-grid">
        {posts.map((post) => {
          const href = `/${lang}/hub/${post.slug}`;
          if (post.cardType === "hero")   return <HeroCard   href={href} key={post.slug} post={post} />;
          if (post.cardType === "square") return <SquareCard href={href} key={post.slug} post={post} />;
          if (post.cardType === "tall")   return <TallCard   href={href} key={post.slug} post={post} />;
          if (post.cardType === "small")  return <SmallCard  href={href} key={post.slug} post={post} />;
          if (post.cardType === "wide")   return <WideCard   href={href} key={post.slug} post={post} />;
          return null;
        })}
      </div>

      {/* Bottom nav */}
      <div className="hf-nav">
        <nav className="hf-nav-pill">
          <Link className="hf-nav-item hf-nav-item--active" href={`/${lang}/hub`}>
            <span className="hf-nav-icon">⌂</span>
            <span className="hf-nav-label">Feed</span>
          </Link>
          <Link className="hf-nav-item" href={`/${lang}/create`}>
            <span className="hf-nav-icon">✦</span>
            <span className="hf-nav-label">AI Studio</span>
          </Link>
          <button className="hf-nav-item" type="button">
            <span className="hf-nav-icon">🗺</span>
            <span className="hf-nav-label">Map</span>
          </button>
          <button className="hf-nav-item" type="button">
            <span className="hf-nav-icon">👤</span>
            <span className="hf-nav-label">Me</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
