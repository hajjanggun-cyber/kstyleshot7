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
      // /blog/en/[slug] → /en/hub/[slug]
      {
        source: "/blog/en/:slug",
        destination: "/en/hub/:slug",
        permanent: true,
      },
      // /blog/ko/[slug] → /ko/hub/[slug]
      {
        source: "/blog/ko/:slug",
        destination: "/ko/hub/:slug",
        permanent: true,
      },
      // /blog/en/category/[cat] → /en/hub
      {
        source: "/blog/en/category/:cat",
        destination: "/en/hub",
        permanent: true,
      },
      // /blog/ko/category/[cat] → /ko/hub
      {
        source: "/blog/ko/category/:cat",
        destination: "/ko/hub",
        permanent: true,
      },
      // /blog/en → /en/hub
      {
        source: "/blog/en",
        destination: "/en/hub",
        permanent: true,
      },
      // /blog/ko → /ko/hub
      {
        source: "/blog/ko",
        destination: "/ko/hub",
        permanent: true,
      },
      // /blog/rss.xml → /ko/hub (fallback)
      {
        source: "/blog/rss.xml",
        destination: "/ko/hub",
        permanent: true,
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
