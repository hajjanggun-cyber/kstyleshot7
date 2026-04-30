# 애드센스 승인 후 복구 가이드

애드센스 "가치없는 콘텐츠" 거절 대응을 위해 사이트를 한시적으로 `content-mode`에 가깝게 운영하는 상황을 가정한 문서다. 이 문서는 **승인 후** AI 생성 서비스 UI와 관련 CTA를 다시 노출할 때 참고하는 복구용 런북이다.

이 문서는 "초안 메모"가 아니라 **현재 저장소 구조 기준**으로 유지해야 한다. 특히 배너 복구 위치는 MDX 개별 파일이 아니라 `components/hub/HubMdxPage.tsx` 기준으로 본다.

---

## 1. 현재 기준에서 복구 대상 / 비대상

### 1-1. 복구 대상이 아닌 항목

아래는 content-mode와 별개인 수정이므로 승인 후에도 유지한다.

- `data/hubPosts.ts`
  깨진 한국어 문자열, 중복 `{`, em-dash 등 데이터/문자열 복구 성격의 수정. **되돌리지 말 것.**
- `components/hub/HubFeed.tsx`
  CTA 텍스트의 깨진 문자 복구 (`"읽기"` 관련). **유지.**

### 1-2. 승인 후 되돌릴 수 있는 항목

| 항목 | 파일 | 변경 내용 | 복구 메모 |
|---|---|---|---|
| A | `content/hub/ko/*.mdx`, `content/hub/en/*.mdx` | `ha-mid-cta` 블록 제거 | 글마다 원래 위치가 달라 수동 복구 또는 `git revert` 권장 |
| B | `components/hub/HubMdxPage.tsx` | hub 페이지 하단 배너 주석 처리 / 제거 | MDX 대량 수정이 아니라 레이아웃 컴포넌트 기준으로 복구 |
| C | `components/hub/HubFeed.tsx` | `/create` AI Studio 탭 제거, `Home` 탭 추가 | 승인 후 탭 구성을 재검토해 복구 |
| D | `components/hub/HubFeed.tsx` | `"Search 300+ Stories"` → `"Search Stories"` | 선택 복구. 허위/과장 문구 방지 목적이면 그대로 둬도 됨 |
| E | `app/[lang]/page.tsx` | 메인 랜딩 섹션 제거 예정 | 아직 미작업이면 로그만 준비 |
| F | `components/common/SiteHeader.tsx` | `Create` 링크 제거 예정 | 아직 미작업이면 로그만 준비 |

> 주의: 현재 저장소 기준으로 E, F는 아직 제거되지 않은 상태일 수 있다. 실제 변경이 들어간 뒤에만 복구 대상으로 간주한다.

---

## 2. 복구 전략

### 전략 1. `git revert` 우선

가장 안전한 방법은 content-mode 관련 변경을 **기능 단위 커밋**으로 남기고, 승인 후 해당 커밋만 역순으로 `git revert` 하는 것이다.

단, 아래 조건을 만족해야 한다.

- content-mode 변경이 실제로 커밋되어 있을 것
- 복구 전에 워크트리에 미커밋 변경이 없을 것
- 같은 파일에 후속 수정이 많지 않아 충돌 위험이 낮을 것

권장 절차:

```bash
git checkout main
git pull
git status
# 여기서 working tree clean 확인

git revert <commit-hash-latest> <commit-hash-older> ...
# 충돌 시 해결 후
git revert --continue

git push
```

장점:

- 원래 위치와 구조를 가장 정확하게 복원 가능
- `ha-mid-cta`처럼 수동 위치 복원이 어려운 요소에 특히 유리

단점:

- 미커밋 변경이 남아 있으면 바로 진행할 수 없음
- 동일 파일에 후속 작업이 쌓였으면 충돌 가능

### 전략 2. 수동 복구

`git revert`가 어렵거나, content-mode 이후 같은 파일에 다른 수정이 많이 들어갔을 경우 사용한다.

