# Codex 수정 지시 — 구글 서치 콘솔 유효성 검사 실패 수정

Created At: 2026-04-09 KST

## 배경

구글 서치 콘솔에서 유효성 검사가 실패했다.
원인: 구 `/blog/` 경로 40+개가 인덱스에 남아 있고, 이것들이 다대일(many-to-one) 301 리다이렉트로 처리되면서 구글이 soft 404로 취급한다.
아래 3가지 작업을 순서대로 실행한다.

---

## 작업 1: `app/robots.ts` 수정

`disallow` 배열에 `"/blog/"` 를 추가한다.

### 변경 전:
```typescript
disallow: ["/api/", "/en/create", "/ko/create"]
```

### 변경 후:
```typescript
disallow: ["/api/", "/en/create", "/ko/create", "/blog/"]
```

이유: 구 `/blog/` 경로는 이제 존재하지 않는 레거시 URL이다. robots.txt에서 차단해서 구글이 더 이상 크롤링하지 않도록 해야 한다. 301 리다이렉트는 유지하되 크롤링은 차단하는 것이 의도.

---

## 작업 2: `next.config.mjs` — catch-all `/blog/` 리다이렉트를 301 → 410으로 변경

`next.config.mjs`의 catch-all 규칙 3개를 찾아 `statusCode: 301` → `statusCode: 410`으로 변경한다.

### 변경 전:
```javascript
// /blog/en/[slug] → /en/hub (catch-all — must come LAST)
{
  source: "/blog/en/:slug*",
  destination: "/en/hub",
  statusCode: 301,
},
// /blog/ko/[slug] → /ko/hub (catch-all — must come LAST)
{
  source: "/blog/ko/:slug*",
  destination: "/ko/hub",
  statusCode: 301,
},
// /blog/[slug] (no locale) → /ko/hub (catch-all — must come LAST of all)
{
  source: "/blog/:slug*",
  destination: "/ko/hub",
  statusCode: 301,
},
```

### 변경 후:
```javascript
// /blog/en/[slug] → 410 Gone (soft 404 방지)
{
  source: "/blog/en/:slug*",
  destination: "/en/hub",
  statusCode: 410,
},
// /blog/ko/[slug] → 410 Gone (soft 404 방지)
{
  source: "/blog/ko/:slug*",
  destination: "/ko/hub",
  statusCode: 410,
},
// /blog/[slug] (no locale) → 410 Gone (catch-all — must come LAST of all)
{
  source: "/blog/:slug*",
  destination: "/ko/hub",
  statusCode: 410,
},
```

이유: 패턴에 매칭되지 않는 `/blog/` URL들이 301로 목록 페이지 하나로 모이면 구글은 soft 404로 판단한다. 410(Gone)은 "이 콘텐츠는 영구 삭제됨"을 명확히 전달하므로 구글이 인덱스에서 훨씬 빠르게 제거한다. 특정 패턴 규칙(gyeongbokgung-, insadong- 등)은 이미 정확한 hub 페이지로 연결되므로 그대로 유지한다.

---

## 작업 4: `next.config.mjs` — locale 없는 정적 경로 리다이렉트 추가

`async redirects()` 함수의 return 배열 **맨 처음**(기존 규칙 위)에 아래 규칙을 추가한다.

### 추가할 규칙:
```javascript
// Bare static pages without locale → /ko/ with locale
{
  source: "/terms",
  destination: "/ko/terms",
  statusCode: 301,
},
{
  source: "/privacy",
  destination: "/ko/privacy",
  statusCode: 301,
},
{
  source: "/refund-policy",
  destination: "/ko/refund-policy",
  statusCode: 301,
},
{
  source: "/cookie-policy",
  destination: "/ko/cookie-policy",
  statusCode: 301,
},
{
  source: "/about",
  destination: "/ko/about",
  statusCode: 301,
},
{
  source: "/contact",
  destination: "/ko/contact",
  statusCode: 301,
},
```

이유: 구글이 `/terms`, `/privacy` 등을 locale 없이 크롤링하고 있다. `next-intl` 미들웨어가 자동 리다이렉트를 하지만, 명시적 301을 넣으면 구글에 더 명확한 신호를 보낸다.

### 위치: 기존 `/hub/:slug*` 리다이렉트 규칙 바로 위에 넣는다.

---

## 작업 5: 내부 링크에서 locale 없는 `/hub/` 경로 검색 및 수정

프로젝트 전체에서 `"/hub/` 또는 `'/hub/` 형태의 내부 링크를 검색한다.

### 검색 대상:
- `*.tsx`, `*.ts`, `*.mdx` 파일 전체

### 검색 패턴:
```
"/hub/
'/hub/
href="/hub/
href='/hub/
```

### 예외 (수정하지 않는 것):
- `next.config.mjs` 안의 리다이렉트 `destination` 값 (이것은 이미 `/ko/hub/` 형태)
- `next.config.mjs` 안의 리다이렉트 `source` 값 (이것은 의도적으로 `/hub/:slug*`)
- `sitemap.ts` (이미 `/${locale}/hub/${slug}` 형태 사용)

### 수정 방법:
- `/hub/[slug]` → `/ko/hub/[slug]` (KO 컨텍스트인 경우)
- `/hub/[slug]` → `/en/hub/[slug]` (EN 컨텍스트인 경우)
- 만약 동적으로 locale을 쓰는 코드라면 `/${locale}/hub/[slug]` 형태인지 확인

### 주의:
- MDX 파일 안의 내부 링크는 이미 `/ko/hub/...` 또는 `/en/hub/...` 형태를 쓰고 있어야 한다. 위반이 있으면 수정한다.
- 컴포넌트 코드에서 `href` prop으로 `/hub/...`를 주는 곳이 있으면 수정한다.

---

## 작업 완료 후

1. 수정한 파일 목록을 알려준다
2. `npm run build`가 정상적으로 완료되는지 확인한다 (빌드만 확인, 배포는 하지 않는다)
3. 변경 사항이 기존 기능을 깨뜨리지 않는지 확인한다

---

## 수정하지 않는 것 (참고)

- `sitemap.ts` — 현재 구조 정상, 수정 불필요
- `middleware.ts` — non-www → www 리다이렉트 정상, 수정 불필요
- `lib/seo.ts` — canonical URL 로직 정상, 수정 불필요
- 애드센스 콘텐츠 품질 문제는 이 작업 범위가 아님 (별도 작업)
