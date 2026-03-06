Updated At: 2026-03-06 18:26 KST

---

# Codex 페르소나 & 핵심 목표

너는 최고의 SEO 전문가이자 콘텐츠 전략 애널리스트다.
이 프로젝트의 최우선 목표는 **SEO 검색 유입**이다.
모든 결정의 기준은 "이 글이 실제로 검색 상단에 올라갈 수 있는가"다.

## 1. 글 작성 전 필수 — 반드시 먼저 읽을 것

```
1. md-doc/google-seo-guide.md   ← Google 공식 SEO 기준 (필수)
2. AGENTS.md                     ← 출력 스펙, 품질 기준 (필수)
3. 이 파일(post-codex-command.md) ← 작성 순서 및 주제 목록
```

---

## 2. 프롬프트 모음 — 상황에 맞게 골라 사용

### [A] 일반 세션 — 글 작성 (매번 기본값)

```
md-doc/google-seo-guide.md와 AGENTS.md와 md-doc/post-codex-command.md를 읽어라.

다음 순서로 실행한다:
1. [작업 진행 로그] 섹션을 확인해서 어디까지 완료됐는지 파악한다.
2. [전체 작성 순서] 섹션에 따라 다음 1쌍(KO 1개 + EN 1개)을 작성한다.
3. 단계를 절대 건너뛰지 않는다. 1단계 → 해당 허브 2단계 → 다음 1단계 순서 고정.
4. content/hub/ko/ 디렉토리를 먼저 확인해서 이미 존재하는 파일은 건드리지 않는다.
5. 작성 완료 후 [작업 진행 로그]에 아래 형식으로 반드시 기록한다.

로그 기록 형식:
[날짜 시간 KST]
완료:
- content/hub/ko/[slug].mdx
- content/hub/en/[slug].mdx
다음 세션 시작: [단계] — [번호 있으면 번호] [정확한 주제명]

예시:
다음 세션 시작: 1단계 — 남산 N서울타워 허브 글
다음 세션 시작: 2단계 — 경복궁 하위 글 [001] 경복궁 포토존 완전 가이드
다음 세션 시작: 3단계 — kpop-blog-topics-300.md [046]번부터
```

### [B] 허브 완료 후 — 내부 링크 & 키워드 & nextSlug 정리
허브 1개의 모든 하위 글이 완료됐을 때 사용. [허브명]과 파일 목록을 실제 값으로 바꿔서 사용.

```
AGENTS.md와 md-doc/post-codex-command.md를 읽어라.

[허브명] 허브의 완료 후 작업을 실행한다.

대상 파일 (먼저 모두 읽는다):
- content/hub/ko/[허브-slug].mdx
- content/hub/en/[허브-slug].mdx
- content/hub/ko/[하위글-slug-1].mdx
- content/hub/en/[하위글-slug-1].mdx
(해당 허브의 모든 KO/EN 파일)

1. 내부 링크 정리:
   - 허브 글의 "함께 읽을 글" / "Related Guides"에 모든 하위 글 포함 여부 확인, 누락 시 추가
   - 각 하위 글 본문에 허브 글로의 역링크 확인, 누락 시 추가
   - 존재하지 않는 파일로의 링크 제거

2. 키워드 소급 적용:
   - [전체 작성 순서] 섹션의 키워드 표를 확인한다
   - 각 파일의 title과 첫 단락에 타깃 키워드가 자연스럽게 포함됐는지 확인
   - 없으면 문장 흐름을 유지하며 추가 (title 60자, description 120~155자 유지)

3. 키워드 중복 확인:
   - 허브 내 모든 글의 타깃 키워드(KO/EN)를 목록으로 정리하여 보고
   - 겹치는 키워드가 있으면 더 구체적인 롱테일로 수정

4. nextSlug / nextTitle 채우기:
   - 읽기 순서: 허브 글 → 하위 글 순서대로
   - 각 파일 frontmatter에 nextSlug와 nextTitle 추가
   - 마지막 하위 글의 nextSlug는 다음 허브의 허브 글로 연결

5. 완료 후 [작업 진행 로그]에 기록:
   "[날짜 시간 KST] [허브명] 허브 내부링크·키워드·nextSlug 정리 완료"
```

---

## 4. 전체 작성 순서 — 3단계 (절대 건너뛰지 않는다)

### 1단계: 허브 글

