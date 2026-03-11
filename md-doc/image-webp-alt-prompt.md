=======

Added At: 2026-03-11 14:49:52 KST

=======

# 추가 메모: 최종 합성에서 얼굴이 너무 크게 나올 때의 프롬프트 보정 방향

- 현재 `close-up selfie`, `tightly framed from the chest up` 같은 문구는 얼굴을 크게 나오게 유도한다.
- 배경 대비 얼굴 비율을 줄이고 싶으면 이 문구를 약하게 바꾸거나 제거해야 한다.
- 대신 `waist-up selfie`, `upper-body selfie with more background visible`, `arm-extended smartphone selfie composition` 같은 문구를 쓰는 편이 낫다.
- `the subject occupies only 35-45% of the frame`처럼 프레임 점유율을 직접 지시하는 것도 도움이 된다.
- `show more of the palace background clearly`처럼 배경 노출량을 명시하면 보정 효과가 더 좋다.

## 예시 보정 방향

- 제거 또는 약화:
  - `close-up selfie`
  - `tightly framed from the chest up`

- 추가 권장:
  - `waist-up selfie`
  - `more of the background visible`
  - `the subject occupies about 35-45% of the frame`
  - `camera held slightly farther from the subject`

## 중요한 한계

- 프롬프트만으로는 어느 정도까지만 보정 가능하다.
- 베이스 이미지 자체가 이미 얼굴 위주 구도라면 최종 모델도 그 구도를 완전히 뒤집기 어렵다.
- 따라서 1차 해결은 프롬프트 수정이 맞지만, 효과가 부족하면 베이스 이미지에 바깥 여백을 추가하는 방식까지 검토해야 한다.

=======

Updated At: 2026-03-09 23:59 KST

=======

# Image WebP Alt Prompt

이 문서는 이미지 삽입 작업 전용 실행 문서다.
프로젝트 전체 SEO 기준은 `md-doc/post-codex-command.md`를 따른다.

## 1. 이 문서의 역할

- 이미지 파일을 게시용 `.webp`로 변환한다.
- MDX 본문에 최종 `/images/...webp` 경로를 반영한다.
- 이미지 alt를 SEO와 접근성 기준에 맞게 보정한다.

## 2. 입력 확인

작업 전에 아래를 먼저 확인한다.

- 대상 URL 또는 slug
- 이미지 파일 경로
- 파일명 suffix: `-kr`, `-en`
- 삽입 위치

기본값:
- KO/EN 파일을 함께 본다.
- `-kr` 이미지는 KO 파일에, `-en` 이미지는 EN 파일에 넣는다.

## 3. 변환 규칙

- 원본 확장자(`png`, `jpg`, `jpeg`)를 먼저 확인한다.
- 최종 게시본은 항상 `.webp`로 만든다.
- 게시 경로는 항상 `public/images/...` 아래에 둔다.
- MDX 본문 경로는 항상 `/images/...webp`만 사용한다.
- 원본 확장자를 본문에 남기지 않는다.

기본 경로:
- 게시 폴더: `public/images/hub/[hub-slug]/`
- 본문 경로: `/images/hub/[hub-slug]/[file-name-kr.webp]`

## 4. 원본 삭제 규칙

- 현재 요청에 직접 사용한 원본 파일만 삭제 대상으로 본다.
- `.webp` 생성과 MDX 반영이 확인된 뒤 삭제한다.
- 이번 요청과 직접 관련 없는 이미지 파일은 자동 삭제하지 않는다.
- 애매하면 먼저 MDX 참조 여부를 확인한다.

## 5. alt 작성 규칙

- alt는 비워두지 않는다.
- alt는 실제 장면 설명을 우선한다.
- 검색 의도 키워드 1개만 자연스럽게 포함할 수 있다.
- alt는 짧고 구체적으로 쓴다.
- 한국어 파일은 한국어 alt, 영어 파일은 영어 alt를 쓴다.
- 같은 글 안의 모든 alt를 같은 문장 구조로 반복하지 않는다.
- alt마다 장소, 빛, 색감, 재질, 구도 중 1~2개를 구체적으로 드러내는 편을 우선한다.
- 메인 키워드를 모든 이미지에 반복하지 말고, 이미지마다 보조 키워드나 파생 표현을 분산한다.
- 영어 alt는 가능하면 125자 이내를 기본 상한선으로 본다.
- 한국어 alt도 한 문장 수준으로 유지하고 두 줄짜리 설명문처럼 길어지지 않게 한다.

금지:
- 제목 복붙
- H2 복붙
- 키워드 나열
- 시적인 표현
- 추상적인 감상
- 같은 뜻 반복
- 같은 문법 구조 반복
- `A를 담은 사진`, `A가 보이는 장면`, `A 풍경` 같은 틀을 연속 사용
- 모든 이미지 alt에 같은 메인 키워드 반복
- 감상문처럼 길어진 alt

추가 규칙:
- 사용자가 준 ALT가 있어도 SEO/접근성 기준에 맞지 않으면 보정한다.
- 허브 글 alt는 하위 글 메인 키워드를 뺏지 않는다.
- 하위 글 alt는 해당 글의 검색 의도와 장면에 맞춘다.
- 한 글 안에서 이미지가 여러 장이면 alt마다 서로 다른 보조 키워드 1개씩을 우선 매칭한다.
- 예:
  - 메인 키워드가 `명동 네온사인 야간 사진`이라면 alt는 `명동 밤거리`, `서울 네온 포토존`, `비 온 뒤 반사`, `야간 스트릿 스냅`처럼 분산할 수 있다.
- 단순히 `거리에 서 있는 사람`처럼 건조하게 끝내지 말고, 필요한 경우 창가 자연광, 따뜻한 조명, 젖은 노면, 나무 문틀, 쇼윈도 반사처럼 실제로 보이는 시각 질감을 함께 설명한다.

## 6. 작업 순서

1. 대상 URL/slug 확인
2. 파일명과 `-kr` / `-en` 확인
3. 원본 확장자 확인
4. `.webp` 생성
5. 게시 경로 확정
6. MDX의 `![]()`를 `![alt](/images/...webp)`로 교체
7. alt 품질 점검
8. 원본 삭제 여부 확인
9. 최종 보고

## 7. 최종 보고 항목

최종 보고에는 아래를 포함한다.

- 삽입한 파일 경로
- `.webp` 변환 여부
- 원본 삭제 여부
- 어떤 alt를 반영했는지

## 8. 요청 예시

```text
& 'C:\...\md-doc\image-webp-alt-prompt.md'

대상 주소:
https://www.kstyleshot.com/ko/hub/example-hub

1.
파일:
& 'C:\...\some-image-kr.png'
& 'C:\...\some-image-en.jpeg'
ALT
한국어:
영어:
삽입 위치:
```

=======
