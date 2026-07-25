# Vibe Thesis

> **Persona:** This repo inherits **The Architect** from `~/.claude/CLAUDE.md`. No need to re-establish — just adds project context below.

Vibe Thesis is a 626Labs Claude Code plugin that scaffolds and co-authors thesis-shaped artifacts (academic dissertations, master's theses, long-form research articles, position essays). It wraps [ThesisStudio][thesisstudio] with Claude-Code-native orchestration, a voice-synthesis layer, and a self-review-tone guard. Distributed via the Anthropic plugin marketplace.

Currently **beta v0.2.x**. The single non-negotiable acceptance criterion is *install plugin → scaffold → round-trip works on first try, no manual fixups* across both Path A (offline) and Path B (`gh` template fork).

[thesisstudio]: https://github.com/estevanhernandez-stack-ed/ThesisStudio

## Tech Stack & Voice

- **Plugin runtime:** Claude Code plugin manifest (`.claude-plugin/marketplace.json` + `plugins/vibe-thesis/.claude-plugin/plugin.json`). Plugin itself has **zero npm runtime dependencies**.
- **Scaffolded-project toolchain** (in `templates/full/`, not the plugin): Pandoc 3.1.13, TeX Live (`xelatex`, `biber`, `latexmk`), Node 20+, `ajv` + `ajv-formats` for schema validation, `@retorquere/bibtex-parser` for citation lint, `husky` 9 + `lint-staged`. Fonts: JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk.
- **Verification:** Bash scripts at `scripts/` (`check-overlay-invariant.sh`, `structural-verification.sh`). Plus owed user-runtime beats tracked in `docs/VERIFICATION_BEATS_OWED.md`.
- **Brand:** Cyan `#17d4fa` + magenta `#f22f89`, always paired. Navy `#0f1f31` field. Space Grotesk display, Inter body, JetBrains Mono code/meta (uppercase + 0.12em tracking on small labels). The README banner pulls from `626labs.dev/assets/brand/plugins/`.
- **Voice (README, marketplace listing, CHANGELOG):** Builder-to-builder, second person, sentence case. No "empower / leverage / seamlessly / unlock / unleash." Em-dashes minimal; commas, periods, colons by default. No emoji in plugin file content (skill bodies, command descriptions, manifests). Tagline: *Imagine Something Else.*

## Design system

Canonical 626Labs brand spec lives at `~/.claude/skills/626labs-design/` for any public-facing surface (README, marketplace banner, eventual landing copy). Use it when touching visible plugin-distribution surface — not when editing scaffolded-project content (those projects ship their own `00_DESIGN_SYSTEM/tokens.yaml` as single source of truth via the templates payload).

## What's where

| Path | What it is |
|---|---|
| `.claude-plugin/marketplace.json` | Marketplace listing — top-level entry point Claude Code reads to discover the plugin |
| `plugins/vibe-thesis/.claude-plugin/plugin.json` | Plugin manifest — version pair must match `marketplace.json` and the git tag |
| `plugins/vibe-thesis/CLAUDE.md` | Plugin runtime instructions (read by the agent inside scaffolded sessions; different scope from this file) |
| `plugins/vibe-thesis/skills/` | Six plugin-side skills: `vibe-thesis` (orchestrator), `voice-synthesis`, `synthesis-smooth`, `synthesis-guard`, `vibe-render`, `vibe-status` |
| `plugins/vibe-thesis/commands/` | Five slash-command stubs that thinly wrap their sibling skills |
| `plugins/vibe-thesis/templates/full/` | Path A's complete templates payload (~103 files — ThesisStudio snapshot + `.gitattributes` + VIBE_THESIS_MARKER stanza) |
| `plugins/vibe-thesis/templates/overlay/` | Path B's local-additions diff (`.gitattributes` + `inject-marker.sh`) |
| `plugins/vibe-thesis/examples/demo-article/` | Bundled worked example used in round-trip confirmation |
| `plugins/vibe-thesis/docs/architecture.md` | Condensed plugin architecture (single-file ADR for distribution) |
| `docs/` | Cart cycle planning artifacts: `spec.md`, `prd.md`, `scope.md`, `checklist.md`, `reflection.md`, `cart-cycle-brief.md`, `builder-profile.md`, `VERIFICATION_BEATS_OWED.md`, `BEAT_G_MARKETPLACE_SUBMISSION.md` |
| `scripts/check-overlay-invariant.sh` | Enforces overlay/full byte-equivalence at plugin-build time |
| `scripts/structural-verification.sh` | Aggregate structural checks (manifest validity, payload integrity, skill presence) |
| `process-notes.md` | Cycle log — observations across spec/prd/scope/build/verify/reflect/iterate beats |
| `CHANGELOG.md` | Keep-a-Changelog format, semver |
| `README.md` | Public-facing install + quickstart + slash command reference |

## Plugin architecture

### Dual scaffold path

Two paths into a working scaffolded project. The orchestrator at `plugins/vibe-thesis/skills/vibe-thesis/SKILL.md` auto-detects on `gh` availability + auth state.

- **Path A — plugin-bundled.** `cp -R templates/full/. ./` into the user's empty directory. Offline-capable, version-locked to the installed plugin release. Default when `gh` is unavailable or unauthenticated.
- **Path B — `gh` template fork.** `gh repo create --template estevanhernandez-stack-ed/ThesisStudio …` + `cp -R templates/overlay/. ./` + `bash inject-marker.sh ./`. Always-fresh, network-dependent. Default when `gh` is installed and authenticated.

**Tree-equivalence invariant:** after bootstrap, both paths must produce byte-equivalent trees (modulo `.git/`, `node_modules/`, `08_OUTPUT/`). Verified at Beat D in `VERIFICATION_BEATS_OWED.md`. The weaker overlay-invariant (every overlay file byte-identical to its `full/` counterpart) is enforced at plugin-build time via `scripts/check-overlay-invariant.sh`.

### Sub-skill composition

The orchestrator dispatches to skills via the Claude Code Skill tool across two namespaces:

- **Plugin-side** (`/vibe-thesis:<name>`): `vibe-thesis`, `voice-synthesis`, `synthesis-smooth`, `synthesis-guard`, `vibe-render`, `vibe-status`. Live in `plugins/vibe-thesis/skills/<name>/SKILL.md`.
- **Project-local** (`/<name>`): `bootstrap`, `merge-authors`, `lay-translator`, `research-integrate`. Live in the user's project at `.claude/skills/<name>/SKILL.md`, lifted from ThesisStudio via the templates payload.

The plugin does not fork project-local sub-skills — they ship inside `templates/full/.claude/skills/` and remain ThesisStudio's source of truth.

### Project detection — VIBE_THESIS_MARKER

`<!-- VIBE_THESIS_MARKER: vN.M -->` HTML-comment stanza in scaffolded projects' `CLAUDE.md`. Lets the orchestrator branch between scaffold-mode (no marker → fresh project) and iterate-mode (marker present → existing project). Fallback structural detection (numbered scaffold dirs `00_DESIGN_SYSTEM` … `08_OUTPUT` AND `scripts/render-pdf.js` both present) handles users who manually deleted the marker — orchestrator asks one disambiguating question rather than re-scaffolding.

### Templates payload refresh

ThesisStudio is actively maintained; the bundled `templates/full/` snapshot drifts over time. To refresh, follow the procedure in `plugins/vibe-thesis/docs/architecture.md` § 2 — clone ThesisStudio fresh, replace `templates/full/`, re-add `.gitattributes` + VIBE_THESIS_MARKER, run `check-overlay-invariant.sh`, commit, bump minor version. **Do not edit `templates/full/` files in place** — that defeats the snapshot model.

### Verification beats owed

The Cart cycle's autonomous `/build` phase produces all file-creation work; verification beats that require user-runtime invocation, GitHub repo creation, or marketplace submission are tracked in `docs/VERIFICATION_BEATS_OWED.md`. Each beat is documented with a runnable procedure. Don't mark any beat green without empirical evidence.

### Sibling-repo hard guard

The orchestrator refuses to operate in any directory resolving to `agentic-architect-vibe` (basename or `git remote -v` check). That repo is the article-source-of-truth for the toolchain Vibe Thesis extracts; modifying it would break the article.

## Common tasks

| You want to… | Path / command |
|---|---|
| Bump plugin version | Edit `plugins/vibe-thesis/.claude-plugin/plugin.json` AND `CHANGELOG.md`; tag with matching git tag |
| Refresh the ThesisStudio templates payload | Follow `plugins/vibe-thesis/docs/architecture.md` § 2 (Refresh procedure) |
| Verify overlay/full byte-equivalence | `bash scripts/check-overlay-invariant.sh` |
| Run aggregate structural checks | `bash scripts/structural-verification.sh` |
| Add a plugin-side skill | New dir under `plugins/vibe-thesis/skills/<name>/SKILL.md`; reference from orchestrator if dispatched |
| Add a project-local skill | New dir under `plugins/vibe-thesis/templates/full/.claude/skills/<name>/SKILL.md` (NOT plugin-side `skills/`) |
| Test a scaffold without polluting work | Fresh dir under `c:/tmp/`, install plugin from `file:///c/Users/estev/Projects/vibe-thesis` |
| Inspect cycle history / decisions | `docs/reflection.md`, `process-notes.md`, `CHANGELOG.md` |

## Conventions

- **Commits:** Conventional types — `feat`, `fix`, `docs`, `refactor`, `chore`. Plus cycle-flavored prefixes the repo already uses: `Complete step N: <title>` for /build phase items, `Beat <X> complete: <note>` for verification beats, `Iteration N.M: <note>` for /iterate sub-items, `vN.M.M — <release note>` for release commits.
- **Style:** Markdown for skills/commands/docs (no frontmatter unless the runtime needs it). Bash scripts under `scripts/` use `set -euo pipefail`. JSON manifests follow Claude Code plugin spec exactly.
- **File rules:** `templates/full/` is a snapshot — read-only via the documented refresh procedure. `templates/overlay/` is constrained by the byte-equivalence invariant to `templates/full/`. `plugins/vibe-thesis/.claude-plugin/plugin.json` version, `.claude-plugin/marketplace.json` (no version field, but reads through), and the git tag must move in lockstep.
- **Manifest pair drift = silent install confusion.** Don't bump one without the other.

## Decisions log

Significant decisions log to the **626Labs Dashboard** via MCP (`mcp__626Labs__manage_decisions log`). Tag with the bound project ID. The bar: *would future-you (or someone asking "why this approach?") want to know this in 3–6 months?*

Especially:

- **Architecture choices** — wrap-vs-fork (ThesisStudio), templates-payload-vs-runtime-fetch, plugin-side-vs-project-local skill placement
- **Scaffold path tradeoffs** — anything that affects Path A / Path B parity or the tree-equivalence invariant
- **Voice / guard layer scope** — what counts as "self-review tone," what's strict-mode vs standard
- **Templates payload refresh** — when ThesisStudio upstream changes ripple in (and what was cherry-picked vs taken whole)
- **Marketplace / distribution decisions** — submission timing, listing copy changes, version-bump policy
- **Sibling-repo coordination** — anything touching `agentic-architect-vibe` boundaries or other Vibe-* plugins

Skip the routine: ran scripts, fixed typo, renamed a variable, drafted a section.

If unbound (no 626Labs project): tag with the repo name in the description and set `projectId: null`.

## What NOT to do

- **Don't operate inside `agentic-architect-vibe`.** Sibling-repo hard guard. That repo is the article-source-of-truth for the toolchain this plugin extracts; modifying it would break the article. The orchestrator enforces this at runtime; honor it at coding time too.
- **Don't fork project-local sub-skills into plugin-side `skills/`.** `bootstrap`, `merge-authors`, `lay-translator`, `research-integrate` belong in `templates/full/.claude/skills/`. Forking them to `plugins/vibe-thesis/skills/` breaks the wrap-vs-fork architecture and creates two sources of truth.
- **Don't edit `templates/full/` files in place.** Use the refresh procedure in `docs/architecture.md` § 2. In-place edits silently drift the bundled snapshot from ThesisStudio upstream.
- **Don't touch `templates/overlay/` without re-running `scripts/check-overlay-invariant.sh`.** Every overlay file must remain byte-identical to its `templates/full/` counterpart (modulo runtime scripts like `inject-marker.sh`). The invariant is the contract that keeps Path A and Path B tree-equivalent.
- **Don't drift the manifest version pair.** `.claude-plugin/marketplace.json` and `plugins/vibe-thesis/.claude-plugin/plugin.json` must match each other and the git tag. Drift = users install a version that disagrees with itself.
- **Don't silently mark a scaffold round-trip success when `npm run render:pdf` fails.** Single non-negotiable acceptance criterion. Surface failures honestly; don't claim Beat B/C/D green without evidence.
- **Don't snapshot decisions or beat-state into this file.** Verification beats live in `docs/VERIFICATION_BEATS_OWED.md`; decisions log to the Dashboard. CLAUDE.md describes how to *find* state — never enumerates current values, which rot.

## Repo-local automation

- **`.claude/agents/templates-refresh-reviewer.md`** — verifies a `templates/full/` refresh from ThesisStudio is structurally correct (marker, `.gitattributes`, overlay invariant, sub-skill + script + schema presence, diff summary). Dispatch after running the refresh procedure.
- **`.claude/agents/manifest-pair-validator.md`** — confirms `plugin.json` + `marketplace.json` + git tag + CHANGELOG agree before tagging a release.
- **`.claude/agents/sibling-repo-guard-tester.md`** — exercises the orchestrator's `agentic-architect-vibe` refusal path via static checks + synthetic fixtures. Dispatch after orchestrator edits or pre-release.
- **`.claude/hooks/block-templates-full-edits.sh`** + `.claude/settings.json` — PreToolUse hook that refuses Write/Edit/MultiEdit on `plugins/vibe-thesis/templates/full/**` unless `VIBE_THESIS_TEMPLATES_REFRESH=1` is set in the shell environment. Codifies the "don't edit in place" rule as automation.

## References

- Plugin architecture: `plugins/vibe-thesis/docs/architecture.md`
- Plugin runtime instructions: `plugins/vibe-thesis/CLAUDE.md`
- Cycle planning artifacts: `docs/spec.md`, `docs/prd.md`, `docs/scope.md`, `docs/checklist.md`, `docs/cart-cycle-brief.md`, `docs/builder-profile.md`
- Cycle reflection + verification: `docs/reflection.md`, `docs/VERIFICATION_BEATS_OWED.md`, `process-notes.md`
- Marketplace submission record: `docs/BEAT_G_MARKETPLACE_SUBMISSION.md`
- Upstream template: [ThesisStudio][thesisstudio]

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **vibe-thesis** (584 symbols, 697 relationships, 2 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/vibe-thesis/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/vibe-thesis/context` | Codebase overview, check index freshness |
| `gitnexus://repo/vibe-thesis/clusters` | All functional areas |
| `gitnexus://repo/vibe-thesis/processes` | All execution flows |
| `gitnexus://repo/vibe-thesis/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
