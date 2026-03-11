export type ReferenceTemplate = {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  prompt: string;
  negativePrompt: string;
};

export const referenceTemplates: ReferenceTemplate[] = [
  {
    id: "hanbok-gyeongbokgung-1",
    title: "경복궁 한복 1",
    subtitle: "테스트 레퍼런스 1",
    thumbnailUrl: "/reference-templates/1-hanbok-1.jpeg",
    prompt:
      "Create a photorealistic close-up selfie portrait while keeping the face, ethnicity, hairstyle, hair color, bangs, and overall identity exactly the same as the base image. Maintain the same person and preserve facial structure, eyes, nose, lips, skin texture, skin undertone, and hair silhouette. Frame the image tightly from the chest up like a natural smartphone selfie. The subject should feel stylish, modern, and polished with a Seoul fashion editorial mood and idol-inspired styling, without changing the person's original ethnicity or natural facial characteristics. She is holding a trendy smartphone in one hand, and the decorative phone case and rear camera lenses are clearly visible to the viewer. Change the clothing to a chic and elegant traditional Korean Hanbok jeogori for a young idol, with refined fabric detail and delicate floral embroidery around the collar. Change the background to the courtyard of Gyeongbokgung Palace in Seoul during warm golden hour light. Add softly blurred tourists and visitors walking in the background. Keep the image realistic, premium, and natural like a real high-end selfie snapshot.",
    negativePrompt:
      "different face, different hairstyle, different hair color, short hair, missing bangs, distorted face, deformed eyes, bad anatomy, extra fingers, bad hands, duplicate person, malformed clothing, blurry face, low detail, unrealistic phone, broken phone case, anime, cartoon, illustration, painting, oversaturated, plastic skin, airbrushed skin, wax figure",
  },
  {
    id: "hanbok-gyeongbokgung-2",
    title: "경복궁 한복 2",
    subtitle: "테스트 레퍼런스 2",
    thumbnailUrl: "/reference-templates/1-hanbok-2.jpeg",
    prompt:
      "Create a photorealistic close-up selfie portrait while keeping the face, ethnicity, hairstyle, hair color, bangs, and overall identity exactly the same as the base image. Maintain the same person and preserve facial structure, eyes, nose, lips, skin texture, skin undertone, and hair silhouette. Frame the image tightly from the chest up like a natural smartphone selfie. The subject should feel stylish, modern, and polished with a Seoul fashion editorial mood and idol-inspired styling, without changing the person's original ethnicity or natural facial characteristics. She is holding a trendy smartphone in one hand, and the decorative phone case and rear camera lenses are clearly visible to the viewer. Change the clothing to a chic and elegant traditional Korean Hanbok jeogori for a young idol, with refined fabric detail and delicate floral embroidery around the collar. Change the background to the courtyard of Gyeongbokgung Palace in Seoul during warm golden hour light. Add softly blurred tourists and visitors walking in the background. Keep the image realistic, premium, and natural like a real high-end selfie snapshot.",
    negativePrompt:
      "different face, different hairstyle, different hair color, short hair, missing bangs, distorted face, deformed eyes, bad anatomy, extra fingers, bad hands, duplicate person, malformed clothing, blurry face, low detail, unrealistic phone, broken phone case, anime, cartoon, illustration, painting, oversaturated, plastic skin, airbrushed skin, wax figure",
  },
];
