# KStyleShot AdSense Re-review Audit

Updated At: 2026-05-31 KST

## 결론

현재 `kstyleshot.com`의 공개 상태는 예전보다 훨씬 정리되어 있다. 특히 `ads.txt`, `robots.txt`, `sitemap.xml`, AdSense 계정 메타, AdSense 스크립트, 검토 대상 글 범위 제한은 정상 방향이다.

하지만 이번 거절 문구에는 `가치가 별로 없는 콘텐츠`만 있는 것이 아니라 `사이트 소유권을 확인하세요`가 같이 들어 있다. 이 경우 글을 아무리 늘려도, AdSense가 사이트 소유권이나 코드 삽입을 확정하지 못하면 같은 거절이 반복될 수 있다.

재심사 전 최우선 확인 사항은 두 가지다.

1. AdSense 또는 Search Console에서 `kstyleshot.com` / `www.kstyleshot.com` 소유권이 실제로 확인된 상태인지 확인한다.
2. 현재 검토 대상으로 공개하는 30개 slug만 품질 검토 표면에 남기고, 새 글을 무리하게 추가하지 않는다.

## 공식 Google 기준

이번 판단은 아래 공식 문서를 기준으로 했다.

- AdSense 사이트 준비 기준: https://support.google.com/adsense/answer/7299563
- AdSense 자격 요건: https://support.google.com/adsense/answer/9724
- 광고 게재 준비가 되지 않은 사이트 조치: https://support.google.com/adsense/answer/12176698
- Helpful content 기준: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- 스팸 정책, 대량 생성 콘텐츠 남용: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse
- 생성형 AI 콘텐츠 사용 기준: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content

Google 기준을 요약하면, AdSense는 단순히 글 수만 보지 않는다. 고유하고 유용한 콘텐츠, 쉬운 탐색, 충분한 사용자 경험, 접근 가능한 사이트, 올바른 광고 코드, 소유권 확인, 정책 위반 부재를 함께 본다.

## 거절 문구 해석

### 광고 게재가 준비되지 않은 사이트

이 문구는 단일 원인이 아니다. Google 도움말에서도 준비되지 않은 사이트의 원인으로 광고 코드 누락, 사이트 접근 불가, 고유 콘텐츠 부족, 사용자 경험 부족, 정책 위반을 함께 제시한다.

현재 사이트는 접근성 자체는 정상이다. `https://kstyleshot.com`은 `https://www.kstyleshot.com/`으로 308 리다이렉트되고, 다시 `/ko`로 이동해 200 응답을 받는다.

### 사이트 소유권을 확인하세요

이번 거절에서 가장 중요하다. 라이브 `/ko` HTML에는 아래가 확인된다.

- `meta name="google-adsense-account"` 있음
- AdSense script 있음
- client 값은 `ca-pub-2524681039359256`
- `ads.txt`도 같은 publisher ID로 정상 노출

하지만 라이브 HTML에서 `google-site-verification` 메타는 확인되지 않았다. 코드상 `app/layout.tsx`는 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 또는 `GOOGLE_SITE_VERIFICATION` 환경변수가 있을 때만 Google site verification 메타를 출력한다.

즉, AdSense가 AdSense 코드만으로 소유권을 인정하면 문제가 없지만, Search Console 소유권 확인을 요구하거나 AdSense UI에서 코드 감지가 실패한 상태라면 이 부분이 계속 거절 원인이 될 수 있다. 이 값은 Google이 발급한 토큰이므로 임의로 만들 수 없다.

### 정책 위반이 발견되었습니다

AdSense의 이 문구는 구체적인 페이지를 항상 알려주지 않는다. 현재 코드 기준으로 명백한 성인, 도박, 불법, 저작권 침해 페이지가 보인 것은 아니다.

다만 Google 정책상 위험 신호는 다음과 같다.

- 품질 검토가 끝나지 않은 글이 많이 공개되어 있는 경우
- 같은 형식의 AI성 글이 대량으로 노출되는 경우
- 검색 순위만 노린 얕은 글이 많은 경우
- 사용자에게 도움이 되는 근거, 저자, 이미지, 내부 링크가 부족한 경우

현재는 `ADSENSE_REVIEW_HUB_SLUGS`로 검토 표면을 30개 slug로 제한해 이 위험을 줄여 둔 상태다.

### 가치가 별로 없는 콘텐츠

현재 검토 대상 30개 slug 기준으로는 예전보다 많이 개선되었다.

로컬 점검 결과:

- 검토 대상 slug: 30개
- KO/EN 지역화 페이지: 60개
- 누락된 검토 페이지: 0개
- 최소 토큰 수: 1483
- 최소 본문 문자 수: 4750
- 이미지 없는 검토 페이지: 0개
- 검토 대상 글에서 비검토 slug로 가는 내부 링크: 0개
- 필수 frontmatter 누락: 0개

따라서 지금 남은 가장 큰 리스크는 "글이 너무 짧다"가 아니라 "AdSense가 정확히 어떤 URL과 어떤 소유권 상태를 기준으로 검토했는가"다.

