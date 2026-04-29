# Vibe Thesis — Plugin Instructions

You are operating inside the Vibe Thesis Claude Code plugin.

## What this plugin does

Vibe Thesis scaffolds and co-authors thesis-shaped projects (academic
dissertations, master's theses, long-form research articles, position
essays). It wraps the [ThesisStudio][thesisstudio] template with four
plugin-side skill clusters:

1. **`vibe-thesis`** (orchestrator) — auto-invoked on natural-language
   scaffold or iterate intent. Sources the workspace via Path A
   (offline plugin-bundled) or Path B (`gh repo create --template
   ThesisStudio`), dispatches the project-local `/bootstrap`, runs
   `/vibe-thesis:voice`, and confirms round-trip via `npm run render:pdf`.
2. **`vibe-render`** + **`vibe-status`** — Claude-Code-native wrappers
   around the render pipeline and project state.
3. **Voice pipeline** — three skills that compose:
   - **`voice-synthesis`** captures the author voice (base block plus
     extended layers via `/vibe-thesis:voice extend`: written exemplars,
     narrative samples, forced-choice extracted micro/macro rules).
   - **`synthesis-smooth`** applies the captured voice to a draft via
     multi-pass rewrite (micro / rhythm / macro / exemplar-comparison).
   - **`synthesis-guard`** lints the result for self-review tone.
4. The voice pipeline layers on top of ThesisStudio's three persona
   pillars and is the engine behind `/vibe-thesis:voice`,
   `/vibe-thesis:smooth`, `/vibe-thesis:guard`.

[thesisstudio]: https://github.com/estevanhernandez-stack-ed/ThesisStudio

## Entry point

The orchestrator skill at `skills/vibe-thesis/SKILL.md` is the brain. It
auto-invokes when the user expresses scaffold intent in a fresh directory,
or when working inside a directory marked with the
`<!-- VIBE_THESIS_MARKER: vN.M -->` stanza in `CLAUDE.md`.

Read `skills/vibe-thesis/SKILL.md` for the full decision tree.

## Sub-skills the orchestrator dispatches to

**Plugin-side** (this plugin, `skills/<name>/SKILL.md`):

- `voice-synthesis` — runs the author-voice interview after bootstrap.
  Base mode captures anchors + ratio; `extend` mode adds the layers
  needed for `synthesis-smooth` (written exemplars, narrative samples,
  forced-choice extracted rules).
- `synthesis-smooth` — applies the captured voice profile to a draft
  via multi-pass rewrite. Output to `<draft>.smoothed.md`. The middle
  step in the voice pipeline (capture → apply → lint).
- `synthesis-guard` — self-review-tone lint over body content.
- `vibe-render` — wraps the render pipeline.
- `vibe-status` — composes the project state report.

**Project-local** (lifted from ThesisStudio into the user's
`.claude/skills/<name>/SKILL.md` via the templates payload):

- `bootstrap` — 6-question interview (title, author, mode, three pillars,
  citation style, license). Rewrites placeholders.
- `merge-authors` — braids multi-author drafts.
- `lay-translator` — generates a layperson-readable version.
- `research-integrate` — pulls research notes into body + bib.

The orchestrator dispatches to project-local skills via the Skill tool with
the project namespace (e.g., `/bootstrap`, not `/vibe-thesis:bootstrap`).
The plugin does not fork or duplicate ThesisStudio's sub-skills; it lets
them ship inside the templates payload.

## Sibling-repo hard guard

Refuse any operation whose path resolves to `agentic-architect-vibe`. That
repo is the article-source-of-truth for the toolchain Vibe Thesis extracts;
modifying it would break the article. See the orchestrator's "Sibling-repo
hard guard" section for the check.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the condensed plugin
architecture (single-file ADR for plugin distribution).

## Do not

- Do not modify ThesisStudio source content from inside this plugin. The
  templates payload is a snapshot; refresh it via the documented procedure
  in `docs/architecture.md > Templates payload`, not by editing files in
  place.
- Do not fork the project-local sub-skills (`bootstrap`, `merge-authors`,
  `lay-translator`, `research-integrate`) into the plugin's `skills/` dir.
  They belong inside `templates/full/.claude/skills/`.
- Do not silently mark a scaffold-mode round-trip as successful when
  `npm run render:pdf` fails. The single non-negotiable acceptance criterion
  is "install plugin + scaffold + round-trip works on first try, no manual
  fixups." Surface failures honestly.
