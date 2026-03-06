import type { MetadataRoute } from "next";

import { buildLocaleAlternatesAbsolute, toAbsoluteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

type SitemapEntry = MetadataRoute.Sitemap[number];

const LOCALIZED_STATIC_SUFFIXES = ["", "/terms", "/privacy", "/refund-policy", "/cookie-policy"];

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

  return entries;
}
