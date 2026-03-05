# kstyleshot - Implementation Plan

작성: Codex (GPT-5)
작성 시각: 2026-03-04 21:00:04 +09:00 (Asia/Seoul)
문서 상태: 기존 `plan.md` 전체 대체

이 문서는 기존 초안을 전면 폐기하고, 실제 구현과 배포를 기준으로 다시 정리한 실행용 명세서다.
목표는 "지금 바로 코딩 가능한 구조"를 만드는 것이며, 확인되지 않은 가정이나 문서상 오류는 제거했다.

---

## 1. 제품 정의

사용자가 본인 셀카 1장을 업로드하면:

1. 헤어 스타일 2개를 생성한다.
2. 2개 중 1개를 사용자가 고른다.
3. 선택된 결과를 기반으로 의상 스타일 2개를 생성한다.
4. 2개 중 1개를 사용자가 고른다.
5. 선택된 결과에서 인물 배경을 제거한다.
6. 서울 배경 2개에 합성한다.
7. 2개 중 1개를 사용자가 고르고 다운로드한다.

결제는 1회성 유료다.

---

## 2. 핵심 원칙

1. 이메일, 전화번호, 실명 등 직접 식별 개인정보는 수집하지 않는다.
2. 사용자 원본 이미지는 서버에 영구 저장하지 않는다.
3. 브라우저 메모리와 일시 처리만 사용하고, 결과 이미지는 즉시 다운로드 방식으로 제공한다.
4. 결제 완료와 AI 생성은 반드시 비동기 job/poll 구조로 처리한다.
5. 모든 최종 결과물에는 워터마크를 삽입한다.
6. 특정 아이돌, 그룹, 기획사, 브랜드와의 제휴 또는 동일성 보장을 절대 약속하지 않는다.
7. 상용 라이선스가 불명확한 모델은 유료 서비스에 사용하지 않는다.
8. 블로그 포스팅은 create 단계 화면에 강제 삽입하지 않고 `/blog` 독립 허브로 운영한다.
9. 제품 공식 플로우는 `헤어 -> 의상 -> 배경`으로 고정한다.
10. 포스팅은 유입/설명 역할을 맡고, 실제 선택/생성 인터랙션은 create 플로우에서만 수행한다.
11. 문서 역할은 `plan.md(제품/기술/플로우)`와 `post.md(포스팅 기획/발행)`로 분리 관리한다.

---

## 3. 반드시 반영해야 하는 현실 제약

### 3.1 결제 후 `sessionToken`을 바로 URL에 넣을 수 없다

Polar 성공 리다이렉트 시점에는 서버 웹훅이 아직 처리 중일 수 있다.
따라서 결제 직후 URL에 `sessionToken`을 직접 넣는 설계는 폐기한다.

정상 흐름:

1. Polar checkout 생성 시 `successUrl`에 `?checkout_id={CHECKOUT_ID}`를 포함한다.
2. 사용자는 `/[lang]/create/upload?checkout_id=...`로 돌아온다.
3. 클라이언트가 `/api/session/status?checkoutId=...`를 폴링한다.
4. 서버는 웹훅에서 주문 결제 확인 후 세션을 생성한다.
5. 준비되면 `sessionToken`을 응답한다.
6. 클라이언트는 `sessionStorage`에 저장하고 URL 쿼리를 즉시 제거한다.

### 3.2 배경 합성 전에 인물 배경 제거가 필요하다

의상 생성 결과는 일반적으로 배경이 포함된 사각형 이미지다.
이를 그대로 Canvas에 올리면 합성이 아니라 단순 덮어쓰기 결과가 된다.

정상 흐름:

1. 의상 결과 2개 중 1개를 선택한다.
2. 선택된 1장에만 배경 제거 job을 1회 수행한다.
3. 투명 배경 PNG를 얻는다.
4. 이 PNG를 Canvas로 배경 이미지 위에 합성한다.

배경 제거 단계가 없으면 배경 기능은 품질상 판매 불가다.

### 3.3 현재 문서의 `cuuupid/idm-vton`은 상용 사용 금지

