# K-StyleShot UI 전체 흐름 문서

> 사용자가 접속해서 결과물을 받기까지의 전 과정을 단계별로 기록.
> 호출되는 모든 API, 외부 서비스, 상태 전환, 소요 시간을 포함.
>
> Updated: 2026-03-10

---

## 전체 흐름 요약

```
접속
 └─ 결제 확인 / 데모 세션 생성
      │
      ▼
[1단계] 사진 업로드 (UploadFlow)
 └─ 얼굴 감지 (MediaPipe, 클라이언트)
      │
      ▼
[2단계] 헤어스타일 선택 (HairFlow)
 ├─ 헤어 합성 시작 → Replicate 폴링
 └─ 백그라운드: 포즈 감지 → 상반신이면 전신 생성 (FAL Flux Fill Pro)
      │
      ▼
[3단계] 의상 선택 (OutfitFlow)
 └─ 의상 합성 → FAL FASHN v1.5 폴링
      │
      ▼
[4단계] 배경 선택 (LocationFlow)
 ├─ 백그라운드: 배경 제거 자동 시작 → Replicate 폴링
 └─ 배경 선택 후 합성 → Replicate Flux Kontext 폴링
      │
      ▼
[5단계] 완성 (DoneFlow)
 ├─ 최종 이미지 표시
 ├─ (선택) IC-Light 조명 보정 → Replicate 폴링
 └─ 다운로드 / 공유
```

---

## 공통 폴링 규칙

모든 AI 작업은 동일한 방식으로 폴링한다.

| 항목 | 값 |
|---|---|
| 폴링 간격 | 3,000ms (3초) |
| 최대 재시도 | 40회 (총 120초) |
| 타임아웃 처리 | 에러 표시 후 다음 단계로 진행 (폴백) |
| 취소 방식 | useEffect cleanup → clearInterval |

---

## 1단계 — 사진 업로드 (UploadFlow)

**파일:** `components/create/UploadFlow.tsx`

### 사용자 동작
1. 접속 → 결제 확인 또는 데모 세션 자동 생성
2. 카메라 또는 파일로 사진 업로드
3. 얼굴 감지 자동 실행
4. 얼굴 감지 통과 → 헤어 선택 화면으로 이동

### 호출 API

#### `GET /api/session/status?checkoutId=[id]`
- **용도:** 결제 완료 여부 확인
- **폴링:** 1,500ms 간격, 최대 40회
- **응답:** `{ status: "active" | "pending", sessionToken, orderId }`
- **실패 시:** 데모 세션으로 자동 전환 (allowDemoFlow=true)

### 클라이언트 처리 (API 호출 없음)

| 처리 | 방식 | 비고 |
|---|---|---|
| 얼굴 감지 | MediaPipe FaceDetector (Google CDN, lazy-load) | 브라우저 로컬 실행 |
| 사진 리사이즈 | Canvas API | MAX 1024px |
| EXIF 회전 보정 | Canvas drawImage | iOS 셀카 회전 문제 방지 |

### 상태 전환
```
접속
 ├─ checkout_id 파라미터 있음 → /api/session/status 폴링
 │    └─ active → sessionToken 저장 → 다음 단계 허용
 └─ 없음 → 데모 모드 자동 실행
사진 업로드 → MediaPipe 얼굴 감지
 ├─ 감지 실패 → "얼굴이 없는 것 같아요" 경고 (진행은 가능)
 └─ 감지 성공 → photoBlobUrl 저장 → HairFlow 이동
```

---

## 2단계 — 헤어스타일 선택 (HairFlow)

**파일:** `components/create/HairFlow.tsx`

### 사용자 동작
1. 헤어스타일 카테고리 선택 (daily / elegant / bold / trendy / experimental 등)
2. 헤어 색상 선택 (선택 사항)
3. "다음" 클릭 → 헤어 합성 시작

### "다음" 클릭 시 동시 실행되는 두 가지 작업

