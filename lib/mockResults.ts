import type { StepResult } from "@/types";

type MockStage = "hair" | "outfit" | "location";

const stagePalette: Record<MockStage, string[]> = {
  hair: ["#c4572a", "#de7c3a", "#f3b86d"],
  outfit: ["#1f4f5e", "#356f7e", "#78a3af"],
  location: ["#395c2f", "#6e8f45", "#c3d37a"]
};

function buildMockSvg(
  stage: MockStage,
  title: string,
  subtitle: string,
  index: number
): string {
  const palette = stagePalette[stage];
  const a = palette[index % palette.length];
  const b = palette[(index + 1) % palette.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#bg)" rx="72" />
      <circle cx="540" cy="620" r="250" fill="rgba(255,255,255,0.14)" />
      <rect x="260" y="920" width="560" height="620" rx="280" fill="rgba(255,255,255,0.18)" />
      <text x="96" y="140" fill="white" font-family="Georgia, serif" font-size="56" font-weight="700">${title}</text>
      <text x="96" y="210" fill="rgba(255,255,255,0.88)" font-family="Arial, sans-serif" font-size="28">${subtitle}</text>
      <text x="96" y="1836" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="24">Mock ${stage} preview ${index + 1}</text>
      <text x="984" y="1836" text-anchor="end" fill="rgba(255,255,255,0.65)" font-family="Arial, sans-serif" font-size="24">demo</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createMockStepResults(
  stage: MockStage,
  ids: string[],
  itemLookup: Record<string, { name: string }>
): StepResult[] {
  return ids.map((id, index) => {
    const name = itemLookup[id]?.name ?? id;

    return {
      id,
      blobUrl: buildMockSvg(stage, name, "Interactive local preview", index),
      downloaded: false,
      selected: false
    };
  });
}

