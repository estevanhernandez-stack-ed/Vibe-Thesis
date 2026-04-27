# Vibe Thesis

## Idea

A Claude Code plugin that scaffolds and co-authors thesis-shaped projects end-to-end. A user opens a fresh directory in Claude Code, says *"I want to write a thesis on X,"* and ~30 minutes later they have a styled PDF skeleton, a working render pipeline, a proposal, an outline, a claim map, and the dev container running. From there, the same orchestrator coaches them through proposal → research → drafting → rendering and dispatches supporting sub-skills (bootstrap, agent swarms, lay-translator, research-integrate, merge-authors) at the right moments. The render pipeline is bash-callable, but the user never has to remember `npm run render:pdf` — they say "render the PDF" and Claude does.

The shape is **extraction**, not greenfield: the toolchain already exists as `agentic-architect-vibe` (a fork of `ThesisStudio` customized via the `bootstrap` skill). This cycle lifts the infrastructure cleanly out of the article repo, generalizes the bootstrap skill beyond the ThesisStudio name, and packages it as a Claude Code plugin so other builders can scaffold a thesis-shaped project without forking ThesisStudio by hand.

## Who It's For

**Primary user:** a builder writing a thesis-grade artifact — academic dissertation, master's thesis, long-form research article, position essay (the agentic-architect-vibe class), or any document that benefits from claim-mapped argument, citation discipline, render-quality typography, and a multi-output pipeline (PDF + HTML + lay-summary + manifest). The user is comfortable in Claude Code (or willing to pick it up), wants the document-centric Cart-style workflow without having to author the substrate themselves, and values being able to ship something that looks publishable on first scaffold.

**Specific unmet need:** the existing ThesisStudio template requires the user to clone, customize, and wire it themselves. That's friction for anyone who isn't already a Cart contributor. Vibe Thesis collapses that to a single plugin-install + natural-language scaffold step, with the dev container's three hard-won fixes (font install, `.gitattributes` LF normalization, persistent `~/.claude` volume mount) baked in so the user doesn't trip the same wires Estevan already tripped.

**Secondary user (not in MVP, signal worth preserving):** multi-author teams who'd use the `merge-authors` sub-skill to braid drafts together. Shipping in MVP because `merge-authors` is already battle-tested in the source repo and the cost of including it is near zero.

## Inspiration & References

