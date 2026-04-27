# Vibe Thesis — Architecture

Condensed architecture doc for the v0.1 plugin. Read this for a gestalt
view of how the pieces fit together; the original five ADRs from
[ThesisStudio][thesisstudio]'s `docs/adr/` are still in the templates
payload (`templates/full/docs/adr/0001…0005.md`) for users who want the
decision history.

[thesisstudio]: https://github.com/estevanhernandez-stack-ed/ThesisStudio

## 1. Overview

Vibe Thesis is a Claude Code plugin that wraps [ThesisStudio][thesisstudio]
with Claude-Code-native orchestration: dual scaffold paths, an author-voice
interview, and a self-review-tone guard. It does not fork ThesisStudio.

ThesisStudio remains the upstream source of truth for:

- The templates payload (numbered scaffold, design system, render scripts,
  schemas, dev container, CI workflows, hooks).
- The four content sub-skills (`bootstrap`, `merge-authors`,
  `lay-translator`, `research-integrate`).
- The render pipeline (Pandoc + xelatex + biber + latexmk).

Vibe Thesis adds:

- An orchestrator skill that bridges natural-language scaffold intent to the
  appropriate path (Path A or Path B) and handles the round-trip
  confirmation.
- Two new plugin-side skills (`voice-synthesis`, `synthesis-guard`) that
  layer on top of ThesisStudio's persona pillars.
- Two Claude-Code-native slash commands (`/vibe-thesis:vibe-render`,
  `/vibe-thesis:vibe-status`) wrapping `npm run render:*`.
- A `<!-- VIBE_THESIS_MARKER: vN.M -->` stanza in scaffolded projects'
  `CLAUDE.md` so the orchestrator can branch between scaffold-mode and
  iterate-mode.
- The one local addition not yet in ThesisStudio: a `.gitattributes` file
  with `* text=auto eol=lf` (the CRLF-trap fix for Windows-side VS Code
  users opening a dev container).

## 2. Templates payload

Two subdirectories under `plugins/vibe-thesis/templates/`:

- **`full/`** — Path A's complete payload. ThesisStudio's `template/main`
  contents (102 files) + `.gitattributes` + the `VIBE_THESIS_MARKER` stanza
  appended to `CLAUDE.md`. ~103 files total.
