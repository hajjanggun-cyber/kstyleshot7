# kstyleshot - TODO Handoff

작성: Codex (GPT-5)
기록 시각: 2026-03-04 21:32:28 +09:00 (Asia/Seoul)
기준 문서: `plan.md`

## 다음 세션 즉시 시작 (추가 기록)

추가 기록 시각: 2026-03-04 22:04:15 +09:00 (Asia/Seoul)

퇴근 후 집에서 바로 이어서 할 첫 작업:

1. `post.md`의 1차 발행 20개 기준으로, 샘플 2개를 제외한 나머지 `.mdx` 초안 파일들을 `content/blog/en`, `content/blog/ko`에 일괄 생성
2. 현재의 단순 본문 렌더러(`SimpleMdx`)를 실제 MDX 컴파일/렌더링 구조로 교체해서, 서식과 JSX 확장성을 제대로 지원

바로 시작할 때 볼 파일:

1. `post.md`
2. `content/blog/en/`
3. `content/blog/ko/`
4. `lib/blog.ts`
5. `components/common/SimpleMdx.tsx`
6. `app/blog/[lang]/[slug]/page.tsx`

이 문서는 지금까지 작업한 범위와, 다음에 어디서부터 이어서 해야 하는지를 정리한 인계 문서다.

---

## 1. 현재 상태 요약

프로젝트는 이제 "빈 폴더"가 아니다.

현재 상태:

1. Next.js 16 App Router 기본 골격 생성 완료
2. `plan.md` 기준 구조로 라우트/컴포넌트/API 뼈대 생성 완료
3. create 플로우는 로컬 mock 기반으로 끝까지 클릭 가능한 UX 구현 완료
4. 실제 Polar / Redis / AI provider 연동은 아직 미구현

즉:

- 프론트 UX 데모는 됨
- 실제 결제/세션/생성 백엔드는 아직 placeholder

---

## 2. 지금까지 완료한 것

### 2.1 문서

1. 기존 `plan.md` 전면 폐기 후 새 실행용 계획서로 교체 완료
2. `plan.md` 상단에 작성자와 시각 기록 완료

관련 파일:

- `plan.md`

### 2.2 프로젝트 골격

1. `package.json`, `tsconfig.json`, `next.config.mjs`, `proxy.ts` 생성 완료
2. `next-intl` 구조를 `i18n/request.ts` + `i18n/routing.ts` 기준으로 정리 완료
3. `app/[lang]` 구조와 법무 페이지, create 하위 단계 페이지 생성 완료
4. API route 스캐폴드 생성 완료

관련 핵심 파일:

- `package.json`
- `next.config.mjs`
- `proxy.ts`
- `i18n/request.ts`
- `i18n/routing.ts`

### 2.3 공용 레이어

1. 타입 정의 생성 완료
2. Zustand 스토어 생성 완료
3. Redis / Polar / Replicate / Refund / Canvas / Jobs helper 파일 생성 완료
4. 샘플 데이터 파일 생성 완료

관련 핵심 파일:

- `types/index.ts`
- `store/createStore.ts`
- `lib/redis.ts`
- `lib/polar.ts`
- `lib/replicate.ts`
- `lib/refund.ts`
- `lib/canvas.ts`
- `lib/jobs.ts`
- `data/hairStyles.ts`
- `data/outfits.ts`
- `data/backgrounds.ts`

### 2.4 기능형 UX (로컬 mock)

현재 create 플로우는 아래가 실제로 된다:

1. `/[lang]/create`에서 로컬 데모 플로우 진입
2. `/[lang]/create/upload`에서 이미지 업로드 + 미리보기
3. `/[lang]/create/hair`에서 2개 선택 -> mock 생성 -> 1개 선택
4. `/[lang]/create/outfit`에서 2개 선택 -> mock 생성 -> 1개 선택
5. `/[lang]/create/location`에서 2개 선택 -> mock 합성 결과 생성 -> 1개 선택
6. `/[lang]/create/done`에서 최종 결과 미리보기 + 다운로드 + 로컬 데이터 삭제

중요:

- 실제 AI 이미지는 아직 아님
- `lib/mockResults.ts`로 SVG 기반 mock preview 생성 중

관련 핵심 파일:

