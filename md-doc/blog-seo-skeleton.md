# kstyleshot Blog SEO Skeleton

작성: Codex (GPT-5)
목표: 블로그 구조를 먼저 고정하고, 이후 포스팅은 이 뼈대를 따라 누적하는 방식으로 운영

## 1. 원칙

1. 블로그는 `구조를 먼저 고정`하고, 글은 그 구조 위에 계속 쌓는다.
2. SEO 관점에서 자주 바꾸면 안 되는 것은 `URL`, `카테고리`, `내부 링크 기준`, `공통 메타 구조`다.
3. 디자인 문구와 카드 순서는 조정 가능하지만, 구조적 뼈대는 쉽게 바꾸지 않는다.
4. 블로그 본문은 `/blog`에서 독립 운영하고, create 단계 UI에는 긴 포스팅 본문을 직접 삽입하지 않는다.

---

## 2. 고정할 URL 구조

이 경로는 장기 운영 기준으로 고정:

1. `/blog`
   - 전체 블로그 랜딩
   - 언어 허브와 카테고리 트랙 진입점
2. `/blog/[lang]`
   - 언어별 랜딩
   - 예: `/blog/en`, `/blog/ko`
3. `/blog/[lang]/category/[category]`
   - 카테고리 랜딩 허브
   - 예: `/blog/en/category/hair`
4. `/blog/[lang]/[slug]`
   - 개별 포스트

규칙:

1. 카테고리 slug는 확정 후 바꾸지 않는다.
2. 포스트 slug는 공개 후 바꾸지 않는다.
3. 경로 구조를 바꿔야 하면 리디렉션 전략 없이 바꾸지 않는다.

---

## 3. 고정 카테고리 (7개)

고정 카테고리:

1. `product-faq`
2. `hair`
3. `photo-technique`
4. `beauty-prep`
5. `outfit-styling`
6. `backdrop-mood`
7. `seasonal-trend`

표시명:

1. EN
   - `Product / FAQ`
   - `Hair`
   - `Photo Technique`
   - `Beauty Prep`
   - `Outfit / Styling`
   - `Backdrop / Mood`
   - `Seasonal / Trend`
2. KO
   - `제품 / FAQ`
   - `헤어`
   - `촬영 팁`
   - `K-뷰티 준비`
   - `코디`
   - `배경 / 무드`
   - `시즌 / 트렌드`

규칙:

1. 새 카테고리를 쉽게 추가하지 않는다.
2. 세부 분류는 카테고리가 아니라 `tags`로 처리한다.

---

## 4. 고정 내부 링크 구조

기본 연결 구조:

1. `/blog`
   -> `/blog/[lang]`
2. `/blog/[lang]`
   -> `/blog/[lang]/category/[category]`
   -> 주요 추천 포스트
3. `/blog/[lang]/category/[category]`
   -> 같은 카테고리 포스트들
4. `/blog/[lang]/[slug]`
   -> 같은 카테고리 글
   -> 관련 상위 허브
   -> `/${lang}/create`

실전 규칙:

1. 개별 글은 최소 3개 이상의 내부 링크 후보를 갖게 한다.
2. 같은 카테고리 글 1~2개, 상위 허브 1개, 서비스 CTA 1개 구조를 기본으로 본다.
3. 블로그 허브와 카테고리 허브는 “계속 링크를 받는 페이지”로 유지한다.
4. 블로그에서 create로 내려보내는 연결은 글 하단 CTA 1개를 기본값으로 유지한다.

---

## 5. 고정 메타 / 본문 규칙

각 포스트는 아래를 유지:

1. frontmatter
   - `title`
   - `slug`
   - `lang`
   - `date`
   - `updated`
   - `description`
   - `tags`
   - `category`
   - `draft`
   - `canonical`
   - `pairSlug`
   - `ctaVariant`
2. 본문 템플릿
   - 도입 / Intro
   - 왜 중요한가 / Why This Matters
   - 실전 팁 3~7개
   - 자주 하는 실수 / Common Mistakes
   - 체크리스트 / Quick Checklist
   - CTA
   - Disclaimer

규칙:

1. CTA 위치는 글 하단으로 고정
2. disclaimer 위치도 글 하단으로 고정
3. 본문 구조는 카테고리마다 약간의 차이는 허용하되 기본 골격은 유지

---

## 6. 글을 쓸 때 바꾸지 말아야 하는 것

이 항목은 이후 포스팅 시 가급적 손대지 않는다:

1. 카테고리 slug
2. 카테고리 허브 경로
3. 포스트 파일명 규칙 (`slug.mdx`)
4. 언어별 폴더 구조 (`content/blog/en`, `content/blog/ko`)
5. 공통 CTA / disclaimer 배치 원칙

바꿔도 되는 것:

1. 랜딩 페이지 카피
2. 카드 소개 문장
3. 대표글 노출 순서
4. 카테고리 설명 문구

---

## 7. 이후 운영 방식

이 문서를 기준으로:

1. 먼저 허브(랜딩) 구조를 유지
2. 그다음 `Tier 1` 글을 우선 발행
3. 이후 `Tier 2`, `Tier 3`는 같은 뼈대 위에서 계속 추가

즉:

1. 구조는 먼저 만들고
2. 구조는 쉽게 안 바꾸고
3. 글만 계속 누적한다

이 방식이 장기적으로 Google SEO에 가장 안전하다.
