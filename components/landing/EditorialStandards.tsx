"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const KO_ITEMS = [
  {
    title: "방문 전에 확인할 정보",
    body: "서울 장소 글은 접근 동선, 시간대, 혼잡 흐름, 사진 구도처럼 실제 방문 전에 판단해야 하는 정보를 우선 정리합니다."
  },
  {
    title: "성분과 사용 조건",
    body: "K-뷰티 글은 성분명, 피부 상태, 사용 순서, 실패하기 쉬운 조건을 함께 보며 과장된 효능 표현을 줄입니다."
  },
  {
    title: "한국어와 영어 별도 작성",
    body: "각 언어 독자가 검색하는 방식과 배경지식이 달라서 단순 번역 대신 독자별 질문에 맞춰 다시 씁니다."
  }
];

const EN_ITEMS = [
  {
    title: "Useful before a visit",
    body: "Seoul location guides prioritize route choices, timing, crowd flow, and photo angles that readers can use before they arrive."
  },
  {
    title: "Ingredients and conditions",
    body: "K-beauty guides name ingredients, skin states, order of use, and common failure points instead of leaning on broad product claims."
  },
  {
    title: "Separate Korean and English editions",
    body: "The Korean and English guides are written for different search intents rather than copied as direct translations."
  }
];

export function EditorialStandards() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const isKo = lang === "ko";
  const items = isKo ? KO_ITEMS : EN_ITEMS;

  return (
    <section className="lp-editorial" aria-labelledby="editorial-standards-title">
      <div className="lp-editorial-head">
        <p className="lp-section-label">{isKo ? "Editorial Standards" : "Editorial Standards"}</p>
        <h2 id="editorial-standards-title" className="lp-editorial-title">
          {isKo ? "읽을 이유가 있는 가이드만 남깁니다" : "Guides Built Around Reader Decisions"}
        </h2>
        <p className="lp-editorial-copy">
          {isKo
            ? "K-StyleShot은 서울, K-뷰티, K-패션 정보를 모아두는 데서 끝내지 않고 실제 선택 기준과 업데이트 근거를 함께 보여주는 방향으로 운영합니다."
            : "K-StyleShot is being organized around practical choices, update signals, and clear editorial responsibility across Seoul, K-beauty, and K-fashion topics."}
        </p>
      </div>

      <div className="lp-editorial-grid">
        {items.map((item) => (
          <article className="lp-editorial-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="lp-editorial-links">
        <Link href={`/${lang}/about`}>{isKo ? "제작 기준 보기" : "Read about our standards"}</Link>
        <Link href={`/${lang}/contact`}>{isKo ? "수정 제보하기" : "Report an update"}</Link>
      </div>
    </section>
  );
}
