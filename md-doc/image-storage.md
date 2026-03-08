# 이미지 스토리지 전략

> 최초 작성: 2026-03-08 (KST)
> 최종 업데이트: 2026-03-08 (KST)

---

## 의류 합성 구현에 필요한 것

> 기록일: 2026-03-08 (KST)

코드 작업은 완료 대기 중. 아래 두 가지 에셋만 전달받으면 즉시 구현 시작 가능.

### 전달 필요 항목

**1. 의상 이미지 파일**
- 용도: `cloth_image` — Replicate try-on API 입력값
- 저장 위치: `/public/outfits/`
- 조건: 전신샷, JPG/PNG/WebP 모두 OK
- 권장 해상도: 1024×1024 (Replicate 모델 권장사항)

**2. 배경 이미지 파일**
- 용도: 최종 합성 배경
- 저장 위치: `/public/backgrounds/`
- 조건: 포맷 무관

---

## 이미지 용량 가이드라인

> 기록일: 2026-03-08 (KST)

### 용량에 따른 문제

이미지가 크면 두 가지 문제 발생:

**① base64 변환 후 요청 크기 (유저 사진)**

| 원본 | base64 변환 후 | 상태 |
|------|--------------|------|
| 500KB | ~670KB | 문제없음 |
| 1MB | ~1.3MB | 약간 느림 |
| 2MB | ~2.7MB | Replicate 전송 느림 |
| 4MB+ | ~5.3MB+ | Vercel 4.5MB 바디 제한 초과 위험 ❌ |

**② 의상/배경 이미지 (`/public/`) UI 로딩 속도**

유저가 페이지 로딩 시 의상 썸네일을 내려받아야 해서 용량이 크면 UI가 느려짐.

### 권장 사이즈

| 용도 | 권장 해상도 | 권장 용량 |
|------|-----------|---------|
| 의상 썸네일 (UI 표시용) | 600×800px | 100KB 이하 |
| 의상 원본 (Replicate 전송용) | 1024×1024px | 500KB 이하 |
| 배경 썸네일 | 600×400px | 100KB 이하 |

### 해결책: API Route에서 Sharp 자동 리사이즈

어떤 크기의 이미지를 받아도 서버(API Route)에서 **Sharp 라이브러리로 자동 리사이즈 후 Replicate에 전송**.
→ 이미지 원본 크기에 무관하게 안정적으로 처리 가능.
→ 구현 예정 항목에 포함.

---

### 전달받으면 즉시 처리할 작업
- [ ] `/public/outfits/`, `/public/backgrounds/` 에 이미지 배치
- [ ] `data/outfits.ts` 각 outfit에 `cloth_image` URL 추가
- [ ] `lib/replicate.ts` — `startOutfitTryOnJob` 함수 추가
- [ ] `app/api/outfit/preview/route.ts` — 합성 시작 API
- [ ] `app/api/outfit/poll/route.ts` — 결과 폴링 API
- [ ] `OutfitFlow` — 합성 결과 표시 연동

## 결론 요약

| 이미지 종류 | 저장 위치 | 이유 |
|------------|----------|------|
| 의상 이미지 | `/public/outfits/` | 개발자 관리 고정 에셋, git으로 버전 관리 |
| 배경 이미지 | `/public/backgrounds/` | 개발자 관리 고정 에셋, git으로 버전 관리 |
| 유저 업로드 사진 | Vercel Blob (임시) | 공개 HTTPS URL 필요, 처리 후 즉시 삭제 |

---

## 왜 의상/배경은 `/public` 폴더?

- 코드와 이미지를 git으로 함께 버전 관리 가능
- 이미지 수정 시 재배포로 자동 반영
- 추가 설정 불필요
- 무료

Vercel Blob은 개발자가 관리하는 고정 에셋보다 **유저 생성 콘텐츠(UGC)** 에 더 적합.

---

## 유저 사진 처리 흐름 (Vercel Blob + 즉시 삭제)

```
유저 사진 업로드
→ Vercel Blob에 임시 저장 (공개 HTTPS URL 획득)
→ Replicate API에 URL 전달 (try-on 합성)
→ 결과 수신 즉시 Vercel Blob에서 삭제
```

**보관 시간: 수십 초 ~ 2분** (Replicate 처리 시간만큼만)

