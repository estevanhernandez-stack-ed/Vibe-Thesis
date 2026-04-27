# 00_DESIGN_SYSTEM

The visual identity for your thesis. One source of truth (`tokens.yaml`), compiled at build time into per-format style files that the render pipeline consumes.

## Structure

| Path | Purpose |
| --- | --- |
| `tokens.yaml` | Canonical design tokens — typography, colors, spacing, code blocks, brand assets, citation style. Edit this. |
| `schemas/` | JSON Schema files validating tokens.yaml, frontmatter, swarm plans, render manifests. Don't edit unless you're extending the schema. |
| `compiled/` | Generated at build time (gitignored) — `tokens.tex` (LaTeX preamble), `tokens.css` (HTML), `tokens.json` (adapter consumption). |

## Workflow

1. Edit `tokens.yaml`.
2. Run `npm run compile:tokens` (or `npm run render:pdf` — render commands compile tokens automatically).
3. The compiled outputs feed into LaTeX preambles (PDF/LaTeX renders) and any HTML preview.

## Defaults

Ships with non-embarrassing defaults — Source Serif Pro / Source Sans Pro typography, conservative color palette, Chicago Author-Date citation style. Render the example chapter without touching this file to see what the defaults produce. Then iterate.

## Validation

`tokens.yaml` is schema-validated by `npm run validate` and pre-commit hooks. Typos fail loudly with line numbers.