이 전략은 항목별로 나눠서 적용한다.

#### 2-A. `ha-mid-cta` 복구

`ha-mid-cta`는 여전히 각 MDX 본문 안에 있던 구조로 보는 것이 맞다. 다만 **글마다 위치가 달랐기 때문에 자동 복구를 기본 전략으로 잡지 않는다.**

KO 예시:

```jsx
<div className="ha-mid-cta">
  <a href="/ko" className="ha-mid-cta-link">K-스타일 프로필 만들기</a>
</div>
```

EN 예시:

```jsx
<div className="ha-mid-cta">
  <a href="/en" className="ha-mid-cta-link">Create your K-style profile</a>
</div>
```

운영 판단:

- mid-cta까지 정확히 살려야 하면 `git revert` 우선
- 복구 비용이 크면 mid-cta는 포기하고 다른 CTA 설계로 대체 가능

#### 2-B. `ha-bottom-banner` 복구

현재 구조 기준으로 하단 배너는 MDX 파일이 아니라 `components/hub/HubMdxPage.tsx`에서 복구한다.

즉, 과거처럼 `content/hub/**/*.mdx`에 `ha-bottom-banner`를 다시 넣는 방식으로 이해하면 안 된다. 이전 히스토리상 배너는 한때 MDX에서 제거되고 레이아웃 컴포넌트로 이동했다.

복구 대상 예시:

```tsx
{frontmatter.slug?.endsWith("-hub") ? (
  <div className="ha-bottom-banner">
    <a
      href={`/${lang}`}
      aria-label={lang === "ko" ? "K-스타일 포트레이트 만들기" : "Create your K-style portrait"}
    >
      <img
        src={lang === "ko" ? "/visuals/blog/blog-bottom-banner-kr.webp" : "/visuals/blog/blog-bottom-banner-en.webp"}
        alt={lang === "ko" ? "K-스타일 포트레이트 만들기" : "Create your K-style portrait"}
        loading="lazy"
      />
    </a>
  </div>
) : null}
```

주의:

- 위 문구는 현재 코드/히스토리 기준 예시다
- 실제 복구 시에는 최신 브랜치의 텍스트, 이미지 경로, 노출 조건을 다시 확인할 것

#### 2-C. CSS 상태

`app/globals.css`에는 `.ha-mid-cta`, `.ha-bottom-banner` 스타일이 남아 있을 수 있다. 이 경우 JSX/TSX 복구만으로 바로 스타일이 살아난다.

반대로 CSS가 이후에 정리되었다면, 복구 전에 클래스 존재 여부를 먼저 확인한다.

#### 2-D. `components/hub/HubFeed.tsx` 복구

현재 문서 기준 복구 후보는 아래다.

- `/create` AI Studio 탭 재노출
- `Home` 탭 유지 여부 결정
- `Search 300+ Stories` 문구 복원 여부 결정

AI Studio 탭 복구 예시:

```tsx
<Link className="hf-nav-item" href={`/${lang}/create`}>
  <span className="hf-nav-icon" aria-hidden>
    ✦
  </span>
  <span className="hf-nav-label">AI Studio</span>
</Link>
```

주의:

- `Map / Me` 버튼은 과거에도 실제 동작이 없던 죽은 UX였다면 복원하지 않는 편이 낫다
- `Home` 탭은 content-mode 대응이라기보다 내비 구조 개선일 수도 있으니 무조건 제거 대상으로 보지 말 것
- `"Search 300+ Stories"` 문구는 실제 글 수와 다르면 복구하지 않는 편이 더 낫다

#### 2-E. 홈페이지 섹션 복구

`app/[lang]/page.tsx`에서 아래가 제거되었을 때만 복구한다.

- `HeroSection`
- `HowItWorks`
- `GalleryTabs`
- `PricingSection`

