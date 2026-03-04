export const routing = {
  locales: ["en", "ko"],
  defaultLocale: "en"
} as const;

export type AppLocale = (typeof routing.locales)[number];

