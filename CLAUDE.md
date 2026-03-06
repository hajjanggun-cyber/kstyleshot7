# Kstyleshot — Claude Code Instructions

## MDX Content Rules

When creating or editing MDX posts under `content/hub/`:

- **No author attribution.** Do NOT add `authorName`, `authorRole` frontmatter fields, and do NOT render author name/role/avatar anywhere in the post UI.
- **No AI disclaimer.** Do NOT add any italicized disclaimer about AI assistance (e.g. "이 글은 AI 보조 도구를 활용하여..." or "This article was produced with AI assistance...") to the body of any post.
- Posts speak for themselves. Quality content only — no meta-disclosure inside the post.

## Create Flow

- `allowDemoFlow = true` is intentional — payment gate is bypassed during development. Do not revert this without explicit instruction.
- Flow order: upload → hair → outfit → location → done

## i18n

- Default locale is `ko` (Korean). `localeDetection: false` — do not re-enable browser language detection.
- All create flow pages must use `useTranslations` keys; no hardcoded English or Korean strings in components.
- Translation files: `messages/ko.json` and `messages/en.json`

## Routing

- `/[lang]/create` redirects to `/[lang]/create/upload` — the old create landing page is removed.
- Middleware is in `proxy.ts` only — there is no `middleware.ts`.
