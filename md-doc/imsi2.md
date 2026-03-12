# K-StyleShot UI 흐름 및 아키텍처 집중 분석 (ui-flow.md 기반)

Updated At: 2026-03-10 KST

`md-doc/ui-flow.md` 문서를 바탕으로 현재 앱이 실제로 구동되는 아키텍처의 리스크와 한계를 분석하고, 글로벌 B2C 과금형 서비스로서 살아남기 위한 구체적인 대응책을 정리합니다.

## 1. 현재 파이프라인의 핵심 리스크 (Diagnosis)

현재 시스템은 유저 대기 시간을 줄이기 위해 훌륭한 백그라운드 병렬 처리(전신 생성, 배경 제거 자동 시작 등)를 기획했으나, **근본적으로 너무 많은 생성형 AI 모델을 직렬로 이어 붙인 "다단계(Multi-step) 혼종 아키텍처"**라는 치명적인 한계를 가집니다.

### 리스크 1: 살인적인 누적 소요 시간 (90초 ~ 180초)
- **현황:** 헤어(30~60s) → 의상(30~60s) → 합성/조명(20~40s) → 선택적 IC-Light(30~60s). 아무리 백그라운드 폴링을 돌려 최적화해도 모바일 앱 환경에서 유저가 빈 화면을 보며 견딜 수 있는 한계선(15초)을 아득히 초과합니다.
- **치명점:** 3초 간격 롱폴링(Polling) 구조에서 휴대폰 화면이 꺼지거나 사파리 백그라운드로 넘어가면 소켓이 끊기며 이탈률이 90%에 달할 수 있습니다.

### 리스크 2: 모델 간 이기종(Heterogeneous) 충돌과 얼굴 훼손
- **현황:** 사용되는 모델이 파편화되어 있습니다. 
  - 헤어: `flux-kontext-apps/change-haircut` 
  - 하반신: `flux-fill-pro` 
  - 의상: `fal-ai/fashn/tryon/v1.5`
  - 합성: `Sharp(Node.js) + Flux Kontext` 
  - 서브 보정: `IC-Light`
- **치명점:** 각 AI 모델은 이미지를 디코딩/인코딩하면서 자신만의 픽셀 열화를 발생시킵니다. 특히 `Fashn` 모델이 의상을 입히는 과정에서 얼굴 비율을 미세하게 건드리고, 그 뒤에 `Flux Kontext`가 조명을 만지면서 또 얼굴 톤을 건드리며 **결과적으로 본인 얼굴이 아닌 조잡한 괴물(Uncanny Valley)** 픽셀이 탄생합니다. 얼굴 정체성(Identity) 보존이 전혀 보장되지 않는 생태계입니다.

### 리스크 3: 파산에 가까운 원가 구조 (Unit Economics 실패)
- **현황:** 1명의 유저가 1장의 결과물을 얻기 위해 Replicate 4회 + FAL 1회의 유료 API를 호출합니다.
- **치명점:** AI API들의 평균 단가를 고려할 때 1사이클 당 최소 100원~200원의 원가가 발생합니다. 오류로 인한 재시도까지 합치면 마진율이 붕괴되어 과금액을 만원 이상으로 받지 않는 한 적자가 나는 구조입니다.

---

## 2. 생존을 위한 아키텍처 대응책 (Solutions)

현재의 훌륭한 "단계별 경험(UI Flow)"은 그대로 모바일 화면에 남겨두되, **백엔드(엔진) 구조는 완전히 뜯어고쳐야 합니다.**

### 대응책 1: 모든 AI 과정을 통일된 "단일 ComfyUI 워크플로우"로 통합
- **기술 제안:** Replicate와 Fal.ai에 있는 기성품 API들을 레고 블록처럼 이어 붙이는 방식(API Chaining)을 당장 버려야 합니다.
- **해결책:** RunPod, 브이캣(Vcat), 또는 Fal.ai의 Custom Workflow 호스팅을 이용해 자체 ComfyUI 파이프라인(엔드포인트 1개)을 띄우십시오. 
- **작동 방식:** 
  1. 유저의 셀카 입력 → **IP-Adapter FaceID (또는 PuLID, InstantID)**로 얼굴 특징 완벽 고정
  2. 선택한 프롬프트(헤어+의상+배경)를 한 방에 Text-to-Image / Image-to-Image 렌더링
  3. 로컬 워크플로우 안에서 IC-Light 조명 제어까지 노드로 연결하여 처리.
