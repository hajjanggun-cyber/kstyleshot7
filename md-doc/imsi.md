# 내일 할 일 - AdSense 심사 준비 다음 순서

작성일: 2026-06-01 KST  
작업 예정일: 2026-06-02 KST

## 내일 우선순위

내일 Codex에게 바로 이어서 시킬 때 사용할 문구:

```text
imsi.md 최상단의 "내일 할 일 - AdSense 심사 준비 다음 순서" 기준으로 이어서 작업해줘.
```

1. 현재 변경사항을 배포한다.
   - 대표 12개 글만 노출되는 구조가 실제 사이트에 반영되어야 한다.
   - 배포 전에는 로컬에서 정리한 sitemap/redirect 구조가 Google에 적용되지 않는다.

2. 배포 후 공개 URL을 확인한다.
   - `https://www.kstyleshot.com/sitemap.xml`
   - `https://www.kstyleshot.com/ads.txt`
   - `https://www.kstyleshot.com/ko/hub`
   - `https://www.kstyleshot.com/en/hub`
   - 숨긴 글 URL이 직접 접근 시 허브 목록으로 redirect되는지 확인한다.

3. Search Console을 정리한다.
   - 새 sitemap을 다시 제출하거나 재읽기 요청한다.
   - 이미 색인된 숨김 글 URL은 URL 제거 요청 또는 재크롤링 상태를 확인한다.
   - 대표 12개 글은 색인 요청 대상으로 둔다.

4. 대표 12개 글 품질을 추가 보강한다.
   - 반복 어미 정리는 끝났지만, AdSense 관점에서는 직접 경험처럼 보이는 구체 정보가 더 필요하다.
   - 우선 보강 대상은 `gyeongbokgung-hub`, `gyeongbokgung-photo-guide`, `han-river-park-hub`, `seongsu-cafe-photo-spots` 순서로 본다.
   - 보강 방향은 시간대, 동선, 촬영 위치, 혼잡 회피, 실제 판단 기준 같은 검증 가능한 정보다.

5. 애드센스 재심사 전 최종 체크를 한다.
   - About, Contact, Privacy, Terms, Refund, Cookie 페이지 접근 여부 확인.
   - AdSense script와 `ads.txt` 정상 여부 확인.
   - sitemap에 대표 글만 남았는지 확인.
   - 대표 글에서 숨긴 글로 가는 링크가 없는지 확인.
   - 모바일 화면에서 주요 페이지가 깨지지 않는지 확인.

## 메모

사이트맵과 `ads.txt`는 별도로 수동 업로드하는 대상이 아니다. 코드 변경을 배포하면 sitemap은 새 구조로 생성된다. `ads.txt`는 publisher ID가 바뀐 것이 아니면 그대로 두고, 배포 후 정상 응답만 확인하면 된다.

## 2026-06-02 진행 기록

- `origin/main`과 로컬 HEAD가 `2af82d1 Prepare AdSense review content cleanup`로 일치했고, 기존 배포분은 `git push origin main` 기준 `Everything up-to-date`였다.
- 운영 URL 확인 결과 `sitemap.xml`, `ads.txt`, `/ko/hub`, `/en/hub`가 200 응답했고, 숨김 예시 글 `/ko/hub/best-blush-placement-by-face-shape`, `/en/hub/best-blush-placement-by-face-shape`는 각각 `/ko/hub`, `/en/hub`로 308 redirect됐다.
- `ads.txt` 응답은 `google.com, pub-2524681039359256, DIRECT, f08c47fec0942fa0`로 확인했다.
- Search Console은 계정 UI 작업이 필요하므로 직접 처리하지 못했다. 다음 수동 작업은 sitemap 재제출/재읽기 요청, 숨김 URL 제거 또는 재크롤링 상태 확인, 대표 12개 URL 색인 요청이다.
- 대표 12개 KO/EN 글 원문에서 심사 대상 밖 slug로 가는 내부 링크와 related card 원문 URL을 제거했다. 렌더러에서 비활성화되던 링크도 원문 기준으로 정리했다.
- 우선 보강 대상 `gyeongbokgung-hub`, `gyeongbokgung-photo-guide`, `han-river-park-hub`, `seongsu-cafe-photo-spots`의 KO/EN 본문에 공식 공지 확인, 출구/반납 시간, 한강 복귀 동선, 성수동 혼잡 시 대체 각도 같은 검증 가능한 판단 기준을 추가했다.
- 숨김 slug 원문 링크 스캔과 주요 반복 표현 스캔은 매치 없음으로 확인했다.
- `npm.cmd run build` 성공. 남은 경고는 기존과 동일한 Next.js `middleware` 파일 convention deprecated 경고뿐이다.

-----

# AdSense 대표 12개 글 정리 2차 완료 기록

작성일: 2026-06-01 KST

## 이번 작업 결론

애드센스 심사 통과 목적이라면 전체 글을 한꺼번에 노출하는 것보다, 서울 촬영/산책 가이드 중심의 대표 글 12개만 심사 URL로 남기는 전략이 더 유리하다고 판단한다. 이유는 현재 사이트의 전체 글 수가 많고, 뷰티/패션 글은 검색 수요는 있지만 재편집 전에는 일반론과 반복 어미 신호가 강해서 심사 대표 글로 쓰기 불리하기 때문이다.