- `components/create/PhotoUpload.tsx`
- `components/create/StyleSelector.tsx`
- `components/create/BackgroundSelector.tsx`
- `components/create/ResultGrid.tsx`
- `components/create/FinalResult.tsx`
- `components/common/DownloadButton.tsx`
- `lib/mockResults.ts`
- `app/[lang]/create/upload/page.tsx`
- `app/[lang]/create/hair/page.tsx`
- `app/[lang]/create/outfit/page.tsx`
- `app/[lang]/create/location/page.tsx`
- `app/[lang]/create/done/page.tsx`

### 2.5 검증 완료

실행 확인:

1. `npm.cmd install` 완료
2. `npm.cmd run typecheck` 통과
3. `npm.cmd run build` 통과

주의:

- `next build`는 기본 샌드박스에서 `spawn EPERM`이 날 수 있어서, 이전 세션에서는 권한 상승으로 검증함

---

## 3. 아직 안 된 것 (핵심 미구현)

### 3.1 결제 / 세션

아직 placeholder 상태:

1. `POST /api/checkout/create` 실제 Polar checkout 생성 미구현
2. `POST /api/webhooks/polar` 실제 Polar SDK 검증 미구현
3. `order.paid` 수신 후 Redis에 `job:`, `checkout:`, `session:` 키 생성 미구현
4. `GET /api/session/status`는 Redis 조회 구조만 있고, 실제 checkout 연동 미완료

현재 파일:

- `app/api/checkout/create/route.ts`
- `app/api/webhooks/polar/route.ts`
- `app/api/session/status/route.ts`

### 3.2 실제 생성 파이프라인

아직 전부 placeholder:

1. 헤어 생성 provider 호출 미구현
2. `jobs/start`, `jobs/status`, `jobs/select` 실제 상태 전이 미구현
3. Prediction polling 미구현
4. 환불 멱등성 + 실제 `POST /v1/refunds` 미구현

현재 파일:

- `app/api/jobs/start/route.ts`
- `app/api/jobs/status/route.ts`
- `app/api/jobs/select/route.ts`
- `lib/replicate.ts`
- `lib/refund.ts`

### 3.3 의상 단계의 상용 모델

가장 중요한 미해결 이슈:

1. 현재 `plan.md` 기준으로 기존 `cuuupid/idm-vton` 직접 사용 금지
2. 상용 사용 가능한 outfit provider가 아직 선정되지 않음
3. 그래서 현재 outfit 단계는 UX mock만 있고, 실연동 시작하면 여기서 막힘

즉:

- 의상 기능을 진짜로 만들기 전에 provider 선정이 먼저 필요

### 3.4 배경 제거(cutout)

1. 배경 제거 provider 미선정
2. `cutout_processing` 상태만 있고 실제 실행 로직 없음
3. 현재 location 단계도 mock 결과일 뿐, 실제 transparent PNG 기반 합성은 아직 연결 안 됨

### 3.5 실제 자산

아직 없음:

1. 배경 이미지 실파일
2. 헤어 샘플 이미지 실파일
3. 의상 샘플 / garment 이미지 실파일
4. 법무 최종 문구

현재 `public/backgrounds`, `public/samples`는 폴더 placeholder 수준

---

## 4. 다음에 바로 시작할 지점 (우선순위)

다음 시작은 여기서부터 하는 게 맞다:

### 1순위: 결제 -> 세션 handshake 실구현

먼저 해야 할 파일:

1. `app/api/checkout/create/route.ts`
2. `app/api/webhooks/polar/route.ts`
3. `app/api/session/status/route.ts`
4. `lib/polar.ts`
5. `lib/redis.ts`

목표:

1. Polar checkout 생성
2. 성공 URL에 `checkout_id={CHECKOUT_ID}` 넣기
3. 웹훅에서 `order.paid` 처리
4. `checkout:{checkoutId} -> orderId`
5. `session:{sessionToken} -> orderId`
6. `job:{orderId}` 생성

이게 먼저인 이유:

- 이 연결이 안 되면 지금 upload 단계의 "로컬 데모 세션"을 실제 세션으로 바꿀 수 없음

### 2순위: upload 단계에서 로컬 데모 세션 제거

수정할 파일:

1. `components/create/PhotoUpload.tsx`
2. `app/[lang]/create/upload/page.tsx`

할 일:

1. 현재 local demo fallback 제거
2. `checkout_id`가 있으면 실제 `/api/session/status` 폴링
3. `sessionToken` 수신 후 `sessionStorage` 저장
4. URL query 정리

### 3순위: 헤어 단계 실연동

수정할 파일:

1. `lib/replicate.ts`
2. `app/api/jobs/start/route.ts`
3. `app/api/jobs/status/route.ts`
4. `app/api/jobs/select/route.ts`
5. `app/[lang]/create/hair/page.tsx`

할 일:

1. `flux-kontext-pro` 호출 구현
2. 반드시 `input_image` 사용
3. 헤어 2개 병렬 생성
4. polling으로 완료 상태 반영
5. mock 결과 대신 실제 결과 URL 표시

이 시점부터 "진짜 생성 플로우"가 시작됨

---

## 5. 그 다음 순서

헤어가 붙은 뒤에는 아래 순서가 맞다:

1. `jobs/select` 정리
2. `Delete my data` 실제 키 정리 강화
3. 배경 제거 provider 선정 및 `cutout` 단계 구현
4. 배경 합성에 실제 `lib/canvas.ts` 연결
5. 의상 provider 확정 후 outfit 단계 실연동
6. 법무 페이지 문구 확정
7. 실제 이미지 자산 투입

중요:

- 의상은 provider 미선정 상태라, 지금 당장 코딩 들어가면 중간에 다시 뜯게 됨
- 그래서 헤어까지 먼저 실연동하고, 그 다음 cutout/outfit 순서가 안전함

---

## 6. 지금 파일 기준 주의사항

### 6.1 로컬 mock가 들어간 파일

아래는 나중에 실제 API로 교체해야 한다:

1. `lib/mockResults.ts`
2. `app/[lang]/create/hair/page.tsx`
3. `app/[lang]/create/outfit/page.tsx`
4. `app/[lang]/create/location/page.tsx`

### 6.2 실제 연동 전까지 유지해야 하는 규칙

1. `plan.md`의 `checkout_id -> session status polling` 구조는 유지
2. `sessionToken`을 URL에 직접 남기지 말 것
3. `job:{orderId}` 단일 객체를 진실 원본으로 유지
4. 상용 불가 모델은 연결하지 말 것

### 6.3 현재 UX는 데모용

지금 브라우저에서 보이는 create 플로우는:

- "작동하는 UX 데모"이지
- "실결제/실생성 서비스"는 아니다

이 점을 잊고 바로 배포 단계로 가면 안 된다.

---

## 7. 다음 작업 시작 추천 명령

다음에 와서 바로 이어서 하려면:

1. `npm.cmd run dev`
2. 브라우저에서 `/en/create`부터 흐름 확인
3. 그 다음 `app/api/checkout/create/route.ts`부터 실제 구현 시작

검증 명령:

1. `npm.cmd run typecheck`
2. `npm.cmd run build`

---

## 8. 다음 세션에서 첫 요청 추천

다음에 이어서 작업할 때는 이렇게 시작하면 된다:

`todo.md 보고 1순위부터 진행해. Polar checkout + webhook + session status 실제 구현부터 해`

이렇게 하면 지금 상태를 바로 이어받을 수 있다.

---

## 추가 기록 (2026-03-04 23:54:12 +09:00)

이 아래 내용이 현재 최신 상태다. 위쪽 문서에는 "미구현"으로 적혀 있는 부분이 일부 이미 진행됐다.

### 1. 이번 세션에서 실제로 끝낸 것

#### 1.1 블로그 1차 발행분 초안 채움

완료:

1. `post.md`의 1차 발행 20개 기준으로, 기존 샘플 2개를 제외한 나머지 18개 `.mdx` 초안 생성 완료
2. 현재 `content/blog/en`, `content/blog/ko`에는 1차 발행 20개가 모두 채워진 상태

관련 파일:

- `content/blog/en/*.mdx`
- `content/blog/ko/*.mdx`

#### 1.2 블로그 본문 렌더러를 실제 MDX로 교체

완료:

