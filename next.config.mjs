import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["sharp", "@mediapipe/tasks-vision"],
  outputFileTracingExcludes: {
    "/[lang]/hub/[slug]": [
      "public/images/**",
      "public/wasm/**",
      "node_modules/@img/**",
    ],
    "/[lang]/hub": [
      "public/images/**",
      "node_modules/@img/**",
    ],
  },
  async redirects() {
    return [
      // /hub/[slug] (no locale) → /ko/hub/[slug]
      {
        source: "/hub/:slug*",
        destination: "/ko/hub/:slug*",
        statusCode: 301,
      },
      // NOTE: More specific rules MUST come before general slug rules
      // /blog/en → /en/hub (exact match first)
      {
        source: "/blog/en",
        destination: "/en/hub",
        statusCode: 301,
      },
      // /blog/ko → /ko/hub (exact match first)
      {
        source: "/blog/ko",
        destination: "/ko/hub",
        statusCode: 301,
      },
      // /blog/rss.xml → /en/hub
      {
        source: "/blog/rss.xml",
        destination: "/en/hub",
        statusCode: 301,
      },
      // /blog/en/category/[cat] → /en/hub (category before slug!)
      {
        source: "/blog/en/category/:cat",
        destination: "/en/hub",
        statusCode: 301,
      },
      // /blog/ko/category/[cat] → /ko/hub (category before slug!)
      {
        source: "/blog/ko/category/:cat",
        destination: "/ko/hub",
        statusCode: 301,
      },
      // /blog/en/[slug] → /en/hub (general slug rule — must come LAST)
      {
        source: "/blog/en/:slug*",
        destination: "/en/hub",
        statusCode: 301,
      },
      // /blog/ko/[slug] → /ko/hub (general slug rule — must come LAST)
      {
        source: "/blog/ko/:slug*",
        destination: "/ko/hub",
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/image/:hubSlug/:file",
        destination: "/images/hub/:hubSlug/:file"
      }
    ];
  }
};

export default withNextIntl(nextConfig);
