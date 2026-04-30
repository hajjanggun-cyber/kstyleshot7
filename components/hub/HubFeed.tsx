"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";

import { type HubPost } from "@/data/hubPosts";

function CardShell({
  post,
  href,
  className,
  style,
  children,
}: {
  post: HubPost;
  href: string;
  className: string;
  style: CSSProperties;
  children: ReactNode;
}) {
  if (post.disabled) {
    return (
      <div aria-disabled="true" className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <Link className={className} href={href} style={style}>
      {children}
    </Link>
  );
}

function Badge({ label, style }: { label: string; style: HubPost["categoryStyle"] }) {
  const cls: Record<HubPost["categoryStyle"], string> = {
    pink: "hf-badge hf-badge--pink",
    cyan: "hf-badge hf-badge--cyan",
    "black-on-yellow": "hf-badge hf-badge--yellow",
    "white-on-pink": "hf-badge hf-badge--glass",
  };

  return <span className={cls[style]}>{label}</span>;
}

function HeroCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <CardShell className="hf-hero" href={href} post={post} style={{ background: post.bg }}>
      <div className="hf-hero-top">
        <Badge label={post.category} style={post.categoryStyle} />
        <span className="hf-hero-star" aria-hidden>
          ✦
        </span>
      </div>
      {post.watermark ? <span className="hf-hero-watermark" aria-hidden>{post.watermark}</span> : null}
      <div className="hf-hero-body">
        <h3 className="hf-hero-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h3>
        <p className="hf-hero-sub" style={{ color: post.subtitleColor }}>
          {post.subtitle}
        </p>
        {post.cta ? <span className="hf-hero-cta">{post.cta}</span> : null}
      </div>
    </CardShell>
  );
}

function HalfHeroCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <CardShell className="hf-half-hero" href={href} post={post} style={{ background: post.bg }}>
      <div className="hf-hero-top">
        <Badge label={post.category} style={post.categoryStyle} />
        <span className="hf-hero-star" aria-hidden>
          ✦
        </span>
      </div>
      {post.watermark ? <span className="hf-hero-watermark" aria-hidden>{post.watermark}</span> : null}
      <div className="hf-hero-body">
        <h3 className="hf-hero-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h3>
        <p className="hf-hero-sub" style={{ color: post.subtitleColor }}>
          {post.subtitle}
        </p>
        {post.cta ? <span className="hf-hero-cta">{post.cta}</span> : null}
      </div>
    </CardShell>
  );
}

function SquareCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <CardShell className="hf-square" href={href} post={post} style={{ background: post.bg }}>
      <Badge label={post.category} style={post.categoryStyle} />
      {post.watermark ? (
        <span className="hf-square-watermark" aria-hidden style={{ color: post.titleColor }}>
          {post.watermark}
        </span>
      ) : null}
      <div className="hf-square-body">
        <h4 className="hf-square-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h4>
        {post.subtitle ? (
          <p className="hf-square-sub" style={{ color: post.subtitleColor }}>
            {post.subtitle}
          </p>
        ) : null}
      </div>
    </CardShell>
  );
}

function TallCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <CardShell className="hf-tall" href={href} post={post} style={{ background: post.bg }}>
      <Badge label={post.category} style={post.categoryStyle} />
      <h4 className="hf-tall-title" style={{ color: post.titleColor }}>
        {post.title.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </h4>
      {post.readers ? (
        <div className="hf-tall-footer">
          <div className="hf-tall-avatars">
            <span className="hf-tall-avatar" />
            <span className="hf-tall-avatar" />
            <span className="hf-tall-avatar" />
          </div>
          <p className="hf-tall-readers">{post.readers}</p>
        </div>
      ) : null}
    </CardShell>
  );
}

function SmallCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <CardShell className="hf-small" href={href} post={post} style={{ background: post.bg }}>
      <span
        className="hf-small-cat"
        style={{ color: post.categoryStyle === "cyan" ? "#ffffff" : "#f4258c" }}
      >
        {post.category}
      </span>
      <h4 className="hf-small-title" style={{ color: post.titleColor }}>
        {post.title}
      </h4>
      {post.watermarkIcon ? <span className="hf-small-icon" aria-hidden>{post.watermarkIcon}</span> : null}
    </CardShell>
  );
}

function WideCard({ post, href }: { post: HubPost; href: string }) {
  return (
    <CardShell className="hf-wide" href={href} post={post} style={{ background: post.bg }}>
      <div>
        <span className="hf-wide-cat" style={{ color: post.titleColor }}>
          {post.category}
        </span>
        <h3 className="hf-wide-title" style={{ color: post.titleColor }}>
          {post.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h3>
      </div>
      <div className="hf-wide-arrow" style={{ color: post.titleColor }}>
        →
      </div>
    </CardShell>
  );
}

export function HubFeed({
  initialPosts,
  initialChips,
  lang,
}: {
  initialPosts: HubPost[];
  initialChips: string[];
  lang: string;
}) {
  const isKo = lang === "ko";
  const posts = initialPosts;
  const chips = initialChips;
  const featuredPosts = posts.slice(0, 4);
  const bottomShelfPosts = posts.filter((post) => post.cardType === "hero" || post.cardType === "half-hero").slice(0, 6);
  const [activeChip, setActiveChip] = useState(chips[0] ?? "All");
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const chipMatches = activeChip === chips[0] || post.category === activeChip;

    if (!chipMatches) return false;
    if (!normalizedSearch) return true;

    const haystack = [post.title, post.subtitle, post.category].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  return (
    <div className="hf-root">
      <header className="hf-header">
        <Link className="hf-header-home" href={`/${lang}`} aria-label={isKo ? "홈으로 이동" : "Go to home page"}>
          <span className="hf-header-icon" aria-hidden>
            <span className="hf-header-icon-core">
              <svg viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
                <path
                  d="M6 17.5V6.5h2.4v4.35L13.3 6.5h3.05l-5 4.35 5.35 6.65h-3.1L9.9 12.9l-1.5 1.3v3.3H6Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </span>
          <span className="hf-header-copy">
            <span className="hf-header-kicker">HOME</span>
            <span className="hf-header-title">KStyleShot</span>
            <span className="hf-header-subtitle">
              {isKo ? "홈으로 돌아가기" : "Back to home"}
            </span>
          </span>
        </Link>
        <div className="hf-lang-toggle">
          <Link className={`hf-lang-btn${isKo ? " hf-lang-btn--active" : ""}`} href="/ko/hub">
            KO
          </Link>
          <span className="hf-lang-divider">|</span>
          <Link className={`hf-lang-btn${!isKo ? " hf-lang-btn--active" : ""}`} href="/en/hub">
            EN
          </Link>
        </div>
      </header>

      <section className="hf-featured" aria-label={isKo ? "추천 대표 가이드" : "Featured core guides"}>
        <div className="hf-featured-head">
          <div>
            <p className="hf-featured-kicker">{isKo ? "추천 가이드" : "Editorial Guides"}</p>
            <h2 className="hf-featured-title">
              {isKo ? "먼저 읽기 좋은 대표 가이드" : "Start with These Core Guides"}
            </h2>
          </div>
          <p className="hf-featured-copy">
            {isKo
              ? "서울 여행, K-뷰티, K-패션처럼 자주 찾는 주제를 기준으로 대표 가이드를 먼저 묶었습니다."
              : "This shelf groups core Seoul, K-beauty, and K-fashion guides around common reader intents."}
          </p>
        </div>

        <div className="hf-featured-scroll">
          {featuredPosts.map((post) => (
            <Link
              className="hf-featured-card"
              href={`/${lang}/hub/${post.slug}`}
              key={post.slug}
              style={{ background: post.bg }}
            >
              <Badge label={post.category} style={post.categoryStyle} />
              <div className="hf-featured-body">
                <h3 className="hf-featured-card-title" style={{ color: post.titleColor }}>
                  {post.title.replace(/\n/g, " ")}
                </h3>
                {post.subtitle ? (
                  <p className="hf-featured-card-sub" style={{ color: post.subtitleColor }}>
                    {post.subtitle}
                  </p>
                ) : null}
              </div>
              <span className="hf-featured-cta" style={{ color: post.titleColor }}>
                {post.cta ?? (isKo ? "읽기" : "Read")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="hf-search-wrap">
        <div className="hf-search-box">
          <span className="hf-search-icon" aria-hidden>
            ⌕
          </span>
          <input
            className="hf-search-input"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isKo ? "가이드 검색" : "Search guides"}
            type="text"
            value={search}
          />
        </div>
      </div>

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

      <div className="hf-grid">
        {filteredPosts.map((post) => {
          const href = `/${lang}/hub/${post.slug}`;
          if (post.cardType === "hero") return <HeroCard href={href} key={post.slug} post={post} />;
          if (post.cardType === "half-hero") return <HalfHeroCard href={href} key={post.slug} post={post} />;
          if (post.cardType === "square") return <SquareCard href={href} key={post.slug} post={post} />;
          if (post.cardType === "tall") return <TallCard href={href} key={post.slug} post={post} />;
          if (post.cardType === "small") return <SmallCard href={href} key={post.slug} post={post} />;
          if (post.cardType === "wide") return <WideCard href={href} key={post.slug} post={post} />;
          return null;
        })}
      </div>

      <section className="hf-bottom-section" aria-label={isKo ? "대표 가이드 더 보기" : "More core guides"}>
        <div className="hf-bottom-head">
          <div>
            <p className="hf-bottom-kicker">{isKo ? "주요 주제" : "Core Guides"}</p>
            <h2 className="hf-bottom-title">
              {isKo ? "주제별로 다시 보는 대표 가이드" : "Reopen the Main Guide Clusters"}
            </h2>
          </div>
          <p className="hf-bottom-copy">
            {isKo
              ? "목록을 내려본 뒤에도 서울 명소와 뷰티 루틴처럼 핵심 주제로 다시 돌아갈 수 있게 정리했습니다."
              : "After browsing the list, this shelf keeps the main Seoul and beauty clusters easy to reopen."}
          </p>
        </div>

        <div className="hf-bottom-grid">
          {bottomShelfPosts.map((post) => (
            <Link
              className="hf-featured-card"
              href={`/${lang}/hub/${post.slug}`}
              key={`bottom-${post.slug}`}
              style={{ background: post.bg }}
            >
              <Badge label={post.category} style={post.categoryStyle} />
              <div className="hf-featured-body">
                <h3 className="hf-featured-card-title" style={{ color: post.titleColor }}>
                  {post.title.replace(/\n/g, " ")}
                </h3>
                {post.subtitle ? (
                  <p className="hf-featured-card-sub" style={{ color: post.subtitleColor }}>
                    {post.subtitle}
                  </p>
                ) : null}
              </div>
              <span className="hf-featured-cta" style={{ color: post.titleColor }}>
                {post.cta ?? (isKo ? "읽기" : "Read")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="hf-nav">
        <nav className="hf-nav-pill">
          <Link className="hf-nav-item hf-nav-item--active" href={`/${lang}/hub`}>
            <span className="hf-nav-icon" aria-hidden>
              ◇
            </span>
            <span className="hf-nav-label">{isKo ? "가이드" : "Guides"}</span>
          </Link>
          <Link className="hf-nav-item" href={`/${lang}`}>
            <span className="hf-nav-icon" aria-hidden>
              ⌂
            </span>
            <span className="hf-nav-label">{isKo ? "홈" : "Home"}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
