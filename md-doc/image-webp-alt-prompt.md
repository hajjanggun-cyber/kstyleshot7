# image-webp-alt-prompt

Updated At: 2026-03-07 15:20 KST

이 문서는 이미지 삽입 작업 전에 항상 먼저 읽는 고정 규칙이다.

## 기본 원칙

- 사용자가 따로 말하지 않아도 KO 글과 EN 글을 함께 처리한다.
- 파일명 끝이 `-kr`이면 한국어 글에, `-en`이면 영어 글에 넣는다.
- 한국어 글에는 한국어 ALT를, 영어 글에는 영문 ALT를 넣는다.
- 본문 이미지 경로는 항상 `/images/...` 형식으로 넣는다.
- 실제 게시용 파일은 항상 `public/images/...` 아래에 둔다.
- 사용자가 원본 이미지를 `.png`, `.jpg`, `.jpeg`로 주더라도 게시 전 반드시 `.webp`로 변환한다.
- 사용자가 확장자를 생략하고 파일명만 주더라도 원본 파일을 확인한 뒤 최종 게시본은 항상 `.webp`로 만든다.
- 사용자가 `-en.png`, `-en.jpeg`, `-kr.png`, `-kr.jpeg`처럼 섞어서 줘도 최종 산출물은 `-en.webp`, `-kr.webp`로 통일한다.
- 본문 MDX 경로도 원본 확장자를 쓰지 않고 최종 `.webp` 경로로만 넣는다.
- 게시용 폴더에는 가능하면 `.webp`만 남긴다.

## 확장자 처리 규칙

- 업로드 전 원본 확장자를 먼저 확인한다.
- 원본이 `.png`, `.jpg`, `.jpeg`이면 같은 basename의 `.webp` 파일을 새로 만든다.
- 최종 게시 경로에는 `.png`, `.jpg`, `.jpeg`를 남기지 않는다.
- 본문 MDX, 보고 메시지, 후속 수정 모두 `.webp` 기준으로 적는다.
- 사용자가 "사진 입력"만 요청해도 Codex는 `webp 변환 -> 경로 반영 -> alt 확인` 순서로 자동 처리한다.

## 권장 저장 경로

- 허브 본문 이미지: `public/images/hub/[hub-slug]/[file-name-kr.webp]`
- 영문 허브 본문 이미지: `public/images/hub/[hub-slug]/[file-name-en.webp]`
- MDX 경로: `/images/hub/[hub-slug]/[file-name-kr.webp]`

## 작업 순서

1. 사용자가 준 파일명과 언어 suffix(`-kr`, `-en`)를 확인한다.
2. 원본 파일 확장자(`png`, `jpg`, `jpeg`)를 확인한다.
3. 게시용 폴더에 같은 basename의 `.webp` 파일을 만든다.
4. 본문 MDX의 `![]()`를 `.webp` 경로와 alt 텍스트로 교체한다.
5. 게시용 폴더에는 `.webp`만 남길지 확인하고 정리한다.
6. 최종 보고에는 삽입 파일 경로와 변환 여부를 함께 적는다.

## 추가로 다음 메시지에서 주는 정보

- 이미지 파일 경로
- 한국어 ALT
- 영어 ALT
- 대상 URL 또는 슬러그
- 삽입 위치

## 기본 해석 방식

- 대상 URL이 `https://www.kstyleshot.com/ko/hub/...` 형식이면 KO 파일과 EN 파일을 함께 찾는다.
- 이미지 파일명이 `-kr`, `-en`으로 나뉘어 있으면 언어별 파일에 각각 맞게 연결한다.
- 사용자가 임시 경로나 `public/image` 경로에서 파일을 줘도 게시용 경로는 `public/images/...`로 정리한다.
- 사용자가 WebP를 따로 말하지 않아도 게시 전 자동으로 `.webp` 변환을 먼저 수행한다.

## 예시 요청 형식

```text
& 'C:\...\md-doc\image-webp-alt-prompt.md'

대상 주소:
https://www.kstyleshot.com/ko/hub/n-seoul-tower-hub

1.
파일:
& 'C:\...\some-image-kr.png'
& 'C:\...\some-image-en.jpeg'
ALT
한국어:
영어:
삽입 위치:
```

## 생략돼도 기본 처리하는 것

- KO/EN 동시 반영
- `/images/...` 경로 사용
- WebP 변환 및 최적화
- 모바일에서 과하게 크지 않게 유지
- 가운데 정렬 유지
- 캡션 미삽입

위 항목들은 별도 지시가 없어도 기본 규칙으로 처리한다.
