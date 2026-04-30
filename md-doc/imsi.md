# AdSense "Low Value Content" 대응 감사 메모

작성일: 2026-04-29 KST
대상 사이트: https://www.kstyleshot.com
진단 범위: 라이브 사이트 기본 접근성, AdSense 소유권 신호, robots/sitemap/ads.txt, 로컬 MDX 콘텐츠 200개, 내부링크, frontmatter, 콘텐츠 품질 패턴

## 결론

현재 사이트는 기술적으로 완전히 막힌 상태는 아니다. 라이브 `robots.txt`는 주요 페이지를 허용하고 있고, `ads.txt`도 루트에서 정상 노출되며, sitemap도 제출 가능한 구조다. 내부 링크 dead link, locale 교차 링크, frontmatter slug/lang 불일치도 이번 점검에서는 발견되지 않았다.

다만 AdSense 세 번째 거절 사유인 "가치가 별로 없는 콘텐츠"는 충분히 설명된다. 핵심 문제는 글 수가 부족한 것이 아니라, 다수의 글이 비슷한 형식과 얕은 본문 길이로 대량 생성된 신호를 강하게 준다는 점이다. 특히 한국어 글 100개 중 94개가 저장소 자체 기준인 본문 3,500자에 못 미치고, 영어 글 100개 중 20개가 900 words 미만이다. 전체 200개 중 90개는 본문 markdown 이미지가 없다.

즉, 지금은 "글이 많다"보다 "심사자가 사이트 전체를 훑었을 때 독립적인 고유 매체로 보이는가"가 약하다. 재심사 전에는 소유권 확인 신호를 먼저 확정하고, 콘텐츠를 대량 추가하는 대신 기존 글의 품질 신호를 크게 올리는 방향이 필요하다.

## 공식 기준 요약

Google AdSense 공식 문서 기준으로, 승인 전 사이트는 다음 신호가 필요하다.

- 사이트는 충분한 가치 있는 콘텐츠와 좋은 사용자 경험 및 탐색 요소를 제공해야 한다.
  https://support.google.com/adsense/answer/12176698
- AdSense에 적합한 페이지는 고유하고 관련성 있는 콘텐츠, 명확한 탐색, 사용자가 계속 읽을 이유가 있어야 한다.
  https://support.google.com/adsense/answer/7299563
- AdSense 참여 조건은 본인 콘텐츠가 정책에 맞고, 고품질·독창적이며 audience를 끌 수 있어야 한다는 점을 포함한다.
  https://support.google.com/adsense/answer/9724
- Google 게시자 정책과 AdSense 프로그램 정책을 함께 준수해야 한다.
  https://support.google.com/adsense/answer/48182
  https://support.google.com/adsense/answer/4533378
- `ads.txt`는 필수는 아니지만 권장되며, 게시자 ID가 루트에서 올바르게 노출되어야 한다.
  https://support.google.com/adsense/answer/12171612
- Google Search Essentials는 크롤링 가능한 링크, 스팸 정책 회피, 사용자에게 도움이 되는 콘텐츠를 기본 조건으로 본다.
  https://developers.google.com/search/docs/essentials

## 라이브 사이트 소유권 및 접근성 점검

### 정상 신호

- `https://www.kstyleshot.com/ads.txt` 정상 노출:
  - `google.com, pub-2524681039359256, DIRECT, f08c47fec0942fa0`
- `https://www.kstyleshot.com/robots.txt` 정상 노출:
  - 전체 허용
  - `/api/`, `/en/create`, `/ko/create`만 차단
  - sitemap 선언 있음
- 라이브 sitemap URL 수: 213개
- 라이브 HTML의 canonical은 `https://www.kstyleshot.com/...` 형태로 정상화되어 있음
- 개인정보처리방침, 약관, 환불정책, 소개, 문의 페이지가 공개 노출됨

### 즉시 확인해야 할 소유권 이슈

현재 라이브 `/ko` HTML에서 다음 신호는 확인되지 않았다.

- `google-site-verification` meta tag
- AdSense 신청용 `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-...` script
- HTML 내 `ca-pub-2524681039359256` 또는 `pub-2524681039359256` AdSense client script

`app/layout.tsx`에는 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 또는 `GOOGLE_SITE_VERIFICATION` 환경변수를 읽어 metadata verification을 넣는 구조가 이미 있다. 하지만 로컬 `.env.local` 점검에서는 `NEXT_PUBLIC_SITE_URL` 계열만 확인됐고, Google verification 값은 발견되지 않았다.

따라서 AdSense 화면이 "사이트 소유권을 확인하세요"를 같이 띄운다면 아래 중 하나를 반드시 완료해야 한다.

1. AdSense에서 제공한 site verification/ad code를 `<head>`에 넣고 배포한다.
2. Search Console에서 `https://www.kstyleshot.com` 속성 소유권을 확인하고 AdSense가 이를 인식하도록 한다.
3. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 Search Console verification token을 넣고 배포한다.

권장 순서: AdSense가 요구한 방식이 있으면 그 방식을 우선한다. 현재 상태에서는 `ads.txt`는 통과 신호지만, AdSense 사이트 소유권 확인을 대체한다고 단정하면 안 된다.

## 로컬 콘텐츠 감사 결과

### 콘텐츠 수

- KO MDX: 100개
- EN MDX: 100개
- 총 MDX: 200개

### 본문 길이

저장소 운영 문서 `md-doc/post-codex-command.md`의 자체 기준:

- KO 본문 최소 3,500자
- EN 본문 최소 900 words

점검 결과:

- KO 3,500자 미만: 94 / 100
- EN 900 words 미만: 20 / 100

가장 짧은 KO 예시:

- `personal-color-hair-dye-guide.mdx`: 1,733자
- `how-to-keep-bangs-in-place-all-day.mdx`: 1,877자
- `hair-colors-that-brighten-your-face.mdx`: 1,924자
- `how-to-add-root-volume-at-home.mdx`: 2,079자
- `hair-color-ideas-by-skin-tone.mdx`: 2,222자

가장 짧은 EN 예시:

- `seokchon-lake-photo-spot-guide.mdx`: 569 words
- `gyeongbokgung-nearby-hanok-photo-spots.mdx`: 582 words
- `eye-makeup-tips.mdx`: 587 words
- `banpo-han-river-night-view-guide.mdx`: 616 words
- `yeouido-han-river-picnic-guide.mdx`: 617 words

판단: AdSense 거절의 직접 원인 후보다. 특히 KO는 사이트 자체 기준에도 거의 대부분 미달이라, "최소 콘텐츠 요건"과 "고유 콘텐츠"에서 약하게 보일 수 있다.

### 이미지 및 시각 자료

- 본문 markdown 이미지 0개인 글: 90 / 200

장소 글에는 이미지가 들어간 경우가 많지만, K-뷰티·헤어·패션 계열 하위 글 상당수는 이미지 없이 텍스트만 있다. AdSense가 이미지 수를 직접 요구하는 것은 아니지만, 이 사이트의 주제가 스타일·뷰티·사진인 점을 고려하면 이미지 없는 대량 가이드는 사용자 경험과 고유성 신호가 약하다.

권장:

- 모든 승인 대상 글에 최소 1개 이상의 고유 이미지 또는 자체 제작 시각 자료를 넣는다.
- 장소 글은 실제 방문 느낌이 드는 사진/구도 설명을 강화한다.
- 뷰티·패션 글은 제품 제형, 색상 비교, 적용 순서, 실패 사례를 보여 주는 이미지 또는 표를 추가한다.

### 반복 구조와 AI 패턴

점검 결과:

- dash로 시작하는 H2 또는 질문형 H2가 과반인 파일: 130 / 200
- 반복 완곡 표현이 많은 파일: 101개
- 전체 검색 패턴 빈도:
  - `경우가 많`: 177회
  - `중요합니다`: 154회
  - `좋습니다`: 194회
  - `Overall`: 42회
  - `usually works best`: 25회
  - `often works better`: 41회

판단: 개별 문장 하나가 문제라기보다, 사이트 전체가 같은 작성 공식으로 만들어진 것처럼 보인다. AdSense 심사에서 "가치가 별로 없는 콘텐츠"로 보일 수 있는 강한 신호다.

수정 방향:

- H2의 `## — Why...`, `## — How...`, `~할까` 반복을 줄이고, 글마다 구조를 다르게 만든다.
- 각 글마다 현장 관찰, 제품 사용 조건, 비교표, 실제 실패 기준, 비용/시간/동선/성분처럼 검증 가능한 정보를 최소 2~3개 넣는다.
- "좋습니다/중요합니다/경우가 많습니다" 대신 구체적인 조건문으로 바꾼다.

예:

- 약함: "이 컬러는 얼굴이 밝아 보이는 경우가 많습니다."
- 개선: "자연모 5~6레벨에서 허니 브라운을 올리면 얼굴 옆 노란기가 강한 사람은 2주 뒤 주황 잔색이 빨리 올라올 수 있다."

## 기술 SEO 점검

### 정상

- `robots.ts`: 크롤링 허용 구조
- `sitemap.ts`: 정적 페이지 + KO/EN hub article 포함
- live sitemap: 213개 URL 노출
- canonical/hreflang 구조 있음
- `/ko/hub`, `/en/hub`에 crawler용 SSR 링크 nav 존재
- MDX 내부 링크 점검:
  - dead internal link: 0
  - locale 교차 링크: 0
  - slug/lang frontmatter mismatch: 0

### 보완