- **`overlay/`** — Path B's local-additions diff. Just `.gitattributes`
  (byte-identical to the one in `full/`) + `inject-marker.sh` (a runtime
  script that appends the marker stanza to a `gh`-spawned tree's CLAUDE.md).

### Refresh procedure

ThesisStudio is actively maintained; the bundled `templates/full/` snapshot
will drift over time. To refresh:

1. `gh repo clone estevanhernandez-stack-ed/ThesisStudio /tmp/thesisstudio-refresh`.
2. `rm -rf plugins/vibe-thesis/templates/full && cp -R /tmp/thesisstudio-refresh plugins/vibe-thesis/templates/full && rm -rf plugins/vibe-thesis/templates/full/.git`.
3. Re-add `.gitattributes` and append the `VIBE_THESIS_MARKER` stanza
   (these are the only deltas).
4. Run `bash scripts/check-overlay-invariant.sh` to confirm overlay/full
   parity.
5. Commit + bump plugin minor version.

Tracked as Step 2 backlog: a future `/vibe-thesis-refresh-templates` slash
command would automate this.

## 3. Render pipeline

Lifted verbatim from ThesisStudio. Lives in `templates/full/scripts/`:

- `render-pdf.js` → `render-latex.js` → `lib/pandoc-runner.js` (subprocess
  pandoc) + `lib/thesis-mode.js` (reads CLAUDE.md `THESIS_MODE`) +
  `lib/manifest.js` (writes `*.manifest.json`).
- `render-html.js` — Pandoc + editorial CSS template.
- `render-markdown.js` — Pandoc passthrough.
- `compile-tokens.js` — `tokens.yaml` → `tokens.tex` + `tokens.css` +
  `tokens.json` (gitignored compiled outputs).
- `validate-schemas.js` — ajv validation across frontmatter, manifest,
  swarm-plan, tokens, lay-manifest schemas.
- `check-citations.js` — `@retorquere/bibtex-parser` + body scan; lints
  `[@key]` refs against `references.bib`.

`/vibe-thesis:vibe-render` wraps these with pre-step orchestration
(`compile-tokens` + `check-citations` first), failure surfacing with a
diagnostic lookup table, and optional `--guard` integration.

## 4. Design system single-source-of-truth

`00_DESIGN_SYSTEM/tokens.yaml` is the single source for both LaTeX `xcolor`
and CSS variables. `compile-tokens.js` produces the LaTeX and CSS variants
deterministically. The brand layer at `00_DESIGN_SYSTEM/brand/` is
overridable per project; the editorial layer at
`00_DESIGN_SYSTEM/editorial/` is shared and tracks ThesisStudio.

## 5. Mode flag plumbing

`CLAUDE.md` carries a `THESIS_MODE: dissertation | article | masters`
field. `scripts/lib/thesis-mode.js` reads it at render time and routes to
the correct `03_BODY/` shape:

- `dissertation` → chapters in `03_BODY/<chapter>/*.md`.
- `article` → flat sections in `03_BODY/*.md`.
- `masters` → chapters with lighter structure than dissertation.

**Mode is shift-emphasis-only.** Switching modes never deletes files; it
only changes which directories are load-bearing for the active project.
ADR `0001-mode-flag-architecture.md` (in templates/full/docs/adr/) has the
full rationale.

## 6. Sub-skill composition

The orchestrator dispatches to skills via the Claude Code Skill tool. Two
namespaces:

- **Plugin-side** (`/vibe-thesis:<name>`): `voice-synthesis`,
  `synthesis-guard`, `vibe-render`, `vibe-status`. Live in
  `plugins/vibe-thesis/skills/<name>/SKILL.md`.
- **Project-local** (`/<name>`): `bootstrap`, `merge-authors`,
  `lay-translator`, `research-integrate`. Live in the user's project at
  `.claude/skills/<name>/SKILL.md` (lifted from ThesisStudio via templates
  payload).

The orchestrator passes structured context (`{ project_dir, scaffold_path,
... }`) to dispatched skills. No plugin-internal API beyond the standard
Skill tool — pattern-matched against the working `vibe-cartographer` plugin.

## 7. Dual scaffold path

Two paths into a working scaffolded project:

- **Path A — plugin-bundled.** `cp -R templates/full/. ./`. Offline-capable,
  version-locked to the installed plugin release. Default when `gh` is
  unavailable or unauthenticated.
- **Path B — `gh` template fork.** `gh repo create --template
  estevanhernandez-stack-ed/ThesisStudio <name> --private --clone` + `cp -R
  templates/overlay/. ./` + `bash inject-marker.sh ./`. Always-fresh,
  network-dependent. Default when `gh` is installed and authenticated.

**Tradeoff:** Path A is reproducible (the bundled snapshot won't change
between installs of the same plugin version); Path B is fresh (the user
gets the latest ThesisStudio template plus a real GitHub remote at minute
zero).

**Tree-equivalence invariant.** After bootstrap completes on both paths,
the resulting trees must be byte-equivalent (modulo `.git/` which is
Path B-only). Enforced at the structural verification beat via:

```bash
diff -r --exclude='.git' --exclude='node_modules' --exclude='08_OUTPUT' \
     /tmp/vibe-thesis-pathA-test /tmp/vibe-thesis-pathB-test
```

The overlay-invariant check script (`scripts/check-overlay-invariant.sh`)
enforces a weaker invariant at plugin-build time: every file in
`templates/overlay/` must be byte-identical to its `templates/full/`
counterpart (modulo runtime scripts like `inject-marker.sh`).

## 8. Project detection marker

`<!-- VIBE_THESIS_MARKER: vN.M -->` HTML-comment stanza in `CLAUDE.md`.
Lightweight — no new file, invisible in rendered markdown, trivially
grep-able, version-embedded for future `/vibe-thesis-update` (Step 2
backlog).

**Fallback structural detection** (when the user manually deletes the
marker): the orchestrator checks for presence of the numbered scaffold dirs
(`00_DESIGN_SYSTEM`, `01_PLANNING`, ..., `08_OUTPUT`) AND
`scripts/render-pdf.js`. If both present, asks one disambiguating
question rather than re-scaffolding.

## 9. Voice synthesis layer

A plugin-side addition not present in ThesisStudio. Runs after the
project-local `/bootstrap` interview captures the three persona pillars
(default: Sourced Specificity, Disciplined Argument, Honest Limits). Voice
synthesis adds a fourth layer underneath:

- **Timeless author voices** — 2-4 well-known authors whose prose-style
  anchors the LeadWriter persona.
- **Current field experts** — 2-4 contemporary voices in the topic-specific
  discourse.
- **Synthesis ratio** — `timeless-anchored` | `expert-anchored` | `even`.

Output is appended to `CLAUDE.md` as a `## VOICE SYNTHESIS` block. The
LeadWriter persona reads it at drafting time. Idempotent — re-runnable to
revise.

## 10. Synthesis guard layer

A plugin-side lint pass over `03_BODY/`. Catches the dominant failure mode
of LLM-assisted academic writing: **the work praising itself**. Standard
patterns: inflationary language (*groundbreaking, comprehensive, novel*),
self-praise framings (*we make N contributions, to the best of our
knowledge*). Strict-mode patterns: defensive over-qualification,
conclusions that re-assert importance.

Makes ThesisStudio's third pillar default (Honest Limits) enforceable
rather than aspirational. Advisory — doesn't auto-fix. Integrated with
`/vibe-thesis:vibe-render --guard` for pre-render gating.

## 11. Sibling-repo hard guard

The orchestrator refuses to operate in any directory that resolves to
`agentic-architect-vibe` (via path basename or `git remote -v` check). That
repo is the article-source-of-truth for the toolchain Vibe Thesis extracts;
modifying it would break the article. Build-time discipline encoded as a
runtime guard.

## What's not here (deferred to v0.2+)

- `/vibe-thesis-refresh-templates` to automate the templates-full refresh.
- `/vibe-thesis-update` to diff plugin's templates payload against
  scaffolded projects and offer structured merges.
- Mode taxonomy generalization (`THESIS_MODE` → `VIBE_MODE` with
  blog/talk/manual modes).
- Standalone CLI surface for CI / headless renders.
- Cross-plugin coordination with Vibe Doc / Vibe Test / Vibe Cartographer.
