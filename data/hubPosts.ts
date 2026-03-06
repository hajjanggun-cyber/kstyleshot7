export type CardType = "hero" | "square" | "tall" | "small" | "wide";
export type CategoryStyle = "pink" | "cyan" | "black-on-yellow" | "white-on-pink";

export type HubPost = {
  slug: string;
  cardType: CardType;
  category: string;
  categoryStyle: CategoryStyle;
  title: string;
  subtitle?: string;
  bg: string;           // CSS background (gradient or solid color)
  titleColor: string;   // CSS color value
  subtitleColor?: string;
  readers?: string;
  watermark?: string;
  watermarkIcon?: string;
  cta?: string;         // only hero
};

export const hubPosts: HubPost[] = [
  {
    slug: "seoul-nights",
    cardType: "hero",
    category: "Feature Story",
    categoryStyle: "white-on-pink",
    title: "Seoul\nNights",
    subtitle: "Inside the neon underworld of Gangnam",
    bg: "linear-gradient(135deg, #f4258c 0%, #7c3aed 50%, #00d2ff 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.9)",
    watermark: "SEOUL",
    cta: "Read Now",
  },
  {
    slug: "stage-skin",
    cardType: "square",
    category: "Idol Secret",
    categoryStyle: "cyan",
    title: "Stage\nSkin",
    subtitle: "The 10-step idol routine",
    bg: "rgba(0, 210, 255, 0.12)",
    titleColor: "#00d2ff",
    subtitleColor: "rgba(200,230,255,0.7)",
    watermark: "✦",
  },
  {
    slug: "cafe-hopping",
    cardType: "square",
    category: "Hidden Spot",
    categoryStyle: "black-on-yellow",
    title: "Cafe\nHopping",
    subtitle: "Yeonnam-dong secrets",
    bg: "#ffeb3b",
    titleColor: "#000000",
    subtitleColor: "rgba(0,0,0,0.55)",
    watermark: "카페",
  },
  {
    slug: "glass-skin-guide",
    cardType: "tall",
    category: "K-Beauty",
    categoryStyle: "white-on-pink",
    title: "Glass\nSkin\nGuide",
    bg: "linear-gradient(180deg, #1f0f17 0%, rgba(244,37,140,0.35) 100%)",
    titleColor: "#ffffff",
    readers: "12k fans reading",
  },
  {
    slug: "munja-do-art",
    cardType: "small",
    category: "Trending",
    categoryStyle: "pink",
    title: "Munja-Do Art",
    bg: "#1f0f17",
    titleColor: "#ffffff",
  },
  {
    slug: "retro-pop",
    cardType: "small",
    category: "Music",
    categoryStyle: "cyan",
    title: "Retro Pop",
    bg: "#00d2ff",
    titleColor: "#ffffff",
    watermarkIcon: "♪",
  },
  {
    slug: "gen-z-hallyu",
    cardType: "wide",
    category: "Weekly Digest",
    categoryStyle: "black-on-yellow",
    title: "Gen Z\nHallyu",
    bg: "linear-gradient(to right, #ffeb3b, #f4258c)",
    titleColor: "#000000",
    subtitleColor: "#000000",
  },
];

export const FILTER_CHIPS = [
  "For You",
  "K-Beauty",
  "Hidden Spots",
  "Idol Secret",
  "Music",
  "Trending",
];