이 모델은 상용 유료 서비스에 바로 사용할 수 없다.
따라서 의상 단계는 아래 둘 중 하나가 선행되어야 한다.

1. 상용 사용 가능한 대체 모델을 확보한다.
2. MVP에서 의상 단계를 비활성화하고 헤어 + 배경만 먼저 출시한다.

상용 사용 가능 여부가 확인되기 전까지 `idm-vton` 기준 구현을 확정하지 않는다.

---

## 4. 권장 기술 스택

### 4.1 런타임 및 프레임워크

- Next.js 16 (App Router)
- React 19 계열
- TypeScript
- Tailwind CSS

### 4.2 상태 및 국제화

- Zustand
- next-intl

구조:

- `i18n/request.ts`
- `next.config.mjs`에서 next-intl plugin 적용
- 라우팅 엔트리 파일은 Next.js 16 기준 `proxy.ts` 사용

### 4.3 결제 및 백엔드 연동

- Polar
- Polar webhook은 SDK 기반 검증 사용
- 결제 완료 이벤트 기준은 `order.paid`
- 환불은 `POST /v1/refunds`

### 4.4 상태 저장소

- Upstash Redis 사용
- 기존 "Vercel KV" 표현은 사용하지 않는다

이 문서에서는 Redis를 전제로 설계한다.

### 4.5 이미지 생성

- 헤어: `black-forest-labs/flux-kontext-pro`
- 의상: 상용 사용 허용 모델로 교체 필요
- 배경 제거: 상용 사용 가능한 배경 제거 모델 또는 서비스 필요
- 배경 합성: 브라우저 Canvas API

---

## 5. 폴더 구조

```text
/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   ├── page.tsx
│   │   │   ├── upload/page.tsx
│   │   │   ├── hair/page.tsx
│   │   │   ├── outfit/page.tsx
│   │   │   ├── location/page.tsx
│   │   │   └── done/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── refund-policy/page.tsx
│   │   └── cookie-policy/page.tsx
│   └── api/
│       ├── webhooks/
│       │   └── polar/route.ts
│       ├── checkout/
│       │   └── create/route.ts
│       ├── session/
│       │   └── status/route.ts
│       ├── jobs/
│       │   ├── start/route.ts
│       │   ├── status/route.ts
│       │   └── select/route.ts
│       └── data/
│           └── delete/route.ts
├── components/
│   ├── landing/
│   ├── create/
│   └── common/
├── content/
│   └── blog/
│       ├── en/
│       └── ko/
├── data/
│   ├── hairStyles.ts
│   ├── outfits.ts
│   └── backgrounds.ts
├── lib/
│   ├── polar.ts
│   ├── redis.ts
│   ├── jobs.ts
│   ├── replicate.ts
│   ├── images.ts
│   ├── canvas.ts
│   └── refund.ts
├── store/
│   └── createStore.ts
├── types/
│   └── index.ts
├── messages/
│   ├── en.json
│   └── ko.json
├── public/
│   ├── backgrounds/
│   ├── samples/
│   └── favicon.ico
├── next.config.mjs
├── proxy.ts
└── .env.local
```

제거:

- `api/composite/route.ts`
- `locations.ts`
- 의미 없는 `api/jobs/[jobId]`

`locations.ts`는 `backgrounds.ts`와 중복되므로 유지하지 않는다.

---

## 6. 결제 및 세션 설계

### 6.1 체크아웃 생성

`POST /api/checkout/create`

역할:

1. Polar checkout session 생성
2. 성공 URL에 `checkout_id` 템플릿 포함
3. locale 기준으로 리다이렉트 경로 지정

성공 URL 예시:

```text
https://{APP_DOMAIN}/{lang}/create/upload?checkout_id={CHECKOUT_ID}
```

### 6.2 웹훅 처리

`POST /api/webhooks/polar`

처리 기준:

1. Polar SDK로 서명 검증
2. `order.paid` 이벤트만 처리
3. 멱등성 키로 중복 수신 차단
4. `checkout_id` 기준 세션 생성

웹훅 완료 시 저장:

- `job:{orderId}`
- `checkout:{checkoutId} -> orderId`
- `session:{sessionToken} -> orderId`

### 6.3 세션 조회

`GET /api/session/status?checkoutId=...`

응답 규칙:

- 웹훅 미처리: `202` 또는 `pending`
- 처리 완료: `sessionToken`, `orderId`, `status`

클라이언트 동작:

1. `sessionToken`을 `sessionStorage`에 저장
2. `history.replaceState`로 `checkout_id` 제거
3. 이후 API 요청은 `Authorization: Bearer {sessionToken}` 사용

URL에 토큰을 계속 들고 다니지 않는다.

---

## 7. Redis 키 설계

### 7.1 단일 진실 원본

주요 상태는 항상 `job:{orderId}` 단일 객체에 저장한다.
분리 상태 키를 남발하지 않는다.

### 7.2 키 목록

- `job:{orderId}` -> 전체 job 객체
- `checkout:{checkoutId}` -> orderId
- `session:{sessionToken}` -> orderId
- `webhook:event:{eventId}` -> 처리 여부
- `refund:{orderId}` -> 환불 멱등성 키
- `rate:{sessionToken}:{step}` -> 요청 제한 카운터

### 7.3 TTL

- 세션 관련 키: 24시간
- 웹훅 멱등성 키: 7일
- 환불 멱등성 키: 30일

---

## 8. 상태 모델

상태는 "UI 단계"와 "백엔드 작업 상태"가 섞이지 않게 분리한다.

```ts
export type JobStatus =
  | 'payment_pending'
  | 'payment_confirmed'
  | 'upload_pending'
  | 'hair_selecting'
  | 'hair_processing'
  | 'hair_completed'
  | 'outfit_selecting'
  | 'outfit_processing'
  | 'outfit_completed'
  | 'cutout_processing'
  | 'cutout_completed'
  | 'location_selecting'
  | 'composite_completed'
  | 'completed'
  | 'failed'
  | 'refunded'
```

중요:

- `pickHair`는 `outfit_processing`으로 바꾸지 않는다.
- `pickHair` 후 상태는 `hair_completed` 유지 또는 `outfit_selecting`
- `pickOutfit` 후 바로 배경 제거를 시작할 때만 `cutout_processing`

---

## 9. 이미지 파이프라인

### 9.1 업로드

브라우저에서만 원본 파일을 들고 있다.

전처리:

1. Canvas로 긴 변 기준 1280px 이하 리사이즈
2. JPEG 품질 0.85 수준으로 압축
3. `data:image/jpeg;base64,...` 형식으로 변환

원본 대용량 이미지를 그대로 서버로 보내지 않는다.

### 9.2 헤어 생성

헤어 생성 API 입력:

```ts
{
  step: 'hair',
  selectedIds: string[],
  photoDataUrl: string
}
```

`flux-kontext-pro` 사용 시 핵심:

- `input_image` 사용
- `image` 사용 금지

예시:

```ts
input: {
  input_image: photoDataUrl,
  prompt,
  aspect_ratio: '9:16'
}
```

### 9.3 의상 생성

의상 단계는 "상용 사용 허용 모델"이 확정된 뒤 연결한다.

추상 인터페이스만 먼저 정의:

```ts
generateOutfitVariants({
  personImageDataUrl,
  garmentImageUrl,
  garmentDescription
})
```

원칙:

- 모델 이름은 코드에 하드코딩하지 않는다.
- 라이선스 검토 전까지 provider adapter만 만든다.

### 9.4 배경 제거

의상 결과 선택 후 1장만 처리한다.

입력:

- 선택된 의상 결과 이미지 URL 또는 data URL

출력:

- 투명 PNG URL 또는 data URL

### 9.5 배경 합성

브라우저 Canvas에서 처리한다.

순서:

1. `full.webp` 배경 로드
2. 투명 PNG 인물 로드
3. 중앙 하단 정렬
4. 워터마크 삽입
5. Blob URL 생성

이 단계는 서버 API가 필요 없다.

---

## 10. API 계약

### 10.1 `POST /api/jobs/start`