이번 작업에서는 삭제가 아니라 심사 노출 축소 방식으로 처리했다. 즉, 숨겨진 글들의 MDX 파일은 `content/hub/ko`, `content/hub/en` 안에 그대로 남아 있다. 다만 `data/adsenseReview.ts`의 `ADSENSE_REVIEW_HUB_SLUGS`에 포함되지 않은 글은 sitemap, 허브 목록, 본문 내부 링크, related/next card 노출에서 빠지고, 직접 `/ko/hub/[slug]` 또는 `/en/hub/[slug]`로 접근해도 허브 목록으로 redirect되는 구조다.

## 심사에 남긴 12개 글

1. `gyeongbokgung-hub`
2. `gyeongbokgung-photo-guide`
3. `gyeongbokgung-light-timing-guide`
4. `bukchon-hanok-photo-spots`
5. `bukchon-hanbok-photo-route`
6. `ssamziegil-insadong-photo-guide`
7. `han-river-park-hub`
8. `yeouido-han-river-picnic-guide`
9. `banpo-han-river-night-view-guide`
10. `seokchon-lake-photo-spot-guide`
11. `euljiro-retro-photo-spot-guide`
12. `seongsu-cafe-photo-spots`

## 2차 본문 정리 결과

대표 12개 글의 KO/EN 본문에서 주요 반복 신호를 재검사했다. 검사 항목은 KO `편이`, `결국`, `경우가 많`, `좋을 때가 많`, `하기 쉽`, `에 가깝`, EN `usually`, `often`, `overall`이다.

최종 검사 결과, 대표 12개 글의 KO/EN 모두 위 반복 신호가 0회로 정리됐다. 영어 `often`은 `softens` 같은 단어 내부 오탐이 있어 최종 검사는 단어 경계 기준(`\boften\b`)으로 확인했다.

이번에 추가로 정리한 주요 파일:

- `content/hub/ko/seongsu-cafe-photo-spots.mdx`
- `content/hub/ko/euljiro-retro-photo-spot-guide.mdx`
- `content/hub/ko/gyeongbokgung-light-timing-guide.mdx`
- `content/hub/ko/banpo-han-river-night-view-guide.mdx`
- `content/hub/ko/yeouido-han-river-picnic-guide.mdx`
- `content/hub/en/seongsu-cafe-photo-spots.mdx`
- `content/hub/en/han-river-park-hub.mdx`
- `content/hub/en/yeouido-han-river-picnic-guide.mdx`
- `content/hub/en/banpo-han-river-night-view-guide.mdx`
- `content/hub/en/seokchon-lake-photo-spot-guide.mdx`
- `content/hub/en/euljiro-retro-photo-spot-guide.mdx`
- `content/hub/en/ssamziegil-insadong-photo-guide.mdx`
- `content/hub/en/gyeongbokgung-light-timing-guide.mdx`
- `content/hub/en/gyeongbokgung-hub.mdx`
- `content/hub/en/bukchon-hanok-photo-spots.mdx`
- `content/hub/en/bukchon-hanbok-photo-route.mdx`

## 검증

- 반복 표현 카운트: 대표 12개 글 KO/EN 기준 주요 항목 0회.
- `npm.cmd run build`: 성공.
- 남은 빌드 경고: 기존과 동일한 Next.js `middleware` 파일 convention deprecated 경고만 있음.

## 숨겨진 글 상태

숨겨진 글은 삭제된 것이 아니다. 현재는 “파일 보관 + 공개 경로 차단” 상태다. 이후 애드센스 승인 후 재노출하려면 해당 slug를 `data/adsenseReview.ts`에 다시 추가하고, 필요한 내부 링크를 복구한 뒤 빌드/배포하면 된다.

-----

# AdSense 12개 글 본문 정리 1차 진행 기록

작성일: 2026-06-01 KST

## 이번 진행 내용

12개 심사용 글 중 반복 표현 신호가 가장 강한 글부터 1차 정리했다.

수정한 글:

- `content/hub/ko/gyeongbokgung-hub.mdx`
- `content/hub/ko/gyeongbokgung-photo-guide.mdx`
- `content/hub/en/gyeongbokgung-photo-guide.mdx`
- `content/hub/en/bukchon-hanok-photo-spots.mdx`
- `content/hub/en/bukchon-hanbok-photo-route.mdx`

## 개선 결과

- `gyeongbokgung-hub` KO: `편이` 13회 -> 0회, `결국` 1회 -> 0회
- `gyeongbokgung-photo-guide` KO: `결국` 4회 -> 0회, `경우가 많` 계열 2회 -> 0회
- `gyeongbokgung-photo-guide` EN: `usually` 9회 -> 0회, `often` 2회 -> 0회
- `bukchon-hanok-photo-spots` EN: `usually` 16회 -> 0회, `often` 5회 -> 2회
- `bukchon-hanbok-photo-route` EN: `usually` 19회 -> 0회, `often` 7회 -> 3회

## 현재 남은 반복 신호

KO 쪽은 12개 심사용 글 전체에서 `편이`와 `결국`이 0회가 됐다. 다만 일부 글에는 `좋습니다`, `중요합니다`, `경우가 많`, `가깝습니다`, `하기 쉽`, `일 수 있습니다` 계열이 남아 있다.

우선 남은 KO 정리 대상:

