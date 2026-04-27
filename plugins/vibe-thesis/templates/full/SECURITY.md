# Security Policy

ThesisStudio is a template repository. Most "security" concerns relate to the **scaffolding scripts** (Node.js code in `scripts/`, hooks in `.husky/`, CI workflows in `.github/workflows/`) — not to user content.

## What's in scope

| Concern | In scope? |
| --- | --- |
| Command injection in render or validation scripts | Yes — report it |
| Schema validation that misses obviously bad input | Yes — report it |
| CI workflow that exposes secrets or runs untrusted code | Yes — report it |
| Devcontainer image with known CVEs in bundled tools | Yes — report it |
| Pandoc / LuaLaTeX vulnerabilities (upstream) | Out of scope — report to those projects |
| Your forked thesis content (e.g., LaTeX command injection from user input) | Out of scope — that's your responsibility in your fork |
| Your CSL file or BibTeX library content | Out of scope — content is your concern |

## Reporting a vulnerability

Email **security@626labs.dev** with:

- A description of the issue and where it lives in the codebase
- Steps to reproduce (proof-of-concept welcome)
- Your assessment of severity

We aim to acknowledge reports within 72 hours. Critical issues will be addressed in a patch release; lower-severity issues bundled into the next regular release.

## Scope of "ThesisStudio" for this policy

Only the contents of the upstream `ThesisStudio` template repo. Forks are the forker's responsibility. If you find a bug in someone's published thesis fork, contact them directly.

## Safe-by-default principles

The template adheres to:

- All shell-out calls in scripts use `execFile` / `spawn` with explicit argument arrays — never `exec` with string concatenation.
- Schemas in `00_DESIGN_SYSTEM/schemas/` set `additionalProperties: false` to fail loudly on unexpected input.
- CI workflows pin tool versions where security-relevant.
- No telemetry. No phone-home. No third-party network calls except those the user explicitly invokes (Pandoc reading a remote CSL, npm install, Claude Code).
