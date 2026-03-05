import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SimpleMdx } from "@/components/common/SimpleMdx";
import { getAllBlogParams, getBlogPostBySlug } from "@/lib/blog";
import type { AppLocale } from "@/i18n/routing";

type BlogPostPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogParams();
}

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (lang !== "en" && lang !== "ko") {
    return {
      title: "Post not found"
    };
  }

  const post = await getBlogPostBySlug(lang, slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  const languages: Record<string, string> = {
    [lang]: `/blog/${lang}/${post.slug}`
  };
  const oppositeLang: AppLocale = lang === "en" ? "ko" : "en";

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

  return {
    title: `${post.title} | kstyleshot`,
    description: post.description,
    alternates: {
      canonical: post.canonical || `/blog/${lang}/${post.slug}`,
      languages
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

  return (
    <main className="stack">
      <article className="card stack">
        <div className="actions">
          <Link className="button secondary" href={`/blog/${lang}`}>
            Back to list
          </Link>
        </div>
        <div className="actions">
          <span className="count-badge">{post.category}</span>
          <span className="muted">{post.date}</span>
          <span className="muted">{post.lang.toUpperCase()}</span>
        </div>
        <h1>{post.title}</h1>
        <p className="muted">{post.description}</p>
        <div className="preview-frame blog-post-media">
          <img alt={post.title} loading="lazy" src="/visuals/blog/post.svg" />
        </div>
        <div className="actions">
          {post.tags.map((tag) => (
            <span className="muted" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
        <SimpleMdx body={post.body} />
      </article>
    </main>
  );
}
