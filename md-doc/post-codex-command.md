Updated At: 2026-03-06 (Asia/Seoul)

---

# 집에서 재개할 때 — 첫 번째 글 시작 방법

## 현재 상태 (2026-03-06 완료)

인프라 구축 완료. Codex가 글을 쓸 수 있는 환경이 모두 준비되어 있다.

완료된 것:
- AGENTS.md (프로젝트 루트) — Codex 자동 인식 지침 파일
- content/hub/ko/ + content/hub/en/ — 글 저장 디렉토리 생성
- lib/mdx.ts — MDX 파일 읽기 유틸리티
- components/hub/HubMdxPage.tsx — MDX 렌더러
- app/[lang]/hub/[slug]/page.tsx — SEO generateMetadata 포함, MDX 우선 라우팅
- app/sitemap.ts — MDX 파일 자동 스캔 → sitemap 동적 생성
- next-mdx-remote + gray-matter 설치 완료

아직 안 한 것:
- hreflang + JSON-LD (④번) — 글 작성 시작 후 해도 됨
- 실제 글 작성 (Codex)

---

## 첫 글 시작 — Codex에게 복사해서 붙여넣기

```
AGENTS.md와 md-doc/post-codex-command.md를 읽어라.

경복궁 허브 글 1쌍을 작성해.

주제:
- KO: 경복궁이 서울에서 가장 상징적인 궁궐로 여겨지는 이유
- EN: Why Gyeongbokgung Became the Most Symbolic Palace in Seoul
- slug: gyeongbokgung-hub
- 카테고리: 한국 명소 & 포토존

출력 파일:
- content/hub/ko/gyeongbokgung-hub.mdx
- content/hub/en/gyeongbokgung-hub.mdx

소제목은 post-codex-command.md 섹션 9의 경복궁 소제목을 그대로 사용한다.
섹션 4의 질문 6가지에 모두 답해야 한다.
두 파일 모두 AGENTS.md frontmatter 스키마를 완전히 따른다.
AI 공개 문구로 마무리한다.

중요: 한글 글과 영어 글은 번역이 아니다.
같은 장소를 다루지만 완전히 다른 검색 의도로 처음부터 새로 쓴다.
한글은 한국 사용자 관점(왜 핫해졌는지, 사회적 의미),
영어는 외국인 독자 관점(서울 맥락 설명, 문화적 상징성)으로 쓴다.
```

---

## 두 번째 이후 — 일일 10개 배치

섹션 10의 우선순위 순서대로 진행.
배치 프롬프트는 이 문서 섹션 14 참조.

---

# 포스트 기획 기준 문서

## 최상단 필수 숙지 사항

글 작성 전 반드시 아래 Google 공식 문서를 먼저 확인한다.

- Google SEO 기본 가이드:
  `https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko`

이 링크는 선택 사항이 아니라 기본 기준이다.
앞으로 작성하는 모든 글은 아래 원칙을 먼저 점검한 뒤 작성한다.

1. 검색엔진보다 사람에게 먼저 도움이 되는 글인가
2. 제목이 내용을 정확하게 설명하는가
3. 설명문(description)이 검색 결과에서 클릭 이유를 주는가
4. 본문 구조가 명확하고 소제목이 실제 내용을 반영하는가
5. 독창적인 정보, 설명, 비교, 해석이 있는가
6. 얇은 요약문이나 중복 문장으로 분량만 늘린 글이 아닌가
7. 링크 텍스트가 자연스럽고 문맥상 의미가 있는가
8. 사이트맵과 색인 요청은 운영 단계에서 별도로 확인하는가
9. 이미지가 없더라도 텍스트만으로 문서 가치가 충분한가
10. 한글 글과 영어 글이 각각의 검색 의도에 맞게 독립적으로 설계되었는가

추가 원칙:

- 길다고 SEO에 좋은 것이 아니다.
- 짧아도 검색 의도에 정확히 답하면 강한 글이 될 수 있다.
- 반대로 길어도 중복과 추상어가 많으면 약한 글이다.
- 앞으로는 "분량"보다 "검색 의도 적합성 + 정보 밀도 + 구조 명확성"을 우선한다.

