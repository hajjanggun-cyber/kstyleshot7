import type { HairStyle, HairCategory } from "@/types";

export const HAIR_CATEGORIES: {
  key: HairCategory;
  labelKo: string;
  labelEn: string;
}[] = [
  { key: "daily",       labelKo: "청순 & 데일리",    labelEn: "Daily" },
  { key: "performance", labelKo: "퍼포먼스 & 파워",  labelEn: "Performance" },
  { key: "trendy",      labelKo: "트렌디 & 개성",    labelEn: "Trendy" },
  { key: "special",     labelKo: "스페셜 & 포인트",  labelEn: "Special" },
  { key: "premium",     labelKo: "프리미엄",          labelEn: "Premium" },
];

export const hairStyles: HairStyle[] = [
  // ── 청순 & 데일리 ───────────────────────────────────────
  {
    id: "straight",
    name: "Straight",
    haircut: "Straightened",
    thumbnail: "/templates/hairstyles/daily/straight.jpeg",
    tags: ["sleek", "classic"],
    category: "daily",
    colorHint: "linear-gradient(160deg, #1a1a1a, #2d2d2d, #3f3f3f)",
  },
  {
    id: "soft-waves",
    name: "Soft Waves",
    haircut: "Soft Waves",
    thumbnail: "/templates/hairstyles/daily/soft-waves.jpeg",
    tags: ["waves", "soft"],
    category: "daily",
    colorHint: "linear-gradient(160deg, #7a5c2a, #b8904a, #d4a96a)",
  },
  {
    id: "blunt-bangs",
    name: "Blunt Bangs",
    haircut: "Blunt Bangs",
    thumbnail: "/templates/hairstyles/daily/blunt-bangs.jpeg",
    tags: ["bangs", "sharp"],
    category: "daily",
    colorHint: "linear-gradient(160deg, #4a2040, #7a3060, #a0407a)",
  },
  {
    id: "side-parted",
    name: "Side-Parted",
    haircut: "Side-Parted",
    thumbnail: "/templates/hairstyles/daily/side-parted.jpeg",
    tags: ["parted", "classic"],
    category: "daily",
    colorHint: "linear-gradient(160deg, #2a1810, #5c3a28, #8a5a40)",
  },
  {
    id: "lob",
    name: "Lob",
    haircut: "Lob",
    thumbnail: "/templates/hairstyles/daily/lob.jpeg",
    tags: ["lob", "bob"],
    category: "daily",
    colorHint: "linear-gradient(160deg, #1a2a1a, #2a4a2a, #3a3a1a)",
  },
  // ── 퍼포먼스 & 파워 ─────────────────────────────────────
  {
    id: "high-ponytail",
    name: "High Ponytail",
    haircut: "High Ponytail",
    thumbnail: "/templates/hairstyles/performance/high-ponytail.jpeg",
    tags: ["updo", "clean"],
    category: "performance",
    colorHint: "linear-gradient(160deg, #2c1810, #5c3a28, #8a5a40)",
  },
  {
    id: "glamorous-waves",
    name: "Glamorous Waves",
    haircut: "Glamorous Waves",
    thumbnail: "/templates/hairstyles/performance/glamorous-waves.jpeg",
    tags: ["waves", "glamour"],
    category: "performance",
    colorHint: "linear-gradient(160deg, #3a1a0a, #7a3a1a, #a05a2a)",
  },
  {
    id: "layered",
    name: "Layered",
    haircut: "Layered",
    thumbnail: "/templates/hairstyles/performance/layered.jpeg",
    tags: ["layered", "volume"],
    category: "performance",
    colorHint: "linear-gradient(160deg, #1a0a2a, #3a1a5a, #5a2a7a)",
  },
  // ── 트렌디 & 개성 ───────────────────────────────────────
  {
    id: "space-buns",
    name: "Space Buns",
    haircut: "Space Buns",
    thumbnail: "/templates/hairstyles/trendy/space-buns.jpeg",
    tags: ["updo", "playful"],
    category: "trendy",
    colorHint: "linear-gradient(160deg, #1a2a6c, #4a90d9, #8ecae6)",
  },
  {
    id: "bubble-ponytail",
    name: "Bubble Ponytail",
    haircut: "Bubble Ponytail",
    thumbnail: "/templates/hairstyles/trendy/bubble-ponytail.jpeg",
    tags: ["ponytail", "trendy"],
    category: "trendy",
    colorHint: "linear-gradient(160deg, #3a0a2a, #7a1a5a, #a02a7a)",
  },
  {
    id: "half-up-half-down",
    name: "Half-Up Half-Down",
    haircut: "Half-Up, Half-Down",
    thumbnail: "/templates/hairstyles/trendy/half-up-half-down.jpeg",
    tags: ["half-up", "feminine"],
    category: "trendy",
    colorHint: "linear-gradient(160deg, #3d2b1f, #5c3d2e, #7a5244)",
  },
];
