export type BackgroundCategory = "hanbok" | "stage" | "street" | "park" | "seoul";

export type ReferenceTemplate = {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  templateImageUrl: string;
  sceneDescription: string;
  category: BackgroundCategory;
};

export const referenceTemplates: ReferenceTemplate[] = [
  // 한복
  {
    id: "hanbok-3",
    title: "한복 배경 1",
    subtitle: "전통 한복 배경",
    thumbnailUrl: "/templates/background/hanbok-3.jpeg",
    templateImageUrl: "/templates/background/hanbok-3.jpeg",
    sceneDescription: "The scene features a traditional Korean hanbok setting with authentic cultural atmosphere.",
    category: "hanbok",
  },
  {
    id: "hanbok-4",
    title: "한복 배경 2",
    subtitle: "전통 한복 배경",
    thumbnailUrl: "/templates/background/hanbok-4.jpeg",
    templateImageUrl: "/templates/background/hanbok-4.jpeg",
    sceneDescription: "The scene features a traditional Korean hanbok setting with soft natural lighting.",
    category: "hanbok",
  },

  // 무대
  {
    id: "stage-1",
    title: "아이돌 무대 1",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-1.jpeg",
    templateImageUrl: "/templates/background/stage-1.jpeg",
    sceneDescription: "The scene is a K-pop idol performance stage with dramatic lighting and concert atmosphere.",
    category: "stage",
  },
  {
    id: "stage-2",
    title: "아이돌 무대 2",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-2.jpeg",
    templateImageUrl: "/templates/background/stage-2.jpeg",
    sceneDescription: "The scene is a K-pop concert stage with vibrant stage lighting.",
    category: "stage",
  },
  {
    id: "stage-3",
    title: "아이돌 무대 3",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-3.jpeg",
    templateImageUrl: "/templates/background/stage-3.jpeg",
    sceneDescription: "The scene is a K-pop idol stage performance setting with professional lighting.",
    category: "stage",
  },
  {
    id: "stage-4",
    title: "아이돌 무대 4",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-4.jpeg",
    templateImageUrl: "/templates/background/stage-4.jpeg",
    sceneDescription: "The scene is a grand K-pop concert stage with colorful lighting effects.",
    category: "stage",
  },

  // 스트릿
  {
    id: "street-1",
    title: "스트릿 1",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-1.jpeg",
    templateImageUrl: "/templates/background/street-1.jpeg",
    sceneDescription: "The scene is a Korean urban street with a fashionable street style atmosphere.",
    category: "street",
  },
  {
    id: "street-2",
    title: "스트릿 2",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-2.jpeg",
    templateImageUrl: "/templates/background/street-2.jpeg",
    sceneDescription: "The scene is a trendy Korean street fashion district with natural daylight.",
    category: "street",
  },
  {
    id: "street-3",
    title: "스트릿 3",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-3.jpeg",
    templateImageUrl: "/templates/background/street-3.jpeg",
    sceneDescription: "The scene is a K-pop girl group street fashion setting in an urban environment.",
    category: "street",
  },
  {
    id: "street-4",
    title: "스트릿 4",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-4.jpeg",
    templateImageUrl: "/templates/background/street-4.jpeg",
    sceneDescription: "The scene is a stylish K-pop street fashion location with urban backdrop.",
    category: "street",
  },

  // 공원
  {
    id: "park-1",
    title: "공원 피크닉 1",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-1.jpeg",
    templateImageUrl: "/templates/background/park-1.jpeg",
    sceneDescription: "The scene is a Korean style park picnic setting with lush greenery and soft natural light.",
    category: "park",
  },
  {
    id: "park-2",
    title: "공원 피크닉 2",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-2.jpeg",
    templateImageUrl: "/templates/background/park-2.jpeg",
    sceneDescription: "The scene is a casual Korean park picnic atmosphere with bright outdoor lighting.",
    category: "park",
  },

  // 서울
  {
    id: "namsan-1",
    title: "남산 서울타워",
    subtitle: "서울 남산 야경",
    thumbnailUrl: "/templates/background/namsan-1.jpeg",
    templateImageUrl: "/templates/background/namsan-1.jpeg",
    sceneDescription: "The scene is Namsan N Seoul Tower area with a beautiful Seoul cityscape backdrop.",
    category: "seoul",
  },
  {
    id: "kdrama-1",
    title: "K드라마 로맨틱",
    subtitle: "로맨틱 K드라마 분위기",
    thumbnailUrl: "/templates/background/kdrama-1.jpeg",
    templateImageUrl: "/templates/background/kdrama-1.jpeg",
    sceneDescription: "The scene has a romantic and feminine K-drama lead character style with elegant surroundings.",
    category: "seoul",
  },
];
