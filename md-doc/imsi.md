
반드시 날짜와 시간을 한국시간으로 기록한다. 
기록은 반드시 최상단에 기록한다 
아래와 위에 =========== 를 넣어서 이전 내용과 구별되게 한다.
========================================
기록 시각: 2026-03-12 00:58:58 KST
주제: 프론트엔드 상반신 검증 적용 방안 분석
========================================

## 결론

- 제 의견도 방향 자체는 찬성이다.
- 특히 업로드 직후 브라우저에서 즉시 판정하는 방식은 서버 비용, 응답 속도, UX 관점에서 맞다.
- 다만 현재 코드와 비교하면, "아예 처음부터 없는 기술"은 아니다.
- 이미 `UploadFlow.tsx`에는 `@mediapipe/tasks-vision` 기반 얼굴 검출이 일부 들어가 있다.
- 하지만 지금 구현은 `얼굴이 있느냐 없느냐`만 본다.
- 즉, 지금 필요한 것은 "MediaPipe 도입"이 아니라 "MediaPipe 검증 로직 고도화"다.

## 현재 적용된 상태

- `components/create/UploadFlow.tsx`에서 업로드 직후 `@mediapipe/tasks-vision`를 lazy import 한다.
- `FaceDetector`로 얼굴 검출을 실행한다.
- 현재 판정은 사실상 아래 한 가지뿐이다.
- `result.detections.length > 0` 이면 통과
- `result.detections.length === 0` 이면 `no_face` 경고

즉 현재는:

- 얼굴 없음: 일부 대응함
- 얼굴이 너무 큼: 대응 안 함
- 얼굴이 너무 작음: 대응 안 함
- 얼굴 위치가 너무 치우침: 대응 안 함
- 상반신/어깨선 맥락: 대응 안 함

## 현재 구현의 문제점

- 얼굴만 검출되면 통과시키기 때문에, 초근접 셀카도 통과할 수 있다.
- 전신처럼 얼굴이 너무 작은 사진도 통과할 수 있다.
- 측면 얼굴이나 애매한 구도도 얼굴만 잡히면 넘어갈 수 있다.
- `canContinue` 로직도 현재는 데모 플로우일 때 너무 느슨해서, 사진 검증과 완전히 연결돼 있지 않다.
- 즉 기술은 일부 들어가 있지만, 제품적으로는 아직 "상반신 품질 게이트"라고 부를 수준이 아니다.

## 적용 방안

### 1. 현재 MediaPipe 유지

- 새 라이브러리를 다시 고르기보다, 이미 들어간 `@mediapipe/tasks-vision`를 계속 쓰는 것이 맞다.
- 지금 단계에서는 라이브러리 교체보다 판정 로직 확장이 우선이다.

### 2. 판정 상태를 4단계 이상으로 분리

- `checking`
- `no_face`
- `too_close`
- `too_far`
- `off_center`
- `pass`

이렇게 분리해야 사용자에게 왜 막혔는지 명확히 설명할 수 있다.

### 3. 얼굴 박스 비율 기준 추가

- 얼굴 면적 비율 = `(faceBox.width * faceBox.height) / (image.width * image.height)`
- 초안 기준:
- `> 0.50` 이면 너무 가까움
- `< 0.05` 이면 너무 멂
- 시작은 이 기준으로 두고, 실제 업로드 데이터 보며 조정하는 것이 좋다.

### 4. 위치 기준 추가

- 얼굴 중심 좌표가 화면 중앙에서 너무 벗어나면 경고를 띄운다.
- 예를 들어 얼굴 중심이 가로 20%~80%, 세로 15%~70% 범위를 벗어나면 재촬영 권장을 줄 수 있다.
- 이건 완전 차단보다 `강한 권장`부터 시작하는 것이 현실적이다.

### 5. 상반신 기준 문구와 UX 연결

