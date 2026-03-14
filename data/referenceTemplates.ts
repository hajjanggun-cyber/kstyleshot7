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
    sceneDescription: "The subject is standing at a traditional Korean palace gate area in the late afternoon. Warm golden-hour sunlight casts long, soft shadows across stone-paved ground. The air feels calm and ceremonial, with a rich amber glow wrapping around stone walls and wooden eaves.",
    category: "hanbok",
  },
  {
    id: "hanbok-4",
    title: "한복 배경 2",
    subtitle: "전통 한복 배경",
    thumbnailUrl: "/templates/background/hanbok-4.jpeg",
    templateImageUrl: "/templates/background/hanbok-4.jpeg",
    sceneDescription: "The subject is standing in a traditional Korean cultural courtyard at bright midday. Soft, even daylight diffuses from a clear blue sky overhead, illuminating vivid hanbok colors with no harsh shadows. The atmosphere is clean, crisp, and timeless.",
    category: "hanbok",
  },

  // 무대
  {
    id: "stage-1",
    title: "아이돌 무대 1",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-1.jpeg",
    templateImageUrl: "/templates/background/stage-1.jpeg",
    sceneDescription: "The subject is standing on a grand K-pop concert arena stage at night. Dramatic neon spotlights and laser beams cut through thick atmospheric haze, creating bold rings of colored light. The air is electric and charged with the energy of a packed stadium crowd.",
    category: "stage",
  },
  {
    id: "stage-2",
    title: "아이돌 무대 2",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-2.jpeg",
    templateImageUrl: "/templates/background/stage-2.jpeg",
    sceneDescription: "The subject is performing on a vibrant K-pop concert stage at night, surrounded by a massive LED backdrop pulsing with colorful light. Stage fog rolls across the floor and dynamic colored beams create a high-energy, cinematic atmosphere.",
    category: "stage",
  },
  {
    id: "stage-3",
    title: "아이돌 무대 3",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-3.jpeg",
    templateImageUrl: "/templates/background/stage-3.jpeg",
    sceneDescription: "The subject stands center-stage during a prime-time evening K-pop performance. Crisp white key lights combined with accent color spots illuminate the figure sharply against a dark, dramatic background. The mood is polished and professional.",
    category: "stage",
  },
  {
    id: "stage-4",
    title: "아이돌 무대 4",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-4.jpeg",
    templateImageUrl: "/templates/background/stage-4.jpeg",
    sceneDescription: "The subject is at the center of a spectacular grand concert stage at night, with multi-colored lighting effects, theatrical fog, and confetti. The atmosphere is euphoric and larger-than-life, as if captured during the peak moment of a major K-pop event.",
    category: "stage",
  },

  // 스트릿
  {
    id: "street-1",
    title: "스트릿 1",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-1.jpeg",
    templateImageUrl: "/templates/background/street-1.jpeg",
    sceneDescription: "The subject is standing on a trendy Seoul street in a fashionable district during bright afternoon daylight. Clear natural sunlight reflects off glass storefronts, creating a fresh, modern urban atmosphere with a lively street energy.",
    category: "street",
  },
  {
    id: "street-2",
    title: "스트릿 2",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-2.jpeg",
    templateImageUrl: "/templates/background/street-2.jpeg",
    sceneDescription: "The subject is posed on a stylish Korean urban street in the early afternoon, surrounded by boutique shops and modern architecture. The light is soft and even with a slight overcast sky, giving a cool, clean editorial feel.",
    category: "street",
  },
  {
    id: "street-3",
    title: "스트릿 3",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-3.jpeg",
    templateImageUrl: "/templates/background/street-3.jpeg",
    sceneDescription: "The subject is standing in a vibrant K-pop entertainment street district during late afternoon golden hour. Warm amber sunlight streams between buildings, casting a cinematic glow on the sidewalk and creating long, dramatic shadows.",
    category: "street",
  },
  {
    id: "street-4",
    title: "스트릿 4",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-4.jpeg",
    templateImageUrl: "/templates/background/street-4.jpeg",
    sceneDescription: "The subject is at a trendy Seoul fashion corridor in the fresh morning light. Cool, slightly blue-toned natural light fills the street, with colorful storefronts and a calm urban energy that feels effortlessly chic.",
    category: "street",
  },

  // 공원
  {
    id: "park-1",
    title: "공원 피크닉 1",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-1.jpeg",
    templateImageUrl: "/templates/background/park-1.jpeg",
    sceneDescription: "The subject is in a lush Korean park on a clear spring afternoon. Soft, dappled sunlight filters through the canopy of green trees, casting gentle leaf-shadow patterns on the grass. A light breeze and fresh air create a bright, relaxed outdoor atmosphere.",
    category: "park",
  },
  {
    id: "park-2",
    title: "공원 피크닉 2",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-2.jpeg",
    templateImageUrl: "/templates/background/park-2.jpeg",
    sceneDescription: "The subject is standing in a bright and cheerful Korean outdoor park on a sunny midday. Vivid green grass stretches across the foreground under a clear blue sky, with strong natural sunlight creating a vibrant, energetic casual atmosphere.",
    category: "park",
  },

  // 서울
  {
    id: "namsan-1",
    title: "남산 서울타워",
    subtitle: "서울 남산 야경",
    thumbnailUrl: "/templates/background/namsan-1.jpeg",
    templateImageUrl: "/templates/background/namsan-1.jpeg",
    sceneDescription: "The subject is at the Namsan N Seoul Tower observation area during golden hour at sunset. Warm amber and rose-toned light washes over the iconic tower and the sprawling Seoul skyline behind it. The evening air is clear and crisp, with the city beginning to light up below.",
    category: "seoul",
  },
  {
    id: "kdrama-1",
    title: "K드라마 로맨틱",
    subtitle: "로맨틱 K드라마 분위기",
    thumbnailUrl: "/templates/background/kdrama-1.jpeg",
    templateImageUrl: "/templates/background/kdrama-1.jpeg",
    sceneDescription: "The subject is in a romantic, elegant outdoor setting reminiscent of a K-drama filming location during blue-hour twilight. The sky transitions from deep indigo to soft violet, while warm interior lighting glows from nearby windows, creating a dreamy, cinematic atmosphere.",
    category: "seoul",
  },
];