용도:

- `hair`
- `outfit`
- `cutout`

금지:

- `location`은 서버 job으로 만들지 않는다

인증:

- `Authorization: Bearer {sessionToken}`

서버 처리:

1. 토큰으로 `session:{token}` 조회
2. `orderId` 획득
3. `job:{orderId}` 로드
4. 현재 단계 검증
5. 외부 AI job 시작
6. prediction id 저장

### 10.2 `GET /api/jobs/status`

기존 `[jobId]` 라우트는 삭제한다.

입력:

- 헤더의 `sessionToken`

역할:

1. 세션으로 order 조회
2. 현재 job 로드
3. prediction 상태 폴링
4. 완료 시 `job.status` 갱신
5. 결과 URL 목록 반환

### 10.3 `POST /api/jobs/select`

용도:

- 헤어 결과 2개 중 1개 선택 확정
- 의상 결과 2개 중 1개 선택 확정
- 배경 결과 2개 중 1개 선택 확정

선택 확정 시:

- `pickedStyles`
- 다음 단계 진입 상태

### 10.4 `POST /api/data/delete`

삭제 대상:

- `job:{orderId}`
- `session:{sessionToken}`
- `checkout:{checkoutId}` (존재 시)
- 관련 rate key

클라이언트도 동시에:

- `URL.revokeObjectURL()`
- `sessionStorage` 정리

---

## 11. 환불 정책과 구현

### 11.1 자동 환불 조건

- 외부 모델 호출 실패
- 설정된 타임아웃 초과
- 최종 다운로드 이전에 시스템 오류로 복구 불가

### 11.2 구현 규칙

1. 즉시 환불 전에 1회 재시도 가능
2. 재시도 후에도 실패하면 환불
3. `refund:{orderId}` 멱등성 키로 중복 환불 방지

### 11.3 Polar 환불 호출

환불은 `POST /v1/refunds` 사용을 전제로 구현한다.

주의:

- 액세스 토큰에 환불 권한 스코프 필요
- 실제 요청 바디는 Polar 최신 스키마 기준으로 작성
- 하드코딩된 reason 문자열을 임의로 쓰지 않는다

이 문서 단계에서는 "엔드포인트와 멱등성"만 고정하고, 세부 body는 구현 시 공식 스키마로 맞춘다.

---

## 12. 프론트엔드 상태 관리

Zustand는 "브라우저 메모리 전용 임시 상태"만 가진다.
진실 원본은 서버 Redis 상태다.

브라우저 스토어에 두는 것:

- `sessionToken`
- 업로드 이미지 Blob
- 각 단계 결과의 Blob URL
- 선택한 결과 ID

브라우저 스토어에 두지 않는 것:

- 결제 진실 상태
- 환불 여부
- 외부 prediction id 진실 값

페이지 새로고침 시:

- Blob은 사라질 수 있다
- 서버 상태는 남아 있다
- 따라서 문구로 "새로고침/이탈 시 일부 결과를 다시 받아야 할 수 있음"을 명시한다

---

## 13. 다국어

최소 지원:

- `en`
- `ko`

초기 MVP에서는 `ja`를 제외해도 된다.

필수 페이지:

- 랜딩
- 생성 플로우
- 법무 4종
- 공통 고지 문구

영문 문구 기준으로 먼저 완성하고, 한글은 별도 메시지 파일로 관리한다.

---

## 14. 법무 및 금지 규칙

### 14.1 절대 금지

- 특정 아이돌 이름 노출
- 특정 그룹명 노출
- 특정 기획사명 노출
- "look like [실존 인물]" 약속
- 실제 연예인 전후 비교 이미지 사용
- 로고, 상표, 소속사 마크 사용
- 이메일 수집
- 사용자 이미지를 `/public` 또는 영구 스토리지에 저장

### 14.2 필수 고지

모든 페이지 푸터:

1. This service is not affiliated with any artists, labels, or brands.
2. All results are AI-generated style images; exact likeness is not guaranteed.

결제 직전:

1. Refund is issued automatically if generation fails or times out.
2. No refund for dissatisfaction with style preference alone.