- 통과 문구:
- `좋습니다. 얼굴과 어깨선이 보이는 상반신 사진으로 확인되었습니다.`
- 실패 문구:
- `얼굴이 너무 가깝습니다. 어깨선이 보이도록 조금만 뒤로 물러나 주세요.`
- `얼굴이 너무 작습니다. 이목구비가 더 잘 보이는 상반신 사진을 사용해 주세요.`
- `얼굴이 중앙에 오도록 다시 촬영해 주세요.`

### 6. CTA 잠금 조건 수정

- 다음 단계 버튼은 `photoBlobUrl`만으로 열리면 안 된다.
- 반드시 검증 상태가 `pass`일 때만 활성화되어야 한다.
- 지금 구조상 이 부분이 핵심이다.

## 내 판단

- 방향: 맞다
- 기술 선택: MediaPipe 유지가 맞다
- 현재 상태: 얼굴 존재 여부만 보는 1차 버전
- 필요한 다음 작업: 상반신 품질 게이트로 확장

## 실제 구현 우선순위

1. `UploadFlow.tsx`의 얼굴 박스 비율 계산 추가
2. `too_close / too_far / off_center / pass` 상태 추가
3. `canContinue`를 검증 통과 상태와 연결
4. 경고 문구를 한국어/영어로 정리
5. 운영 데이터 보며 임계값 미세 조정

========================================

=========================
Updated At: 2026-03-12 00:56 KST
=========================

기록 시각: 2026-03-12 00:56:50 KST

# 최종 합성 프롬프트 기록

## 현재 최종 합성에 사용하는 기본 프롬프트 구조

최종 합성은 `app/api/final/render/route.ts`에서 아래 4개를 이어붙여 만든다.

1. 인물 고정 프롬프트

- `Use the person in the base image exactly as-is.`
- `Preserve the face, identity, ethnicity, hairstyle, hair color, bangs, facial structure, skin tone, skin undertone, skin texture, eye shape, nose, lips, and jawline with 100% fidelity.`
- `Do not change the person, do not redesign the face, do not alter ethnicity or natural facial characteristics, and do not alter the hair in any way.`

2. 선택한 템플릿의 `prompt`

3. 품질 프롬프트

- `Match the person's lighting to the scene naturally.`
- `Blend clothing, hair edges, and skin into the environment without artificial seams.`
- `Keep natural skin texture and realistic detail.`
- `Photorealistic Korean fashion editorial quality.`

4. 네거티브 프롬프트

- 형식: `Avoid: [template.negativePrompt]`

## 템플릿별 프롬프트 기록

### 1. `hanbok-gyeongbokgung-1`

- 제목: `경복궁 한복 1`
- 부제: `정면 셀카 무드`

프롬프트:

`Create a photorealistic close-up selfie portrait while keeping the face, ethnicity, hairstyle, hair color, bangs, and overall identity exactly the same as the base image. Maintain the same person and preserve facial structure, eyes, nose, lips, skin texture, skin undertone, and hair silhouette. Frame the image tightly from the chest up like a natural smartphone selfie. The subject should feel stylish, modern, and polished with a Seoul fashion editorial mood and idol-inspired styling, without changing the person's original ethnicity or natural facial characteristics. She is holding a trendy smartphone in one hand, and the decorative phone case and rear camera lenses are clearly visible to the viewer. Change the clothing to a chic and elegant traditional Korean Hanbok jeogori for a young idol, with refined fabric detail and delicate floral embroidery around the collar. Change the background to the courtyard of Gyeongbokgung Palace in Seoul during warm golden hour light. Add softly blurred tourists and visitors walking in the background. Keep the image realistic, premium, and natural like a real high-end selfie snapshot.`

네거티브 프롬프트:

`different face, different hairstyle, different hair color, short hair, missing bangs, distorted face, deformed eyes, bad anatomy, extra fingers, bad hands, duplicate person, malformed clothing, blurry face, low detail, unrealistic phone, broken phone case, anime, cartoon, illustration, painting, oversaturated, plastic skin, airbrushed skin, wax figure`

### 2. `hanbok-gyeongbokgung-2`

