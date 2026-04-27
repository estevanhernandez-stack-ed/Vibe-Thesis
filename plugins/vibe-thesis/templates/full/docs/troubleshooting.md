# Troubleshooting

Common errors and how to resolve them.

---

## Render: PDF fails with "pdflatex not found" or "lualatex not found"

```text
pandoc-runner: LuaLaTeX not found in PATH.
  Install TeX Live with LuaLaTeX: https://www.tug.org/texlive/
  Or use the included devcontainer (Pandoc + LuaLaTeX bundled)
```

**Fix:** install TeX Live (~3GB) OR use the devcontainer (`.devcontainer/`). The devcontainer is faster to set up than installing TeX Live locally.

If you want minimum TeX Live: `apt-get install texlive-luatex texlive-latex-extra texlive-fonts-recommended texlive-bibtex-extra biber` (Ubuntu) or `brew install --cask basictex` then `tlmgr install` extras (macOS).

---

## Render: PDF fails with "Undefined control sequence" in LuaLaTeX

LuaLaTeX log shows something like:

```text
! Undefined control sequence.
l.42 \setmainfont
                {Source Serif Pro}
```

**Cause:** `compile-tokens.js` generated a preamble using `fontspec` + `\setmainfont`, which require LuaLaTeX (or XeLaTeX) — not pdflatex. If somehow `pdflatex` got invoked, this fails.

**Fix:** confirm `lualatex` is the engine being used. `scripts/render-pdf.js` calls `lualatex` explicitly via `runLuaLatex` in `scripts/lib/pandoc-runner.js`. If you've customized the render script, check there.

If you want pdflatex compatibility, swap `\setmainfont` for `\usepackage[T1]{fontenc}` etc. in `scripts/compile-tokens.js` — but you'll lose modern font support.

---

## Render: citations show as `[@authorYear]` literal in the output

**Cause:** Pandoc's `--citeproc` flag wasn't applied, OR your `.bib` file is missing the cited keys, OR the CSL file isn't where `tokens.yaml` says it is.

**Fix:**

1. Run `npm run check:citations`. If it reports missing keys, add them to `05_CITATIONS/references.bib`.
2. Confirm `00_DESIGN_SYSTEM/tokens.yaml` `citation.csl_path` points to a real file.
3. Confirm the CSL file exists at that path. Default is `05_CITATIONS/styles/chicago-author-date.csl` — see `05_CITATIONS/styles/README.md` for download instructions if missing.

`render-latex.js` will warn at the console if the CSL file is declared but missing.

---

## Render: figure references like `\ref{fig:methodology}` show as `??`

**Cause:** LuaLaTeX needs at least two passes to resolve cross-references — the first pass builds the `.aux` file, the second resolves references against it.

**Fix:** `render-pdf.js` already runs LuaLaTeX twice. If you're still seeing `??`, you may need a third pass for unusually complex documents. Manually:

```bash
cd 08_OUTPUT/latex
lualatex -interaction=nonstopmode thesis.tex
```

Run that third pass. If references still aren't resolving, check the LuaLaTeX log for unresolved labels.

---

## Schema validation fails after editing `tokens.yaml`

```text
Schema validation: 1 failure(s).

  00_DESIGN_SYSTEM/tokens.yaml /typography/base_size
    must match pattern "^\\d+(\\.\\d+)?(pt|px|em|rem)$"
```

**Cause:** A token value doesn't match the schema's expected pattern. The error includes the JSON Path and the constraint.

**Fix:** read the schema (`00_DESIGN_SYSTEM/schemas/tokens.schema.json`) for the expected format and update your value. Common mistakes:

- `base_size: 11` → must be `"11pt"` (string with unit)
- `colors.text: "1a1a1a"` → must be `"#1a1a1a"` (with `#`)
- Adding a field at top level that's not in the schema (set to `additionalProperties: false`)

---

## Bootstrap skill says it can't find placeholders

Re-running `/bootstrap` on an already-customized repo expects to find current values to ask "keep / overwrite". If it can't find them:

**Cause:** the placeholder pattern in `CLAUDE.md` or `README.md` was edited away during manual customization.

**Fix:** the bootstrap skill falls back to interview-mode if it can't detect prior values. Just walk through the questions; the skill rewrites everything based on your answers.

---

## Mode switch behaviour

You changed `THESIS_MODE` from `dissertation` to `article`. What happens?

- **What stays:** all files in all directories. Nothing is deleted.
- **What changes:** the active-dirs map (used by render scripts and documented in `CLAUDE.md`) shifts. Render uses the same `03_BODY/` files but treats them as article sections rather than dissertation chapters in numbering and structure.
- **Caveat:** if you wrote with dissertation conventions (chapter-level `#` headings) and switch to article, the heading hierarchy may look off. Adjust headings if needed.

The flag is a hint to you and the render pipeline, not a destructive switch.

---

## CI fails on a fresh PR with `chicago-author-date.csl: not found`

**Cause:** the CSL file isn't bundled in the repo (see `05_CITATIONS/styles/README.md`). CI needs to fetch it.

**Fix:** add a CI step that downloads the CSL before running renders. The default `.github/workflows/ci.yml` should include this; if it's missing, add:

```yaml
- name: Download default CSL
  run: |
    curl -L https://raw.githubusercontent.com/citation-style-language/styles/master/chicago-author-date.csl \
      -o 05_CITATIONS/styles/chicago-author-date.csl
```

before any render step. Forks that customize the citation style should adapt.

---

## Husky hooks aren't running on commit

**Cause:** Husky needs to be installed on the local clone, which `npm run prepare` does automatically — but only if `npm install` ran in a git-initialized directory.

**Fix:**

```bash
rm -rf .husky/_
npm run prepare
```

Then make sure `.husky/pre-commit` and `.husky/pre-push` are executable:

```bash
chmod +x .husky/pre-commit .husky/pre-push
```

On Windows, hooks should still run via Git Bash or WSL; native Windows shell may not respect the shebang.

---

## "Multi-author render fails: merged.md not found"

**Cause:** you have `03_BODY/multi-author/<chapter>/author-*.md` files but never ran the merge skill, so `merged.md` doesn't exist.

**Fix:** run the `merge-authors` Claude skill on the chapter directory. It produces `merged.md` with attribution markers preserved.

If you want to handle the merge manually instead, just create `merged.md` yourself by combining the per-author files; render reads `merged.md` regardless of how it got there.

---

## Still stuck?

- Search closed issues: <https://github.com/estevanhernandez-stack-ed/ThesisStudio/issues?q=is%3Aissue+is%3Aclosed>
- Open a new issue using the bug report template
- Check `docs/architecture.md` for how the affected component is supposed to work

When filing an issue, include:

- ThesisStudio commit/version
- OS + Node version
- Pandoc + LuaLaTeX versions (if a render error)
- The exact command that failed and its full output
- Whether you're using the devcontainer or a local install