## 0. 문서 목적

이 문서는 블로그 포스트 기획의 기준 문서다.

이 문서에서만 관리하는 항목:

- 포스트 방향
- 허브 글 제목
- 소제목 구조
- 장소 확장 전략
- 한글/영문 운영 원칙
- SEO 기준
- 작성 순서

이 문서는 실행용 TODO 문서가 아니다.
당일 작업, 체크리스트, 점검 메모는 `todo.md`에서만 관리한다.

---

## 1. 현재 방향 전환

이전 장소형 글은 주로 아래 5종에 집중되어 있었다.

1. 무드 가이드
2. 헤어
3. 의상
4. 프레이밍
5. 체크리스트

이 구조는 전환 보조용으로는 쓸 수 있지만, 검색 유입용으로는 약하다.

이제는 방향을 바꾼다.

새 기준:

- 장소 자체를 설명하는 정보형 허브 글이 먼저다.
- 스타일형 글은 그 다음이다.

즉 앞으로의 장소형 포스트는 두 층으로 나뉜다.

### 1단계: 장소 엔티티 글

- 이 장소는 무엇인가
- 왜 유명해졌는가
- 왜 핫플이 되었는가
- 사람들이 왜 찾는가
- 어떤 분위기와 상징을 가지는가

### 2단계: 스타일 연결 글

- 무드 가이드
- 헤어
- 의상
- 프레이밍
- 체크리스트

---

## 2. 핵심 원칙

1. 한글 글과 영어 글은 번역 쌍으로 만들지 않는다.
2. 같은 장소를 다뤄도 한글과 영어는 다른 검색 의도로 설계한다.
3. 장소 글은 먼저 "장소 자체"를 설명해야 한다.
4. "예쁘다", "유명하다", "핫하다"만 반복하는 글은 기획 미완성으로 본다.
5. 허브 글은 검색 상단 퍼널을 담당하고, 기존 스타일 글은 하단 퍼널을 담당한다.
6. create CTA는 허브 글 마지막에만 자연스럽게 붙인다.
7. 얇은 리스트형 글 양산보다, 설명력 있는 허브 글이 우선이다.

---

## 3. 현재 장소 10개

고정 장소 10개:

1. 경복궁
2. 남산 N서울타워
3. 가로수길
4. 홍대
5. 한강공원
6. 명동
7. 인사동
8. 이태원 & 경리단길
9. 잠실 롯데월드
10. 대형 기획사 사옥 주변

이 10개는 모두 "배경"이 아니라 서울의 개별 장소 엔티티로 다룬다.

---

## 4. SEO 관점에서 반드시 들어가야 하는 질문

각 장소 허브 글은 최소한 아래 질문에 답해야 한다.

1. 왜 이 장소가 유명해졌는가
2. 왜 이 장소가 핫플이 되었는가
3. 사람들이 이 장소를 어떤 의도로 찾는가
4. 이 장소는 서울의 어떤 이미지를 대표하는가
5. 이 장소는 어떤 시각적 무드를 만드는가
6. 비슷한 다른 서울 장소와 무엇이 다른가

이 질문에 답하지 못하면 허브 글이 아니다.

---

## 5. 인트로 기준

인트로는 절대 가볍게 쓰지 않는다.

좋은 인트로는 반드시 3가지 역할을 해야 한다.

1. 이 장소를 정의한다
2. 사람들이 이 장소를 어떻게 단순하게 이해하는지 짚는다
3. 이 글이 무엇을 더 깊게 설명하는지 말한다

나쁜 인트로 예시:

- 경복궁은 사진이 잘 나오는 장소다
- 명동은 분위기 있는 번화가다

좋은 인트로 방향:

- 장소의 정체성 제시
- 대중적 인식과 실제 의미의 차이 제시
- 글의 핵심 질문 제시

---

