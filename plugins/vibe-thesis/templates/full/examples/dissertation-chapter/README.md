# Fixture — Dissertation Chapter

Self-contained sample chapter demonstrating the content shape ThesisStudio expects in dissertation mode. Used by CI as the smoke-test render target.

## What's here

```text
dissertation-chapter/
├── 03_BODY/
│   ├── 01-introduction.md     ← chapter 1 with citations, headings, figure refs
│   └── 02-methodology.md      ← chapter 2 with cross-references
├── 05_CITATIONS/
│   └── references.bib         ← subset bibliography matching the chapter content
└── README.md                  ← this file
```

## What it demonstrates

- Pandoc-style citations: `[@knuth1984]`, `[@knuth1984; @lamport1986]`, `[@knuth1984, p. 45]`
- ATX headings (`#`, `##`, `###`)
- Figure references (placeholder image paths — real fixture would include the PNGs)
- Cross-references via Pandoc syntax (`{#sec:methodology}` labels, `[@sec:methodology]` refs)
- Multi-paragraph academic prose with appropriate qualifier discipline (Pillar 3: Honest Limits)

## Using this fixture

For a quick "does my toolchain work?" test:

1. Copy the contents of `examples/dissertation-chapter/03_BODY/` into your ThesisStudio fork's root `03_BODY/`.
2. Append `examples/dissertation-chapter/05_CITATIONS/references.bib` entries to your root `05_CITATIONS/references.bib`.
3. Set `THESIS_MODE: dissertation` in `CLAUDE.md`.
4. Run `npm run render:pdf`.

CI runs this automatically on every PR — see `.github/workflows/ci.yml`.

## What this is NOT

Not a real piece of academic writing. The content is illustrative — it exists to exercise the toolchain, not to be a model thesis chapter. Don't quote from this in an actual thesis.
