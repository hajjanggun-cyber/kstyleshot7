import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const adsenseExcludedHubSlugs = [
  "beginner-mens-skincare-routine-guide",
  "best-blush-placement-by-face-shape",
  "best-brown-hair-colors-without-bleach",
  "best-hair-essence-for-bleached-hair",
  "best-layered-hair-length-for-easy-styling",
  "best-lip-colors-for-cool-tones",
  "best-lip-colors-for-warm-tones",
  "best-primer-for-large-pores",
  "bukchon-vs-seochon-walking-guide",
  "cafe-hopping",
  "clean-spring-daily-outfit-ideas",
  "crop-knit-and-mini-skirt-outfit-guide",
  "eye-makeup-tips",
  "fairycore-outfit-guide",
  "fall-knit-outfit-and-color-guide",
  "garosu-gil-evening-walk-guide",
  "garosu-gil-shopping-walk-guide",
  "gentle-skincare-routine-guide",
  "gen-z-hallyu",
  "girl-crush-style-outfit-guide",
  "glass-skin-guide",
  "gyeongbokgung-nearby-hanok-photo-spots",
  "hair-color-ideas-by-skin-tone",
  "hair-colors-that-brighten-your-face",
  "han-river-night-photo-spots",
  "hongdae-vs-seongsu-street-fashion",
  "how-to-add-root-volume-at-home",
  "how-to-ask-for-a-hairstyle-in-korea",
  "how-to-choose-the-right-sunscreen",
  "how-to-do-gradient-lips",
  "how-to-keep-bangs-in-place-all-day",
  "how-to-maintain-ash-brown-hair",
  "how-to-make-lash-curl-last-longer",
  "humid-weather-hair-care-guide",
  "ikseon-dong-hanok-alley-photo-guide",
  "insadong-photo-spots",
  "insadong-tea-house-walking-guide",
  "itaewon-gyeongnidan-walk-guide",
  "k-fashion-style-types",
  "k-fashion-wardrobe-essentials",
  "korean-haircut-ideas",
  "k-style-layered-necklace-guide",
  "lip-makeup-guide",
  "makeup-tips-for-acne-prone-skin",
  "makeup-tips-for-better-photos",
  "monolid-eye-makeup-guide",
  "munja-do-art",
  "myeongdong-hongdae-street-food-guide",
  "myeongdong-k-beauty-shopping-map",
  "myeongdong-neon-street-guide",
  "naksan-park-night-view-guide",
  "namsan-cable-car-photo-tips",
  "natural-aegyo-sal-makeup-guide",
  "olive-young-skincare-shopping-guide",
  "oversized-blazer-outfit-guide",
  "personal-color-hair-dye-guide",
  "retro-pop",
  "see-through-bangs-vs-curtain-bangs",
  "seochon-date-route-photo-spots",
  "seongsu-street-fashion-outfit-tips",
  "seoul-nights",
  "seoul-photo-spot-recommendations",
  "smudge-proof-eyeliner-guide",
  "stage-skin",
  "summer-festival-outfit-guide",
  "techwear-style-outfit-guide",
  "travel-k-beauty-pouch-guide",
  "virtual-gyeongbokgung-background-guide",
  "who-looks-best-with-a-hush-cut",
  "wide-leg-pants-k-style-outfit-ideas",
  "winter-layering-outfit-rules",
  "y2k-k-fashion-outfit-guide",
];

