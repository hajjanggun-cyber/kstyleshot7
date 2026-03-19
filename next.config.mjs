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