```
"다음" 클릭
 ├─ [메인] 헤어 합성 시작 (사용자에게 보임)
 │    └─ normalizePhotoForAI → 20% 상단 여백 추가 (헤어가 위로 잘리지 않도록)
 │         └─ POST /api/hair/preview
 │              └─ GET /api/hair/poll (3초 간격)
 │                   └─ 완료 → hairPreviewUrl 저장 → OutfitFlow 이동
 │
 └─ [백그라운드] 전신 이미지 생성 (사용자에게 안 보임)
      └─ MediaPipe PoseLandmarker로 포즈 감지
           ├─ 무릎 감지됨 (visibility > 0.5) → 전신 → fullBodyUrl = photoBlobUrl 저장
           └─ 무릎 없음 (상반신/셀카) → 전신 생성 필요
                └─ createBodyExtendInputs() → 캔버스 80% 아래 확장 + PNG 마스크 생성
                     └─ POST /api/body/extend
                          └─ 결과 → fullBodyPredictionId 저장 (OutfitFlow에서 폴링)
```

### 호출 API

#### `POST /api/hair/preview`
- **용도:** 헤어 합성 작업 시작
- **요청:** `{ photoDataUrl: string (base64 JPEG), haircutName: string, hairColor: string }`
- **응답:** `{ predictionId: string }`
- **내부:** Replicate `flux-kontext-apps/change-haircut` 모델 호출
- **소요 시간:** 약 30~60초

#### `GET /api/hair/poll?predictionId=[id]`
- **용도:** 헤어 합성 결과 확인
- **응답:** `{ status: "processing"|"succeeded"|"failed"|"canceled", outputUrl?: string }`
- **완료 시:** hairPreviewUrl → store 저장

#### `POST /api/body/extend`
- **용도:** 상반신 사진에서 전신 생성 (백그라운드)
- **요청:** `{ imageDataUrl: string (base64 JPEG), maskDataUrl: string (base64 PNG) }`
- **응답:** `{ predictionId: string }`
- **내부:** Replicate `black-forest-labs/flux-fill-pro` 호출
- **마스크 구조:** 상단 = 검정(원본 보존) / 하단 = 흰색(생성 영역)
- **소요 시간:** 약 15~25초

#### `GET /api/body/poll?predictionId=[id]`
- **용도:** 전신 생성 결과 확인 (백그라운드, UI 없음)
- **응답:** `{ status, outputUrl? }`
- **완료 시:** fullBodyUrl → store 저장

### 사용 외부 서비스

| 서비스 | 모델 | 용도 |
|---|---|---|
| Replicate | `flux-kontext-apps/change-haircut` | 헤어스타일 변경 |
| Replicate | `black-forest-labs/flux-fill-pro` | 하반신 생성 (아웃페인팅) |
| MediaPipe | pose_landmarker_lite | 전신 여부 판단 |

### 이미지 전처리 (canvas.ts)
```
normalizePhotoForAI(photoBlobUrl)
 ├─ MAX_DIMENSION = 1024px로 다운스케일
 ├─ 캔버스 높이 = 원본 + 20% 상단 여백
 └─ 검정 배경 + 원본 이미지 하단 배치
     → base64 JPEG (quality 0.92)
```

---

## 3단계 — 의상 선택 (OutfitFlow)

**파일:** `components/create/OutfitFlow.tsx`

### 사용자 동작
1. 카테고리 선택 (stage / street / award)
2. 의상 카드 선택
3. "다음" 클릭 → 의상 합성 시작

### "다음" 클릭 시 실행 순서

```
"다음" 클릭
 │
 ├─ fullBodyUrl 있음? (전신 생성 완료)
 │    └─ Yes → fullBodyUrl을 FAL에 전달
 │    └─ No  → photoBlobUrl(원본)을 FAL에 전달 (폴백)
 │
 └─ POST /api/outfit/preview
      └─ GET /api/outfit/poll (3초 간격)
           └─ 완료 → outfitPreviewUrl 저장 → LocationFlow 이동
```

### 호출 API

#### `POST /api/outfit/preview`
- **용도:** 의상 합성 작업 시작
- **요청:** `{ photoDataUrl: string (base64 JPEG), garmentImagePath: string, clothType: string }`
- **응답:** `{ predictionId: string }`
- **내부:** FAL.ai `fal-ai/fashn/tryon/v1.5` 호출
- **garmentImagePath 예시:** `/outfits/fusion-hanbok.jpeg`
- **소요 시간:** 약 30~60초

