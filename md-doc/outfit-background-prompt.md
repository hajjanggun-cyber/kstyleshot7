# nano-banana-pro 최종 합성 프롬프트 전체 구조

> 파일: `lib/replicate.ts` → `startNanaBananaJob()`
> Updated: 2026-03-22

---

## 호출 파라미터

```json
{
  "input": {
    "prompt": "...(아래 전체 텍스트)",
    "image_input": [
      "[0] hairPreviewUrl    ← 선택한 헤어 결과 이미지 (Image 1: 인물·얼굴·헤어 기준)",
      "[1] outfitImageUrl   ← 의상 이미지 (Image 2: 의상 기준)",
      "[2] backgroundImageUrl ← 배경 이미지 (Image 3: 환경·장면 기준)"
    ],
    "aspect_ratio": "4:5",
    "resolution": "2K",
    "output_format": "jpg",
    "safety_filter_level": "block_only_high"
  }
}
```

---

## 현재 베이스 프롬프트 (NANO_BANANA_PROMPT_TEMPLATE)

> `SCENE` 섹션에 배경별 `sceneDescription`이 삽입됨

```
Create a photorealistic image by combining three input images.

IDENTITY
Preserve the face and identity from Image 1 exactly. Do not alter bone structure, nose, or mouth.
Preserve the hairstyle and hair color from Image 1 exactly.
Redirect eye gaze toward the camera so the subject makes direct eye contact with the viewer.
Natural relaxed expression with a slight smile.

IMAGE ROLES
Image 1: the person (face, hair, and identity reference).
Image 2: clothing reference. Dress the person in this outfit.
Image 3: environment reference. Place the person in this scene.

POSE
Natural standing pose, facing the camera. Camera angle slightly above eye level.
Hands must have exactly five fingers each with natural proportions.

OUTFIT
Clothing should drape naturally on the body with realistic wrinkles and fabric weight.

SKIN
Skin tone must be uniform across face, neck, and exposed body.
Photorealistic skin texture with natural pores and subtle highlights.

LIGHTING
Apply the lighting conditions from Image 3 onto the subject's skin and clothing.
Match light direction, color temperature, shadows, and environmental reflections from the scene.
Apply unified color grading across subject and environment.

SCENE
{여기에 배경별 sceneDescription 삽입}

CONSTRAINTS
Do not stylize, cartoonize, or exaggerate features.
Do not collage — the subject must appear physically present in the scene.
No visible edge artifacts between subject and background.
Accurate shadows, natural depth of field, cinematic detail.
```

---

## 배경별 SCENE 텍스트 (`data/referenceTemplates.ts`)

### 한복 카테고리

**경복궁 한복 마당** (`gyeongbokgung-hanbok-stone-courtyard`)
```
A traditional Korean palace stone courtyard at golden hour with elegant hanok rooflines, soft warm sunlight, and a refined heritage atmosphere. The subject should feel naturally grounded inside the courtyard with realistic light direction, warm reflections, and authentic architectural depth.
```

**경복궁 정문 셀피** (`gyeongbokgung-palace-main-gate-selfie`)
```
A centered palace gate scene at Gyeongbokgung with broad stone paving, layered traditional roof details, and warm late-afternoon light. Keep the palace facade recognizable behind the subject and match the natural courtyard perspective, shadows, and soft golden atmosphere.
```

---

### 무대 카테고리

**K-pop 콘서트 무대** (`kpop-concert-stage-selfie`)
```
A large K-pop concert stage filled with blue and white spotlights, LED screens, and glossy performance lighting. The subject should look physically present on stage with realistic concert light spill, stage reflections, and dramatic live-show depth.
```

---

### 스트릿 카테고리

**가로수길 쇼핑 거리** (`garosu-gil-shopping-street-selfie`)
```
A stylish Seoul shopping street lined with boutique storefronts, signs, and casual pedestrian flow in bright daytime light. Match the soft urban daylight, storefront reflections, and relaxed fashion-street perspective so the subject feels naturally photographed on location.
```

**홍대 네온 거리** (`hongdae-neon-street-selfie`)
```
A lively Hongdae-style entertainment street at dusk with neon shop signs, dense city energy, and warm evening street light. Integrate the subject naturally into the road-level scene with believable sign glow, ambient shadows, and urban nightlife perspective.
```

---

### 공원 카테고리

**한강 피크닉 스카이라인** (`han-river-picnic-skyline-selfie`)
```
A sunny Han River park picnic setting with green grass, a picnic mat, and the Seoul skyline across the water. The subject should sit naturally in the riverside environment with bright daylight, gentle water reflection, and realistic outdoor shadow falloff.
```

---

### 서울 카테고리

**N서울타워 자물쇠 벽** (`n-seoul-tower-closeup-love-lock-wall`)
```
An N Seoul Tower observation deck selfie spot with colorful love locks, soft sunset light, and the tower visible in the distance. Keep the deck atmosphere recognizable and blend the subject with warm evening light, subtle crowd depth, and realistic terrace reflections.
```

**N서울타워 전망 데크** (`n-seoul-tower-evening-observation-deck`)
```
An evening observation deck at N Seoul Tower with love-lock fencing, warm sunset sky, and a crowded landmark atmosphere. The subject should feel naturally captured in the terrace scene with realistic backlighting, city haze, and soft golden-hour skin illumination.
```

**N서울타워 노을 테라스** (`n-seoul-tower-sunset-lock-terrace`)
```
A sunset terrace at N Seoul Tower overlooking the Seoul skyline with lock-covered railings and a glowing evening sky. Match the warm sunset direction, skyline depth, and terrace shadows so the subject appears truly photographed at the scenic overlook.
```

---

## 실제 완성 프롬프트 예시

> 배경: N서울타워 노을 테라스 선택 시 → SCENE 섹션만 교체됨

```
Create a photorealistic image by combining three input images.

IDENTITY
Preserve the face and identity from Image 1 exactly. Do not alter bone structure, nose, or mouth.
Preserve the hairstyle and hair color from Image 1 exactly.
Redirect eye gaze toward the camera so the subject makes direct eye contact with the viewer.
Natural relaxed expression with a slight smile.

IMAGE ROLES
Image 1: the person (face, hair, and identity reference).
Image 2: clothing reference. Dress the person in this outfit.
Image 3: environment reference. Place the person in this scene.

POSE
Natural standing pose, facing the camera. Camera angle slightly above eye level.
Hands must have exactly five fingers each with natural proportions.

OUTFIT
Clothing should drape naturally on the body with realistic wrinkles and fabric weight.

SKIN
Skin tone must be uniform across face, neck, and exposed body.
Photorealistic skin texture with natural pores and subtle highlights.

LIGHTING
Apply the lighting conditions from Image 3 onto the subject's skin and clothing.
Match light direction, color temperature, shadows, and environmental reflections from the scene.
Apply unified color grading across subject and environment.

SCENE
A sunset terrace at N Seoul Tower overlooking the Seoul skyline with lock-covered railings and a glowing evening sky. Match the warm sunset direction, skyline depth, and terrace shadows so the subject appears truly photographed at the scenic overlook.

CONSTRAINTS
Do not stylize, cartoonize, or exaggerate features.
Do not collage — the subject must appear physically present in the scene.
No visible edge artifacts between subject and background.
Accurate shadows, natural depth of field, cinematic detail.
```
