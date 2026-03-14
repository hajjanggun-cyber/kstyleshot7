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
    sceneDescription: "The scene is a traditional Korean palace courtyard with stone-paved ground and wooden hanok architecture, under warm late-afternoon golden-hour sunlight. The light source comes from the upper right at approximately 45 degrees, casting long diagonal shadows across the stone tiles. Color temperature is warm amber (approx. 4000K). The architecture shows fine wood grain and painted details — match subject sharpness to this texture level.",
    category: "hanbok",
  },
  {
    id: "hanbok-4",
    title: "한복 배경 2",
    subtitle: "전통 한복 배경",
    thumbnailUrl: "/templates/background/hanbok-4.jpeg",
    templateImageUrl: "/templates/background/hanbok-4.jpeg",
    sceneDescription: "The scene is a traditional Korean cultural courtyard at bright midday under a clear blue sky. Light is soft and even with neutral-to-cool color temperature (approx. 5500K), coming from directly overhead with minimal shadow directionality. Stone ground and painted wooden pillars show crisp detail — match subject sharpness to this level of architectural clarity.",
    category: "hanbok",
  },

  // 무대
  {
    id: "stage-1",
    title: "아이돌 무대 1",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-1.jpeg",
    templateImageUrl: "/templates/background/stage-1.jpeg",
    sceneDescription: "The scene is a grand K-pop concert arena stage at night. Multiple high-powered spotlights in white and cool blue hit the stage floor from above, while laser beams cut through thick atmospheric haze. The dominant light source is directly above and slightly frontal. Color temperature is mixed cool-white (6000K) with colored accent lights. The stage floor shows gloss reflection — ground the subject's shoes firmly onto this reflective surface.",
    category: "stage",
  },
  {
    id: "stage-2",
    title: "아이돌 무대 2",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-2.jpeg",
    templateImageUrl: "/templates/background/stage-2.jpeg",
    sceneDescription: "The scene is a vibrant K-pop concert stage at night with a massive full-wall LED display backdrop emitting dynamic colored light. Stage fog rolls low across the floor. Primary lighting is frontal from the LED wall with warm-to-cool mixed color temperature. The fog layer on the floor interacts with the subject's feet — ensure contact shadows appear on top of the fog layer, not beneath it.",
    category: "stage",
  },
  {
    id: "stage-3",
    title: "아이돌 무대 3",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-3.jpeg",
    templateImageUrl: "/templates/background/stage-3.jpeg",
    sceneDescription: "The scene is a prime-time K-pop idol performance stage at night. A crisp white key spotlight hits from directly above and slightly front, creating clean hard shadows. Accent colored spots add rim lighting from the sides. The dark stage background provides strong contrast — the subject must be lit identically to the existing performer in the reference, with matching shadow hardness and color spill.",
    category: "stage",
  },
  {
    id: "stage-4",
    title: "아이돌 무대 4",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-4.jpeg",
    templateImageUrl: "/templates/background/stage-4.jpeg",
    sceneDescription: "The scene is the peak moment of a major K-pop event on a grand concert stage at night — multi-colored spotlights, theatrical fog, and confetti fill the air. Multiple light sources hit from different angles creating complex color mixing on the stage floor. Wrap all colors from this environment onto the subject's outfit and skin. Ground the subject on the confetti-covered stage floor with realistic contact shadows.",
    category: "stage",
  },

  // 스트릿
  {
    id: "street-1",
    title: "스트릿 1",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-1.jpeg",
    templateImageUrl: "/templates/background/street-1.jpeg",
    sceneDescription: "The scene is a trendy Seoul street fashion district on a bright afternoon with direct sunlight from above-right (approx. 2–3pm sun angle). Hard shadows fall to the left on the pavement. Color temperature is daylight neutral (approx. 5600K). The pavement shows clear texture — place precise contact shadows under the subject's shoes matching the same shadow angle and hardness as surrounding pedestrians.",
    category: "street",
  },
  {
    id: "street-2",
    title: "스트릿 2",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-2.jpeg",
    templateImageUrl: "/templates/background/street-2.jpeg",
    sceneDescription: "The scene is a stylish Korean urban street under a slightly overcast early-afternoon sky. The overcast cloud layer acts as a giant softbox — light is diffused and shadow-free with cool-neutral color temperature (approx. 6200K). Building facades and pavement are rendered with high clarity — match the subject's sharpness and texture detail to this environment.",
    category: "street",
  },
  {
    id: "street-3",
    title: "스트릿 3",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-3.jpeg",
    templateImageUrl: "/templates/background/street-3.jpeg",
    sceneDescription: "The scene is a vibrant K-pop entertainment street district during late afternoon golden hour (approx. 5–6pm). Warm amber sunlight (approx. 3200K) streams horizontally between buildings from the right side, casting long diagonal shadows to the left across the pavement. Apply strong warm-side rim lighting and cool shadow fill to the subject to match this side-lit golden-hour condition.",
    category: "street",
  },
  {
    id: "street-4",
    title: "스트릿 4",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-4.jpeg",
    templateImageUrl: "/templates/background/street-4.jpeg",
    sceneDescription: "The scene is a trendy Seoul fashion corridor in fresh morning light (approx. 9–10am). Cool, slightly blue-toned natural light (approx. 6500K) fills the street evenly from above-left with soft, short shadows. The colorful storefronts create colored light bounce onto adjacent surfaces — apply corresponding subtle color spill onto the subject's outfit from nearby storefront colors.",
    category: "street",
  },

  // 공원
  {
    id: "park-1",
    title: "공원 피크닉 1",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-1.jpeg",
    templateImageUrl: "/templates/background/park-1.jpeg",
    sceneDescription: "The scene is a lush Korean park on a clear spring afternoon with dappled sunlight filtering through a green tree canopy. The light is soft and intermittent (approx. 5000K), with gentle leaf-shadow patterns projected onto the grass ground. Apply matching dappled light patterns onto the subject's shoulders and outfit. Contact shadows on the grass must be soft-edged, matching the diffused quality of the filtered light.",
    category: "park",
  },
  {
    id: "park-2",
    title: "공원 피크닉 2",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-2.jpeg",
    templateImageUrl: "/templates/background/park-2.jpeg",
    sceneDescription: "The scene is a bright Korean outdoor park on a sunny midday with a clear blue sky. Sunlight is direct and strong from directly overhead (approx. 5800K), creating short, hard shadows directly beneath objects. The vivid green grass reflects ambient green-tinted bounce light upward — apply subtle green-tinted fill light onto the underside of the subject's outfit and chin area to match this natural bounce.",
    category: "park",
  },

  // 서울
  {
    id: "namsan-1",
    title: "남산 서울타워",
    subtitle: "서울 남산 야경",
    thumbnailUrl: "/templates/background/namsan-1.jpeg",
    templateImageUrl: "/templates/background/namsan-1.jpeg",
    sceneDescription: "The scene is the Namsan N Seoul Tower observation deck area at golden hour sunset. The sun is low on the horizon to the right, casting long warm amber-rose light (approx. 2800–3200K) across the observation platform. The Seoul cityscape glitters below with early evening city lights beginning to appear. Apply strong warm right-side rim lighting and cool blue shadow fill on the left side of the subject to match this directional sunset lighting.",
    category: "seoul",
  },
  {
    id: "kdrama-1",
    title: "K드라마 로맨틱",
    subtitle: "로맨틱 K드라마 분위기",
    thumbnailUrl: "/templates/background/kdrama-1.jpeg",
    templateImageUrl: "/templates/background/kdrama-1.jpeg",
    sceneDescription: "The scene is a romantic outdoor K-drama filming location during blue-hour twilight. The sky is deep indigo-to-violet (approx. 8000–10000K ambient), while warm tungsten light (approx. 2700K) spills from nearby windows and lanterns creating a complementary warm-cool contrast. Apply warm light spill from the right (window source) and cool blue ambient fill from the open sky above. The subject must appear caught between these two light temperatures for a cinematic, dreamy effect.",
    category: "seoul",
  },
];
