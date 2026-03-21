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
      // ── EN: location-specific slug → matching hub article ──────────────
      { source: "/blog/en/:slug(gyeongbokgung-.+)", destination: "/en/hub/gyeongbokgung-hub", statusCode: 301 },
      { source: "/blog/en/:slug(insadong-.+)",       destination: "/en/hub/insadong-hub",       statusCode: 301 },
      { source: "/blog/en/:slug(hongdae-.+)",        destination: "/en/hub/hongdae-hub",        statusCode: 301 },
      { source: "/blog/en/:slug(myeongdong-.+)",     destination: "/en/hub/myeongdong-hub",     statusCode: 301 },
      { source: "/blog/en/:slug(garosu-gil-.+)",     destination: "/en/hub/garosu-gil-hub",     statusCode: 301 },
      { source: "/blog/en/:slug(hangang-park-.+)",   destination: "/en/hub/han-river-park-hub", statusCode: 301 },
      { source: "/blog/en/:slug(n-seoul-tower-.+)",  destination: "/en/hub/n-seoul-tower-hub",  statusCode: 301 },
      { source: "/blog/en/:slug(itaewon-gyeongnidan-.+)", destination: "/en/hub/itaewon-gyeongnidan-walk-guide", statusCode: 301 },
      { source: "/blog/en/:slug(jamsil-lotte-world-.+)",  destination: "/en/hub/seokchon-lake-photo-spot-guide", statusCode: 301 },
      { source: "/blog/en/:slug(kpop-label-hq-.+)",  destination: "/en/hub/seongsu-hub",        statusCode: 301 },
      { source: "/blog/en/:slug(bukchon-.+)",        destination: "/en/hub/bukchon-hanok-village-hub", statusCode: 301 },
      { source: "/blog/en/:slug(seongsu-.+)",        destination: "/en/hub/seongsu-hub",        statusCode: 301 },
      // EN: topic-specific slug → closest hub article
      { source: "/blog/en/:slug(winter-color-.+)",   destination: "/en/hub/winter-glow-makeup-guide",         statusCode: 301 },
      { source: "/blog/en/:slug(best-summer-selfie.+|clean-summer-.+)", destination: "/en/hub/long-lasting-summer-makeup-guide", statusCode: 301 },
      { source: "/blog/en/:slug((reduce-shine|best-low-effort-base|make-thin-hair|hair-volume|k-style-curtain-bangs|center-part|k-style-hair|simple-brow|best-wispy-bang|how-to-match-hair|how-soft-layers).+)", destination: "/en/hub/k-beauty-base-makeup-tips", statusCode: 301 },
      { source: "/blog/en/:slug((use-window-light|avoid-flat-lighting|best-distance|why-eye-level|best-upper-body|best-front-camera|best-front-selfie|riverfront-backdrops|best-night-city|best-spring-background).+)", destination: "/en/hub/seoul-photo-spot-guide", statusCode: 301 },
      { source: "/blog/en/:slug((tone-on-tone|clean-neutral-outfit|why-knit-layers|why-hongdae-and-seongsu).+)", destination: "/en/hub/hongdae-vs-seongsu-street-fashion", statusCode: 301 },

      // ── KO: location-specific slug → matching hub article ──────────────
      { source: "/blog/ko/:slug(gyeongbokgung-.+)", destination: "/ko/hub/gyeongbokgung-hub", statusCode: 301 },
      { source: "/blog/ko/:slug(insadong-.+)",       destination: "/ko/hub/insadong-hub",       statusCode: 301 },
      { source: "/blog/ko/:slug(hongdae-.+)",        destination: "/ko/hub/hongdae-hub",        statusCode: 301 },
      { source: "/blog/ko/:slug(myeongdong-.+)",     destination: "/ko/hub/myeongdong-hub",     statusCode: 301 },
      { source: "/blog/ko/:slug(garosu-gil-.+)",     destination: "/ko/hub/garosu-gil-hub",     statusCode: 301 },
      { source: "/blog/ko/:slug(hangang-park-.+)",   destination: "/ko/hub/han-river-park-hub", statusCode: 301 },
      { source: "/blog/ko/:slug(n-seoul-tower-.+)",  destination: "/ko/hub/n-seoul-tower-hub",  statusCode: 301 },
      { source: "/blog/ko/:slug(itaewon-gyeongnidan-.+)", destination: "/ko/hub/itaewon-gyeongnidan-walk-guide", statusCode: 301 },
      { source: "/blog/ko/:slug(jamsil-lotte-world-.+)",  destination: "/ko/hub/seokchon-lake-photo-spot-guide", statusCode: 301 },
      { source: "/blog/ko/:slug(kpop-label-hq-.+)",  destination: "/ko/hub/seongsu-hub",        statusCode: 301 },
      { source: "/blog/ko/:slug(bukchon-.+)",        destination: "/ko/hub/bukchon-hanok-village-hub", statusCode: 301 },
      { source: "/blog/ko/:slug(seongsu-.+)",        destination: "/ko/hub/seongsu-hub",        statusCode: 301 },
      // KO: topic-specific slug → closest hub article
      { source: "/blog/ko/:slug(winter-color-.+)",   destination: "/ko/hub/winter-glow-makeup-guide",          statusCode: 301 },
      { source: "/blog/ko/:slug(clean-summer-.+)",   destination: "/ko/hub/long-lasting-summer-makeup-guide",  statusCode: 301 },
      { source: "/blog/ko/:slug((what-to-remove|why-light-base|make-thin-hair|make-hush-cut|add-volume-to-flat|k-style-bangs|easiest-way-to-keep-glow|choose-hair-based).+)", destination: "/ko/hub/k-beauty-base-makeup-tips", statusCode: 301 },
      { source: "/blog/ko/:slug((window-light|why-camera-distance|chin-angle|selfie-framing|best-front-selfie|best-necklines|first-fix|why-one-good-selfie).+)", destination: "/ko/hub/seoul-photo-spot-guide", statusCode: 301 },
      { source: "/blog/ko/:slug((most-reliable-layering|why-knit-layering|why-fall-layering|spring-k-style|easiest-way-to-shift|keep-hair-volume).+)", destination: "/ko/hub/hongdae-vs-seongsu-street-fashion", statusCode: 301 },

      // /blog/en/[slug] → /en/hub (catch-all — must come LAST)
      {
        source: "/blog/en/:slug*",
        destination: "/en/hub",
        statusCode: 301,
      },
      // /blog/ko/[slug] → /ko/hub (catch-all — must come LAST)
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
