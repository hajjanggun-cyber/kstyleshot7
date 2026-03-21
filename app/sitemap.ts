import type { MetadataRoute } from "next";

import { getAllSlugs, getMdxArticle } from "@/lib/mdx";
import { buildLocaleAlternatesAbsolute, toAbsoluteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

type SitemapEntry = MetadataRoute.Sitemap[number];

const LOCALIZED_STATIC_SUFFIXES: { suffix: string; changeFreq: "weekly" | "monthly"; priority: number }[] = [
  { suffix: "",                 changeFreq: "weekly",  priority: 1   },
  { suffix: "/hub",             changeFreq: "weekly",  priority: 0.9 },
  { suffix: "/terms",           changeFreq: "monthly", priority: 0.8 },
  { suffix: "/privacy",         changeFreq: "monthly", priority: 0.8 },
  { suffix: "/refund-policy",   changeFreq: "monthly", priority: 0.8 },
  { suffix: "/cookie-policy",   changeFreq: "monthly", priority: 0.8 },
];

function withAlternates(entry: SitemapEntry, languages: Record<string, string>): SitemapEntry {
  return {
    ...entry,
    alternates: {
      languages
    }
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages — KO + EN each submitted as separate entries
  for (const { suffix, changeFreq, priority } of LOCALIZED_STATIC_SUFFIXES) {
    const languages = buildLocaleAlternatesAbsolute((locale) => `/${locale}${suffix}`);
    for (const locale of routing.locales) {
      entries.push(
        withAlternates(
          {
            url: toAbsoluteUrl(`/${locale}${suffix}`),
            lastModified: now,
            changeFrequency: changeFreq,
            priority,
          },
          languages
        )
      );
    }
  }

  // Hub MDX articles — one entry per locale URL (KO + EN each indexed separately)
  for (const locale of routing.locales) {
    const slugs = getAllSlugs(locale);
    for (const slug of slugs) {
      const article = getMdxArticle(locale, slug);
      const lastModified = article?.frontmatter.publishedAt
        ? new Date(article.frontmatter.publishedAt)
        : now;
      const languages = buildLocaleAlternatesAbsolute(
        (l) => `/${l}/hub/${slug}`
      );
      const canonicalUrl = toAbsoluteUrl(`/${locale}/hub/${slug}`);
      entries.push(
        withAlternates(
          {
            url: canonicalUrl,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.7,
          },
          languages
        )
      );
    }
  }

  return entries;
}
