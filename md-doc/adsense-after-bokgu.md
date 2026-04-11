# 애드센스 승인 후 복구 가이드

애드센스 "가치없는 콘텐츠" 3차 거절에 대응하기 위해 사이트를 "콘텐츠 우선" 모드로 임시 전환 중입니다. 이 문서는 **승인 난 뒤** AI 생성 서비스 UI를 원상복구하는 절차입니다.

---

## 1. 현재 "content-mode"로 바꾼 변경 내역

### 1-1. 유지해야 하는 수정 (복구 대상 아님 — 이건 버그 수정이니까 그대로 둔다)

- `data/hubPosts.ts` — 깨진 한국어 문자열 219개, 중복 `{`, 깨진 em-dash 복구. **절대 되돌리지 말 것.**
- `components/hub/HubFeed.tsx:292,375` — `"?쎄린"` → `"읽기"` 깨진 문자 복구. **유지.**

### 1-2. 승인 후 되돌릴 대상

| 항목 | 파일 | 변경 내용 | 복구 방법 |
|---|---|---|---|
| A | `content/hub/ko/*.mdx`, `content/hub/en/*.mdx` (80개) | `<div className="ha-mid-cta">…</div>` 블록 제거 | 아래 2-B 참조 |
| B | `content/hub/ko/*.mdx`, `content/hub/en/*.mdx` (80개) | `<div className="ha-bottom-banner">…</div>` 블록 제거 | 아래 2-B 참조 |
| C | `components/hub/HubFeed.tsx` | `/create` AI Studio 탭 + Map/Me 버튼 제거, `Home` 탭 추가 | 아래 2-C 참조 |
| D | `components/hub/HubFeed.tsx:307` | `"Search 300+ Stories"` → `"Search Stories"` | 필요시 원복 (선택) |
| E | (예정) 메인 홈페이지 섹션 제거 (HeroSection, HowItWorks, GalleryTabs, PricingSection) | `app/[lang]/page.tsx` | 아래 2-E 참조 |
| F | (예정) `components/common/SiteHeader.tsx`에서 `Create` 링크 제거 | 아래 2-F 참조 |

> **주의**: E, F는 아직 작업 전. 이 문서는 A~D 기준으로 먼저 작성되었으며, E/F 진행 시 이 문서에 작업 커밋 해시를 추가해두세요.

---

## 2. 복구 방법 — 두 가지 전략

### 전략 1 (권장): `git revert` 사용

작업 A~F를 하나의 브랜치(`adsense-content-mode`) 또는 연속 커밋으로 진행하면, 승인 후 `git revert <commit>` 한 번으로 전체 원복 가능.

```bash
# 현재 content-mode 관련 커밋 해시를 미리 메모해두세요:
# - banner 제거 커밋: <commit-hash-1>
# - HubFeed 네비 변경 커밋: <commit-hash-2>
# - 홈페이지 섹션 제거 커밋: <commit-hash-3>
# - SiteHeader Create 제거 커밋: <commit-hash-4>

# 승인 후:
git checkout main
git pull
git revert <commit-hash-4> <commit-hash-3> <commit-hash-2> <commit-hash-1>
# 역순으로 되돌림. 충돌 나면 해결 후 git revert --continue
git push
```

**장점**: 정확하고 빠름. 배너 위치까지 원래대로 복원.
**단점**: 중간에 동일 파일을 다른 커밋에서 수정했으면 충돌 가능.

**중요**: 이 복구 문서가 유효하려면 각 작업 커밋 해시를 아래 "작업 로그" 섹션에 기록해둬야 합니다.

---

### 전략 2 (fallback): 수동/스크립트 복구

git revert가 실패하거나, content-mode 도중 본문 수정이 있었을 경우.

#### 2-A. `hub posts` 배너 블록 재삽입 스크립트

**`ha-mid-cta` 블록** (본문 중간, 보통 3~4번째 h2 바로 위에 위치):

```jsx
<div className="ha-mid-cta">
  <a href="/ko" className="ha-mid-cta-link">K-스타일 프로필 만들기</a>
</div>
```

EN 버전:
```jsx
<div className="ha-mid-cta">
  <a href="/en" className="ha-mid-cta-link">Create your K-style profile</a>
</div>
```

**`ha-bottom-banner` 블록** (파일 마지막, `ha-related-panel` 바로 다음):

```jsx
<div className="ha-bottom-banner">
  <a href="/ko" aria-label="K-스타일 프로필 만들기">
    <img src="/visuals/blog/blog-bottom-banner-kr.webp" alt="K-스타일 프로필 만들기" loading="lazy" />
  </a>
</div>
```

