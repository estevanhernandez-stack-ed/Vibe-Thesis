# Fixture — Article

Self-contained sample article demonstrating article-mode structure (`THESIS_MODE: article`). Shorter than dissertation mode — sections instead of chapters, condensed methodology, no defense materials.

## What's here

```text
article/
├── 03_BODY/
│   ├── 01-introduction.md
│   └── 02-results.md
├── 05_CITATIONS/
│   └── references.bib
└── README.md
```

## What it demonstrates

- Article-mode body structure (sections, not chapters)
- Condensed structure suitable for journal submission (~10–25pp final)
- The same render pipeline producing article output instead of dissertation output
- Citation handling identical to dissertation mode

## Using this fixture

1. Copy `03_BODY/*.md` into your fork's root `03_BODY/`.
2. Append `05_CITATIONS/references.bib` entries to your root `references.bib`.
3. Set `THESIS_MODE: article` in `CLAUDE.md`.
4. Run `npm run render:pdf`.

The output PDF is structurally an article — Introduction / Results style, no chapter labels, no defense apparatus.