## 라이브 상태 점검 결과

### 정상 확인

- `https://www.kstyleshot.com/ads.txt`: 200 OK
- `ads.txt` 내용: `google.com, pub-2524681039359256, DIRECT, f08c47fec0942fa0`
- `https://www.kstyleshot.com/robots.txt`: 200 OK
- `robots.txt`: `/api/`, `/en/create`, `/ko/create`만 차단
- `https://www.kstyleshot.com/sitemap.xml`: 200 OK
- `https://kstyleshot.com`: `https://www.kstyleshot.com/`으로 308 리다이렉트
- `/ko` HTML: AdSense script와 `google-adsense-account` 메타 확인
- `/ko` HTML: 한글 본문과 메타데이터 정상 출력

### 남은 확인 필요

- 라이브 HTML에 `google-site-verification` 메타가 없음
- AdSense UI에서 사이트가 `www.kstyleshot.com` 기준으로 확인되는지, 또는 루트 도메인 `kstyleshot.com` 기준으로 확인되는지 직접 확인 필요
- AdSense UI에서 코드 감지 상태가 "확인됨"인지 직접 확인 필요

## 현재 코드 구조 판단

### 공개 검토 표면 제한

`data/adsenseReview.ts`에 30개 slug만 검토 대상으로 지정되어 있다.

`app/[lang]/hub/[slug]/page.tsx`는 다음 방식으로 작동한다.

- `dynamicParams = false`
- `generateStaticParams()`에서 검토 대상 slug만 생성
- 검토 대상이 아닌 slug는 `notFound()`

`middleware.ts`도 `/ko/hub/[slug]`, `/en/hub/[slug]` 접근 시 검토 대상이 아닌 slug를 404로 돌리고 `x-robots-tag: noindex, nofollow`를 붙인다.

`app/sitemap.ts`도 sitemap에 검토 대상 slug만 넣는다.

이 구조는 AdSense 재심사 전에는 맞는 방향이다. 검토가 끝나지 않은 오래된 글까지 모두 200으로 공개하면, 한두 개의 약한 글 때문에 사이트 전체가 `low value content`로 보일 수 있다.

### 이번 검토에서 바로 수정한 것

`seongsu-industrial-alley-walk-guide`의 KO/EN frontmatter에만 `authorName`이 빠져 있었다. 같은 성수 클러스터의 작성자 기준에 맞춰 아래 두 파일에 `authorName: "Mirae Jo"`를 추가했다.

- `content/hub/ko/seongsu-industrial-alley-walk-guide.mdx`
- `content/hub/en/seongsu-industrial-alley-walk-guide.mdx`

Google의 helpful content 문서는 저자와 출처, 제작 배경이 신뢰 판단에 도움이 된다고 설명한다. 작은 항목이지만 검토 대상 글에서는 빠뜨리지 않는 편이 낫다.

## 이전에 통과하지 못했을 가능성이 큰 이유

### 1. 거절 원인이 콘텐츠 하나가 아니었다

사용자가 받은 거절에는 `가치가 별로 없는 콘텐츠`와 함께 `사이트 소유권을 확인하세요`가 있었다. 이전 수정이 글 길이, 글 추가, 내부 링크 중심이었다면 소유권 확인 문제는 그대로 남았을 가능성이 있다.

소유권 또는 코드 감지가 실패하면, AdSense는 사이트를 제대로 검토하기 전에 "준비되지 않은 사이트"로 묶어 거절할 수 있다.

### 2. 새로 쓴 글이 AdSense 검토 표면에 포함되지 않았을 수 있다

최근 작성한 새 글이 `ADSENSE_REVIEW_HUB_SLUGS`에 들어가지 않으면 sitemap과 hub 공개 표면에 반영되지 않는다. 이 경우 글을 새로 써도 AdSense 로봇이 재심사에서 주로 보는 표면에는 큰 변화가 없을 수 있다.

현재 전략은 재심사 전에는 30개 검토 slug만 유지하는 것이다. 새 글을 넣고 싶다면, 글 하나씩 별도 품질 점검 후 검토 리스트에 추가해야 한다.

### 3. 과거에는 약한 URL이 너무 많이 200으로 열렸을 가능성이 있다

이전 문서에는 legacy hub 글, review 제외 MDX, 이미지 없는 페이지, review 외부 내부 링크 문제가 기록되어 있었다. 이런 URL이 200으로 열려 있으면 sitemap에서 제외해도 Google이나 AdSense가 내부 링크, 과거 색인, 직접 접근으로 발견할 수 있다.

현재는 middleware와 sitemap으로 많이 줄였지만, 과거 심사는 그 이전 상태를 보고 실패했을 가능성이 크다.

### 4. 재제출 타이밍이 너무 빨랐을 수 있다

AdSense는 변경 직후의 로컬 상태가 아니라 배포된 라이브 상태를 본다. Vercel 배포, 캐시 갱신, crawler 재방문, AdSense UI의 코드 감지 상태가 모두 맞아야 한다.

