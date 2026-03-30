# 케이컬처 사이트 포스팅 완전 가이드 (초보자용)

이 프로젝트는 **Next.js + MDX** 기반입니다.
포스팅 = `.mdx` 파일 하나를 만드는 것. 코딩 거의 없이 글만 작성하면 됩니다.

---

## 1. 전체 폴더 구조 한눈에 보기

```
kstryletry/
├── content/              ← 포스팅 파일(글) 이 여기 들어감
│   ├── blog/
│   │   ├── en/           ← 영어 블로그 글
│   │   └── ko/           ← 한국어 블로그 글
│   └── hub/
│       ├── en/           ← 영어 허브 글 (현재 메인으로 쓰는 곳)
│       └── ko/           ← 한국어 허브 글
│
├── public/
│   └── images/
│       └── hub/          ← 포스팅에 쓸 이미지 파일 여기 넣음
│           ├── bukchon-tour/   ← 주제별로 폴더 나눠서 관리
│           ├── gyeongbokgung/
│           └── garosu-gil/
│
└── app/
    └── [lang]/
        └── hub/
            └── [slug]/   ← URL 라우팅 자동 처리됨 (건드릴 필요 없음)
```

---

## 2. 슬러그(Slug)란?

**슬러그 = URL 주소에 들어가는 이름**

예시:
- 파일명: `bukchon-hanok-photo-spots.mdx`
- 슬러그: `bukchon-hanok-photo-spots`
- 실제 주소: `https://내사이트.com/en/hub/bukchon-hanok-photo-spots`

### 슬러그 작성 규칙
- 소문자만 사용
- 띄어쓰기 대신 `-` (하이픈) 사용
- 한글 절대 사용 금지 (URL 깨짐)
- 파일명 = 슬러그 이름 (동일하게 맞춰야 함)

| 좋은 예 | 나쁜 예 |
|--------|--------|
| `kpop-idol-style-guide` | `kpop idol style guide` |
| `seoul-skincare-routine` | `서울-스킨케어` |
| `hongdae-cafe-photo-spots` | `Hongdae_Cafe_Photo` |

---

## 3. 포스팅 파일 만드는 법 (단계별)

### Step 1: 파일 위치 결정
- 영어 글 → `content/hub/en/` 폴더 안에 만들기
- 한국어 글 → `content/hub/ko/` 폴더 안에 만들기

### Step 2: 파일 만들기
파일명 예시: `kpop-idol-makeup-guide.mdx`
(확장자는 반드시 `.mdx`)

### Step 3: 파일 내용 작성

아래 템플릿을 복사해서 시작하세요:

```mdx
---
slug: "kpop-idol-makeup-guide"
lang: "en"
category: "K-Beauty"
title: "K-Pop Idol Makeup Guide: Glass Skin and Bold Lip"
description: "Learn the exact steps K-pop idols use for glass skin finish and how to recreate the look at home with accessible products."
publishedAt: "2026-03-20"
readTime: "5 Min Read"
headerGradient: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)"
pullQuote: "K-pop makeup is not about perfection — it is about skin that looks alive."
hreflangSlug: "kpop-idol-makeup-guide"
---

여기서부터 본문 내용 작성 시작

## 첫 번째 소제목

첫 번째 단락 내용...

![이미지 설명](/images/hub/폴더명/이미지파일명.webp)

두 번째 단락 내용...

## 두 번째 소제목

내용...
```

---

## 4. 상단 메타데이터(Frontmatter) 설명

`---` 와 `---` 사이에 들어가는 정보들:

| 항목 | 설명 | 예시 |
|------|------|------|
| `slug` | URL 주소 이름 (파일명과 동일하게) | `"kpop-idol-makeup-guide"` |
| `lang` | 언어 (`en` 또는 `ko`) | `"en"` |
| `category` | 글 분류 카테고리 | `"K-Beauty"` |
| `title` | 글 제목 (SEO에 중요) | `"K-Pop Idol Makeup..."` |
| `description` | 검색 결과에 나오는 설명 (150자 이내) | `"Learn the exact steps..."` |
| `publishedAt` | 발행일 (YYYY-MM-DD 형식) | `"2026-03-20"` |
| `readTime` | 읽는 시간 | `"5 Min Read"` |
| `headerGradient` | 헤더 배경 그라디언트 색상 | CSS gradient 값 |
| `pullQuote` | 글 핵심 한 줄 인용구 | `"K-pop makeup..."` |
| `hreflangSlug` | 한/영 연결용 (slug와 동일하게) | `"kpop-idol-makeup-guide"` |