function adsenseExcludedHubRedirects() {
  return ["en", "ko"].flatMap((locale) =>
    adsenseExcludedHubSlugs.map((slug) => ({
      source: `/${locale}/hub/${slug}`,
      destination: `/${locale}/hub`,
      statusCode: 308,
    }))
  );
}

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
      ...adsenseExcludedHubRedirects(),
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
      { source: "/blog/en/:slug(insadong-.+)",       destination: "/en/hub",                    statusCode: 301 },
      { source: "/blog/en/:slug(hongdae-.+)",        destination: "/en/hub/hongdae-hub",        statusCode: 301 },
      { source: "/blog/en/:slug(myeongdong-.+)",     destination: "/en/hub",                    statusCode: 301 },
      { source: "/blog/en/:slug(garosu-gil-.+)",     destination: "/en/hub",                    statusCode: 301 },
      { source: "/blog/en/:slug(hangang-park-.+)",   destination: "/en/hub/han-river-park-hub", statusCode: 301 },
      { source: "/blog/en/:slug(n-seoul-tower-.+)",  destination: "/en/hub",                    statusCode: 301 },
      { source: "/blog/en/:slug(itaewon-gyeongnidan-.+)", destination: "/en/hub/itaewon-gyeongnidan-walk-guide", statusCode: 301 },
      { source: "/blog/en/:slug(jamsil-lotte-world-.+)",  destination: "/en/hub/seokchon-lake-photo-spot-guide", statusCode: 301 },
      { source: "/blog/en/:slug(kpop-label-hq-.+)",  destination: "/en/hub/seongsu-hub",        statusCode: 301 },
      { source: "/blog/en/:slug(bukchon-.+)",        destination: "/en/hub/bukchon-hanok-village-hub", statusCode: 301 },
      { source: "/blog/en/:slug(seongsu-.+)",        destination: "/en/hub/seongsu-hub",        statusCode: 301 },
      // EN: topic-specific slug → closest hub article
      { source: "/blog/en/:slug(winter-color-.+)",   destination: "/en/hub/winter-glow-makeup-guide",         statusCode: 301 },
      { source: "/blog/en/:slug(best-summer-selfie.+|clean-summer-.+)", destination: "/en/hub/long-lasting-summer-makeup-guide", statusCode: 301 },
      { source: "/blog/en/:slug((?:reduce-shine|best-low-effort-base|make-thin-hair|hair-volume|k-style-curtain-bangs|center-part|k-style-hair|simple-brow|best-wispy-bang|how-to-match-hair|how-soft-layers).+)", destination: "/en/hub/k-beauty-base-makeup-tips", statusCode: 301 },
      { source: "/blog/en/:slug((?:use-window-light|avoid-flat-lighting|best-distance|why-eye-level|best-upper-body|best-front-camera|best-front-selfie|riverfront-backdrops|best-night-city|best-spring-background).+)", destination: "/en/hub/seoul-photo-spot-guide", statusCode: 301 },
      { source: "/blog/en/:slug((?:tone-on-tone|clean-neutral-outfit|why-knit-layers|why-hongdae-and-seongsu).+)", destination: "/en/hub/hongdae-vs-seongsu-street-fashion", statusCode: 301 },

      // ── KO: location-specific slug → matching hub article ──────────────
      { source: "/blog/ko/:slug(gyeongbokgung-.+)", destination: "/ko/hub/gyeongbokgung-hub", statusCode: 301 },
      { source: "/blog/ko/:slug(insadong-.+)",       destination: "/ko/hub",                    statusCode: 301 },
      { source: "/blog/ko/:slug(hongdae-.+)",        destination: "/ko/hub/hongdae-hub",        statusCode: 301 },
      { source: "/blog/ko/:slug(myeongdong-.+)",     destination: "/ko/hub",                    statusCode: 301 },
      { source: "/blog/ko/:slug(garosu-gil-.+)",     destination: "/ko/hub",                    statusCode: 301 },
      { source: "/blog/ko/:slug(hangang-park-.+)",   destination: "/ko/hub/han-river-park-hub", statusCode: 301 },
      { source: "/blog/ko/:slug(n-seoul-tower-.+)",  destination: "/ko/hub",                    statusCode: 301 },
      { source: "/blog/ko/:slug(itaewon-gyeongnidan-.+)", destination: "/ko/hub/itaewon-gyeongnidan-walk-guide", statusCode: 301 },
      { source: "/blog/ko/:slug(jamsil-lotte-world-.+)",  destination: "/ko/hub/seokchon-lake-photo-spot-guide", statusCode: 301 },
      { source: "/blog/ko/:slug(kpop-label-hq-.+)",  destination: "/ko/hub/seongsu-hub",        statusCode: 301 },
      { source: "/blog/ko/:slug(bukchon-.+)",        destination: "/ko/hub/bukchon-hanok-village-hub", statusCode: 301 },
      { source: "/blog/ko/:slug(seongsu-.+)",        destination: "/ko/hub/seongsu-hub",        statusCode: 301 },
      // KO: topic-specific slug → closest hub article
      { source: "/blog/ko/:slug(winter-color-.+)",   destination: "/ko/hub/winter-glow-makeup-guide",          statusCode: 301 },
      { source: "/blog/ko/:slug(clean-summer-.+)",   destination: "/ko/hub/long-lasting-summer-makeup-guide",  statusCode: 301 },
      { source: "/blog/ko/:slug((?:what-to-remove|why-light-base|make-thin-hair|make-hush-cut|add-volume-to-flat|k-style-bangs|easiest-way-to-keep-glow|choose-hair-based).+)", destination: "/ko/hub/k-beauty-base-makeup-tips", statusCode: 301 },
      { source: "/blog/ko/:slug((?:window-light|why-camera-distance|chin-angle|selfie-framing|best-front-selfie|best-necklines|first-fix|why-one-good-selfie).+)", destination: "/ko/hub/seoul-photo-spot-guide", statusCode: 301 },
      { source: "/blog/ko/:slug((?:most-reliable-layering|why-knit-layering|why-fall-layering|spring-k-style|easiest-way-to-shift|keep-hair-volume).+)", destination: "/ko/hub/hongdae-vs-seongsu-street-fashion", statusCode: 301 },

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
      // /blog/[slug] (no locale) → /ko/hub (catch-all — must come LAST of all)
      {
        source: "/blog/:slug*",
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
