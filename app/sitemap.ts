import type { MetadataRoute } from "next";

import { getBlogCategories, getBlogPosts } from "@/lib/blog";
import { buildLocaleAlternatesAbsolute, toAbsoluteAssetUrl, toAbsoluteUrl } from "@/lib/seo";
import { routing, type AppLocale } from "@/i18n/routing";

type SitemapEntry = MetadataRoute.Sitemap[number];

const LOCALIZED_STATIC_SUFFIXES = ["", "/terms", "/privacy", "/refund-policy", "/cookie-policy"];

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
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const suffix of LOCALIZED_STATIC_SUFFIXES) {
    const languages = buildLocaleAlternatesAbsolute((locale) => `/${locale}${suffix}`);
    const canonicalUrl = languages[routing.defaultLocale];

    entries.push(
      withAlternates(
        {
          url: canonicalUrl,
          lastModified: now,
          changeFrequency: suffix ? "monthly" : "weekly",
          priority: suffix ? 0.8 : 1
        },
        languages
      )
    );
  }

  entries.push({
    url: toAbsoluteUrl("/blog"),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9
  });

  entries.push({
    url: toAbsoluteUrl("/blog/rss.xml"),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.4
  });

  entries.push(
    withAlternates(
      {
        url: toAbsoluteUrl("/blog/en"),
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9
      },
      buildLocaleAlternatesAbsolute((locale) => `/blog/${locale}`)
    )
  );

  const categorySlugs = (await getBlogCategories("en")).map((category) => category.slug);
  for (const categorySlug of categorySlugs) {
    entries.push(
      withAlternates(
        {
          url: toAbsoluteUrl(`/blog/en/category/${categorySlug}`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8
        },
        buildLocaleAlternatesAbsolute((locale) => `/blog/${locale}/category/${categorySlug}`)
      )
    );
  }

  const [enPosts, koPosts] = await Promise.all([getBlogPosts("en"), getBlogPosts("ko")]);
  const postsByLocale: Record<AppLocale, typeof enPosts> = {
    en: enPosts,
    ko: koPosts
  };
  const slugLookupByLocale: Record<AppLocale, Map<string, { slug: string; updated: string; date: string }>> = {
    en: new Map(enPosts.map((post) => [post.slug, { slug: post.slug, updated: post.updated, date: post.date }])),
    ko: new Map(koPosts.map((post) => [post.slug, { slug: post.slug, updated: post.updated, date: post.date }]))
  };

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
            priority: 0.7,
            images: buildPostImages(post)
          },
          languages
        )
      );
    }
  }

  return entries;
}
