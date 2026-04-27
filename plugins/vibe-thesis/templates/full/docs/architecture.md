# Architecture

How ThesisStudio is structured, why it's structured that way, and what to know before extending it.

For the *decisions* behind these choices, see `docs/adr/` (Architecture Decision Records).

---

## Top-level layout

```text
ThesisStudio/
├── 00_DESIGN_SYSTEM/   visual identity (tokens, schemas, compiled outputs)
├── 01_PLANNING/        proposal, outline, claims map
├── 02_RESEARCH/        raw research notes, organized by axis
├── 03_BODY/            the main writing — chapters or sections
├── 04_AGENT_SWARMS/    reusable swarm playbooks
├── 05_CITATIONS/       BibTeX library + CSL style files
├── 06_REVIEW_RESPONSES/ peer review tracking by round
├── 07_APPENDICES/      supplementary materials
├── 08_OUTPUT/          generated outputs (gitignored)
├── docs/               project docs + ADRs
├── examples/           test fixtures (CI smoke-test consumers)
├── scripts/            build, render, validation utilities
├── .claude/skills/     Claude Code skills (bootstrap, merge-authors)
├── .devcontainer/      Pandoc + LuaLaTeX + Node bundled
├── .github/workflows/  CI + release
└── .husky/             pre-commit + pre-push hooks
```

The numbered top-level dirs (`00_` – `08_`) follow the WriterStudio pattern — phase ordering visible in `ls`. Auxiliary dirs (`docs/`, `examples/`, `scripts/`, `.claude/`, `.github/`, `.devcontainer/`, `.husky/`) cluster the infrastructure together.

---

## Mode flag (`THESIS_MODE`)

`CLAUDE.md` carries a YAML block:

```yaml
THESIS_MODE: dissertation    # or article, or masters
```

The flag tells the lead writer (and `scripts/lib/thesis-mode.js`) which directories are **load-bearing** for the active project. All directories exist in every fork; the flag shifts emphasis. See `docs/adr/0001-mode-flag-architecture.md` for why this approach over alternatives.

Per-mode active-dirs map:

| Directory | dissertation | article | masters |
| --- | :-: | :-: | :-: |
| 00_DESIGN_SYSTEM | ✓ | ✓ | ✓ |
| 01_PLANNING | ✓ | ✓ | ✓ |
| 02_RESEARCH | ✓ | ✓ | ✓ |
| 03_BODY (chapters) | ✓ | — | ✓ |
| 03_BODY (sections) | — | ✓ | — |
| 04_AGENT_SWARMS | ✓ | ✓ | ✓ |
| 05_CITATIONS | ✓ | ✓ | ✓ |
| 06_REVIEW_RESPONSES | ✓ | ✓ (post-submission) | ✓ |
| 07_APPENDICES | ✓ | ✓ (supplementary) | ✓ |

Switching modes mid-project is safe — files aren't deleted, just dimmed. See `docs/troubleshooting.md` for caveats.

---

## Render pipeline

```text
03_BODY/*.md  +  05_CITATIONS/references.bib  +  00_DESIGN_SYSTEM/tokens.yaml
        │                  │                              │
        │                  │                              ▼
        │                  │                   scripts/compile-tokens.js
        │                  │                              │
        │                  │                              ▼
        │                  │                   00_DESIGN_SYSTEM/compiled/
        │                  │                   ├── tokens.tex
        │                  │                   ├── tokens.css
        │                  │                   └── tokens.json
        │                  │                              │
        ▼                  ▼                              │
       (Pandoc, mode-aware ordering, --citeproc, template=tokens.tex)
                                  │
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
        LuaLaTeX             LaTeX source          Plain markdown
            │                     │                     │
            ▼                     ▼                     ▼
   08_OUTPUT/pdf/         08_OUTPUT/latex/       08_OUTPUT/markdown/
       thesis.pdf            thesis.tex            thesis.md
       + manifest.json       + manifest.json       + manifest.json
```