---

## 5. 이미지 넣는 법

### Step 1: 이미지 파일 준비
- 권장 형식: `.webp` (용량 작고 빠름)
- 권장 크기: 가로 1200px 이상
- 파일명: 소문자 + 하이픈 (슬러그 규칙과 동일)

### Step 2: 이미지 파일 위치에 넣기
```
public/images/hub/내주제폴더/이미지파일명.webp
```

예시:
```
public/images/hub/kpop-makeup/idol-glass-skin-tutorial-1-en.webp
public/images/hub/kpop-makeup/idol-lip-color-guide-2-en.webp
```

> 팁: 주제별로 폴더 만들어서 관리하면 나중에 찾기 편합니다.

### Step 3: MDX 파일 안에서 이미지 삽입

```mdx
![이미지에 대한 설명 텍스트](/images/hub/kpop-makeup/idol-glass-skin-tutorial-1-en.webp)
```

- `!` — 이미지임을 표시
- `[설명 텍스트]` — 이미지 alt 텍스트 (SEO + 접근성에 중요, 꼭 작성)
- `(/images/hub/...)` — 이미지 경로 (`public` 폴더는 경로에 안 씀)

### 이미지 경로 예시 비교

| 실제 파일 위치 | MDX에서 쓰는 경로 |
|--------------|----------------|
| `public/images/hub/kpop-makeup/glass-skin-1.webp` | `/images/hub/kpop-makeup/glass-skin-1.webp` |
| `public/images/hub/seoul-tour/hongdae-cafe-2.webp` | `/images/hub/seoul-tour/hongdae-cafe-2.webp` |

`public/` 부분은 경로에서 빼고 적으면 됩니다.

---

## 6. 실제 완성 포스팅 예시

파일명: `content/hub/en/kpop-idol-makeup-guide.mdx`

```mdx
---
slug: "kpop-idol-makeup-guide"
lang: "en"
category: "K-Beauty"
title: "K-Pop Idol Makeup Guide: Glass Skin and Bold Lip"
description: "Learn the exact steps K-pop idols use for glass skin finish and how to recreate the look at home with accessible products."
publishedAt: "2026-03-20"
readTime: "5 Min Read"
headerGradient: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)"
pullQuote: "K-pop makeup is not about perfection — it is about skin that looks alive."
hreflangSlug: "kpop-idol-makeup-guide"
---

K-pop idol makeup starts with skin, not color. The glass skin finish that looks effortless on stage takes layering, not heavy coverage.

## — What makes K-pop idol skin look different on camera

![Glass skin close-up showing the luminous finish typical of K-pop idol makeup](/images/hub/kpop-makeup/idol-glass-skin-tutorial-1-en.webp)

The difference is hydration layering. Idols typically apply three to four thin hydration steps before any color product touches the skin.

## — How to layer skincare before makeup

![K-beauty skincare products arranged in layering order for glass skin base](/images/hub/kpop-makeup/kbeauty-skincare-layering-order-2-en.webp)

Start with an essence, then a light serum, then a gel moisturizer. Each layer should feel almost absorbed before the next goes on.

## — Which lip colors appear most often in K-pop styling

내용 계속...
```

---

## 7. 포스팅 URL이 만들어지는 원리

파일 하나 만들면 URL이 자동으로 생깁니다.

```
content/hub/en/kpop-idol-makeup-guide.mdx
                    ↓ 자동 변환
https://내사이트.com/en/hub/kpop-idol-makeup-guide
```

코드 건드릴 필요 없이 **파일만 만들면** 페이지가 자동으로 생깁니다.

---

## 8. 새 포스팅 체크리스트

포스팅 올리기 전 아래 항목 확인:

- [ ] 파일명이 슬러그와 일치하는가? (`파일명.mdx` = `slug: "파일명"`)
- [ ] `lang`이 폴더 언어와 일치하는가? (`en/` 폴더면 `lang: "en"`)
- [ ] `publishedAt` 날짜 형식이 `YYYY-MM-DD`인가?
- [ ] 이미지 파일을 `public/images/hub/` 안에 넣었는가?
- [ ] MDX 이미지 경로에서 `public/`을 빼고 `/images/...`로 시작하는가?
- [ ] 이미지 alt 텍스트를 작성했는가?
- [ ] `description`이 150자 이내인가?