## 6. 허브 글 공통 구조

장소 허브 글은 아래 구조를 기본으로 한다.

1. 인트로
2. 이 장소가 서울에서 중요한 이유
3. 이 장소가 유명해지거나 핫플이 된 배경
4. 지금 사람들이 이곳을 찾는 실제 이유
5. 이 장소를 규정하는 시각적 정체성
6. 비슷한 다른 서울 장소와의 차이
7. 이 정체성이 사진/스타일 무드에 주는 영향
8. 함께 읽을 글

설명 중심으로 쓰고, 필요할 때만 리스트를 쓴다.

---

## 7. 한글 / 영어 분리 원칙

### 한글 글

한글 글은 아래 쪽으로 기운다.

- 한국 사용자 검색 습관
- 왜 핫해졌는지
- 실제 방문 의도
- 사회적 / 트렌드적 의미
- 다른 지역과 비교했을 때 체감 차이

### 영어 글

영어 글은 아래 쪽으로 기운다.

- 서울 맥락 설명
- 왜 유명한지
- 왜 상징적인지
- 외부 독자에게 필요한 배경 설명
- 장소가 주는 문화적 / 시각적 의미

즉 같은 장소라도 한글과 영어는 제목부터 달라질 수 있다.

---

## 8. 10개 장소 허브 글 제목 확정

이 섹션은 10개 장소의 메인 허브 글 제목을 확정한 것이다.

### 1. 경복궁

한글:
- 경복궁이 서울에서 가장 상징적인 궁궐로 여겨지는 이유

영어:
- Why Gyeongbokgung Became the Most Symbolic Palace in Seoul

### 2. 남산 N서울타워

한글:
- 남산 N서울타워가 서울의 대표 랜드마크가 된 이유

영어:
- Why N Seoul Tower Became One of Seoul's Most Recognizable Landmarks

### 3. 가로수길

한글:
- 가로수길이 서울의 대표 패션 거리로 자리 잡은 이유

영어:
- Why Garosu-gil Became One of Seoul's Best-Known Fashion Streets

### 4. 홍대

한글:
- 홍대가 서울의 대표적인 청년 문화 상권이 된 이유

영어:
- Why Hongdae Became One of Seoul's Strongest Youth Culture Districts

### 5. 한강공원

한글:
- 한강공원이 서울 사람들의 대표적인 일상 여가 공간이 된 이유

영어:
- Why Hangang Park Became One of Seoul's Essential Everyday Leisure Spaces

### 6. 명동

한글:
- 명동이 서울에서 가장 유명한 상권 중 하나가 된 이유

영어:
- Why Myeongdong Became One of the Most Famous Districts in Seoul

### 7. 인사동

한글:
- 인사동이 여전히 서울의 전통적인 분위기를 대표하는 이유

영어:
- Why Insadong Still Represents Traditional Seoul for So Many Visitors

### 8. 이태원 & 경리단길

한글:
- 이태원과 경리단길이 다른 서울 상권과 다르게 느껴지는 이유

영어:
- Why Itaewon and Gyeongnidan-gil Feel Different From Other Seoul Districts

### 9. 잠실 롯데월드

한글:
- 잠실 롯데월드 일대가 서울의 대표 여가 공간으로 인식되는 이유

영어:
- Why Jamsil Lotte World Became One of Seoul's Most Recognizable Leisure Zones

### 10. 대형 기획사 사옥 주변

한글:
- 서울의 대형 기획사 사옥 주변이 팬들에게 특별한 의미를 갖는 이유

영어:
- Why Seoul's K-pop Label HQ Areas Attract So Much Attention From Fans

---

## 9. 10개 장소 허브 글 소제목 확정

### 1. 경복궁

한글 소제목:

1. 경복궁은 서울에서 무엇을 상징하는가
2. 경복궁이 강한 상징성을 갖게 된 역사적 배경
3. 사람들이 경복궁에서 실제로 기대하는 경험은 무엇인가
4. 경복궁 이미지를 만드는 핵심 공간들
5. 다른 궁궐과 비교했을 때 경복궁이 더 강하게 기억되는 이유
6. 경복궁의 전통미와 대칭감이 사진 분위기에 주는 영향
7. 함께 읽을 글

