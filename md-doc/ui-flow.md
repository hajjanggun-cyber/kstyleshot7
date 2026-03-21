# K-StyleShot UI 전체 흐름 문서

> 사용자가 접속해서 결과물을 받기까지의 전 과정을 단계별로 기록.
>
> Updated: 2026-03-22

---

## 전체 흐름 요약

```
사용자 셀카 업로드
    │
    ▼
[STEP 1] 업로드  /{lang}/create/upload  (UploadFlow)
  ├─ 카메라 촬영 or 파일 업로드
  ├─ 얼굴 감지 (MediaPipe blaze_face_short_range, 클라이언트, CPU)
  │   · no_face / too_close / too_far / off_center → 재업로드 유도
  │   · pass → 다음 버튼 활성화
  └─ 세션 확보 (데모 또는 유료)
    │
    ▼
[STEP 2] 헤어  /{lang}/create/hair  (HairFlow)
  ├─ 헤어 스타일 1개 선택 (카테고리별 그리드)
  ├─ 헤어 컬러 선택 (옵션 — 미선택 시 원본 컬러 유지)
  ├─ "헤어 생성" → 768px JPEG 0.82 압축 → POST /api/hair/preview
  │   → Replicate change-haircut (aspect_ratio 4:5)
  ├─ 폴링 (3초 간격, 최대 40회) → 결과 이미지 카드 표시
  ├─ 결과 1개 선택 후 바로 다음 단계 OR 헤어 1개 더 생성 (최대 2개 비교)
  └─ 1개 선택 → POST /api/hair/select (fire-and-forget) → outfit으로 이동
    │
    ▼
[STEP 3] 의상  /{lang}/create/outfit  (OutfitFlow — step: "outfit")
  ├─ 필터 탭: 전체 / 캐주얼 / 한복 / 스트릿 / 포멀
  ├─ 의상 1개 클릭 → 확인 모달 (미리보기 + 선택/취소 버튼)
  └─ 선택 확정 → 배경 선택 화면으로 전환
    │
    ▼
[STEP 4] 배경  /{lang}/create/outfit  (OutfitFlow — step: "background")
  ├─ 카테고리 탭: 한복 / 무대 / 스트릿 / 공원 / 서울
  ├─ 배경 1개 클릭 → 확인 모달 ("선택 및 합성 시작" 버튼)
  └─ 확정 → POST /api/final/render
      · hairPreviewUrl(blob) → dataUrl 변환 후 전송
      · outfitTemplateId, backgroundTemplateId
      → predictionId 반환 → /{lang}/create/done 이동
    │
    ▼
[Done] 완료  /{lang}/create/done  (DoneFlow)
  ├─ LoadingModal (9초마다 메시지 교체, 7개, 약 1~1.5분)
  ├─ GET /api/final/poll 폴링 (3초 간격, 최대 40회)
  ├─ 완성 이미지 표시 + 선택 요약 (헤어·의상·배경 칩)
  ├─ 다운로드 / 공유
  ├─ 헤어 프리뷰 개별 다운로드 (chosen 목록 기준, 최대 2개)
  ├─ 결과 이메일 자동 발송 (customerEmail + sessionToken + 헤어 2개 확보 시)
  └─ 최종 합성 실패 시 자동 환불 요청 + 안내 메시지
```

---

## 라우트 구조

| URL | 컴포넌트 | 진행 도트 |
|-----|---------|----------|
| `/{lang}/create/upload` | `UploadFlow` | ●○○○ |
| `/{lang}/create/hair` | `HairFlow` | STEP 2 / 4 (nav 텍스트) |
| `/{lang}/create/outfit` (의상 선택) | `OutfitFlow` step="outfit" | ○○●○ |
| `/{lang}/create/outfit` (배경 선택) | `OutfitFlow` step="background" | ○○○● |
| `/{lang}/create/done` | `DoneFlow` | — |

> `/[lang]/create` → `/[lang]/create/upload` 리다이렉트