아래 순서로 10개를 완성한다. 제목·소제목은 섹션 9·10을 따른다.

| 순서 | 장소 | 타깃 키워드(KO) | 타깃 키워드(EN) | 상태 |
|------|------|----------------|----------------|------|
| 1 | 경복궁 | 경복궁 여행 가이드 | gyeongbokgung palace travel guide | ✅ 완료 |
| 2 | 명동 | 명동 서울 여행 코스 | myeongdong seoul travel guide | ✅ 완료 |
| 3 | 남산 N서울타워 | 남산 N서울타워 서울 야경 | n seoul tower night view guide | ⬜ 대기 |
| 4 | 홍대 | 홍대 서울 놀거리 | hongdae seoul neighborhood guide | ⬜ 대기 |
| 5 | 인사동 | 인사동 서울 전통거리 | insadong seoul cultural street | ⬜ 대기 |
| 6 | 가로수길 | 가로수길 서울 패션 거리 | garosu-gil seoul fashion street | ⬜ 대기 |
| 7 | 한강공원 | 한강공원 서울 피크닉 | hangang park seoul picnic guide | ⬜ 대기 |
| 8 | 이태원 & 경리단길 | 이태원 경리단길 서울 밤거리 | itaewon gyeongnidan-gil seoul guide | ⬜ 대기 |
| 9 | 잠실 롯데월드 | 잠실 롯데월드 서울 데이트 | jamsil lotte world seoul guide | ⬜ 대기 |
| 10 | 대형 기획사 사옥 주변 | 서울 기획사 사옥 주변 팬투어 | seoul k-pop label hq area guide | ⬜ 대기 |

### 2단계: 허브별 하위 글

허브 글 발행 직후 해당 허브의 하위 글을 순서대로 작성한다.
번호는 `kpop-blog-topics-300.md`의 주제 번호다.

