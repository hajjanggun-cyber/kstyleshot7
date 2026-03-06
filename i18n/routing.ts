export const routing = {
  locales: ["en", "ko"],
  defaultLocale: "ko",
  localeDetection: false,
} as const;

export type AppLocale = (typeof routing.locales)[number];