---

## Vercel Blob 자동 TTL

- Vercel Blob 자체 TTL 기능: ❌ 없음
- 대신 두 가지 안전장치 적용:

### 1. 처리 즉시 삭제 (primary)
Replicate에서 결과를 받는 순간 `del()` 호출로 즉시 삭제.

### 2. Vercel Cron Job (백업 안전장치)
Hobby 플랜 크론 1개 사용 가능.
매 1시간마다 1시간 이상 된 `user-photos/*` 파일 전부 삭제.

---

## 법적 대응 (COPPA / 개인정보보호)

미국 COPPA(아동 온라인 개인정보보호법) 대응:

- [ ] 업로드 화면에 **"사진은 AI 처리 후 즉시 삭제됩니다"** 문구 표시
- [ ] 이용약관에 데이터 보관 정책 명시
- [ ] **14세 미만 이용 불가** 동의 체크박스 추가 (COPPA 대응)
- [ ] 사이트 내 연령 제한 명시 (14세 이상만 이용 가능)

---

## 폴더 구조

```
/public/
├── outfits/
│   ├── idol-dress-01.webp
│   ├── streetwear-02.webp
│   └── ...
└── backgrounds/
    ├── gyeongbokgung.webp
    ├── hongdae.webp
    └── ...

Vercel Blob
└── user-photos/          ← 유저 업로드 사진 (처리 후 즉시 삭제)
```

---

## 사용 모델

- **헤어 합성**: `flux-kontext-apps/change-haircut` (Replicate)
- **의상 합성**: `cedoysch/flux-fill-redux-try-on` (Replicate)
  - `person_image`: base64 data URL (저장 없음)
  - `cloth_image`: `/public/outfits/` 이미지 URL
  - `clot_type`: `"overall"` (전신 고정)

---

## ⚠️ 유저 사진을 저장하면 안 되는 이유

> 검토일: 2026-03-08 (KST)
> 결론: **Vercel Blob 저장 없이 base64로 직접 전송** — Replicate 공식 확인 완료

### 1. 미국 법률 리스크

#### COPPA (Children's Online Privacy Protection Act)
- 적용 대상: 13세 미만 아동
- 사진은 **개인 식별 정보(PII)** 로 분류
- 14세 이상 명시해도 **실제 연령 검증 없이는 책임 면제 안 됨**
- 클릭 동의("14세 이상입니다") 는 법적으로 불충분한 연령 검증

#### California AADC (Age-Appropriate Design Code / AB 2273)
- 적용 대상: 18세 미만 캘리포니아 거주 미성년자
- 미성년자 데이터에 대해 강화된 프라이버시 보호 의무 적용
- 사진 저장 자체가 데이터 수집으로 간주될 수 있음

#### Illinois BIPA (Biometric Information Privacy Act)
- 사진에서 얼굴 특징 추출 = **생체 정보 수집**으로 간주
- 명시적 동의 없이 저장 시 **건당 $1,000 ~ $5,000 벌금**
- 일리노이주 외에도 텍사스, 워싱턴주 등 유사 법률 존재

### 2. 기술적 해결책: base64 직접 전송

Replicate 공식 문서 확인 결과:
> "Files should be passed as HTTP URLs or **data URLs**."

→ `person_image`에 base64 data URL 직접 전송 가능
→ 서버에 저장하지 않고 브라우저 메모리 → API Route → Replicate로 바로 전달
→ **저장 기록 자체가 없으므로 법적 리스크 제로**

### 3. 최종 채택 흐름

```
유저 사진 (브라우저 메모리, blob URL)
→ base64 data URL 변환 (클라이언트)
→ /api/outfit/preview 로 전송
→ Replicate API에 직접 전달 (저장 없음)
→ 합성 결과 URL만 반환
→ 유저 사진 흔적 없음 ✅
```

### 4. 추가 권장 조치

- [ ] 업로드 화면에 **"사진은 AI 처리에만 사용되며 서버에 저장되지 않습니다"** 문구 표시
- [ ] 이용약관에 데이터 미보관 정책 명시
- [ ] **14세 미만 이용 불가** 동의 체크박스 추가
- [ ] 사이트 전체에 연령 제한 명시 (14세 이상)