업로드 페이지:

1. Your photo is used only for generation and is deleted after processing.

---

## 15. 자산 준비물

코드 작성 전에 아래가 준비되어야 한다.

### 15.1 필수 이미지 자산

- 배경 썸네일 10장
- 배경 원본 10장
- 헤어 샘플 썸네일 10장
- 의상 샘플 썸네일 10장
- 의상 생성용 garment image 세트

### 15.2 환경변수

```bash
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_PRODUCT_ID=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

REPLICATE_API_TOKEN=

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_PRICE=3.99
```

### 15.3 배포 전 검증

1. Polar sandbox 결제 성공
2. 웹훅 서명 검증 성공
3. Redis 세션 생성 확인
4. 헤어 생성 완료
5. 환불 멱등성 확인
6. 삭제 API 동작 확인

---

## 16. 블로그(선택, SEO 확장)

블로그는 MVP 범위 밖이다.
필요하면 아래 구조만 유지한다.

- `content/blog/en/*.mdx`
- `content/blog/ko/*.mdx`
- 정적 생성
- `pairSlug`로 번역 글 연결
- 고정 disclaimer 삽입

금칙어 검사를 CI에서 수행한다.

---

## 17. 구현 우선순위

### Phase 0 - 선행 확정

1. 의상 생성에 쓸 상용 가능 모델 확정
2. 배경 제거 수단 확정
3. Polar checkout + webhook + refund 계약 확정

이 3개가 확정되지 않으면 전체 구현 시작 금지.

### Phase 1 - 출시 가능한 최소 기능

1. Next.js 기본 골격
2. next-intl 설정
3. Polar checkout 생성
4. Polar webhook 수신 및 세션 생성
5. Redis 키 설계 반영
6. 업로드 페이지
7. 헤어 2개 생성 및 1개 선택
8. 배경 제거
9. 배경 2개 합성 및 1개 선택
10. 다운로드 + 데이터 삭제
11. 법무 페이지

### Phase 2 - 의상 기능 복원

1. 상용 허용 의상 모델 연결
2. garment 이미지 운영 체계 추가
3. 의상 단계 UI/백엔드 연결

### Phase 3 - 운영 안정화

1. 재시도 정책
2. Rate limiting
3. 에러 화면 정리
4. 로그/모니터링

---

## 18. 최종 체크리스트

- 결제 성공 후 `checkout_id` 기반 세션 폴링 구조인가
- `sessionToken`을 URL이 아니라 `sessionStorage + Authorization`으로 쓰는가
- Redis를 쓰고 있는가
- `job:{orderId}` 단일 객체를 진실 원본으로 유지하는가
- `GET /api/jobs/status`로 라우트 의미를 정리했는가
- 헤어 생성 시 `input_image`를 쓰는가
- 상용 사용 불가 모델을 코드에 넣지 않았는가
- 배경 제거 후 Canvas 합성을 하는가
- `pickHair`가 잘못된 processing 상태를 만들지 않는가
- 환불 멱등성 키가 있는가
- 삭제 API가 서버 키와 브라우저 메모리를 함께 정리하는가

---

## 19. 문서 메모

이 문서는 이전 `plan.md`의 잘못된 가정들을 제거한 버전이다.
특히 아래 항목은 더 이상 사용하지 않는다.

- `session` 쿼리에 토큰 직접 전달
- `api/jobs/[jobId]`
- `api/composite/route.ts`
- `job:{orderId}:status` 같은 분리 상태 키
- 상용 검토 없는 `cuuupid/idm-vton` 직접 사용

이 문서를 기준으로 구현을 시작한다.

---

## 2026 Seoul Background Content Cluster (Addendum)

- Posting is independent under `/blog` (Style Guide).
- Product interaction remains only in create flow.
- Official generation flow is fixed: `Hair -> Outfit -> Background`.
- Seoul background expansion is tracked in:
  - `md-doc/post-seoul-background-100.md`

Cluster scope:
- Locations: 10
- Formats per location: 5
- Languages: KO + EN
- Total: 100 posts