| 허브 | 하위 글 | 타깃 키워드(KO) | 타깃 키워드(EN) | 상태 |
|------|---------|----------------|----------------|------|
| 경복궁 | [001] 경복궁 포토존 완전 가이드 | 경복궁 포토존 추천 | best photo spots in gyeongbokgung | ✅ 완료 |
| 경복궁 | [002] 경복궁 시간대별 빛과 그림자 | 경복궁 오전 오후 사진 | best time to photograph gyeongbokgung | ✅ 완료 |
| 경복궁 | [003] 경복궁 근처 골목 산책 — 숨겨진 한옥 포토존 5곳 | 경복궁 근처 한옥 포토존 | hanok photo spots near gyeongbokgung | ✅ 완료 |
| 경복궁 | [286] 가상 경복궁 배경 — 서울에 없어도 전통 감성 사진 완성하기 | 경복궁 배경 프로필 사진 | virtual gyeongbokgung background photos | ✅ 완료 |
| 명동 | [010] 명동 네온사인 거리 — 야간 스트릿 스냅 촬영 가이드 | 명동 네온사인 야간 사진 | myeongdong neon street photography | ⬜ 대기 |
| 명동 | [011] 명동 K-뷰티 쇼핑 지도 — 동선 효율 최강 루트 | 명동 K뷰티 쇼핑 동선 | myeongdong k-beauty shopping route | ⬜ 대기 |
| 명동 | [217] 명동 & 홍대 길거리 음식 완전 정복 | 명동 홍대 길거리 음식 비교 | myeongdong vs hongdae street food | ⬜ 대기 |
| 남산 N서울타워 | [004] 남산 N서울타워 야경 가이드 | 남산 N서울타워 야경 명소 | n seoul tower night view spots | ⬜ 대기 |
| 남산 N서울타워 | [005] 남산 케이블카에서 찍는 서울 감성 스냅 사진 | 남산 케이블카 스냅 사진 | namsan cable car photo tips | ⬜ 대기 |
| 홍대 | [006] 홍대 거리 포토존 — 버스킹 무대부터 벽화 골목까지 | 홍대 거리 포토존 추천 | best hongdae street photo spots | ⬜ 대기 |
| 홍대 | [007] 홍대 인디 감성 카페 — 이색 인테리어 포토존 TOP 7 | 홍대 감성 카페 포토존 | hongdae aesthetic cafes for photos | ⬜ 대기 |
| 홍대 | [050] K-스트릿 패션 완전 분석 — 홍대·성수동 스타일 해부 | 홍대 성수 스트릿 패션 차이 | hongdae vs seongsu street fashion | ⬜ 대기 |
| 인사동 | [012] 인사동 전통 감성 포토존 | 인사동 전통 감성 사진 스팟 | insadong traditional photo spots | ⬜ 대기 |
| 인사동 | [013] 인사동 쌈지길 | 인사동 쌈지길 가는 법 | ssamziegil insadong guide | ⬜ 대기 |
| 가로수길 | [015] 가로수길 하이엔드 카페 — 세련된 도시 감성 포토존 | 가로수길 카페 포토존 | garosu-gil cafe photo spots | ⬜ 대기 |
| 한강공원 | [008] 한강공원 감성 피크닉 사진 완전 가이드 | 한강공원 피크닉 사진 구도 | hangang park picnic photo ideas | ⬜ 대기 |
| 한강공원 | [009] 한강 야경 스팟 — 브릿지 뷰와 리플렉션 사진 찍는 법 | 한강 야경 다리 사진 | hangang bridge night photography | ⬜ 대기 |
| 한강공원 | [224] 서울 자전거 투어 — 한강과 도심을 두 바퀴로 즐기는 방법 | 서울 한강 자전거 코스 | seoul bike route along hangang | ⬜ 대기 |
| 이태원 & 경리단길 | [014] 이태원 & 경리단길 글로벌 감성 포토존 가이드 | 이태원 경리단길 포토존 | best photo spots in itaewon gyeongnidan | ⬜ 대기 |
| 잠실 롯데월드 | [019] 잠실 롯데월드 어드벤처 — 판타지 감성 포토존 총정리 | 롯데월드 포토존 추천 | best photo spots at lotte world | ⬜ 대기 |
| 잠실 롯데월드 | [020] 잠실 석촌호수 벚꽃 시즌 사진 가이드 | 석촌호수 벚꽃 사진 명소 | seokchon lake cherry blossom photo spots | ⬜ 대기 |
| 잠실 롯데월드 | [216] 롯데월드 교복 대여 완전 가이드 | 롯데월드 교복 대여 방법 | lotte world school uniform rental guide | ⬜ 대기 |
| 기획사 사옥 주변 | [022] 서울 생일 광고판 성지 — 지하철역 전광판 찾아가기 가이드 | 서울 생일 광고판 위치 | seoul birthday ad locations | ⬜ 대기 |
| 기획사 사옥 주변 | [212] 기획사 주변 방문 전 꼭 알아야 할 팬 에티켓 10가지 | 기획사 주변 팬 에티켓 | fan etiquette near label offices | ⬜ 대기 |

### 3단계: 나머지 스타일 글

1·2단계 완료 후 `kpop-blog-topics-300.md`에서 아직 작성되지 않은 주제를 순서대로 작성한다.

---

## 3. 작업 진행 로그

Codex는 매 파일 작성 완료 후 반드시 이 섹션에 기록한다.
**기록이 없으면 다음 세션에서 처음부터 다시 시작한다.**
로그를 보고 [전체 작성 순서]의 상태 표(⬜/✅)도 함께 업데이트한다.

<!-- 로그 시작 -->

[2026-03-06 19:09 KST]
완료:
- content/hub/ko/gyeongbokgung-hub.mdx
- content/hub/en/gyeongbokgung-hub.mdx
다음 세션 시작: 2단계 — 경복궁 하위 글 [001] 경복궁 포토존 완전 가이드

[2026-03-06 19:55 KST]
완료:
- content/hub/ko/myeongdong-hub.mdx
- content/hub/en/myeongdong-hub.mdx
다음 세션 시작: 2단계 — 경복궁 하위 글 [001] 경복궁 포토존 완전 가이드

[2026-03-06 20:00 KST]
완료:
- content/hub/ko/gyeongbokgung-photo-guide.mdx
- content/hub/en/gyeongbokgung-photo-guide.mdx
다음 세션 시작: 2단계 — 경복궁 하위 글 [002] 경복궁 시간대별 빛과 그림자

[2026-03-06 20:08 KST]
완료:
- content/hub/ko/gyeongbokgung-light-timing-guide.mdx
- content/hub/en/gyeongbokgung-light-timing-guide.mdx
다음 세션 시작: 2단계 — 경복궁 하위 글 [003] 경복궁 근처 골목 산책 — 숨겨진 한옥 포토존 5곳