---

## API 엔드포인트 요약

| 엔드포인트 | 메서드 | 역할 | 비고 |
|-----------|--------|------|------|
| `/api/session/status?checkoutId=…` | GET | 결제 세션 확인 | 1.5초 간격, 최대 45초 폴링 |
| `/api/hair/preview` | POST | 헤어 생성 시작 | predictionId 반환, maxDuration 10s |
| `/api/hair/poll?predictionId=…` | GET | 헤어 폴링 | 3초 간격, 최대 40회 |
| `/api/hair/select` | POST | 헤어 선택 기록 | fire-and-forget |
| `/api/final/render` | POST | 최종 합성 시작 | predictionId 반환 |
| `/api/final/poll?predictionId=…` | GET | 최종 합성 폴링 | 3초 간격, 최대 40회 |
| `/api/email/send` | POST | 결과 이메일 발송 | Bearer sessionToken, 자동 호출 |
| `/api/refund` | POST | 환불 요청 | Bearer sessionToken, 실패 시 자동 |
| `/api/webhooks/polar` | POST | Polar 결제 웹훅 | validateEvent(@polar-sh/sdk) |

---

## AI 모델 파이프라인

### 헤어 변환 (`flux-kontext-apps/change-haircut`)

```
입력:
  input_image   ← Replicate Files API 업로드 URL (base64 → 서버 업로드 → CDN URL)
  haircut       ← hairStyles[n].haircut (영문 스타일명)
  hair_color    ← hairColors[n].replicateValue (미선택 시 "No change")
  gender        ← "none"
  aspect_ratio  ← "4:5"
  output_format ← "png"
  safety_tolerance ← 2

흐름:
  프론트: blob URL → 768px JPEG 0.82 → POST /api/hair/preview
  서버: dataUrl → decodeDataUrl → uploadToReplicateFiles → CDN URL → Replicate 호출
  반환: predictionId → 프론트 폴링
```

### 최종 합성 (`google/nano-banana-pro`)

```
입력 (image_input 배열, 순서 중요):
  [0] 헤어 프리뷰 이미지  ← hairPreviewUrl (선택한 헤어 결과)
  [1] 의상 이미지         ← outfitTemplates[n].imageUrl
  [2] 배경 이미지         ← referenceTemplates[n].templateImageUrl

파라미터:
  prompt        ← NANO_BANANA_PROMPT_TEMPLATE(sceneDescription)
  aspect_ratio  ← "4:5"
  resolution    ← "2K"
  output_format ← "jpg"
  safety_filter_level ← "block_only_high"

흐름:
  프론트: hairPreviewUrl(blob) → dataUrl 변환 → POST /api/final/render
  서버: hairPreviewDataUrl → uploadToReplicateFiles → CDN URL → Replicate 호출
  반환: predictionId → 프론트 폴링
```

---

## 세션 처리

| 모드 | 조건 | 동작 |
|------|------|------|
| 데모 플로우 | `allowDemoFlow = true` (현재 항상 true) | `demo-session-{checkoutId}` 즉시 발급 |
| 유료 플로우 | URL에 `?checkout_id=…` 포함 | `/api/session/status` 폴링 → sessionToken 확보 |

- 세션 캐시: `sessionStorage` → `kstyleshot.create.session`
- 캐시 히트 시 폴링 생략, 즉시 `isPaidSessionReady = true`
- 폴링 타임아웃(45초) 초과 시 "다시 시도" 버튼 표시

---

## 얼굴 감지 기준 (UploadFlow)

| 상태 | 조건 | 처리 |
|------|------|------|
| `no_face` | 감지된 얼굴 없음 | 재업로드 유도 |
| `too_close` | 얼굴 면적 비율 > 38% | 재업로드 유도 |
| `too_far` | 얼굴 면적 비율 < 6% | 재업로드 유도 |
| `off_center` | 얼굴 중심 X < 20% or > 80% 또는 Y < 14% or > 68% | 재업로드 유도 |
| `pass` | 모든 조건 통과 | 다음 버튼 활성화 |