영어 소제목:

1. What Gyeongbokgung Represents in Seoul
2. Why Gyeongbokgung Became So Symbolically Important
3. What Visitors Actually Go to Gyeongbokgung to Experience
4. The Key Spaces That Shape the Gyeongbokgung Image
5. Why Gyeongbokgung Feels Different From Other Palace Areas
6. How Gyeongbokgung's Heritage Mood Changes Visual Perception
7. Related Guides

### 2. 남산 N서울타워

한글 소제목:

1. 남산 N서울타워는 서울 이미지에서 무엇을 상징하는가
2. 단순한 전망대가 아니라 랜드마크가 된 이유
3. 사람들이 이곳에 실제로 가는 목적은 무엇인가
4. 높이와 스카이라인이 이 장소 정체성의 중심인 이유
5. 다른 서울 전망 명소와 비교했을 때 N서울타워의 차이
6. 도시를 내려다보는 무드가 사진 기대감을 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What N Seoul Tower Represents in the Seoul Image
2. Why It Became a Landmark Rather Than Just an Observation Point
3. What People Actually Go There For Today
4. Why Height and Skyline Matter So Much to Its Identity
5. How N Seoul Tower Differs From Other Seoul View Spots
6. How Its City-Overlook Mood Changes Photo Expectations
7. Related Guides

### 3. 가로수길

한글 소제목:

1. 가로수길은 서울의 스트리트 패션 문화에서 무엇을 상징하는가
2. 가로수길이 패션과 라이프스타일 거리로 자리 잡은 이유
3. 사람들이 지금도 가로수길을 찾는 이유는 무엇인가
4. 이 거리가 복잡함보다 정돈된 인상을 주는 이유
5. 홍대나 성수와 비교했을 때 가로수길의 차이
6. 가로수길의 패션 거리 이미지가 사진 분위기를 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What Garosu-gil Represents in Seoul Street Fashion Culture
2. Why Garosu-gil Became a Known Fashion and Lifestyle Area
3. What Kind of Visitor Still Searches for Garosu-gil
4. Why the Street Reads as Polished Rather Than Chaotic
5. How Garosu-gil Differs From Hongdae or Seongsu
6. How Its Fashion-Street Identity Changes Portrait Mood
7. Related Guides

### 4. 홍대

한글 소제목:

1. 홍대는 서울의 청년 문화에서 무엇을 상징하는가
2. 홍대가 단순한 대학가를 넘어선 이유
3. 사람들이 홍대에서 실제로 찾는 것은 무엇인가
4. 거리의 에너지가 홍대 정체성에서 중요한 이유
5. 더 정돈된 서울 상권과 비교했을 때 홍대의 차이
6. 홍대 특유의 밀도와 움직임이 시각 무드에 주는 영향
7. 함께 읽을 글

영어 소제목:

1. What Hongdae Represents in Seoul Youth Culture
2. Why Hongdae Became More Than Just a University Area
3. What People Actually Look For in Hongdae Today
4. Why Street Energy Matters to the Hongdae Identity
5. How Hongdae Differs From More Polished Seoul Districts
6. How Hongdae's Movement and Noise Affect Visual Mood
7. Related Guides

### 5. 한강공원

한글 소제목:

1. 한강공원은 서울의 일상에서 무엇을 상징하는가
2. 강이라는 공간이 서울의 공공 이미지에서 중요한 이유
3. 사람들이 한강공원에 가서 실제로 하는 일은 무엇인가
4. 열린 공간감이 이 장소의 핵심인 이유
5. 번화한 도심 상권과 비교했을 때 한강공원의 차이
6. 강변의 여유로운 분위기가 사진 인상을 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What Hangang Park Represents in Everyday Seoul Life
2. Why the River Matters So Much to Seoul's Public Identity
3. What People Actually Go to Hangang Park to Do
4. Why Openness and Breathing Room Define the Space
5. How Hangang Park Differs From Dense Urban Districts
6. How Riverside Calm Changes Visual and Portrait Mood
7. Related Guides