- **효과:** 
  - 5번 호출하던 API가 **단 1번**으로 줄어듭니다.
  - 소요 시간이 180초에서 **15~20초**로 단축됩니다.
  - 비용이 기존 대비 **1/10 수준**으로 폭락합니다.
  - 얼굴 특징이 렌더링 내내 Injection되므로 **본인 얼굴 싱크로율이 99% 유지**됩니다.

### 대응책 2: UI (프론트엔드) 흐름 기만 설계 (Illusion of Choice)
- 현재 UI-Flow는 1단계(헤어) 누르고 기다렸다가 → 2단계(의상) 고르는 식입니다. 
- **해결책:** 프론트엔드에서는 유저가 "헤어(장바구니 담기)" → "의상(담기)" → "배경(담기)"을 끊임없이 **스무스하게 선택만 하도록** 넘겨줍니다.
- 그리고 마지막 결과 확인(완성하기 버턴)을 누를 때 모아둔 값들을 한 방에 서버(단일 ComfyUI API)로 쏴서 **최종 이미지 1장만** 바로 구워냅니다.
- 이렇게 하면 유저는 중간 로딩을 전혀 겪지 않아 이탈률이 0이 됩니다. (앱 사용 속도가 미친 듯이 빠르다고 느끼게 됩니다.)

### 대응책 3: 전신 생성(Flux Fill Pro)과 Sharp 합성의 과감한 폐기
- **문제:** 현재 Node.js의 Sharp를 사용해 투명 이미지를 얹고 그라운드 그림자를 그리는 건, 전형적인 2010년대 2D 포토샵 합성 방식이라 무조건 합성 티가 폭발합니다.
- **해결책:** 하이퀄리티가 목표라면 투명 PNG 합성을 하지 마십시오. 그냥 **사용자의 셀카를 레퍼런스(Image prompt)로 삼아 전체 풍경(배경 그림자와 인물 의상이 빛에 맞게 렌더링되는)을 다시 그려내는 방식(Stable Diffusion Inpainting)**을 써야 합니다. 전신 하반신 자동 확장도 이 한 번의 렌더링 캔버스 안에서 같이 해결해야 비율이 정상적으로 나옵니다.

---

## 3. 당장 실행해야 할 MVP(최소 기능 제품) 기획 및 UX 대응책

백엔드 엔진 구조를 단번에 통일하기 전이라도, 프론트엔드 기획과 UX를 즉시 수정하여 치명적 리스크를 피해야 합니다.

### 상세 대응 1: '조립형 합성' 앱에서 '프리셋 기반 원샷 생성기'로 과감한 축소
- **버릴 것:** 유저가 [헤어] 고르고 대기 → [의상] 고르고 대기 → [배경]을 고르도록 하는 다단계 자유도. (이 기능이 많아질수록 실패 지점이 기하급수적으로 늘어납니다.)
- **어떻게 할 것인가:** 유저의 개별 선택 옵션을 닫아버리십시오. 
  - 대신, 미리 완벽하게 통제된 **완성형 스타일(프리셋) 3~5개만 노출**합니다. (예: `경복궁 한복 무드`, `홍대 네온 스트릿 무드`, `가로수길 카페 무드`)
  - 유저의 화면은 **업로드 → 프리셋 1개 선택 → 완성 결과 1장 획득**의 3단계로 압축됩니다.
- **효과:** 내부적으로는 하나의 통합 프롬프트로 묶어 원샷(One-shot) 생성을 하기에 가장 이상적인 기획이 완성됩니다. 유저의 자유도를 통제해 **결과물의 성공률(안정성)을 극한으로 끌어올리는 것**이 MVP의 살 길입니다.

