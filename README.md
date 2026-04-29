<p align="center">
  <a href="https://github.com/estevanhernandez-stack-ed/vibe-plugins"><img alt="Part of Vibe Plugins — the 626Labs plugin marketplace for Claude Code" src="https://626labs.dev/assets/brand/vibe-plugins-banner-1500x500.png" /></a>
</p>

# Vibe Thesis

> *Start with a strong stance before you even ask for a line of code.*

> **🧪 Beta — currently being tested by 626Labs.** Vibe Thesis v0.1.x is functional but evolving — skill names, scaffold defaults, and orchestration prompts may shift before a stable v1.0 based on what we learn from our own use. Use it for real work; expect refinement. Issues and feedback welcome.

A Claude Code plugin that scaffolds and co-authors thesis-shaped artifacts —
academic dissertations, master's theses, long-form research articles,
position essays. Install, say *"scaffold a vibe thesis project for me,"*
get a styled PDF skeleton plus a working render pipeline in roughly 30 minutes.

Vibe Thesis ships Claude-Code-native orchestration for academic writing: dual
scaffold paths (offline-bundled or live `gh` template fork from
[ThesisStudio][thesisstudio]), an author-voice synthesis interview, and a
self-review-tone guard.

**Standalone-friendly.** Vibe Thesis works on its own with the bundled
templates — no other plugins required. It's *better* paired with
[Thesis Engine][thesis-engine] (an optional research feeder that gathers topics,
primary sources, opposing positions, and methodology across five research axes)
and with the [ThesisStudio][thesisstudio] template (richer styling and citation
defaults via `gh repo create --template`), but neither is required to start
writing. The dual scaffold path means even a fresh machine with no `gh` and no
sibling plugins can produce a working PDF in 30 minutes.

[thesisstudio]: https://github.com/estevanhernandez-stack-ed/ThesisStudio
[thesis-engine]: https://github.com/estevanhernandez-stack-ed/Thesis-Engine

## Install

### From the Anthropic plugin marketplace (preferred)

```text
/plugin marketplace add estevanhernandez-stack-ed/Vibe-Thesis
/plugin install vibe-thesis@vibe-thesis
```

### From a raw git URL (fallback)

```text
/plugin marketplace add https://github.com/estevanhernandez-stack-ed/Vibe-Thesis
/plugin install vibe-thesis@vibe-thesis
```

**After install, reload Claude Code's plugin registry** so the new skills are
discovered (the orchestrator skill `vibe-thesis` and the slash commands
`/vibe-thesis:vibe-render`, `/vibe-thesis:vibe-status`, `/vibe-thesis:voice`,
`/vibe-thesis:guard`). Either run `/plugin reload`, or close and reopen the
session — newly-installed plugins do not auto-discover until reload.

## Quickstart

1. Open Claude Code in a fresh empty directory.
2. Say: *"scaffold a vibe thesis project for me on `<your topic>`"* (or any
   natural-language equivalent — *"set up a vibe thesis project,"* *"I want to
   write a thesis on `<topic>`"*).
3. The orchestrator picks the right scaffold path automatically:
   - **Path B (default when `gh` is installed and authenticated):** `gh repo
     create --template estevanhernandez-stack-ed/ThesisStudio <name>` — your
     project gets a real GitHub remote at minute zero, plus the always-fresh
     ThesisStudio template.
   - **Path A (offline / no `gh`):** the plugin's bundled `templates/full/` is
     copied into the directory.
4. The project-local `/bootstrap` skill (lifted from ThesisStudio) interviews
   you for project title, author, mode (dissertation | article | masters), three
   pillar names, citation style, and license.
5. The plugin-side `/vibe-thesis:voice` interview names 2-4 well-known author
   voices + 2-4 contemporary field experts in your topic + a synthesis ratio.
   Writes a `## VOICE SYNTHESIS` block to CLAUDE.md so the LeadWriter persona
   reads it at drafting time.
6. Toolchain install: dev container (recommended) or native install.
7. Round-trip confirmation: `npm run render:pdf` against the bundled example
   produces `08_OUTPUT/pdf/example.pdf` — the install is verified.
8. Replace the demo content in `01_PLANNING/`, `03_BODY/`, `05_CITATIONS/`
   with your own. Talk to Claude as you go — it dispatches to the right
   sub-skill for each phase.

## Slash commands

| Command | What it does |
|---------|--------------|
| `/vibe-thesis:vibe-render [pdf\|html\|md\|all]` | Pre-runs `compile-tokens` + `check-citations`, then renders via Pandoc. |
| `/vibe-thesis:vibe-status` | One-screen summary: planning docs, body content, claim coverage, citations, last render. |
| `/vibe-thesis:voice [revise]` | Author-voice synthesis interview. Idempotent. |
| `/vibe-thesis:guard [strict\|standard]` | Self-review-tone lint over `03_BODY/*.md`. Advisory. |

## Project-local skills (from ThesisStudio templates payload)

| Skill | When to invoke |
|---|---|
| `/bootstrap` | First-fork customization. Re-runnable to revise. |
| `/merge-authors` | Braid multi-author drafts. |
| `/lay-translator` | Generate a layperson-readable version of body content. |
| `/research-integrate` | Pull research notes into body + bibliography. |

## Tech stack (in scaffolded projects, not the plugin itself)

The plugin ships templates; the plugin itself has zero npm runtime dependencies.

- [Pandoc](https://pandoc.org/) 3.1.13 (pinned via GitHub release in the dev container)
- [TeX Live](https://www.tug.org/texlive/) — `xelatex`, `biber`, `latexmk`
- Node 20+
- [`ajv`](https://ajv.js.org/) + `ajv-formats` for schema validation
- [`@retorquere/bibtex-parser`](https://github.com/retorquere/bibtex-parser) for citation lint
- [`husky`](https://typicode.github.io/husky/) 9 + `lint-staged`
- Fonts: JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk

## Dev container

The bundled dev container ships with three hard-won fixes baked in:

1. `install-fonts.sh` — pinned-release font install for the design system.
2. `.gitattributes` with `* text=auto eol=lf` — prevents Windows-side VS Code
   from CRLF-corrupting the Unix-style render scripts.
3. Persistent `~/.claude` volume mount — Claude Code config survives container
   rebuilds.

## Architecture

See [`plugins/vibe-thesis/docs/architecture.md`](plugins/vibe-thesis/docs/architecture.md)
for the condensed architecture. Key points:

- **Vibe Thesis wraps ThesisStudio**, doesn't fork it. ThesisStudio is the
  upstream source for the templates payload + the four content sub-skills.
- **Sub-skills ship project-local**, not plugin-side. The orchestrator
  dispatches to project-namespaced skills (e.g., `/bootstrap`) post-scaffold.
- **Single-source-of-truth design tokens** at `00_DESIGN_SYSTEM/tokens.yaml`
  drive both LaTeX `xcolor` and CSS variables. Brand layer is overridable per
  project.
- **`THESIS_MODE` is shift-emphasis-only** — switching modes never deletes
  files, just dims directories that aren't load-bearing for the chosen mode.
- **Marker-based detection** via `<!-- VIBE_THESIS_MARKER: vN.M -->` stanza in
  CLAUDE.md. Lets the orchestrator branch between scaffold-mode and iterate-mode
  without prompting on every invocation.

## License

[MIT](LICENSE) © 2026 626Labs LLC.

## Acknowledgments

- [ThesisStudio][thesisstudio] — the upstream template Vibe Thesis wraps.
- [`agentic-architect-vibe`](https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe) —
  the demonstration repo where this toolchain matured.
