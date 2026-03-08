Updated At: 2026-03-08 KST

---

# SEO 일괄 수정 작업 — 오늘 완료 목표

기존에 작성된 MDX 허브 글 전체의 SEO 문제를 허브별로 나눠서 수정한다.
**허브 1개 = Codex 1배치.** 한 번에 다 넣으면 컨텍스트 초과로 실패하므로 반드시 나눠서 실행.

## 수정 내용 3가지

| Fix | 내용 | 자동 수정 여부 |
|-----|------|--------------|
| Fix 1 | description 글자수 (KO 120–155자, EN 140–160자) + title 반복 금지 | ✅ 자동 수정 |
| Fix 2 | 인트로 유형 다양화 (A/B/C/D 돌아가며) — "많은 사람은~" 패턴 제거 | ✅ 자동 수정 |
| Fix 3 | title 키워드 확인 — 플래그만, 직접 수정 금지 | 🚩 플래그만 |

---

## 진행 상황

| 허브 | 파일 수 | 상태 |
|------|---------|------|
| 경복궁 | 10파일 (5쌍) | ⬜ 대기 |
| 명동 | 8파일 (4쌍) | ⬜ 대기 |
| 남산 N서울타워 | 6파일 (3쌍) | ⬜ 대기 |
| 홍대 | 8파일 (4쌍) | ⬜ 대기 |

완료 시 여기서 ✅로 바꾼다.

---

## 공통 규칙 블록 (모든 배치에 동일하게 붙인다)

```
## Fix 1 — description 수정

규칙:
- KO 파일: description 120–155자 (공백 포함)
- EN 파일: description 140–160자 (공백 포함)
- description 첫 단어가 title과 같으면 안 된다
- description이 title을 다른 말로 반복하는 것은 금지 — 독립된 클릭 유도 문장이어야 한다
- 현재 description이 범위 안에 있고 반복이 아닌 경우: 수정하지 않는다

나쁜 예: title "홍대 서울 동네 가이드" → description "홍대 서울 동네 가이드가 왜~"
좋은 예: title "홍대 서울 동네 가이드" → description "버스킹부터 새벽 클럽까지, 홍대가 서울 청년 문화의 진원지가 된 이유를 낮과 밤으로 나눠 정리했다"

## Fix 2 — 인트로 유형 다양화

현재 문제: 대부분의 글이 아래 패턴으로 시작함
- KO: "많은 사람은 [X]를 [Y]로 단순화하지만 실제로는~"
- EN: "Many people think of [X] as [Y], but in reality~"

4가지 유형을 허브 내에서 겹치지 않게 돌아가며 사용:
A. 질문형 — 독자가 실제로 검색할 법한 질문으로 시작
B. 숫자/통계형 — 구체적인 숫자, 규모, 사실로 시작
C. 장면 묘사형 — 그 장소에 있는 듯한 감각적 묘사 1–2문장
D. 직설형 — 장소에 대한 확신 있는 주장 한 문장으로 시작

각 파일의 현재 인트로 유형을 먼저 판단한다.
"많은 사람은~" / "Many people think~" 패턴에 해당하는 글만 수정한다.
수정된 인트로는 3문장 이내.
3가지 역할(정의→간극→이 글의 가치)은 유형과 무관하게 유지.

## Fix 3 — title 키워드 확인 (플래그만, 수정 금지)

- KO: 타깃 키워드가 title에 자연스럽게 포함됐는지 확인
- EN: 타깃 키워드가 실제 검색 쿼리로 자연스러운지 확인
  ("things to do in X"가 "X neighborhood guide"보다 검색량 높음)
- 문제가 있는 파일 목록만 출력, 자동 수정 금지

## 제약 조건 (절대 변경 금지)

- frontmatter: description 외 모든 필드 값 유지
- hreflangSlug 값 절대 변경 금지
- H2/H3 소제목 순서·내용 변경 금지
- 내부 링크 href 변경 금지
- MDX 컴포넌트 태그 유지 (<HubCta />, <HubCard /> 등)
- Quick Summary, CTA 배너 블록 변경 금지

## 검증 출력 (수정 후 반드시 출력)

모든 수정 파일에 대해 아래 형식으로 출력:
파일명 | description 글자수 | 인트로 유형 | 수정 여부(yes/no)

수정된 파일은 전체 내용을 출력한다.
```

