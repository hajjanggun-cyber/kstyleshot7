import { HubFeed } from "@/components/hub/HubFeed";
import { isAdsenseReviewHubSlug } from "@/data/adsenseReview";
import {
  hubPosts,
  hubPostsEn,
  FILTER_CHIPS_KO,
  FILTER_CHIPS_EN,
} from "@/data/hubPosts";

type HubPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function HubPage({ params }: HubPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";
  const allPosts = isKo ? hubPosts : hubPostsEn;
  const reviewPosts = allPosts.filter((post) => isAdsenseReviewHubSlug(post.slug));
  const posts = reviewPosts.length > 0 ? reviewPosts : allPosts;
  const allChips = isKo ? FILTER_CHIPS_KO : FILTER_CHIPS_EN;
  const activeCategories = new Set(posts.map((post) => post.category));
  const chips = allChips.filter((chip, index) => index === 0 || activeCategories.has(chip));

  return (
    <>
      {/* SSR-rendered links for crawlers, aligned with the current AdSense review set. */}
      <nav aria-label="Hub articles" className="sr-only">
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/${lang}/hub/${post.slug}`}>{post.title.replace(/\n/g, " ")}</a>
            </li>
          ))}
        </ul>
      </nav>
      <HubFeed initialPosts={posts} initialChips={chips} lang={lang} />
    </>
  );
}
