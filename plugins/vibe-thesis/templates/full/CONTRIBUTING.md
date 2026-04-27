# Contributing to ThesisStudio

Thanks for the interest. ThesisStudio is a **template** — its primary use is to be forked, customized, and made into your own thesis project. Contributions back to the template repo are welcome but should focus on improvements that help all forking users, not on changes specific to your project.

## Forking vs. Contributing

| You want to | Do this |
| --- | --- |
| Use ThesisStudio for your own thesis | Fork it, customize via `/bootstrap` or manual edits, then iterate on your fork |
| Improve the template for everyone | Open an issue here, then PR against this repo |
| Report a bug in the template scaffolding | Open a bug report (use the issue template) |
| Suggest a new feature | Open a feature request (use the issue template) |

## Development setup

```bash
git clone https://github.com/estevanhernandez-stack-ed/ThesisStudio.git
cd ThesisStudio
npm install
```

For full toolchain (Pandoc + LuaLaTeX), open the repo in VS Code with Dev Containers — the included `.devcontainer/` config bundles everything.

## Code style

- **Scripts** (`scripts/`): Node.js, ES2022, no TypeScript. Use `execFile` / `spawn` with array args — never `exec` with string concatenation.
- **Markdown**: Validated by `markdownlint-cli2`; run `npm run lint:md`. Config in `.markdownlint.json`.
- **Schemas** (`00_DESIGN_SYSTEM/schemas/`): JSON Schema draft-07. Run `npm run validate` to verify.

## Pull request checklist

Before opening a PR:

- [ ] `npm run lint:md` passes
- [ ] `npm run validate` passes
- [ ] If you touched a render script, the example chapter renders cleanly to PDF
- [ ] If you added a new schema field, the corresponding ADR in `docs/adr/` is updated
- [ ] If you changed user-facing behavior, `docs/getting-started.md` or `README.md` reflects the change
- [ ] No secrets, personal references, or content from a real thesis is included

## Commits

Conventional commits encouraged but not required. Aim for clear "what + why" subject lines.

## Architectural changes

Major changes (new top-level dirs, new output adapters, render-pipeline rework, mode-flag changes) need an ADR in `docs/adr/`. Open an issue first to discuss the direction before writing the ADR + PR.

## Reporting security issues

See [SECURITY.md](SECURITY.md). Don't open public issues for security problems.

## License

By contributing, you agree your contributions are licensed under the [MIT License](LICENSE).
