# kstyleshot - UI Flow Specification

작성: Codex (GPT-5)  
작성 시각: 2026-03-05 +09:00 (Asia/Seoul)  
문서 목적: `plan.md` + `todo.md` + 참고 시안(`imsi_image/code*.html`) + 현재 코드 상태를 결합한 UI 실행 명세

---

## 1. 문서 범위

이 문서는 아래 범위를 다룬다.

1. 랜딩/생성/완료 화면의 역할 분리
2. `checkout -> webhook -> session polling -> hair -> outfit -> location -> done` 전 구간 UI 흐름
3. 실제 코드 파일 기준 컴포넌트 맵
4. 상태 가시화 규칙(ready/missing/blocked/current/done)
5. 모바일/데스크톱 반응형 규칙
6. 에러 및 예외 처리 UX

이 문서는 시각 무드보드가 아니라 "바로 구현 가능한 동작 명세"를 목표로 한다.

---

## 2. 디자인 원칙

### 2.1 역할 분리

시안 3개를 한 화면에 섞지 않는다.

1. `code2.html`: 랜딩 경험(브랜드, 트렌드, 신뢰)
2. `code1.html`: 생성 작업 화면(업로드/선택/생성/선택)
3. `code.html`: 완료 및 다운로드/공유 화면

### 2.2 이 서비스의 우선순위

이 프로젝트는 예쁜 카드보다 "상태 신뢰성"이 핵심이다.

1. 결제/세션 상태를 매 단계에서 명확히 노출
2. 블로킹 사유를 숨기지 않고 표시
3. 데모/실환경 경로를 텍스트로 명확히 분리

### 2.3 톤앤매너

1. Light-first 기반(운영/법무 가독성 우선)
2. 포인트 컬러 1개(Hot Pink 계열) + 뉴트럴 베이스
3. 폰트는 Sans 계열(`Spline Sans` 또는 `Pretendard`)로 통일
4. 과한 글로우/네온 효과는 랜딩 Hero 영역으로 제한

---

## 3. 정보 구조(IA)

### 3.1 최상위 구간

1. Landing: `/[lang]`
2. Create Step 1: `/[lang]/create`
3. Create Step 2: `/[lang]/create/upload`
4. Create Step 3: `/[lang]/create/hair`
5. Create Step 4: `/[lang]/create/outfit`
6. Create Step 5: `/[lang]/create/location`
7. Create Step 6: `/[lang]/create/done`

### 3.2 플로우 게이트

1. `/create`: checkout 시작점
2. `/create/upload`: `checkout_id` 존재 시 session polling
3. `/create/hair`: `photoBlobUrl + verified session` 필요
4. `/create/outfit`: hair pick 필요
5. `/create/location`: outfit pick 필요
6. `/create/done`: 최종 pick 필요

---

## 4. 전역 레이아웃 사양

### 4.1 공통 골격

각 생성 단계(`upload~done`)는 아래 2열 레이아웃을 기본으로 한다.

1. 좌측 고정 패널
2. 우측 작업 패널

모바일에서는 1열로 접고, 좌측 패널을 상단으로 올린다.

### 4.2 좌측 고정 패널(Sticky)

항상 아래 정보를 보여준다.

1. Step Timeline(현재/완료/차단)
2. Session Badge(`payment_pending`, `payment_confirmed`, `failed`)
3. 선택 요약(hair/outfit/location picked)
4. 업로드 미리보기(존재 시)
5. 법무 고지 축약 2줄 + 전체보기 링크

### 4.3 우측 작업 패널

현재 단계에 필요한 인터랙션만 배치한다.

1. 선택 그리드
2. Generate CTA
3. 진행 상태 문구
4. 결과 카드 2개
5. 다음 단계 CTA

---

## 5. 단계별 UI 플로우

## 5.1 Step 1 - Create (`/[lang]/create`)

목표: 결제 시작 전 준비 상태 확인 + checkout 진입

화면 구성:

1. 제목: "Create session"
2. `ApiReadinessPanel`
3. `AgeGate`, `ConsentCheckbox`
4. `Start Polar checkout` 버튼
5. (개발 모드) `Open local demo flow`

상태 규칙:

1. checkout/session/hair 준비 상태는 `ready/missing`
2. outfit/cutout은 `blocked`로 명시
3. missing이면 어떤 env가 빠졌는지 줄단위 노출

실패 UX:

1. API 에러 메시지 + `requestId` 노출
2. 재시도 버튼 유지

---

## 5.2 Step 2 - Upload (`/[lang]/create/upload`)

목표: 결제 세션 확보 + 셀카 업로드 + hair 단계 진입

입장 분기:

1. `checkout_id` 있음: `/api/session/status` 폴링
2. `checkout_id` 없음 + dev 허용: 데모 경로
3. `checkout_id` 없음 + prod: 진행 차단

UI 동작:

1. 상단 notice에 현재 분기 상태 명시
2. 폴링 중: CTA 비활성 + "Waiting for payment confirmation"
3. 세션 준비됨: 배지 `ready`, URL에서 `checkout_id` 제거
4. 파일 업로드 후 "Continue to hair" 활성

실패 UX:

1. 폴링 실패 시 `requestId` 포함 오류
2. "Back to create" 링크 제공

---

## 5.3 Step 3 - Hair (`/[lang]/create/hair`)

목표: 스타일 2개 선택 -> 실생성 -> 결과 1개 확정

UI 동작:

1. StyleSelector: 2개까지 선택
2. `Generate hair previews` 클릭 시 `hair_processing`
3. polling 중 진행 문구/스켈레톤 표시
4. 결과 카드 2개 노출(ResultGrid)
5. 1개 선택 후 `Continue to outfit`

차단 조건:

1. `photoBlobUrl` 없음 -> upload로 리다이렉트 유도
2. `sessionToken`이 demo 또는 없음 -> 실생성 차단

---

## 5.4 Step 4 - Outfit (`/[lang]/create/outfit`)

목표: 현재는 mock UX, 향후 provider 실연동 대비

UI 동작(현행):

1. 2개 선택
2. mock generate
3. 결과 1개 선택
4. cutout 준비 상태를 거쳐 location으로 이동

표시 규칙:

1. 단계 배지: `Provider pending (MVP mock)`
2. production 배포 전에는 실연동 여부를 명확히 라벨링

---

## 5.5 Step 5 - Location (`/[lang]/create/location`)

목표: 배경 2개 선택 -> 합성 결과 2개 -> 최종 1개 선택

UI 동작(현행):

1. 배경 2개 선택
2. mock composite 실행
3. 결과 1개 선택 후 done 이동

향후 실연동:

1. `cutout_completed` 상태 확인 후 합성 시작
2. canvas 합성 완료 시 `composite_completed`

---

## 5.6 Step 6 - Done (`/[lang]/create/done`)

목표: 최종 결과 다운로드 + 로컬 데이터 정리

화면 구성:

1. 최종 대표 이미지
2. 선택 메타(order/session/hair/outfit/background)
3. `Download final`
4. `Delete local data`

추가 권장:

1. `Try another style` CTA
2. 공유 버튼은 실제 URL 공유 가능해질 때 활성

---

## 6. 상태 가시화 규칙

### 6.1 Step Timeline 상태

각 step은 아래 중 하나만 가진다.

1. `done`
2. `current`
3. `blocked`
4. `upcoming`

### 6.2 Job Status -> UI 라벨 매핑

1. `payment_pending`: 결제 대기
2. `payment_confirmed`: 결제 확인
3. `hair_processing`: 헤어 생성 중
4. `hair_completed`: 헤어 결과 준비됨
5. `outfit_processing`: 의상 생성 중
6. `cutout_processing`: 배경 제거 중
7. `composite_completed`: 합성 완료
8. `failed`: 실패
9. `refunded`: 환불 완료

### 6.3 강제 노출해야 하는 정보

1. 현재 status
2. 현재 step
3. 마지막 API 에러 + `requestId`
4. 다음 액션(사용자가 지금 해야 할 것)

---

## 7. 컴포넌트 맵(현 코드 기준)

### 7.1 유지/확장 대상

1. `components/create/StepProgress.tsx`
2. `components/create/PhotoUpload.tsx`
3. `components/create/StyleSelector.tsx`
4. `components/create/ResultGrid.tsx`
5. `components/create/FinalResult.tsx`
6. `components/create/ApiReadinessPanel.tsx`

### 7.2 신규 권장 컴포넌트

1. `components/create/CreateShell.tsx`
2. `components/create/SessionStatusBadge.tsx`
3. `components/create/SelectionSummaryCard.tsx`
4. `components/create/StepTimeline.tsx` (기존 StepProgress 대체 또는 확장)
5. `components/create/FlowNoticeBar.tsx`

### 7.3 페이지별 적용 우선순위

1. `/create/upload`
2. `/create/hair`
3. `/create/outfit`
4. `/create/location`
5. `/create/done`

---

## 8. 반응형 규칙

### 8.1 Breakpoint

1. Mobile: `< 768px`
2. Tablet/Desktop: `>= 768px`
3. Wide: `>= 1200px`

### 8.2 레이아웃

1. Mobile: 1열, CTA full-width
2. Tablet+: 좌측 패널 320px 고정 + 우측 유동
3. Wide: 결과 카드 최대 폭 제한(가독성 유지)

### 8.3 스크롤 규칙

1. 좌측 패널 sticky
2. 우측만 스크롤되도록 과도한 중첩 스크롤 금지

---

## 9. 모션 규칙

1. 상태 전이 애니메이션은 120~180ms
2. polling 상태는 skeleton + 텍스트만
3. 생성 완료 시 카드 fade-in/stagger(최대 2개)
4. 로딩 중 버튼 label 변환 + spinner

---

## 10. 접근성/가독성

1. 모든 이미지에 의미 있는 `alt`
2. 선택 카드 키보드 포커스 outline 명확화
3. 상태 색상만으로 구분하지 않고 텍스트 배지 병행
4. 본문 최소 16px, 보조 14px 이하 지양

---

## 11. 카피 가이드(요약)

1. 기술 내부 용어는 사용자 카피에서 최소화
2. 차단 메시지는 원인+다음 행동을 같이 제공
3. 데모 경로는 "development only"를 명시
4. 법무 문구는 축약+전체 보기 분리

예시:

1. "Payment confirmed. Your session is ready."
2. "A paid session is required. Start from Step 1."
3. "Provider pending: this step runs in mock mode."

---

## 12. 구현 순서(권장)

1. Create Shell + Step Timeline 먼저 도입
2. Upload/Hair를 새 Shell로 마이그레이션
3. Outfit/Location mock 라벨 명확화
4. Done 화면을 `code.html` 계열 액션 중심으로 개선
5. 마지막으로 Landing을 `code2.html` 방향으로 강화

---

## 13. 완료 정의(DoD)

아래를 만족하면 UI 플로우 1차 완료로 본다.

1. 모든 단계에서 현재 상태/차단 사유를 3초 내 파악 가능
2. `checkout_id` 기반 세션 폴링 흐름이 화면에서 명확히 드러남
3. Hair 실생성 경로와 Outfit/Location mock 경로가 혼동되지 않음
4. 모바일에서도 단계 진행 CTA가 항상 화면 하단 1회 스크롤 이내에 있음
5. 에러 발생 시 `requestId`를 사용자가 바로 확인 가능