- 라이브 sitemap 213개와 로컬 계산상 정적 14 + MDX 200 = 214개 사이에 1개 차이가 있다. 배포 시점 차이일 수 있으나, 재심사 전 `sitemap.xml`과 실제 배포 콘텐츠 수를 다시 맞춘다.
- `NEXT_PUBLIC_SITE_URL` 로컬 값이 `https://www.kstylewshot.com`으로 되어 있다. `lib/seo.ts`에서 typo domain을 `kstyleshot.com`으로 보정하지만, 배포 환경 변수 자체는 정확히 `https://www.kstyleshot.com`으로 바꾸는 것이 안전하다.
- 법무/소개/문의 문서 본문에 `kstylewshot.com` 오타가 남아 있다. 사용자가 보는 신뢰 신호와 AdSense 심사 신호 모두에 좋지 않다.
- 약관에는 결제 금액 `$2.99`, 랜딩에는 `$3.99`가 보인다. 가격 정책이 일치하지 않으면 신뢰도 문제가 된다.

## 가장 위험한 문제 우선순위

### P0. AdSense 소유권 확인 신호 확정

재심사 전 반드시 처리한다.

- AdSense site 연결 화면에서 제공한 script 또는 meta 방식 확인
- `<head>`에 AdSense/verification 코드가 실제 라이브 HTML에 보이는지 확인
- Search Console 소유권 인증 상태 확인
- `ads.txt` 상태가 AdSense 콘솔에서 Authorized인지 확인

현재 `ads.txt`는 정상이나, 라이브 HTML에는 AdSense client script와 verification meta가 보이지 않는다.

### P1. 얇은 글 대량 노출 문제 해결

새 글 추가를 멈추고, 현재 노출된 글 중 품질이 약한 글부터 고친다.

권장 전략:

1. 200개 전체를 한 번에 고치지 않는다.
2. 승인용 핵심 글 30~40개를 먼저 선정한다.
3. 나머지 글은 빠르게 보강하거나, 품질 보강 전에는 sitemap/내부 노출 우선순위를 낮춘다.

우선 보강 대상:

- 사이트 첫 화면에서 연결되는 hub
- `/ko/hub`, `/en/hub` 상단에 보이는 최신/대표 카드
- sitemap에 노출되는 짧은 글
- 이미지 없는 뷰티·패션 글

### P2. About/Contact/Legal 신뢰 신호 정리

수정 항목:

- 모든 `kstylewshot.com` 오타를 `kstyleshot.com`으로 수정
- Contact에는 실제 이메일이 있으므로 서비스 문의 문장도 도메인만 쓰지 말고 이메일 또는 문의 방식 명시
- 약관/환불/랜딩 가격 `$2.99` vs `$3.99` 일치
- 개인정보처리방침의 개인정보 보호책임자 항목에 이메일 명시

### P3. 콘텐츠 고유성 강화

각 글에 최소 하나 이상의 "다른 사이트에서 쉽게 복제하기 어려운 정보"를 넣는다.

장소 글:

- 지하철 출구, 도보 시간, 실제 이동 순서
- 오전/오후/야간 차이
- 혼잡 시간대
- 사진 구도별 실패 사례
- 직접 방문 메모

뷰티 글:

- 성분명 3개 이상
- 피부/모발 조건별 분기
- 사용량, 간격, 순서
- 잘못 썼을 때의 징후
- 제품군 비교 기준

패션 글:

- 체형/키/핏별 분기
- 소재, 길이, 계절별 차이
- 신발/가방/액세서리 매칭 기준
- 실패하는 조합과 대체안

## 재심사 전 실행 순서

1. AdSense 소유권 확인
   - AdSense code 또는 Google verification meta를 라이브 `<head>`에서 확인한다.
   - Search Console 소유권과 AdSense 계정 연결 상태를 확인한다.
   - `ads.txt`는 이미 정상 노출되므로 AdSense 콘솔에서 Authorized 상태인지 확인한다.

2. 사이트 신뢰 요소 정리
   - `kstylewshot.com` 오타 전부 수정
   - 가격 정책 일치
   - 문의 이메일 명시
   - About의 에디토리얼 기준과 실제 글 내용이 맞도록 글에 현장/사용 근거 추가

3. 콘텐츠 보강 1차
   - KO 3,500자 미만 글 중 상위 노출/대표 글 30개 먼저 4,000~5,000자 수준으로 보강
   - EN 900 words 미만 20개는 모두 1,100~1,300 words로 보강
   - 이미지 0개 글 중 대표 글부터 최소 1~3개 이미지 추가
   - 반복 H2와 AI 패턴 표현 정리

4. 콘텐츠 보강 2차
   - 나머지 KO 미달 글도 최소 기준 충족
   - thin한 하위 글은 관련 hub로 병합 검토
   - 너무 비슷한 주제는 canonical/병합/삭제 중 하나를 선택

5. 재점검
   - `npm run build`
   - sitemap URL 수 확인
   - live `robots.txt`, `ads.txt`, sitemap 확인
   - 대표 10개 글 live HTML에서 본문, 이미지 alt, canonical, hreflang 확인

6. 재심사 요청
   - 최소 1~2주 정도 Search Console에서 주요 URL 재크롤링/색인 갱신을 유도한 뒤 요청하는 편이 낫다.
   - 수정 직후 바로 재신청하면 기존 캐시/색인 상태로 다시 판단될 수 있다.

## 승인용 콘텐츠 운영 기준

앞으로 새 글은 양보다 품질 기준을 먼저 적용한다.

- KO: 최소 4,000자, 가능하면 5,000자 이상
- EN: 최소 1,100 words, 가능하면 1,300 words 이상
- 본문 이미지: 최소 1개, 스타일/장소 글은 3개 이상 권장
- H2 구조: 글마다 다르게 설계
- 각 글마다 고유 정보 3개 이상
- 관련 글 링크는 유지하되, 링크 패널만으로 채우지 않는다
- "요약 카드"보다 본문 고유 정보가 먼저 충분해야 한다
- 직접 경험/테스트/관찰이 없는 글은 "추천"보다 "선택 기준" 중심으로 작성한다

## 이번 점검에서 발견된 긍정 요소

- 콘텐츠 수 자체는 부족하지 않다.
- KO/EN 구조가 일관되어 있다.
- sitemap, canonical, hreflang, robots의 기본 구조가 잡혀 있다.
- 내부 링크 dead link가 이번 점검에서는 없다.
- `ads.txt`는 라이브에서 정상 표시된다.
- About/Contact/Privacy/Terms/Refund 페이지가 존재하고, 단순 placeholder 수준은 아니다.

## 최종 판단

현재 거절 원인은 "사이트가 비어 있음"이 아니라 "대량 콘텐츠가 있으나 심사 기준에서 고유 가치가 충분히 강하게 보이지 않음"에 가깝다. 지금 상태로 네 번째 재심사를 넣는 것은 비효율적이다.

가장 먼저 할 일은 소유권 확인 코드를 라이브에서 확실히 보이게 하는 것이다. 그다음 대표 글 30~40개를 실제 경험·수치·이미지·비교 기준이 있는 글로 끌어올려야 한다. 전체 글을 계속 늘리는 전략은 중단하고, 이미 노출된 얇은 글을 줄이거나 강화하는 쪽이 AdSense 승인 가능성을 높인다.

## 지금부터 Codex가 수정할 작업 순서

이미지는 사용자가 차후 직접 넣는 것으로 제외한다. 지금 바로 처리할 범위는 코드, 환경 변수 연결부, 법무/신뢰 문구, 콘텐츠 텍스트 보강, 반복 패턴 정리다.

### 1순위: AdSense 소유권 확인 코드가 라이브 head에 들어가게 만들기

목표: AdSense의 "사이트 소유권을 확인하세요" 메시지를 먼저 해소한다.

수정 후보:

- `app/layout.tsx`
- `.env.local.example`
- 필요 시 새 환경 변수 문서 또는 주석

작업 내용:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 또는 `GOOGLE_SITE_VERIFICATION` 구조는 이미 있으므로, 실제 배포 환경에 넣을 값만 명확히 안내한다.
- AdSense가 `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?...">` 형태의 확인 코드를 요구하면, 광고 노출용이 아니라 "심사용 head script"로만 안전하게 추가하는 컴포넌트를 만든다.
- 환경 변수가 없으면 아무것도 렌더링하지 않게 처리한다.
- 광고 단위는 아직 만들지 않는다. 승인 전에는 본문에 광고 슬롯을 넣지 않는다.

완료 기준:

- 라이브 HTML `<head>`에서 Google verification meta 또는 AdSense client script가 확인된다.
- `ads.txt`는 현재 정상이라 유지한다.

### 2순위: 도메인 오타와 신뢰 문구 정리

목표: 심사자가 보는 신뢰 신호의 오류를 제거한다.

수정 후보:

- `app/[lang]/privacy/page.tsx`
- `app/[lang]/terms/page.tsx`
- `app/[lang]/refund-policy/page.tsx`
- `app/[lang]/about/page.tsx`
- `app/[lang]/contact/page.tsx`
- `.env.local.example`
- 필요 시 `.env.local`은 사용자가 직접 운영 값 확인

작업 내용:

- 모든 `kstylewshot.com` 오타를 `kstyleshot.com`으로 수정한다.
- Contact/Privacy/Terms/Refund에서 도메인만 적힌 문의처를 실제 이메일 `hajjanggun77@gmail.com` 또는 `/contact`로 바꾼다.
- 약관 가격 `$2.99`와 랜딩 가격 `$3.99` 불일치를 하나로 통일한다.
- 개인정보 보호책임자/문의처 항목에 실제 연락 수단을 명시한다.
- About의 "직접 방문/직접 사용" 문구가 과장으로 보이지 않게, 현재 보강 전 단계에서는 "에디토리얼 검토와 공개 자료 확인, 현장성 있는 기준"처럼 더 방어적인 표현으로 조정한다. 실제 경험 문구는 글 보강 후 다시 강화한다.

완료 기준:

- 사이트 전체에서 `kstylewshot` 검색 결과가 0개다.
- 가격 표기가 모든 페이지에서 일치한다.
- 법무/문의 페이지가 placeholder나 임시 문구처럼 보이지 않는다.

### 3순위: sitemap과 색인 대상 정리

목표: 얇은 글을 대량으로 그대로 심사에 노출하는 위험을 줄인다.

수정 후보:

- `app/sitemap.ts`
- `data/hubPosts.ts`
- 필요 시 frontmatter 필드 확장 또는 제외 목록 파일

작업 내용:

- 당장 삭제하지 않고, "심사 우선 공개 글"과 "보강 대기 글"을 나누는 방식을 검토한다.
- 보강 대기 글을 sitemap에서 일시 제외할 수 있는 구조를 만든다.
- 단, 이미 내부 링크가 많은 글을 무리하게 숨기면 사용자 탐색이 깨질 수 있으므로 첫 단계에서는 sitemap 제외 목록만 설계하고, 실제 제외는 사용자의 승인 후 적용한다.

완료 기준:

- 심사에 내보낼 대표 글 목록이 명확해진다.
- sitemap이 고품질 대표 글 중심으로 구성될 수 있는 구조가 준비된다.

### 4순위: 가장 짧은 EN 글 20개 우선 보강

목표: 영어권 심사/크롤링에서 얇은 콘텐츠로 보이는 글을 먼저 줄인다.

우선 대상:

- `content/hub/en/seokchon-lake-photo-spot-guide.mdx`
- `content/hub/en/gyeongbokgung-nearby-hanok-photo-spots.mdx`
- `content/hub/en/eye-makeup-tips.mdx`
- `content/hub/en/banpo-han-river-night-view-guide.mdx`
- `content/hub/en/yeouido-han-river-picnic-guide.mdx`
- `content/hub/en/lip-makeup-guide.mdx`
- `content/hub/en/long-lasting-summer-makeup-guide.mdx`
- `content/hub/en/k-beauty-base-makeup-tips.mdx`
- `content/hub/en/semi-matte-base-makeup-guide.mdx`
- `content/hub/en/personal-color-hair-dye-guide.mdx`

작업 내용:

- 각 글을 1,100~1,300 words 수준으로 보강한다.
- 이미지 마크다운은 추가하지 않는다.
- 대신 표, 체크리스트, 실제 선택 기준, 시간대/성분/실패 기준을 텍스트로 보강한다.
- `Overall`, `usually works best`, `often works better` 반복을 줄인다.

완료 기준:

- EN 900 words 미만 글 수가 0개가 된다.
- H2가 전부 같은 `Why/How` 패턴으로 보이지 않게 바뀐다.

### 5순위: 가장 짧은 KO 글 30개 우선 보강

목표: 한국어 글 대부분이 자체 기준 미달인 문제를 줄인다.

최우선 대상:

- `content/hub/ko/personal-color-hair-dye-guide.mdx`
- `content/hub/ko/how-to-keep-bangs-in-place-all-day.mdx`
- `content/hub/ko/hair-colors-that-brighten-your-face.mdx`
- `content/hub/ko/how-to-add-root-volume-at-home.mdx`
- `content/hub/ko/hair-color-ideas-by-skin-tone.mdx`
- `content/hub/ko/ssamziegil-insadong-photo-guide.mdx`
- `content/hub/ko/banpo-han-river-night-view-guide.mdx`
- `content/hub/ko/yeouido-han-river-picnic-guide.mdx`
- `content/hub/ko/korean-skincare-routine-guide.mdx`
- `content/hub/ko/seokchon-lake-photo-spot-guide.mdx`

작업 내용:

- 각 글을 최소 3,500자 이상, 가능하면 4,000자 이상으로 보강한다.
- 이미지 추가는 하지 않는다.
- 장소 글은 출구, 도보 흐름, 시간대, 혼잡, 사진 실패 기준을 넣는다.
- 뷰티/헤어 글은 성분명, 모발/피부 조건, 사용량, 유지 기간, 실패 징후를 넣는다.
- `좋습니다`, `중요합니다`, `경우가 많습니다` 반복을 줄인다.

완료 기준:

- KO 3,500자 미만 글 수가 단계적으로 감소한다.
- 대표 글 30개는 심사자가 보아도 독립적인 실용 가이드로 읽힌다.

### 6순위: Hub/feed 화면의 신뢰도 보강

목표: `/ko/hub`, `/en/hub`가 단순 카드 모음이 아니라 편집된 콘텐츠 허브처럼 보이게 한다.

수정 후보:

- `components/hub/HubFeed.tsx`
- `app/[lang]/hub/page.tsx`
- `data/hubPosts.ts`

작업 내용:

- 화면의 "Lookbook", "Hub Cards" 같은 표현을 콘텐츠 허브 성격에 맞게 정리한다.
- 추천 허브 설명을 광고성 문구보다 사용자가 어떤 문제를 해결할 수 있는지 중심으로 바꾼다.
- SSR hidden nav는 유지한다.

완료 기준:

- 허브 페이지가 검색/탐색/카테고리 중심의 미디어 페이지로 보인다.
- 단순 AI 서비스의 부속 페이지처럼 보이는 느낌을 줄인다.

### 7순위: 빌드 및 검증

목표: 수정 후 깨진 라우트, MDX, sitemap 문제가 없는지 확인한다.

실행:

- `npm run build`
- 필요 시 `npm run typecheck`
- `rg "kstylewshot"`
- 대표 URL live 확인은 배포 후 진행

완료 기준:

- 빌드 성공
- 오타 검색 0개
- sitemap/robots/ads.txt 정상
- 대표 글 렌더링 정상

## 바로 시작할 첫 작업

첫 번째로 할 작업은 `2순위: 도메인 오타와 신뢰 문구 정리`가 가장 현실적이다.

이유:

- 지금 코드만으로 바로 수정 가능하다.
- AdSense 소유권 코드는 사용자가 AdSense 화면에서 받은 client/script 값이 필요할 수 있다.
- 법무/문의/가격 불일치는 승인 심사에서 신뢰도를 떨어뜨리는 명확한 약점이다.
- 수정 범위가 작고 빌드 검증이 쉽다.

따라서 다음 턴에서 바로 시작할 권장 작업:

1. `kstylewshot.com` 전역 오타 수정
2. 문의처를 `hajjanggun77@gmail.com` 또는 `/contact`로 명확화
3. 가격 `$2.99` / `$3.99` 중 하나로 통일
4. About의 직접 경험 문구를 현재 콘텐츠 상태에 맞게 과장 없는 표현으로 조정

가격은 현재 랜딩 기준으로 `$3.99`가 노출되어 있으므로, 별도 지시가 없으면 약관/정책도 `$3.99`로 맞추는 방향이 안전하다.

## 진행 로그

### 2026-04-29: 1순위 신뢰 문구 정리 완료

수정 완료:

- `app/[lang]/privacy/page.tsx`
  - `kstylewshot.com` 문의처 제거
  - 권리 행사/개인정보 문의를 `hajjanggun77@gmail.com`으로 명확화
- `app/[lang]/terms/page.tsx`
  - 서비스 제공 도메인을 `kstyleshot.com`으로 수정
  - 가격을 `$2.99 USD` 이벤트가로 표기하고, 정가 `$3.99 USD`를 함께 명시
  - 분쟁/문의 연락처를 `hajjanggun77@gmail.com`으로 명확화
- `app/[lang]/refund-policy/page.tsx`
  - 환불 문의처를 `hajjanggun77@gmail.com`으로 명확화
- `app/[lang]/contact/page.tsx`
  - 서비스 문의 채널을 도메인 표기 대신 이메일로 명확화
- `app/[lang]/about/page.tsx`
  - `kstylewshot.com` 오타 수정
  - "직접 방문/직접 사용" 단정 문구를 현재 콘텐츠 상태에 맞는 에디토리얼 검토 표현으로 조정
- `components/create/IntroFlow.tsx`
  - 결제 시작 화면을 정가 `$3.99`, 이벤트가 `$2.99` 구조로 유지
- `.env.local`
  - `NEXT_PUBLIC_SITE_URL`을 `https://www.kstyleshot.com`으로 수정
  - `RESEND_FROM_EMAIL` 도메인을 `noreply@kstyleshot.com`으로 수정

검증:

- `npm run build` 성공
- 공개 앱/환경 파일 범위에서 `kstylewshot`, 과장된 직접 경험 패턴 검색 결과 없음
- 가격 표기는 정가 `$3.99`, 이벤트가 `$2.99` 구조로 통일

남은 참고:

- `lib/seo.ts`의 `LEGACY_TYPO_DOMAIN = "kstylewshot.com"`은 과거 오타 도메인이 환경 변수에 남아 있어도 canonical을 정상 도메인으로 보정하기 위한 내부 안전장치다. 사용자에게 노출되는 문구가 아니므로 유지한다.

다음 권장 작업:

1. AdSense 소유권 확인 코드 또는 Google verification meta를 실제 라이브 `<head>`에 노출시키기
2. 그다음 sitemap/심사 대상 글 정리 또는 짧은 EN 글 20개 보강으로 이동

### 2026-04-29: AdSense 소유권 확인용 head script 추가 완료

수정 완료:

- `app/layout.tsx`
  - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` 또는 `GOOGLE_ADSENSE_CLIENT` 값을 읽도록 추가
  - `ca-pub-...` 형식과 `pub-...` 형식을 모두 처리하도록 `normalizeAdsenseClient` 추가
  - 값이 있을 때만 `<head>`에 아래 AdSense client script 렌더링
    - `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2524681039359256`
  - 승인 전 본문 광고 슬롯은 추가하지 않음
- `.env.local.example`
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 예시 주석 추가
  - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-2524681039359256` 추가
- `.env.local`
  - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-2524681039359256` 추가

검증:

- `npm run build` 성공
- 빌드 산출물에서 `pagead2.googlesyndication.com` 및 `ca-pub-2524681039359256` 확인

남은 확인:

- 배포 후 라이브 HTML에서 실제 `<head>`에 AdSense script가 보이는지 확인해야 한다.
- AdSense가 별도의 `google-site-verification` token을 요구하면, 배포 환경 변수에 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 값을 추가해야 한다.
- `ads.txt`는 이미 정상 노출 중이다.

다음 권장 작업:

1. 배포 후 `https://www.kstyleshot.com/ko` 소스에서 `pagead2.googlesyndication.com` 확인
2. AdSense 콘솔에서 사이트 소유권 확인 상태 재확인
3. 확인 통과 후 sitemap/심사 대상 글 정리 또는 짧은 EN 글 보강으로 이동

### 2026-04-29: sitemap 심사 대상 글 40개로 축소 완료

목표:

- 얇은 글 200개 전체를 sitemap으로 강하게 제출하는 상태를 줄인다.
- 페이지 삭제, noindex, 내부 링크 제거 없이 sitemap 제출 대상만 먼저 대표 글 중심으로 제한한다.

수정 완료:

- `data/adsenseReview.ts` 신규 생성
  - `ADSENSE_REVIEW_HUB_SLUGS` 40개 정의
  - `isAdsenseReviewHubSlug(slug)` 헬퍼 추가
- `app/sitemap.ts`
  - Hub MDX article sitemap 생성 시 `isAdsenseReviewHubSlug(slug)`가 true인 글만 포함하도록 변경

선정 기준:

- KO/EN 양쪽 파일이 모두 존재하는 글
- 상대적으로 본문 길이와 이미지 수가 나은 글
- 사이트 구조상 중심이 되는 지역/뷰티 허브 글
- AdSense 재심사에서 사이트 주제와 실용성을 보여 주기 좋은 대표 글

현재 sitemap 구성:

- 정적/법무/허브 페이지: 16개
- 심사 대상 hub article: 40개 slug * KO/EN 2개 = 80개
- 총 sitemap URL: 96개

검증:

- 40개 slug 모두 KO/EN 파일 존재 확인
- `npm run build` 성공
- `.next/server/app/sitemap.xml.body` 기준 `<loc>` 수 96개 확인

주의:

- 이 작업은 sitemap 제출 대상만 줄인 것이다.
- 보강 대기 글은 아직 실제 페이지로 접근 가능하고, hub feed에서도 노출될 수 있다.
- AdSense가 여전히 thin page를 탐색할 수 있으므로, 다음 단계에서는 hub/feed 노출 정리 또는 짧은 EN/KO 글 보강이 필요하다.

다음 권장 작업:

1. `/ko/hub`, `/en/hub` 화면 문구와 노출 구조를 콘텐츠 허브답게 정리
2. 또는 EN 900 words 미만 글 20개를 먼저 보강

### 2026-04-29: hub/feed 노출 구조 1차 정리 완료

목표:

- sitemap에서 대표 40개만 제출하도록 줄인 흐름과 `/ko/hub`, `/en/hub`의 실제 내부 링크 노출을 맞춘다.
- 허브 화면을 단순 카드/룩북 모음이 아니라 사용자가 주제별 가이드를 찾는 콘텐츠 허브처럼 보이게 한다.

수정 완료:

- `app/[lang]/hub/page.tsx`
  - `data/adsenseReview.ts`의 `isAdsenseReviewHubSlug(slug)` 기준으로 hub feed 노출 글을 필터링
  - crawler용 숨김 nav 링크도 동일한 대표 심사 글 기준으로만 출력
  - 노출 글이 없는 카테고리 칩은 자동으로 제외되도록 변경
- `components/hub/HubFeed.tsx`
  - 첫 추천 영역을 최신 카드가 아니라 대표 가이드 중심으로 노출
  - `Hub Cards`, `More Cards`, `Search Stories`, `Feed` 등 카드/피드 중심 문구를 가이드/콘텐츠 허브 문구로 변경
  - 랜딩 복귀 문구를 `홈으로 돌아가기` / `Back to home`으로 정리
- `messages/ko.json`, `messages/en.json`
  - 상단 메뉴의 `Lookbook` 표현을 `가이드` / `Guides`로 변경
- `components/common/SiteHeader.tsx`
  - 모바일 허브 버튼을 `가이드 허브` / `Guide Hub`로 변경

현재 hub feed 노출 상태:

- KO/EN 각각 대표 카드 15개 노출
- 노출 slug:
  - `gyeongbokgung-hub`
  - `myeongdong-hub`
  - `n-seoul-tower-hub`
  - `insadong-hub`
  - `garosu-gil-hub`
  - `han-river-park-hub`
  - `seongsu-hub`
  - `bukchon-hanok-village-hub`
  - `seoul-photo-spot-guide`
  - `korean-skincare-routine-guide`
  - `k-beauty-base-makeup-tips`
  - `hair-styling-tips`
  - `olive-young-must-buys-guide`
  - `skincare-by-skin-concern`
  - `high-teen-school-look-guide`

검증:

- `npm run build` 성공
- 남은 기존 경고: Next.js 16의 `middleware` 파일 convention deprecated 경고만 표시됨
- `Lookbook`, `Hub Cards`, `More Cards`, `Search Stories`, `스토리 검색`, `Feed` 등 정리 대상 공개 문구 검색 결과 없음

주의:

- sitemap 대표 40개 중 현재 `data/hubPosts.ts`에 카드 데이터가 있는 글은 15개다.
- 나머지 대표 글 25개는 sitemap으로 제출되지만 `/hub` 카드 목록에는 아직 보이지 않는다.
- 페이지 삭제나 noindex는 적용하지 않았다.

다음 권장 작업:

1. sitemap 대표 40개 중 `/hub` 카드가 없는 글 25개의 카드 데이터를 추가하거나, 대표 노출 대상을 15개 중심으로 재조정
2. 그다음 EN 900 words 미만 글 20개 보강 시작

### 2026-04-29: sitemap 대표 40개 hub 카드 노출 정합성 완료

목표:

- sitemap에 제출하는 대표 40개 글이 `/ko/hub`, `/en/hub`의 실제 카드 목록에서도 모두 발견되게 한다.
- crawler용 숨김 nav, 화면 카드, sitemap 대표 목록이 서로 다른 신호를 내지 않게 맞춘다.

수정 완료:

- `data/hubPosts.ts`
  - 반복 카드 생성을 줄이기 위해 `reviewCard()` 헬퍼 추가
  - KO 카드 25개 추가
  - EN 카드 25개 추가
  - 추가 대상은 이전 단계에서 sitemap 대표 40개에 포함했지만 `/hub` 카드 데이터가 없던 글

추가된 대표 카드 범위:

- 경복궁 하위 가이드:
  - `gyeongbokgung-photo-guide`
  - `gyeongbokgung-light-timing-guide`
- 남산/N서울타워:
  - `n-seoul-tower-night-view-guide`
- 인사동/가로수길:
  - `ssamziegil-insadong-photo-guide`
  - `garosu-gil-cafe-photo-spots`
- 한강:
  - `yeouido-han-river-picnic-guide`
  - `banpo-han-river-night-view-guide`
- 성수/북촌:
  - `seongsu-pop-up-store-guide`
  - `seongsu-cafe-photo-spots`
  - `bukchon-hanok-photo-spots`
  - `bukchon-hanbok-photo-route`
- 서울 포토존 확장:
  - `seoul-cherry-blossom-photo-spots`
  - `seoul-forest-picnic-photo-guide`
  - `seokchon-lake-photo-spot-guide`
  - `euljiro-retro-photo-spot-guide`
- 홍대:
  - `hongdae-hub`
  - `hongdae-street-photo-spots`
  - `hongdae-aesthetic-cafes-for-photos`
- K-뷰티:
  - `winter-glow-makeup-guide`
  - `toner-pad-usage-guide`
  - `how-to-choose-a-cushion-foundation`
  - `semi-matte-base-makeup-guide`
  - `long-lasting-summer-makeup-guide`
  - `how-to-get-glass-skin`
  - `korean-sheet-mask-guide`

현재 상태:

- KO hub card 전체 데이터: 51개
- EN hub card 전체 데이터: 51개
- AdSense review 대표 slug: 40개
- `/ko/hub` 대표 노출 가능 카드: 40개
- `/en/hub` 대표 노출 가능 카드: 40개
- KO/EN 누락 slug: 0개
- KO/EN 중복 slug: 0개

검증:

- 대표 40개가 KO/EN 카드 데이터에 모두 존재하는지 확인 완료
- `npm run build` 성공
- 남은 기존 경고: Next.js 16의 `middleware` 파일 convention deprecated 경고만 표시됨

주의:

- 카드 데이터 정합성은 완료됐지만, 개별 글 본문 품질 보강은 아직 남아 있다.
- 특히 EN 900 words 미만 글 20개와 KO 3,500자 미만 글 다수는 AdSense 재심사 전 단계적으로 보강해야 한다.

다음 권장 작업:

1. EN 900 words 미만 글 20개 중 sitemap 대표에 포함된 글부터 본문 보강
2. 또는 KO 3,500자 미만 대표 글부터 보강

### 2026-04-29: EN 대표 글 3개 본문 품질 보강 완료

목표:

- sitemap 대표 40개 중 EN 900 words 미만인 글을 줄인다.
- 단순 분량 추가가 아니라 AdSense "가치가 별로 없는 콘텐츠"에서 문제가 되는 얕은 정보, 질문형 H2 반복, 숫자 없는 추상 서술을 함께 줄인다.

이번 보강 대상:

- `content/hub/en/seokchon-lake-photo-spot-guide.mdx`
- `content/hub/en/yeouido-han-river-picnic-guide.mdx`
- `content/hub/en/banpo-han-river-night-view-guide.mdx`

수정 방향:

- `readTime`을 `6 Min Read`에서 `8 Min Read`로 조정
- `## — Where/Why/How...` 중심의 질문형 H2를 서술형/명사형 H2로 변경
- 장소형 글 기준으로 시간대, 체류 시간, 도보/촬영 판단 기준 등 숫자 정보 추가
- 현장 판단 신호 추가:
  - 사람이 많을 때 어느 지점에서 프레임이 무너지는지
  - 강변 바람, 이동 동선, 물가/잔디 거리감, 야경 촬영 거리 같은 실제 선택 기준
- 이미지 마크업은 추가하지 않음
- 기존 내부 링크 구조는 유지하되 KO 링크 혼입 여부와 dead link 여부를 점검
- `usually works best`, `usually works better`, `often works better`, `Overall` 등 AI 패턴으로 보일 수 있는 표현 검색 후 제거

단어 수 변화:

- `seokchon-lake-photo-spot-guide`
  - 기존: 594 words
  - 수정 후: 1,116 words
- `yeouido-han-river-picnic-guide`
  - 기존: 649 words
  - 수정 후: 1,153 words
- `banpo-han-river-night-view-guide`
  - 기존: 660 words
  - 수정 후: 1,165 words

검증:

- 세 글 모두 EN 순수 본문 900 words 이상 통과
- 세 글 모두 H2 5개, 질문형 H2 0개
- 숫자 정보 포함:
  - Seokchon: 13개 digit mention
  - Yeouido: 16개 digit mention
  - Banpo: 14개 digit mention
- 금지/주의 표현 검색 결과 없음:
  - `Overall`
  - `In conclusion`
  - `It is important to note`
  - `To summarize`
  - `Ultimately`
  - `With that in mind`
  - `Having said that`
  - `usually works best`
  - `usually works better`
  - `often works better`
  - `click here`
  - `/ko/hub`
- 내부 `/en/hub/...` 링크 dead link 없음
- `npm run build` 성공
- 남은 기존 경고: Next.js 16의 `middleware` 파일 convention deprecated 경고만 표시됨

현재 남은 sitemap 대표 EN 900 words 미만 글:

- `korean-skincare-routine-guide`: 662 words
- `long-lasting-summer-makeup-guide`: 670 words
- `semi-matte-base-makeup-guide`: 688 words
- `gyeongbokgung-light-timing-guide`: 695 words
- `k-beauty-base-makeup-tips`: 696 words
- `seongsu-cafe-photo-spots`: 697 words
- `seongsu-pop-up-store-guide`: 731 words
- `how-to-choose-a-cushion-foundation`: 755 words
- `ssamziegil-insadong-photo-guide`: 773 words
- `euljiro-retro-photo-spot-guide`: 886 words

다음 권장 작업:

1. EN 대표 글 중 K-뷰티 핵심 글 3개 보강:
   - `korean-skincare-routine-guide`
   - `k-beauty-base-makeup-tips`
   - `semi-matte-base-makeup-guide`
2. 또는 장소형을 계속 이어서 `gyeongbokgung-light-timing-guide`, `seongsu-cafe-photo-spots`, `seongsu-pop-up-store-guide` 보강

### 2026-04-29: EN K-뷰티 대표 글 3개 본문 품질 보강 완료

목표:

- sitemap 대표 40개 중 K-뷰티 핵심 EN 글 3개를 900 words 이상으로 끌어올린다.
- 뷰티 글 품질 게이트에 맞춰 성분명, 피부 타입, 사용량, 시간 기준, 실패 신호를 추가한다.
- 질문형 H2와 AI 패턴성 표현을 줄인다.

이번 보강 대상:

- `content/hub/en/korean-skincare-routine-guide.mdx`
- `content/hub/en/k-beauty-base-makeup-tips.mdx`
- `content/hub/en/semi-matte-base-makeup-guide.mdx`

수정 방향:

- `readTime`을 `6 Min Read`에서 `8 Min Read`로 조정
- 질문형 H2를 서술형/명사형 H2로 변경
- `korean-skincare-routine-guide`
  - 7~14일 관찰 기준, 10분 당김 체크, 2~3회 treatment night 등 실제 루틴 판단 기준 추가
  - glycerin, hyaluronic acid, panthenol, beta-glucan, allantoin, ceramides, niacinamide, centella asiatica, madecassoside, salicylic acid 등 성분 역할 설명 추가
  - morning/night split, rescue mode, 계절 조정 기준 보강
- `k-beauty-base-makeup-tips`
  - skincare settling 5~10분, cushion puff 사용량, 10~20초 pressing, 3~5시간 wear check 등 실전 기준 추가
  - glycerin, hyaluronic acid, panthenol, niacinamide, dimethicone, silica 등 성분/제형 역할 추가
  - center face/outer face, T-zone, touch-up removal-first 기준 보강
- `semi-matte-base-makeup-guide`
  - 3~4시간 wear check, powder placement, center/cheek 분리 기준 추가
  - glycerin, hyaluronic acid, panthenol, beta-glucan, dimethicone, silica 등 성분/제형 역할 추가
  - summer touch-up, dehydrated skin warning signs, semi-matte failure signs 보강
- 이미지 마크업은 추가하지 않음

단어 수 변화:

- `korean-skincare-routine-guide`
  - 기존: 662 words
  - 수정 후: 1,290 words
- `k-beauty-base-makeup-tips`
  - 기존: 696 words
  - 수정 후: 1,280 words
- `semi-matte-base-makeup-guide`
  - 기존: 688 words
  - 수정 후: 1,213 words

검증:

- 세 글 모두 EN 순수 본문 900 words 이상 통과
- 세 글 모두 H2 6개, 질문형 H2 0개
- 성분/제형 키워드 수:
  - `korean-skincare-routine-guide`: 11개
  - `k-beauty-base-makeup-tips`: 6개
  - `semi-matte-base-makeup-guide`: 6개
- 금지/주의 표현 검색 결과 없음:
  - `Overall`
  - `In conclusion`
  - `It is important to note`
  - `To summarize`
  - `Ultimately`
  - `With that in mind`
  - `Having said that`
  - `usually works best`
  - `usually works better`
  - `often works better`
  - `click here`
  - `/ko/hub`
- 내부 `/en/hub/...` 링크 dead link 없음
- `npm run build` 성공
- 남은 기존 경고: Next.js 16의 `middleware` 파일 convention deprecated 경고만 표시됨

현재 남은 sitemap 대표 EN 900 words 미만 글:

- `long-lasting-summer-makeup-guide`: 670 words
- `gyeongbokgung-light-timing-guide`: 695 words
- `seongsu-cafe-photo-spots`: 697 words
- `seongsu-pop-up-store-guide`: 731 words
- `how-to-choose-a-cushion-foundation`: 755 words
- `ssamziegil-insadong-photo-guide`: 773 words
- `euljiro-retro-photo-spot-guide`: 886 words

다음 권장 작업:

1. EN 대표 글 중 남은 K-뷰티 2개 보강:
   - `long-lasting-summer-makeup-guide`
   - `how-to-choose-a-cushion-foundation`
2. 그다음 장소형 5개 보강:
   - `gyeongbokgung-light-timing-guide`
   - `seongsu-cafe-photo-spots`
   - `seongsu-pop-up-store-guide`
   - `ssamziegil-insadong-photo-guide`
   - `euljiro-retro-photo-spot-guide`

### 2026-04-29: EN K-뷰티 대표 글 2개 추가 보강 완료

목표:

- 남은 K-뷰티 EN 대표 글 2개를 900 words 이상으로 보강한다.
- 여름 지속력/쿠션 파운데이션 글의 역할을 분리해 중복을 줄인다.
- 뷰티 글 품질 게이트에 맞춰 제형, 사용량, 시간 기준, touch-up 실패 신호를 구체화한다.

이번 보강 대상:

- `content/hub/en/long-lasting-summer-makeup-guide.mdx`
- `content/hub/en/how-to-choose-a-cushion-foundation.mdx`

수정 방향:

- `readTime`을 `6 Min Read`에서 `8 Min Read`로 조정
- 질문형 H2를 서술형/명사형 H2로 변경
- `long-lasting-summer-makeup-guide`
  - skincare settling 5~10분, 3~4시간 wear checkpoint, setting spray 30~60초 건조 기준 추가
  - 땀/유분/픽서/수정 순서를 `blot -> wait -> press -> add` 흐름으로 구체화
  - dimethicone, silica, niacinamide, sunscreen, setting spray, powder 등 제형/성분 역할 보강
  - nostrils, upper lip, chin, lower eyelids처럼 무너짐이 먼저 보이는 부위별 판단 기준 추가
- `how-to-choose-a-cushion-foundation`
  - 3~5시간 wear test, 15분 shade oxidation check, puff amount 기준 추가
  - dry/oily/combination skin별 쿠션 선택 기준 보강
  - glycerin, hyaluronic acid, panthenol, dimethicone, silica, film-forming texture 등 제형/성분 역할 보강
  - midday touch-up을 removal-first 방식으로 구체화
- 이미지 마크업은 추가하지 않음

단어 수 변화:

- `long-lasting-summer-makeup-guide`
  - 기존: 670 words
  - 수정 후: 1,233 words
- `how-to-choose-a-cushion-foundation`
  - 기존: 755 words
  - 수정 후: 1,318 words

검증:

- 두 글 모두 EN 순수 본문 900 words 이상 통과
- 두 글 모두 H2 6개, 질문형 H2 0개
- 성분/제형 키워드 수:
  - `long-lasting-summer-makeup-guide`: 6개
  - `how-to-choose-a-cushion-foundation`: 8개
- 금지/주의 표현 검색 결과 없음:
  - `Overall`
  - `In conclusion`
  - `It is important to note`
  - `To summarize`
  - `Ultimately`
  - `With that in mind`
  - `Having said that`
  - `usually works best`
  - `usually works better`
  - `often works better`
  - `click here`
  - `/ko/hub`
- 내부 `/en/hub/...` 링크 dead link 없음
- `npm run build` 성공
- 남은 기존 경고: Next.js 16의 `middleware` 파일 convention deprecated 경고만 표시됨

현재 남은 sitemap 대표 EN 900 words 미만 글:

- `gyeongbokgung-light-timing-guide`: 695 words
- `seongsu-cafe-photo-spots`: 697 words
- `seongsu-pop-up-store-guide`: 731 words
- `ssamziegil-insadong-photo-guide`: 773 words
- `euljiro-retro-photo-spot-guide`: 886 words

다음 권장 작업:

1. 장소형 EN 대표 글 5개를 900 words 이상으로 보강
2. 우선순위:
   - `gyeongbokgung-light-timing-guide`
   - `seongsu-cafe-photo-spots`
   - `seongsu-pop-up-store-guide`
   - `ssamziegil-insadong-photo-guide`
   - `euljiro-retro-photo-spot-guide`

### 2026-04-29: EN 장소형 대표 글 5개 본문 품질 보강 완료

목표:

- 남아 있던 EN 장소형 대표 글 5개를 모두 900 words 이상으로 보강했다.
- 애드센스 "가치가 별로 없는 콘텐츠" 거절 대응 관점에서 단순 소개문을 줄이고, 방문 시간, 동선, 촬영 판단 기준, 혼잡 회피 기준을 구체화했다.
- H2 질문형 반복을 제거하고, `usually works best`, `works better`, `looks strongest`처럼 AI 문장으로 보일 수 있는 반복 표현을 정리했다.

이번 보강 대상:

- `content/hub/en/gyeongbokgung-light-timing-guide.mdx`
- `content/hub/en/seongsu-cafe-photo-spots.mdx`
- `content/hub/en/seongsu-pop-up-store-guide.mdx`
- `content/hub/en/ssamziegil-insadong-photo-guide.mdx`
- `content/hub/en/euljiro-retro-photo-spot-guide.mdx`

수정 방향:

- `readTime`을 모두 `8 Min Read`로 조정
- 질문형 H2를 설명형/명사형 H2로 변경
- 장소별로 다음 정보를 추가:
  - 방문 시간 예산
  - 사진이 잘 나오는 시간대
  - 첫 방문자가 따라가기 쉬운 이동 순서
  - 혼잡하거나 빛이 좋지 않을 때의 대체 판단
  - 너무 일반적인 관광 소개가 아니라 해당 장소에서만 유효한 관찰 포인트
- 이미지 마크업은 새로 추가하지 않음

단어 수 변화:

- `gyeongbokgung-light-timing-guide`
  - 기존: 695 words
  - 수정 후: visible body 기준 1,598 words
- `seongsu-cafe-photo-spots`
  - 기존: 697 words
  - 수정 후: visible body 기준 1,390 words
- `seongsu-pop-up-store-guide`
  - 기존: 731 words
  - 수정 후: visible body 기준 1,426 words
- `ssamziegil-insadong-photo-guide`
  - 기존: 773 words
  - 수정 후: visible body 기준 1,401 words
- `euljiro-retro-photo-spot-guide`
  - 기존: 886 words
  - 수정 후: visible body 기준 1,614 words

검증:

- 5개 글 모두 EN visible body 900 words 이상 통과
- H2 질문형 0개
- 금지/주의 표현 검색 결과 없음:
  - `Overall`
  - `In conclusion`
  - `It is important to note`
  - `To summarize`
  - `Ultimately`
  - `With that in mind`
  - `Having said that`
  - `works best`
  - `works better`
  - `looks strongest`
- 내부 `/en/hub/...` 링크 dead link 없음
- 대표 EN review 글 중 900 words 미만 0개 확인
- `npm run build` 성공
- 잔여 경고: Next.js 16에서 `middleware` file convention deprecated 경고만 표시됨

다음 권장 작업:

1. KO 대표 글 중 3,500자 미만 글을 선별해 같은 방식으로 보강
2. EN 전체 대표 글의 반복 문장, 중복 결론, CTA 위치를 한 번 더 일괄 점검
3. 애드센스 재검토 전 sitemap, robots, ads.txt, 홈/허브 노출 목록 최종 확인

### 2026-04-29: KO 대표 글 1차 5개 본문 품질 보강 완료

목표:

- 대표 KO 글 중 순수 본문 3,500자 미만 최하위권 5개를 먼저 보강했다.
- 애드센스 "가치가 별로 없는 콘텐츠" 대응 관점에서 단순 소개문을 줄이고, 시간대, 동선, 사용 기준, 상황별 판단 정보를 추가했다.
- 질문형 H2 반복과 `편이` 반복 표현을 제거해 AI 문장 패턴 신호를 낮췄다.

이번 보강 대상:

- `content/hub/ko/ssamziegil-insadong-photo-guide.mdx`
- `content/hub/ko/banpo-han-river-night-view-guide.mdx`
- `content/hub/ko/yeouido-han-river-picnic-guide.mdx`
- `content/hub/ko/korean-skincare-routine-guide.mdx`
- `content/hub/ko/seokchon-lake-photo-spot-guide.mdx`

수정 방향:

- `readTime`을 모두 `8분 읽기`로 조정
- 질문형 H2를 설명형/명사형 H2로 변경
- 장소형 글에는 체류 시간, 출발 위치, 혼잡 기준, 촬영 구도, 날씨/시간대별 판단을 추가
- 스킨케어 글에는 히알루론산, 글리세린, 판테놀, 베타글루칸, 세라마이드, 나이아신아마이드, AHA/BHA, 레티놀 등 성분 역할과 단계별 반응 기준을 추가
- 새 이미지 마크업은 추가하지 않음

순수 본문 글자 수 변화:

- `ssamziegil-insadong-photo-guide`
  - 기존: 2,277자
  - 수정 후: 3,701자
- `banpo-han-river-night-view-guide`
  - 기존: 2,277자
  - 수정 후: 3,574자
- `yeouido-han-river-picnic-guide`
  - 기존: 2,280자
  - 수정 후: 3,555자
- `korean-skincare-routine-guide`
  - 기존: 2,285자
  - 수정 후: 3,773자
- `seokchon-lake-photo-spot-guide`
  - 기존: 2,294자
  - 수정 후: 3,501자

검증:

- 5개 글 모두 KO 순수 본문 3,500자 이상 통과
- H2 질문형 0개
- `편이` 표현 0개
- 금지/주의 표현 검색 결과 없음:
  - `결국`
  - `따라서`
  - `이런 이유로`
  - `정리하자면`
  - `핵심은`
  - `중요한 것은`
  - `마지막으로`
  - `요약하면`
  - `이 차이 때문에`
  - `그래서 이 방식이`
  - `결론적으로`
- 내부 `/ko/hub/...` 링크 dead link 없음
- `/en/hub/...` 혼입 없음
- `npm run build` 성공
- 잔여 경고: Next.js 16에서 `middleware` file convention deprecated 경고만 표시됨

현재 남은 대표 KO 3,500자 미만 글:

- `semi-matte-base-makeup-guide`: 2,304자
- `seongsu-cafe-photo-spots`: 2,326자
- `k-beauty-base-makeup-tips`: 2,334자
- `long-lasting-summer-makeup-guide`: 2,334자
- `how-to-choose-a-cushion-foundation`: 2,351자
- `seongsu-pop-up-store-guide`: 2,418자
- `gyeongbokgung-light-timing-guide`: 2,418자
- `euljiro-retro-photo-spot-guide`: 2,720자
- `seoul-cherry-blossom-photo-spots`: 2,742자
- `garosu-gil-cafe-photo-spots`: 2,762자
- 그 외 20개도 3,500자 미만으로 남아 있음

