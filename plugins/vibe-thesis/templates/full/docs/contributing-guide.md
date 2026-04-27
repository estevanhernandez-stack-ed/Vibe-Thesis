# Contributing Guide

How to contribute back to the ThesisStudio template (vs. customizing your fork).

For the lighter-weight version, see [CONTRIBUTING.md](../CONTRIBUTING.md). This file expands on the principles and walks through common contribution scenarios.

---

## What kind of contributions help?

| Contribution | Helpful? |
| --- | --- |
| Bug in a render script that all forks would hit | **Yes** — file an issue, then PR |
| New swarm playbook with broad academic utility | **Yes** — add to `04_AGENT_SWARMS/`, update README |
| New CSL style that's broadly used in a field | **Maybe** — open an issue first; CSL repository is the canonical home, but bundling a few common ones could be reasonable |
| Output format adapter (e.g., Word/.docx, EPUB) | **Yes** — significant scope; open an issue, draft an ADR |
| Documentation improvements (typos, missing sections, unclear explanations) | **Yes** — small PRs welcome |
| Performance improvement to a render script | **Yes** — include before/after timings |
| Customization specific to your field/journal | **No** — keep in your fork; templates need to stay general |
| Renaming the template or restructuring directories | **No without discussion** — open an issue first; this affects every fork |

---

## Setting up for development

```bash
git clone https://github.com/estevanhernandez-stack-ed/ThesisStudio.git
cd ThesisStudio
npm install
```

For full render-pipeline development, use the devcontainer (`.devcontainer/`). Local install of TeX Live + Pandoc works but takes longer.

---

## Code style

### Scripts (`scripts/`)

- **Node.js, ES2022.** No TypeScript (low overhead matters more than typed safety here).
- **Process spawning rules.** Always use `execFile` or `spawn` with explicit argument arrays. Never use the shell-string variant — it's a command-injection risk when paths or arguments contain special characters. The pre-commit hook + grep-during-review enforce this.
- **Small, focused modules.** `scripts/lib/` holds reusable pieces; render scripts are thin orchestrators that call into `lib/`.
- **Honest error messages.** Surface tool stderr; don't swallow. Include install hints when a missing tool is the cause.
- **No silent fallbacks.** If a configured CSL file is missing, *warn* — don't quietly use Pandoc's default and let the user discover the wrong style at submission time.

### Markdown

- **markdownlint-cli2** validates everything. Config in `.markdownlint.json`.
- **ATX headings only** (`#`, `##`, ...) — no setext.
- **Fenced code blocks with language** when applicable (`text` is fine for plain output).
- **Tables** — use the GFM-compatible pipe syntax. Tools render this everywhere.

### Schemas

- **JSON Schema draft-07.**
- **`additionalProperties: false`** on the root of every schema. Strict-by-default catches typos.
- **Pattern matching** for things like hex colors, dates, semver. Don't accept "any string" if you mean "a hex color".

### Documentation

- **Lead with the answer.** README and getting-started should let a forking user *do something* before reading the architecture deep-dive.
- **Tables for matrices.** Per-mode behaviors, per-feature support, etc.
- **Concrete examples.** Show the command, show the output, show what to do next.
- **Honest limits.** If something's deliberately not supported (e.g., Word output), say so. Pillar 3 of the template's persona applies to its own docs.

---

## Pull request process

1. **Open an issue first** for non-trivial changes. Saves both you and the maintainer time.
2. **Create a feature branch:** `git checkout -b feature/short-descriptor`
3. **Make the change** — include tests/fixtures where applicable.
4. **Validate locally:**

   ```bash
   npm run lint:md
   npm run validate
   # If you touched a render script:
   cd examples/dissertation-chapter && npm run render:pdf
   ```

5. **Update docs** — if user-facing behavior changed, update `README.md`, `docs/getting-started.md`, or `docs/architecture.md` as appropriate.
6. **Update or add an ADR** for architectural changes (see `docs/adr/README.md`).
7. **Open the PR** using the template. Be specific about what changed and why. Link the issue you opened in step 1.

CI runs automatically on PR. Your PR can be merged when:

- All CI checks pass
- A maintainer has reviewed and approved
- Conversations are resolved

---

## Adding a new swarm playbook

1. Drop the file in `04_AGENT_SWARMS/<playbook-name>.md`.
2. Follow the structure used by existing playbooks (When to use / When NOT / Inputs / Agents / Convergence / Cost note / Failure handling).
3. Add the playbook to the enum in `00_DESIGN_SYSTEM/schemas/swarm-plan.schema.json` `playbook` field.
4. Add a fixture in `examples/` showing a completed `swarm-plan-<name>-example.md` if the playbook is non-obvious.
5. Update `04_AGENT_SWARMS/README.md` to list the new playbook.
6. ADR: `docs/adr/<NN>-add-<playbook-name>-swarm.md` if the playbook introduces new conventions.

---

## Adding a new output format adapter

This is a substantial change. Open an issue and draft an ADR before writing code. The ADR should cover:

- What the new format provides that PDF/LaTeX/markdown doesn't
- The toolchain it requires (and CI implications)
- How it integrates with the design system
- Long-term maintenance burden

Example future adapters that might warrant this: `.docx` (advisor markup), EPUB (long-form sharing), HTML (web preview).

---

## Reporting security issues

See [SECURITY.md](../SECURITY.md). Don't open public issues for security problems.

---

## Maintainer expectations

- **Response time:** Aim for ack within 5 days, substantive response within 14.
- **Communication style:** Direct. Disagreement is fine; explain it. No corporate politeness theater.
- **Decisions:** When a contributor proposal goes a different direction than maintainers want, we'll explain why. ADRs document the reasoning so future contributors don't re-litigate.
