# ADR 0004 — Claude Code skill as the primary bootstrap UX

**Status:** Accepted

## Context

After fork, the user must replace `[YOUR THESIS TITLE]`, `[YOUR_NAME]`, three pillar names, `THESIS_MODE`, citation style, and license fields across `CLAUDE.md`, `README.md`, `LICENSE`, `package.json`. Options for delivering this UX:

- **Manual edit** — user opens each file, finds placeholders, edits. WriterStudio does this.
- **Bootstrap script** — `./bootstrap.sh` prompts in terminal, rewrites files. Standard but rigid.
- **AI-driven Claude Code skill** — interactive interview with context-aware defaults.

## Decision

Adopted **Claude Code skill** as the primary UX (`.claude/skills/bootstrap/SKILL.md`). Manual-edit fallback is documented in `README.md` for users without Claude Code.

The skill can offer context-aware defaults ("the spec defaults are Sourced Specificity / Disciplined Argument / Honest Limits — accept or rename?"), handle the citation-style decision intelligently (search Zotero Style Repository if user picks non-default), and idempotently re-run on already-customized repos by asking "keep / overwrite" per field.

The template is AI-native by design (it ships with swarm playbooks, merge-authors as a skill, etc.). Bootstrap-as-skill matches that stance.

## Consequences

**Easier:**

- Users who already use Claude Code get a guided, low-friction onboarding.
- Idempotent re-runs are safe — accidental re-runs don't clobber customization.
- Onboarding can grow new fields over time without breaking existing forks.

**Harder:**

- Users without Claude Code rely on the manual-edit fallback. Documentation must keep both paths first-class.
- A breaking change in the skill format (Claude Code SKILL.md schema) would require updating the template. Mitigated by Claude Code's stable skill format.
- The skill itself is a maintenance surface — when bootstrap fields change, two places need updates (the skill + the manual-fallback docs in README).

Approved with the explicit constraint: **manual fallback is always documented and tested**, never deprecated.
