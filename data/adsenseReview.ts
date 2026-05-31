export const ADSENSE_REVIEW_HUB_SLUGS = [
  "gyeongbokgung-hub",
  "gyeongbokgung-photo-guide",
  "gyeongbokgung-light-timing-guide",
  "han-river-park-hub",
  "yeouido-han-river-picnic-guide",
  "banpo-han-river-night-view-guide",
  "seongsu-hub",
  "seongsu-pop-up-store-guide",
  "seongsu-cafe-photo-spots",
  "seongsu-industrial-alley-walk-guide",
  "hongdae-hub",
  "hongdae-street-photo-spots",
  "hongdae-aesthetic-cafes-for-photos",
  "seoul-photo-spot-guide",
  "euljiro-retro-photo-spot-guide",
  "bukchon-hanok-village-hub",
  "bukchon-hanok-photo-spots",
  "bukchon-hanbok-photo-route",
  "seoul-cherry-blossom-photo-spots",
  "seoul-forest-picnic-photo-guide",
  "seokchon-lake-photo-spot-guide",
  "korean-skincare-routine-guide",
  "k-beauty-base-makeup-tips",
  "how-to-choose-a-cushion-foundation",
  "semi-matte-base-makeup-guide",
  "long-lasting-summer-makeup-guide",
  "winter-glow-makeup-guide",
  "toner-pad-usage-guide",
  "how-to-get-glass-skin",
  "korean-sheet-mask-guide",
] as const;

const ADSENSE_REVIEW_HUB_SLUG_SET = new Set<string>(ADSENSE_REVIEW_HUB_SLUGS);

export function isAdsenseReviewHubSlug(slug: string): boolean {
  return ADSENSE_REVIEW_HUB_SLUG_SET.has(slug);
}
