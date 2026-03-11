export type HairColor = {
  id: string;
  nameKo: string;
  nameEn: string;
  swatch: string;
  replicateValue: string;
};

export const hairColors: HairColor[] = [
  {
    id: "natural-black",
    nameKo: "자연블랙",
    nameEn: "Natural Black",
    swatch: "#1a1a1a",
    replicateValue: "Black",
  },
  {
    id: "dark-brown",
    nameKo: "다크브라운",
    nameEn: "Dark Brown",
    swatch: "#3b1f0d",
    replicateValue: "Dark Brown",
  },
  {
    id: "light-brown",
    nameKo: "라이트브라운",
    nameEn: "Light Brown",
    swatch: "#9c6b3c",
    replicateValue: "Light Brown",
  },
  {
    id: "ash-brown",
    nameKo: "애쉬브라운",
    nameEn: "Ash Brown",
    swatch: "#8b7355",
    replicateValue: "Ash Brown",
  },
  {
    id: "highlight",
    nameKo: "하이라이트",
    nameEn: "Highlight",
    swatch: "linear-gradient(135deg, #3b1f0d 50%, #d4a96a 50%)",
    replicateValue: "Golden Blonde",
  },
  {
    id: "ombre",
    nameKo: "옴브레 투톤",
    nameEn: "Ombre",
    swatch: "linear-gradient(180deg, #1a1a1a 0%, #9c6b3c 100%)",
    replicateValue: "Caramel",
  },
];