### 6. 명동

한글 소제목:

1. 명동은 서울 방문 이미지에서 무엇을 상징하는가
2. 명동이 일찍부터 전국적 인지도를 얻게 된 이유
3. 지금 사람들이 명동에 실제로 가는 목적은 무엇인가
4. 쇼핑과 뷰티가 여전히 명동 정체성의 중심인 이유
5. 다른 서울 상권과 비교했을 때 명동의 차이
6. 빽빽한 간판과 밝은 리듬감이 시각 무드에 주는 영향
7. 함께 읽을 글

영어 소제목:

1. What Myeongdong Represents in the Seoul Visitor Imagination
2. Why Myeongdong Became So Famous So Early
3. What People Actually Go to Myeongdong For Today
4. Why Shopping and Beauty Are Still Central to Its Identity
5. How Myeongdong Differs From Other Seoul Commercial Areas
6. How Dense Signage and Bright Rhythm Change Visual Mood
7. Related Guides

### 7. 인사동

한글 소제목:

1. 인사동은 서울의 전통적 이미지에서 무엇을 상징하는가
2. 다른 지역이 변하는 동안 인사동이 계속 의미를 지닌 이유
3. 사람들이 인사동에서 실제로 기대하는 것은 무엇인가
4. 공예와 질감, 오래된 거리감이 이곳에서 중요한 이유
5. 궁궐권이나 현대적 상권과 비교했을 때 인사동의 차이
6. 인사동의 전통적 질감이 시각 분위기를 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What Insadong Represents in the Idea of Traditional Seoul
2. Why Insadong Stayed Relevant While Other Areas Changed
3. What Visitors Actually Expect From Insadong
4. Why Craft, Texture, and Old-Street Rhythm Matter Here
5. How Insadong Differs From Palace Areas or Modern Shopping Streets
6. How Insadong's Traditional Texture Changes Visual Mood
7. Related Guides

### 8. 이태원 & 경리단길

한글 소제목:

1. 이태원과 경리단길은 서울의 글로벌 이미지에서 무엇을 상징하는가
2. 이 지역이 다른 상권과 다른 정체성을 갖게 된 이유
3. 사람들이 이태원과 경리단길에서 실제로 찾는 것은 무엇인가
4. 섞인 거리 문화가 이 지역을 규정하는 이유
5. 홍대나 가로수길과 비교했을 때 이태원·경리단길의 차이
6. 여러 층위의 나이트라이프 무드가 시각 해석을 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What Itaewon and Gyeongnidan-gil Represent in Seoul's Global Image
2. Why These Areas Developed a Different Identity From Other Districts
3. What People Actually Go There For Today
4. Why Mixed Street Culture Defines the Area
5. How Itaewon and Gyeongnidan-gil Differ From Hongdae or Garosu-gil
6. How Their Layered Nightlife Mood Changes Visual Interpretation
7. Related Guides

### 9. 잠실 롯데월드

한글 소제목:

1. 잠실 롯데월드 일대는 서울의 여가 문화에서 무엇을 상징하는가
2. 단순한 놀이공원 공간을 넘어선 이유
3. 사람들이 잠실 롯데월드 일대에서 실제로 찾는 것은 무엇인가
4. 랜드마크 밀도가 잠실 이미지에서 중요한 이유
5. 다른 데이트·가족형 지역과 비교했을 때 잠실의 차이
6. 밝고 큰 구조감이 시각 분위기를 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What Jamsil Lotte World Represents in Seoul Leisure Culture
2. Why the Area Became More Than Just an Amusement Destination
3. What People Actually Go There For Today
4. Why Landmark Density Defines the Jamsil Image
5. How Jamsil Differs From Other Seoul Date and Family Areas
6. How Playful Scale and Bright Structure Change Visual Mood
7. Related Guides

