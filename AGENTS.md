# AGENTS.md — Codex Writing Instructions for K-Style Hub

> This file is automatically read by Codex before any task.
> All content written for this project must follow every rule below without exception.

---

## Project Context

- Site: K-Style Hub (https://kstyleshot.com)
- Framework: Next.js App Router, TypeScript, next-intl (i18n)
- Routes: `/ko/hub/[slug]` and `/en/hub/[slug]`
- Content location: `content/hub/ko/[slug].mdx` and `content/hub/en/[slug].mdx`

---

## Output Format

Every post must be a `.mdx` file with the following frontmatter.

```mdx
---
slug: "gyeongbokgung-photo-guide"
lang: "en"
category: "Seoul Locations"
title: "Gyeongbokgung Palace Photo Guide — Traditional Aesthetics for Modern Shots"
description: "A complete photo guide to Gyeongbokgung Palace. Best spots, light timing, and framing tips for capturing Seoul's most iconic royal grounds."
authorName: "Ji-ho Choi"
authorRole: "Seoul Culture Correspondent"
publishedAt: "2026-03-06"
readTime: "6 Min Read"
headerGradient: "linear-gradient(135deg, #1a0a2e 0%, #f4258c 100%)"
pullQuote: "Gyeongbokgung is not just a backdrop. It is a visual argument for why Seoul cannot be summarized."
hreflangSlug: "gyeongbokgung-photo-guide"
aiGenerated: true
---

[Article body in MDX]
```

---

## File Naming Rules

| Language | Path |
|----------|------|
| Korean   | `content/hub/ko/[slug].mdx` |
| English  | `content/hub/en/[slug].mdx` |

- slug: kebab-case, English only, no special characters
- KO and EN files for the same topic must share the same `hreflangSlug` value

---

## Frontmatter Field Definitions

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | YES | Matches filename. URL-safe kebab-case. |
| `lang` | YES | `"ko"` or `"en"` |
| `category` | YES | Must match one of the 8 categories in `kpop-blog-topics-300.md` |
| `title` | YES | Unique per page. Max 60 characters. Must describe content accurately. |
| `description` | YES | 120–155 characters. Answers why the reader should click. |
| `authorName` | YES | Use a consistent author persona per category (see Author Table below) |
| `authorRole` | YES | e.g. "Seoul Culture Correspondent", "K-Beauty Expert" |
| `publishedAt` | YES | ISO date string: `"YYYY-MM-DD"` |
| `readTime` | YES | e.g. `"5 Min Read"` |
| `headerGradient` | YES | CSS gradient string for hero background |
| `pullQuote` | YES | A single memorable sentence from the article. Starts with a lowercase letter inside quotes. |
| `hreflangSlug` | YES | Identical value in both KO and EN files to enable hreflang pairing |
| `aiGenerated` | YES | Always `true` for Codex-written content (Google transparency requirement) |
| `nextSlug` | optional | slug of the next recommended article |
| `nextTitle` | optional | display title of the next article |

---

## Author Table (Fixed Personas per Category)

| Category | Korean Author | English Author |
|----------|---------------|----------------|
| 한국 명소 & 포토존 | 최지호 | Ji-ho Choi |
| K-스타일 패션 | 박민아 | Mina Park |
| K-뷰티 & 헤어 | 강예진 | Ye-jin Kang |
| K-POP 문화 & 팬덤 | 신나래 | Na-rae Shin |
| 셀카 & 포토그래피 | 임수연 | Soo-yeon Lim |
| 서울 여행 가이드 | 오태양 | Tae-yang Oh |
| 팬 커뮤니티 & SNS | 송다은 | Da-eun Song |
| 가상 스타일 체험 | 박민아 | Mina Park |

---

## Article Body Rules

### Structure (use this order)

1. Introduction — define the subject, surface the gap between common assumption and reality, state what this article explains
2. Main heading (H2) — first major angle
3. Body paragraphs — explanation-first, list only when genuinely enumerable
4. Additional H2 sections as needed
5. Quick Summary block (3 items, factual, non-repetitive)
6. CTA link to `/[lang]/create` — one line, natural, not salesy

### Writing Standards (Google E-E-A-T)

- Each article must contain a unique perspective, analysis, or observation not found elsewhere
- No padding: do not add sentences to reach a word count target
- No keyword stuffing: target keyword appears naturally, not repeated mechanically
- Intro must do three things: (1) define the subject, (2) acknowledge the common oversimplification, (3) state what this article adds
- Use specific, concrete details over vague adjectives ("예쁘다", "유명하다", "핫하다" alone = reject)
- Korean and English articles on the same topic are NOT translations — they are written for different search intents (see KO/EN rules below)

### Keyword Rules (SEO — mandatory)

- Before writing, select one primary target keyword per language (KO and EN separately)
- Place the target keyword naturally in: (1) title, (2) first paragraph, (3) at least one H2
- No keyword stuffing — keyword appears at most 3–4 times total in the body
- No two articles within the same hub may share the same primary keyword (cannibalization prevention)
- Long-tail keywords preferred over broad terms (e.g. "경복궁 오전 사진 촬영" over "경복궁 사진")
- Record the selected keyword in the session log alongside the file path

### Internal Link Rules (SEO — mandatory)

- Every sub-article must include a link back to its hub article in the body text (not only in Quick Summary)
- Hub article's "함께 읽을 글" / "Related Guides" section must list only articles that already exist as files
- Cross-link to 1–2 related articles within the same hub where naturally relevant
- Do NOT link to articles that do not yet exist — no dead links
- Internal link anchor text must describe the destination naturally (no "여기", "click here")

### KO vs EN Search Intent

| Korean articles | English articles |
|----------------|-----------------|
| Why it became popular in Korea | What it is and why it matters in Seoul context |
| Domestic trend and social meaning | Cultural/visual meaning for international reader |
| Comparison with similar Korean areas | Background explanation unfamiliar to foreign readers |
| Visitor intent from Korean user perspective | Why international visitors seek this place |

---

## AI Content Disclosure (Google Policy — Mandatory)

Every article must end with this footer block:

```mdx
---

*This article was produced with AI assistance and reviewed for accuracy against publicly available information. Author persona represents the editorial voice for this content category.*
```

Korean version:

```mdx
---

*이 글은 AI 보조 도구를 활용하여 작성되었으며, 공개된 정보를 기반으로 사실 확인을 거쳤습니다. 저자 표기는 해당 카테고리의 편집 방향을 대표합니다.*
```

---

## Legal Rules

### 인물 및 단체명 금지
- 특정 아이돌 이름(활동명·본명 모두) 사용 금지
- 특정 그룹명 사용 금지
- 기획사 상표명 사용 금지: HYBE, SM, YG, JYP, 스타쉽, 카카오엔터 등 모든 기획사
- 팬덤명 사용 금지
- K-pop 문화 언급 시 대체 표현 사용: "대형 기획사 인근", "아이돌 인접 스트릿 스타일", "주요 레이블 사옥 주변" 등

### 저작권 금지
- 앨범 제목, 곡명, 가사 인용 금지
- 뮤직비디오·앨범 아트·공식 사진 묘사 금지 (간접 묘사 포함)
- 특정 콘서트·투어명 언급 금지
- 방송 프로그램명(서바이벌·예능 포함) 직접 언급 금지

### 상표·브랜드 사용 제한
- 패션·뷰티 브랜드는 일반 상거래 정보 맥락에서만 허용 (예: 올리브영, 무신사)
- 특정 브랜드를 특정 아이돌과 연결하는 표현 금지
- 콜라보·한정판 제품을 특정 인물과 연결하는 표현 금지

### 장소·재산 관련
- 사유지·비공개 구역 무단 접근 묘사 금지
- 공개된 장소명·지명만 사용
- 특정 인물의 거주지·자주 가는 장소로 알려진 곳을 그 인물과 연결하는 표현 금지

---

## Pre-Writing Requirement (mandatory before any article)

Before writing any article, read and internalize the following files in order:

1. `md-doc/google-seo-guide.md` — Google official SEO standards (must read first)
2. `md-doc/post-codex-command.md` — Content strategy, hub structure, and execution rules

Do not write a single line of article content until both files are read.

---

## Session Execution (6 files per session = 3 pairs)

- 3 Korean + 3 English per session (= 3 KO/EN pairs)
- Must be paired: each KO article has a corresponding EN article with the same `hreflangSlug`
- Follow the 3-stage priority order in `md-doc/post-codex-command.md` 섹션 4
  - Stage 1: Hub articles (10 locations, in order)
  - Stage 2: Sub-articles linked to each hub (see 섹션 4 mapping)
  - Stage 3: Remaining topics from `md-doc/kpop-blog-topics-300.md`
- Check `md-doc/post-codex-command.md` 섹션 3 (progress log) before starting
- Log completed files with date/time (KST) in 섹션 3 after each session

## Hub Completion Tasks (허브 1개의 모든 하위 글 완료 시 반드시 실행)

허브 글 + 해당 허브의 모든 하위 글이 완료된 직후, 글 작성 전에 아래 두 작업을 먼저 실행한다.

### 1. 내부 링크 정리
- 해당 허브의 모든 파일(허브 글 + 하위 글)을 읽는다
- 허브 글의 "함께 읽을 글" / "Related Guides"에 모든 하위 글이 포함됐는지 확인하고 누락 시 추가
- 각 하위 글 본문에 허브 글로의 역링크가 있는지 확인하고 누락 시 추가
- 존재하지 않는 파일로의 링크는 제거

### 2. 키워드 중복 확인
- 해당 허브 내 모든 글의 타깃 키워드를 목록으로 정리
- 겹치는 키워드가 있으면 더 구체적인 롱테일로 수정
- 확인 결과를 섹션 3 로그에 기록

---

## Quality Gate (check before output)

**콘텐츠 품질**
- [ ] `title` is unique and under 60 characters
- [ ] `description` is 120–155 characters and answers "why click"
- [ ] Intro defines, challenges, and promises
- [ ] No padding sentences

**키워드**
- [ ] 타깃 키워드가 title과 첫 단락에 자연스럽게 포함됐는가
- [ ] 같은 허브의 다른 글과 타깃 키워드가 겹치지 않는가

**내부 링크**
- [ ] 하위 글인 경우 허브 글로의 역링크가 본문에 포함됐는가
- [ ] 링크된 모든 URL이 실제 존재하는 파일인가 (dead link 없음)

**법적 준수**
- [ ] No specific idol/group/agency/fandom names
- [ ] No album titles, song names, or lyric quotes
- [ ] No brand-to-idol association
- [ ] No private property or personal location references

**기술 스펙**
- [ ] AI disclosure footer is present
- [ ] `hreflangSlug` matches the paired language file
- [ ] `aiGenerated: true` is set

## Character Count Verification (mandatory)

After writing each file, count the exact character length of `title` and `description` and report the numbers before finishing.

Do not estimate. Count character by character.

Required format:
```
title: [actual text] → [N]자
description: [actual text] → [N]자
```

If `description` is under 120 or over 155 characters, rewrite it and count again before submitting.
