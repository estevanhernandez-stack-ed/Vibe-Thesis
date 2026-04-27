# scripts/

Build, render, validation, and utility scripts. Invoked via `npm run <name>` (see `package.json` for the full list).

## Scripts (populated as the build progresses)

| Script | npm command | Purpose |
| --- | --- | --- |
| `render-pdf.js` | `npm run render:pdf` | Markdown → LaTeX → PDF via Pandoc + LuaLaTeX |
| `render-latex.js` | `npm run render:latex` | Markdown → LaTeX (journal submission) |
| `render-markdown.js` | `npm run render:markdown` | Concatenated working-draft archive |
| `compile-tokens.js` | `npm run compile:tokens` | `tokens.yaml` → `tokens.tex`, `tokens.css`, `tokens.json` |
| `validate-schemas.js` | `npm run validate` | JSON Schema validation across the repo |
| `check-citations.js` | `npm run check:citations` | Verify every `[@key]` in body markdown exists in `references.bib` |
| `export-portable.js` | `npm run export:portable` | Markdown-only zip archive — escape hatch from the toolchain |

## Shared library

`scripts/lib/` holds reusable modules — manifest writer, Pandoc runner, mode-flag parser. Render scripts import from here.

## Safety

All shell-out calls use `execFile` / `spawn` with explicit argument arrays — never `exec` with string concatenation. Avoids command-injection issues with paths or arguments containing special characters.