다음 권장 작업:

1. KO 2차 보강: 최하위 5개 우선 처리
   - `semi-matte-base-makeup-guide`
   - `seongsu-cafe-photo-spots`
   - `k-beauty-base-makeup-tips`
   - `long-lasting-summer-makeup-guide`
   - `how-to-choose-a-cushion-foundation`
2. 이후 장소형 KO 묶음:
   - `seongsu-pop-up-store-guide`
   - `gyeongbokgung-light-timing-guide`
   - `euljiro-retro-photo-spot-guide`
   - `seoul-cherry-blossom-photo-spots`
   - `garosu-gil-cafe-photo-spots`

### 2026-04-29: KO 대표 글 2차 5개 본문 품질 보강 완료

목표:

- KO 1차 이후 남아 있던 최하위권 대표 글 5개를 3,500자 이상으로 보강했다.
- 뷰티 글은 성분, 제형, 시간 경과, 부위별 무너짐 기준을 추가했고, 성수 카페 글은 체류 시간, 거리, 시간대, 혼잡 대응 기준을 보강했다.
- 질문형 H2 반복과 `편이` 반복 표현, 금지 마무리 표현을 제거했다.

이번 보강 대상:

- `content/hub/ko/semi-matte-base-makeup-guide.mdx`
- `content/hub/ko/seongsu-cafe-photo-spots.mdx`
- `content/hub/ko/k-beauty-base-makeup-tips.mdx`
- `content/hub/ko/long-lasting-summer-makeup-guide.mdx`
- `content/hub/ko/how-to-choose-a-cushion-foundation.mdx`

수정 방향:

- `readTime`을 모두 `8분 읽기`로 조정
- 질문형 H2를 설명형/명사형 H2로 변경
- `seongsu-cafe-photo-spots`의 KO 금지 카테고리 `서울 명소 & 포토존`을 `한국 명소 & 포토존`으로 수정
- 뷰티 글에 다음 구체 정보를 추가:
  - 글리세린, 히알루론산, 판테놀, 세라마이드, 실리카, 보론 나이트라이드, 레티놀, AHA/BHA 등 성분/제형 역할
  - 3~5분, 5~10분, 15분, 20~30cm, 30~60초, 3~5시간 같은 시간/거리 기준
  - 코 옆, 콧등, 턱, 인중, 눈 밑, 입가 등 부위별 무너짐 판단
  - 수정 전 유분 제거, 얇은 레이어, 압착, 파우더 위치 기준
- 성수 카페 글에 다음 구체 정보를 추가:
  - 20~30분, 60~90분, 30분 이하 일정별 촬영 전략
  - 카페 외관에서 3~5m 물러나는 거리 기준
  - 평일 오전, 오후 2~4시, 늦은 오후, 비 오는 날의 사진 차이
  - 정면 컷, 측면 외관, 골목 끝, 창 반사 컷의 역할 분리
- 새 이미지 마크업은 추가하지 않음

순수 본문 글자 수 변화:

- `semi-matte-base-makeup-guide`
  - 기존: 2,304자
  - 수정 후: 3,734자
- `seongsu-cafe-photo-spots`
  - 기존: 2,326자
  - 수정 후: 3,510자
- `k-beauty-base-makeup-tips`
  - 기존: 2,334자
  - 수정 후: 3,740자
- `long-lasting-summer-makeup-guide`
  - 기존: 2,334자
  - 수정 후: 3,559자
- `how-to-choose-a-cushion-foundation`
  - 기존: 2,351자
  - 수정 후: 3,586자

검증:

- 5개 글 모두 KO 순수 본문 3,500자 이상 통과
- H2 질문형 0개
- `편이` 표현 0개
- 금지/주의 표현 검색 결과 없음:
  - `결국`
  - `따라서`
  - `이런 이유로`
  - `정리하자면`
  - `핵심은`
  - `중요한 것은`
  - `마지막으로`
  - `요약하면`
  - `이 차이 때문에`
  - `그래서 이 방식이`
  - `결론적으로`
- 내부 `/ko/hub/...` 링크 dead link 없음
- `/en/hub/...` 혼입 없음
- `git diff --check` 통과
- `npm run build` 성공
- 잔여 경고: Next.js 16에서 `middleware` file convention deprecated 경고만 표시됨

현재 남은 대표 KO 3,500자 미만 글:

- `seongsu-pop-up-store-guide`: 2,418자
- `gyeongbokgung-light-timing-guide`: 2,418자
- `euljiro-retro-photo-spot-guide`: 2,720자
- `seoul-cherry-blossom-photo-spots`: 2,742자
- `garosu-gil-cafe-photo-spots`: 2,762자
- `bukchon-hanok-photo-spots`: 2,823자
- `bukchon-hanbok-photo-route`: 2,849자
- `han-river-park-hub`: 2,869자
- `how-to-get-glass-skin`: 2,890자
- `myeongdong-hub`: 2,933자
- 그 외 15개도 3,500자 미만으로 남아 있음

다음 권장 작업:

1. KO 3차 보강: 장소형 최하위 5개 우선 처리
   - `seongsu-pop-up-store-guide`
   - `gyeongbokgung-light-timing-guide`
   - `euljiro-retro-photo-spot-guide`
   - `seoul-cherry-blossom-photo-spots`
   - `garosu-gil-cafe-photo-spots`
2. 이후 Bukchon/Han River/뷰티 hub 글 순서로 3,500자 미만을 계속 제거

### 2026-04-29: 내일 작업용 인수인계 요약

오늘까지 완료한 핵심 작업:

- 애드센스 "가치가 별로 없는 콘텐츠" 거절 대응으로 sitemap 대표 글 중심의 품질 보강을 진행했다.
- EN 대표 글은 900 words 미만을 모두 제거했다.
  - EN 장소형 5개 보강 완료
  - EN K-뷰티 5개 보강 완료
  - 대표 EN review 글 중 900 words 미만: 0개
- KO 대표 글은 1차와 2차로 총 10개를 3,500자 이상으로 보강했다.
  - KO 1차 완료:
    - `ssamziegil-insadong-photo-guide`
    - `banpo-han-river-night-view-guide`
    - `yeouido-han-river-picnic-guide`
    - `korean-skincare-routine-guide`
    - `seokchon-lake-photo-spot-guide`
  - KO 2차 완료:
    - `semi-matte-base-makeup-guide`
    - `seongsu-cafe-photo-spots`
    - `k-beauty-base-makeup-tips`
    - `long-lasting-summer-makeup-guide`
    - `how-to-choose-a-cushion-foundation`
- `seongsu-cafe-photo-spots`의 KO 금지 카테고리 `서울 명소 & 포토존`을 `한국 명소 & 포토존`으로 수정했다.
- 오늘 작업한 모든 묶음에서 다음 검증을 통과했다.
  - 순수 본문 기준 충족
  - 질문형 H2 0개
  - `편이` 반복 0개
  - 금지/주의 표현 검색 결과 없음
  - 내부 locale 링크 dead link 없음
  - `/en/hub/...`와 `/ko/hub/...` 혼입 없음
  - `npm run build` 성공
- 남은 빌드 경고는 기존 Next.js 16 `middleware` file convention deprecated 경고뿐이다.

내일 가장 먼저 할 작업:

1. KO 3차 보강을 진행한다.
2. 대상은 장소형 최하위 5개다.
   - `content/hub/ko/seongsu-pop-up-store-guide.mdx` — 현재 2,418자
   - `content/hub/ko/gyeongbokgung-light-timing-guide.mdx` — 현재 2,418자
   - `content/hub/ko/euljiro-retro-photo-spot-guide.mdx` — 현재 2,720자
   - `content/hub/ko/seoul-cherry-blossom-photo-spots.mdx` — 현재 2,742자
   - `content/hub/ko/garosu-gil-cafe-photo-spots.mdx` — 현재 2,762자
3. 각 글은 순수 본문 3,500자 이상으로 보강한다.
4. 장소형 글이므로 다음 정보를 우선 추가한다.
   - 방문 시간 예산
   - 첫 방문 동선
   - 시간대별 빛/혼잡 차이
   - 촬영 위치와 거리 기준
   - 날씨나 계절에 따른 대체 판단
   - 해당 장소에서만 유효한 관찰 포인트
5. 이미지 마크업은 새로 추가하지 않는다.
6. 작업 후 반드시 검증한다.
   - KO 순수 본문 3,500자 이상
   - H2 질문형 0개
   - `편이` 반복 0개
   - 금지 표현 없음:
     - `결국`
     - `따라서`
     - `이런 이유로`
     - `정리하자면`
     - `핵심은`
     - `중요한 것은`
     - `마지막으로`
     - `요약하면`
     - `이 차이 때문에`
     - `그래서 이 방식이`
     - `결론적으로`
   - KO 내부 링크 dead link 없음
   - `/en/hub/...` 혼입 없음
   - `git diff --check`
   - `npm run build`
7. 완료 후 이 파일 하단에 `KO 대표 글 3차 5개 본문 품질 보강 완료` 기록을 추가한다.

KO 3차 이후 남은 흐름:

- 다음 후보:
  - `bukchon-hanok-photo-spots`
  - `bukchon-hanbok-photo-route`
  - `han-river-park-hub`
  - `how-to-get-glass-skin`
  - `myeongdong-hub`