- 모델: `blaze_face_short_range.tflite` (MediaPipe), CPU delegate
- minDetectionConfidence: 0.35
- 여러 얼굴 감지 시 가장 큰 얼굴 기준
- 감지 성공 시 faceBoundingBox(0~1 정규화) → Zustand 저장
- 감지기 초기화 실패 시 fallback → `pass` 처리

---

## 헤어 생성 규칙 (HairFlow)

- 한 번에 **1개** 스타일 선택 → 생성
- 최대 **2개**까지 순차 생성 → 비교 가능
- 2개 생성 후 스타일 피커 자동 숨김
- 이미 생성된 스타일: disabled + "생성됨/Ready" 뱃지
- 컬러 미선택: `hair_color = "No change"` (원본 컬러 유지)
- 결과 1개 선택 후 "이 헤어로 다음 단계" 활성화
- 폴링 실패/타임아웃 시 에러 메시지 + 재시도 가능

---

## 의상/배경 확인 모달 (OutfitFlow)

- 의상 카드 클릭 → `confirmOutfitId` 세팅 → 모달 표시 (4:5 미리보기 + 취소/선택)
- 의상 선택 확정 → `step = "background"` 전환
- 배경 카드 클릭 → `confirmBgId` 세팅 → 모달 표시 (4:5 미리보기 + 취소/"선택 및 합성 시작")
- 배경 확정 즉시 `handleSubmit()` 호출 → /api/final/render

---

## 완료 화면 이메일/환불 자동화 (DoneFlow)

| 트리거 | 조건 | 동작 |
|--------|------|------|
| 이메일 자동 발송 | `finalImageUrl` 확보 + `customerEmail` + `sessionToken` + `hair.results` 2개 | `/api/email/send` (헤어1, 헤어2, 최종 합성 base64 전송) |
| 환불 자동 요청 | `finalError = true` + `sessionToken` | `/api/refund` fire-and-forget |

---

## 전역 상태 (Zustand — `store/createStore.ts`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `checkoutId` | string | Polar checkout ID |
| `orderId` | string | Polar order ID |
| `sessionToken` | string | 인증 토큰 |
| `customerEmail` | string\|null | 결제 이메일 |
| `status` | JobStatus | 현재 플로우 상태 |
| `photoBlobUrl` | string\|null | 업로드 원본 blob URL |
| `faceBoundingBox` | `{x,y,w,h}`\|null | 정규화된 얼굴 위치 |
| `hair.chosen` | string[] | 생성된 헤어 ID 목록 (최대 2) |
| `hair.results` | StepResult[] | 헤어 결과 이미지 정보 |
| `hair.picked` | string\|null | 선택한 헤어 ID |
| `hairPreviewUrl` | string\|null | 선택한 헤어 이미지 URL |
| `outfit.chosen` | string[] | 선택된 의상 ID |
| `outfit.picked` | string\|null | 확정 의상 ID |
| `backgroundId` | string\|null | 선택한 배경 ID |
| `finalPredictionId` | string\|null | 최종 합성 predictionId |
| `finalImageUrl` | string\|null | 최종 합성 결과 URL |

---

## 데이터 파일

| 파일 | 내용 | 주요 필드 |
|------|------|----------|
| `data/hairStyles.ts` | 헤어 스타일 목록 + 카테고리 | `id, name, haircut, category, thumbnail, colorHint` |
| `data/hairColors.ts` | 헤어 컬러 목록 | `id, nameKo, nameEn, swatch, replicateValue` |
| `data/outfits.ts` | 의상 템플릿 | `id, title, subtitle, category, thumbnailUrl, imageUrl` |
| `data/referenceTemplates.ts` | 배경 템플릿 | `id, title, subtitle, category, thumbnailUrl, templateImageUrl, sceneDescription` |