#### `GET /api/outfit/poll?predictionId=[id]`
- **용도:** 의상 합성 결과 확인
- **응답:** `{ status, outputUrl?, rawStatus?, debug? }`
- **FAL 내부 URL 패턴:**
  - Status: `https://queue.fal.run/fal-ai/fashn/requests/[id]/status`
  - Result: `https://queue.fal.run/fal-ai/fashn/requests/[id]`
- **완료 시:** outfitPreviewUrl + outfitPredictionId → store 저장

#### 백그라운드 폴링 (사용자 의상 고르는 동안)
- `GET /api/hair/poll` — 헤어 합성이 아직 미완료면 계속 폴링
- `GET /api/body/poll` — 전신 생성이 아직 미완료면 계속 폴링

### 사용 외부 서비스

| 서비스 | 모델 | 용도 |
|---|---|---|
| FAL.ai | `fal-ai/fashn/tryon/v1.5` | 가상 피팅 (의상 합성) |

### FAL FASHN 파라미터
```json
{
  "model_image": "[base64 또는 URL]",
  "garment_image": "[base64]",
  "category": "auto",
  "mode": "balanced",
  "garment_photo_type": "auto",
  "moderation_level": "permissive",
  "num_samples": 1,
  "segmentation_free": true,
  "output_format": "png"
}
```

---

## 4단계 — 배경 선택 (LocationFlow)

**파일:** `components/create/LocationFlow.tsx`

### 사용자 동작
1. 화면 진입 → 배경 제거 자동 시작 (백그라운드)
2. AI 결과물 카드 (헤어 / 의상) 미리보기 및 다운로드
3. 배경 목록에서 선택 (경복궁, 명동 등)
4. "완성하기" 클릭 → 합성 시작

### 화면 진입 즉시 실행

```
LocationFlow 마운트
 └─ bgRemovedUrl 없음 + bgRemovedPredictionId 없음?
      └─ 소스 결정: outfitPreviewUrl 우선, 없으면 hairPreviewUrl
           └─ POST /api/bgremove/preview (자동 시작)
                └─ GET /api/bgremove/poll (3초 간격)
                     └─ 완료 → bgRemovedUrl 저장 (투명 PNG)
```

### "완성하기" 클릭 시 실행 순서

```
"완성하기" 클릭
 └─ POST /api/composite
      ├─ 서버 내부:
      │    ├─ Sharp: 배경 블러 (sigma=1)
      │    ├─ Sharp: 인물 80% 리사이즈 + 하단 배치
      │    ├─ Sharp: 배경 색온도 분석 (평균 RGB) → 14% 오버레이 보정
      │    ├─ Sharp: 그라운드 섀도우 추가
      │    └─ Replicate Flux Kontext 업로드 → 조명/분위기 블렌딩
      └─ GET /api/composite/poll (3초 간격)
           └─ 완료 → compositeUrl 저장 → DoneFlow 이동
```

### 호출 API

#### `POST /api/bgremove/preview`
- **용도:** 인물 배경 제거 시작 (의상/헤어 결과 이미지에서)
- **요청:** `{ imageUrl: string }`
- **응답:** `{ predictionId: string }`
- **내부:** Replicate 배경 제거 모델 호출
- **소요 시간:** 약 10~20초

#### `GET /api/bgremove/poll?predictionId=[id]`
- **용도:** 배경 제거 결과 확인
- **응답:** `{ status, outputUrl? }`
- **완료 시:** bgRemovedUrl → store 저장 (투명 PNG)

#### `POST /api/composite`
- **용도:** 인물 + 배경 합성 + 조명 보정
- **요청:** `{ personUrl: string, backgroundPath: string }`
- **backgroundPath 예시:** `/backgrounds/gyeongbokgung-palace.png`
- **응답:** `{ predictionId: string }`
- **내부 처리 순서:**
  1. Sharp → 배경 블러 (sigma=1)
  2. Sharp → 인물 80% 리사이즈, 중앙 배치, 하단 정렬
  3. Sharp → 배경 색온도 샘플링 → 인물에 14% 오버레이
  4. Sharp → 발 아래 그라운드 섀도우 (반투명 타원)
  5. Replicate Flux Kontext → 조명·분위기 자연스럽게 블렌딩
