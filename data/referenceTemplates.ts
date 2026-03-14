export type ReferenceTemplate = {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  templateImageUrl: string;  // nano-banana-pro second image input (public/templates/)
  sceneDescription: string;  // appended to base prompt for scene-specific context
};

export const referenceTemplates: ReferenceTemplate[] = [
  {
    id: "hanbok-gyeongbokgung-1",
    title: "경복궁 한복 1",
    subtitle: "관광객 분위기, 넓은 배경",
    thumbnailUrl: "/templates/background/hanbok1.jpeg",
    templateImageUrl: "/templates/background/hanbok1.jpeg",
    sceneDescription: "The scene is Gyeongbokgung palace with a wide background and tourist atmosphere. Natural outdoor lighting.",
  },
  {
    id: "hanbok-gyeongbokgung-2",
    title: "경복궁 한복 2",
    subtitle: "맑은 날, 자연광",
    thumbnailUrl: "/templates/background/hanbok2.jpeg",
    templateImageUrl: "/templates/background/hanbok2.jpeg",
    sceneDescription: "The scene is Gyeongbokgung palace on a clear sunny day with soft natural lighting and a clean background.",
  },
];
