# Codex 수정 지시 — Hub 081-085 콘텐츠 SEO 및 AdSense 품질 개선

Created At: 2026-04-09 KST

## 배경

Hub 081-085 파일을 검토한 결과:
- 081, 082, 083, 084는 콘텐츠 품질 및 SEO 구조 양호 → 대규모 수정 불필요
- 085만 Critical 문제 있음: 타이틀/키워드에 K-beauty 맥락이 없어 일반 뷰티 사이트와 차별화 안 됨 → AdSense "가치 없는 콘텐츠" 거절 원인
- 083, 084, 085는 섹션 헤딩 스타일이 081, 082와 불일치

아래 작업을 순서대로 실행한다.

---

## 작업 1: [085] `makeup-tips-for-better-photos` — 타이틀·설명에 K-beauty 맥락 추가

### 대상 파일 (EN + KO 둘 다):
- `content/hub/en/makeup-tips-for-better-photos.mdx`
- `content/hub/ko/makeup-tips-for-better-photos.mdx`

### 1-A. EN 파일 frontmatter 수정

**변경 전:**
```
title: "Makeup Tips for Better Photos"
description: "Use these makeup tips for better photos to handle flash-friendly makeup, cleaner concealer placement, better contour placement, and camera-ready skin without making the face look heavy."
```

**변경 후:**
```
title: "K-Beauty Makeup Tips for Better Photos"
description: "Use these K-beauty makeup tips for better photos to handle flash-friendly cushion base, Korean concealer placement, contour logic, and camera-ready skin without making the face look heavy."
```

### 1-B. KO 파일 frontmatter 수정

KO 파일에서 동일하게 title과 description에 "K-뷰티" 맥락을 추가한다. KO title은 `사진 잘 나오는 K-뷰티 메이크업 가이드` 형태로 수정한다 (현재 KO title을 먼저 확인하고 적절히 수정).

### 1-C. EN 파일 본문 — K-beauty 특화 섹션 추가

`## What to fix first right before the camera starts` 섹션 바로 앞에 아래 섹션을 삽입한다:

```mdx
## — Why Korean cushion compacts read differently under flash

Korean cushion compacts are engineered to spread thinner than most western liquid foundations. That structural difference matters for flash-friendly makeup. A thinner layer means there is less product to reflect back, which generally reduces the overexposed look that thick western foundations can create under direct light. The tradeoff is coverage, which is why a Korean skincare-first approach often works well here: a stable skin base needs less cushion coverage to begin with.

Olive Young cushion foundations, in particular, tend to run semi-matte to natural-finish on the face rather than glossy, which is a useful starting point for photos. The same logic applies to Korean tinted sunscreens: the finish is usually closer to a skin tone correction than a traditional foundation, which means the face reads less "made up" on camera even when SPF protection is present.

This is also why the combination of tinted sunscreen plus cushion touch-up often works better in travel or outdoor photo settings than a heavy full-coverage base. Less product, cleaner camera result.
```

### 1-D. EN 파일 본문 — `## What to check before...` 섹션에 K-beauty 문맥 한 줄 추가

현재 도입 섹션 마지막 문단에 아래 문장을 추가한다 (기존 마지막 줄 뒤에 이어 붙임):

```
K-beauty base logic tends to build thin and correct locally rather than covering everything at once, which is why this approach transfers well into photo settings.
```

---

## 작업 2: [083, 084, 085] 섹션 헤딩 스타일 통일

081, 082는 `## —` 형식을 사용한다. 083, 084, 085는 `## ` 형식(대시 없음)을 사용하고 있어 스타일이 불일치한다. 아래 파일들의 **모든** `## ` 헤딩을 `## — ` 형식으로 통일한다.

### 대상 파일 (EN + KO 각각):
- `content/hub/en/how-to-ask-for-a-hairstyle-in-korea.mdx`
- `content/hub/ko/how-to-ask-for-a-hairstyle-in-korea.mdx`
- `content/hub/en/travel-k-beauty-pouch-guide.mdx`
- `content/hub/ko/travel-k-beauty-pouch-guide.mdx`
- `content/hub/en/makeup-tips-for-better-photos.mdx`
- `content/hub/ko/makeup-tips-for-better-photos.mdx`

### 규칙:
- `## What to note before...` → `## — What to note before...`
- `## Why a reference photo...` → `## — Why a reference photo...`
- 등, 모든 `## [대문자]`로 시작하는 헤딩에 `## — ` 형식 적용
- `## —` 가 이미 있는 경우 중복 추가하지 않는다
- `<div`, frontmatter, Quick Summary 블록 안의 텍스트는 건드리지 않는다

---

## 작업 완료 후

1. 수정한 파일 목록을 알려준다
2. `npm run build`가 정상적으로 완료되는지 확인한다 (빌드만 확인, 배포는 하지 않는다)
3. KO 파일도 작업 1의 변경사항이 적용되었는지 확인한다

---

## 수정하지 않는 것

- 081 (`olive-young-must-buys-guide`) — 콘텐츠 양호, 수정 불필요
- 082 (`olive-young-skincare-shopping-guide`) — 콘텐츠 양호, 수정 불필요
- 083, 084, 085의 slug — 변경하지 않는다 (내부 링크 연쇄 변경 리스크)
- 083, 084의 타이틀 — 이미 Korea 특화 키워드로 잘 구성됨
- 내부 링크 경로 — 모든 참조 파일이 존재함을 확인, 수정 불필요
