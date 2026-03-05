export type LocalGenerationStage = "hair" | "outfit" | "cutout";

const stagePalette: Record<LocalGenerationStage, string[]> = {
  hair: ["#c4572a", "#de7c3a", "#f3b86d"],
  outfit: ["#1f4f5e", "#356f7e", "#78a3af"],
  cutout: ["#5c5c5c", "#808080", "#aaaaaa"]
};

function buildMockSvg(
  stage: LocalGenerationStage,
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
      <text x="96" y="1836" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="24">Local ${stage} preview ${index + 1}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createLocalGeneratedResults(
  stage: LocalGenerationStage,
  ids: string[],
  labelById: Record<string, string>,
  subtitle = "Local provider fallback"
): Array<{ id: string; imageUrl: string }> {
  return ids.map((id, index) => ({
    id,
    imageUrl: buildMockSvg(stage, labelById[id] ?? id, subtitle, index)
  }));
}
