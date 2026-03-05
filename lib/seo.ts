import { routing, type AppLocale } from "@/i18n/routing";

const DEFAULT_SITE_URL = "https://www.kstylewshot.com";

function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeSiteUrl(raw: string | undefined): string {
  if (!raw) {
    return DEFAULT_SITE_URL;
  }

  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL);
}

export function toAbsoluteUrl(path: string): string {
  return new URL(ensureLeadingSlash(path), getSiteUrl()).toString();
}

export function buildLocaleAlternates(
  getPath: (locale: AppLocale) => string,
  includeXDefault = true
): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = ensureLeadingSlash(getPath(locale));
  }

  if (includeXDefault) {
    languages["x-default"] = ensureLeadingSlash(getPath(routing.defaultLocale));
  }

  return languages;
}

export function buildLocaleAlternatesAbsolute(
  getPath: (locale: AppLocale) => string,
  includeXDefault = true
): Record<string, string> {
  const relative = buildLocaleAlternates(getPath, includeXDefault);
  const absolute: Record<string, string> = {};

  for (const [locale, path] of Object.entries(relative)) {
    absolute[locale] = toAbsoluteUrl(path);
  }

  return absolute;
}