검토 요청 횟수도 이미 소진되어 `2026년 6월 1일`부터 다시 요청 가능하다고 표시되어 있다. 현재 날짜가 `2026년 5월 31일 KST`이므로, 오늘 다시 누를 수 있는 상태가 아니다.

### 5. 많은 글을 빠르게 늘린 흔적 자체가 위험 신호가 될 수 있다

Google은 대량 생성 콘텐츠가 사용자에게 새 가치를 주지 않으면 scaled content abuse로 볼 수 있다고 설명한다. KStyleShot 글이 모두 AI라는 뜻은 아니지만, 비슷한 패턴의 글을 많이 열어두면 자동 심사에서 불리할 수 있다.

그래서 지금처럼 검토 표면을 줄이고, 핵심 글만 남기는 방향이 맞다.

## 재심사 전 필수 체크리스트

### P0. AdSense 소유권 확인

AdSense UI에서 아래를 직접 확인한다.

- 사이트가 `kstyleshot.com`으로 등록되어 있는지, `www.kstyleshot.com`으로 등록되어 있는지 확인
- AdSense 코드 감지가 완료 상태인지 확인
- 사이트 소유권 확인 메시지가 사라졌는지 확인
- Search Console 확인을 요구한다면 Google이 발급한 verification token을 Vercel 환경변수에 넣고 재배포

필요 환경변수:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

재배포 후 라이브 HTML에서 아래 메타가 보여야 한다.

```html
<meta name="google-site-verification" content="Google이 발급한 실제 토큰" />
```

토큰을 모르면 코드에서 해결할 수 없다. Google 계정에서 발급받아야 한다.

### P0. 현재 변경사항 배포

이번에 `authorName` 누락을 수정했다. 재심사를 하려면 이 변경사항이 production에 배포되어야 한다.

배포 후 확인할 URL:

- `https://www.kstyleshot.com/ko`
- `https://www.kstyleshot.com/en`
- `https://www.kstyleshot.com/ko/hub/seongsu-industrial-alley-walk-guide`
- `https://www.kstyleshot.com/en/hub/seongsu-industrial-alley-walk-guide`

### P0. AdSense 기본 파일 재확인

재심사 당일 다시 확인한다.

- `https://www.kstyleshot.com/ads.txt`
- `https://www.kstyleshot.com/robots.txt`
- `https://www.kstyleshot.com/sitemap.xml`
- `https://kstyleshot.com`
- `https://www.kstyleshot.com/ko`
- `https://www.kstyleshot.com/en`

현재는 정상으로 보인다.

### P1. 검토 대상 30개 글만 유지

재심사 전에는 새 글을 무리하게 `ADSENSE_REVIEW_HUB_SLUGS`에 추가하지 않는다. 최근 작성한 fashion 글은 별도 품질 점검이 끝나기 전까지 검토 표면에 넣지 않는 편이 낫다.

이유:

- 현재 30개 검토 slug는 로컬 점검상 누락, 이미지 없음, 비검토 내부 링크 문제가 없다.
- 새 글을 추가하면 검토 표면이 넓어지고, 한 글의 약점이 전체 심사에 영향을 줄 수 있다.

### P1. Search Console 색인 상태 확인

Search Console에서 과거 약한 URL이 계속 색인되어 있는지 확인한다.

확인 대상:

- 예전 legacy hub URL
- review 제외 MDX URL
- `/create` 관련 URL
- 실수로 공개된 임시 URL

현재 middleware는 비검토 hub slug를 404 noindex로 돌리지만, Search Console에 오래 남아 있는 URL은 재크롤링까지 시간이 걸릴 수 있다.

## 재심사 판단

다음 조건이 모두 맞으면 `2026년 6월 1일` 이후 재심사를 요청해도 된다.

- AdSense UI에서 코드 감지 또는 소유권 확인이 정상
- `ads.txt`가 200이고 publisher ID가 일치
- `robots.txt`가 AdSense/Googlebot 접근을 막지 않음
- sitemap이 200
- `/ko`, `/en`, `/ko/hub`, `/en/hub`가 정상 표시
- 검토 대상 30개 글의 KO/EN 페이지가 200
- 비검토 hub slug가 200으로 열리지 않음
- 새 글을 무리하게 추가하지 않음

반대로, AdSense UI에 아직 `사이트 소유권을 확인하세요`가 남아 있으면 글을 더 쓰지 말고 소유권 문제부터 해결해야 한다.

## 현재 우선순위

1. AdSense UI에서 소유권/코드 감지 상태 확인
2. Google site verification token이 필요하면 Vercel 환경변수에 추가하고 production 재배포
3. 이번 `authorName` 수정사항 배포
4. 배포 후 라이브 HTML과 30개 검토 글 재확인
5. 2026년 6월 1일 이후 재심사 요청

지금 상태에서 "가치없는 콘텐츠"만 보고 글을 계속 추가하는 것은 우선순위가 낮다. 현재 가장 의심되는 반복 실패 원인은 콘텐츠 양이 아니라, 소유권 확인 메시지와 과거에 열려 있던 약한 공개 URL의 영향이다.