- 제목: `경복궁 한복 2`
- 부제: `대칭 각도 있는 셀카 무드`

프롬프트:

`Create a photorealistic smartphone selfie portrait while keeping the face, ethnicity, hairstyle, hair color, bangs, and overall identity exactly the same as the base image. Maintain the same person and preserve facial structure, eyes, nose, lips, skin texture, skin undertone, and hair silhouette. Frame the image from the upper body with slightly more background visible than a tight close-up. The subject should feel stylish, modern, and polished with a Seoul fashion editorial mood and idol-inspired styling, without changing the person's original ethnicity or natural facial characteristics. She is holding a trendy smartphone in one hand, and the decorative phone case and rear camera lenses are clearly visible to the viewer. Change the clothing to a chic and elegant traditional Korean Hanbok jeogori for a young idol, with refined fabric detail and delicate floral embroidery around the collar. Change the background to a different Gyeongbokgung Palace courtyard angle in Seoul during warm golden hour light, with more palace architecture visible behind her. Add softly blurred visitors in the background and give the pose a slightly angled, more candid selfie feel. Keep the image realistic, premium, and natural like a real high-end selfie snapshot.`

네거티브 프롬프트:

`different face, different hairstyle, different hair color, short hair, missing bangs, distorted face, deformed eyes, bad anatomy, extra fingers, bad hands, duplicate person, malformed clothing, blurry face, low detail, unrealistic phone, broken phone case, anime, cartoon, illustration, painting, oversaturated, plastic skin, airbrushed skin, wax figure`

# 2026-03-12 UX 메모

## 상단 메모: 업로드 사진은 프론트엔드에서 상반신 기준으로 즉시 검증하는 방향이 맞다

- 내 의견도 같다. 이 검증은 비싼 외부 API보다 프론트엔드 온디바이스 방식이 더 적합하다.
- 이유는 비용보다도 UX 때문이다. 사용자가 사진을 올리자마자 즉시 안내를 받아야 하고, 몇 초 뒤 서버에서 실패를 돌려주는 구조는 프리미엄 경험이 아니다.
- 목표는 `정면 또는 준정면`, `얼굴이 너무 크지 않음`, `얼굴이 너무 작지 않음`, `어깨선이 어느 정도 보이는 상반신 사진`을 다음 단계로 통과시키는 것이다.

### 권장 기술 방향

- 1순위: `MediaPipe Face Detection` 또는 `MediaPipe Tasks Vision`
- 대안: `face-api.js`
- 원칙: 업로드 직후 브라우저에서 얼굴 박스를 검출하고, 얼굴 면적 비율과 위치를 기준으로 통과 여부를 판정한다.

### 권장 판정 기준 초안

- 얼굴이 검출되지 않으면 업로드 차단
- 얼굴 면적 비율이 너무 크면 차단
- 얼굴 면적 비율이 너무 작으면 차단
- 얼굴 중심이 화면 중앙에서 너무 벗어나면 재업로드 권장
- 가능하면 어깨선 또는 상반신 맥락이 보이는 사진만 허용

### 실무 판단

- 현재 목적은 헤어 합성과 최종 합성 품질 확보이므로, 전신 사진보다 상반신 사진 중심으로 강하게 가이드하는 것이 맞다.
- 다만 처음부터 기준을 너무 빡빡하게 잡으면 정상 사진도 많이 탈락하므로, 1차는 완전 차단보다 `강한 경고 + 재업로드 권장`으로 시작하고, 실제 실패 데이터를 보며 임계값을 조정하는 것이 좋다.
- 즉, 방향은 맞고 구현 가치도 높다. 다만 임계값은 운영 데이터를 보며 조정해야 한다.

## 핵심 방향

- 헤어 선택은 순차 비교형 플로우로 유지한다.
- 사용자는 먼저 헤어 1개를 생성한다.
- 첫 결과를 본 뒤 비교가 필요하면 헤어 1개를 추가로 더 생성한다.
- 결과가 2개 준비되면 그중 1개를 선택한 뒤 다음 단계로 이동한다.