---

## 배치 1 — 경복궁 허브 (10파일)

아래를 Codex에 그대로 붙여넣는다.

```
대상 파일을 모두 읽어라:
- content/hub/ko/gyeongbokgung-hub.mdx
- content/hub/en/gyeongbokgung-hub.mdx
- content/hub/ko/gyeongbokgung-photo-guide.mdx
- content/hub/en/gyeongbokgung-photo-guide.mdx
- content/hub/ko/gyeongbokgung-light-timing-guide.mdx
- content/hub/en/gyeongbokgung-light-timing-guide.mdx
- content/hub/ko/gyeongbokgung-nearby-hanok-photo-spots.mdx
- content/hub/en/gyeongbokgung-nearby-hanok-photo-spots.mdx
- content/hub/ko/virtual-gyeongbokgung-background-guide.mdx
- content/hub/en/virtual-gyeongbokgung-background-guide.mdx

[공통 규칙 블록을 여기 붙여넣는다]
```

---

## 배치 2 — 명동 허브 (8파일)

```
대상 파일을 모두 읽어라:
- content/hub/ko/myeongdong-hub.mdx
- content/hub/en/myeongdong-hub.mdx
- content/hub/ko/myeongdong-neon-street-guide.mdx
- content/hub/en/myeongdong-neon-street-guide.mdx
- content/hub/ko/myeongdong-k-beauty-shopping-map.mdx
- content/hub/en/myeongdong-k-beauty-shopping-map.mdx
- content/hub/ko/myeongdong-hongdae-street-food-guide.mdx
- content/hub/en/myeongdong-hongdae-street-food-guide.mdx

[공통 규칙 블록을 여기 붙여넣는다]
```

---

## 배치 3 — 남산 N서울타워 허브 (6파일)

```
대상 파일을 모두 읽어라:
- content/hub/ko/n-seoul-tower-hub.mdx
- content/hub/en/n-seoul-tower-hub.mdx
- content/hub/ko/n-seoul-tower-night-view-guide.mdx
- content/hub/en/n-seoul-tower-night-view-guide.mdx
- content/hub/ko/namsan-cable-car-photo-tips.mdx
- content/hub/en/namsan-cable-car-photo-tips.mdx

[공통 규칙 블록을 여기 붙여넣는다]
```

---

## 배치 4 — 홍대 허브 (8파일)

```
대상 파일을 모두 읽어라:
- content/hub/ko/hongdae-hub.mdx
- content/hub/en/hongdae-hub.mdx
- content/hub/ko/hongdae-street-photo-spots.mdx
- content/hub/en/hongdae-street-photo-spots.mdx
- content/hub/ko/hongdae-aesthetic-cafes-for-photos.mdx
- content/hub/en/hongdae-aesthetic-cafes-for-photos.mdx
- content/hub/ko/hongdae-vs-seongsu-street-fashion.mdx
- content/hub/en/hongdae-vs-seongsu-street-fashion.mdx

[공통 규칙 블록을 여기 붙여넣는다]
```

---

## Fix 3 결과 기록 (Codex가 출력한 플래그 여기에 붙여넣기)

Codex가 각 배치에서 "title 키워드 검토 필요" 파일을 출력하면 여기에 기록해둔다.
Search Console 데이터 보고 나서 수동으로 판단.

```
[배치 완료 후 여기에 붙여넣기]
```

---

## 오늘 완료 순서

1. 배치 1 실행 → Codex 출력 확인 → 파일 저장
2. 배치 2 실행 → Codex 출력 확인 → 파일 저장
3. 배치 3 실행 → Codex 출력 확인 → 파일 저장
4. 배치 4 실행 → Codex 출력 확인 → 파일 저장
5. Fix 3 결과 위에 기록
6. 진행 상황 표에서 ✅ 체크
