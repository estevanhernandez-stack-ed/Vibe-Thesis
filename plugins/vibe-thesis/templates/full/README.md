# [YOUR THESIS TITLE]

> Forked from [ThesisStudio](https://github.com/estevanhernandez-stack-ed/ThesisStudio) — a structured AI-assisted workspace template for long-form academic writing. Run `/bootstrap` from inside Claude Code to customize this template for your project.

A workspace for [a PhD dissertation | a journal article | a master's thesis] on **[YOUR TOPIC]**, by **[YOUR NAME]**.

## Getting Started

### Option A — AI bootstrap (recommended)

1. Clone this repo. Open it in [Claude Code](https://claude.ai/claude-code).
2. Run `/bootstrap` — the interactive skill will ask for your project title, author, thesis mode, three pillar names, citation style, and license, then rewrite all placeholders for you.
3. Run `npm install`. Then `npm run render:pdf` on the example chapter to verify your toolchain.
4. Start writing in `03_BODY/`.

### Option B — Manual edit

1. Replace placeholders in `CLAUDE.md` (`[YOUR THESIS TITLE]`, `[YOUR_NAME]`, `[YOUR THREE PILLARS]`, `[THESIS_MODE]`).
2. Replace placeholders in this `README.md`.
3. Edit `package.json` — set `name`, `description`, `author`.
4. Choose a citation style by editing `00_DESIGN_SYSTEM/tokens.yaml` `citation.style` and `citation.csl_path`.
5. Run `npm install`, then `npm run render:pdf`.

See `docs/getting-started.md` for the full guided walkthrough.

## What's Inside

```text
00_DESIGN_SYSTEM/   Tokens, schemas, brand assets — visual identity for renders
01_PLANNING/        Proposal, outline, claims map
02_RESEARCH/        Raw research notes (parallel-agent-friendly subdirs)
03_BODY/            Chapters or sections — the main writing
04_AGENT_SWARMS/    Reusable playbooks for parallel research swarms
05_CITATIONS/       BibTeX library + CSL style files
06_REVIEW_RESPONSES/ Peer review tracking, organized by round
07_APPENDICES/      Supplementary materials
08_OUTPUT/          Generated PDFs / LaTeX / markdown (gitignored)
```

## Outputs

| Command | Produces |
| --- | --- |
| `npm run render:pdf` | `08_OUTPUT/pdf/thesis.pdf` (citation-styled, design-system applied) |
| `npm run render:latex` | `08_OUTPUT/latex/thesis.tex` (advisor / journal submission) |
| `npm run render:markdown` | `08_OUTPUT/markdown/thesis.md` (working-draft archive) |
| `npm run render:all` | All three |
| `npm run export:portable` | Plain-markdown zip archive — escape hatch from the toolchain |

Every render writes a `*.manifest.json` next to the output: timestamp, git commit, design-system version, source hashes, tool versions. Reviewers can verify exact reproducibility.

## Modes

`CLAUDE.md` carries a `THESIS_MODE` flag: `dissertation | article | masters`. The flag tells the lead writer which directories are load-bearing for your project. All directories coexist; mode just shifts emphasis. See `docs/architecture.md` for the per-mode active-dirs map.

## Research-Phase Agent Swarms

ThesisStudio ships with reusable swarm playbooks in `04_AGENT_SWARMS/` — lit-review swarm (5 parallel agents), counter-position swarm, primary-source swarm. Fill in `swarm-plan.md` for your topic and dispatch via Claude Code's Task tool. Convergence pattern documented in each playbook.

## Privacy

ThesisStudio doesn't phone home. No telemetry. No analytics. Build scripts run locally. Claude usage is your choice — using `/bootstrap`, the merge-authors skill, or swarm dispatch sends content to Anthropic; not using them keeps everything local.

## License

[MIT](LICENSE) — change it via `/bootstrap` or by editing `LICENSE` directly.

## Credits

Template developed @ [626Labs](https://626labs.dev). Sibling templates: [WriterStudio](https://github.com/estevanhernandez-stack-ed/WriterStudio) (fiction), [BlogStudio](https://github.com/estevanhernandez-stack-ed/BlogStudio) (short-form/vibe-coding).
