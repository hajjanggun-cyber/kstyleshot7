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

- Do NOT use specific idol names, group names, or agency trademarks (HYBE, SM, YG, JYP, etc.)
- Do NOT describe unauthorized access to private property
- Use style concepts, cultural trends, and public place names only
- When referencing K-pop culture, use descriptive terms: "major label HQ areas", "idol-adjacent street style", etc.

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
- Follow the 3-stage priority order in `md-doc/post-codex-command.md` Section 10
  - Stage 1: Hub articles (10 locations, in order)
  - Stage 2: Sub-articles linked to each hub (see Section 10 mapping)
  - Stage 3: Remaining topics from `md-doc/kpop-blog-topics-300.md`
- Check `md-doc/post-codex-command.md` Section 15 (progress log) before starting
- Log completed files with date/time (KST) in Section 15 after each session

---

## Quality Gate (check before output)

- [ ] `title` is unique and under 60 characters
- [ ] `description` is 120–155 characters and answers "why click"
- [ ] Intro defines, challenges, and promises
- [ ] No padding sentences
- [ ] No specific idol/group/agency names
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