- 목표는 대표 KO review 글의 3,500자 미만을 계속 줄이는 것이다.
- KO 글 보강이 일정 수준 끝나면 EN 전체 대표 글의 반복 문장, 중복 결론, CTA 위치를 한 번 더 일괄 점검한다.
- 애드센스 재검토 직전에는 sitemap, robots.txt, ads.txt, 홈/허브 노출 목록을 최종 확인한다.

### 2026-04-30: KO 대표 글 3차 5개 본문 품질 보강 완료

목표:

- KO 2차 이후 남아 있던 장소형 최하위권 대표 글 5개를 3,500자 이상으로 보강했다.
- 방문 시간 예산, 첫 방문 동선, 시간대별 빛과 혼잡 차이, 촬영 거리 기준, 계절/날씨별 대체 판단을 추가했다.
- 질문형 H2와 `편이` 반복 표현, 금지 마무리 표현을 제거했다.

이번 보강 대상:

- `content/hub/ko/seongsu-pop-up-store-guide.mdx`
- `content/hub/ko/gyeongbokgung-light-timing-guide.mdx`
- `content/hub/ko/euljiro-retro-photo-spot-guide.mdx`
- `content/hub/ko/seoul-cherry-blossom-photo-spots.mdx`
- `content/hub/ko/garosu-gil-cafe-photo-spots.mdx`

수정 방향:

- `readTime`을 모두 `8분 읽기`로 조정
- 질문형/대시형 H2를 설명형/명사형 H2로 변경
- `seongsu-pop-up-store-guide`의 KO 금지 카테고리 `서울 명소 & 포토존`을 `한국 명소 & 포토존`으로 수정
- 성수 팝업 글에는 60~90분 방문 시간, 대기 줄 회전 속도, 카페 휴식 복귀 동선, 짐/예약 목적별 판단 기준 추가
- 경복궁 글에는 오전/한낮/오후/연못/야간개장별 촬영 우선순위, 2시간 체류 기준, 야간 노출과 퇴장 동선 기준 추가
- 을지로 글에는 90분 촬영 루트, 금속 골목 재료감, 초저녁 반사광, 작업장 골목 매너, 계절별 표면 질감 추가
- 서울 벚꽃 글에는 60~90분 체류 기준, 보행로 폭, 공원형/강변형/동네형 선택 기준, 바람/흐림/비 온 뒤 촬영 판단 추가
- 가로수길 카페 글에는 40~60분 카페 체류 기준, 창가/테라스 역할 분리, 한 블록 안쪽 골목 기준, 비 오는 날 창가 사진 기준 추가
- 새 이미지 마크업은 추가하지 않음

순수 본문 글자 수 변화:

- `seongsu-pop-up-store-guide`
  - 기존: 2,418자
  - 수정 후: 3,565자
- `gyeongbokgung-light-timing-guide`
  - 기존: 2,418자
  - 수정 후: 3,533자
- `euljiro-retro-photo-spot-guide`
  - 기존: 2,720자
  - 수정 후: 3,702자
- `seoul-cherry-blossom-photo-spots`
  - 기존: 2,742자
  - 수정 후: 3,554자
- `garosu-gil-cafe-photo-spots`
  - 기존: 2,762자
  - 수정 후: 3,632자

검증:

- 5개 글 모두 KO 순수 본문 3,500자 이상 통과
- H2 질문형 0개
- `편이` 표현 0개
- 금지/주의 표현 검색 결과 없음:
  - `결국`
  - `따라서`
  - `이런 이유로`
  - `정리하자면`
  - `핵심은`
  - `중요한 것은`
  - `마지막으로`
  - `요약하면`
  - `이 차이 때문에`
  - `그래서 이 방식이`
  - `결론적으로`
- 내부 `/ko/hub/...` 링크 dead link 없음
- `/en/hub/...` 혼입 없음
- `git diff --check` 통과
- `npm run build` 성공
- 잔여 경고: Next.js 16에서 `middleware` file convention deprecated 경고만 표시됨

현재 다음 대표 KO 3,500자 미만 후보:

- `bukchon-hanok-photo-spots`: 2,823자
- `bukchon-hanbok-photo-route`: 2,849자
- `han-river-park-hub`: 2,869자
- `how-to-get-glass-skin`: 2,890자
- `myeongdong-hub`: 2,933자

다음 권장 작업:

1. KO 4차 보강: Bukchon/Han River/뷰티 hub 묶음 우선 처리
   - `bukchon-hanok-photo-spots`
   - `bukchon-hanbok-photo-route`
   - `han-river-park-hub`
   - `how-to-get-glass-skin`
   - `myeongdong-hub`
2. 각 글을 순수 본문 3,500자 이상으로 보강
3. 장소형 글은 시간대, 동선, 혼잡, 촬영 거리 기준을 추가하고, 뷰티 글은 성분/피부 타입/사용량/실패 신호 기준을 추가
4. 작업 후 같은 검증 세트 반복

### 2026-04-30: KO 대표 글 4차 5개 본문 품질 보강 완료

목표:

- KO 3차 이후 남아 있던 Bukchon/Han River/뷰티 hub 묶음 5개를 3,500자 이상으로 보강했다.
- 장소형 글은 시간대, 동선, 혼잡, 촬영 거리, 계절/날씨 판단을 추가했다.
- 뷰티 글은 성분, 피부 타입, 사용 간격, 실패 신호, 아침/밤 루틴 판단 기준을 보강했다.
- 질문형 H2와 `편이` 반복 표현, 금지 마무리 표현을 제거했다.

이번 보강 대상:

- `content/hub/ko/bukchon-hanok-photo-spots.mdx`
- `content/hub/ko/bukchon-hanbok-photo-route.mdx`
- `content/hub/ko/han-river-park-hub.mdx`
- `content/hub/ko/how-to-get-glass-skin.mdx`
- `content/hub/ko/myeongdong-hub.mdx`

수정 방향:

- `readTime`을 모두 `8분 읽기`로 조정
- 질문형/대시형 H2를 설명형/명사형 H2로 변경
- `bukchon-hanok-photo-spots`
  - 60~90분 방문 기준, 안국 초입에서 시작하는 촬영 흐름, 주말 대체 골목 선택, 날씨/계절별 담장과 지붕선 판단, 주민 생활 공간 촬영 매너 추가
- `bukchon-hanbok-photo-route`
  - 한복 착용 시 90분 동선, 짐/소품 관리, 한복 색과 골목 밀도, 비/눈/바람 상황의 짧은 동선, 세로/가로 컷 역할 분리 추가
- `han-river-park-hub`
  - 2~3시간 체류 기준, 계절별 한강공원 선택, 바람/비/미세먼지 판단, 피크닉 자리 기준, 데이트 일정 시간 배분 추가
- `how-to-get-glass-skin`
  - 존댓말 문체를 평서형으로 통일
  - 히알루론산, 글리세린, 판테놀, 베타글루칸, 세라마이드, 나이아신아마이드 등 성분 역할 추가
  - 3~4시간 뒤 피부 반응, 5~7일 단위 제품 변경, 아침 세안 직후 점검 기준 추가
- `myeongdong-hub`
  - 2시간 방문 기준, 캐리어/쇼핑백 관리, 비 오는 날 야간 반사, K-뷰티 제품군별 쇼핑 순서, 명동 사진 프레임 정리 기준 추가
- 새 이미지 마크업은 추가하지 않음

순수 본문 글자 수 변화:

- `bukchon-hanok-photo-spots`
  - 기존: 2,823자
  - 수정 후: 3,557자
- `bukchon-hanbok-photo-route`
  - 기존: 2,849자
  - 수정 후: 3,512자
- `han-river-park-hub`
  - 기존: 2,869자
  - 수정 후: 3,610자
- `how-to-get-glass-skin`
  - 기존: 2,890자
  - 수정 후: 3,572자
- `myeongdong-hub`
  - 기존: 2,933자
  - 수정 후: 3,630자

검증:

- 5개 글 모두 KO 순수 본문 3,500자 이상 통과
- H2 질문형 0개
- `편이` 표현 0개
- 금지/주의 표현 검색 결과 없음:
  - `결국`
  - `따라서`
  - `이런 이유로`
  - `정리하자면`
  - `핵심은`
  - `중요한 것은`
  - `마지막으로`
  - `요약하면`
  - `이 차이 때문에`
  - `그래서 이 방식이`
  - `결론적으로`
- 내부 `/ko/hub/...` 링크 dead link 없음
- `/en/hub/...` 혼입 없음
- `git diff --check` 통과
- `npm run build` 성공
- 잔여 경고: Next.js 16에서 `middleware` file convention deprecated 경고만 표시됨

현재 다음 KO 3,500자 미만 최하위 후보:

- `personal-color-hair-dye-guide`: 1,733자
- `how-to-keep-bangs-in-place-all-day`: 1,877자
- `hair-colors-that-brighten-your-face`: 1,924자
- `how-to-add-root-volume-at-home`: 2,079자
- `hair-color-ideas-by-skin-tone`: 2,222자

다음 권장 작업:

1. KO 5차 보강: 헤어/염색 최하위 5개 우선 처리
   - `personal-color-hair-dye-guide`
   - `how-to-keep-bangs-in-place-all-day`
   - `hair-colors-that-brighten-your-face`
   - `how-to-add-root-volume-at-home`
   - `hair-color-ideas-by-skin-tone`
2. 각 글을 순수 본문 3,500자 이상으로 보강
3. 헤어 글은 모발 레벨, 손상도, 염색 잔색, 스타일 지속 시간, 실패 신호, 제품/도구 사용량 기준을 추가
4. 작업 후 같은 검증 세트 반복