EN 버전:
```jsx
<div className="ha-bottom-banner">
  <a href="/en" aria-label="Create your K-style profile">
    <img src="/visuals/blog/blog-bottom-banner-en.webp" alt="Create your K-style profile" loading="lazy" />
  </a>
</div>
```

**스크립트 위치 힌트**:
- `ha-bottom-banner`는 파일 마지막 `</div>` 뒤에 추가 (= `ha-related-panel` 닫는 div 다음 빈 줄 넣고 삽입)
- `ha-mid-cta`는 **자동 복원 불가** — 원래 위치는 글마다 달랐음. 수동 복원 필요.

> **현실적 권장**: `ha-mid-cta`는 수동 복원이 까다로우니, 전략 1(git revert)을 최우선으로 사용. 전략 2는 배너 이미지만 복원하고 mid-cta는 포기/재설계하는 쪽도 고려.

#### 2-B. CSS 상태

`app/globals.css`에는 `.ha-mid-cta`, `.ha-bottom-banner` 클래스가 **그대로 남아있음**. 승인 후 JSX만 복원하면 스타일 즉시 적용됨 (별도 CSS 복원 불필요).

#### 2-C. `components/hub/HubFeed.tsx` 네비 복원

승인 후 `hf-nav-pill` 안을 다음처럼 되돌리기:

```tsx
<Link className="hf-nav-item" href={`/${lang}/create`}>
  <span className="hf-nav-icon" aria-hidden>
    ✦
  </span>
  <span className="hf-nav-label">AI Studio</span>
</Link>
```

Map / Me 버튼은 **onClick 없던 죽은 UX**였으므로 복원하지 않는 것을 권장.

#### 2-E. 홈페이지 섹션 복원 (작업 전)

작업 착수 시 기존 `app/[lang]/page.tsx`의 원본을 이 문서에 전문 스냅샷으로 저장할 것. 지금은 미작업이므로 생략.

#### 2-F. SiteHeader Create 링크 복원 (작업 전)

작업 착수 시 제거 전 코드 스냅샷을 여기에 기록.

---

## 3. 승인 후 체크리스트

- [ ] `git revert` 성공 → 충돌 없음 확인
- [ ] 로컬 `next dev`에서 `/ko/hub/{slug}` 한 건 열어 mid-cta, bottom-banner 정상 표시 확인
- [ ] 홈 `/ko`, `/en`에서 Hero/HowItWorks/Gallery/Pricing 섹션 재출현 확인
- [ ] `SiteHeader`에 `Create` 링크 재노출 확인
- [ ] `/create` 라우트 `robots.ts` 상태 확인 (계속 `Disallow`일 수 있음 — 원래도 막혀있었음)
- [ ] 사이트맵(`/sitemap.xml`) 정상 확인
- [ ] 빌드 성공 → Vercel 배포 → 실 URL 최종 확인

---

## 4. 작업 로그 (커밋 해시 기록)

> 각 content-mode 커밋을 여기 기록해두세요. 복구 시 이 목록을 역순으로 `git revert`.

| 날짜 | 작업 | 커밋 해시 | 비고 |
|---|---|---|---|
| 2026-04-11 | 작업 A+B: hub posts 80개에서 `ha-mid-cta`+`ha-bottom-banner` 제거 | _(미커밋)_ | scripts/remove_banners.py 사용 |
| 2026-04-11 | 작업 C: HubFeed nav에서 `/create`/Map/Me 제거, Home 탭 추가 | _(미커밋)_ | |
| 2026-04-11 | 작업 D: HubFeed 검색 placeholder "300+" 허위 문구 제거 | _(미커밋)_ | 선택 복구 |
| 미정 | 작업 E: 홈페이지 섹션 제거 | | |
| 미정 | 작업 F: SiteHeader Create 링크 제거 | | |

---

## 5. 복구 후 재발 방지 주의점

- 승인 후 바로 배너/섹션 전부 복원하지 말고 **단계적으로** 복원할 것 (2차 거절 방지)
- AdSense "site behavior" 변화를 급격히 주지 말 것 — 복원 주에 10~15개 글 정도는 content-only 상태 유지도 고려
- `app/[lang]/create` 경로는 `robots.ts`에서 계속 `Disallow` 유지 — AdSense가 상품 페이지를 색인할 필요는 없음

---

**이 문서는 복구 작업 완료 후 `md-doc/archive/`로 이동 또는 삭제하세요.**