## 프리뷰 원칙

- 헤어를 선택한 이후 다음 단계의 프리뷰는 반드시 선택된 헤어 결과 이미지를 사용해야 한다.
- 이후 단계에서 원본 업로드 사진으로 다시 돌아가면 안 된다.
- 사용자는 이미 해당 헤어 결과를 선택해 확정했다고 느끼기 때문에, 이후 화면도 그 선택을 이어받아야 한다.

## 장소 / 배경 선택 단계 멘트 방향

- 장소 또는 배경 선택 단계에서는 AI가 선택된 얼굴과 헤어 결과를 유지한 채, 장면, 각도, 조명, 구도를 맞추고 있다는 설명이 나가야 한다.
- 단순히 로딩 스피너만 보여주는 방식이 아니라, 지금 무엇을 보존하고 무엇을 조정하는지 설명하는 문구가 필요하다.

추천 문구:

- `선택한 헤어는 유지한 채, 얼굴 각도와 분위기에 맞춰 장면과 구도를 정리하고 있습니다.`
- `AI가 현재 이미지를 기준으로 자연스럽게 합성 중입니다. 잠시만 기다려 주세요.`

## 차단 모달 권장

- 헤어 합성 중, 배경 합성 중, 최종 합성 중에는 차단형 모달을 두는 것이 좋다.
- 생성이 진행되는 동안 사용자는 다른 버튼이나 화면 요소를 누를 수 없어야 한다.
- 모달은 전체 화면을 어둡게 덮고, 뒤 배경과의 상호작용을 막아야 한다.
- 모달은 단순한 스피너가 아니라, AI가 현재 무엇을 유지하고 무엇을 조정 중인지 설명해야 한다.
- 추가 디테일로, 차단 모달 뒤에는 사용자가 직전에 확정한 이미지를 블러 처리해 은은하게 보여주는 방식이 좋다.

## 제품 관점 정리

- 선택된 헤어 결과는 이후 단계 전체의 기준 이미지가 되어야 한다.
- 사용자는 시스템이 자신의 마지막 확정 선택을 바탕으로 다음 결과를 만들어 간다고 느껴야 한다.
- 이 흐름이 더 고급스럽고, 신뢰감이 높고, 프리미엄 제품 경험에 가깝다.
========================================
기록 시각: 2026-03-12 13:20 KST
주제: 업로드 사진 얼굴 감지 방식과 조정 포인트 정리
========================================

## 현재 업로드 얼굴 감지 방식

- 얼굴 감지는 서버가 아니라 클라이언트에서 즉시 수행된다.
- 실제 로직은 `components/create/UploadFlow.tsx`에 있다.
- 업로드 직후 `handleFileChange()`가 실행된다.
- 여기서 `@mediapipe/tasks-vision`을 lazy import 한다.
- `FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")`로 wasm을 불러온다.
- 이후 `FaceDetector.createFromOptions()`로 얼굴 검출기를 만든다.

현재 핵심 설정:

- 모델: `blaze_face_short_range`
- delegate: `GPU`
- runningMode: `IMAGE`
- minDetectionConfidence: `0.5`

얼굴을 찾으면 bounding box 기준으로 한 번 더 검증한다.

현재 프레이밍 판정값:

- `FACE_RATIO_TOO_CLOSE = 0.38`
- `FACE_RATIO_TOO_FAR = 0.08`
- `FACE_CENTER_X_MIN = 0.24`
- `FACE_CENTER_X_MAX = 0.76`
- `FACE_CENTER_Y_MIN = 0.16`
- `FACE_CENTER_Y_MAX = 0.64`

판정 순서:

1. 검출 결과가 0개면 `no_face`
2. 얼굴 면적 비율이 38% 초과면 `too_close`
3. 얼굴 면적 비율이 8% 미만이면 `too_far`
4. 얼굴 중심이 중앙 허용 범위를 벗어나면 `off_center`
5. 모두 통과하면 `pass`

