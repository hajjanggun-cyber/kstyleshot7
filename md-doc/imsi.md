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