---

## 9. 도메인 접속 시 한국어로 자동 랜딩되는 원리

### 이 프로젝트의 언어 설정 구조

이 사이트는 3개 파일이 서로 맞물려서 한국어 자동 랜딩을 처리합니다.

#### 파일 1: `i18n/routing.ts` — 기본 언어 선언
```ts
export const routing = {
  locales: ["en", "ko"],    // 지원하는 언어 목록
  defaultLocale: "ko",      // ← 이게 핵심! 기본 언어 = 한국어
  localeDetection: false,   // 브라우저 언어 자동감지 끔 (항상 ko로 고정)
};
```
> `localeDetection: false` 로 설정하면 브라우저 언어 설정 무관하게 항상 `defaultLocale`로 랜딩됩니다.

#### 파일 2: `proxy.ts` — 미들웨어 (실제 리다이렉트 처리)
```ts
const intlMiddleware = createMiddleware(routing);  // routing 설정 불러옴

export default function proxy(request: NextRequest) {
  // kstyleshot.com → www.kstyleshot.com 리다이렉트
  if (nextUrl.hostname === ROOT_DOMAIN) {
    redirectUrl.hostname = WWW_DOMAIN;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return intlMiddleware(request);  // 나머지는 next-intl이 처리 (ko로 랜딩)
}
```
> 도메인을 치면: `kstyleshot.com` → `www.kstyleshot.com/ko` 로 자동 이동

#### 파일 3: `app/page.tsx` — 루트 페이지
```ts
// Root / is handled by next-intl middleware → redirects to /ko
export default function IndexPage() {
  return null;  // 빈 페이지, 미들웨어가 알아서 /ko로 보냄
}
```

### 실제 접속 흐름

```
사용자가 kstyleshot.com 입력
        ↓
proxy.ts: kstyleshot.com → www.kstyleshot.com (308 리다이렉트)
        ↓
proxy.ts → intlMiddleware 실행
        ↓
i18n/routing.ts의 defaultLocale: "ko" 참조
        ↓
www.kstyleshot.com/ko 로 자동 랜딩
```

### 새 사이트 만들 때 체크리스트

새 케이컬처 사이트를 만들 때 한국어 기본 랜딩을 위해 수정할 파일:

**`i18n/routing.ts`**
```ts
export const routing = {
  locales: ["en", "ko"],
  defaultLocale: "ko",       // 한국어 기본 랜딩 → 이 줄 유지
  localeDetection: false,    // 항상 고정 → 이 줄 유지
};
```

**`proxy.ts`** — 도메인만 내 도메인으로 교체
```ts
const ROOT_DOMAIN = "내도메인.com";          // ← 여기만 바꾸면 됨
const WWW_DOMAIN = `www.${ROOT_DOMAIN}`;
```

> `localeDetection: true`로 바꾸면 브라우저 언어 설정에 따라 자동 분기됩니다.
> 한국어 고정을 원하면 반드시 `false`로 유지하세요.

---

## 10. GitHub → Vercel 배포 흐름

```
내 컴퓨터에서 파일 작성
       ↓
git add .
git commit -m "Add new post: kpop-idol-makeup-guide"
git push origin main
       ↓
GitHub에 파일 올라감
       ↓
Vercel이 자동 감지 → 자동 빌드 → 자동 배포
       ↓
https://내사이트.com/en/hub/kpop-idol-makeup-guide 접속 가능
```

Vercel과 GitHub를 한 번만 연결해두면, 그 이후부터는
**파일 만들고 push만 하면 자동으로 사이트에 반영**됩니다.

---

## 11. 자주 하는 실수

| 실수 | 증상 | 해결 |
|------|------|------|
| 파일명과 slug 불일치 | 404 페이지 | 파일명과 slug 값 똑같이 맞추기 |
| 이미지 경로에 `public/` 포함 | 이미지 안 보임 | `/images/...`로만 시작하기 |
| 파일 확장자를 `.md`로 저장 | 렌더링 오류 가능 | `.mdx`로 저장 |
| 한글 파일명 | URL 깨짐 | 영어 소문자 + 하이픈만 사용 |
| `---` Frontmatter 빠뜨림 | 페이지 오류 | 상단 `---` 블록 반드시 포함 |
