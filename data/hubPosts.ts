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
    slug: "myeongdong-hub",
    cardType: "wide",
    category: "한국 명소 & 포토존",
    categoryStyle: "black-on-yellow",
    title: "명동\n핫플 가이드",
    bg: "linear-gradient(135deg, #4a0f13 0%, #f2a65a 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
  },
];

export const FILTER_CHIPS = [
  "전체",
  "한국 명소 & 포토존",
  "가상 스타일 체험",
  "K-뷰티 & 헤어",
  "K-스타일 패션",
];
