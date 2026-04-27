# Getting Started

Fork-to-first-chapter walkthrough. Target: writing your first paragraph in **15 minutes**.

---

## 1. Fork and clone

```bash
gh repo fork estevanhernandez-stack-ed/ThesisStudio --clone
cd ThesisStudio
```

Or click "Use this template" on GitHub, then `git clone` your new repo.

---

## 2. Bootstrap

### Option A — AI bootstrap (recommended; ~3 min)

Open the repo in [Claude Code](https://claude.ai/claude-code). Run:

```text
/bootstrap
```

The skill asks:

1. Project title
2. Author name(s)
3. `THESIS_MODE` — `dissertation | article | masters`
4. Three pillar names (defaults from spec are good — accept unless you have strong opinions)
5. Citation style (default: Chicago Author-Date)
6. License (default: MIT)

It rewrites placeholders across `CLAUDE.md`, `README.md`, `LICENSE`, `package.json`, and `00_DESIGN_SYSTEM/tokens.yaml`. Idempotent — safe to re-run.

### Option B — Manual edit (~10 min)

If you don't use Claude Code:

1. Open `CLAUDE.md`. Replace `[YOUR THESIS TITLE]`, `[YOUR_NAME]`, `[THESIS_MODE]`, three `[PILLAR NAME]` fields.
2. Open `README.md`. Replace the title and author placeholders.
3. Open `LICENSE`. Update copyright year and name.
4. Open `package.json`. Update `name`, `description`, `author`.
5. Open `00_DESIGN_SYSTEM/tokens.yaml`. Set citation style if not default.

---

## 3. Install

```bash
npm install
```

Installs dev dependencies + sets up Husky pre-commit hooks.

For the full toolchain (Pandoc + LuaLaTeX), either:

- **Use the devcontainer** — open in VS Code, click "Reopen in Container". Toolchain comes pre-bundled. Zero local install.
- **Install locally** — see [Pandoc install](https://pandoc.org/installing.html) and [TeX Live install](https://www.tug.org/texlive/). Allow ~3GB for TeX Live.

---

## 4. Verify the toolchain

```bash
npm run compile:tokens
npm run validate
npm run render:markdown   # works without Pandoc
npm run render:pdf        # needs Pandoc + LuaLaTeX
```

Outputs land in `08_OUTPUT/{markdown,latex,pdf}/`. Each gets a `*.manifest.json` sidecar with reproducibility data.

If `render:pdf` fails, see `docs/troubleshooting.md`.

---

## 5. Set up citations

1. Edit `05_CITATIONS/references.bib`. Add your bibliography entries; remove or keep the sample entries.
2. Download your CSL style if not using the default — see `05_CITATIONS/styles/README.md`.
3. Test: run `npm run check:citations`. Should be clean (no body files yet).

---

## 6. Start writing

`03_BODY/` is where the writing lives. Files are numbered for ordering — render scripts concatenate in numeric order.

```bash
# Create your first chapter file
touch 03_BODY/01-introduction.md
```

Open `03_BODY/01-introduction.md`. Write a heading, write a paragraph, save.

Run `npm run render:pdf`. Open `08_OUTPUT/pdf/thesis.pdf`. You're shipping.

---

## 7. (Optional) Dispatch your first agent swarm

For lit review or counter-position research, swarms run faster than hand-research. From Claude Code:

1. Pick a playbook in `04_AGENT_SWARMS/` — start with `lit-review-swarm.md` if you're scoping a new field.
2. Copy `swarm-plan.template.md` → `swarm-plan-<descriptor>.md`. Fill in the YAML frontmatter.
3. Ask Claude to dispatch the swarm via Task tool — one Task per agent in parallel.
4. After agents return, run the convergence step described in the playbook.

The output lands in `02_RESEARCH/<axis>/` ready for synthesis into your lit review.

---

## What's next

- **Multi-author work?** → `03_BODY/multi-author/README.md`
- **Peer review cycle?** → `06_REVIEW_RESPONSES/README.md`
- **Customizing visual identity?** → `00_DESIGN_SYSTEM/README.md`
- **Adding output formats?** → `docs/architecture.md` § Render pipeline
- **Hit a bug or have a question?** → `docs/troubleshooting.md` first; if unanswered, [open an issue](https://github.com/estevanhernandez-stack-ed/ThesisStudio/issues/new/choose)

---

## The 15-minute checkpoint

If you're past 15 min and still not writing, something's blocking you. Common culprits:

- Stuck on bootstrap field decisions → accept defaults; you can revise later via re-running `/bootstrap`
- Pandoc / LuaLaTeX install errors → use the devcontainer, skip local install entirely
- Don't know what `THESIS_MODE` to pick → default to `dissertation` if PhD; `masters` if master's; `article` if a single paper

The template is supposed to *get out of your way*. If it's slowing you down, file an issue — that's a template bug.