1. 기존 줄 단위 파서(`SimpleMdx`) 제거
2. `next-mdx-remote` 기반으로 실제 MDX 컴파일/렌더링 구조로 교체
3. 링크와 리스트가 MDX 기준으로 렌더링되도록 정리
4. `package.json`, `package-lock.json`에 MDX 의존성 반영

관련 파일:

- `components/common/SimpleMdx.tsx`
- `package.json`
- `package-lock.json`

주의:

- 현재 frontmatter 파싱은 여전히 `lib/blog.ts`의 경량 파서를 사용
- 본문 렌더링만 실제 MDX로 바뀐 상태

#### 1.3 결제 -> 세션 handshake 백엔드 실구현

완료:

1. `POST /api/checkout/create`에서 실제 Polar checkout 생성 요청
2. 성공 시 `checkoutId`, `checkoutUrl` 반환
3. `POST /api/webhooks/polar`에서 Polar 웹훅 서명 검증 로직 추가
4. `order.paid`만 처리하도록 제한
5. 웹훅 처리 시 아래 Redis 키 생성

- `webhook:event:{eventId}`
- `checkout:{checkoutId} -> orderId`
- `session:{sessionToken} -> orderId`
- `job:{orderId}`

6. `GET /api/session/status`는 기존 조회 구조를 유지하면서 오류 처리 보강

관련 파일:

- `app/api/checkout/create/route.ts`
- `app/api/webhooks/polar/route.ts`
- `app/api/session/status/route.ts`
- `lib/polar.ts`
- `lib/redis.ts`

주의:

1. 실제 외부 검증은 아직 `.env.local` 실값이 없어서 미실행
2. 웹훅은 `webhook-id`, `webhook-signature`, `webhook-timestamp` 헤더 기준으로 검증 구현

#### 1.4 프론트에서 실제 세션 폴링 연결

완료:

1. `/[lang]/create`에서 `Start Polar checkout` 버튼 추가
2. 버튼 클릭 시 `/api/checkout/create` 호출 후 `checkoutUrl`로 이동
3. `/[lang]/create/upload`에서 `checkout_id`가 있으면 `/api/session/status` 폴링
4. 세션 준비 완료 시 `sessionStorage`에 아래 값 저장

- `checkoutId`
- `orderId`
- `sessionToken`
- `status`

5. 폴링 완료 후 URL에서 `checkout_id` 제거
6. `checkout_id`가 없으면 기존 로컬 데모 플로우 유지

관련 파일:

- `app/[lang]/create/page.tsx`
- `components/create/CreateCheckoutActions.tsx`
- `app/[lang]/create/upload/page.tsx`
- `components/create/PhotoUpload.tsx`

#### 1.5 로컬 테스트용 템플릿 추가

완료:

1. `.env.local.example` 추가
2. 로컬 체크아웃 handshake 테스트 순서를 별도 문서로 정리

관련 파일:

- `.env.local.example`
- `md-doc/local-dev-checkout.md`

---

### 2. 지금 기준으로 바뀐 상태 요약

이제 create 플로우는 아래처럼 바뀌었다:

1. `/[lang]/create`에서 실제 checkout 시작 가능
2. 결제 성공 후 `checkout_id`로 `/[lang]/create/upload` 복귀 가능
3. upload 단계에서 실제 세션 폴링 가능
4. 세션이 준비되면 hair 단계로 넘어갈 수 있음
5. hair/outfit/location 자체는 아직 mock 생성 UX

즉:

- 결제/세션 handshake는 "실구현됨"
- 실제 AI 생성 파이프라인은 아직 미구현

---

### 3. 지금 바로 다음 우선순위

이제 다음 시작점은 이전 문서의 1순위가 아니라, 아래가 맞다:

#### 새 1순위: 로컬 실연동 확인

먼저 해야 할 것:

1. `.env.local.example`를 복사해 `.env.local` 생성
2. `POLAR_*`, `UPSTASH_*`, `NEXT_PUBLIC_APP_URL` 실값 입력
3. `npm.cmd run dev`
4. `/en/create`에서 실제 checkout -> webhook -> upload polling 흐름 끝까지 확인

이걸 먼저 해야 하는 이유:

- 코드 구조는 붙었지만, 실환경 값으로 아직 end-to-end 검증을 안 했다

#### 새 2순위: 헤어 단계 실연동

그 다음 파일:

