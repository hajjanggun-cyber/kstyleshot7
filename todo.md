# K-Style Photo Generator - TODO Handoff

작성: Codex (GPT-5)
기록 시각: 2026-03-04 21:32:28 +09:00 (Asia/Seoul)
기준 문서: `plan.md`

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
