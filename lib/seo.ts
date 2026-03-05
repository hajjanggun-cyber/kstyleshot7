import { routing, type AppLocale } from "@/i18n/routing";

const DEFAULT_SITE_URL = "https://www.kstyleshot.com";
export const SITE_NAME = "kstyleshot";
const ROOT_DOMAIN = "kstyleshot.com";
const LEGACY_TYPO_DOMAIN = "kstylewshot.com";

function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeSiteUrl(raw: string | undefined): string {
  if (!raw) {
    return DEFAULT_SITE_URL;
  }

  try {
    const parsed = new URL(raw);
    if (parsed.hostname === LEGACY_TYPO_DOMAIN || parsed.hostname === `www.${LEGACY_TYPO_DOMAIN}`) {
      parsed.hostname = `www.${ROOT_DOMAIN}`;
    }

    // Keep canonical host at www.kstyleshot.com for sitemap/Search Console consistency.
    if (parsed.hostname === ROOT_DOMAIN) {
      parsed.hostname = `www.${ROOT_DOMAIN}`;
    }

    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      process.env.NEXT_PUBLIC_APP_URL
  );
}

export function toAbsoluteUrl(path: string): string {
  return new URL(ensureLeadingSlash(path), getSiteUrl()).toString();
}

export function toAbsoluteAssetUrl(pathOrUrl: string): string {
  if (!pathOrUrl) {
    return toAbsoluteUrl("/");
  }

  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return toAbsoluteUrl(pathOrUrl);
  }
}

export function getOgLocale(locale: AppLocale): string {
  return locale === "ko" ? "ko_KR" : "en_US";
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