1. `lib/replicate.ts`
2. `app/api/jobs/start/route.ts`
3. `app/api/jobs/status/route.ts`
4. `app/api/jobs/select/route.ts`
5. `app/[lang]/create/hair/page.tsx`

목표:

1. mock hair 결과 대신 실제 provider 호출
2. polling으로 실제 job 상태 반영
3. 선택 결과를 `job:{orderId}` 기준으로 저장

#### 새 3순위: upload 단계 로컬 데모 fallback 축소

지금은 유지 중:

1. `checkout_id`가 없으면 로컬 데모 세션 허용
2. 이 fallback은 개발용으로는 유용하지만, 실제 서비스 직전에는 제거 또는 개발 모드 전용 분기 필요

---

### 4. 지금 기준 검증 상태

이번 세션에서 확인 완료:

1. `npm.cmd run typecheck` 통과
2. `npm.cmd run build` 통과

주의:

- `next build`는 기본 샌드박스에서 `spawn EPERM`이 날 수 있으므로, 이번에도 권한 상승으로 최종 확인함

---

### 5. 다음 세션에서 이렇게 시작하면 됨

다음 요청 추천:

`todo.md 최신 기록 기준으로 진행해. 먼저 .env.local 세팅 기준으로 checkout -> webhook -> upload polling 실검증부터 보자`

그 다음:

`실검증 끝나면 hair 단계 실제 생성 연결로 넘어가`

---

## 추가 기록 (2026-03-05 00:12:43 +09:00)

이 아래 내용이 현재 최신 상태다. 이번 기록은 블로그 대량 운영 준비 작업까지 반영한다.

### 1. 이번 세션에서 추가로 끝낸 것

#### 1.1 7개 카테고리 기준 420개 운영 구조 문서화

완료:

1. 블로그 카테고리를 7개로 고정
2. `EN 210 + KO 210` 기준 배분표 정리
3. 각 카테고리별 서브토픽 클러스터 구조 정리
4. Tier 1 / Tier 2 / Tier 3 기준으로 중요도와 시간 배분 기준 정리

확정 카테고리:

1. `Product / FAQ`
2. `Hair`
3. `Photo Technique`
4. `Beauty Prep`
5. `Outfit / Styling`
6. `Backdrop / Mood`
7. `Seasonal / Trend`

관련 파일:

- `md-doc/post-scale-400.md`

#### 1.2 추가 후보 280개 백로그 생성

완료:

1. 7개 카테고리 기준으로 `EN 140 + KO 140` 추가 후보 작성
2. 각 후보에 제목 + slug 조합까지 정리
3. 기존 초기 20개와 겹치지 않는 방향으로 확장 후보 확보

관련 파일:

- `md-doc/post-candidate-backlog-280.md`

#### 1.3 Tier 1 허브 40개 목록 확정

완료:

1. 현재 가장 먼저 품질 높게 쌓아야 하는 허브 글 40개를 따로 분리
2. 기존 작성분과 신규 작성분을 `Existing`, `New`로 구분
3. 기준은 `Product / FAQ`, `Hair`, `Photo Technique`만 사용

구성:

1. EN 20개
2. KO 20개

관련 파일:

- `md-doc/tier1-hub-40.md`

#### 1.4 Tier 1 신규 MDX 초안 20개 추가 작성

완료:

1. EN 신규 허브 초안 10개 작성
2. KO 신규 허브 초안 10개 작성
3. 결과적으로 현재 블로그 초안 수는 아래 상태

- `content/blog/en`: 20개
- `content/blog/ko`: 20개

이번에 추가된 핵심 파일 예시:

- `content/blog/en/why-pick-hair-before-outfit.mdx`
- `content/blog/en/what-to-expect-from-background-compositing.mdx`
- `content/blog/en/best-wispy-bang-looks-for-front-facing-photos.mdx`
- `content/blog/en/easiest-pose-fixes-for-better-9x16-portraits.mdx`
- `content/blog/ko/why-hair-comes-before-outfit-in-the-flow-ko.mdx`
- `content/blog/ko/what-to-expect-from-background-compositing-ko.mdx`
- `content/blog/ko/k-style-bangs-by-face-shape-ko.mdx`
- `content/blog/ko/selfie-framing-in-small-rooms-ko.mdx`

