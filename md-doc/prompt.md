=======================

## 현재 웹앱 표시명 ↔ 실제 API haircut 매핑

- Soft Waves → Soft Waves
- Straight → Straight
- Glamorous Waves → Glamorous Waves
- Half-Up Half-Down → Half-Up, Half-Down
- Half-Up Top Knot → Half-Up Top Knot
- Pigtails → Pigtails
- Side-Swept Bangs → Side-Swept Bangs
- High Ponytail → High Ponytail
- Low Ponytail → Low Ponytail
- Textured Bob → Lob
- French Bob → A-Line Bob
- Layered Bob → Angled Bob
- Classic Bob → Pageboy

정리:
- 왼쪽은 웹앱 카드에 보이는 이름
- 오른쪽은 헤어 생성 API에 실제로 들어가는 `haircut` 값

=======================
업데이트 시각: 2026-03-15 22:30 (한국시간)
=======================

## 현재 나노바나나 프롬프트

코드 기준 위치:
- `lib/replicate.ts`
- `NANO_BANANA_PROMPT_TEMPLATE(sceneDescription: string)`

```text
The first image shows a person with a specific face and hairstyle.
The second image shows a K-pop outfit or costume.
The third image shows a background scene and location.

### [CRITICAL PRIORITY: 100% IDENTITY MATCH - ABSOLUTE]
- The goal is NOT to create a new character or a stylized idol version.
- Copy and Paste the exact face from the first reference image.
- Strictly maintain the EXACT facial structure, eye shape, eyelid lines, nose bridge width, and lip contours of the person in the first image, including all micro-asymmetry and unique facial details.
- DO NOT beautify, DO NOT apply any style-specific makeup, and DO NOT smooth the skin texture.
- Retain the natural skin tone, pores, and fine lines precisely as they appear in the original photo.
- The person's face must be 1:1 identical to the original reference, with no distortion, morphing, or generalization.

[COMPOSITION & STYLE]
- Place the person from the first image into the location from the third image.
- Dress the person in the outfit shown in the second image.
- Show the full body from head to shoes, standing naturally in the center of the frame.
- The composition is a professional fashion editorial shot with a 35mm lens perspective.

[SEAMLESS OPTICAL INTEGRATION - DEEP FOCUS MODE]
- Match the lighting, color temperature, and atmospheric shadows of the third image exactly.
- Apply "Global Illumination": The specific color temperature from the background must naturally wrap around the subject's body.
- Create "Contact Shadows": Generate realistic, precise ambient occlusion shadows precisely under the soles of the shoes where they contact the pavement to ensure the subject is firmly grounded.
- Match "Image Grain": Synchronize the digital noise and film grain between the subject and the background for a unified texture.
- Use a F8.0 or higher aperture setting for deep depth of field: Ensure both the subject and the background are in focus, with only a very subtle, natural fall-off in the furthest distance.
- Align the sharpness level of the subject with the resolution and texture details of the background.

[SCENE DESCRIPTION]
${sceneDescription}

[FINAL OUTPUT QUALITY]
The result must be a flawless, photorealistic photoshoot. Treat the first image as an unchangeable master reference for the face. The priority is the exact 1:1 reproduction of the person's face from the reference image, seamlessly blended into the background with realistic grounding shadows and consistent deep-focus optics.
```

## 현재 나노바나나 호출 입력값

```json
{
  "input": {
    "prompt": "NANO_BANANA_PROMPT_TEMPLATE(sceneDescription)",
    "image_input": [
      "hairPreviewUrl",
      "outfitImageUrl",
      "backgroundImageUrl"
    ],
    "aspect_ratio": "4:5",
    "resolution": "2K",
    "output_format": "jpg",
    "safety_filter_level": "block_only_high"
  }
}
```

기본 `sceneDescription`:

```text
The scene is a stylish and atmospheric K-pop photoshoot location with professional lighting.
```

## 현재 헤어 생성 옵션

코드 기준 위치:
- `lib/replicate.ts`
- `startPrediction(...)`

실제 API payload:

```json
{
  "input": {
    "haircut": "선택값",
    "hair_color": "선택값 또는 No change",
    "gender": "female",
    "aspect_ratio": "4:5",
    "output_format": "jpg",
    "safety_tolerance": 2,
    "seed": 42,
    "input_image": "data:image/..."
  }
}
```

현재 기본값:
- `hair_color`: 미선택 시 `No change`
- `gender`: `female`
- `aspect_ratio`: `4:5`
- `output_format`: `jpg`
- `safety_tolerance`: `2`
- `seed`: `42`

정리:
- 나노바나나는 `3장 입력 + 고정 프롬프트 + sceneDescription 추가` 구조
- 헤어 생성은 `선택한 haircut + 선택한 color(or No change) + 4:5 고정` 구조

## 헤어 생성 허용 haircut 목록

- No change
- Random
- Straight
- Wavy
- Curly
- Bob
- Pixie Cut
- Layered
- Messy Bun
- High Ponytail
- Low Ponytail
- Braided Ponytail
- French Braid
- Dutch Braid
- Fishtail Braid
- Space Buns
- Top Knot
- Undercut
- Mohawk
- Crew Cut
- Faux Hawk
- Slicked Back
- Side-Parted
- Center-Parted
- Blunt Bangs
- Side-Swept Bangs
- Shag
- Lob
- Angled Bob
- A-Line Bob
- Asymmetrical Bob
- Graduated Bob
- Inverted Bob
- Layered Shag
- Choppy Layers
- Razor Cut
- Perm
- Ombré
- Straightened
- Soft Waves
- Glamorous Waves
- Hollywood Waves
- Finger Waves
- Tousled
- Feathered
- Pageboy
- Pigtails
- Pin Curls
- Rollerset
- Twist Out
- Bantu Knots
- Dreadlocks
- Cornrows
- Box Braids
- Crochet Braids
- Double Dutch Braids
- French Fishtail Braid
- Waterfall Braid
- Rope Braid
- Heart Braid
- Halo Braid
- Crown Braid
- Braided Crown
- Bubble Braid
- Bubble Ponytail
- Ballerina Braids
- Milkmaid Braids
- Bohemian Braids
- Flat Twist
- Crown Twist
- Twisted Bun
- Twisted Half-Updo
- Twist and Pin Updo
- Chignon
- Simple Chignon
- Messy Chignon
- French Twist
- French Twist Updo
- French Roll
- Updo
- Messy Updo
- Knotted Updo
- Ballerina Bun
- Banana Clip Updo
- Beehive
- Bouffant
- Hair Bow
- Half-Up Top Knot
- Half-Up, Half-Down
- Messy Bun with a Headband
- Messy Bun with a Scarf
- Messy Fishtail Braid
- Sideswept Pixie
- Mohawk Fade
- Zig-Zag Part
- Victory Rolls

=======================
