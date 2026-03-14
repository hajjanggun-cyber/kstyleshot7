export type CardType = "hero" | "half-hero" | "square" | "tall" | "small" | "wide";
export type CategoryStyle = "pink" | "cyan" | "black-on-yellow" | "white-on-pink";

export type HubPost = {
  slug: string;
  cardType: CardType;
  disabled?: boolean;
  category: string;
  categoryStyle: CategoryStyle;
  title: string;
  subtitle?: string;
  bg: string;
  titleColor: string;
  subtitleColor?: string;
  readers?: string;
  watermark?: string;
  watermarkIcon?: string;
  cta?: string;
};

export const hubPosts: HubPost[] = [
  {
    slug: "gyeongbokgung-hub",
    cardType: "hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "경복궁\n가이드",
    subtitle: "서울의 대표 궁궐을 가장 기본부터 읽는 방법",
    bg: "linear-gradient(135deg, #10243f 0%, #c08b3c 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "경복궁",
    cta: "읽기",
  },
  {
    slug: "myeongdong-hub",
    cardType: "half-hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "black-on-yellow",
    title: "명동\n가이드",
    subtitle: "서울 상업 중심가를 빠르고 정확하게 읽는 동선",
    bg: "linear-gradient(135deg, #4a0f13 0%, #f2a65a 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.75)",
    watermark: "명동",
    cta: "읽기",
  },
  {
    slug: "n-seoul-tower-hub",
    cardType: "half-hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "남산 N서울타워\n가이드",
    subtitle: "서울 야경과 남산 동선을 함께 보는 기본 허브",
    bg: "linear-gradient(135deg, #0f1c3f 0%, #ff6b35 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "남산",
    cta: "읽기",
  },
  {
    slug: "insadong-hub",
    cardType: "half-hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "인사동\n전통거리 가이드",
    subtitle: "전통 서울을 걸으며 읽는 가장 기본적인 거리",
    bg: "linear-gradient(135deg, #4a2f1b 0%, #c58a48 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "인사동",
    cta: "읽기",
  },
  {
    slug: "garosu-gil-hub",
    cardType: "half-hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "가로수길\n카페 가이드",
    subtitle: "카페, 쇼핑, 저녁 산책이 자연스럽게 이어지는 거리",
    bg: "linear-gradient(135deg, #355c3a 0%, #d8a35d 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "가로수길",
    cta: "읽기",
  },
  {
    slug: "han-river-park-hub",
    cardType: "hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "한강공원\n놀거리 가이드",
    subtitle: "피크닉, 야경, 데이트 코스를 한 번에 읽는 서울 강변",
    bg: "linear-gradient(135deg, #183b63 0%, #74b9d6 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "한강공원",
    cta: "읽기",
  },
  {
    slug: "seongsu-hub",
    cardType: "hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "성수동\n가이드",
    subtitle: "팝업, 카페, 골목 산책이 이어지는 서울 트렌드 거리",
    bg: "linear-gradient(135deg, #2f2b38 0%, #d07a45 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.82)",
    watermark: "성수동",
    cta: "읽기",
  },
  {
    slug: "bukchon-hanok-village-hub",
    cardType: "half-hero",
    category: "서울 명소 & 포토존",
    categoryStyle: "white-on-pink",
    title: "북촌 한옥마을\n가이드",
    subtitle: "사진, 한복, 산책 코스를 함께 읽는 서울 전통 동네",
    bg: "linear-gradient(135deg, #2f3547 0%, #c08b63 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.82)",
    watermark: "북촌",
    cta: "읽기",
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
    watermark: "GYEONGBOKGUNG",
    cta: "Read Now",
  },
  {
    slug: "myeongdong-hub",
    cardType: "half-hero",
    category: "Seoul Locations",
    categoryStyle: "black-on-yellow",
    title: "Myeongdong\nComplete Guide",
    subtitle: "Where Seoul's commercial rhythm becomes visible",
    bg: "linear-gradient(135deg, #4a0f13 0%, #f2a65a 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.75)",
    watermark: "MYEONGDONG",
    cta: "Read Now",
  },
  {
    slug: "n-seoul-tower-hub",
    cardType: "half-hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "N Seoul Tower\nGuide",
    subtitle: "Where Seoul's skyline becomes easiest to read",
    bg: "linear-gradient(135deg, #0f1c3f 0%, #ff6b35 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "NAMSAN",
    cta: "Read Now",
  },
  {
    slug: "insadong-hub",
    cardType: "half-hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Insadong\nCultural Street",
    subtitle: "Where traditional Seoul reads at walking speed",
    bg: "linear-gradient(135deg, #4a2f1b 0%, #c58a48 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "INSADONG",
    cta: "Read Now",
  },
  {
    slug: "garosu-gil-hub",
    cardType: "half-hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Garosu-gil\nCafe Guide",
    subtitle: "Cafes, select shops, and an easy evening walk",
    bg: "linear-gradient(135deg, #355c3a 0%, #d8a35d 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "GAROSU-GIL",
    cta: "Read Now",
  },
  {
    slug: "han-river-park-hub",
    cardType: "hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Han River Park\nGuide",
    subtitle: "Picnic setups, night views, and date routes by the river",
    bg: "linear-gradient(135deg, #183b63 0%, #74b9d6 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.8)",
    watermark: "HAN RIVER",
    cta: "Read Now",
  },
  {
    slug: "seongsu-hub",
    cardType: "hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Seongsu-dong\nGuide",
    subtitle: "Pop-ups, cafes, and slower alley walks in one trend-heavy district",
    bg: "linear-gradient(135deg, #2f2b38 0%, #d07a45 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.82)",
    watermark: "SEONGSU",
    cta: "Read Now",
  },
  {
    slug: "bukchon-hanok-village-hub",
    cardType: "half-hero",
    category: "Seoul Locations",
    categoryStyle: "white-on-pink",
    title: "Bukchon Hanok\nVillage Guide",
    subtitle: "Photos, hanbok walks, and a quieter traditional Seoul route",
    bg: "linear-gradient(135deg, #2f3547 0%, #c08b63 100%)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.82)",
    watermark: "BUKCHON",
    cta: "Read Now",
  },
];

export const FILTER_CHIPS_KO = [
  "전체",
  "서울 명소 & 포토존",
  "가상 스타일 체험",
  "K-뷰티 & 헤어",
  "K-스타일 & 패션",
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
