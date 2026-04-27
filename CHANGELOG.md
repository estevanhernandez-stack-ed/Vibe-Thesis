# Changelog

All notable changes to Vibe Thesis are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] — 2026-04-26 (in progress)

Initial release. The scope is v0.1 — install the plugin, say "scaffold a
vibe thesis project for me," get a styled PDF skeleton plus a working
render pipeline in roughly 30 minutes.

### Added

- Plugin manifest at `.claude-plugin/plugin.json` (Claude Code auto-discovery).
- Marketplace listing at `.claude-plugin/marketplace.json`.
- Orchestrator skill `vibe-thesis` — auto-invoked on natural-language scaffold or iterate intent. Bridges to ThesisStudio's project-local `/bootstrap`, then to plugin-side `/vibe-thesis:voice`, then runs round-trip confirmation against the bundled example.
- Slash command `/vibe-thesis:vibe-render` — wraps `npm run render:pdf|html|md|all` with pre-step token compile + citation check.
- Slash command `/vibe-thesis:vibe-status` — one-screen summary of project state (planning docs, body content, claim coverage, citations, last render).
- Slash command `/vibe-thesis:voice` — interview-driven author-voice synthesis. Names 2-4 well-known authors + 2-4 contemporary field experts + ratio; appends a `## VOICE SYNTHESIS` block to CLAUDE.md so the LeadWriter persona reads it at drafting time.
- Slash command `/vibe-thesis:guard` — self-review-tone lint. Scans `03_BODY/*.md` for inflationary language, self-praise framings, defensive over-qualification, conclusions that re-assert importance instead of letting findings speak. Advisory; doesn't auto-fix.
- Templates payload `templates/full/` — current ThesisStudio clone + `.gitattributes` (eol=lf) + VIBE_THESIS_MARKER stanza in CLAUDE.md.
- Templates payload `templates/overlay/` — local-additions diff applied on top of `gh repo create --template ThesisStudio`.
- Bundled worked example `examples/demo-article/` — 3-page rubber-duck-debugging article that round-trips through `npm run render:pdf` on first scaffold.
- Dual scaffold path: Path A (offline, plugin-bundled) and Path B (`gh repo create --template ThesisStudio`), with auto-detection on `gh` availability + auth.
- Three hard-won dev-container fixes baked in via the templates payload: `install-fonts.sh`, `.gitattributes` LF normalization, persistent `~/.claude` volume mount.
- `docs/architecture.md` — condensed plugin architecture (single-file ADR for plugin distribution).

### Notes

- Vibe Thesis is a **wrapper around ThesisStudio**, not a fork. ThesisStudio remains the upstream source of truth for the templates payload, the project-local `/bootstrap` skill, and the four content sub-skills (`bootstrap`, `merge-authors`, `lay-translator`, `research-integrate`). The plugin's value is Claude-Code-native orchestration + voice synthesis + self-review-tone guard.
- Sub-skills (`bootstrap`, `merge-authors`, `lay-translator`, `research-integrate`) ship as project-local skills inside `templates/full/.claude/skills/` — automatically present in any scaffolded project, no plugin-side fork.