- **Flux Kontext 프롬프트:** 얼굴/헤어/의상 절대 변경 금지, 조명·색온도·그림자만 조정
- **소요 시간:** 약 20~40초

#### `GET /api/composite/poll?predictionId=[id]`
- **용도:** 합성 결과 확인
- **응답:** `{ status, outputUrl? }`
- **완료 시:** compositeUrl → store 저장 → DoneFlow 이동

#### `GET /api/hair/download?url=[encoded_url]&filename=[name]`
- **용도:** 이미지 다운로드 (CORS 우회 프록시)
- **허용 도메인:** replicate.delivery, cdn.fashn.ai, fal.media, v3.fal.media
- **파일명 패턴:** `kstyleshot-[type]-[YYYYMMdd-HHmmss].jpg`

### 사용 외부 서비스

| 서비스 | 모델 | 용도 |
|---|---|---|
| Replicate | 배경 제거 모델 | 인물 배경 제거 |
| Replicate | Flux Kontext | 합성 이미지 조명 보정 |

---

## 5단계 — 완성 (DoneFlow)

**파일:** `components/create/DoneFlow.tsx`

### 사용자 동작
1. 최종 이미지 확인
2. (선택) IC-Light 조명 보정 적용
3. 다운로드 또는 공유
4. 해시태그 복사
5. "다시 만들기" → 처음으로

### 최종 이미지 우선순위
```
iclightUrl (IC-Light 보정 완료)
  > compositeUrl (배경 합성 완료)
  > outfitPreviewUrl (의상 합성 완료)
  > hairPreviewUrl (헤어 합성 완료)
  > photoBlobUrl (원본)
```

### 호출 API

#### `POST /api/iclight/preview` *(선택 적용)*
- **용도:** IC-Light 조명 재조정 시작
- **요청:** `{ subjectUrl: string, backgroundPath: string }`
- **응답:** `{ predictionId: string }`
- **내부:** Replicate IC-Light 모델 호출
- **소요 시간:** 약 30~60초

#### `GET /api/iclight/poll?predictionId=[id]`
- **용도:** IC-Light 결과 확인
- **응답:** `{ status, outputUrl? }`
- **완료 시:** iclightUrl → store 저장, 화면 갱신

#### `GET /api/composite/poll?predictionId=[id]`
- **용도:** DoneFlow 진입 시 합성이 아직 진행 중이면 계속 폴링

#### `GET /api/hair/download?url=[encoded_url]&filename=[name]`
- **용도:** 최종 이미지 다운로드

### 사용 외부 서비스

| 서비스 | 모델 | 용도 |
|---|---|---|
| Replicate | IC-Light | 자연스러운 조명 재조정 |

---

## 전체 API 목록

| 엔드포인트 | 메서드 | 용도 | 호출 단계 | maxDuration |
|---|---|---|---|---|
| `/api/session/status` | GET | 결제 세션 확인 | 1단계 | 10s |
| `/api/hair/preview` | POST | 헤어 합성 시작 | 2단계 | 10s |
| `/api/hair/poll` | GET | 헤어 합성 폴링 | 2~3단계 | 10s |
| `/api/hair/download` | GET | 이미지 다운로드 프록시 | 4~5단계 | 15s |
| `/api/body/extend` | POST | 전신 생성 시작 (백그라운드) | 2단계 | 10s |
| `/api/body/poll` | GET | 전신 생성 폴링 (백그라운드) | 2~3단계 | 10s |
| `/api/outfit/preview` | POST | 의상 합성 시작 | 3단계 | 10s |
| `/api/outfit/poll` | GET | 의상 합성 폴링 | 3단계 | 10s |
| `/api/bgremove/preview` | POST | 배경 제거 시작 (자동) | 4단계 | 10s |
| `/api/bgremove/poll` | GET | 배경 제거 폴링 | 4단계 | 10s |
| `/api/composite` | POST | 배경 합성 + 보정 시작 | 4단계 | 20s |
| `/api/composite/poll` | GET | 합성 결과 폴링 | 4~5단계 | 10s |
| `/api/iclight/preview` | POST | IC-Light 조명 보정 시작 | 5단계 (선택) | 20s |
| `/api/iclight/poll` | GET | IC-Light 결과 폴링 | 5단계 | 10s |
| `/api/checkout/create` | POST | 결제 생성 | 결제 | - |
| `/api/webhooks/polar` | POST | 결제 완료 웹훅 수신 | 결제 | - |
| `/api/data/delete` | POST | 세션 데이터 삭제 | 완료 후 | - |
| `/api/system/readiness` | GET | 서버 헬스체크 | 시스템 | - |

