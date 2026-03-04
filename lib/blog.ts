import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type BlogLang = "en" | "ko";

export type BlogPostMeta = {
  title: string;
  slug: string;
  lang: BlogLang;
  date: string;
  updated: string;
  description: string;
  tags: string[];
  category: string;
  draft: boolean;
  canonical: string;
  pairSlug: string;
  ctaVariant: string;
};

export type BlogPost = BlogPostMeta & {
  body: string;
};

type ParsedFrontmatter = Record<string, string | string[] | boolean>;

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const BLOG_LANGS: BlogLang[] = ["en", "ko"];

function assertBlogLang(lang: string): BlogLang {
  if (lang !== "en" && lang !== "ko") {
    throw new Error(`Unsupported blog language: ${lang}`);
  }

  return lang;
}

function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

function parseStringArray(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return [];
  }

  const content = trimmed.slice(1, -1).trim();
  if (!content) {
    return [];
  }

  return content
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseFrontmatter(raw: string): { frontmatter: ParsedFrontmatter; body: string } {
  if (!raw.startsWith("---")) {
    return { frontmatter: {}, body: raw.trim() };
  }

  const endIndex = raw.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { frontmatter: {}, body: raw.trim() };
  }

  const frontmatterBlock = raw.slice(4, endIndex).trim();
  const body = raw.slice(endIndex + 4).trim();
  const frontmatter: ParsedFrontmatter = {};

  for (const line of frontmatterBlock.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    if (rawValue.startsWith("[")) {
      frontmatter[key] = parseStringArray(rawValue);
      continue;
    }

    if (rawValue === "true" || rawValue === "false") {
      frontmatter[key] = parseBoolean(rawValue);
      continue;
    }

    frontmatter[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return { frontmatter, body };
}

function buildPost(meta: ParsedFrontmatter, body: string, lang: BlogLang, fallbackSlug: string): BlogPost {
  return {
    title: String(meta.title ?? fallbackSlug),
    slug: String(meta.slug ?? fallbackSlug),
    lang,
    date: String(meta.date ?? ""),
    updated: String(meta.updated ?? meta.date ?? ""),
    description: String(meta.description ?? ""),
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    category: String(meta.category ?? "General"),
    draft: Boolean(meta.draft ?? false),
    canonical: String(meta.canonical ?? ""),
    pairSlug: String(meta.pairSlug ?? ""),
    ctaVariant: String(meta.ctaVariant ?? "default"),
    body
  };
}

async function readPostFile(lang: BlogLang, fileName: string): Promise<BlogPost> {
  const fullPath = path.join(BLOG_ROOT, lang, fileName);
  const raw = await readFile(fullPath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const fallbackSlug = fileName.replace(/\.mdx$/i, "");
  return buildPost(frontmatter, body, lang, fallbackSlug);
}

export async function getBlogPosts(lang: string): Promise<BlogPost[]> {
  const safeLang = assertBlogLang(lang);
  const dirPath = path.join(BLOG_ROOT, safeLang);
  const files = await readdir(dirPath);

  const posts = await Promise.all(
    files
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => readPostFile(safeLang, fileName))
  );

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPostBySlug(lang: string, slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts(lang);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllBlogParams(): Promise<Array<{ lang: BlogLang; slug: string }>> {
  const postsByLang = await Promise.all(BLOG_LANGS.map((lang) => getBlogPosts(lang)));

  return postsByLang.flatMap((posts, index) =>
    posts.map((post) => ({
      lang: BLOG_LANGS[index],
      slug: post.slug
    }))
  );
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  const allPosts = (await Promise.all(BLOG_LANGS.map((lang) => getBlogPosts(lang)))).flat();
  return allPosts.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

