# Architecture Decision Records

Each ADR captures a single major architectural decision with the reasoning behind it. Format follows [Michael Nygard's classic template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Why ADRs

Templates accumulate hidden decisions over time — "why is the citation pipeline structured this way?", "why did we pick LuaLaTeX over pdflatex?", "why does the swarm dispatch go through Claude Code's Task tool instead of an external orchestrator?". Without ADRs, future maintainers (or future-you) have to reverse-engineer the reasoning from git history. With them, the *why* is preserved next to the *what*.

## Format

Every ADR has:

- **Title** — short, action-oriented
- **Status** — Proposed / Accepted / Deprecated / Superseded by ADR-NN
- **Context** — what the situation was when the decision was made
- **Decision** — what was decided
- **Consequences** — what becomes easier or harder as a result

## Adding a new ADR

1. Pick the next number (e.g., `0006-`).
2. Use a short, action-oriented filename: `0006-rename-output-dir.md`.
3. Follow the template format.
4. Reference the ADR from related code or PR descriptions so the link is visible.

## Index

| # | Title | Status |
| --- | --- | --- |
| 0001 | [Mode flag architecture](0001-mode-flag-architecture.md) | Accepted |
| 0002 | [Pandoc + LuaLaTeX render toolchain](0002-pandoc-lualatex-toolchain.md) | Accepted |
| 0003 | [YAML tokens with compile step](0003-yaml-tokens-with-compile-step.md) | Accepted |
| 0004 | [Claude Code skill for bootstrap](0004-claude-skill-bootstrap.md) | Accepted |
| 0005 | [Task tool subagents for swarm dispatch](0005-task-tool-swarm-dispatch.md) | Accepted |