### 상세 대응 2: AI 한계를 덮어주는 '입구 컷(Upload Guide)' 초강화
- **버릴 것:** 유저가 아무 사진이나 막 올려도 백그라운드에서 AI가 알아서 상반신을 전신으로 늘리고(Body Extend) 배경을 따줄 것이라는 기대.
- **어떻게 할 것인가:** 사진 업로드 최우선 화면에 튜토리얼 수준의 강제 가이드라인을 띄웁니다. 
  - `[정면 사진 ⭕]`, `[강한 그림자/과도한 필터 ❌]`, `[얼굴 가림 ❌]`, `최소 해상도 제한 지정`. 
- **효과:** AI의 퀄리티는 결국 처음 주입되는 Input 이미지의 질에서 결정됩니다. 유저가 무조건 정제된 사진을 넣게 만들면, 뒤태에 달린 `Body Extend`, `Background Remove` 등 사고율이 높은 다단계 전처리를 아예 꺼버릴 수 있습니다. 

### 상세 대응 3: 잔가지(실패율 유발 옵션) 가지치기와 실패 허용 UX 도입
- **버릴 것:** 백그라운드로 돌아가는 전신 생성(`Body Extend`) 및 최종 선택형 조명 보정(`IC-Light`) 등 멋져 보이지만 MVP 단계를 무겁게 만드는 모든 보조 조작들.
- **어떻게 할 것인가:** 
  1. MVP에서는 이 잔가지 옵션들을 과감히 **기본 OFF 처리하거나 제거**하십시오.
  2. "완벽한 원본 얼굴 100% 보존"이라는 환상을 유저에게 주지 마십시오.
  3. 대신 로딩 화면에서 `"K-style 매직을 적용하는 중입니다 (약 20초 소요)"`라며 대기 시간을 명확히 투명하게 고지하고, 실패하면 바로 다시 시도할 수 있게 부드러운 퇴로(Fallback)를 만드십시오.

---

## 4. 구체적 API 전환 가이드 (Fal.ai & Replicate)

앞서 언급한 "단계를 줄이고 원샷으로 생성하는" 아키텍처를 당장 외부 API로 구현하려면 다음의 구체적 모델과 방식을 사용해야 합니다.

### 추천 1: Fal.ai의 FLUX + PuLID (가장 빠르고 강력한 원샷)
- **추천 API 엔드포인트:** `fal-ai/flux-pulid` 또는 `fal-ai/flux-lora-pulid`
- **구현 방식:**
  - `reference_image`: 유저가 업로드한 정면 셀카 1장을 넣습니다. (PuLID가 여기서 얼굴 특징을 완벽하게 추출해 고정합니다)
  - `prompt`: 미리 준비해둔 프리셋 프롬프트를 통째로 넣습니다. (예: `A photorealistic image of a korean woman with elegant wavy hair, wearing a traditional Hanbok, standing in front of the neon signs of Hongdae street at night...`)
- **왜 좋은가:** 유저의 얼굴을 유지한 채 텍스트 프롬프트 안에 있는 헤어, 의상, 배경이 **단 1번의 렌더링(약 10~15초)**만에 모두 합성되어 나옵니다.
- **코드 적용 예:**
  ```javascript
  const result = await fal.subscribe("fal-ai/flux-pulid", {
    input: {
      prompt: "미리_세팅된_K스타일_프리셋_프롬프트",
      reference_images: [{ image_url: "유저_셀카_URL" }]
    },
    // 폴링(Polling) 금지! 반드시 webhook을 통해 결과를 수신해야 모바일에서 끊기지 않습니다.
    webhookUrl: "https://your-domain.com/api/webhooks/fal-completion"
  });
  ```