다음 단계 버튼은 `faceWarning === "pass"`일 때만 활성화된다.

## 지금 "정면인데도 아예 인식을 못함"이 발생할 가능성이 큰 지점

### 1. short-range 모델이 너무 공격적일 수 있음

- 현재 모델은 `blaze_face_short_range`다.
- 이 모델은 카메라에 비교적 가까운 얼굴 감지에 유리하지만, 업로드 사진처럼 해상도와 촬영 조건이 제각각인 경우에는 놓칠 수 있다.
- 특히 얼굴이 작거나 배경 대비가 약하면 `result.detections.length === 0`로 바로 떨어질 수 있다.

### 2. `minDetectionConfidence: 0.5`가 높을 수 있음

- 현재는 0.5 미만 검출을 모두 버린다.
- 업로드 이미지 품질이 조금만 흔들려도 정면 얼굴이 `no_face`로 분류될 수 있다.
- 첫 조정 후보는 `0.35 ~ 0.4` 수준이다.

### 3. 업로드 사진에는 GPU delegate 고정이 꼭 이점이 아니다

- 현재 `delegate: "GPU"` 고정이다.
- 브라우저/기기 조합에 따라 GPU 경로가 불안정할 수 있다.
- 다만 이 경우 현재 코드는 `catch`에서 오히려 `pass` 처리하므로, "감지를 못해서 막힘"의 직접 원인일 가능성은 `short_range + confidence`보다 낮다.

### 4. 지금 구조는 첫 번째 얼굴만 본다

- `result.detections[0]`만 사용한다.
- 사진에 여러 얼굴이 있거나 첫 번째 박스가 원하는 얼굴이 아니면 오판정 가능성이 있다.

## 권장 설정

업로드 사진 기준으로는 아래 순서가 더 안전하다.

### 우선 조정할 값

- 모델을 `short_range`에서 `full_range` 계열로 검토
- `minDetectionConfidence`를 `0.5`에서 `0.35` 또는 `0.4`로 낮춤
- 첫 번째 얼굴 고정 대신 가장 큰 얼굴 박스를 선택

### 프레이밍 기준값은 당장 크게 문제 아님

- 지금 증상이 "정면인데 no_face"라면 ratio/center 임계값보다 검출기 단계가 먼저 의심된다.
- ratio/center 값은 얼굴을 찾은 뒤의 2차 필터라서, 현재 문제의 1차 원인은 아니다.

## 실무적으로 추천하는 설정안

1차 권장안:

- 모델: full-range face detector
- `minDetectionConfidence: 0.35`
- 여러 얼굴 중 가장 큰 얼굴 사용
- ratio/center 기준은 일단 현행 유지

2차 보정안:

- `FACE_RATIO_TOO_FAR`를 `0.08`에서 `0.06`으로 완화
- `FACE_CENTER_X_MIN/MAX`를 `0.24/0.76`에서 `0.20/0.80`으로 완화
- `FACE_CENTER_Y_MIN/MAX`를 `0.16/0.64`에서 `0.14/0.68`으로 완화

단, 현재 사용자 증상 기준으로는 2차 보정안보다 검출기 설정 조정이 우선이다.

## 코드 기준 요약

- 감지 시작: `components/create/UploadFlow.tsx`의 `handleFileChange()`
- 박스 검증: 같은 파일의 `validateFaceBox()`
- 다음 단계 잠금: 같은 파일의 `canContinue`와 `handleContinue()`

## 결론

- 지금 업로드 감지는 "업로드 후 클라이언트 MediaPipe 1회 검출 + 박스 비율/중앙 검증" 구조다.
- 정면 사진인데 아예 못 잡는다면 가장 먼저 의심할 값은 `blaze_face_short_range`와 `minDetectionConfidence: 0.5`다.
- 실전에서는 `full_range + confidence 0.35~0.4 + 가장 큰 얼굴 선택` 조합으로 바꾸는 것이 더 안정적이다.

========================================
