import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import { ArticleSourceBox } from "@/components/hub/ArticleSourceBox";
import type { ArticleFrontmatter } from "@/lib/mdx";

const imageSizeCache = new Map<string, { width: number; height: number }>();

async function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  const cached = imageSizeCache.get(src);
  if (cached) return cached;

  if (!src.startsWith("/")) {
    const fallback = { width: 800, height: 450 };
    imageSizeCache.set(src, fallback);
    return fallback;
  }

  const filePath = path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
  try {
    const buffer = await fs.readFile(filePath);
    const metadata = await sharp(buffer).metadata();
    const size = {
      width: metadata.width ?? 800,
      height: metadata.height ?? 450,
    };
    imageSizeCache.set(src, size);
    return size;
  } catch {
    const fallback = { width: 800, height: 450 };
    imageSizeCache.set(src, fallback);
    return fallback;
  }
}

type HubMdxPageProps = {
  frontmatter: ArticleFrontmatter;
  content: string;
  lang: string;
};

export async function HubMdxPage({ frontmatter, content, lang }: HubMdxPageProps) {
  const firstImageSrc = content.match(/!\[[^\]]*]\((\/images\/[^)\s]+)\)/)?.[1] ?? null;
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
    img: async ({ src, alt }: { src?: string; alt?: string }) => {
      if (!src) return null;
      const { width, height } = await getImageDimensions(src);
      const isPriority = src === firstImageSrc;
      return (
        <Image
          className="ha-media"
          src={src}
          alt={alt ?? ""}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 800px"
          priority={isPriority}
          fetchPriority={isPriority ? "high" : undefined}
          loading={isPriority ? "eager" : "lazy"}
          unoptimized
          style={{ width: "100%", height: "auto" }}
        />
      );
    },
  };

  return (
    <div className="ha-root">
      <nav className="ha-nav">
        <Link className="ha-nav-back" href={`/${lang}/hub`} aria-label="Back">
          ←
        </Link>
        <div className="ha-nav-links" aria-label={lang === "ko" ? "글 주요 메뉴" : "Article primary navigation"}>
          <Link href={`/${lang}`}>{lang === "ko" ? "홈" : "Home"}</Link>
          <Link href={`/${lang}/hub`}>{lang === "ko" ? "가이드" : "Guides"}</Link>
          <Link href={`/${lang}/about`}>{lang === "ko" ? "소개" : "About"}</Link>
        </div>
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
      </nav>

      <header className="ha-hero" style={{ background: frontmatter.headerGradient }}>
        <div className="ha-hero-badge">
          {frontmatter.category} · {frontmatter.readTime}
        </div>
        <h1 className="ha-hero-title">{frontmatter.title}</h1>
        <div className="ha-hero-meta">
          <span className="ha-hero-author">
            {frontmatter.authorName ?? (lang === "ko" ? "K-StyleShot 에디토리얼팀" : "K-StyleShot Editorial Team")}
          </span>
          {frontmatter.publishedAt ? (
            <>
              <span className="ha-hero-meta-sep" aria-hidden>·</span>
              <time className="ha-hero-date" dateTime={frontmatter.publishedAt}>
                {new Date(frontmatter.publishedAt).toLocaleDateString(
                  lang === "ko" ? "ko-KR" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </time>
            </>
          ) : null}
        </div>
      </header>

      <section className="ha-quote-wrap">
        <div className="ha-quote-card">
          <span className="ha-quote-mark" aria-hidden>
            "
          </span>
          <p className="ha-quote-text">{frontmatter.pullQuote}</p>
        </div>
      </section>

      <article className="ha-body">
        <ArticleSourceBox slug={frontmatter.slug} lang={lang} />
        <MDXRemote source={content} components={mdxComponents} />
      </article>

      {frontmatter.nextSlug && frontmatter.nextTitle ? (
        <div className="ha-next-wrap">
          <Link className="ha-next-card" href={`/${lang}/hub/${frontmatter.nextSlug}`}>
            <div className="ha-next-shine" aria-hidden />
            <div className="ha-next-content">
              <p className="ha-next-label">Up Next</p>
              <h4 className="ha-next-title">{frontmatter.nextTitle}</h4>
            </div>
            <span className="ha-next-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
