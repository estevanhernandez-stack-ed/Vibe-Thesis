# Vendored brand fragment — 626 Labs design system

This directory contains a **vendored subset** of the canonical 626 Labs design system. Do not edit these files directly — they are kept in sync with the upstream source.

## Upstream

- **Repo:** https://github.com/estevanhernandez-stack-ed/626labs-design
- **Pinned version:** `v0.1.0`
- **What's vendored:** `colors_and_type.css` (foundational CSS variables — colors, type families, scale, spacing, motion, shadows/glows)

## Why vendored, not packaged

ThesisStudio is a public template meant to be forked by academic users — many of whom won't have GitHub auth configured for private package access. Vendoring the brand fragment lets a fresh fork `npm install` without authentication. 626 Labs internal repos consume the design system as a real `github:` package dependency; this template uses the same source via a curated copy.

## Sync workflow

When upstream changes you want to pull in:

```bash
# From the ThesisStudio repo root, with the design-system repo cloned as a sibling:
cp ../626labs-design/colors_and_type.css 00_DESIGN_SYSTEM/brand/colors.css
git add 00_DESIGN_SYSTEM/brand/colors.css
git commit -m "Sync brand: 626labs-design v0.X.Y"
```

Or use the upstream skill at `~/.claude/skills/626labs-design/` if you have it installed locally.

## What's NOT here

- The editorial layer (`editorial.css`, `EmojiSection.jsx`, `voice/emoji-policy.md`) — that lives in `00_DESIGN_SYSTEM/editorial/` and is ThesisStudio-specific
- UI kits (dashboard, marketing) — not relevant for thesis rendering
- Logo PNG — pull on demand from upstream if you want it on the cover page