- **Source-of-truth example repo:** [`agentic-architect-vibe`](https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe) — the working demonstration. Cart should treat the cycle brief's inventory (§1) as authoritative for the file tree because the repo lives in a devcontainer not directly reachable from the Windows host.
- **Upstream GitHub *template* repo:** [`ThesisStudio`](https://github.com/estevanhernandez-stack-ed/ThesisStudio) — set up as a clickable "Use this template" repo on GitHub. This is more than an upstream reference; it's an **alternate scaffold path** the plugin can offer. Two viable paths into a working project: (a) plugin-bundled templates payload copied locally, or (b) `gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>` to spawn a fresh repo from the template. /spec resolves whether v0.1 supports both, defaults to one, or hard-picks one.
- **Sibling 626Labs plugins shipped to the Anthropic marketplace:** Vibe Cartographer, Vibe Doc, Vibe Test. They establish the namespace, the manifest shape (to verify against current docs), the README/install conventions, and the publishing workflow.
- **Render pipeline references:** Pandoc 3.1.13, texlive (xelatex + biber + latexmk), JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk, ajv + ajv-formats, @retorquere/bibtex-parser, husky 9 + lint-staged.
- **Design energy:** clean, functional, high-contrast. The PDFs the templates produce are publishable on first scaffold — typography reads like editorial-grade work, not generic Pandoc output. The `00_DESIGN_SYSTEM/tokens.yaml` single-source-of-truth pattern (drives both LaTeX xcolor and CSS variables) carries forward unchanged. Brand layer is overridable per project via `bootstrap`.

**Cycle brief anchor:** [`../VIBE_THESIS_HANDOFF.md`](../VIBE_THESIS_HANDOFF.md) is the canonical reference for everything below — file inventory by origin, commit trace of local additions, coupling map, plugin layout sketch, MVP cut, open questions, suggested first three moves.

## Goals

- **Ship a plugin that round-trips end-to-end on first install.** Install the plugin into a fresh directory, say "scaffold a vibe thesis project for me," and the resulting tree must produce a publishable PDF via `npm run render:pdf` with no manual fixups. This is the single non-negotiable acceptance criterion.
- **Encode the three hard-won dev-container fixes** so future users don't trip the same wires (font install script, `.gitattributes` with `eol=lf`, persistent `~/.claude` volume mount).
- **Keep the orchestrator natural-language-driven.** The user never has to remember command names — they say what they want, the orchestrator skill bridges to the right sub-skill, slash command, or bash invocation.
- **Generalize cleanly beyond `ThesisStudio`.** The `bootstrap` skill currently rewrites placeholders that include the literal string "ThesisStudio." Vibe Thesis must be substrate-neutral — the plugin name shouldn't leak into scaffolded projects' identity.
- **Stay shippable.** MVP is one orchestrator skill, two sub-skills (`bootstrap` + `merge-authors`), two slash commands (`/vibe-render` + `/vibe-status`), the templates payload, the dev container, the manifest, and one worked example. Resist scope creep — `lay-translator` and `research-integrate` are deferred to v0.2 not because they're hard but because shipping the orchestrator's core loop matters more than shipping every sub-skill at once.

## What "Done" Looks Like

A new user installs `vibe-thesis` from the Anthropic plugin marketplace (or via raw git URL fallback). They open a fresh directory in Claude Code. They type something natural — *"I want to write a thesis on cellular automata as a model for distributed consensus"* — and the orchestrator skill picks it up. It runs **scaffold mode**:

1. **Source the workspace.** The plugin offers (or auto-picks per /spec resolution) one of two paths:
   - **Path A — plugin-bundled:** copy the plugin's `templates/` payload into the working directory. Offline-capable, version-locked to the installed plugin release. Default for users without GitHub auth or network.
   - **Path B — GitHub template fork:** invoke `gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>` (or the equivalent API call). Always-fresh, network-dependent, requires `gh` auth. Default for users with `gh` available who want a real GitHub repo from minute zero. Apply the plugin's local-additions diff (font install script, persistent ~/.claude volume, .gitattributes hardening, lay-translator/research-integrate when v0.2 ships) on top of the template-spawned tree.
2. **Bootstrap the identity.** Invoke the `bootstrap` sub-skill, which interviews the user for project identity (title, author, mode = dissertation | article | masters), rewrites placeholders across CLAUDE.md / README.md / LICENSE / package.json, and sets `THESIS_MODE` (or `VIBE_MODE` if /spec resolves §6 Q2 toward generalization). Bootstrap runs identically in both Path A and Path B — the placeholders are the same.
3. **Toolchain install.** Offer either dev-container or native-install for the toolchain dependencies (Pandoc, texlive, fonts). The dev container with the three hard-won fixes is plugin-shipped regardless of which scaffold path was taken.
4. **Round-trip confirmation.** Run `npm run render:pdf` against the bundled example and confirm it produces a publishable PDF.

After scaffold mode, the orchestrator runs **iterate mode** indefinitely: the user keeps talking to Claude inside the project directory; the orchestrator coaches them through the appropriate phase (planning → research → drafting → review → translation), dispatches sub-skills at the right moments ("I read this paper" → research-integrate when v0.2 ships; "let's strengthen claim X" → lit-review-swarm playbook; "we have multiple authors" → merge-authors), and offers renders + sync checks at natural breakpoints.

The ~30 minute target is the first-scaffold-to-rendered-PDF window. Iterate-mode is open-ended.

## What's Explicitly Cut

- **`lay-translator` sub-skill — deferred to v0.2.** It's real and battle-tested in the source repo, but it's a deep workflow on its own (reads body + bib, writes layman manifest with source-commit hash for sync detection). Shipping it in MVP would mean shipping two orchestration loops at once. Lock the core orchestrator in v0.1, layer lay-translator on after.
- **`research-integrate` sub-skill — deferred to v0.2.** Same rationale. Reads user notes, updates `02_RESEARCH/`, `05_CITATIONS/`, `03_BODY/`. It's a workflow, not a single action. Out of MVP.
- **Slash commands beyond `/vibe-render` + `/vibe-status` — deferred.** The orchestrator's natural-language bridge is the primary surface. Slash commands are for explicit verbs (render, project status). Adding `/vibe-translate`, `/vibe-merge`, `/vibe-swarm` follows the sub-skills they wrap.
- **Modes beyond dissertation / article / masters — deferred.** Adding blog / talk / manual / paper is a real opportunity but doesn't gate v0.1. The numbered scaffold (00_…08_) was designed for academic work; how well it generalizes to other formats is research, not MVP work.
- **Standalone CLI surface — deferred.** Useful for CI and headless renders, but the plugin is the product. Render scripts already work bash-callable inside scaffolded projects; a separate CLI distribution adds maintenance surface without shipping value the plugin doesn't already cover.
- **Marketplace polish, telemetry, update channels — deferred.** Ship working before ship pretty. v0.1 needs install-and-scaffold to work; the marketplace listing graphics and telemetry can land in v0.1.x.
- **The `/vibe-update` self-update flow — deferred to v0.2+.** Cycle brief §6 Q6 raises this: how do plugin improvements reach scaffolded projects after the user is past first install? Possible answers: a `/vibe-update` command that diffs templates against the user's tree and offers structured merges, or relying on the user to merge by hand. v0.1 ships one-shot scaffolding; the update path is a real concern but not a v0.1 concern.
- **Customization granularity beyond `bootstrap` interview — deferred.** Cycle brief §6 Q4 raises sub-skill scope (in-plugin vs. templated into user's repo). v0.1 ships sub-skills *inside the plugin* so updates flow automatically; per-project customization beyond what `bootstrap` rewrites is a v0.2 question, not a v0.1 one.

## Loose Implementation Notes

- **Plugin layout** (per cycle brief §4) is the working sketch:
  - `plugin.json` — manifest (verify shape against current Claude Code docs at /spec time per cycle brief §6 Q1 and §7 Move 1; this is the single biggest unknown going into /spec).
  - `skills/vibe-thesis/SKILL.md` — orchestrator with scaffold-mode + iterate-mode decision tree.
  - `skills/bootstrap/`, `skills/merge-authors/` — lifted from source repo, generalize bootstrap beyond "ThesisStudio" name.
  - `commands/vibe-render.md`, `commands/vibe-status.md` — slash commands.
  - `templates/` — full numbered scaffold payload (00_DESIGN_SYSTEM, 01_PLANNING, 02_RESEARCH, 03_BODY, 04_AGENT_SWARMS, 05_CITATIONS, 06_REVIEW_RESPONSES, 07_APPENDICES, scripts/, .devcontainer/, .github/workflows/, .gitattributes, .gitignore, package.json, CLAUDE.md.template, README.md.template).
  - `examples/` — one bundled 3-page demo article that round-trips through the whole pipeline.
  - `docs/` — lifted ADRs explaining design choices.
- **Mode flag plumbing:** keep `THESIS_MODE` for v0.1 (per /spec resolution of cycle brief §6 Q2). Renaming to `VIBE_MODE` is a mode-taxonomy generalization that pairs with adding non-academic modes — both deferred together.
- **Project detection:** Cycle brief §6 Q3 — how does Claude know it's in a Vibe Thesis project? Likely a marker file (`vibe-thesis.yaml` or a stanza in CLAUDE.md). /spec resolves the exact shape; the orchestrator's scaffold-mode-vs-iterate-mode branch depends on it. Detection must work identically whether the user took Path A (plugin-bundled scaffold) or Path B (GitHub template fork) — both paths land the user in a directory with the same marker.
- **Scaffold-path resolution (new from 2026-04-26 19:08 course-correction):** /spec must decide whether v0.1 ships both Path A and Path B, defaults to one, or hard-picks one. Recommendation going into /spec: ship **both** with auto-detection (if `gh` is available and authenticated, default to Path B; otherwise Path A). The plugin's `templates/` payload is the canonical source either way — for Path B, the plugin treats `gh repo create --template` as "spawn the same tree, just with a real GitHub remote attached." Local-additions diff (the local-contributions list from cycle brief §2) gets applied on top of the template-spawned tree. This decision propagates: `/checklist` needs an item for "implement Path B if /spec selected it" + an item for "verify both paths produce equivalent trees" if both are shipped.
- **Dev container — optional, not required.** Cycle brief §6 Q5: ship dev container as one of two install paths so users with native pandoc + texlive + node aren't forced into Docker. Default the orchestrator's "scaffold mode" step 3 to recommend dev container when system tooling is missing, native install otherwise.
- **Distribution + identity:** Cycle brief §6 Q7 — resolve namespace at /spec time. Lean is `@626labs/vibe-thesis` if Estevan's other shipped plugins use the org namespace; `estevanhernandez-stack-ed/vibe-thesis` if personal. Either way: marketplace + raw git URL.
- **Cartographer's own scope:** Cycle brief §6 Q8 — produce spec doc only, OR drive the first extraction commits. Default for this cycle is *both*: /spec + /checklist + /build will execute the extraction. Build work happens here in `c:\Users\estev\Projects\vibe-thesis\` (this directory). Sibling-repo discipline is hard: NEVER touch `agentic-architect-vibe`. Extraction means *copying out*, never modifying in place.
- **First three moves (cycle brief §7) become the first three checklist items:**
  1. Verify Claude Code plugin format with a hello-world (one skill + one slash command + one templated file). Confirm install/load works on this machine before designing the real one.
  2. Audit `template/main` deltas vs HEAD on the source repo. Confirm the local-contributions list (§2) is the complete set of infrastructure work to lift.
  3. Stand up `vibe-thesis/` (this directory) with the templates payload, stub orchestrator, and minimal manifest. Validate the MVP boundary by installing the plugin into a fresh fourth directory and confirming round-trip through `npm run render:pdf`.