- `yeouido-han-river-picnic-guide`: 일반론 어미 4회
- `banpo-han-river-night-view-guide`: 일반론 어미 3회
- `gyeongbokgung-light-timing-guide`: 일반론 어미 3회
- `euljiro-retro-photo-spot-guide`: 일반론 어미 3회
- `seongsu-cafe-photo-spots`: 일반론 어미 2회

EN 쪽은 `usually`가 줄었지만 다른 장소 글에 `often/usually` 반복이 아직 있다.

우선 남은 EN 정리 대상:

- `seongsu-cafe-photo-spots`: `often` 6회, `usually` 7회
- `han-river-park-hub`: `often` 9회, `usually` 6회, `overall` 1회
- `gyeongbokgung-light-timing-guide`: `often` 6회, `usually` 6회
- `euljiro-retro-photo-spot-guide`: `often` 7회, `usually` 5회

## 검증

- `npm.cmd run build` 성공.
- 빌드 경고는 기존과 동일하게 Next.js `middleware` convention deprecated 경고만 있음.

## 다음 순서

1. 남은 KO 일반론 어미를 줄인다.
2. EN `seongsu-cafe-photo-spots`, `han-river-park-hub`, `gyeongbokgung-light-timing-guide`, `euljiro-retro-photo-spot-guide`의 `often/usually` 반복을 낮춘다.
3. 12개 글 전체를 다시 통계 점검한다.
4. 최종 빌드 후 운영 배포와 실제 URL 확인으로 넘어간다.

-----

# AdSense 12개 글 노출 축소 적용 기록

작성일: 2026-06-01 KST

## 적용 완료

AdSense 재심사용 공개 허브 글을 43개 slug에서 12개 slug로 줄였다. 기준 파일은 `data/adsenseReview.ts`이며, 이 파일의 `ADSENSE_REVIEW_HUB_SLUGS`만 sitemap, hub 목록, 개별 글 허용 여부의 기준으로 사용된다.

현재 남긴 12개 slug:

1. `gyeongbokgung-hub`
2. `gyeongbokgung-photo-guide`
3. `gyeongbokgung-light-timing-guide`
4. `bukchon-hanok-photo-spots`
5. `bukchon-hanbok-photo-route`
6. `ssamziegil-insadong-photo-guide`
7. `han-river-park-hub`
8. `yeouido-han-river-picnic-guide`
9. `banpo-han-river-night-view-guide`
10. `seokchon-lake-photo-spot-guide`
11. `euljiro-retro-photo-spot-guide`
12. `seongsu-cafe-photo-spots`

## 숨겨진 글들은 어떻게 되는가

글 파일은 삭제하지 않았다. `content/hub/ko`, `content/hub/en` 안의 기존 MDX는 그대로 보관된다. 다만 `ADSENSE_REVIEW_HUB_SLUGS`에 없는 글은 다음 방식으로 심사 노출에서 빠진다.

- sitemap: `app/sitemap.ts`가 `isAdsenseReviewHubSlug(slug)`를 통과한 12개 slug만 넣는다.
- hub 목록: `app/[lang]/hub/page.tsx`가 12개 slug만 카드와 crawler용 링크로 노출한다.
- 개별 글 직접 접근: `app/[lang]/hub/[slug]/page.tsx`에서 12개 외 slug는 `permanentRedirect(/${lang}/hub)` 처리된다.
- 홈 하단 허브 미리보기: `components/landing/HubPreview.tsx`도 review slug만 노출하도록 수정했다.
- 본문/related 내부 링크: `components/hub/HubMdxPage.tsx`에서 12개 외 `/[lang]/hub/[slug]` 내부 링크는 실제 링크가 아니라 텍스트/카드 형태로만 렌더링한다. 즉 MDX 원문에 남아 있어도 렌더된 페이지에서는 숨긴 글로 이동하는 링크가 되지 않는다.
- `nextSlug`: 숨긴 slug를 가리키는 next card는 렌더링하지 않는다.

현재 구조상 숨겨진 글은 "파일은 남아 있지만 공개 탐색 경로와 sitemap에서 제외되고, 직접 URL은 허브 목록으로 redirect되는 상태"다. 완전 삭제가 아니므로 승인 후 다시 `ADSENSE_REVIEW_HUB_SLUGS`에 넣고 내부 링크를 복구하면 재노출할 수 있다.

## 실제 숨김 규모

- KO MDX 113개 중 12개 노출, 101개 숨김
- EN MDX 113개 중 12개 노출, 101개 숨김
- 허브 글 URL 기준 총 24개 노출, 202개 숨김

legacy `hubArticles` 글도 12개 review slug에 포함되지 않기 때문에 현재 개별 URL 접근 시 허브 목록으로 redirect된다.

## 수정한 파일

- `data/adsenseReview.ts`: review slug를 12개로 축소
- `components/hub/HubMdxPage.tsx`: 숨긴 hub slug 내부 링크 비활성화, 숨긴 `nextSlug` 미노출
- `components/landing/HubPreview.tsx`: 홈 미리보기에서 review slug만 노출

## 검증

- 12개 slug가 KO/EN 양쪽 MDX 파일로 모두 존재함을 확인했다.
- 선택한 12개 글의 KO/EN 이미지 경로 누락은 발견되지 않았다.
- `npm.cmd run build` 성공.
- 빌드 결과 경고: Next.js에서 `middleware` 파일 convention이 deprecated라고 알렸지만, 이번 AdSense 숨김 처리와 직접 관련된 빌드 실패는 아니다.

