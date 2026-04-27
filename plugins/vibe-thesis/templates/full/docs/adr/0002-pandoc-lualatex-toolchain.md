# ADR 0002 — Pandoc + LuaLaTeX as the render toolchain

**Status:** Accepted

## Context

The render pipeline needs to take markdown source + BibTeX library + design system tokens and produce a citation-styled PDF (and LaTeX source for journal submission). Options considered:

- **Pandoc + LuaLaTeX** — universal converter with a modern LaTeX engine.
- **Pandoc + pdflatex** — older LaTeX engine, narrower font support, weaker Unicode.
- **Quarto** — Pandoc-based meta-tool with built-in templates.
- **Custom Node toolchain** — write everything from scratch.

## Decision

Adopted **Pandoc + LuaLaTeX**.

Pandoc is the academic-writing industry standard — citeproc handles citations elegantly via CSL files; cross-reference syntax is mature; output flexibility is unmatched. LuaLaTeX (over pdflatex) provides:

- Native UTF-8 input
- Modern font handling via `fontspec`
- Better support for non-English scripts (relevant for international authors and primary-source quotation)

Quarto adds a layer on top of Pandoc with its own opinions; for a public template, we want maximum compatibility and minimum surprise. Custom Node toolchain reinvents wheels.

## Consequences

**Easier:**

- Standard academic toolchain — users coming from Overleaf, Pandoc-based templates, or other academic Pandoc workflows have prior knowledge.
- CSL ecosystem (~10,000+ citation styles available) plugs in directly.
- Output formats trivially extend (Pandoc can also produce HTML, EPUB, ODT) — future ADRs may add these.

**Harder:**

- LuaLaTeX install is ~1.5GB+ (TeX Live medium scheme + LuaLaTeX + extras). Devcontainer mitigates by bundling.
- Pandoc + LaTeX error messages can be cryptic; troubleshooting docs in `docs/troubleshooting.md` cover the common ones.
- Tying renders to the LaTeX ecosystem means LaTeX outages or breaking changes affect us. Mitigated by pinning Pandoc and TeX Live versions in CI and the devcontainer.

The standard-toolchain wins outweigh the install footprint. Approved.
