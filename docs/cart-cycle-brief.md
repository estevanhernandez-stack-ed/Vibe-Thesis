# Vibe Thesis — Plugin Extraction MVP

**Posted:** 2026-04-26
**Author:** Estevan Hernandez ("Mr. Solo Dolo"), 626Labs
**Repo:** `c:\Users\estev\Projects\vibe-thesis\` (new sibling repo; not yet pushed; remote will be set at /spec or /build time per §6 Q7 resolution)
**Cycle name:** Vibe Thesis — extract the agentic-architect-vibe toolchain into a distributable Claude Code plugin

> **Cycle brief continuity:** [`../VIBE_THESIS_HANDOFF.md`](../VIBE_THESIS_HANDOFF.md) is the originating handoff sketch (Estevan, pre-Cart). This file is the Cart-side restatement: per-cycle stance pre-statements that downstream commands at `'fully-autonomous'` autonomy treat as canonical. Where the two overlap, this brief defers to the handoff sketch's inventory and the handoff defers to this brief on Cart-stance per command.

---

## Recommended cycle

This is the **extraction-and-package cycle** for the agentic-architect-vibe toolchain. The substrate decisions (render pipeline shape, design tokens single-source-of-truth, mode flag, sub-skill set, dev container fixes) were made over the course of building `agentic-architect-vibe` itself. This cycle lifts those decisions into a plugin form so other builders can adopt the toolchain without forking ThesisStudio by hand.

It is also a **principal-level-coder-prompt thesis instance.** The 9th Cart cycle (Substrate Step 2) named the thesis: the unified builder profile + cart-cycle-brief compose into a portable principal-level system prompt any agent can start a project from. Vibe Thesis is the *first non-Substrate cycle to operationalize this thesis* — a cycle where the brief is genuinely thorough (the originating `VIBE_THESIS_HANDOFF.md` is more thorough than most projects' /spec outputs) and downstream commands compress accordingly. /scope and /prd should compress significantly. /spec and /checklist carry the load.

## Builder identity & autonomy mode

- **`cycle_builder_identity`:** `'self'` — Estevan runs as builder. Profile written third-person describing-Estevan voice.
- **`autonomy_level`:** `'fully-autonomous'` — promoted 2026-04-26 during Substrate Step 2 /evolve; this is the second cycle since promotion (after Substrate Step 2 itself). Commands chain-advance via structured handoff envelopes; no per-step builder turn for upfront-question forks. Plugin-track safety guard remains on (any `/evolve` SKILL edits queue for review even at this level).

The bumpers-up contract governs: Estevan intervenes on load-bearing drift, otherwise the chain runs. `/scope` already compressed to zero interview turn (this brief and the originating handoff sketch absorbed every fork). `/prd` should do likewise.

## Builder-stance pre-statements

### /prd

- **Deepening rounds:** **0 rounds default.** The originating handoff sketch is more thorough than most projects' /spec outputs; the additional structural questions /prd would surface (acceptance criteria edges, success metrics, MVP gates) are already pre-stated in [`../docs/scope.md > Goals`](../docs/scope.md) and [`../docs/scope.md > What "Done" Looks Like`](../docs/scope.md). Generate /prd from the brief + scope + handoff sketch directly. If the act of writing /prd surfaces a real edge case (prompt-machine value), name it inline in the doc rather than firing a deepening round.
- **Acceptance criteria posture:** **single non-negotiable acceptance criterion drives the doc** — install plugin into fresh directory, say "scaffold a vibe thesis project for me," round-trip through `npm run render:pdf` with no manual fixups. Every other criterion is supporting. Don't bloat the criteria list.
- **Success metric:** time-to-first-rendered-PDF on first install. Target ~30 minutes. /prd should cite this explicitly.
- **Edge-case surfacing posture:** **strict on the round-trip** — if the bundled example fails to render, the install is broken. Soft on per-feature behavior — sub-skills (`bootstrap`, `merge-authors`) inherit their tested behavior from the source repo and don't get re-spec'd here.
- **Scope-creep guard:** /prd refuses to add v0.2 sub-skills (`lay-translator`, `research-integrate`), additional slash commands, mode-taxonomy generalization, standalone CLI, marketplace polish, customization granularity, or `/vibe-update` self-update. Each refusal cites the rationale already in [`../docs/scope.md > What's Explicitly Cut`](../docs/scope.md).

### /spec