## 다음 작업

1. 남긴 12개 글의 반복 표현 정리: 특히 `gyeongbokgung-hub`, `gyeongbokgung-photo-guide`.
2. 12개 글의 본문 문단 길이 리듬 재편집.
3. 각 글의 related panel 문구가 숨김 글 제목을 언급하지 않도록 필요 시 원문 정리.
4. 배포 후 실제 `/sitemap.xml`, `/ko/hub`, 숨긴 URL redirect 동작을 운영 도메인에서 확인.

-----

# AdSense 심사 노출 글 수 축소 전략

작성일: 2026-06-01 KST

## 결론

AdSense 통과만 놓고 보면 전체 글을 모두 노출하는 것보다 일부 고품질 글만 남기는 쪽이 더 유리하다. 현재 `content/hub/ko` 113개, `content/hub/en` 113개가 있고, 이미 `ADSENSE_REVIEW_HUB_SLUGS`로 43개 slug를 심사 노출 대상으로 줄여두었지만 43개도 아직 많다. 43개 안에도 반복 표현, 균일한 문단 구조, 일반론적 뷰티 글, 내부 링크 확산 문제가 섞여 있다.

심사 기간에는 "큰 사이트"보다 "작지만 정리된 사이트"가 낫다. Google 공식 기준은 글 수가 아니라 unique/original/relevant content, helpful content, low-value/scaled content 회피다. 따라서 1차 재심사에서는 10~15개 slug만 index/노출하고 나머지는 noindex 또는 404/redirect + 내부 링크 제거로 빼는 전략을 권장한다.

## 권장 수량

1차 재심사 권장 노출량:

- KO 12개 + EN 12개 = 총 24개 허브 글 URL
- 여기에 홈, 소개, 문의, 개인정보처리방침, 이용약관, 환불정책, 쿠키정책 같은 필수 페이지를 함께 유지

12개보다 적으면 사이트가 너무 빈약해 보일 수 있고, 20개를 넘기면 아직 다듬지 않은 글의 패턴 문제가 다시 섞일 가능성이 커진다. 현재 상태에서는 12개 slug가 가장 현실적인 균형이다.

## 1차 심사용으로 남길 추천 slug 12개

아래는 현재 파일 기준으로 비교적 구체적인 장소성, 현장 동선, 이미지 존재 여부, 글 길이, 내부 클러스터 구성까지 고려한 후보이다.

1. `gyeongbokgung-hub`
2. `gyeongbokgung-photo-guide`
3. `gyeongbokgung-light-timing-guide`
4. `bukchon-hanok-photo-spots`
5. `bukchon-hanbok-photo-route`
6. `ssamziegil-insadong-photo-guide`
7. `han-river-park-hub`
8. `yeouido-han-river-picnic-guide`
9. `banpo-han-river-night-view-guide`
10. `seokchon-lake-photo-spot-guide`
11. `euljiro-retro-photo-spot-guide`
12. `seongsu-cafe-photo-spots`

## 왜 이 조합인가

- 여행/장소/사진 글은 뷰티·패션 일반론보다 직접 경험 신호를 넣기 쉽다.
- 경복궁, 북촌, 인사동, 한강, 석촌호수, 을지로, 성수로 묶이면 "서울 촬영/산책 가이드"라는 사이트의 임시 심사 주제가 선명해진다.
- 위 후보들은 KO 기준 이미지 경로가 모두 존재한다.
- 뷰티 글은 검색 수요는 크지만 `좋습니다`, `중요합니다`, `경우가 많`, `가깝습니다` 같은 일반론 어미가 많고, 실제 제품 테스트/성분 검증/사용 경험이 부족하면 low value로 보이기 쉽다. 재편집 전에는 심사 노출에서 빼는 편이 안전하다.
- 패션 글도 현재는 스타일 일반론이 많아 "직접 촬영/직접 착용/구매처/계절별 실패 조건"이 들어가기 전까지는 심사 대표 글로 쓰기 애매하다.

## 단, 이 12개도 그대로 두면 안 되는 부분

남기는 글도 최소 수정이 필요하다.

- `gyeongbokgung-hub`: `편이` 13회, `결국` 1회가 있어 문장 정리가 필요하다.
- `gyeongbokgung-photo-guide`: 글은 길고 구체성이 높지만 `결국` 4회가 있어 마무리 어투를 정리해야 한다.
- `han-river-park-hub`: 내용은 좋지만 허브 글이라 관련 하위 글 링크가 심사 제외 글로 새지 않게 정리해야 한다.
- `seongsu-cafe-photo-spots`: 과거 메모에 이미지 404 이슈가 있었으나 현재 KO 본문 이미지 경로 5개는 파일 존재를 확인했다. EN도 함께 확인해야 한다.
- 모든 12개 글의 related panel과 본문 내부 링크는 위 12개 slug 안에서만 순환하도록 제한해야 한다.

## 제외할 글 처리 방식

삭제하지 않는다. 심사 기간 동안만 노출을 줄인다.

- sitemap/hub 목록: 위 12개만 노출
- related panel: 위 12개 외 slug 제거
- 직접 URL: 심사 제외 MDX는 `noindex` 또는 404/redirect 중 하나로 처리
- legacy `hubArticles`: 반드시 404 또는 품질 보강된 MDX로 redirect

