export type OutfitCategory = "stage" | "hanbok" | "korean" | "street";

export type OutfitTemplate = {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  imageUrl: string;
  category: OutfitCategory;
};

export const outfitTemplates: OutfitTemplate[] = [
  // K-POP 무대
  {
    id: "stage-idol-1",
    title: "아이돌 무대 1",
    subtitle: "K-POP 아이돌 코스튬",
    thumbnailUrl: "/templates/outfit/stage-idol-1.jpeg",
    imageUrl: "/templates/outfit/stage-idol-1.jpeg",
    category: "stage",
  },
  {
    id: "stage-idol-2",
    title: "아이돌 무대 2",
    subtitle: "K-POP 아이돌 패션",
    thumbnailUrl: "/templates/outfit/stage-idol-2.jpeg",
    imageUrl: "/templates/outfit/stage-idol-2.jpeg",
    category: "stage",
  },
  {
    id: "stage-idol-3",
    title: "아이돌 무대 3",
    subtitle: "K-POP 무대 패션",
    thumbnailUrl: "/templates/outfit/stage-idol-3.jpeg",
    imageUrl: "/templates/outfit/stage-idol-3.jpeg",
    category: "stage",
  },
  {
    id: "stage-glitter-1",
    title: "글리터 드레스",
    subtitle: "반짝이는 콘서트 무대 드레스",
    thumbnailUrl: "/templates/outfit/stage-glitter-1.jpeg",
    imageUrl: "/templates/outfit/stage-glitter-1.jpeg",
    category: "stage",
  },
  {
    id: "stage-girlgroup-1",
    title: "걸그룹 무대",
    subtitle: "걸그룹 스테이지 드레스",
    thumbnailUrl: "/templates/outfit/stage-girlgroup-1.jpeg",
    imageUrl: "/templates/outfit/stage-girlgroup-1.jpeg",
    category: "stage",
  },
  {
    id: "stage-flatlay-1",
    title: "K-POP 무대 의상",
    subtitle: "아이돌 무대 플랫레이",
    thumbnailUrl: "/templates/outfit/stage-flatlay-1.jpeg",
    imageUrl: "/templates/outfit/stage-flatlay-1.jpeg",
    category: "stage",
  },

  // 한복 퓨전
  {
    id: "hanbok-fusion-1",
    title: "모던 한복 1",
    subtitle: "퓨전 한복 스타일",
    thumbnailUrl: "/templates/outfit/hanbok-fusion-1.jpeg",
    imageUrl: "/templates/outfit/hanbok-fusion-1.jpeg",
    category: "hanbok",
  },
  {
    id: "hanbok-fusion-2",
    title: "모던 한복 2",
    subtitle: "퓨전 한복 스타일",
    thumbnailUrl: "/templates/outfit/hanbok-fusion-2.jpeg",
    imageUrl: "/templates/outfit/hanbok-fusion-2.jpeg",
    category: "hanbok",
  },
  {
    id: "hanbok-fusion-3",
    title: "모던 한복 세트",
    subtitle: "현대적 한복 코디",
    thumbnailUrl: "/templates/outfit/hanbok-fusion-3.jpeg",
    imageUrl: "/templates/outfit/hanbok-fusion-3.jpeg",
    category: "hanbok",
  },
  {
    id: "hanbok-pastel-1",
    title: "파스텔 한복",
    subtitle: "라벤더 파스텔 퓨전 한복",
    thumbnailUrl: "/templates/outfit/hanbok-pastel-1.jpeg",
    imageUrl: "/templates/outfit/hanbok-pastel-1.jpeg",
    category: "hanbok",
  },

  // 한국 캐주얼
  {
    id: "korean-picnic-1",
    title: "한강 피크닉",
    subtitle: "한강 피크닉 캐주얼 세트",
    thumbnailUrl: "/templates/outfit/korean-picnic-1.jpeg",
    imageUrl: "/templates/outfit/korean-picnic-1.jpeg",
    category: "korean",
  },
  {
    id: "korean-knit-1",
    title: "니트 스웨터",
    subtitle: "한국 라이트 니트 코디",
    thumbnailUrl: "/templates/outfit/korean-knit-1.jpeg",
    imageUrl: "/templates/outfit/korean-knit-1.jpeg",
    category: "korean",
  },
  {
    id: "korean-date-1",
    title: "로맨틱 데이트",
    subtitle: "블라우스 & 미니 스커트",
    thumbnailUrl: "/templates/outfit/korean-date-1.jpeg",
    imageUrl: "/templates/outfit/korean-date-1.jpeg",
    category: "korean",
  },

  // 스트릿/캐주얼
  {
    id: "denim-plaid-1",
    title: "데님 체크 1",
    subtitle: "데님 재킷 & 체크 스커트",
    thumbnailUrl: "/templates/outfit/denim-plaid-1.jpeg",
    imageUrl: "/templates/outfit/denim-plaid-1.jpeg",
    category: "street",
  },
  {
    id: "denim-plaid-2",
    title: "데님 체크 2",
    subtitle: "데님 재킷 & 체크 스커트",
    thumbnailUrl: "/templates/outfit/denim-plaid-2.jpeg",
    imageUrl: "/templates/outfit/denim-plaid-2.jpeg",
    category: "street",
  },
  {
    id: "denim-plaid-3",
    title: "데님 체크 3",
    subtitle: "데님 재킷 & 체크 스커트",
    thumbnailUrl: "/templates/outfit/denim-plaid-3.jpeg",
    imageUrl: "/templates/outfit/denim-plaid-3.jpeg",
    category: "street",
  },
  {
    id: "leather-plaid-1",
    title: "레더 체크",
    subtitle: "레더 재킷 & 체크 스커트",
    thumbnailUrl: "/templates/outfit/leather-plaid-1.jpeg",
    imageUrl: "/templates/outfit/leather-plaid-1.jpeg",
    category: "street",
  },
  {
    id: "leather-full-1",
    title: "레더 풀 룩",
    subtitle: "레더 전신 아웃핏",
    thumbnailUrl: "/templates/outfit/leather-full-1.jpeg",
    imageUrl: "/templates/outfit/leather-full-1.jpeg",
    category: "street",
  },
  {
    id: "cardigan-skirt-1",
    title: "카디건 스커트",
    subtitle: "카디건 & 스커트 코디",
    thumbnailUrl: "/templates/outfit/cardigan-skirt-1.jpeg",
    imageUrl: "/templates/outfit/cardigan-skirt-1.jpeg",
    category: "street",
  },
  {
    id: "tennis-sweater-1",
    title: "테니스 스웨터",
    subtitle: "크롭 스웨터 & 테니스 스커트",
    thumbnailUrl: "/templates/outfit/tennis-sweater-1.jpeg",
    imageUrl: "/templates/outfit/tennis-sweater-1.jpeg",
    category: "street",
  },
  {
    id: "floral-mini-1",
    title: "플로럴 미니",
    subtitle: "플로럴 블라우스 & 미니 스커트",
    thumbnailUrl: "/templates/outfit/floral-mini-1.jpeg",
    imageUrl: "/templates/outfit/floral-mini-1.jpeg",
    category: "street",
  },
  {
    id: "hoodie-cargo-1",
    title: "후디 카고",
    subtitle: "오버핏 후디 & 카고 팬츠",
    thumbnailUrl: "/templates/outfit/hoodie-cargo-1.jpeg",
    imageUrl: "/templates/outfit/hoodie-cargo-1.jpeg",
    category: "street",
  },
  {
    id: "sweatshirt-denim-1",
    title: "스웨트셔츠 데님",
    subtitle: "오버핏 스웨트셔츠 & 데님 쇼츠",
    thumbnailUrl: "/templates/outfit/sweatshirt-denim-1.jpeg",
    imageUrl: "/templates/outfit/sweatshirt-denim-1.jpeg",
    category: "street",
  },
  {
    id: "pastel-pleated-1",
    title: "파스텔 플리츠 1",
    subtitle: "파스텔 스웨터 & 플리츠 스커트",
    thumbnailUrl: "/templates/outfit/pastel-pleated-1.jpeg",
    imageUrl: "/templates/outfit/pastel-pleated-1.jpeg",
    category: "street",
  },
  {
    id: "pastel-pleated-2",
    title: "파스텔 플리츠 2",
    subtitle: "파스텔 스웨터 & 플리츠 스커트",
    thumbnailUrl: "/templates/outfit/pastel-pleated-2.jpeg",
    imageUrl: "/templates/outfit/pastel-pleated-2.jpeg",
    category: "street",
  },
  {
    id: "pink-dress-1",
    title: "핑크 드레스",
    subtitle: "핑크 A라인 미니 드레스",
    thumbnailUrl: "/templates/outfit/pink-dress-1.jpeg",
    imageUrl: "/templates/outfit/pink-dress-1.jpeg",
    category: "street",
  },
  {
    id: "trainee-1",
    title: "트레이니 룩",
    subtitle: "아이돌 트레이니 아웃핏",
    thumbnailUrl: "/templates/outfit/trainee-1.jpeg",
    imageUrl: "/templates/outfit/trainee-1.jpeg",
    category: "street",
  },
];
