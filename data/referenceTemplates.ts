export type ReferenceTemplate = {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  templateImageUrl: string;  // face-swap target 이미지 (public/templates/)
  prompt: string;
  negativePrompt: string;
};

export const referenceTemplates: ReferenceTemplate[] = [
  {
    id: "hanbok-gyeongbokgung-1",
    title: "경복궁 한복 1",
    subtitle: "관광객 분위기, 넓은 배경",
    thumbnailUrl: "/templates/hanbok/hanbok1.jpeg",
    templateImageUrl: "/templates/hanbok/hanbok1.jpeg",
    prompt:
      "Keep the person's face and hairstyle exactly as-is. Apply the selected K-POP hairstyle naturally. The subject is wearing a traditional Korean Hanbok at Gyeongbokgung Palace in Seoul. Photorealistic, natural lighting, kpop idol photoshoot quality.",
    negativePrompt:
      "different face, changed hairstyle, distorted face, deformed eyes, bad anatomy, anime, cartoon, illustration, oversaturated, plastic skin",
  },
  {
    id: "hanbok-gyeongbokgung-2",
    title: "경복궁 한복 2",
    subtitle: "맑은 날, 자연광",
    thumbnailUrl: "/templates/hanbok/hanbok2.jpeg",
    templateImageUrl: "/templates/hanbok/hanbok2.jpeg",
    prompt:
      "Keep the person's face and hairstyle exactly as-is. Apply the selected K-POP hairstyle naturally. The subject is wearing a traditional Korean fusion Hanbok at Gyeongbokgung Palace in Seoul on a sunny day. Photorealistic, soft natural lighting, kpop idol photoshoot quality.",
    negativePrompt:
      "different face, changed hairstyle, distorted face, deformed eyes, bad anatomy, anime, cartoon, illustration, oversaturated, plastic skin",
  },
];