내 판단은 `noindex`보다 404/redirect가 심사에는 더 명확하다. 다만 나중에 살릴 글이 많다면 우선 `noindex + 내부 링크 제거`로 시작하고, 매우 얇거나 legacy인 글만 404/redirect 처리하는 절충안도 가능하다.

-----

# 유료 합성 아이템 위치 확인

작성일: 2026-06-01 KST

## 결론

유료로 합성하는 아이템을 별도로 숨긴 흔적은 없다. 합성에 쓰는 의상/배경 템플릿은 프로젝트 안에 그대로 있고, 화면에서도 `/[lang]/create/outfit` 단계에서 `data/outfits.ts`, `data/referenceTemplates.ts`를 통해 읽는다.

## 실제 위치

- 의상 합성 아이템 데이터: `data/outfits.ts`
- 의상 이미지 파일: `public/templates/outfit/`
- 배경 합성 아이템 데이터: `data/referenceTemplates.ts`
- 배경 이미지 파일: `public/templates/background/`
- 최종 합성 API: `app/api/final/render/route.ts`
- 최종 합성 화면: `components/create/OutfitFlow.tsx`

## 결제/유료 흐름 위치

- Polar 결제 생성 API: `app/api/checkout/create/route.ts`
- Polar 결제 유틸: `lib/polar.ts`
- 결제 웹훅: `app/api/webhooks/polar/route.ts`
- 결제 상품 ID 설정 위치: `.env.local`의 `POLAR_PRODUCT_ID`

`.env.local`에는 `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCT_ID`, `REPLICATE_API_TOKEN` 값이 존재한다. 보안 값이므로 문서에는 실제 값은 적지 않는다.

## 현재 헷갈릴 수 있는 지점

`app/[lang]/create/upload/page.tsx`에서 `allowDemoFlow = true`로 되어 있다. 그래서 현재 업로드 단계는 결제 완료 여부와 무관하게 데모 세션을 만들 수 있다. 즉 유료 아이템이 숨겨진 것이 아니라, 결제 게이트가 TODO 상태로 우회되어 있다.

또 `lib/env-readiness.ts`에는 `outfit`, `cutout` 단계가 `blocked: true`로 남아 있고 "Commercially permitted outfit provider is not selected yet."라고 표시된다. 하지만 실제 최종 합성 API `app/api/final/render/route.ts`는 `Replicate`의 `startNanaBananaJob`을 통해 의상/배경 템플릿을 사용하고 있다. 이 문서/상태 표시와 실제 구현이 서로 완전히 맞지 않는다.

정리하면 아이템은 숨겨진 것이 아니라 아래처럼 공개 위치에 있다.

- 의상: `public/templates/outfit/*.jpeg`
- 배경: `public/templates/background/*.jpeg`
- 목록 정의: `data/outfits.ts`, `data/referenceTemplates.ts`

-----

# Codex 의견 - Gemini 애드센스 저가치 콘텐츠 분석 재검토

작성일: 2026-06-01 KST

## 결론

Gemini의 큰 방향은 맞다. 현재 콘텐츠에는 Google이 공식 문서에서 경계하는 `대량 생성`, `독창적 추가 가치 부족`, `검색 유입 목적의 콘텐츠 확장`으로 보일 수 있는 신호가 실제로 있다. 특히 KO/EN 합산 226개 MDX가 비슷한 frontmatter, 비슷한 H2 흐름, 비슷한 관련 글 패널, 비슷한 문장 호흡으로 쌓여 있어 신생 사이트의 AdSense 심사에서는 불리하게 읽힐 가능성이 높다.

다만 Gemini 답변에는 과장과 근거 없는 단정도 섞여 있다. Google 공식 문서에는 `편이`, `결국`, `3문장 문단` 같은 특정 한국어 표현을 직접 스팸 신호로 본다는 기준이 없다. 그러므로 문제를 "특정 단어 때문에 거절"로 보면 안 된다. 더 정확한 진단은 "반복 표현과 균일한 문단 구조가 사이트 전체의 독창성, 편집 흔적, 직접 경험 신호 부족을 더 선명하게 드러낸다"이다.

## 공식 기준과 대조

- AdSense 공식 도움말은 사이트가 `unique content`, 방문자와 관련 있는 콘텐츠, 좋은 사용자 경험을 가져야 한다고 설명한다. 또한 전문 지식, 개선 아이디어, 리뷰, 개인적 생각처럼 사이트 자체의 원본 기여가 필요하다고 본다.
  - https://support.google.com/adsense/answer/7299563
- Google Search helpful content 문서는 독창적 정보, 리포팅, 연구, 분석, 뻔한 수준을 넘는 통찰, 직접 경험과 깊이를 자가 점검하라고 안내한다.
  - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies의 scaled content abuse는 "사용자에게 가치를 더하지 않는 많은 비원본 페이지"를 문제로 본다. AI 사용 자체가 문제가 아니라, 많은 페이지가 사용자를 돕지 않고 검색 순위 조작 목적으로 보이는 경우가 문제다.
  - https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse

## 로컬 전수 확인 결과

이번 확인은 `content/hub/ko` 113개와 `content/hub/en` 113개, 총 226개 MDX를 기준으로 했다. Gemini가 말한 113개 전수 조사는 KO 폴더 기준으로는 맞지만, 사이트 전체라고 부르려면 EN까지 포함해야 한다.

