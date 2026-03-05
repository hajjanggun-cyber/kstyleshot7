import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";
import { toAbsoluteAssetUrl, toAbsoluteUrl } from "@/lib/seo";
import { routing, type AppLocale } from "@/i18n/routing";

type SitemapEntry = MetadataRoute.Sitemap[number];

function parseIsoDate(input: string): Date | undefined {
  if (!input) {
    return undefined;
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function withAlternates(entry: SitemapEntry, languages: Record<string, string>): SitemapEntry {
  return {
    ...entry,
    alternates: {
      languages
    }
  };
}

function resolvePairLocale(locale: AppLocale): AppLocale {
  return locale === "en" ? "ko" : "en";
}

function buildPostImages(post: {
  heroImage: string;
  galleryImages: string[];
}): string[] {
  const candidates = [post.heroImage, ...post.galleryImages].filter(Boolean);
  return Array.from(new Set(candidates)).map((src) => toAbsoluteAssetUrl(src));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [enPosts, koPosts] = await Promise.all([getBlogPosts("en"), getBlogPosts("ko")]);
  const postsByLocale: Record<AppLocale, typeof enPosts> = {
    en: enPosts,
    ko: koPosts
  };
  const slugLookupByLocale: Record<AppLocale, Map<string, { slug: string; updated: string; date: string }>> = {
    en: new Map(enPosts.map((post) => [post.slug, { slug: post.slug, updated: post.updated, date: post.date }])),
    ko: new Map(koPosts.map((post) => [post.slug, { slug: post.slug, updated: post.updated, date: post.date }]))
  };

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const post of postsByLocale[locale]) {
      const pairedLocale = resolvePairLocale(locale);
      const currentPath = `/blog/${locale}/${post.slug}`;
      const languages: Record<string, string> = {
        [locale]: toAbsoluteUrl(currentPath)
      };

      const pairCandidates = [post.pairSlug, post.slug].filter(Boolean);
      for (const candidate of pairCandidates) {
        const pairedPost = slugLookupByLocale[pairedLocale].get(candidate);
        if (!pairedPost) {
          continue;
        }

        languages[pairedLocale] = toAbsoluteUrl(`/blog/${pairedLocale}/${pairedPost.slug}`);
        break;
      }

      if (languages.en) {
        languages["x-default"] = languages.en;
      }

      entries.push(
        withAlternates(
          {
            url: toAbsoluteUrl(currentPath),
            lastModified: parseIsoDate(post.updated) ?? parseIsoDate(post.date) ?? now,
            changeFrequency: "weekly",
            priority: 0.8,
            images: buildPostImages(post)
          },
          languages
        )
      );
    }
  }

  return entries;
}
