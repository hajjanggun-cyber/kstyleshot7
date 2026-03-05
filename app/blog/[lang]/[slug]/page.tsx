import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SimpleMdx } from "@/components/common/SimpleMdx";
import {
  getAllBlogParams,
  getBlogCategorySlug,
  getBlogPostBySlug,
  getBlogPosts
} from "@/lib/blog";
import type { AppLocale } from "@/i18n/routing";
import { getOgLocale, toAbsoluteAssetUrl, toAbsoluteUrl } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

function toIsoDate(input: string): string | undefined {
  if (!input) {
    return undefined;
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function getPostImageList(post: { heroImage: string; galleryImages: string[] }): string[] {
  return Array.from(new Set([post.heroImage, ...post.galleryImages].filter(Boolean))).map((src) =>
    toAbsoluteAssetUrl(src)
  );
}

function getReadingMinutes(body: string): number {
  const wordCount = body
    .replace(/[`#>*_\-\[\]\(\)]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 220));
}

export async function generateStaticParams() {
  return getAllBlogParams();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (lang !== "en" && lang !== "ko") {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const post = await getBlogPostBySlug(lang, slug);
  if (!post) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const oppositeLang: AppLocale = lang === "en" ? "ko" : "en";
  const languages: Record<string, string> = {
    [lang]: `/blog/${lang}/${post.slug}`
  };

  if (post.pairSlug) {
    const pairedPost = await getBlogPostBySlug(oppositeLang, post.pairSlug);
    if (pairedPost) {
      languages[oppositeLang] = `/blog/${oppositeLang}/${pairedPost.slug}`;
    }
  } else {
    const sameSlugPost = await getBlogPostBySlug(oppositeLang, post.slug);
    if (sameSlugPost) {
      languages[oppositeLang] = `/blog/${oppositeLang}/${sameSlugPost.slug}`;
    }
  }

  if (languages.en) {
    languages["x-default"] = languages.en;
  }

  const canonicalPath = post.canonical || `/blog/${lang}/${post.slug}`;
  const openGraphImages = getPostImageList(post).map((imageUrl) => ({
    url: imageUrl,
    alt: post.heroAlt || post.title
  }));

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: canonicalPath,
      languages
    },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: post.title,
      description: post.description,
      locale: getOgLocale(lang),
      alternateLocale: [getOgLocale(oppositeLang)],
      publishedTime: toIsoDate(post.date),
      modifiedTime: toIsoDate(post.updated) ?? toIsoDate(post.date),
      section: post.category,
      tags: post.tags,
      images: openGraphImages
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: openGraphImages.map((image) => image.url)
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  if (lang !== "en" && lang !== "ko") {
    notFound();
  }

  const post = await getBlogPostBySlug(lang, slug);
  if (!post) {
    notFound();
  }

  const oppositeLang: AppLocale = lang === "en" ? "ko" : "en";
  const categorySlug = getBlogCategorySlug(post.category);
  const readingMinutes = getReadingMinutes(post.body);

  let pairedPath: string | null = null;
  if (post.pairSlug) {
    const pairedPost = await getBlogPostBySlug(oppositeLang, post.pairSlug);
    if (pairedPost) {
      pairedPath = `/blog/${oppositeLang}/${pairedPost.slug}`;
    }
  } else {
    const sameSlugPost = await getBlogPostBySlug(oppositeLang, post.slug);
    if (sameSlugPost) {
      pairedPath = `/blog/${oppositeLang}/${sameSlugPost.slug}`;
    }
  }

  const relatedPosts = (await getBlogPosts(lang))
    .filter((entry) => entry.slug !== post.slug && entry.category === post.category)
    .slice(0, 3);

  const galleryItems = post.galleryImages.map((src, index) => ({
    src,
    alt: post.galleryAlts[index] || `${post.title} image ${index + 1}`,
    promptId: post.galleryPromptIds[index] || ""
  }));

  const canonicalUrl = toAbsoluteAssetUrl(post.canonical || `/blog/${lang}/${post.slug}`);
  const postImages = getPostImageList(post);
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Style Guide",
      item: toAbsoluteUrl("/blog")
    },
    {
      "@type": "ListItem",
      position: 2,
      name: lang === "en" ? "English Guides" : "한국어 가이드",
      item: toAbsoluteUrl(`/blog/${lang}`)
    },
    ...(categorySlug
      ? [
          {
            "@type": "ListItem",
            position: 3,
            name: post.category,
            item: toAbsoluteUrl(`/blog/${lang}/category/${categorySlug}`)
          }
        ]
      : []),
    {
      "@type": "ListItem",
      position: categorySlug ? 4 : 3,
      name: post.title,
      item: canonicalUrl
    }
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: post.title,
      description: post.description,
      url: canonicalUrl,
      inLanguage: lang,
      isPartOf: {
        "@type": "WebSite",
        name: "kstyleshot",
        url: toAbsoluteUrl("/")
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: postImages,
      datePublished: toIsoDate(post.date),
      dateModified: toIsoDate(post.updated) ?? toIsoDate(post.date),
      inLanguage: lang,
      articleSection: post.category,
      keywords: post.tags.join(", "),
      mainEntityOfPage: canonicalUrl,
      author: {
        "@type": "Organization",
        name: "kstyleshot"
      },
      publisher: {
        "@type": "Organization",
        name: "kstyleshot",
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteAssetUrl("/visuals/landing/hero-scene.svg")
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems
    }
  ];

  return (
    <main className="stack">
      <article className="card stack">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <nav aria-label="Breadcrumb" className="actions">
          <Link className="button secondary" href="/blog">
            Style Guide
          </Link>
          <Link className="button secondary" href={`/blog/${lang}`}>
            {lang === "en" ? "English" : "한국어"}
          </Link>
          {categorySlug ? (
            <Link className="button secondary" href={`/blog/${lang}/category/${categorySlug}`}>
              {post.category}
            </Link>
          ) : null}
        </nav>
        <div className="actions">
          <Link className="button secondary" href={`/blog/${lang}`}>
            {lang === "en" ? "Back to list" : "목록으로"}
          </Link>
          {pairedPath ? (
            <Link className="button secondary" href={pairedPath} prefetch={false}>
              {lang === "en" ? "한국어 보기" : "Read in English"}
            </Link>
          ) : null}
        </div>
        <div className="actions">
          <span className="count-badge">{post.category}</span>
          <span className="muted">{post.date}</span>
          <span className="muted">{post.lang.toUpperCase()}</span>
          <span className="muted">
            {lang === "en" ? `${readingMinutes} min read` : `${readingMinutes}분 읽기`}
          </span>
        </div>
        <h1>{post.title}</h1>
        <p className="muted">{post.description}</p>
        <div className="preview-frame blog-post-media">
          <img
            alt={post.heroAlt || post.title}
            loading="eager"
            src={post.heroImage || "/visuals/blog/post.svg"}
          />
        </div>
        {galleryItems.length > 0 ? (
          <section className="blog-gallery-grid" aria-label="Post image gallery">
            {galleryItems.map((item, index) => (
              <figure className="blog-gallery-item" key={`${item.src}-${index}`}>
                <img alt={item.alt} loading="lazy" src={item.src} />
                <figcaption className="muted">
                  {item.promptId ? `Image ${index + 1} | ${item.promptId}` : `Image ${index + 1}`}
                </figcaption>
              </figure>
            ))}
          </section>
        ) : null}
        <div className="actions">
          {post.tags.map((tag) => (
            <span className="muted" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
        <SimpleMdx body={post.body} />
      </article>

      {relatedPosts.length > 0 ? (
        <section className="card stack">
          <h2>{lang === "en" ? "Related posts" : "관련 글"}</h2>
          <div className="grid two">
            {relatedPosts.map((entry) => (
              <article className="card stack" key={entry.slug}>
                <div className="actions">
                  <span className="count-badge">{entry.category}</span>
                  <span className="muted">{entry.date}</span>
                </div>
                <h3>{entry.title}</h3>
                <p className="muted">{entry.description}</p>
                <Link className="button secondary" href={`/blog/${lang}/${entry.slug}`}>
                  {lang === "en" ? "Read post" : "글 읽기"}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