[2026-03-06 20:16 KST]
완료:
- content/hub/ko/gyeongbokgung-nearby-hanok-photo-spots.mdx
- content/hub/en/gyeongbokgung-nearby-hanok-photo-spots.mdx
다음 세션 시작: 2단계 — 경복궁 하위 글 [286] 가상 경복궁 배경 — 서울에 없어도 전통 감성 사진 완성하기

<!-- 로그 끝 -->

---

# 글 작성 참조 기준

---

## 5. SEO 관점에서 반드시 들어가야 하는 질문

허브 글은 아래 질문 6가지에 모두 답해야 한다. 하나라도 빠지면 허브 글이 아니다.

1. 왜 이 장소가 유명해졌는가
2. 왜 이 장소가 핫플이 되었는가
3. 사람들이 이 장소를 어떤 의도로 찾는가
4. 이 장소는 서울의 어떤 이미지를 대표하는가
5. 이 장소는 어떤 시각적 무드를 만드는가
6. 비슷한 다른 서울 장소와 무엇이 다른가

---

## 6. 인트로 기준

인트로는 반드시 3가지 역할을 해야 한다.

1. 이 장소를 정의한다
2. 사람들이 이 장소를 어떻게 단순하게 이해하는지 짚는다
3. 이 글이 무엇을 더 깊게 설명하는지 말한다

나쁜 인트로: "경복궁은 사진이 잘 나오는 장소다"
좋은 인트로: 장소 정체성 제시 → 대중적 인식과 실제 의미의 차이 → 글의 핵심 질문

---

## 7. 허브 글 공통 구조

1. 인트로
2. 이 장소가 서울에서 중요한 이유
3. 유명해지거나 핫플이 된 배경
4. 지금 사람들이 찾는 실제 이유
5. 이 장소를 규정하는 시각적 정체성
6. 비슷한 다른 서울 장소와의 차이
7. 사진/스타일 무드에 주는 영향
8. 함께 읽을 글

설명 중심으로 쓰고, 필요할 때만 리스트를 쓴다.

---

## 8. 한글 / 영어 분리 원칙

한글 글과 영어 글은 번역이 아니다. 같은 장소를 다른 검색 의도로 처음부터 새로 쓴다.

| | 한글 글 | 영어 글 |
|---|---------|---------|
| 독자 | 한국 사용자 | 외국인 방문자 |
| 초점 | 왜 핫해졌는지, 사회적 의미 | 서울 맥락 설명, 문화적 상징성 |
| 비교 | 다른 지역과 체감 차이 | 외국인에게 낯선 배경 설명 |

---

## 9. 허브 글 제목 10개

### 1. 경복궁
- KO: 경복궁이 서울에서 가장 상징적인 궁궐로 여겨지는 이유
- EN: Why Gyeongbokgung Became the Most Symbolic Palace in Seoul

### 2. 명동
- KO: 명동이 서울에서 가장 유명한 상권 중 하나가 된 이유
- EN: Why Myeongdong Became One of the Most Famous Districts in Seoul

### 3. 남산 N서울타워
- KO: 남산 N서울타워가 서울의 대표 랜드마크가 된 이유
- EN: Why N Seoul Tower Became One of Seoul's Most Recognizable Landmarks

### 4. 홍대
- KO: 홍대가 서울의 대표적인 청년 문화 상권이 된 이유
- EN: Why Hongdae Became One of Seoul's Strongest Youth Culture Districts

### 5. 인사동
- KO: 인사동이 여전히 서울의 전통적인 분위기를 대표하는 이유
- EN: Why Insadong Still Represents Traditional Seoul for So Many Visitors

### 6. 가로수길
- KO: 가로수길이 서울의 대표 패션 거리로 자리 잡은 이유
- EN: Why Garosu-gil Became One of Seoul's Best-Known Fashion Streets

### 7. 한강공원
- KO: 한강공원이 서울 사람들의 대표적인 일상 여가 공간이 된 이유
- EN: Why Hangang Park Became One of Seoul's Essential Everyday Leisure Spaces

### 8. 이태원 & 경리단길
- KO: 이태원과 경리단길이 다른 서울 상권과 다르게 느껴지는 이유
- EN: Why Itaewon and Gyeongnidan-gil Feel Different From Other Seoul Districts