KO 113개 기준 반복 표현:

- `편이`: 472회, 47개 파일
- `결국`: 91회, 35개 파일
- `일 수 있습니다`: 218회, 61개 파일
- `경우가 많`: 154회, 64개 파일
- `가깝습니다`: 136회, 53개 파일
- `좋습니다`: 274회, 65개 파일
- `중요합니다`: 193회, 61개 파일

이 수치는 Gemini의 "편이 390회 이상", "결국 60회 이상"보다 더 높게 나왔다. 따라서 반복 어미 문제는 실제다. 반면 "113개 모든 글에서 무차별적으로 등장"이라는 식의 표현은 부정확하다. 예를 들어 `편이`는 47개 파일에서 잡혔고, 전체 파일 모두에 있는 것은 아니다.

H2 구조:

- KO H2 총 800개 중 질문형으로 볼 수 있는 H2는 252개다. `편이`가 들어간 H2는 12개, `결국`이 들어간 H2는 5개다.
- EN H2 총 765개 중 질문형으로 볼 수 있는 H2는 471개다.

즉 KO의 H2 의문형 남발은 "전체 지배"까지는 아니지만, EN에서는 질문형 템플릿 의존도가 꽤 높다. H2 자체보다 더 큰 문제는 H2 아래 문단 호흡이 반복된다는 점이다.

문단당 문장 수 분포:

- KO 본문 문단 3,209개 중 2문장 24.2%, 3문장 53.6%, 4문장 15.2%다. 2~4문장 문단이 93.0%를 차지하고, 5문장 이상 문단은 1.5% 수준이다.
- EN 본문 문단 2,640개 중 2문장 23.1%, 3문장 37.3%, 4문장 25.8%다. 2~4문장 문단이 86.2%를 차지한다.

이 부분은 Gemini 지적이 가장 타당하다. 모든 글이 똑같은 구조는 아니지만, 사이트 전체 문단 리듬이 지나치게 균일하다. Google이 특정 문장 수를 벌점 처리한다고 단정할 수는 없으나, 사용자가 보기에도 편집자가 손으로 다듬은 매체라기보다 일정한 생성 규칙으로 생산된 허브처럼 보인다.

## Gemini 분석에서 맞는 부분

- 반복 표현 문제는 실제다. `편이`, `경우가 많`, `가깝습니다`, `좋습니다`, `중요합니다`가 콘텐츠 전반에 넓게 퍼져 있다.
- 문단 길이와 H2 이후 전개 방식이 너무 균일하다. 특히 KO는 3문장 문단 비율이 과도하게 높다.
- 공식 Google 기준으로도 독창적 정보, 직접 경험, 현장성, 리뷰성, 작성 과정의 신뢰 신호가 부족한 글은 AdSense 심사에서 불리하다.
- 공개 URL을 줄이고 고품질 핵심 글 위주로 심사 통로를 좁히는 전략은 현실적이다. 이미 이 프로젝트의 기존 메모도 review 대상 외 MDX URL 공개, legacy 얇은 글, 내부 링크 노출 문제를 P0로 보고 있다.

## Gemini 분석에서 조심해야 할 부분

- "Google 봇이 `편이` 어미 밀도를 탐지한다", "`결국`을 AI 결론 단어로 본다", "3문장 문단을 직접 스팸 신호로 본다"는 말은 공식 근거가 없다. 이것은 관찰 기반 추정으로만 다뤄야 한다.
- 단정형 어투를 늘린다고 품질이 올라가는 것은 아니다. 근거 없는 단정은 오히려 신뢰를 깎는다. 뷰티/스킨케어는 개인 피부 반응 차이가 크기 때문에 무리한 단정형은 위험하다.
- "지성 민감성 피부 100명 테스트"처럼 실제 근거 없는 수치를 넣으면 더 큰 문제가 된다. 직접 테스트하지 않은 데이터, 현장 확인하지 않은 키오스크 오류 같은 하이퍼 로컬 정보는 만들면 안 된다.
- 포스트를 무조건 10~15개만 남기는 것이 정답은 아니다. 다만 심사 기간에는 실제로 품질 검증된 글과 필수 페이지, 명확한 네비게이션만 보이게 하는 편이 더 안전하다.

## 내 판단

현재 거절 원인은 단일 문제가 아니라 세 가지가 겹친 결과로 보는 것이 맞다.

1. 콘텐츠 품질 신호: 글 수에 비해 직접 경험, 독창적 관찰, 구체적 검증 정보가 부족하다.
2. 생성 패턴 신호: 문단 길이, H2 전개, 관련 글 패널, 표현 어미가 사이트 전체에서 반복된다.
3. 공개 범위 신호: 심사 대상이 아닌 MDX와 legacy 얇은 URL까지 200 OK로 열려 있으면, 좋은 글을 일부 고쳐도 Google이 낮은 품질 URL을 계속 발견할 수 있다.

우선순위는 "표현 몇 개 치환"이 아니라 공개 품질 통제다. AdSense 재심사 전에는 대표 글 10~20개를 고르고, 그 글들만 실제 방문자에게 유용한 수준으로 다시 편집해야 한다. 나머지 글은 noindex, 404, redirect, 내부 링크 제거 중 하나로 심사 노출을 줄여야 한다. 그 다음 선택된 글에서 문단 호흡을 깨고, 실제 확인 가능한 날짜/장소/가격/동선/제품 기준/실패 조건을 넣는 순서가 맞다.

