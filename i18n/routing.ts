export const routing = {
  locales: ["en", "ko"],
  defaultLocale: "ko"
} as const;

export type AppLocale = (typeof routing.locales)[number];