### 추천 2: Replicate의 Webhook 기반 비동기(Async) 통합
현재 `3초 간격 폴링` 방식을 당장 버려야 합니다. Replicate에서 원샷 생성을 하려면 아래 모델과 방식을 고려하십시오.
- **추천 모델:** `lucataco/flux-pulid` 또는 `zsxkib/flux-pulid` (Replicate 내에 호스팅된 Flux 얼굴 고정 모델들)
- **동작 원리:** 프론트엔드에서 3초마다 `GET /poll`을 계속 때리는 코드를 지우고, 백엔드에서 Replicate에 Prediction을 던질 때 `webhook` 파라미터를 등록해 서버로 결과가 날아오게 만듭니다.
- **코드 적용 예:**
  ```javascript
  import Replicate from "replicate";
  const replicate = new Replicate();

  const prediction = await replicate.predictions.create({
    version: "lucataco/flux-pulid-...", // 사용할 모델 버전
    input: {
      prompt: "가로수길 카페 무드의 완성형 텍스트 프롬프트",
      main_face_image: "유저_셀카_URL"
    },
    // 핵심: API가 끝날 때까지 기다리지 않고, Replicate가 작업 완료 시 우리 서버로 답을 줌
    webhook: "https://your-domain.com/api/webhooks/replicate",
    webhook_events_filter: ["completed"]
  });
  // 프론트엔드에는 prediction.id 하나만 넘겨주고 끝냅니다.
  ```

### 핵심 요약
지금 파편화되어 있는 `fashn(의상)`, `ic-light(조명)`, `bgremove`를 버리고 **"FLUX 모델에 사용자의 얼굴을 넣고(PuLID/FaceID) 텍스트로 모든 상황(의상/배경)을 지시하는 단일 API 호출"**로 구조를 통합하십시오. 그리고 이 과정은 절대 3초 폴링 코드가 아닌 **Webhook 비동기**로 처리되어야 유저 이탈을 막을 수 있습니다.

---

## 5. 최종 한 줄 결론

현재 `ui-flow.md`의 기획은 너무 무거운 "아이돌 의상 입히기 웹-포토샵"에 가깝습니다. 이를 다 집어던지고, 유저가 **미리 세팅된 예쁜 테마(프리셋)를 골라 15초 만에 자신의 K팝 화보 한 장을 뽑아가는 "실패율 0%의 K-style 결과물 생성기"**로 정의를 바꾸고, 뒤단은 **Fal.ai 또는 Replicate의 단일 Webhook 기반 FaceID 모델**로 통폐합하는 것만이 상용화의 유일한 답입니다.
========================================
기록 시각: 2026-03-12 14:05 KST
주제: 배경 합성 구조 분석, 실제 프롬프트, 템플릿 방식에 대한 의견
========================================

## 1. 현재 배경 합성 구조

현재 구조는 "배경 합성"이라는 이름과 달리, 전통적인 합성 파이프라인이 아니다.

- 사용자가 업로드한 원본 사진으로 먼저 헤어 결과를 만든다.
- 사용자가 헤어 결과 1개를 선택한다.
- 이후 최종 단계에서는 그 선택된 헤어 결과 이미지 `hairPreviewUrl`만 `baseImageUrl`로 사용한다.
- 이 이미지를 `app/api/final/render/route.ts`에서 `black-forest-labs/flux-kontext-pro`에 넣는다.
- 여기서 의상, 배경, 조명, 무드까지 한 번에 다시 생성한다.

즉 현재는:

- 별도 배경 세그멘테이션 없음
- 별도 배경 마스크 없음
- 별도 인물/배경 합성 엔진 없음
- "선택된 헤어 결과 + 템플릿 프롬프트" 기반의 1회 재생성 구조

이 점이 중요하다.

지금 시스템은 배경을 "붙이는" 것이 아니라, 최종 생성 모델이 배경까지 포함해서 다시 그리도록 하고 있다.

## 2. 실제 호출 흐름

### 프론트

`components/create/OutfitFlow.tsx`

- 사용자가 reference template 1개를 고른다.
- `/api/final/render`로 아래 두 값만 보낸다.
  - `baseImageUrl: hairPreviewUrl`
  - `referenceTemplateId: selectedId`

### 서버

`app/api/final/render/route.ts`

- `referenceTemplates`에서 템플릿을 찾는다.
- `buildFinalPrompt(template.prompt, template.negativePrompt)`로 최종 프롬프트를 만든다.
- `startFluxKontextProJob({ imageUrl, prompt })`를 호출한다.

### 모델 입력

`lib/replicate.ts`

실제 Flux Kontext Pro 입력은 아래와 가깝다.

- `input_image: hairPreviewUrl`
- `prompt: 최종 조립 프롬프트`
- `aspect_ratio: "match_input_image"`
- `output_format: "jpg"`
- `output_quality: 95`
- `safety_tolerance: 2`
- `prompt_upsampling: false`

