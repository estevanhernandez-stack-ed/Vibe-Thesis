<p align="center">
  <img alt="Vibe Thesis — start with a strong stance" src="https://626labs.dev/assets/brand/plugins/vibe-thesis-banner-1500x500.png" />
</p>

# Vibe Thesis

**Start with a strong stance before you even ask for a line of code. (beta)**

[![stable](https://img.shields.io/github/v/tag/estevanhernandez-stack-ed/Vibe-Thesis?label=stable&color=17d4fa)](https://github.com/estevanhernandez-stack-ed/Vibe-Thesis/tags)

> **Beta — currently being tested by 626 Labs.** Vibe Thesis is functional but evolving — skill names, scaffold defaults, and orchestration prompts may shift before a stable v1.0 based on what we learn from our own use. Use it for real work; expect refinement. Issues and feedback welcome.

## What it does

A Claude Code plugin that scaffolds and co-authors thesis-shaped artifacts — academic dissertations, master's theses, long-form research articles, position essays. Install, say *"scaffold a vibe thesis project for me,"* and get a styled PDF skeleton plus a working render pipeline in roughly 30 minutes.

Vibe Thesis ships Claude-Code-native orchestration for academic writing:

- **Dual scaffold paths** — offline-bundled templates, or a live `gh` template fork from [ThesisStudio][thesisstudio].
- **Author-voice synthesis** — an interview that names 2-4 well-known author voices plus 2-4 contemporary field experts in your topic, with a synthesis ratio.
- **Self-review-tone guard** — an advisory lint over body content that flags inflationary language, self-praise, and over-qualification.

**Standalone-friendly.** Vibe Thesis works on its own with the bundled templates — no other plugins required. It's *better* paired with [Thesis Engine][thesis-engine] (an optional research feeder that gathers topics, primary sources, opposing positions, and methodology across five research axes) and with the [ThesisStudio][thesisstudio] template (richer styling and citation defaults via `gh repo create --template`), but neither is required to start writing. The dual scaffold path means even a fresh machine with no `gh` and no sibling plugins can produce a working PDF in 30 minutes.

[thesisstudio]: https://github.com/estevanhernandez-stack-ed/ThesisStudio
[thesis-engine]: https://github.com/estevanhernandez-stack-ed/Thesis-Engine

## How it works

Open Claude Code in a fresh empty directory, say *"scaffold a vibe thesis project for me on `<your topic>`,"* and the orchestrator runs the flow:

1. **Pick the scaffold path automatically.**
   - **Path B (default when `gh` is installed and authenticated):** `gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>` — your project gets a real GitHub remote at minute zero, plus the always-fresh ThesisStudio template.
   - **Path A (offline / no `gh`):** the plugin's bundled `templates/full/` is copied into the directory.
2. **Bootstrap interview** — the project-local `/bootstrap` skill (lifted from ThesisStudio) asks for project title, author, mode (dissertation | article | masters), three pillar names, citation style, and license.
3. **Voice synthesis** — `/vibe-thesis:voice` names your author voices and writes a `## VOICE SYNTHESIS` block to CLAUDE.md so the LeadWriter persona reads it at drafting time.
4. **Toolchain install** — dev container (recommended) or native install.
5. **Round-trip confirmation** — `npm run render:pdf` against the bundled example produces `08_OUTPUT/pdf/example.pdf`, verifying the install.
6. **Write** — replace the demo content in `01_PLANNING/`, `03_BODY/`, `05_CITATIONS/` with your own. Talk to Claude as you go; it dispatches to the right sub-skill for each phase.

**After install, reload Claude Code's plugin registry** so the new skills are discovered (the orchestrator skill `vibe-thesis` and the slash commands `/vibe-thesis:vibe-render`, `/vibe-thesis:vibe-status`, `/vibe-thesis:voice`, `/vibe-thesis:guard`). Either run `/plugin reload`, or close and reopen the session — newly-installed plugins do not auto-discover until reload.

### Slash commands

| Command | What it does |
|---------|--------------|
| `/vibe-thesis:vibe-render [pdf\|html\|md\|all]` | Pre-runs `compile-tokens` + `check-citations`, then renders via Pandoc. |
| `/vibe-thesis:vibe-status` | One-screen summary: planning docs, body content, claim coverage, citations, last render. |
| `/vibe-thesis:voice [revise]` | Author-voice synthesis interview. Idempotent. |
| `/vibe-thesis:guard [strict\|standard]` | Self-review-tone lint over `03_BODY/*.md`. Advisory. |

### Project-local skills (from the ThesisStudio templates payload)

| Skill | When to invoke |
|---|---|
| `/bootstrap` | First-fork customization. Re-runnable to revise. |
| `/merge-authors` | Braid multi-author drafts. |
| `/lay-translator` | Generate a layperson-readable version of body content. |
| `/research-integrate` | Pull research notes into body + bibliography. |

### Tech stack (in scaffolded projects, not the plugin itself)

The plugin ships templates; the plugin itself has zero npm runtime dependencies.

- [Pandoc](https://pandoc.org/) 3.1.13 (pinned via GitHub release in the dev container)
- [TeX Live](https://www.tug.org/texlive/) — `xelatex`, `biber`, `latexmk`
- Node 20+
- [`ajv`](https://ajv.js.org/) + `ajv-formats` for schema validation
- [`@retorquere/bibtex-parser`](https://github.com/retorquere/bibtex-parser) for citation lint
- [`husky`](https://typicode.github.io/husky/) 9 + `lint-staged`
- Fonts: JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk

### Dev container

The bundled dev container ships with three hard-won fixes baked in:

1. `install-fonts.sh` — pinned-release font install for the design system.
2. `.gitattributes` with `* text=auto eol=lf` — prevents Windows-side VS Code from CRLF-corrupting the Unix-style render scripts.
3. Persistent `~/.claude` volume mount — Claude Code config survives container rebuilds.

### Architecture

See [`plugins/vibe-thesis/docs/architecture.md`](plugins/vibe-thesis/docs/architecture.md) for the condensed architecture. Key points:

- **Vibe Thesis wraps ThesisStudio**, doesn't fork it. ThesisStudio is the upstream source for the templates payload plus the four content sub-skills.
- **Sub-skills ship project-local**, not plugin-side. The orchestrator dispatches to project-namespaced skills (e.g., `/bootstrap`) post-scaffold.
- **Single-source-of-truth design tokens** at `00_DESIGN_SYSTEM/tokens.yaml` drive both LaTeX `xcolor` and CSS variables. The brand layer is overridable per project.
- **`THESIS_MODE` is shift-emphasis-only** — switching modes never deletes files, just dims directories that aren't load-bearing for the chosen mode.
- **Marker-based detection** via `<!-- VIBE_THESIS_MARKER: vN.M -->` stanza in CLAUDE.md. Lets the orchestrator branch between scaffold-mode and iterate-mode without prompting on every invocation.

## Validated on

The [`agentic-architect-vibe`](https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe) article — the toolchain was proven via the completed article itself.

## Install

**Stable (recommended) — as a Claude Code plugin via the marketplace:**

```text
/plugin marketplace add estevanhernandez-stack-ed/vibe-plugins
/plugin install vibe-thesis@vibe-plugins
```

**Canary — track this repo's `main`:**

```text
/plugin install vibe-thesis@estevanhernandez-stack-ed/Vibe-Thesis
```

## Part of the Vibe ecosystem

Part of the **[Vibe Plugins](https://github.com/estevanhernandez-stack-ed/vibe-plugins)** marketplace from [626 Labs](https://626labs.dev) — foundations and process pillars for AI-assisted creation.

```text
/plugin marketplace add estevanhernandez-stack-ed/vibe-plugins
```

### Acknowledgments

- [ThesisStudio][thesisstudio] — the upstream template Vibe Thesis wraps.
- [`agentic-architect-vibe`](https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe) — the demonstration repo where this toolchain matured.

## License

[MIT](LICENSE) — *Imagine Something Else.*
