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
  {
    id: "gyeongbokgung-hanbok-stone-courtyard",
    title: "경복궁 한복 마당",
    subtitle: "전통 궁궐 한복 셀피",
    thumbnailUrl: "/templates/background/gyeongbokgung-hanbok-stone-courtyard.jpeg",
    templateImageUrl: "/templates/background/gyeongbokgung-hanbok-stone-courtyard.jpeg",
    sceneDescription:
      "A traditional Korean palace stone courtyard at golden hour with elegant hanok rooflines, soft warm sunlight, and a refined heritage atmosphere. The subject should feel naturally grounded inside the courtyard with realistic light direction, warm reflections, and authentic architectural depth.",
    category: "hanbok",
  },
  {
    id: "gyeongbokgung-palace-main-gate-selfie",
    title: "경복궁 정문 셀피",
    subtitle: "궁궐 정면 배경 셀피",
    thumbnailUrl: "/templates/background/gyeongbokgung-palace-main-gate-selfie.jpeg",
    templateImageUrl: "/templates/background/gyeongbokgung-palace-main-gate-selfie.jpeg",
    sceneDescription:
      "A centered palace gate scene at Gyeongbokgung with broad stone paving, layered traditional roof details, and warm late-afternoon light. Keep the palace facade recognizable behind the subject and match the natural courtyard perspective, shadows, and soft golden atmosphere.",
    category: "hanbok",
  },
  {
    id: "kpop-concert-stage-selfie",
    title: "K-pop 콘서트 무대",
    subtitle: "공연장 셀피 무드",
    thumbnailUrl: "/templates/background/kpop-concert-stage-selfie.jpeg",
    templateImageUrl: "/templates/background/kpop-concert-stage-selfie.jpeg",
    sceneDescription:
      "A large K-pop concert stage filled with blue and white spotlights, LED screens, and glossy performance lighting. The subject should look physically present on stage with realistic concert light spill, stage reflections, and dramatic live-show depth.",
    category: "stage",
  },
  {
    id: "garosu-gil-shopping-street-selfie",
    title: "가로수길 쇼핑 거리",
    subtitle: "트렌디 스트리트 셀피",
    thumbnailUrl: "/templates/background/garosu-gil-shopping-street-selfie.jpeg",
    templateImageUrl: "/templates/background/garosu-gil-shopping-street-selfie.jpeg",
    sceneDescription:
      "A stylish Seoul shopping street lined with boutique storefronts, signs, and casual pedestrian flow in bright daytime light. Match the soft urban daylight, storefront reflections, and relaxed fashion-street perspective so the subject feels naturally photographed on location.",
    category: "street",
  },
  {
    id: "hongdae-neon-street-selfie",
    title: "홍대 네온 거리",
    subtitle: "도심 야간 스트리트 셀피",
    thumbnailUrl: "/templates/background/hongdae-neon-street-selfie.jpeg",
    templateImageUrl: "/templates/background/hongdae-neon-street-selfie.jpeg",
    sceneDescription:
      "A lively Hongdae-style entertainment street at dusk with neon shop signs, dense city energy, and warm evening street light. Integrate the subject naturally into the road-level scene with believable sign glow, ambient shadows, and urban nightlife perspective.",
    category: "street",
  },
  {
    id: "han-river-picnic-skyline-selfie",
    title: "한강 피크닉 스카이라인",
    subtitle: "한강 공원 피크닉 셀피",
    thumbnailUrl: "/templates/background/han-river-picnic-skyline-selfie.jpeg",
    templateImageUrl: "/templates/background/han-river-picnic-skyline-selfie.jpeg",
    sceneDescription:
      "A sunny Han River park picnic setting with green grass, a picnic mat, and the Seoul skyline across the water. The subject should sit naturally in the riverside environment with bright daylight, gentle water reflection, and realistic outdoor shadow falloff.",
    category: "park",
  },
  {
    id: "n-seoul-tower-closeup-love-lock-wall",
    title: "N서울타워 자물쇠 벽",
    subtitle: "타워 데크 클로즈업 셀피",
    thumbnailUrl: "/templates/background/n-seoul-tower-closeup-love-lock-wall.jpeg",
    templateImageUrl: "/templates/background/n-seoul-tower-closeup-love-lock-wall.jpeg",
    sceneDescription:
      "An N Seoul Tower observation deck selfie spot with colorful love locks, soft sunset light, and the tower visible in the distance. Keep the deck atmosphere recognizable and blend the subject with warm evening light, subtle crowd depth, and realistic terrace reflections.",
    category: "seoul",
  },
  {
    id: "n-seoul-tower-evening-observation-deck",
    title: "N서울타워 전망 데크",
    subtitle: "저녁 전망대 셀피",
    thumbnailUrl: "/templates/background/n-seoul-tower-evening-observation-deck.jpeg",
    templateImageUrl: "/templates/background/n-seoul-tower-evening-observation-deck.jpeg",
    sceneDescription:
      "An evening observation deck at N Seoul Tower with love-lock fencing, warm sunset sky, and a crowded landmark atmosphere. The subject should feel naturally captured in the terrace scene with realistic backlighting, city haze, and soft golden-hour skin illumination.",
    category: "seoul",
  },
  {
    id: "n-seoul-tower-sunset-lock-terrace",
    title: "N서울타워 노을 테라스",
    subtitle: "서울 야경 노을 셀피",
    thumbnailUrl: "/templates/background/n-seoul-tower-sunset-lock-terrace.jpeg",
    templateImageUrl: "/templates/background/n-seoul-tower-sunset-lock-terrace.jpeg",
    sceneDescription:
      "A sunset terrace at N Seoul Tower overlooking the Seoul skyline with lock-covered railings and a glowing evening sky. Match the warm sunset direction, skyline depth, and terrace shadows so the subject appears truly photographed at the scenic overlook.",
    category: "seoul",
  },
];