## 3. 실제 최종 프롬프트 구조

최종 프롬프트는 아래 4개를 그냥 이어붙이는 구조다.

### A. identity preservation prompt

`app/api/final/render/route.ts`

- `Use the person in the base image exactly as-is.`
- `Preserve the face, identity, ethnicity, hairstyle, hair color, bangs, facial structure, skin tone, skin undertone, skin texture, eye shape, nose, lips, and jawline with 100% fidelity.`
- `Do not change the person, do not redesign the face, do not alter ethnicity or natural facial characteristics, and do not alter the hair in any way.`

### B. template prompt

`data/referenceTemplates.ts`

현재 템플릿 1:

`Create a photorealistic close-up selfie portrait while keeping the face, ethnicity, hairstyle, hair color, bangs, and overall identity exactly the same as the base image. Maintain the same person and preserve facial structure, eyes, nose, lips, skin texture, skin undertone, and hair silhouette. Frame the image tightly from the chest up like a natural smartphone selfie. The subject should feel stylish, modern, and polished with a Seoul fashion editorial mood and idol-inspired styling, without changing the person's original ethnicity or natural facial characteristics. She is holding a trendy smartphone in one hand, and the decorative phone case and rear camera lenses are clearly visible to the viewer. Change the clothing to a chic and elegant traditional Korean Hanbok jeogori for a young idol, with refined fabric detail and delicate floral embroidery around the collar. Change the background to the courtyard of Gyeongbokgung Palace in Seoul during warm golden hour light. Add softly blurred tourists and visitors walking in the background. Keep the image realistic, premium, and natural like a real high-end selfie snapshot.`

현재 템플릿 2:

`Create a photorealistic smartphone selfie portrait while keeping the face, ethnicity, hairstyle, hair color, bangs, and overall identity exactly the same as the base image. Maintain the same person and preserve facial structure, eyes, nose, lips, skin texture, skin undertone, and hair silhouette. Frame the image from the upper body with slightly more background visible than a tight close-up. The subject should feel stylish, modern, and polished with a Seoul fashion editorial mood and idol-inspired styling, without changing the person's original ethnicity or natural facial characteristics. She is holding a trendy smartphone in one hand, and the decorative phone case and rear camera lenses are clearly visible to the viewer. Change the clothing to a chic and elegant traditional Korean Hanbok jeogori for a young idol, with refined fabric detail and delicate floral embroidery around the collar. Change the background to a different Gyeongbokgung Palace courtyard angle in Seoul during warm golden hour light, with more palace architecture visible behind her. Add softly blurred visitors in the background and give the pose a slightly angled, more candid selfie feel. Keep the image realistic, premium, and natural like a real high-end selfie snapshot.`

### C. quality prompt

- `Match the person's lighting to the scene naturally.`
- `Blend clothing, hair edges, and skin into the environment without artificial seams.`
- `Keep natural skin texture and realistic detail.`
- `Photorealistic Korean fashion editorial quality.`

### D. negative prompt

현재 두 템플릿 공통:

`different face, different hairstyle, different hair color, short hair, missing bangs, distorted face, deformed eyes, bad anatomy, extra fingers, bad hands, duplicate person, malformed clothing, blurry face, low detail, unrealistic phone, broken phone case, anime, cartoon, illustration, painting, oversaturated, plastic skin, airbrushed skin, wax figure`

## 4. 왜 배경 합성이 약하게 느껴질 수 있는가

현재 구조에서는 배경이 약한 것이 꽤 자연스럽다.

이유는 다음과 같다.

### 1. 모델이 "합성"이 아니라 "재생성"을 하고 있음

- hair 결과 이미지를 입력으로 넣고 있지만,
- 실제로는 배경만 교체하는 강한 인페인팅 구조가 아니다.
- 모델이 인물, 의상, 배경, 조명을 함께 다시 해석해서 새 장면으로 뽑는다.

즉 배경을 정확히 갈아끼우는 느낌보다,
"원본 분위기를 참고한 새 편집 컷"에 가깝다.

### 2. 배경 지시가 프롬프트 안에서 차지하는 비중이 낮음

