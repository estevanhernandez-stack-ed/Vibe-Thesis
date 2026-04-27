# Builder Profile

> Cycle: **Vibe Thesis** — packaging the agentic-architect-vibe toolchain as a distributable Claude Code plugin.
> Cycle brief: [`../VIBE_THESIS_HANDOFF.md`](../VIBE_THESIS_HANDOFF.md) — treat as canonical reference for scope, inventory, and open questions.
> Onboard mode: `fully-autonomous`. Builder identity: `self` (Estevan as builder, third-person voice).

## Who They Are

Estevan ("Mr. Solo Dolo"). Builder and outsider, runs **626Labs** out of Fort Worth, TX. 20+ years on PC/Windows. Vibe coder by discipline — architects and ships through AI agents rather than writing code by hand; relies on pattern recognition, troubleshooting, and systems thinking. Has shipped ~10 deployed apps including a 7-app enterprise suite under company consideration. Active **Vibe Cartographer plugin contributor** (modified the plugin for company use; LADDER was the retooled-plugin stress test before this whole wave of Cart projects). This is his 10th Cart cycle.

What brings him to this project: the agentic-architect-vibe repo is the *demonstration substrate* for an article-grade vibe-direction toolchain. He wants to lift that toolchain — render pipeline, schemas, design system, agent swarm playbooks, sub-skills, dev container — out of the article repo and ship it as a reusable Claude Code plugin so other builders can scaffold a thesis-shaped project (PDF + HTML + lay-version + manifest) in minutes instead of forking ThesisStudio by hand. The cycle is the natural next move after the 9th Cart cycle (Substrate Step 2) closed out the substrate-evolution thesis.

## Technical Experience

**Level:** experienced.

**Languages:** TypeScript, Python, JavaScript, Luau, C#, HTML/CSS, C++.

**Frameworks / tools:** React 19, Next.js, Vite, TailwindCSS, Firebase, FastAPI, Flask, Express, .NET 8/9, Azure, Expo, React Native, Drizzle ORM, Playwright, WPF, C++/WinRT, Windows App SDK / WinUI 3, MSIX / wapproj, Ollama, Gemma 4 (E4B + 26B-A4B). Pandoc / LaTeX / texlive / biber familiarity from running the agentic-architect-vibe render pipeline directly.

**What he wants to explore for this cycle:** the live shape of Anthropic's plugin manifest format (`plugin.json` vs alternatives), the marketplace install path, and the right way to pack a `templates/` payload that gets copied into a user's directory on first run. Cycle brief §6 Q1 explicitly calls this out as Cartographer's call against current docs.

**AI coding agent experience:** deep. Built and shipped Claude Code plugins (Vibe Cartographer, Vibe Doc, Vibe Test) to marketplace. Modified Vibe Cartographer for company use before LADDER (April 2026) which served as the retooled-plugin stress test. Runs Claude Code as autonomous build system with structured checklists and subagent delegation — proven across 9 completed Cart cycles. Willing to switch agents mid-project when one is stuck — neutral tool, not a threat.

## Mode

**Builder mode** (per unified profile `plugins.vibe-cartographer.mode = "builder"`). Sharp collaborator pacing, brisk preamble, deepening rounds offered but not pushed. Combined with `autonomy_level = "fully-autonomous"` for this cycle: the cart-cycle-brief drives every fork the command would normally interview him on, handoffs are structured envelopes, no in-conversation approval beats.

**Build mode preference:** `iterative-prototype` — `/build` will dispatch through the checklist, with verification beats called out at structural moments (post-build verification before /reflect) per the calibration-trust pattern surfaced in the Lab Backbone Step 1 retro.

## Project Goals

Ship **Vibe Thesis** — a Claude Code plugin (skill bundle + slash commands + templates payload + dev container) that lets a user open a fresh directory in Claude Code, type "I want to write a thesis on X," and have a styled PDF skeleton with proposal/outline/claim-map and a working render pipeline within 30 minutes.

**MVP cut (per cycle brief §5):**

- Orchestrator skill (`vibe-thesis`) with scaffold mode + iterate mode.
- Templates payload — full numbered scaffold (00_…08_), render scripts, schemas, Dockerfile, design system, lifted from `template/main` of the source repo.
- Sub-skills `bootstrap` and `merge-authors` (battle-tested in source).
- Slash commands `/vibe-render` and `/vibe-status`.
- Dev container with the three hard-won fixes (font install, `.gitattributes` LF normalization, persistent `~/.claude` volume mount).
- Plugin manifest + install instructions.
- One worked example bundled in `examples/` so users can see what "done" looks like.

**Out of MVP / v0.2+:** `lay-translator` and `research-integrate` sub-skills, additional slash commands, modes beyond dissertation/article/masters, standalone CLI surface, marketplace polish.

**Definition of success:** install the plugin into a fresh directory, type "scaffold a vibe thesis project for me," and confirm the resulting tree round-trips through `npm run render:pdf`. If it works end-to-end, the MVP boundary is right.

**Constraint surfaced in cycle brief §6 Q8:** work happens in a new sibling repo `vibe-thesis/`, never in the article repo's tree. The article repo (`agentic-architect-vibe`) needs to keep functioning as an article repo for its primary use (Estevan finishing the agentic-architect article).

## Project Origin