### 10. 대형 기획사 사옥 주변

한글 소제목:

1. 대형 기획사 사옥 주변은 팬들에게 무엇을 상징하는가
2. 평범한 오피스 권역이 목적지가 된 이유
3. 사람들이 이곳에 가서 실제로 기대하는 감정과 경험은 무엇인가
4. 건물 자체보다 업계의 기운이 더 중요하게 작동하는 이유
5. 일반 상권과 비교했을 때 사옥 주변 권역의 차이
6. 동경과 팬심의 무드가 시각 해석을 바꾸는 방식
7. 함께 읽을 글

영어 소제목:

1. What K-pop Label HQ Areas Represent to Fans in Seoul
2. Why These Office Zones Became Destination Spaces
3. What People Actually Go There Hoping to Feel or See
4. Why Industry Aura Matters More Than Architecture Alone
5. How These Areas Differ From Standard Commercial Districts
6. How Aspirational Fandom Mood Changes Visual Reading
7. Related Guides

---

## 10. 허브 글 작성 우선순위

1. 경복궁
2. 명동
3. 남산 N서울타워
4. 홍대
5. 인사동
6. 가로수길
7. 한강공원
8. 이태원 & 경리단길
9. 잠실 롯데월드
10. 대형 기획사 사옥 주변

이 순서로 가는 이유:

- 경복궁과 명동이 가장 대표적인 기준 모델이 된다.
- 여기서 톤과 깊이를 먼저 잡아야 나머지 8개에 복제하기 쉽다.

---

## 11. 운영 규칙

허브 글 작성 후 운영 순서:

1. 발행
2. 사이트맵 반영 확인
3. Google Search Console 수동 색인 요청
4. 기존 스타일형 글과 내부 링크 연결

원칙:

- 사이트맵 자동 반영과
- 구글 실제 색인 요청은

같은 일이 아니다.

사이트맵은 코드/배포 구조 문제이고,
색인 요청은 운영 작업이다.

---

## 12. 최종 기준

앞으로 장소형 글은 아래 질문에 답하지 못하면 발행 가치가 낮다.

1. 왜 이 장소가 중요한가
2. 왜 이 장소가 유명해졌는가
3. 왜 이 장소가 핫플이 되었는가
4. 사람들이 왜 이곳을 찾는가
5. 이 장소는 서울의 어떤 이미지를 대표하는가

장소를 설명하지 못한 채 스타일만 설명하는 글은 더 이상 허브 글로 취급하지 않는다.

---

## 13. Codex 기술 출력 스펙

이 섹션은 Codex가 실제로 파일을 생성할 때 따라야 하는 기술 규격이다.
전체 상세 규칙은 프로젝트 루트의 `AGENTS.md`를 우선 참조한다.

### 파일 위치

```
content/hub/ko/[slug].mdx    ← 한글 글
content/hub/en/[slug].mdx    ← 영문 글
```

### 필수 frontmatter 필드

```mdx
---
slug: "gyeongbokgung-photo-guide"
lang: "ko"
category: "한국 명소 & 포토존"
title: "경복궁 포토존 완전 가이드 — 전통 미학의 사진 명소 총정리"
description: "경복궁 포토존 완전 가이드. 최적의 촬영 스팟, 빛이 좋은 시간대, 전통미를 살린 구도 팁을 한 곳에 정리했다."
authorName: "최지호"
authorRole: "서울 문화 리포터"
publishedAt: "2026-03-06"
readTime: "6분 읽기"
headerGradient: "linear-gradient(135deg, #1a0a2e 0%, #f4258c 100%)"
pullQuote: "경복궁은 단순한 배경이 아니다. 서울이 왜 한 마디로 정의될 수 없는지를 보여주는 공간이다."
hreflangSlug: "gyeongbokgung-photo-guide"
aiGenerated: true
---
```

### SEO 필드 기준