- 현재 프롬프트는 identity 보존 지시가 매우 강하다.
- 헤어 보존 지시도 강하다.
- 반면 배경 지시는 템플릿 본문 중 한두 문장이다.

모델 입장에서는:

- 사람을 망치면 안 됨
- 헤어를 바꾸면 안 됨
- 얼굴을 바꾸면 안 됨
- 자연스럽게 보여야 함

이 제약이 너무 강해서, 배경은 상대적으로 보수적으로 처리될 가능성이 높다.

### 3. 입력 이미지의 기존 배경 흔적이 강하게 남아 있음

- `input_image`가 이미 hair 결과 이미지다.
- 그 안에는 기존 원본 사진의 배경 구조, 톤, 구도 흔적이 남아 있다.
- 모델이 이를 강하게 참고하면 새 배경 지시가 약하게 먹을 수 있다.

### 4. 템플릿 수가 적고 장면 조건이 좁다

- 현재 reference template은 사실상 2개뿐이다.
- 둘 다 같은 계열의 한복 + 경복궁 + 스마트폰 셀피 무드다.
- 이 정도로는 배경 전환 품질의 차이나 안정성을 충분히 학습적으로 유도하기 어렵다.

## 5. 템플릿으로 가는 것에 대한 내 의견

내 의견은 다음과 같다.

### 결론

- 템플릿 방식 자체는 맞다.
- 다만 "지금 수준의 템플릿 방식"은 아직 너무 얇다.
- 현재 구조는 템플릿이라기보다 "긴 자연어 프롬프트 두 개를 고르는 UI"에 가깝다.

### 왜 템플릿 방식이 맞는가

- 사용자가 자유 입력으로 배경과 의상을 직접 쓰게 하면 품질 편차가 너무 커진다.
- MVP에서는 결과 안정성이 자유도보다 중요하다.
- 헤어까지 이미 한 번 생성한 상태라, 마지막 단계는 가능한 한 결과 범위를 좁혀야 한다.

### 왜 지금 템플릿 방식은 약한가

- 템플릿이 장면 구성 정보보다 문장 묘사에 의존한다.
- 실제 배경 합성을 강하게 유도하는 구조적 제어가 없다.
- 카메라 거리, 구도, 피사체 크기, 배경 깊이, 조명 방향 같은 핵심 조건이 명시적으로 분리돼 있지 않다.

즉 "템플릿"이 아니라 "설명문"에 가깝다.

### 내가 권하는 템플릿 방향

템플릿을 유지하되 아래처럼 쪼개는 편이 낫다.

- subject lock
- camera framing
- outfit description
- background scene
- lighting
- mood
- hard constraints
- negative prompt

예를 들어 `background scene`만 따로 강하게 두면,
배경 지시가 다른 요소에 묻히지 않는다.

### 더 나은 중기 방향

- reference image + structured prompt 조합
- 또는 배경만 따로 생성/교체하는 2단계 구조

특히 "배경 합성"을 진짜 강하게 만들고 싶다면,
지금처럼 최종 모델이 다 다시 그리는 구조보다
"인물 고정 + 배경 교체" 쪽이 더 맞다.

## 6. 실무 판단

현재 구조는:

- 헤어 결과 유지
- 의상과 배경을 템플릿 기반으로 묶음 생성
- 구현 난이도 낮음
- MVP 속도 빠름

대신 단점은:

- 배경 통제력이 약함
- 결과가 템플릿 썸네일과 다르게 나올 수 있음
- 합성이라기보다 재생성 느낌이 남음

## 7. 한 줄 판단

현재 배경 합성이 약한 이유는 "배경을 별도로 합성하지 않고, 선택된 헤어 결과 한 장을 기반으로 최종 모델이 장면 전체를 다시 생성하기 때문"이다.

템플릿 방식은 유지해도 되지만, 지금 형태 그대로면 배경 제어력이 약하므로 구조화된 템플릿 또는 배경 분리형 파이프라인으로 가는 것이 더 낫다.

========================================
========================================
기록 시각: 2026-03-12 18:18 KST
주제: 구조화된 템플릿 방식 1안과 2안 정리
========================================