---

### 2. 지금 기준 블로그 상태 요약

현재 블로그는 아래 단계까지 와 있다:

1. 실제 MDX 렌더링 구조 적용 완료
2. EN 20개 초안 확보
3. KO 20개 초안 확보
4. 420개 규모 운영 구조 문서 완료
5. 추가 후보 280개 백로그 완료
6. Tier 1 허브 40개 우선순위 목록 완료

즉:

- "무엇을 써야 하는지" 구조는 잡힘
- "가장 먼저 써야 할 허브 글"도 정리됨
- 실제 대량 초안 생성 배치로 바로 이어갈 수 있음

---

### 3. 지금 바로 다음 우선순위

#### 새 1순위: checkout -> webhook -> upload polling 실환경 검증

먼저 해야 할 것:

1. `.env.local.example` 기준으로 `.env.local` 생성
2. `POLAR_*`, `UPSTASH_*`, `NEXT_PUBLIC_APP_URL` 실값 입력
3. `npm.cmd run dev`
4. `/en/create`에서 실제 checkout 시작
5. 결제 후 `/[lang]/create/upload?checkout_id=...` 복귀
6. `/api/session/status` 폴링으로 세션이 실제로 붙는지 확인
7. URL에서 `checkout_id`가 제거되는지 확인

이게 먼저인 이유:

- 결제/세션 코드는 붙었지만, 아직 실환경 end-to-end 확인이 남아 있다

#### 새 2순위: hair 단계 실연동

다음으로 바로 갈 파일:

1. `lib/replicate.ts`
2. `app/api/jobs/start/route.ts`
3. `app/api/jobs/status/route.ts`
4. `app/api/jobs/select/route.ts`
5. `app/[lang]/create/hair/page.tsx`

목표:

1. mock hair 결과 제거
2. 실제 provider 호출 연결
3. polling으로 실제 job 상태 반영
4. `job:{orderId}` 기준으로 선택 상태 저장

#### 새 3순위: Tier 2 블로그 배치 작성

블로그 기준 다음 단계:

1. `md-doc/post-candidate-backlog-280.md`에서 다음 40개 선별
2. Tier 2 묶음 문서 따로 생성
3. 같은 방식으로 EN/KO `.mdx` 초안 배치 생성

이 순서가 좋은 이유:

1. Tier 1 허브 40개를 기준으로 내부 링크 구조가 잡힌다
2. 그 다음 Tier 2는 연결형 글로 빠르게 확장 가능하다

---

### 4. 지금 기준 검증 상태

이번 세션에서 확인 완료:

1. 블로그 추가 초안 20개 생성 후 `npm.cmd run build` 통과
2. `/blog/[lang]/[slug]` 정적 페이지 수 증가 확인

주의:

- 실환경 Polar/Upstash 연동 검증은 아직 미완료
- 블로그 문서는 구조와 초안은 충분하지만, 고품질 다듬기 작업은 아직 남아 있음

---

### 5. 다음 세션에서 이렇게 시작하면 됨

실연동부터 볼 때:

`todo.md 최신 기록 기준으로 진행해. 먼저 .env.local 세팅하고 checkout -> webhook -> upload polling 실환경 검증부터 하자`

블로그부터 더 밀 때:

`todo.md 최신 기록 기준으로 진행해. tier1-hub-40 다음으로 Tier 2 블로그 40개 선별하고 초안 배치 생성하자`

---

## 추가 기록 (2026-03-05 15:20:00 +09:00)

이 섹션이 현재 최신 상태다. 아래 내용을 기준으로 이어서 작업하면 된다.

### 1. 이번 세션에서 완료한 것

#### 1.1 결제/세션 실검증 준비 및 상태 확인

완료:

1. `.env.local` 생성 완료 (`.env.local.example` 복사)
2. 로컬 서버 기준 handshake 엔드포인트 응답 확인
3. 실키 미입력 상태에서의 실패 원인 메시지 확인

확인된 응답:

1. `POST /api/checkout/create` -> `POLAR_ACCESS_TOKEN` 누락
2. `GET /api/session/status` -> `UPSTASH_REDIS_REST_URL` 누락
3. `POST /api/webhooks/polar` -> `POLAR_WEBHOOK_SECRET` 누락

