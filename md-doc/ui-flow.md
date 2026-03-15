# K-StyleShot UI 전체 흐름 문서

> 사용자가 접속해서 결과물을 받기까지의 전 과정을 단계별로 기록.
>
> Updated: 2026-03-15

---

## 전체 흐름 요약

```
사용자 셀카 업로드
    │
    ▼
[STEP 1] 업로드  /{lang}/create/upload  (UploadFlow)
  ├─ 카메라 촬영 or 파일 업로드
  └─ 얼굴 감지 (MediaPipe, 클라이언트)
     · too_close / too_far / off_center / no_face → 재업로드 유도
     · pass → 다음 단계 활성화
    │
    ▼
[STEP 2] 헤어  /{lang}/create/hair  (HairFlow)
  ├─ 헤어 스타일 1개 선택 (카테고리 탭)
  ├─ 헤어 컬러 선택 (옵션, 선택 안 하면 AI 결정)
  ├─ "헤어 생성" → /api/hair/preview → Replicate change-haircut
  ├─ 결과 1개 표시 → 마음에 들면 바로 선택, 또는 헤어 1개 추가 생성 (최대 2개 비교)
  └─ 결과 1개 선택 → /api/hair/select (기록) → outfit으로 이동
    │
    ▼
[STEP 3] 의상  /{lang}/create/outfit  (OutfitFlow — 1단계: outfit)
  └─ 의상 카테고리 선택: K-POP 무대 / 한복 퓨전 / 한국 캐주얼 / 스트릿
     의상 1개 선택 → 자동으로 배경 선택 화면으로 전환
    │
    ▼
[STEP 4] 배경  /{lang}/create/outfit  (OutfitFlow — 2단계: background)
  └─ 배경 카테고리 선택: 한복 / 무대 / 스트릿 / 공원 / 서울
     배경 1개 선택 → "합성 시작" 버튼 활성화
     → /api/final/render 호출
        · 헤어 프리뷰 업로드 (Replicate Files API)
        · nano-banana-pro: [헤어 프리뷰, 의상 이미지, 배경 이미지] 3개 동시 입력
        · predictionId 반환 → done 페이지로 이동
    │
    ▼
[Done] 완료  /{lang}/create/done  (DoneFlow)
  ├─ /api/final/poll 폴링 (3초 간격, 최대 40회)
  ├─ 완성 이미지 표시 (헤어 + 의상 + 배경 합성)
  ├─ 다운로드 / 공유
  └─ 생성한 헤어 프리뷰 개별 다운로드 (최대 2개)
```

---

## 라우트 구조

| URL | 컴포넌트 | Step 닷 |
|-----|---------|--------|
| `/{lang}/create/upload` | `UploadFlow` | ●○○○ |
| `/{lang}/create/hair` | `HairFlow` | STEP 2 / 4 |
| `/{lang}/create/outfit` (outfit 선택) | `OutfitFlow` | ○○●○ |
| `/{lang}/create/outfit` (배경 선택) | `OutfitFlow` | ○○○● |
| `/{lang}/create/done` | `DoneFlow` | — |

---

## API 호출 요약

| 단계 | 엔드포인트 | 모델 | 방향 |
|------|-----------|------|------|
| 헤어 프리뷰 시작 | `POST /api/hair/preview` | `flux-kontext-apps/change-haircut` (Replicate) | 비동기 시작 |
| 헤어 프리뷰 폴링 | `GET /api/hair/poll?predictionId=…` | — | 3초 간격, 최대 40회 |
| 헤어 선택 기록 | `POST /api/hair/select` | — | fire-and-forget |
| 최종 합성 시작 | `POST /api/final/render` | `google/nano-banana-pro` (Replicate) | 비동기 시작 |
| 최종 합성 폴링 | `GET /api/final/poll?predictionId=…` | — | 3초 간격, 최대 40회 |

---

## 최종 합성 파이프라인 (`google/nano-banana-pro`)

```
입력 3개 (image_input 배열):
  [0] 헤어 프리뷰 이미지   ← 사용자 셀카 + K-POP 헤어
  [1] 의상 이미지          ← /public/outfits/…  (outfitTemplates)
  [2] 배경 이미지          ← /public/templates/… (referenceTemplates)

파라미터:
  resolution: "2K"
  output_format: "jpg"
  safety_filter_level: "block_only_high"
  prompt: NANO_BANANA_PROMPT_TEMPLATE(sceneDescription)

출력:
  최종 합성 이미지 URL (Replicate CDN)
```

---

## 폴링 공통 규칙

| 항목 | 값 |
|------|----|
| 폴링 간격 | 3,000 ms |
| 최대 재시도 | 40회 (총 120초) |
| 타임아웃 처리 | 에러 메시지 표시 |
| 취소 방식 | `useEffect` cleanup → `clearInterval` |

---

## 얼굴 감지 기준 (UploadFlow)

| 상태 | 조건 | 처리 |
|------|------|------|
| `too_close` | 얼굴 면적 비율 > 38% | 재업로드 유도 |
| `too_far` | 얼굴 면적 비율 < 6% | 재업로드 유도 |
| `off_center` | 얼굴 중심 X < 20% or > 80% 또는 Y < 14% or > 68% | 재업로드 유도 |
| `no_face` | 감지된 얼굴 없음 | 재업로드 유도 |
| `pass` | 모든 조건 통과 | 다음 단계 활성화 |

- 모델: `face_detection_full_range.tflite` (MediaPipe, 클라이언트 실행)
- GPU delegate 사용, minDetectionConfidence 0.35

---

## 헤어 생성 규칙 (HairFlow)

- 한 번에 **1개** 스타일을 선택해 생성
- 최대 **2개**까지 순차 생성 후 비교 가능
- 이미 생성된 스타일은 재선택 불가 (disabled + "생성됨" 뱃지)
- 헤어 컬러 미선택 시 AI가 자동 결정 (`hairColor: "Random"` 전달)
- 결과 1개를 선택해야 다음 단계로 진행 가능

---

## 데이터 레이어

| 데이터 | 파일 | 비고 |
|--------|------|------|
| 헤어 스타일 목록 | `data/hairStyles.ts` | 카테고리별 탭 |
| 헤어 컬러 목록 | `data/hairColors.ts` | `replicateValue` 필드 사용 |
| 의상 템플릿 | `data/outfits.ts` | `OutfitCategory`, `imageUrl` |
| 배경 템플릿 | `data/referenceTemplates.ts` | `BackgroundCategory`, `templateImageUrl`, `sceneDescription` |
| 전역 상태 | `store/createStore.ts` | Zustand |

---

## 세션 처리

| 모드 | 조건 | 동작 |
|------|------|------|
| 데모 플로우 | `allowDemoFlow = true` (현재 항상 true) | 결제 없이 `demo-session-…` 발급 |
| 유료 플로우 | URL에 `?checkout_id=…` 포함 | `/api/session/status` 폴링 → sessionToken 확보 |

- 세션 정보는 `sessionStorage`에 캐시 (`kstyleshot.create.session`)