---

## 전체 외부 서비스 정리

| 서비스 | 모델 ID | 단계 | 용도 | 평균 소요 |
|---|---|---|---|---|
| Replicate | `flux-kontext-apps/change-haircut` | 2단계 | 헤어스타일 변경 | 30~60s |
| Replicate | `black-forest-labs/flux-fill-pro` | 2단계 (BG) | 하반신 아웃페인팅 | 15~25s |
| FAL.ai | `fal-ai/fashn/tryon/v1.5` | 3단계 | 의상 가상 피팅 | 30~60s |
| Replicate | BG Remover | 4단계 (BG) | 인물 배경 제거 | 10~20s |
| Replicate | Flux Kontext | 4단계 | 배경 합성 조명 보정 | 20~40s |
| Replicate | IC-Light | 5단계 (선택) | 자연 조명 재조정 | 30~60s |
| MediaPipe | blaze_face_short_range | 1단계 | 얼굴 감지 | <1s (로컬) |
| MediaPipe | pose_landmarker_lite | 2단계 | 전신 여부 판단 | <1s (로컬) |

---

## 전체 소요 시간 추정

| 단계 | 사용자 대기 시간 | 백그라운드 처리 |
|---|---|---|
| 1단계 업로드 | ~1초 (얼굴 감지) | - |
| 2단계 헤어 | 30~60초 (헤어 합성) | 전신 생성 15~25초 (동시) |
| 3단계 의상 | 30~60초 | 전신 생성 폴링 (동시) |
| 4단계 배경 선택 | 배경 고르는 시간 | 배경 제거 10~20초 (동시) |
| 4단계 합성 | 20~40초 | - |
| 5단계 완성 | 즉시 | IC-Light 30~60초 (선택) |
| **전체 합계** | **약 90~180초** | - |

---

## Zustand Store 주요 상태

```typescript
// store/createStore.ts
{
  // 세션
  orderId, checkoutId, sessionToken, status,

  // 사진
  photoBlobUrl,           // 업로드 원본 blob URL

  // 헤어
  hair: { chosen, results, picked },
  hairColor,              // Replicate용 색상 값
  hairPreviewUrl,         // 헤어 합성 결과 URL
  hairPredictionId,       // Replicate prediction ID

  // 전신 생성 (백그라운드)
  fullBodyUrl,            // 전신 이미지 URL (전신이면 원본, 상반신이면 Flux 결과)
  fullBodyPredictionId,   // Flux Fill Pro prediction ID

  // 의상
  outfit: { chosen, results, picked },
  outfitPreviewUrl,       // FASHN 합성 결과 URL
  outfitPredictionId,     // FAL request ID

  // 배경 제거
  bgRemovedUrl,           // 배경 제거된 투명 PNG URL
  bgRemovedPredictionId,

  // 배경 합성
  compositeUrl,           // 최종 합성 이미지 URL
  compositePredictionId,

  // IC-Light (선택)
  iclightUrl,
  iclightPredictionId,

  // 위치
  location: { chosen, results, picked },
}
```

---

## 이미지 처리 파이프라인 (canvas.ts)

```
normalizePhotoForAI(blobUrl)
 → MAX 1024px 다운스케일
 → 캔버스 높이 = 원본 + 20% 상단 패딩
 → 검정 배경 + 원본 하단 배치
 → output: JPEG base64 (quality 0.92)

createBodyExtendInputs(blobUrl)
 → 원본 이미지 + 아래 80% 확장
 → imageCanvas: 원본 위 + 검정 아래
 → maskCanvas: 검정 위(보존) + 흰색 아래(생성)
 → output: { imageDataUrl: JPEG, maskDataUrl: PNG }
   ※ 마스크는 PNG 필수 (JPEG 압축 시 경계 흐려짐)
```
