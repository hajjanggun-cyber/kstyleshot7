import fs from "fs";
import path from "path";

import matter from "gray-matter";

export type ArticleFrontmatter = {
  slug: string;
  lang: "ko" | "en";
  category: string;
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  headerGradient: string;
  pullQuote: string;
  hreflangSlug: string;
  aiGenerated: boolean;
  nextSlug?: string;
  nextTitle?: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "hub");

export function getMdxArticle(
  lang: string,
  slug: string
): { frontmatter: ArticleFrontmatter; content: string } | null {
  const filePath = path.join(CONTENT_ROOT, lang, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

export function getAllSlugs(lang: string): string[] {
  const dir = path.join(CONTENT_ROOT, lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllArticles(lang: string): ArticleFrontmatter[] {
  return getAllSlugs(lang)
    .map((slug) => getMdxArticle(lang, slug)?.frontmatter)
    .filter(Boolean) as ArticleFrontmatter[];
}
