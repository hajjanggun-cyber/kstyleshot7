export const ADSENSE_REVIEW_HUB_SLUGS = [
  "gyeongbokgung-hub",
  "gyeongbokgung-photo-guide",
  "gyeongbokgung-light-timing-guide",
  "bukchon-hanok-photo-spots",
  "bukchon-hanbok-photo-route",
  "ssamziegil-insadong-photo-guide",
  "han-river-park-hub",
  "yeouido-han-river-picnic-guide",
  "banpo-han-river-night-view-guide",
  "seokchon-lake-photo-spot-guide",
  "euljiro-retro-photo-spot-guide",
  "seongsu-cafe-photo-spots",
] as const;

const ADSENSE_REVIEW_HUB_SLUG_SET = new Set<string>(ADSENSE_REVIEW_HUB_SLUGS);

export function isAdsenseReviewHubSlug(slug: string): boolean {
  return true;
}
