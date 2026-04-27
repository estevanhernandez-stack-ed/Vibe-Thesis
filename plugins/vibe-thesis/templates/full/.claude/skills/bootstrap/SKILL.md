---
name: bootstrap
description: Use when the user has just forked ThesisStudio and needs to customize the template — interviews them, then rewrites placeholders across CLAUDE.md, README.md, LICENSE, package.json. Idempotent — safe to re-run on a customized repo.
---

# Bootstrap Skill — ThesisStudio

You are helping a user customize a fresh fork of ThesisStudio. Your job is to interview them through 6 fields, then rewrite template placeholders across the repo.

## When to use

- A user says "/bootstrap", "set this up for me", "customize this template", "I just forked", "/onboard", or similar.
- You detect placeholder strings like `[YOUR THESIS TITLE]`, `[YOUR_NAME]`, `[PILLAR ONE NAME]` in `CLAUDE.md` or `README.md`.

## Detection: fresh fork vs. re-run

Check for the presence of the placeholder `[YOUR THESIS TITLE]` in `CLAUDE.md`.

- **Present** → fresh fork; ask all 6 fields with no defaults shown.
- **Absent** → repo is already customized; re-run mode. For each field, read the existing value from the right file and ask "use existing value `<X>` or overwrite?".

## Interview (one question per turn)

Ask in this order. Confirm each answer before moving to the next.

### 1. Project title

> "What's the title of your thesis or paper?"

Examples to offer if they hesitate:

- "Quantum Cryptography Under Adversarial Conditions"
- "Aesthetic Coherence in Late Anglo-Saxon Manuscripts"

Constraints: any string. Will appear in `CLAUDE.md`, `README.md`, `LICENSE` copyright line, `package.json` description.

### 2. Author name(s)

> "Who's the author? Comma-separate if multiple."

Constraints: at least one name. Will appear in `CLAUDE.md`, `README.md`, `package.json` author field, `LICENSE` copyright.

### 3. THESIS_MODE

> "Which mode best fits this project?
>
> - **dissertation** — multi-chapter, multi-year, formal defense, heavy lit review
> - **article** — 10–30pp single submission for peer review
> - **masters** — chapter structure with defense, lighter than PhD"

Constraints: one of `dissertation | article | masters`. Goes into `CLAUDE.md` `THESIS_MODE:` field.

### 4. Three pillar names

> "ThesisStudio uses three pillars to define the writing voice. The defaults from the spec are:
>
> - **Sourced Specificity** — every claim traceable; citations as load-bearing structure
> - **Disciplined Argument** — defends a real thesis; sections serve the spine
> - **Honest Limits** — qualifiers, alternative interpretations addressed in-text
>
> Do those land for your work, or do you want to rename them?"

Constraints: exactly 3 names. Will rewrite `[PILLAR ONE NAME]`, `[PILLAR TWO NAME]`, `[PILLAR THREE NAME]` in `CLAUDE.md`. (Defaults are good — encourage accepting them unless the user has strong feelings.)

### 5. Citation style

> "Default is Chicago Author-Date. Want to use that, or pick another? Common options: APA, MLA, Harvard, IEEE, Nature."

If they pick non-default:

- Search [Zotero Style Repository](https://www.zotero.org/styles) — confirm with the user before downloading any CSL file.
- Update `00_DESIGN_SYSTEM/tokens.yaml` `citation.style` and `citation.csl_path`.
- If they want a style we can't easily fetch, leave Chicago as default and note in the conversation that they should swap manually.

### 6. License

> "Default is MIT. Keep it, or pick something else? (e.g., Apache-2.0, BSD-3-Clause, GPL-3.0, CC-BY-4.0, proprietary)"

If they keep MIT, update the copyright year + name in `LICENSE`. If they pick something else, replace the `LICENSE` file entirely with the SPDX-standard text for that license.

## Files to rewrite

After interview, rewrite these files:

| File | Replacements |
| --- | --- |
| `CLAUDE.md` | `[YOUR THESIS TITLE]`, `[YOUR_NAME]`, `[THESIS_MODE]`, `[PILLAR ONE NAME]`, `[PILLAR TWO NAME]`, `[PILLAR THREE NAME]`, pillar description text |
| `README.md` | `[YOUR THESIS TITLE]`, `[YOUR_NAME]`, `[YOUR TOPIC]`, mode-line in opening paragraph |
| `LICENSE` | Copyright year + name (or full file replacement if non-MIT) |
| `package.json` | `name` (slugify title), `description`, `author`, `repository.url` (ask for GitHub URL) |
| `00_DESIGN_SYSTEM/tokens.yaml` | `citation.style`, `citation.csl_path` (if non-default) |

## After rewrite

Show the user a summary:

```text
Bootstrap complete. Rewrote:
  - CLAUDE.md       (title, author, mode, 3 pillars)
  - README.md       (title, author, topic)
  - LICENSE         (copyright year + name, MIT)
  - package.json    (name, description, author)
  - tokens.yaml     (citation style: chicago-author-date)

Next steps:
  1. npm install
  2. Edit 00_DESIGN_SYSTEM/tokens.yaml if you want to customize fonts/colors
  3. Edit 05_CITATIONS/references.bib with your bibliography
  4. Start writing in 03_BODY/01-introduction.md
  5. npm run render:pdf to verify the toolchain
```

## Idempotence

When re-running on a customized repo:

- For each field, show the existing value and ask "keep" or "overwrite".
- Never destructively reset without confirmation.
- The interview becomes a series of confirm-or-edit prompts, not fresh asks.

## Manual fallback

If the user says they prefer to do it manually, point them to `README.md` § "Option B — Manual edit" which lists every placeholder and its file. Don't argue.