즉:

- 코드 경로는 연결됨
- 실환경 E2E는 `.env.local` 실값 입력이 남아 있음

#### 1.2 hair 단계 실연동 완료 (mock 제거)

완료:

1. `lib/replicate.ts`에 실제 prediction start/poll 구현 (`flux-kontext-pro`, `input_image` 사용)
2. `POST /api/jobs/start` hair 시작 로직 구현
3. `GET /api/jobs/status` polling + 완료/실패 상태 반영 구현
4. `POST /api/jobs/select` hair 선택 저장 + `outfit_selecting` 전이 구현
5. `app/[lang]/create/hair/page.tsx`를 실제 API 호출 + polling UI로 교체

관련 파일:

1. `lib/replicate.ts`
2. `app/api/jobs/start/route.ts`
3. `app/api/jobs/status/route.ts`
4. `app/api/jobs/select/route.ts`
5. `app/[lang]/create/hair/page.tsx`
6. `types/index.ts` (`generatedResults` 추가)
7. `lib/jobs.ts`, `lib/polar.ts` (job 저장/초기 구조 보강)

#### 1.3 블로그 배치 확장 완료

완료:

1. Tier 2 배치 40개(EN20+KO20) 생성
2. Wave 2 배치 40개(EN20+KO20) 생성
3. 현재 총 글 수: `EN 60`, `KO 60`

관련 문서:

1. `md-doc/tier2-batch-40.md`
2. `md-doc/next-batch-40-wave2.md`

#### 1.4 SEO 강화 작업 완료

완료:

1. Wave 2 글 40개 description 최적화
2. Wave 2 글 40개에 내부 링크 구조 고정 적용
   - `허브 1 + 연관 2 + CTA 1`
3. 카테고리 페이지에 추천 글 블록 추가 (내부 링크 깊이 강화)

description 길이 결과:

1. EN: `146~158`자
2. KO: `76~94`자

관련 파일:

1. `app/blog/[lang]/category/[category]/page.tsx`
2. `content/blog/en/*.mdx` (Wave 2 대상)
3. `content/blog/ko/*.mdx` (Wave 2 대상)

---

### 2. 이 문서에서 현재 기준으로 오래된 내용 (정정)

아래는 이전 기록 기준으로 남아 있지만, 지금은 완료된 항목이다:

1. `새 2순위: hair 단계 실연동` -> **완료됨**
2. `새 3순위: Tier 2 블로그 배치 작성` -> **완료됨**
3. `EN 20 / KO 20` 상태 표기 -> **현재 EN 60 / KO 60**

아래는 여전히 미완료 상태로 유지:

1. `.env.local` 실값 기반의 checkout->webhook->session 실환경 검증
2. outfit 상용 provider 확정 및 실연동
3. cutout provider 확정 및 실연동

---

### 3. 지금 기준 다음 우선순위

#### 새 1순위: 실환경 키 입력 후 E2E 검증 완료

1. `.env.local`에 `POLAR_*`, `UPSTASH_*`, `REPLICATE_API_TOKEN`, `NEXT_PUBLIC_APP_URL` 입력
2. `/en/create`에서 checkout -> webhook -> upload polling -> hair generation까지 끝까지 검증

#### 새 2순위: 로컬 데모 fallback 정리

1. `checkout_id` 없는 데모 경로를 개발 모드 전용으로 제한하거나 제거
2. 운영 경로에서는 실세션 강제

#### 새 3순위: outfit/cutout 실연동 시작

1. 상용 가능 outfit provider 확정
2. cutout provider 확정
3. `jobs` 상태 전이 확장 (outfit/cutout)

---

### 4. 이번 세션 검증 결과

확인 완료:

1. `npm.cmd run typecheck` 통과
2. `npm.cmd run build` 통과

---

## 추가 기록 (2026-03-05 15:01:24 +09:00)

### 1. 요청한 1번/2번 진행 결과

#### 1.1 새 1순위: 실환경 키 입력 후 E2E 검증

상태:

1. **진행 중 (실키 입력 대기)**

완료:

1. `.env.local` 필수 키 상태 점검 완료
2. checkout/webhook/session/hair 경로 빌드/타입 검증 완료

환경 키 점검 결과:

1. `POLAR_ACCESS_TOKEN=EMPTY`
2. `POLAR_PRODUCT_ID=EMPTY`
3. `POLAR_WEBHOOK_SECRET=EMPTY`
4. `UPSTASH_REDIS_REST_URL=EMPTY`
5. `UPSTASH_REDIS_REST_TOKEN=EMPTY`
6. `REPLICATE_API_TOKEN=EMPTY`
7. `NEXT_PUBLIC_APP_URL=SET`

검증 결과:

1. `npm.cmd run build` 통과
2. `npm.cmd run typecheck` 통과

---

## 추가 기록 (2026-03-05 15:28:19 +09:00)

### 1. UI/API 연결 전 선행 작업 반영 완료

#### 1.1 시스템 readiness API + Create preflight UI 추가

완료:

1. `GET /api/system/readiness` 추가
2. Create Step 1 화면에 preflight 패널 추가
3. checkout/session/hair의 env 준비 상태와 outfit/cutout blocked 상태를 한 화면에서 확인 가능

추가 파일:

1. `app/api/system/readiness/route.ts`
2. `lib/env-readiness.ts`
3. `components/create/ApiReadinessPanel.tsx`

수정 파일:

1. `app/[lang]/create/page.tsx`
2. `app/globals.css`

#### 1.2 공통 API 응답/로그 유틸 적용

완료:

1. `requestId` 기반 공통 응답 유틸 추가 (`jsonOk`, `jsonError`)
2. 공통 API 로그 유틸 추가 (`logApiEvent`)
3. 핵심 API 라우트에 requestId/로그 적용

추가 파일:

1. `lib/api-response.ts`

적용 라우트:

1. `app/api/checkout/create/route.ts`
2. `app/api/session/status/route.ts`
3. `app/api/jobs/start/route.ts`
4. `app/api/jobs/status/route.ts`
5. `app/api/jobs/select/route.ts`
6. `app/api/webhooks/polar/route.ts`
7. `app/api/data/delete/route.ts`

#### 1.3 API 계약 안전장치 강화

완료:

1. hair 선택 API에서 상태 가드 추가
   - `job.status === "hair_completed"`일 때만 선택 허용
2. 클라이언트 에러 메시지에 `requestId` 노출 연결
   - checkout 시작 실패
   - upload session polling 실패
   - hair 생성/선택 실패

수정 파일:

1. `app/api/jobs/select/route.ts`
2. `components/create/CreateCheckoutActions.tsx`
3. `components/create/PhotoUpload.tsx`
4. `app/[lang]/create/hair/page.tsx`

---

### 2. 이번 세션 검증 결과

확인 완료:

1. `npm.cmd run build` 통과
2. `npm.cmd run typecheck` 통과

참고:

1. `typecheck`는 `.next/types` 생성 전 1회 실패할 수 있어, build 후 재실행 시 정상 통과 확인

---

### 3. 지금 기준 다음 액션

1. `.env.local` 실키 입력 후 `/en/create` 기준 checkout -> webhook -> session polling -> hair generation 실 E2E 실행
2. outfit provider 확정 후 `jobs/start|status|select`에 outfit 단계 실연동
3. cutout provider 확정 후 `jobs` 상태 전이에 cutout 단계 실연동

남은 즉시 작업:

1. `.env.local`에 위 `EMPTY` 키 실값 입력
2. `/en/create` 기준 checkout -> webhook -> `/api/session/status` -> hair generation E2E 실행

#### 1.2 새 2순위: 로컬 데모 fallback 정리

상태:

1. **완료**

적용 내용:

1. 운영 경로에서 `checkout_id` 없는 업로드 진행 차단
2. 데모 경로는 개발 모드(`NODE_ENV !== "production"`) 또는 `NEXT_PUBLIC_ALLOW_DEMO_FLOW=1`에서만 허용
3. `create`/`upload` 화면 문구를 실세션 강제 정책에 맞게 정리

수정 파일:

1. `components/create/PhotoUpload.tsx`
2. `components/create/CreateCheckoutActions.tsx`
3. `app/[lang]/create/page.tsx`
4. `app/[lang]/create/upload/page.tsx`

검증:

1. `npm.cmd run build` 통과
2. `npm.cmd run typecheck` 통과
