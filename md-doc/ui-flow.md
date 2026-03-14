# K-StyleShot UI 전체 흐름 문서

> 사용자가 접속해서 결과물을 받기까지의 전 과정을 단계별로 기록.
>
> Updated: 2026-03-14 (토) 오후

---

## 전체 흐름 요약

```
사용자 셀카 업로드
    │
    ▼
[1단계] 업로드 (UploadFlow)
  └─ 얼굴 감지 (MediaPipe, 클라이언트)
    │
    │ 헤어 스타일 2개 선택
    ▼
[2단계] 헤어 프리뷰 생성 (HairFlow)
  └─ change-haircut × 2 (Replicate, 병렬)
     input: 사용자 셀카
     → 프리뷰 A / 프리뷰 B 생성 (비교 선택용)
    │
    │ 프리뷰 비교 후 1개 선택
    ▼
[3단계] 헤어 선택
  └─ 선택한 헤어스타일 저장
    │
    │ 템플릿 선택 (경복궁 한복 등)
    ▼
[4단계] 템플릿 선택 (OutfitFlow)
  └─ templateImageUrl 확정
    │
    │ 최종 생성 시작
    ▼
[5단계] face-swap
  └─ cdingram/face-swap (Replicate)
     input_image: 템플릿 이미지
     swap_image:  사용자 셀카 원본
     → 결과: 템플릿 바디 + 사용자 얼굴
    │
    │ face-swap 완료 대기 (~11초)
    ▼
[6단계] change-haircut
  └─ flux-kontext-apps/change-haircut (Replicate)
     input: face-swap 결과물
     haircut: 사용자가 선택한 헤어스타일
     → 결과: 템플릿 바디 + 사용자 얼굴 + K-POP 헤어
    │
    ▼
[Done] 완성 (DoneFlow)
  └─ 경복궁 한복 + 사용자 얼굴 + K-POP 헤어
     다운로드 / 공유
```

---

## API 호출 요약

| 단계 | 모델 | provider | 예상 소요 시간 |
|------|------|----------|--------------|
| 헤어 프리뷰 × 2 | `flux-kontext-apps/change-haircut` | Replicate | ~30-60초 (병렬) |
| face-swap × 1 | `cdingram/face-swap` | Replicate | ~11초 |
| change-haircut × 1 | `flux-kontext-apps/change-haircut` | Replicate | ~30-60초 |
| **전체 합계** | | | **약 70~130초** |

---

## 코드 변경 범위

| 파일 | 변경 내용 |
|------|----------|
| `lib/replicate.ts` | `startFaceSwapJob()` 함수 추가 |
| `data/referenceTemplates.ts` | `templateImageUrl` 필드 추가 |
| `app/api/final/render/route.ts` | face-swap → change-haircut 순서로 교체 |
| `app/api/final/poll/route.ts` | 2단계 폴링 처리 |

> 헤어 프리뷰 플로우 (1~3단계) 는 변경 없음.

---

## 사용 외부 서비스

| 서비스 | 모델 ID | 단계 | 용도 |
|--------|---------|------|------|
| MediaPipe | blaze_face_short_range | 1단계 | 얼굴 감지 (클라이언트) |
| Replicate | `flux-kontext-apps/change-haircut` | 2단계 | 헤어 프리뷰 생성 × 2 |
| Replicate | `cdingram/face-swap` | 5단계 | 셀카 → 템플릿 얼굴 합성 |
| Replicate | `flux-kontext-apps/change-haircut` | 6단계 | K-POP 헤어 최종 적용 |

---

## 공통 폴링 규칙

| 항목 | 값 |
|------|----|
| 폴링 간격 | 3,000ms (3초) |
| 최대 재시도 | 40회 (총 120초) |
| 타임아웃 처리 | 에러 표시 |
| 취소 방식 | useEffect cleanup → clearInterval |

---

## 템플릿 이미지

- 저장 위치: `public/templates/hanbok/`
- 현재 등록: `hanbok2.jpeg` (경복궁 한복, 정면, 자연광)
- face-swap target_image로 사용

---

## 결정 히스토리 (2026-03-14)

- Flux Kontext Pro 단독 프롬프트 방식 → **폐기**
  - 단일 이미지 입력 제약, 템플릿을 실제로 참조 불가
- Flux Fill inpainting 방식 → **폐기**
  - 참조 이미지 없이 프롬프트로만 얼굴 생성 → hallucinate
- easel-ai/advanced-face-swap → **deprecated로 사용 불가**
- omniedgeio/face-swap → **링크 끊김**
- **cdingram/face-swap (2.3M 런, Replicate) → 채택**
  - 헤어 컨트롤 옵션 없음, 대신 change-haircut이 최종 덮어씌움
  - 올바른 파이프라인 순서: face-swap → change-haircut