**Extending an existing artifact, not greenfield.** The toolchain already exists in `agentic-architect-vibe` (a fork of ThesisStudio, customized via the `bootstrap` skill). This cycle is an **extraction-and-package** pass: identify infrastructure vs. content, lift the infrastructure cleanly into a `templates/` payload, generalize the bootstrap skill beyond the ThesisStudio name, and wire it into Claude Code's plugin format. The cycle brief includes a complete file inventory (§1), commit trace of local additions (§2), coupling map (§3), and proposed plugin layout (§4) — meaning `/scope` and `/prd` can compress significantly because the architectural decisions are already made; what `/spec` and `/checklist` need to nail down is the plugin manifest shape, the orchestrator skill's decision tree, and the extraction sequence.

**This working directory is the new sibling repo** (`c:\Users\estev\Projects\vibe-thesis`), currently a fresh folder. The source-of-truth example repo lives at `/workspaces/agentic-architect-vibe/` (devcontainer path) with remote `https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe`; upstream template at `https://github.com/estevanhernandez-stack-ed/ThesisStudio`. Cartographer should treat the cycle brief as authoritative for what's in the source repo because the source repo is not directly accessible from this Windows host.

## Design Direction

Clean, functional, high-contrast. Dark themes, muted palettes, clear information hierarchy. Polished but won't trade ship-time for polish. Specific to this cycle: the templates payload's rendered outputs (PDF, HTML, lay-version) need to feel like *publishable work* on first scaffold — the "what done looks like" example bundled in `examples/` should be a 3-page demo article that round-trips through the whole pipeline and looks polished out of the box. Design tokens (`00_DESIGN_SYSTEM/tokens.yaml`) drive both LaTeX xcolor and CSS variables; Cartographer should preserve that single-source-of-truth shape in the plugin's templates and let users override per-project via `bootstrap`.

## Prior SDD Experience

Deep. Estevan is a 10-cycle Cart veteran; this is the *plugin he himself contributes to*. He's run the full chain (`/onboard → /scope → /prd → /spec → /checklist → /build → /iterate → /reflect`) at least 9 times, plus the meta-loop (`/evolve`). Deepening-round habits: zero rounds when the spec is clean and substrate is well-understood (Sanduhr, Vibe Test, RTClickPng, 626Labs Universe Deep Dive, Lab Backbone Step 1, ThesisStudio, BlogStudio); 3+1+2 rounds when scope is genuinely fluid (LADDER). Reframing endorsed 2026-04-24: deepening rounds are a *prompt machine* — surface questions the builder might otherwise hit too late. Skipping is fine when the spec is clean; the value of the rounds is the asking, even when the answer is "defer." Compact decision matrices over serial questions are a productive variant when substrate is known (confirmed 2026-04-26 dual-track).

For this cycle: `/reflect` quiz should treat Estevan as a builder who could *teach* the SDD pattern, not learn it. Calibrate accordingly.

## Architecture Docs

**The cycle brief at [`../VIBE_THESIS_HANDOFF.md`](../VIBE_THESIS_HANDOFF.md) is itself the primary architecture reference for this cycle.** It contains:

- Component inventory by origin (Template / Local / Content) with paths, LOC, and plugin role (§1).
- Commit trace for every local enhancement that should ship (§2).
- Coupling map showing what depends on what — devcontainer → render pipeline → validation → skills → design system → mode flag (§3).
- Plugin architecture sketch — orchestrator skill, sub-skills, slash commands, templates payload, layout proposal (§4).
- Proposed MVP cut with explicit in/out lists (§5).
- 8 open questions for Cartographer to decide (§6) — manifest format, mode taxonomy, project-detection, sub-skill scope, dev container required-vs-optional, update path, distribution + identity, Cartographer's own scope (spec-only vs. drive first commits).
- Suggested first three moves (§7): verify Claude Code plugin format with hello-world, audit `template/main` deltas, create `vibe-thesis/` sibling repo.

**Source repo** (when accessible): the actual file tree at `/workspaces/agentic-architect-vibe/` and the un-customized scaffold at `template/main`. Cartographer can't reach this from the Windows host directly; rely on the brief's inventory.

**Reference dependencies** that the plugin must encode in its templates payload: Pandoc 3.1.13 (GitHub release pin), texlive-* (apt), biber, latexmk, fontconfig, JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk, Node 20, ajv + ajv-formats, @retorquere/bibtex-parser, husky 9, lint-staged.

**Anchored complement to lean on during /spec:** if `claude_ai_Figma` MCP is connected, useful for any final visual polish on the templates' default brand layer. Otherwise no Figma assets are expected for this cycle.

`/spec` will fall back to its own architecture-default-patterns where the brief is silent — primarily for the plugin manifest's exact field shape (Cartographer must verify against current Claude Code docs at `/spec` time per cycle brief §6 Q1 and §7 Move 1).

## Deployment Target

**Anthropic plugin marketplace + raw git URL.** Cycle brief §6 Q7 leaves the exact distribution choice open between personal GitHub (`estevanhernandez-stack-ed/vibe-thesis`) and an org namespace (`@626labs/vibe-thesis`); resolve at `/spec` time based on which path Estevan currently uses for Vibe Cartographer / Vibe Doc / Vibe Test (which already ship to marketplace). Identity / signing fields surfaced in `/spec`'s `## Deployment — Identity & Signing` sub-section will cover marketplace listing requirements + GitHub repo slug + token scope for any CI publish step.

Captured on unified profile as `plugins.vibe-cartographer.deployment_target = "claude-plugin-marketplace+github"`.
