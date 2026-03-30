import { HubFeed } from "@/components/hub/HubFeed";
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
  const posts = isKo ? hubPosts : hubPostsEn;
  const chips = isKo ? FILTER_CHIPS_KO : FILTER_CHIPS_EN;

  return (
    <>
      {/* SSR-rendered links for crawlers — hidden visually, provides full link structure */}
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
