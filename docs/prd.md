# Vibe Thesis — Product Requirements

> **Inputs:** [`scope.md`](scope.md) + [`cart-cycle-brief.md`](cart-cycle-brief.md) + [`builder-profile.md`](builder-profile.md) + the originating handoff sketch [`../VIBE_THESIS_HANDOFF.md`](../VIBE_THESIS_HANDOFF.md). Generated 2026-04-26 19:11 CST in `'fully-autonomous'` autonomy mode; no in-conversation interview turn. The cart-cycle-brief's `/prd` stance pre-statement (0 deepening rounds, single non-negotiable acceptance criterion drives the doc, scope-creep guard refuses v0.2 sub-skills + additional slash commands + mode-taxonomy generalization + standalone CLI + marketplace polish + customization granularity + `/vibe-update`) is canonical.

## Problem Statement

A builder wanting to write a thesis-grade artifact (academic dissertation, master's thesis, long-form research article, agentic-architect-class position essay) and using Claude Code as their drafting partner currently has to fork [ThesisStudio](https://github.com/estevanhernandez-stack-ed/ThesisStudio) by hand, customize the bootstrap output themselves, and trip every dev-container failure mode Estevan already tripped (font install, CRLF normalization, persistent `~/.claude` volume mount). That friction wall is exactly the kind of thing that stops adoption — most builders won't push through it, even if the toolchain they'd land on is genuinely good. **Vibe Thesis collapses the friction wall to a single plugin-install + natural-language scaffold step**, with the dev-container fixes baked in so the user can spend their first 30 minutes writing instead of configuring.

## User Stories

> Stories grouped into epics. Epic names are stable addresses for `/spec` and `/checklist` (do not rename without revising downstream artifacts).
> "Builder" = the human user installing and using Vibe Thesis. Acceptance criteria are testable by looking at observable behavior in a fresh test environment.

### Epic 1: Install & Scaffold

- **As a builder**, I want to install Vibe Thesis from the Anthropic plugin marketplace (or via raw git URL fallback) so that I can use it inside Claude Code without manual setup.
  - [ ] Plugin appears in the marketplace listing with a clear name, one-line description, install button.
  - [ ] After install, Claude Code recognizes the orchestrator skill `vibe-thesis` and the slash commands `/vibe-render`, `/vibe-status` without restart.
  - [ ] Raw-git-URL install path documented in the README for users who can't reach the marketplace.
  - [ ] Edge case: install in a Claude Code version older than the plugin manifest's required version surfaces a clear "upgrade Claude Code to vX.Y" message rather than failing silently.

- **As a builder in a fresh empty directory**, I want to say "scaffold a vibe thesis project for me" (or any natural-language equivalent) and have the orchestrator skill source the workspace, run bootstrap, install the toolchain, and confirm the round-trip — all without me typing slash commands.
  - [ ] The orchestrator picks up natural-language scaffold intent (e.g., "I want to write a thesis on X", "set up a vibe thesis project", "scaffold a new dissertation").
  - [ ] Scaffold mode runs to completion in ~30 minutes on a typical laptop with a working internet connection (the time budget includes toolchain install — the *plugin's* work is sub-minute).
  - [ ] At completion, the user can run `npm run render:pdf` and produce a publishable PDF from the bundled example without touching any config.
  - [ ] Edge case: directory is non-empty. Orchestrator refuses to overwrite; suggests creating a fresh subdirectory and rerunning. Non-dotfiles trigger the warning; dotfiles like `.git` or `.claude` do not.
  - [ ] Edge case: user invokes the orchestrator in an already-scaffolded directory. Orchestrator detects the marker (per Epic 9) and switches to iterate mode rather than re-scaffolding.

- **As a builder with `gh` installed and authenticated**, I want the scaffold to spawn a real GitHub repo from the [ThesisStudio](https://github.com/estevanhernandez-stack-ed/ThesisStudio) template (Path B) so my project has a remote from minute zero.
  - [ ] Orchestrator detects `gh --version` succeeds AND `gh auth status` reports authenticated; if both, defaults to Path B.
  - [ ] Path B runs `gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>` (or equivalent API call), clones the result into the working directory, and applies the local-additions overlay (the local-contributions diff from the originating handoff §2 — install-fonts.sh, devcontainer hardening, .gitattributes LF, persistent ~/.claude volume, lay-manifest schema for v0.2-readiness).
  - [ ] Builder can override the auto-detected default with a one-line natural-language preference ("use the local templates instead" or "use the github template").
  - [ ] Edge case: GitHub template repo's identity has drifted from the plugin's templates payload. Orchestrator surfaces a one-line warning ("ThesisStudio is N commits ahead of the plugin's bundled templates — using template anyway") and proceeds, citing the local-additions overlay as the parity mechanism.
  - [ ] Edge case: `gh repo create` fails (rate-limit, name collision, network). Orchestrator falls back to Path A automatically and surfaces a one-line note.

- **As a builder without `gh` (or with `gh` un-authenticated)**, I want the scaffold to use the plugin-bundled templates payload (Path A) so I can work offline or without GitHub auth.
  - [ ] Orchestrator detects `gh` is unavailable or unauthenticated; defaults to Path A without prompting.
  - [ ] Path A copies the plugin's `templates/` payload into the working directory verbatim.
  - [ ] Path A produces a tree byte-equivalent to Path B post-bootstrap (modulo the GitHub remote attached in Path B). The structural verification beat (Epic 8) confirms this equivalence.
  - [ ] Edge case: plugin-bundled templates payload is missing or corrupted (install was incomplete). Orchestrator surfaces a clear "reinstall vibe-thesis" message rather than scaffolding a broken tree.

### Epic 2: Bootstrap Identity

- **As a builder**, I want the orchestrator to interview me for project identity (title, author, mode = dissertation | article | masters) and rewrite the placeholders across CLAUDE.md, README.md, LICENSE, and package.json so I don't have to find-and-replace by hand.
  - [ ] Bootstrap asks for project title, primary author name, mode selection (one at a time, free-form for title/author, three-option for mode).
  - [ ] All literal occurrences of "ThesisStudio", "{{PROJECT_TITLE}}", "{{AUTHOR_NAME}}", and "{{THESIS_MODE}}" placeholders in CLAUDE.md, README.md, LICENSE, package.json, and `00_DESIGN_SYSTEM/brand/` are rewritten to the user's values.
  - [ ] After bootstrap, no instance of "ThesisStudio" remains anywhere in the scaffolded tree (the plugin's name does not leak into the user's project identity — invariant).
  - [ ] Bootstrap runs identically whether the user took Path A or Path B (same questions, same rewrites, same output).
  - [ ] Edge case: user declines to provide an author name. Bootstrap accepts an empty string and writes a clear placeholder ("[Author TBD]") that the user can find later.
  - [ ] Edge case: user supplies a title with characters that would break LaTeX or Pandoc (`%`, `&`, `$`, `\`). Bootstrap escapes them in the title-rewrite pass for files that go through the render pipeline; preserves them verbatim in plain markdown / README.

- **As a builder**, I want the THESIS_MODE flag set in CLAUDE.md to shift which body-shape the render pipeline expects, so I don't have to manually configure the renderer for my chosen mode.
  - [ ] CLAUDE.md gets a clearly-marked `THESIS_MODE: <value>` block after bootstrap.
  - [ ] `scripts/lib/thesis-mode.js` reads the flag at render time and routes to the correct `03_BODY/` shape (chapters for dissertation/masters, sections for article).
  - [ ] Mode flag is shift-emphasis-only — never deletes files. Switching mode after scaffold doesn't lose content.
  - [ ] Edge case: user manually edits the mode flag to an unsupported value. Render pipeline surfaces a clear "supported modes are dissertation | article | masters" error rather than producing garbled output.

### Epic 3: Toolchain Setup

- **As a builder**, I want to choose between dev container and native install for the toolchain (Pandoc, texlive, fonts) so I can use my preferred environment.
  - [ ] After bootstrap, orchestrator asks one question: "Use the dev container (recommended for first-time setup, requires Docker) or install natively (faster on subsequent runs, requires you to install Pandoc + texlive + fonts yourself)?"
  - [ ] If dev container chosen, orchestrator confirms Docker is running; if native chosen, orchestrator runs a quick check (`pandoc --version`, `xelatex --version`, etc.) and reports what's missing for the user to install.
  - [ ] Both paths land at a working `npm run render:pdf` against the bundled example.
  - [ ] Dev container path includes the three hard-won fixes baked in (Epic 4).
  - [ ] Edge case: Docker not installed and user picked dev container. Orchestrator surfaces install instructions for Docker Desktop / Docker Engine for the user's OS.
  - [ ] Edge case: native install path on a system missing texlive (Windows-without-WSL is the primary risk). Orchestrator detects the gap, recommends switching to dev container path, and offers to do so without re-running scaffold.

### Epic 4: Dev Container with Hard-Won Fixes

- **As a builder using the dev container**, I want the three known failure modes (font install, CRLF on Windows, persistent ~/.claude volume) pre-fixed so I don't trip them.
  - [ ] `install-fonts.sh` script ships in `.devcontainer/`, installs JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk from pinned GitHub releases, and runs `fc-cache -f`.
  - [ ] `.gitattributes` ships with `* text=auto eol=lf` (or equivalent line-normalization rule) at the repo root.
  - [ ] `devcontainer.json` mounts `~/.claude` as a persistent volume so Claude Code config survives container rebuilds.
  - [ ] Container builds successfully on the first `Reopen in Container` action with no manual intervention.
  - [ ] Edge case: a font GitHub release has been deleted or moved. `install-fonts.sh` surfaces a clear error naming the missing release rather than silently producing a container without fonts (which would fail at PDF render with a cryptic LaTeX error).

### Epic 5: Render Pipeline (`/vibe-render`)

- **As a builder**, I want to say "render the PDF" (or invoke `/vibe-render pdf`) and get a publishable PDF without remembering `npm run render:pdf`.
  - [ ] `/vibe-render` slash command accepts an optional argument (`pdf` | `html` | `md` | `all`, default `pdf`).
  - [ ] Without the slash command, the orchestrator skill bridges natural-language render intent ("render the PDF", "give me the HTML preview", "produce all formats") to the right `npm run render:*` invocation.
  - [ ] PDF output lives in `08_OUTPUT/pdf/`, HTML in `08_OUTPUT/html/`, markdown in `08_OUTPUT/markdown/`. Each output has a sibling `.manifest.json` with source-commit hash, render timestamp, and design-token-snapshot fingerprint.
  - [ ] Edge case: `03_BODY/` is empty (just-scaffolded, no content yet). Render pipeline produces a placeholder PDF showing the cover page and an empty body, rather than failing — confirms the round-trip works on first scaffold.
  - [ ] Edge case: design-token edit means the compiled tokens are stale. `compile-tokens.js` runs as a pre-step to render automatically.
  - [ ] Edge case: a citation `[@key]` references a missing bibtex key. `check-citations.js` runs as a pre-step and surfaces the missing keys in a clear list rather than producing a PDF with `[Citation Not Found]` markers.

- **As a builder**, I want render to confirm the round-trip works end-to-end on first scaffold (before I write any content) so I know the install is healthy.
  - [ ] After scaffold mode completes, orchestrator runs `npm run render:pdf` against the bundled example article in `examples/` and confirms a PDF lands in `08_OUTPUT/pdf/example.pdf`.
  - [ ] Round-trip success message: "✓ Plugin installed, scaffold complete, render pipeline verified. You can start writing in `03_BODY/`."
  - [ ] Round-trip failure: orchestrator surfaces the failing command's output (Pandoc / xelatex stderr) and points to the most likely cause (missing font, missing tex package, broken bibtex). Does NOT silently mark scaffold-complete with a broken pipeline.

### Epic 6: Project Status (`/vibe-status`)

- **As a builder**, I want to ask "what's the state of my project?" and get a quick read on which planning docs exist, which body sections have content, claim-coverage status, and lay-sync status (when v0.2 ships lay-translator).
  - [ ] `/vibe-status` slash command takes no arguments.
  - [ ] Output is a one-screen summary: project title + mode + planning-docs presence (proposal / outline / claim-map ✓ or — for each), body-section content counts (e.g., "4 of 8 chapters have content"), claim-coverage (count of claims in claims-map.md vs. count referenced in body), citations check (count of `[@key]`s in body vs. count of unique keys in references.bib), and last render timestamp from manifest.
  - [ ] Edge case: project is just-scaffolded with no content. Status shows zeros and reasonable next-step suggestions ("write your proposal in `01_PLANNING/proposal.md`").
  - [ ] Edge case: claim-coverage check finds claims referenced in body but not in claim-map. Surface the orphans clearly.
  - [ ] Edge case: lay-sync is in v0.2-territory; v0.1 status output should show "lay-sync: not enabled in v0.1" rather than misleading omission.

### Epic 7: Iterate Mode (orchestrator coaching)

- **As a builder past first scaffold**, I want the orchestrator to coach me through whichever phase I'm in (planning → research → drafting → review → translation) by asking the next-most-useful question and proposing the next-most-useful action.
  - [ ] Orchestrator detects the project's current phase from artifact state (no proposal = planning phase; proposal but no outline = still planning; outline + body content = drafting; render manifest exists = review-or-translation).
  - [ ] At each invocation in iterate mode, orchestrator opens with a one-sentence read of project state ("looks like you've got the proposal locked and you're working on the outline — want to keep going on the outline, or pivot?") and an open-ended question.
  - [ ] Orchestrator dispatches sub-skills at natural moments: "we have multiple authors" → `merge-authors` (Epic 8); "let's translate this for a general audience" → `lay-translator` (deferred to v0.2).
  - [ ] Edge case: user invokes orchestrator from a directory that *looks* like a Vibe Thesis project but lacks the marker (Epic 9). Orchestrator asks one disambiguating question rather than assuming.
  - [ ] Edge case: user asks for something the orchestrator can't bridge (e.g., "deploy this to my university's submission portal"). Orchestrator surfaces the limit clearly rather than fabricating a workflow.

### Epic 8: Multi-Author Merge (`merge-authors`)

- **As a builder collaborating with co-authors**, I want to say "merge our drafts together" and have the orchestrator dispatch the `merge-authors` sub-skill to braid `03_BODY/multi-author/<chapter>/author-*.md` files into a single `merged.md`.
  - [ ] `merge-authors` sub-skill ships in v0.1 (battle-tested in source repo, low-cost lift).
  - [ ] Orchestrator bridges natural-language merge intent to the sub-skill.
  - [ ] Sub-skill reads all `author-*.md` files in the chapter directory and produces a `merged.md` in the same directory.
  - [ ] Merge output preserves attribution (which author wrote which paragraph) in markdown comments so the merged draft can be unwound if needed.
  - [ ] Edge case: chapter directory has only one author file. Sub-skill copies it to `merged.md` with a one-line note rather than failing.

### Epic 9: Project Detection Marker

- **As Claude Code (the orchestrator)**, I need a reliable way to detect whether the current directory is a Vibe Thesis project so the orchestrator can branch between scaffold-mode and iterate-mode without prompting on every invocation.
  - [ ] Marker mechanism resolved at `/spec` time per cycle brief §6 Q3. Working assumption: a stanza in CLAUDE.md (e.g., a `<!-- VIBE_THESIS_MARKER: vN.M -->` HTML comment) is the lightest-touch option; alternative is a top-level `vibe-thesis.yaml` file. /spec picks one and justifies.
  - [ ] Marker survives Path A and Path B scaffold paths identically.
  - [ ] Marker includes the plugin version that scaffolded the project (for future `/vibe-update` work in Step 2 backlog).
  - [ ] Edge case: user manually deletes the marker. Orchestrator falls back to a structural detection (numbered scaffold dirs present?) and asks one disambiguating question.

### Epic 10: Worked Example

- **As a builder**, I want a 3-page demo article bundled in `examples/` that round-trips through the whole pipeline so I can see what "done" looks like before writing my own.
  - [ ] Bundled example lives in `examples/demo-article/` and contains: a complete `01_PLANNING/proposal.md`, `01_PLANNING/outline.md`, `01_PLANNING/claims-map.md`, populated `03_BODY/` (3 short sections), populated `05_CITATIONS/references.bib` with 3-5 real entries, and pre-rendered output in `08_OUTPUT/pdf/example.pdf` (committed for diff-comparison).
  - [ ] The example renders cleanly via `npm run render:pdf` from a freshly-scaffolded project that copied `examples/demo-article/` into the numbered scaffold.
  - [ ] The example's content is intentionally low-stakes (e.g., "A Brief Examination of Rubber Ducks in Software Engineering") so it doesn't accidentally read as Estevan's authoritative position on the topic.
  - [ ] Edge case: user accidentally builds on top of the example content instead of clearing it first. Orchestrator detects this on first iterate-mode invocation ("looks like you're working in the demo article — want to start fresh, or build on top of the demo?").

## What We're Building

Pulled from the cycle brief's "What's in this cycle" list and PRD epics above. Each item maps to one or more user stories above with acceptance criteria.

1. **Hello-world plugin pre-flight** (load-bearing /spec deliverable; not an end-user-facing feature)
2. **Plugin manifest** (Epic 1)
3. **Orchestrator skill `vibe-thesis`** with dual-path scaffold mode + iterate mode (Epics 1, 2, 7, 9)
4. **Sub-skill: bootstrap** generalized beyond ThesisStudio name (Epic 2)
5. **Sub-skill: merge-authors** lifted verbatim (Epic 8)
6. **Slash command `/vibe-render`** (Epic 5)
7. **Slash command `/vibe-status`** (Epic 6)
8. **Templates payload** — full numbered scaffold + render scripts + schemas + design system + CLAUDE.md.template + README.md.template + package.json + .gitignore + .gitattributes + .github workflows + .husky (Epics 1, 2, 3, 4, 5, 6, 9)
9. **Dev container with three hard-won fixes** (Epic 4)
10. **One worked example bundled in `examples/`** (Epic 10)
11. **ADRs lifted** (or condensed to single `docs/architecture.md` per /spec call)
12. **README + LICENSE** with install instructions, basic usage, marketplace-listing-quality description
13. **Structural verification beat** — install built plugin into fresh fourth directory, run scaffold, confirm round-trip; runs both paths if both ship + tree-equivalence diff (Epic 1 + Epic 5 + Epic 10 acceptance composite)

## What We'd Add With More Time

These map to the cycle brief's "Step 2 backlog" — concrete v0.2 candidates, not v0.1 work. Each item is a sentence or two; full requirements come at v0.2's `/scope` and `/prd` runs.

- **`lay-translator` sub-skill** + `/vibe-translate` slash command. Reads body + bib, produces a `08_OUTPUT/layman/*.md` with a manifest tracking source-commit hash for sync detection. Battle-tested in source repo.
- **`research-integrate` sub-skill**. Reads user notes from `02_RESEARCH/`, updates body and citations.
- **`/vibe-update` self-update flow**. Diff plugin's templates payload against scaffolded projects, offer structured merges.
- **Mode taxonomy generalization** (`THESIS_MODE` → `VIBE_MODE` with blog/talk/manual/paper modes). Includes deciding whether non-academic modes need a different scaffold shape from `00_…08_`.
- **Standalone CLI surface** for CI / headless renders.
- **Marketplace polish, telemetry (opt-in), update channels.**
- **Cross-plugin coordination with Vibe Doc** (Vibe Doc scans Vibe Thesis projects for doc gaps; Vibe Thesis hands rendered outputs to Vibe Doc downstream).

## Non-Goals

Explicit rejections, with rationale. /spec and /build refer back to this list when scope-creep pressure surfaces.

- **Multi-tenant or team-collaboration features beyond `merge-authors`.** Vibe Thesis scaffolds single-user-per-directory projects. If the user wants concurrent multi-author editing with conflict resolution, that's git's job, not the plugin's. (`merge-authors` is in scope because it's a single-user merge action, not concurrent collaboration.)
- **Self-modification at runtime.** The orchestrator skill must not edit its own SKILL.md or modify the templates payload after scaffold. Improvements ship in the next plugin version. Reason: predictability of the install + sanity of `/vibe-update` semantics in v0.2.
- **Customization granularity beyond what `bootstrap` rewrites.** v0.1 ships sub-skills inside the plugin so updates flow automatically. Per-project sub-skill customization is a v0.2 question per cycle brief §6 Q4.
- **Modes beyond dissertation / article / masters.** Adding blog/talk/manual/paper is real opportunity but doesn't gate v0.1; the numbered scaffold (00_…08_) was designed for academic work and how well it generalizes is research, not v0.1 work.
- **Cross-plugin profile reads/writes against `~/.claude/profiles/builder.json`.** v0.1 is profile-naive. Cross-plugin coordination with Vibe Cartographer / Vibe Doc / Vibe Test is a v0.2+ concern with its own /spec call. Reason: keep v0.1's blast radius bounded.

## Open Questions

Items not resolved by /onboard, /scope, or this PRD. Each flagged for /spec resolution unless noted otherwise.

- **Q1: Plugin manifest exact field shape.** [/spec, BLOCKER for /build] — Must verify against live Claude Code docs. Hello-world pre-flight is the load-bearing /spec deliverable that closes this.
- **Q2: Project-detection marker mechanism.** [/spec] — CLAUDE.md stanza vs. top-level `vibe-thesis.yaml` vs. both. Working assumption is CLAUDE.md stanza for lightest-touch; /spec picks and justifies.
- **Q3: Dual scaffold path — ship both, default one?** [/spec, RESOLVED PROVISIONALLY] — Cart-cycle-brief recommends ship-both-with-auto-detection (Path B when `gh` available + authed, Path A otherwise). /spec confirms or revises with engineering rationale.
- **Q4: Sub-skill scope in v0.1: in-plugin (default) vs. templated-into-user-repo.** [/spec, RESOLVED PROVISIONALLY] — In-plugin per cycle brief §6 Q4 reading. /spec confirms.
- **Q5: Dev container required vs. one of two install paths.** [/spec, RESOLVED PROVISIONALLY] — Optional, one of two paths per cycle brief §6 Q5 + Epic 3 acceptance criteria. /spec confirms.
- **Q6: Distribution namespace.** [/spec, REQUIRED before publish] — `@626labs/vibe-thesis` vs. `estevanhernandez-stack-ed/vibe-thesis`. Resolve based on Estevan's current convention for Vibe Cartographer / Vibe Doc / Vibe Test.
- **Q7: ADR lift granularity.** [/spec] — Lift all 5 ADRs verbatim from source repo, or condense into a single `docs/architecture.md`? Plugin doc shape may favor the latter.
- **Q8: Source repo accessibility.** [/spec, /build] — `agentic-architect-vibe` lives at a devcontainer path not directly reachable from this Windows host. /spec / /build will fetch via `gh` if needed; verify the originating handoff sketch's inventory before relying on it.
- **Q9: Tree-equivalence diff method between Path A and Path B.** [/spec, conditional on Q3] — If both paths ship in v0.1, the structural verification beat needs a concrete diff method (rsync --dry-run, git diff against a synthesized merge-base, content-hash manifest). /spec picks one.
- **Q10: First-scaffold round-trip uses bundled example or empty body?** [/spec, soft] — Epic 5 says round-trip uses bundled example; Epic 10 covers the example itself; clarify in /spec which fires when (e.g., scaffold-mode round-trip uses example, but iterate-mode renders the user's actual content).