아직 실제 제거 작업 전이라면 이 문서에는 "복구 예정"으로만 두고, 제거 시점의 커밋 해시를 반드시 기록한다.

#### 2-F. SiteHeader `Create` 링크 복구

`components/common/SiteHeader.tsx`에서 `Create` 링크가 실제로 제거되었을 때만 복구 대상으로 본다.

현재 살아 있는 상태라면 이 항목은 실행 대상이 아니다.

---

## 3. 승인 후 실행 체크리스트

복구 작업 시작 전:

- [ ] `git status` 확인
- [ ] 미커밋 변경이 있으면 먼저 커밋하거나 별도 정리
- [ ] 아래 작업 로그에 복구 대상 커밋 해시가 실제로 기록돼 있는지 확인

복구 작업 후:

- [ ] `git revert` 또는 수동 복구 완료
- [ ] `/ko/hub/{slug}` 한 건 확인해 `ha-mid-cta`와 하단 배너 노출 상태 점검
- [ ] hub 일반 글과 `-hub` 글에서 배너 조건이 의도대로 동작하는지 확인
- [ ] `/ko`, `/en` 홈에서 랜딩 섹션 노출 상태 확인
- [ ] `SiteHeader`의 `Create` 링크 노출 여부 확인
- [ ] `/create` 라우트의 `robots.ts` 정책 확인
- [ ] `/sitemap.xml` 확인
- [ ] `next build` 또는 배포 파이프라인 기준 빌드 성공 확인
- [ ] 배포 후 실 URL 최종 확인

---

## 4. 작업 로그

이 문서의 핵심은 여기다. 복구를 실제로 쉽게 하려면 content-mode 관련 변경을 기능 단위로 커밋하고, 커밋 해시를 여기에 기록해야 한다.

| 날짜 | 작업 | 커밋 해시 | 비고 |
|---|---|---|---|
| 2026-04-11 | 작업 A: hub posts에서 `ha-mid-cta` 제거 | _(기록 필요)_ | 각 MDX 본문 수정 |
| 2026-04-11 | 작업 B: `HubMdxPage.tsx` 하단 배너 주석 처리 / 제거 | _(기록 필요)_ | MDX 대량 복구 대상 아님 |
| 2026-04-11 | 작업 C: `HubFeed.tsx`에서 `/create` 제거, `Home` 탭 추가 | _(기록 필요)_ | `Map / Me`는 복구 비권장 |
| 2026-04-11 | 작업 D: `HubFeed.tsx` 검색 placeholder 조정 | _(기록 필요)_ | 선택 복구 |
| 미정 | 작업 E: `app/[lang]/page.tsx` 랜딩 섹션 제거 | | 제거 시 기록 |
| 미정 | 작업 F: `components/common/SiteHeader.tsx` `Create` 링크 제거 | | 제거 시 기록 |

실무 메모:

- 현재 워크트리에 미커밋 상태로 남아 있는 변경은 복구 문서의 전제가 아니다
- "나중에 되돌릴 변경"은 가능하면 즉시 커밋해서 해시를 남길 것
- 커밋 메시지도 `content-mode:` 접두사 등으로 통일해두면 추적이 쉬움

---

## 5. 복구 시 운영 주의점

- 승인 직후 모든 CTA와 랜딩 섹션을 한 번에 복원하지 말고 단계적으로 되돌릴 것
- AdSense가 다시 사이트 행태를 평가할 수 있으므로, 복구 주간에는 일부 허브 글을 content-first 상태로 유지하는 방안도 검토할 것
- `app/[lang]/create`는 애드센스 승인 이후에도 `robots.ts`에서 계속 `Disallow` 유지하는 편이 안전할 수 있음
- 과장 문구, 실제 동작 없는 버튼, 중복 배너는 승인 후에도 그대로 복구하지 말 것

---

복구 작업이 끝나고 이 문서가 더 이상 필요 없으면 `md-doc/archive/`로 이동하거나 삭제한다.
