import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["sharp", "@mediapipe/tasks-vision"],
  experimental: {
    outputFileTracingExcludes: {
      "**": [
        "./public/images/hub/**",
        "./public/wasm/**",
        "./node_modules/@img/sharp-libvips-linuxmusl-x64/**",
        "./node_modules/@img/sharp-libvips-linux-x64/**",
      ],
    },
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
