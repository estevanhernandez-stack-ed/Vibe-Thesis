# ADR 0003 — YAML design tokens compiled at build time

**Status:** Accepted

## Context

The design system needs ONE source of truth that produces per-format styling outputs (LaTeX preamble for PDF, CSS for HTML preview, JSON for render scripts). Format options:

- **JSON tokens** — universally parseable, no comments, harder to edit by hand.
- **YAML tokens** — comments allowed, human-readable, indentation-sensitive.
- **TOML tokens** — comments + clear semantics, less common in academic ecosystems.
- **CSS variables** — native to web targets, but doesn't translate to LaTeX cleanly.
- **Per-format style files** — separate `pdf.tex`, `print.css` etc., user edits per target.

## Decision

Adopted **YAML canonical, compiled at build time** to `tokens.tex`, `tokens.css`, `tokens.json`. The compile step lives in `scripts/compile-tokens.js`.

YAML's comment support matters — design tokens benefit from inline rationale ("base font size set to 11pt because journal X requires it"). It's also Pandoc-native (Pandoc reads YAML metadata blocks), reducing impedance mismatch.

Per-format files would force users to maintain N styling sources in lockstep. The compile step from one source removes that drift entirely.

## Consequences

**Easier:**

- One file to edit when changing visual identity.
- Each consumer (LaTeX, CSS, JSON-using scripts) gets a format it can use directly.
- Schema validation on `tokens.yaml` catches typos at edit time, not at render time.

**Harder:**

- Adds a build step before any render. Mitigated by render scripts auto-running `compile:tokens` first.
- Users who want fine-grained control over the LaTeX preamble must understand the compile output (`compiled/tokens.tex`) is generated and not directly editable. Documentation in `00_DESIGN_SYSTEM/README.md` is explicit about this.

Approved.