Each render writes a `*.manifest.json` sidecar with: timestamp, git commit (and dirty flag), thesis mode, design-system version, citation style, tool versions, SHA-256 hash per source file consumed. Reviewers can verify exact reproducibility.

`scripts/lib/`:

- `thesis-mode.js` — parses `CLAUDE.md`, exposes `getMode()`, `getActiveDirs(mode)`, `getBodyFiles()`
- `manifest.js` — writes per-render manifests to schema
- `pandoc-runner.js` — safe wrapper around Pandoc + LuaLaTeX with explicit-array args (uses `execFile`/`spawn` with array tokens, never shell-string concatenation)

---

## Design system

`00_DESIGN_SYSTEM/tokens.yaml` is the canonical source of visual identity. `scripts/compile-tokens.js` validates against schema, then generates:

- `compiled/tokens.tex` — LaTeX preamble (fonts, colors, geometry, hyperlink styling)
- `compiled/tokens.css` — CSS custom properties (for HTML preview if you build one)
- `compiled/tokens.json` — structured form (consumed by render scripts directly)

Default tokens produce a non-embarrassing render with no edits — that's a CI smoke-test guarantee. See `docs/adr/0003-yaml-tokens-with-compile-step.md` for why this approach.

---

## Citation pipeline

`05_CITATIONS/references.bib` is the single source of truth. Citations in body markdown use Pandoc syntax: `[@key]`, `[@key1; @key2]`, `[@key, p. 45]`.

The render pipeline (`--citeproc`) resolves these against the BibTeX library using the CSL style declared in `tokens.yaml` (`citation.csl_path`). Default style is Chicago Author-Date; swap by replacing the CSL file and updating `tokens.yaml`. See `05_CITATIONS/styles/README.md` for download instructions.

`scripts/check-citations.js` walks `03_BODY/*.md`, extracts every `[@key]`, and verifies each exists in `references.bib`. Missing keys fail loudly. Runs on pre-push and on CI.

---

## Agent swarm orchestration

ThesisStudio's structural differentiator. `04_AGENT_SWARMS/` ships with three reusable playbooks:

- `lit-review-swarm.md` — 5 parallel agents, one per research axis (prior art, methodology survey, opposing positions, key authors, primary sources)
- `counter-position-swarm.md` — 3 agents finding empirical / methodological / theoretical counters to the active thesis
- `primary-source-swarm.md` — N agents (parameterized) parsing N primary sources in parallel

Workflow:

1. Pick a playbook based on what you need.
2. Copy `swarm-plan.template.md` → `swarm-plan-<descriptor>.md` and fill in the YAML frontmatter (validated against `swarm-plan.schema.json`).
3. Dispatch via Claude Code's Task tool — one Task per agent, parallel execution.
4. Run the convergence step described in the playbook.

No external orchestrator. Swarms are in-band with Claude Code. See `docs/adr/0005-task-tool-swarm-dispatch.md` for the rationale.

---

## Multi-author workflow (opt-in)

For co-authored chapters, use `03_BODY/multi-author/<chapter>/` with per-author files (`author-<name>.md`). The `merge-authors` Claude skill produces `merged.md` with HTML-comment attribution markers preserved. Render reads `merged.md` (not the per-author files).

Solo projects don't see this — the pattern is opt-in.

---

## Schema validation

`00_DESIGN_SYSTEM/schemas/`:

- `tokens.schema.json` — design tokens
- `frontmatter.schema.json` — optional body markdown frontmatter
- `swarm-plan.schema.json` — swarm dispatch plans
- `manifest.schema.json` — render manifests

`scripts/validate-schemas.js` discovers schema-typed files across the repo and validates each against its schema. Runs on pre-commit (via lint-staged on staged files), pre-push (full repo), and CI.

---

## Where to look next

- New to ThesisStudio? → `docs/getting-started.md`
- Hit an error? → `docs/troubleshooting.md`
- Want to contribute? → `CONTRIBUTING.md` and `docs/contributing-guide.md`
- Curious why a decision was made? → `docs/adr/`