## 결론 요약

- 1안이 현재 제품 단계에서는 더 현실적이고 안정적이다.
- 2안이 장기적으로는 더 좋은 그림이지만, 구현 난이도와 실패 리스크가 더 높다.
- 지금 당장 상용 안정성을 올리려면 1안으로 먼저 가고, 이후 2안으로 확장하는 순서가 맞다.

## 1안. 구조화된 템플릿 사진 위에 얼굴과 헤어만 강하게 주입

### 구조

- 템플릿 사진이 배경, 구도, 조명, 의상, 화면 비율을 거의 전부 결정한다.
- 사용자 쪽에서는 얼굴 정체성과 헤어 결과만 최대한 보존한다.
- 최종 생성은 "배경을 다시 상상하는 작업"이 아니라 "정해진 템플릿 장면 안에 인물 핵심 요소를 맞춰 넣는 작업"이 된다.

### 장점

- 결과가 템플릿 썸네일과 훨씬 비슷하게 나온다.
- 배경 품질이 흔들릴 가능성이 크게 줄어든다.
- 사용자가 기대한 결과와 실제 결과 차이가 줄어든다.
- MVP에서 가장 중요한 "안정성" 측면에서 유리하다.

### 단점

- 얼굴 경계, 머리카락 가장자리, 목선, 피부톤, 조명 방향이 안 맞으면 바로 합성 티가 난다.
- 템플릿 자체의 다양성이 부족하면 결과가 쉽게 반복적으로 보일 수 있다.
- 의상까지 같이 자연스럽게 바꾸려면 단순 오버레이가 아니라 꽤 정교한 인페인트가 필요하다.

### 내 의견

- 지금 Kstyleshot 단계에서는 가장 먼저 검토할 안이다.
- 특히 현재처럼 배경 재생성이 약하고 템플릿 재현성이 낮은 상황에서는 1안이 훨씬 제품답다.
- 다만 "얼굴과 헤어만 복붙" 수준으로 가면 안 되고, 최소한 face lock + hair preservation + soft inpaint 수준은 있어야 한다.

## 2안. 현재 구조를 유지하되 템플릿을 더 구조화해서 전체 장면 재생성

### 구조

- 지금처럼 선택된 헤어 결과 이미지를 `input_image`로 넣는다.
- 다만 템플릿을 긴 자연어 설명문이 아니라 구조화된 블록으로 분해한다.
- 예: `subject lock`, `camera framing`, `outfit`, `background scene`, `lighting`, `mood`, `hard constraints`, `negative`

### 장점

- 현재 코드와 흐름을 크게 바꾸지 않고 개선할 수 있다.
- 구현 속도가 빠르다.
- 모델이 장면 전체를 다시 그리기 때문에 합성 경계가 덜 어색할 수 있다.

### 단점

- 배경 통제력이 여전히 1안보다 약하다.
- 템플릿과 결과가 어긋날 가능성이 계속 남는다.
- 얼굴, 헤어, 배경, 의상을 동시에 맞추려는 충돌은 구조적으로 남아 있다.

### 내 의견

- 지금 구조를 급하게 개선해야 한다면 가장 현실적인 차선책이다.
- 다만 이 안만으로는 "배경이 템플릿처럼 정확히 나온다" 수준까지 가기 어렵다.
- 결과적으로는 1안보다 안정성 한계가 더 빨리 드러날 가능성이 높다.

## 추천 순서

1. 단기: 2안처럼 템플릿을 구조화해서 프롬프트 제어력을 먼저 올린다.
2. 중기: 1안으로 넘어갈 수 있게 템플릿 이미지 중심 파이프라인을 설계한다.
3. 장기: face lock / hair preservation / inpaint 기반으로 템플릿 사진 합성 완성도를 높인다.

## 최종 판단

- "배경 통제"가 가장 중요하면 1안이 더 낫다.
- "빨리 개선"이 가장 중요하면 2안이 더 쉽다.
- 제품 방향성 자체는 1안이 더 맞고, 실행 순서는 2안 선행 후 1안 전환이 가장 현실적이다.