-----------

# AdSense Review Fix Priority

Updated At: 2026-05-16 KST

## Goal

KStyleShot AdSense 재심사 전에 "가치가 별로 없는 콘텐츠"로 보일 수 있는 공개 URL, 얇은 글, 이미지 404, 내부 링크 노출, AdSense 코드 누락 문제를 우선순위대로 정리한다.

새 글을 더 추가하기 전에 아래 항목을 먼저 수정한다. 현재 문제는 글 수 부족보다 공개 품질 관리와 심사 대상 URL 정리가 더 크다.

## Current Diagnosis

- 전체 MDX 글은 KO 109개 + EN 109개, 총 218개다.
- AdSense review 대상으로 sitemap/hub에 노출한 slug는 43개, URL 기준 86개다.
- 하지만 review 대상이 아닌 MDX URL 132개도 직접 접속하면 200 OK로 공개된다.
- review 대상 글에서 review 제외 글로 가는 내부 링크가 106개 있다.
- legacy `hubArticles` 글 7개가 아직 200 OK로 공개되고, 본문이 68~158 words 수준으로 매우 얇다.
- review 대상 글 중 이미지 없는 URL이 6개 있다.
- `seongsu-cafe-photo-spots`의 이미지 경로 10개가 실제 파일과 맞지 않아 404가 난다.
- 공개 HTML에서 AdSense script가 확인되지 않았다. `ads.txt`는 정상이다.

## P0 - Review 전에 반드시 먼저 처리

### 1. Legacy hubArticles 공개 차단

문제:
- `data/hubArticles.ts`의 legacy 글 7개가 `/en/hub/[slug]`, `/ko/hub/[slug]`에서 200 OK로 열린다.
- 이 글들은 길이가 매우 짧아 low value content 신호가 강하다.

대상:
- `seoul-nights`
- `stage-skin`
- `cafe-hopping`
- `glass-skin-guide`
- `munja-do-art`
- `retro-pop`
- `gen-z-hallyu`

수정 방향:
- `app/[lang]/hub/[slug]/page.tsx`에서 MDX가 없는 legacy 글 fallback 렌더링을 제거한다.
- 위 legacy URL은 `notFound()` 처리하거나, 품질 보강된 실제 MDX 글로 301 redirect한다.
- AdSense 재심사 전에는 얇은 legacy 페이지가 절대 200으로 열리지 않아야 한다.

### 2. Review 제외 MDX URL 공개 노출 정리

문제:
- sitemap과 hub feed에서는 43개 slug만 review 대상으로 제한했지만, 나머지 66개 slug도 KO/EN URL로 직접 접속하면 200 OK다.
- Google/AdSense는 sitemap만 보지 않고 내부 링크, 과거 색인, 외부 접근 경로로도 URL을 발견할 수 있다.

수정 방향:
- 선택지는 둘 중 하나다.
- A안: review 대상이 아닌 MDX URL은 `noindex` 처리한다.
- B안: review 대상이 아닌 MDX URL은 재심사 기간 동안 404/redirect 처리한다.
- 단순히 sitemap에서 빼는 것만으로는 부족하다.

권장:
- 재심사 전에는 A안보다 B안이 더 명확하다.
- 공개 품질을 확신할 수 없는 글은 200으로 열리지 않게 한다.

### 3. Review 글에서 review 제외 글로 가는 내부 링크 제거

문제:
- review 대상 글에서 review 제외 글로 가는 내부 링크가 106개 있다.
- 이 링크 때문에 심사 대상 글만 정리해도 Google이 얇거나 미정리된 글을 계속 따라갈 수 있다.

수정 방향:
- review 대상 글의 본문 링크와 related panel을 검사한다.
- review 제외 slug로 가는 링크는 제거하거나 review 대상 slug로 교체한다.
- KO 글은 `/ko/hub/...`, EN 글은 `/en/hub/...`만 유지한다.
- dead link와 cross-locale link는 만들지 않는다.

검증 기준:
- review 대상 글에서 review 제외 slug로 향하는 내부 링크 수가 0이어야 한다.

### 4. AdSense script 배포 확인

문제:
- `ads.txt`는 정상이다.
- 하지만 공개 HTML에서 `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` script가 확인되지 않았다.
- 코드상 `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` 또는 `GOOGLE_ADSENSE_CLIENT` 환경변수가 있어야 script가 들어간다.

수정 방향:
- Vercel 환경변수에 AdSense client 값을 설정한다.
- 값 형식은 `ca-pub-2524681039359256` 또는 `pub-2524681039359256`이어야 한다.
- 배포 후 공개 페이지 HTML에서 AdSense script가 보이는지 확인한다.

검증 명령 예시:

```powershell
curl.exe -s -L https://kstyleshot.com/ko/about | Select-String "pagead2.googlesyndication.com"
```

## P1 - Review 대상 콘텐츠 품질 보강

### 5. seongsu-cafe-photo-spots 이미지 404 수정

문제:
- `content/hub/ko/seongsu-cafe-photo-spots.mdx`
- `content/hub/en/seongsu-cafe-photo-spots.mdx`
- 위 두 파일의 이미지 경로가 `/images/hub/seongsu-dong-cafe/...`를 가리키지만 실제 public 폴더에는 해당 디렉터리가 없다.