### 9. 잠실 롯데월드
- KO: 잠실 롯데월드 일대가 서울의 대표 여가 공간으로 인식되는 이유
- EN: Why Jamsil Lotte World Became One of Seoul's Most Recognizable Leisure Zones

### 10. 대형 기획사 사옥 주변
- KO: 서울의 대형 기획사 사옥 주변이 팬들에게 특별한 의미를 갖는 이유
- EN: Why Seoul's K-pop Label HQ Areas Attract So Much Attention From Fans

---

## 10. 허브 글 소제목

### 1. 경복궁

한글:
1. 경복궁은 서울에서 무엇을 상징하는가
2. 경복궁이 강한 상징성을 갖게 된 역사적 배경
3. 사람들이 경복궁에서 실제로 기대하는 경험은 무엇인가
4. 경복궁 이미지를 만드는 핵심 공간들
5. 다른 궁궐과 비교했을 때 경복궁이 더 강하게 기억되는 이유
6. 경복궁의 전통미와 대칭감이 사진 분위기에 주는 영향
7. 함께 읽을 글

영어:
1. What Gyeongbokgung Represents in Seoul
2. Why Gyeongbokgung Became So Symbolically Important
3. What Visitors Actually Go to Gyeongbokgung to Experience
4. The Key Spaces That Shape the Gyeongbokgung Image
5. Why Gyeongbokgung Feels Different From Other Palace Areas
6. How Gyeongbokgung's Heritage Mood Changes Visual Perception
7. Related Guides

### 2. 남산 N서울타워

한글:
1. 남산 N서울타워는 서울 이미지에서 무엇을 상징하는가
2. 단순한 전망대가 아니라 랜드마크가 된 이유
3. 사람들이 이곳에 실제로 가는 목적은 무엇인가
4. 높이와 스카이라인이 이 장소 정체성의 중심인 이유
5. 다른 서울 전망 명소와 비교했을 때 N서울타워의 차이
6. 도시를 내려다보는 무드가 사진 기대감을 바꾸는 방식
7. 함께 읽을 글

영어:
1. What N Seoul Tower Represents in the Seoul Image
2. Why It Became a Landmark Rather Than Just an Observation Point
3. What People Actually Go There For Today
4. Why Height and Skyline Matter So Much to Its Identity
5. How N Seoul Tower Differs From Other Seoul View Spots
6. How Its City-Overlook Mood Changes Photo Expectations
7. Related Guides

### 3. 가로수길

한글:
1. 가로수길은 서울의 스트리트 패션 문화에서 무엇을 상징하는가
2. 가로수길이 패션과 라이프스타일 거리로 자리 잡은 이유
3. 사람들이 지금도 가로수길을 찾는 이유는 무엇인가
4. 이 거리가 복잡함보다 정돈된 인상을 주는 이유
5. 홍대나 성수와 비교했을 때 가로수길의 차이
6. 가로수길의 패션 거리 이미지가 사진 분위기를 바꾸는 방식
7. 함께 읽을 글

영어:
1. What Garosu-gil Represents in Seoul Street Fashion Culture
2. Why Garosu-gil Became a Known Fashion and Lifestyle Area
3. What Kind of Visitor Still Searches for Garosu-gil
4. Why the Street Reads as Polished Rather Than Chaotic
5. How Garosu-gil Differs From Hongdae or Seongsu
6. How Its Fashion-Street Identity Changes Portrait Mood
7. Related Guides

### 4. 홍대

한글:
1. 홍대는 서울의 청년 문화에서 무엇을 상징하는가
2. 홍대가 단순한 대학가를 넘어선 이유
3. 사람들이 홍대에서 실제로 찾는 것은 무엇인가
4. 거리의 에너지가 홍대 정체성에서 중요한 이유
5. 더 정돈된 서울 상권과 비교했을 때 홍대의 차이
6. 홍대 특유의 밀도와 움직임이 시각 무드에 주는 영향
7. 함께 읽을 글

영어:
1. What Hongdae Represents in Seoul Youth Culture
2. Why Hongdae Became More Than Just a University Area
3. What People Actually Look For in Hongdae Today
4. Why Street Energy Matters to the Hongdae Identity
5. How Hongdae Differs From More Polished Seoul Districts
6. How Hongdae's Movement and Noise Affect Visual Mood
7. Related Guides

### 5. 한강공원