- **Stack choices:** lift the existing stack verbatim. Render pipeline = Node 20 + Pandoc 3.1.13 + texlive (xelatex/biber/latexmk). Validation = ajv + ajv-formats. Citations = @retorquere/bibtex-parser. Hooks = husky 9 + lint-staged. Dev container = Debian-slim + apt deps + GitHub-release-pinned pandoc + the install-fonts.sh script. **No new dependencies introduced this cycle** — the cycle is extraction, not redesign.
- **Plugin manifest format:** **verify against live Claude Code docs at /spec time.** This is the single biggest unknown going into /spec. Cycle brief §6 Q1 and §7 Move 1 are explicit. Do NOT draft `plugin.json` from training-data assumptions. /spec must include a hello-world plugin pre-flight (one skill + one slash command + one templated file) before designing the real manifest. Treat manifest verification as a load-bearing /spec deliverable.
- **Scaffold-path resolution (NEW — 2026-04-26 19:08 course-correction from Estevan):** [ThesisStudio](https://github.com/estevanhernandez-stack-ed/ThesisStudio) is a **GitHub *template* repo** (clickable "Use this template"), not just an upstream reference. The plugin has two viable scaffold paths: **(A)** copy the plugin-bundled `templates/` payload locally; **(B)** `gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>`. **Recommended /spec stance: ship both** with auto-detection (Path B when `gh` is available and authenticated, Path A otherwise). The plugin's `templates/` payload remains canonical either way — Path B is "same tree, with a real GitHub remote attached," and the local-additions diff (cycle brief §2 list) applies on top of the template-spawned tree to bring it to parity with Path A. /spec must produce: scaffold-path detection logic, equivalence-test (Path A and Path B produce identical post-bootstrap trees), the local-additions overlay procedure for Path B, and bootstrap-runs-identically-on-both invariant. If /spec elects to ship only one path in v0.1, the other goes to Step 2 backlog with engineering rationale.
- **Federation declarations:** **none** — Vibe Thesis is not a Federation Pattern instance. The plugin's templates payload IS the source-of-truth at install time; once scaffolded, the user's directory becomes its own canonical source. There's no cross-system mirror or bridge to declare.
- **Architectural invariants:**
  - **Plugin sovereignty:** Vibe Thesis owns its own `plugins.<name>` namespace if it ever writes to the unified builder profile. It must not stomp other plugins' blocks. (Likely v0.2 concern — v0.1 doesn't read/write the unified profile.)
  - **Sibling-repo discipline:** build work happens in `c:\Users\estev\Projects\vibe-thesis\`. NEVER touch `agentic-architect-vibe`. Extraction = copying out, never modifying in place. /spec and /checklist must encode this as a hard guard.
  - **Single-source-of-truth design tokens:** `00_DESIGN_SYSTEM/tokens.yaml` drives both LaTeX xcolor and CSS variables. Carry forward unchanged. Brand layer overridable per project via `bootstrap`.
  - **Mode flag is shift-emphasis-only:** `THESIS_MODE` (dissertation | article | masters) shifts which body-shape the render pipeline expects and which dirs the lead writer treats as load-bearing — never deletes files. Carry forward unchanged.
- **Scale assumptions:** plugin install path serves single-user-per-directory usage. No multi-tenant concerns. Templates payload size is bounded (the source repo is ~166 files at HEAD, ~102 in template/main; the plugin's `templates/` is roughly the latter minus content). Marketplace install path determined at /spec time per §6 Q7.

### /checklist

- **Build mode:** **`autonomous`** — fully-autonomous Cart at autonomous-build is the established pattern for Estevan since Vibe Test (2026-04-17). The orchestrator dispatches each item to a subagent.
- **Verification:** **off — summary at the end + structural verification beat before /reflect.** Mid-build verification is friction-laden when the cycle scope is bounded extraction work. The structural verification beat (install plugin into fresh directory → round-trip through `npm run render:pdf`) is the cycle's load-bearing acceptance test and must run before /reflect closes. Per the calibration-trust gap pattern (Lab Backbone Step 1 retro): structural verification beats at first-runnable-state belong as their own primitive, not /reflect callouts.
- **Git cadence:** **commit after each checklist item** with message `'Complete step N: [title]'`. Auto-commit per item is on (default for fully-autonomous).
- **Subagent dispatch strategy:**
  - **Sequential:** plugin manifest hello-world pre-flight (must succeed before later items depend on confirmed manifest shape), templates payload extraction (depends on having `template/main` audited first), structural verification beat at end.
  - **Parallel-eligible:** sub-skill copies (`bootstrap`, `merge-authors` are independent), slash command files (`/vibe-render`, `/vibe-status` are independent), ADR lifts, README + LICENSE generation.
  - **Pattern-match against existing 626Labs plugin layout** (Vibe Cartographer, Vibe Doc, Vibe Test) when extending or creating the manifest, .claude-plugin/ structure, and marketplace metadata. The pattern-match-existing-config-values lesson from Lab Backbone Step 1 applies here too.

### /build

- **Auto-commit per checklist item:** **yes** — fully-autonomous default. Commit messages follow Conventional Commits with the checklist item as the subject.
- **In-build subagent dispatch:** **yes — parallel where independent.** Sub-skill copies, slash command authoring, ADR lifts can fan out. The plugin manifest pre-flight and the structural verification beat are sequential by nature.
- **Mid-build pivot tolerance:** course-correct on load-bearing decisions (manifest shape if hello-world reveals the spec is different from assumed; sibling-repo accidental writes if any file path resolves to `agentic-architect-vibe`); let the rest flow. The cycle is bounded extraction — there's not much room for genuinely surprising scope creep.

### /iterate

- **Default disposition:** **run iteration** — per the cycle-brief insight from Lab Backbone Step 1 retro point (c): iteration is the cheap default in autonomous mode + parallel agents. Builder cost near-zero, agent's review pass qualitatively richer post-build, iteration stress feeds /evolve. /iterate should look at: README polish, install-instructions clarity, the worked example's narrative quality (does the demo article actually feel publishable?), marketplace listing copy, plugin description that surfaces in Anthropic's marketplace UI.
- **Verification beats:** **owned by /iterate, not next-builder-action.** The structural verification beat (round-trip through `npm run render:pdf`) runs at /build close. /iterate adds the marketplace-listing visual smoke-test (open the plugin in Claude Code's plugin marketplace UI on a clean install, confirm the description renders correctly). Anything beyond that defers to next-builder-action with explicit verification_beats_owed in the /iterate handoff envelope.

### /reflect

- **Reflection density:** **extended thesis-grade.** Vibe Thesis carries the principal-level-coder-prompt thesis (Substrate Step 2) into its first non-Substrate cycle. /reflect should evaluate whether the brief-driven compression of /scope and /prd actually produced quality-equivalent artifacts, whether fully-autonomous chain-advance worked end-to-end without bumper interventions on load-bearing decisions, and whether the cycle delivered on the recursive-proof framing below.
- **Calibration check-in:** **run** even if friction.jsonl is empty. The autonomy-level promotion is recent (2026-04-26); /reflect should explicitly check whether the cycle felt right at fully-autonomous or whether any beat would have benefited from a checkpointed turn.

## Scope decisions

### What's in this cycle

1. **Hello-world plugin pre-flight** — minimal Vibe Thesis plugin (one skill, one slash command, one templated file) installed and load-verified before designing the real manifest. Establishes ground truth on Claude Code's current plugin format.
2. **Plugin manifest** — `plugin.json` (or whatever the live spec calls it), namespace + version + components, marketplace-installable.
3. **Orchestrator skill** — `skills/vibe-thesis/SKILL.md` with scaffold-mode (dual-path: plugin-bundled OR GitHub-template-fork) + iterate-mode decision tree per cycle brief §4 sketch.
4. **Sub-skill: bootstrap** — lifted from source repo, generalized beyond ThesisStudio name. The plugin name must not leak into scaffolded projects' identity.
5. **Sub-skill: merge-authors** — lifted from source repo verbatim.
6. **Slash command: `/vibe-render`** — wraps `npm run render:pdf|html|md|all`.
7. **Slash command: `/vibe-status`** — project state, claim-coverage, lay-sync (when applicable).
8. **Templates payload** — full numbered scaffold (00_DESIGN_SYSTEM through 08_OUTPUT), render scripts (`render-pdf.js`, `render-html.js`, `render-markdown.js`, `compile-tokens.js`, `validate-schemas.js`, `check-citations.js`, lib helpers), schemas (5 JSON Schemas), design system (tokens.yaml + brand layer + editorial CSS / LaTeX preamble), CLAUDE.md.template, README.md.template, package.json, .gitignore, .gitattributes (with `eol=lf`), .github/workflows/, .husky/, .devcontainer/.
9. **Dev container with three hard-won fixes baked in** — font install script, `.gitattributes` LF normalization, persistent `~/.claude` volume mount. Optional install path (not required) per cycle brief §6 Q5.
10. **One worked example bundled** — 3-page demo article in `examples/` that round-trips through the whole pipeline so users can see what "done" looks like.
11. **ADRs lifted** — `docs/adr/0001…0005.md` from source repo (or summarized into a single `docs/architecture.md` if /spec decides that's cleaner for plugin-doc shape).
12. **README + LICENSE** — install instructions, basic usage, marketplace-listing-quality description.
13. **Structural verification beat** — install the built plugin into a fresh fourth directory, run "scaffold a vibe thesis project for me," confirm the resulting tree round-trips through `npm run render:pdf`. **If both scaffold paths ship, the verification beat runs both** (Path A end-to-end + Path B end-to-end + tree-equivalence diff between them post-bootstrap). Runs before /iterate.

### What's explicitly cut

- **`lay-translator` sub-skill** — engineering rationale: it's a deep workflow (reads body + bib, writes layman manifest with source-commit hash for sync detection), shipping in v0.1 would mean shipping two orchestration loops at once. Lock the core orchestrator first.
- **`research-integrate` sub-skill** — same rationale. Workflow, not single action.
- **Slash commands beyond `/vibe-render` + `/vibe-status`** — orchestrator's natural-language bridge is the primary surface. Slash commands are explicit-verb shortcuts, not the product. Adding `/vibe-translate`, `/vibe-merge`, `/vibe-swarm` follows the sub-skills they wrap.
- **Mode taxonomy generalization (`THESIS_MODE` → `VIBE_MODE`)** — adding blog/talk/manual/paper modes is real opportunity, doesn't gate v0.1. The numbered scaffold (00_…08_) was designed for academic work; how well it generalizes is research, not v0.1 work.
- **Standalone CLI surface** — useful for CI and headless renders, but the plugin is the product. Render scripts already work bash-callable inside scaffolded projects.
- **`/vibe-update` self-update flow** — cycle brief §6 Q6. Real concern but not v0.1. v0.1 ships one-shot scaffolding.
- **Customization granularity beyond `bootstrap` interview** — cycle brief §6 Q4. v0.1 ships sub-skills inside the plugin (updates flow automatically). Per-project sub-skill customization is v0.2.
- **Marketplace polish, telemetry, update channels** — v0.1.x territory. Ship working before pretty.
- **Multi-tenant or team-collaboration features** — out of scope. Single-user-per-directory.
- **Self-modification at runtime** — orchestrator skill should not edit its own SKILL.md or modify the templates payload after scaffold. If an improvement is warranted, it ships in the next plugin version.

### Step 2 backlog (carry-over notes for the next cycle)

- **Ship `lay-translator` and `research-integrate` as v0.2 sub-skills.** Both are battle-tested in the source repo; the lift is mostly mechanical with sub-skill scope decisions to make per cycle brief §6 Q4.
- **Ship `/vibe-translate`, `/vibe-merge`, `/vibe-swarm` slash commands** to wrap the new sub-skills.
- **Mode taxonomy generalization.** Decide whether `THESIS_MODE` → `VIBE_MODE` and what new modes (blog, talk, manual, paper) imply for the numbered scaffold's shape. Consider whether non-academic modes need a different scaffold entirely (`00_…08_` is academic-shaped).
- **`/vibe-update` self-update flow.** Diff templates against scaffolded projects, offer structured merges. Likely a slash command + a sub-skill that handles the merge logic.
- **Standalone CLI surface for CI / headless use.** Wraps the render pipeline so non-Claude-Code users (CI bots, headless rendering services) can produce output without invoking the plugin.
- **Marketplace-listing polish.** Graphics, telemetry (opt-in), update channels.
- **Cross-plugin coordination with Vibe Doc.** Vibe Doc handles documentation gap analysis; Vibe Thesis produces document-shaped artifacts. Worth exploring whether they should compose (Vibe Doc scans Vibe Thesis projects for doc gaps; Vibe Thesis hands rendered outputs to Vibe Doc for downstream packaging).

## Constraints

- **Autonomy mode:** `'fully-autonomous'` — chain-advance via structured handoff envelopes, no per-step builder turn for upfront-question forks. Plugin-track SKILL edits stay queued at /evolve regardless.
- **Dependencies:** **no new runtime dependencies introduced this cycle.** Lift the existing stack verbatim. The dev container apt list (pandoc, texlive-*, biber, latexmk, fontconfig, unzip), Node 20, the npm deps (ajv, ajv-formats, @retorquere/bibtex-parser, husky, lint-staged) carry forward exactly as-is. Single new dep would need explicit /spec justification, and there's no current candidate.
- **Deployment shape:** Anthropic plugin marketplace + raw git URL fallback. Namespace (`@626labs/vibe-thesis` vs `estevanhernandez-stack-ed/vibe-thesis`) resolved at /spec time per cycle brief §6 Q7. /spec will surface a target-specific `## Deployment — Identity & Signing` sub-section per the deployment_target field.
- **Persona/tone preferences:** architect persona (strategic, big-picture, tradeoff-focused). Carried forward from unified profile. Builder mode pacing (brisk preamble, deepening rounds offered without push). Casual tone, no corporate speak.
- **Hard time constraints:** none. This cycle ships when it ships. The originating handoff sketch is dated 2026-04-26 (today); no external deadline.
- **Sibling-repo hard guard:** never touch `agentic-architect-vibe`. Build work stays in `c:\Users\estev\Projects\vibe-thesis\`. Extraction = copying out, never modifying in place. /spec and /checklist encode this as a load-bearing constraint.
- **Source-repo accessibility:** the source-of-truth example repo lives at `/workspaces/agentic-architect-vibe/` (devcontainer path) with remote `https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe`. Cart cannot Read the devcontainer files directly from the Windows host. Use the cycle brief's inventory + `gh` CLI to fetch the source if needed at /spec or /build time. Verify the brief's claims when fetching — the brief is dated 2026-04-26 but /build may run hours or days later.

## Federation declarations

**Not applicable this cycle.** Vibe Thesis is not a Federation Pattern instance. The plugin's `templates/` payload is the source-of-truth at install time; once scaffolded, the user's working directory becomes its own canonical source with no cross-system mirror or bridge. The architectural pattern in play is **plugin-as-substrate-distribution**, not Federation. If a future cycle adds `/vibe-update` self-update (Step 2 backlog), that introduces a pull-from-plugin-to-user-tree relationship that may warrant Federation-style declaration; out of scope for this cycle.

## Recursive-proof framing

**The cycle is the first non-Substrate operationalization of the principal-level-coder-prompt thesis.**

Substrate Step 2 (closed out 2026-04-26 13:11 CST) named the thesis: the unified builder profile + cart-cycle-brief compose into a portable principal-level system prompt any agent can start a project from. That cycle proved the pattern with Kira-as-builder authoring substrate work. Vibe Thesis tests it under different conditions:

- **Builder identity is `'self'` (Estevan), not `'agent-persona'`.** This isolates the brief's effect from the agent-as-builder framing. If chain-advance works at fully-autonomous with a thorough brief and a `'self'` builder, the brief itself (not the agent-persona framing) is the load-bearing variable.
- **The cycle scope is bounded extraction work**, not novel substrate work. This tests whether the brief format compresses well for cycles where the architectural decisions are largely upstream (made over the course of building `agentic-architect-vibe` itself) rather than inline.
- **The cycle has a clean structural verification beat** (`npm run render:pdf` round-trip on fresh install). This is rarer in substrate cycles. If fully-autonomous chain-advance lands cleanly *and* the verification beat passes on first try, that's strong evidence the brief is doing the work it claims to do.

**What the cycle empirically claims:** that for any cycle with a thorough cart-cycle-brief, fully-autonomous chain-advance produces artifacts of equivalent quality to a guided multi-turn run. The evidence: the time from /onboard to /reflect, the count of bumper interventions on load-bearing decisions, the structural verification beat outcome, and the /reflect quality assessment of the artifacts produced.

**Sibling-thesis surfaced by this cycle:** Vibe Thesis itself is a *plugin-form distribution of a thesis-writing toolchain*, which means: the toolchain that produced the agentic-architect article (which articulates the principal-level-coder-prompt thesis) becomes the plugin that produces toolchains for other theses. The recursion isn't as tight as Substrate Step 2's "the substrate produces the agentic architect that produces the substrate," but the family resemblance is exact: a substrate distribution that can produce its own siblings.

Future cycles' /reflect should check both framings — the principal-level-coder-prompt thesis instance, and the plugin-form-distribution sibling-thesis. If either is contradicted by the cycle's outcome, that's load-bearing data.

## Closing note

This brief is read by every downstream command in the chain. Edit it during the cycle if your stance shifts on a load-bearing decision — the brief is canonical at `'fully-autonomous'` autonomy, so its accuracy matters. Particularly watch:

- The plugin manifest format (live verification at /spec may invalidate the §4 layout assumption).
- The sibling-repo discipline (any time a path resolves to `agentic-architect-vibe`, escalate to a builder turn).
- The structural verification beat outcome (if `npm run render:pdf` fails on first-runnable-state, the cycle is not done — open an /iterate beat to debug rather than handing to next-builder-action).

— Estevan Hernandez
2026-04-26
