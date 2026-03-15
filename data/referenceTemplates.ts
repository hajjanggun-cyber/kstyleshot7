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
    sceneDescription: "A refined Korean palace courtyard with elegant wooden hanok architecture and warm late-afternoon golden-hour sunlight. The background should remain recognizable as a heritage palace setting, but softly blurred behind a centered idol-style selfie. Warm amber light comes from the upper right and should create a flattering glow across the face, hair, and shoulders while preserving the polished traditional mood.",
    category: "hanbok",
  },
  {
    id: "hanbok-4",
    title: "한복 배경 2",
    subtitle: "전통 한복 배경",
    thumbnailUrl: "/templates/background/hanbok-4.jpeg",
    templateImageUrl: "/templates/background/hanbok-4.jpeg",
    sceneDescription: "A bright traditional Korean courtyard under a clear midday sky with clean stone paving and painted wooden pillars. The location should read clearly as a cultural heritage space, but sit softly behind a medium close-up idol selfie. Keep the light even and fresh with a neutral-cool daytime tone that flatters the skin and keeps the overall image crisp, calm, and elegant.",
    category: "hanbok",
  },

  // 무대
  {
    id: "stage-1",
    title: "아이돌 무대 1",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-1.jpeg",
    templateImageUrl: "/templates/background/stage-1.jpeg",
    sceneDescription: "A grand K-pop concert arena stage at night with cool white and blue spotlights, haze, and large-scale performance energy. The stage environment should still feel visible and exciting behind the subject, but softened into a premium bokeh backdrop for a medium close-up idol selfie. Let the cool concert lighting shape the face and hair with glamorous highlight contrast, as if the selfie is taken backstage or at the edge of the performance moment.",
    category: "stage",
  },
  {
    id: "stage-2",
    title: "아이돌 무대 2",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-2.jpeg",
    templateImageUrl: "/templates/background/stage-2.jpeg",
    sceneDescription: "A vibrant K-pop concert stage at night with a massive LED wall, colorful screen glow, and dramatic stage atmosphere. The LED display should remain recognizable behind the subject, but blurred enough to keep the selfie look natural and face-focused. Use the mixed colored light from the stage screen to create glamorous idol beauty lighting across the face, hair, and upper body.",
    category: "stage",
  },
  {
    id: "stage-3",
    title: "아이돌 무대 3",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-3.jpeg",
    templateImageUrl: "/templates/background/stage-3.jpeg",
    sceneDescription: "A prime-time K-pop performance stage at night with a strong white spotlight, dark surrounding space, and colored rim lights. Keep the performance background readable but softened, so the result feels like a high-end idol selfie taken in the middle of an active stage environment. The face should receive sharp, flattering stage light with polished contrast and subtle colored spill around the hairline.",
    category: "stage",
  },
  {
    id: "stage-4",
    title: "아이돌 무대 4",
    subtitle: "K-POP 공연 무대",
    thumbnailUrl: "/templates/background/stage-4.jpeg",
    templateImageUrl: "/templates/background/stage-4.jpeg",
    sceneDescription: "The peak moment of a major K-pop concert stage at night, filled with confetti, colored spotlights, and theatrical haze. The event atmosphere should remain visible in the background as a celebratory blur behind a centered idol selfie. Let the mixed concert colors add dynamic highlight and rim-light accents to the face, hair, and shoulders while preserving a refined beauty-commercial finish.",
    category: "stage",
  },

  // 스트릿
  {
    id: "street-1",
    title: "스트릿 1",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-1.jpeg",
    templateImageUrl: "/templates/background/street-1.jpeg",
    sceneDescription: "A trendy Seoul street fashion district on a bright afternoon with strong direct sunlight and stylish urban energy. The storefronts and pavement should remain recognizable as a lively Seoul fashion street, but softly blurred to support a natural idol-style selfie. Use the sunlight to create clean, flattering facial highlights and a crisp fashion-forward street mood.",
    category: "street",
  },
  {
    id: "street-2",
    title: "스트릿 2",
    subtitle: "한국 도심 스트릿",
    thumbnailUrl: "/templates/background/street-2.jpeg",
    templateImageUrl: "/templates/background/street-2.jpeg",
    sceneDescription: "A stylish Korean city street under a soft overcast sky with diffused light and calm contemporary mood. The street should be readable as an upscale urban Seoul environment, but gently softened behind the person for a realistic medium close-up selfie. Keep the light flattering, even, and cool-neutral so the skin and hair feel polished without harsh shadow.",
    category: "street",
  },
  {
    id: "street-3",
    title: "스트릿 3",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-3.jpeg",
    templateImageUrl: "/templates/background/street-3.jpeg",
    sceneDescription: "A vibrant Seoul entertainment street during golden hour with warm sunlight cutting between buildings and strong evening city energy. The street should remain recognizable, but blurred enough to let the selfie feel intimate and face-centered. Use the warm side light to create glowing idol beauty highlights on the face and hair, with gentle cooler shadow fill for depth.",
    category: "street",
  },
  {
    id: "street-4",
    title: "스트릿 4",
    subtitle: "K-POP 스트릿 패션",
    thumbnailUrl: "/templates/background/street-4.jpeg",
    templateImageUrl: "/templates/background/street-4.jpeg",
    sceneDescription: "A trendy Seoul fashion corridor in fresh morning light with colorful storefronts and clean city styling. The environment should still read as a fashionable urban district, but sit behind the subject as a soft, premium blur. Keep the morning light cool, bright, and flattering, with subtle reflected storefront color influencing the hair and upper-body styling.",
    category: "street",
  },

  // 공원
  {
    id: "park-1",
    title: "공원 피크닉 1",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-1.jpeg",
    templateImageUrl: "/templates/background/park-1.jpeg",
    sceneDescription: "A lush Korean park in spring with filtered sunlight, fresh greenery, and a calm outdoor lifestyle mood. The trees and park atmosphere should remain visible but softly blurred behind a centered idol-style selfie. Let the dappled spring light create gentle, natural highlights across the face, hair, and shoulders for a clean and romantic look.",
    category: "park",
  },
  {
    id: "park-2",
    title: "공원 피크닉 2",
    subtitle: "한국 공원 야외",
    thumbnailUrl: "/templates/background/park-2.jpeg",
    templateImageUrl: "/templates/background/park-2.jpeg",
    sceneDescription: "A bright Korean park on a sunny midday with vivid green grass, clear sky, and open outdoor freshness. The park should stay recognizable in the background while remaining softly out of focus, so the medium close-up selfie still feels natural and premium. Use the strong daylight to create healthy, luminous skin and subtle green bounce from the grass onto the lower face and neck.",
    category: "park",
  },

  // 서울
  {
    id: "namsan-1",
    title: "남산 서울타워",
    subtitle: "서울 남산 야경",
    thumbnailUrl: "/templates/background/namsan-1.jpeg",
    templateImageUrl: "/templates/background/namsan-1.jpeg",
    sceneDescription: "The Namsan N Seoul Tower observation area at golden hour with warm sunset light and the Seoul skyline beginning to glow below. The landmark setting should remain readable in the background, but softly blurred to support a beauty-commercial selfie. Let the sunset create a warm, flattering rim light on one side of the face and hair, balanced by gentle cool evening fill from the city atmosphere.",
    category: "seoul",
  },
  {
    id: "kdrama-1",
    title: "K드라마 로맨틱",
    subtitle: "로맨틱 K드라마 분위기",
    thumbnailUrl: "/templates/background/kdrama-1.jpeg",
    templateImageUrl: "/templates/background/kdrama-1.jpeg",
    sceneDescription: "A romantic outdoor K-drama-style location during blue-hour twilight with cinematic Seoul mood, warm window light, and cool evening sky tones. The setting should remain recognizable as a dreamy night location, but softly blurred behind a centered idol selfie. Blend the warm and cool light sources across the face and hair for a polished, emotional beauty-shot atmosphere.",
    category: "seoul",
  },
];