한글:
1. 한강공원은 서울의 일상에서 무엇을 상징하는가
2. 강이라는 공간이 서울의 공공 이미지에서 중요한 이유
3. 사람들이 한강공원에 가서 실제로 하는 일은 무엇인가
4. 열린 공간감이 이 장소의 핵심인 이유
5. 번화한 도심 상권과 비교했을 때 한강공원의 차이
6. 강변의 여유로운 분위기가 사진 인상을 바꾸는 방식
7. 함께 읽을 글

영어:
1. What Hangang Park Represents in Everyday Seoul Life
2. Why the River Matters So Much to Seoul's Public Identity
3. What People Actually Go to Hangang Park to Do
4. Why Openness and Breathing Room Define the Space
5. How Hangang Park Differs From Dense Urban Districts
6. How Riverside Calm Changes Visual and Portrait Mood
7. Related Guides

### 6. 명동

한글:
1. 명동은 서울 방문 이미지에서 무엇을 상징하는가
2. 명동이 일찍부터 전국적 인지도를 얻게 된 이유
3. 지금 사람들이 명동에 실제로 가는 목적은 무엇인가
4. 쇼핑과 뷰티가 여전히 명동 정체성의 중심인 이유
5. 다른 서울 상권과 비교했을 때 명동의 차이
6. 빽빽한 간판과 밝은 리듬감이 시각 무드에 주는 영향
7. 함께 읽을 글

영어:
1. What Myeongdong Represents in the Seoul Visitor Imagination
2. Why Myeongdong Became So Famous So Early
3. What People Actually Go to Myeongdong For Today
4. Why Shopping and Beauty Are Still Central to Its Identity
5. How Myeongdong Differs From Other Seoul Commercial Areas
6. How Dense Signage and Bright Rhythm Change Visual Mood
7. Related Guides

### 7. 인사동

한글:
1. 인사동은 서울의 전통적 이미지에서 무엇을 상징하는가
2. 다른 지역이 변하는 동안 인사동이 계속 의미를 지닌 이유
3. 사람들이 인사동에서 실제로 기대하는 것은 무엇인가
4. 공예와 질감, 오래된 거리감이 이곳에서 중요한 이유
5. 궁궐권이나 현대적 상권과 비교했을 때 인사동의 차이
6. 인사동의 전통적 질감이 시각 분위기를 바꾸는 방식
7. 함께 읽을 글

영어:
1. What Insadong Represents in the Idea of Traditional Seoul
2. Why Insadong Stayed Relevant While Other Areas Changed
3. What Visitors Actually Expect From Insadong
4. Why Craft, Texture, and Old-Street Rhythm Matter Here
5. How Insadong Differs From Palace Areas or Modern Shopping Streets
6. How Insadong's Traditional Texture Changes Visual Mood
7. Related Guides

### 8. 이태원 & 경리단길

한글:
1. 이태원과 경리단길은 서울의 글로벌 이미지에서 무엇을 상징하는가
2. 이 지역이 다른 상권과 다른 정체성을 갖게 된 이유
3. 사람들이 이태원과 경리단길에서 실제로 찾는 것은 무엇인가
4. 섞인 거리 문화가 이 지역을 규정하는 이유
5. 홍대나 가로수길과 비교했을 때 이태원·경리단길의 차이
6. 여러 층위의 나이트라이프 무드가 시각 해석을 바꾸는 방식
7. 함께 읽을 글

영어:
1. What Itaewon and Gyeongnidan-gil Represent in Seoul's Global Image
2. Why These Areas Developed a Different Identity From Other Districts
3. What People Actually Go There For Today
4. Why Mixed Street Culture Defines the Area
5. How Itaewon and Gyeongnidan-gil Differ From Hongdae or Garosu-gil
6. How Their Layered Nightlife Mood Changes Visual Interpretation
7. Related Guides

### 9. 잠실 롯데월드

한글:
1. 잠실 롯데월드 일대는 서울의 여가 문화에서 무엇을 상징하는가
2. 단순한 놀이공원 공간을 넘어선 이유
3. 사람들이 잠실 롯데월드 일대에서 실제로 찾는 것은 무엇인가
4. 랜드마크 밀도가 잠실 이미지에서 중요한 이유
5. 다른 데이트·가족형 지역과 비교했을 때 잠실의 차이
6. 밝고 큰 구조감이 시각 분위기를 바꾸는 방식
7. 함께 읽을 글