| 필드 | 기준 |
|------|------|
| `title` | 60자 이하, 페이지마다 고유, 내용 정확 반영 |
| `description` | 120–155자, 클릭 이유 포함 |
| `hreflangSlug` | KO/EN 동일값 — hreflang 자동 연결용 |
| `aiGenerated` | 항상 `true` — Google 투명성 정책 준수 |

### AI 공개 문구 (모든 글 마지막에 필수)

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

### 저자 고정 테이블

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

### 일일 실행 원칙

- 하루 10개: 한글 5개 + 영문 5개
- 반드시 쌍으로: 동일한 `hreflangSlug`를 가진 KO/EN 한 세트
- 주제 목록 참조: `md-doc/kpop-blog-topics-300.md`
- 우선순위: 이 문서 섹션 10번 순서 따름

### 출력 전 품질 체크

- [ ] title 60자 이하, 고유한가
- [ ] description 120–155자, 클릭 이유 있는가
- [ ] 인트로가 정의 / 통념 반박 / 글의 약속 세 가지를 하는가
- [ ] 분량 채우기용 문장이 없는가
- [ ] 특정 아이돌·그룹명·기획사 상표가 없는가
- [ ] AI 공개 문구가 마지막에 있는가
- [ ] `hreflangSlug`가 쌍 파일과 일치하는가

---

## 14. Codex 실행 프롬프트 (복사해서 그대로 사용)

### 기본 프롬프트 — 신규 글 1쌍 작성

```
AGENTS.md와 md-doc/post-codex-command.md를 읽고 아래 주제로 MDX 글 1쌍을 작성해.

주제:
- KO: [여기에 한글 제목 입력]
- EN: [여기에 영문 제목 입력]
- slug: [kebab-case-slug]
- 카테고리: [카테고리명]

출력 파일:
- content/hub/ko/[slug].mdx
- content/hub/en/[slug].mdx

두 파일 모두 AGENTS.md의 frontmatter 스키마를 완전히 따르고,
AI 공개 문구로 마무리한다.
한글 글과 영어 글은 번역이 아니라 각각의 검색 의도로 독립 작성한다.
```

---

### 일일 10개 배치 프롬프트

```
AGENTS.md와 md-doc/post-codex-command.md를 읽어라.
md-doc/kpop-blog-topics-300.md에서 아직 작성되지 않은 주제를
한글 5개 + 영문 5개 (총 5쌍)를 골라 MDX 파일로 작성해.

규칙:
1. 각 쌍은 동일한 hreflangSlug를 가진다
2. content/hub/ko/[slug].mdx + content/hub/en/[slug].mdx 에 저장
3. AGENTS.md 품질 체크리스트를 통과해야 한다
4. 이미 존재하는 파일은 건드리지 않는다
5. 작성 완료 후 생성된 파일 목록을 보고한다
```

---

### 특정 장소 허브 글 프롬프트 (경복궁 예시)

```
AGENTS.md와 md-doc/post-codex-command.md 섹션 9를 읽어라.

경복궁 허브 글을 작성해:
- KO slug: gyeongbokgung-hub-ko
- EN slug: gyeongbokgung-hub-en
- hreflangSlug: gyeongbokgung-hub

post-codex-command.md 섹션 9의 소제목 구조를 그대로 사용해.
섹션 4의 질문 6가지에 모두 답하는 글을 써야 한다.
분량은 검색 의도 충족에 필요한 만큼만 쓴다 (padding 금지).
```

---

### 기존 글 검토/수정 프롬프트

```
AGENTS.md의 품질 체크리스트를 기준으로
content/hub/ko/[slug].mdx 를 검토하고 아래 항목을 수정해:

1. title이 60자를 넘으면 줄여라
2. description이 120자 미만이면 보완해
3. AI 공개 문구가 없으면 추가해
4. padding 문장(내용 없이 분량만 채우는 문장)을 제거해
5. 특정 아이돌/그룹/기획사 상표명이 있으면 제거해

수정 후 변경된 항목을 목록으로 보고해.
```
