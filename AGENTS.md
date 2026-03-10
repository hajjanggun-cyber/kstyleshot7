# AGENTS.md — Repository Operating Notes

Updated At: 2026-03-10 KST

> This file is automatically read by Codex before any task.

## Purpose

- For hub post writing, editing, SEO, metadata, image, and internal-link rules, use `md-doc/post-codex-command.md` as the single source of truth.
- Do not duplicate or maintain post-specific rules in this file.

## Repository Context

- Site: `https://kstyleshot.com`
- Framework: Next.js App Router, TypeScript, `next-intl`
- Routes:
  - KO: `/ko/hub/[slug]`
  - EN: `/en/hub/[slug]`
- Content paths:
  - `content/hub/ko/[slug].mdx`
  - `content/hub/en/[slug].mdx`

## Working Rules

- Preserve the existing app structure unless the task explicitly requires architectural changes.
- Do not create dead links, broken imports, invalid MDX, or mismatched locale routes.
- When a task concerns hub posts, open `md-doc/post-codex-command.md` first and follow that document.