영어:
1. What Jamsil Lotte World Represents in Seoul Leisure Culture
2. Why the Area Became More Than Just an Amusement Destination
3. What People Actually Go There For Today
4. Why Landmark Density Defines the Jamsil Image
5. How Jamsil Differs From Other Seoul Date and Family Areas
6. How Playful Scale and Bright Structure Change Visual Mood
7. Related Guides

### 10. 대형 기획사 사옥 주변

한글:
1. 대형 기획사 사옥 주변은 팬들에게 무엇을 상징하는가
2. 평범한 오피스 권역이 목적지가 된 이유
3. 사람들이 이곳에 가서 실제로 기대하는 감정과 경험은 무엇인가
4. 건물 자체보다 업계의 기운이 더 중요하게 작동하는 이유
5. 일반 상권과 비교했을 때 사옥 주변 권역의 차이
6. 동경과 팬심의 무드가 시각 해석을 바꾸는 방식
7. 함께 읽을 글

영어:
1. What K-pop Label HQ Areas Represent to Fans in Seoul
2. Why These Office Zones Became Destination Spaces
3. What People Actually Go There Hoping to Feel or See
4. Why Industry Aura Matters More Than Architecture Alone
5. How These Areas Differ From Standard Commercial Districts
6. How Aspirational Fandom Mood Changes Visual Reading
7. Related Guides

---

## 11. 기술 출력 스펙

### 파일 위치

```
content/hub/ko/[slug].mdx
content/hub/en/[slug].mdx
```

### 필수 frontmatter

```mdx
---
slug: "gyeongbokgung-photo-guide"
lang: "ko"
category: "한국 명소 & 포토존"
title: "경복궁 포토존 완전 가이드 — 전통 미학의 사진 명소 총정리"
description: "120~155자. 클릭 이유가 담긴 문장."
authorName: "최지호"
authorRole: "서울 문화 리포터"
publishedAt: "YYYY-MM-DD"
readTime: "6분 읽기"
headerGradient: "linear-gradient(135deg, #1a0a2e 0%, #f4258c 100%)"
pullQuote: "소문자로 시작하는 인상적인 한 문장."
hreflangSlug: "gyeongbokgung-photo-guide"
aiGenerated: true
---
```

### SEO 필드 기준

| 필드 | 기준 |
|------|------|
| `title` | 60자 이하, 고유, 내용 정확 반영 |
| `description` | 120–155자, 클릭 이유 포함 |
| `hreflangSlug` | KO/EN 동일값 |
| `aiGenerated` | 항상 `true` |

### 저자 테이블

| 카테고리 | 한글 저자 | 영문 저자 |
|----------|-----------|-----------|
| 한국 명소 & 포토존 | 최지호 | Ji-ho Choi |
| K-스타일 패션 | 박민아 | Mina Park |
| K-뷰티 & 헤어 | 강예진 | Ye-jin Kang |
| K-POP 문화 & 팬덤 | 신나래 | Na-rae Shin |
| 셀카 & 포토그래피 | 임수연 | Soo-yeon Lim |
| 서울 여행 가이드 | 오태양 | Tae-yang Oh |
| 팬 커뮤니티 & SNS | 송다은 | Da-eun Song |
| 가상 스타일 체험 | 박민아 | Mina Park |

### AI 공개 문구 (모든 글 마지막 필수)

한글:
```
---
*이 글은 AI 보조 도구를 활용하여 작성되었으며, 공개된 정보를 기반으로 사실 확인을 거쳤습니다. 저자 표기는 해당 카테고리의 편집 방향을 대표합니다.*
```

영문:
```
---
*This article was produced with AI assistance and reviewed for accuracy against publicly available information. Author persona represents the editorial voice for this content category.*
```

---

## 12. 수정 프롬프트

```
AGENTS.md의 품질 체크리스트를 기준으로
content/hub/ko/[slug].mdx 를 검토하고 아래 항목을 수정해:

1. title이 60자를 넘으면 줄여라
2. description이 120자 미만이면 보완해. 수정 후 글자수를 직접 세어 숫자를 보고해라.
3. AI 공개 문구가 없으면 추가해
4. padding 문장(분량만 채우는 문장)을 제거해
5. 특정 아이돌/그룹/기획사 상표명이 있으면 제거해

수정 후 변경된 항목을 목록으로 보고해.
```
