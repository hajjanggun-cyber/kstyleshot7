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
    slug: "gyeongbokgung-hub",
    cardType: "hero",
    category: "한국 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "경복궁\n여행 가이드",
    subtitle: "서울이 스스로를 기억하는 궁궐",
    bg: "linear-gradient(135deg, #10243f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "경복궁",
    cta: "읽기",
  },
  {
    slug: "myeongdong-hub",
    cardType: "hero",
    category: "한국 명소 & 포토존",
    categoryStyle: "black-on-yellow",
    title: "명동\n핫플 가이드",
    subtitle: "서울 상업 리듬이 가장 빠르게 읽히는 거리",
    bg: "linear-gradient(135deg, #4a0f13 0%, #f2a65a 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.75)",
    watermark: "명동",
    cta: "읽기",
  },
  {
    slug: "n-seoul-tower-hub",
    cardType: "hero",
    category: "한국 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "남산 N서울타워\n서울 야경 가이드",
    subtitle: "서울의 밤을 가장 선명하게 읽는 전망 포인트",
    bg: "linear-gradient(135deg, #0f1c3f 0%, #ff6b35 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "남산",
    cta: "읽기",
  },
  {
    slug: "gyeongbokgung-photo-guide",
    cardType: "square",
    category: "한국 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "경복궁\n포토존 추천",
    subtitle: "전통 미학의 사진 명소 총정리",
    bg: "linear-gradient(135deg, #10243f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.7)",
    watermark: "📷",
  },
  {
    slug: "gyeongbokgung-light-timing-guide",
    cardType: "square",
    category: "한국 명소 & 포토존",
    categoryStyle: "cyan",
    title: "경복궁\n오전 오후 사진",
    subtitle: "시간대별 빛과 그림자 가이드",
    bg: "linear-gradient(135deg, #17304f 0%, #d4a24c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.7)",
    watermark: "🌤",
  },
  {
    slug: "gyeongbokgung-nearby-hanok-photo-spots",
    cardType: "tall",
    category: "한국 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "경복궁 근처\n한옥\n포토존",
    bg: "linear-gradient(135deg, #3b2a1d 0%, #b88452 100%)",
    titleColor: "#ffffff",
    readers: "숨겨진 골목 산책 5곳",
  },
  {
    slug: "virtual-gyeongbokgung-background-guide",
    cardType: "small",
    category: "가상 스타일 체험",
    categoryStyle: "pink",
    title: "경복궁 배경\n프로필 사진",
    bg: "linear-gradient(135deg, #28182f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    watermarkIcon: "✦",
  },
  {
    slug: "myeongdong-neon-street-guide",
    cardType: "small",
    category: "한국 명소 & 포토존",
    categoryStyle: "pink",
    title: "명동 네온사인\n야간 사진",
    bg: "linear-gradient(135deg, #3b0b17 0%, #ff7a18 100%)",
    titleColor: "#ffffff",
    watermarkIcon: "✦",
  },
  {
    slug: "n-seoul-tower-night-view-guide",
    cardType: "square",
    category: "한국 명소 & 포토존",
    categoryStyle: "cyan",
    title: "남산 N서울타워\n야경 명소",
    subtitle: "시야 포인트와 시간대 가이드",
    bg: "linear-gradient(135deg, #102049 0%, #ff7a3d 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.75)",
    watermark: "🌃",
  },
];

export const hubPostsEn: HubPost[] = [
  {
    slug: "gyeongbokgung-hub",
    cardType: "hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Gyeongbokgung\nPalace Guide",
    subtitle: "Why it matters more than any other palace",
    bg: "linear-gradient(135deg, #10243f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "SEOUL",
    cta: "Read Now",
  },
  {
    slug: "myeongdong-hub",
    cardType: "hero",
    category: "Seoul Locations",
    categoryStyle: "black-on-yellow",
    title: "Myeongdong\nComplete Guide",
    subtitle: "Where Seoul's commercial rhythm becomes visible",
    bg: "linear-gradient(135deg, #4a0f13 0%, #f2a65a 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.75)",
    watermark: "明洞",
    cta: "Read Now",
  },
  {
    slug: "n-seoul-tower-hub",
    cardType: "hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "N Seoul Tower\nNight View Guide",
    subtitle: "Where Seoul's skyline becomes easiest to read",
    bg: "linear-gradient(135deg, #0f1c3f 0%, #ff6b35 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "NAMSAN",
    cta: "Read Now",
  },
  {
    slug: "gyeongbokgung-photo-guide",
    cardType: "square",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Best Photo\nSpots",
    subtitle: "Gyeongbokgung visual guide",
    bg: "linear-gradient(135deg, #10243f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.7)",
    watermark: "📷",
  },
  {
    slug: "gyeongbokgung-light-timing-guide",
    cardType: "square",
    category: "Seoul Locations",
    categoryStyle: "cyan",
    title: "Morning vs\nAfternoon",
    subtitle: "Light & shadow timing guide",
    bg: "linear-gradient(135deg, #17304f 0%, #d4a24c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.7)",
    watermark: "🌤",
  },
  {
    slug: "gyeongbokgung-nearby-hanok-photo-spots",
    cardType: "tall",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Hanok\nAlley\nSpots",
    bg: "linear-gradient(135deg, #3b2a1d 0%, #b88452 100%)",
    titleColor: "#ffffff",
    readers: "5 hidden walks near the palace",
  },
  {
    slug: "virtual-gyeongbokgung-background-guide",
    cardType: "small",
    category: "Virtual Style",
    categoryStyle: "pink",
    title: "Virtual\nPalace\nBackground",
    bg: "linear-gradient(135deg, #28182f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    watermarkIcon: "✦",
  },
  {
    slug: "myeongdong-neon-street-guide",
    cardType: "small",
    category: "Seoul Locations",
    categoryStyle: "pink",
    title: "Neon Street\nPhoto Guide",
    bg: "linear-gradient(135deg, #3b0b17 0%, #ff7a18 100%)",
    titleColor: "#ffffff",
    watermarkIcon: "✦",
  },
  {
    slug: "n-seoul-tower-night-view-guide",
    cardType: "square",
    category: "Seoul Locations",
    categoryStyle: "cyan",
    title: "Night View\nSpots",
    subtitle: "N Seoul Tower practical guide",
    bg: "linear-gradient(135deg, #102049 0%, #ff7a3d 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.75)",
    watermark: "🌃",
  },
];

export const FILTER_CHIPS_KO = [
  "전체",
  "한국 명소 & 포토존",
  "가상 스타일 체험",
  "K-뷰티 & 헤어",
  "K-스타일 패션",
];

export const FILTER_CHIPS_EN = [
  "All",
  "Seoul Locations",
  "Virtual Style",
  "K-Beauty",
  "K-Fashion",
];

/** @deprecated use FILTER_CHIPS_KO / FILTER_CHIPS_EN */
export const FILTER_CHIPS = FILTER_CHIPS_KO;
