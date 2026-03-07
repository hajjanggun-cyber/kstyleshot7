"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { hubPosts, hubPostsEn } from "@/data/hubPosts";

export function HubPreview() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const isKo = lang === "ko";
  const posts = (isKo ? hubPosts : hubPostsEn).filter((p) => p.cardType === "hero").slice(0, 3);

  return (
    <section className="lp-hub">
      <div className="lp-hub-head">
        <div>
          <p className="lp-hub-label">K-Culture Hub</p>
          <h2 className="lp-hub-title">
            {isKo ? "서울을 더 깊게 읽다" : "Read Seoul Deeper"}
          </h2>
        </div>
        <Link className="lp-hub-more" href={`/${lang}/hub`}>
          {isKo ? "전체 보기" : "See all"} →
        </Link>
      </div>

      <div className="lp-hub-scroll">
        {posts.map((post) => (
          <Link
            className="lp-hub-card"
            href={`/${lang}/hub/${post.slug}`}
            key={post.slug}
            style={{ background: post.bg }}
          >
            <span className="lp-hub-card-cat">{post.category}</span>
            <p className="lp-hub-card-title" style={{ color: post.titleColor }}>
              {post.title.replace("\n", " ")}
            </p>
            <span className="lp-hub-card-cta">{isKo ? "읽기 →" : "Read →"}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