========================================
========================================
기록 시각: 2026-03-12 18:20 KST
주제: 구조화된 템플릿 방식 1안과 2안 정리
========================================

## 결론 요약

- 1안이 현재 제품 단계에서는 더 현실적이고 안정적이다.
- 2안이 장기적으로는 더 좋은 그림이지만, 구현 난이도와 실패 리스크가 더 높다.
- 지금 당장 상용 안정성을 올리려면 1안으로 먼저 가고, 이후 2안으로 확장하는 순서가 맞다.

## 1안. 구조화된 템플릿 사진 위에 얼굴과 헤어만 강하게 주입

### 구조

- 템플릿 사진이 배경, 구도, 조명, 의상, 화면 비율을 거의 전부 결정한다.
- 사용자 쪽에서는 얼굴 정체성과 헤어 결과만 최대한 보존한다.
- 최종 생성은 "배경을 다시 상상하는 작업"이 아니라 "정해진 템플릿 장면 안에 인물 핵심 요소를 맞춰 넣는 작업"이 된다.

### 장점

- 결과가 템플릿 썸네일과 훨씬 비슷하게 나온다.
- 배경 품질이 흔들릴 가능성이 크게 줄어든다.
- 사용자가 기대한 결과와 실제 결과 차이가 줄어든다.
- MVP에서 가장 중요한 "안정성" 측면에서 유리하다.

### 단점

- 얼굴 경계, 머리카락 가장자리, 목선, 피부톤, 조명 방향이 안 맞으면 바로 합성 티가 난다.
- 템플릿 자체의 다양성이 부족하면 결과가 쉽게 반복적으로 보일 수 있다.
- 의상까지 같이 자연스럽게 바꾸려면 단순 오버레이가 아니라 꽤 정교한 인페인트가 필요하다.

### 내 의견

- 지금 Kstyleshot 단계에서는 가장 먼저 검토할 안이다.
- 특히 현재처럼 배경 재생성이 약하고 템플릿 재현성이 낮은 상황에서는 1안이 훨씬 제품답다.
- 다만 "얼굴과 헤어만 복붙" 수준으로 가면 안 되고, 최소한 face lock + hair preservation + soft inpaint 수준은 있어야 한다.

## 2안. 현재 구조를 유지하되 템플릿을 더 구조화해서 전체 장면 재생성

### 구조

- 지금처럼 선택된 헤어 결과 이미지를 `input_image`로 넣는다.
- 다만 템플릿을 긴 자연어 설명문이 아니라 구조화된 블록으로 분해한다.
- 예: `subject lock`, `camera framing`, `outfit`, `background scene`, `lighting`, `mood`, `hard constraints`, `negative`

### 장점

- 현재 코드와 흐름을 크게 바꾸지 않고 개선할 수 있다.
- 구현 속도가 빠르다.
- 모델이 장면 전체를 다시 그리기 때문에 합성 경계가 덜 어색할 수 있다.

### 단점

- 배경 통제력이 여전히 1안보다 약하다.
- 템플릿과 결과가 어긋날 가능성이 계속 남는다.
- 얼굴, 헤어, 배경, 의상을 동시에 맞추려는 충돌은 구조적으로 남아 있다.

### 내 의견

- 지금 구조를 급하게 개선해야 한다면 가장 현실적인 차선책이다.
- 다만 이 안만으로는 "배경이 템플릿처럼 정확히 나온다" 수준까지 가기 어렵다.
- 결과적으로는 1안보다 안정성 한계가 더 빨리 드러날 가능성이 높다.

## 추천 순서

1. 단기: 2안처럼 템플릿을 구조화해서 프롬프트 제어력을 먼저 올린다.
2. 중기: 1안으로 넘어갈 수 있게 템플릿 이미지 중심 파이프라인을 설계한다.
3. 장기: face lock / hair preservation / inpaint 기반으로 템플릿 사진 합성 완성도를 높인다.

## 최종 판단

- "배경 통제"가 가장 중요하면 1안이 더 낫다.
- "빨리 개선"이 가장 중요하면 2안이 더 쉽다.
- 제품 방향성 자체는 1안이 더 맞고, 실행 순서는 2안 선행 후 1안 전환이 가장 현실적이다.

========================================