현재 404 대상:
- `seongsu-dong-cafe-street-walking-view-1`
- `seongsu-dong-industrial-cafe-exterior-2`
- `seongsu-dong-cafe-street-afternoon-light-3`
- `seongsu-dong-alleyway-cafe-view-4`
- `seongsu-dong-lifestyle-photo-spot-5`
- KO/EN 각각 총 10개

수정 방향:
- 실제 존재하는 `public/images/hub/seongsu-dong/...` 이미지로 경로를 교체한다.
- `ogImage`도 실제 존재하는 이미지로 교체한다.
- 배포 후 이미지 URL이 200 OK인지 확인한다.

### 6. Review 대상 중 이미지 없는 글 보강

이미지 없는 review 대상:
- `high-teen-school-look-guide`
- `hongdae-street-fashion-outfit-tips`
- `seoul-street-fashion-trends`
- KO/EN 각각 총 6개 URL

수정 방향:
- 각 글에 실제 존재하는 WebP 이미지를 최소 3~5개 삽입한다.
- 이미지 alt는 장면 설명 중심으로 작성한다.
- 없는 파일 경로를 먼저 넣지 않는다.
- 이미지 파일 준비 후 MDX에 삽입한다.

### 7. KO review 글 중 3,500자 미만 보강

대상:
- `hongdae-aesthetic-cafes-for-photos` - 3,338자
- `seoul-photo-spot-guide` - 3,349자
- `hongdae-street-photo-spots` - 3,415자
- `toner-pad-usage-guide` - 3,452자
- `korean-sheet-mask-guide` - 3,464자

수정 방향:
- 단순 문장 늘리기 금지.
- 각 글에 실제 선택 기준, 실패 사례, 시간대/피부 타입/방문 동선/사용 순서 등 고유 정보를 추가한다.
- 반복 결론 문장과 템플릿형 문단은 줄인다.

## P2 - 신뢰 신호와 구조 개선

### 8. authorName / authorRole / ogImage 정리

문제:
- 전체 MDX 218개에서 `authorName`이 없다.
- 대부분 `ogImage`도 없다.
- schema author도 대부분 비어 있다.

수정 방향:
- review 대상 43개 slug부터 KO/EN frontmatter에 `authorName`, `authorRole`, 필요 시 `ogImage`를 추가한다.
- About 페이지의 편집 기준과 모순되지 않는 작성자 이름을 사용한다.
- 실제 이미지가 있는 글은 첫 이미지 또는 대표 이미지를 `ogImage`로 지정한다.

### 9. About / Contact / Policy 페이지 유지 점검

현재:
- About, Contact, Privacy, Terms, Refund Policy, Cookie Policy 페이지는 존재한다.
- 공개 About 페이지의 한글 렌더링은 정상으로 확인됐다.

수정 방향:
- footer에서 해당 페이지로 접근 가능해야 한다.
- hub route에서 header가 숨겨져도 footer는 유지되는지 확인한다.
- AdSense 재심사 전 주요 신뢰 페이지가 200 OK인지 다시 확인한다.

### 10. 재심사 직전 최종 점검

재심사 요청 전 반드시 확인:

- legacy hubArticles 7개가 더 이상 200 OK로 열리지 않는다.
- review 제외 MDX URL이 200 OK로 대량 공개되지 않는다.
- review 대상 글에서 review 제외 글로 가는 내부 링크가 0개다.
- review 대상 글의 이미지 URL이 모두 200 OK다.
- sitemap에는 review 대상 URL만 들어 있다.
- `/robots.txt`가 sitemap을 가리킨다.
- `/ads.txt`가 정상 응답한다.
- 공개 HTML head에 AdSense script가 들어 있다.
- About, Contact, Privacy, Terms, Refund Policy가 200 OK다.
- 새 글 추가 없이 기존 공개 품질 정리가 먼저 끝났다.

## Execution Order

1. `app/[lang]/hub/[slug]/page.tsx`에서 legacy fallback 제거 또는 redirect 처리.
2. review 제외 MDX URL의 공개 정책 결정 후 `noindex`, 404, redirect 중 하나로 구현.
3. review 대상 글의 내부 링크를 검사해 review 제외 글 링크 제거.
4. `seongsu-cafe-photo-spots` 이미지 경로와 `ogImage` 수정.
5. 이미지 없는 review 대상 3개 slug의 KO/EN 이미지 삽입.
6. KO 3,500자 미만 review 글 5개 보강.
7. review 대상 frontmatter에 author/ogImage 신뢰 신호 추가.
8. Vercel AdSense env 설정 후 배포.
9. 공개 URL 기준으로 HTTP 상태, 이미지, sitemap, ads.txt, AdSense script를 재검증.
10. 위 항목이 모두 통과한 뒤 AdSense 재심사 요청.

## Do Not Do

- 재심사 전 새 글을 대량 추가하지 않는다.
- sitemap에서만 빼고 200 공개 상태를 방치하지 않는다.
- 없는 이미지 경로를 MDX에 먼저 넣지 않는다.
- review 대상 글에서 품질 미확인 글로 내부 링크를 걸지 않는다.
- 글자 수만 채우기 위해 반복 문장을 추가하지 않는다.
- AdSense script 확인 없이 재심사를 요청하지 않는다.
