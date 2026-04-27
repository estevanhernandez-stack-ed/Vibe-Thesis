# Multi-Author (opt-in)

Co-authoring a chapter or paper? Use this directory pattern to keep contributions traceable and merge them deterministically.

## Pattern

For each chapter you're co-authoring, create a subdirectory:

```text
multi-author/
└── 04-results/
    ├── author-este.md      ← Este's contribution
    ├── author-jane.md      ← Jane's contribution
    └── merged.md           ← produced by the merge-authors skill
```

Each author drafts their contribution to their own author-named file. When ready to combine, run the `merge-authors` Claude skill — it produces `merged.md` with HTML-comment attribution markers preserved (`<!-- author: este -->`, `<!-- author: jane -->`).

## Render

The render pipeline reads `merged.md` (not the per-author files) when present. If `merged.md` doesn't exist for a multi-author chapter, render fails loudly — run the merge skill first.

## Solo authors

Skip this directory entirely. Solo writing happens in `03_BODY/<chapter>.md` directly.

## Editorial smoothing

The merge skill preserves voice deliberately. Stylistic transitions between authors will read as discontinuities — that's intentional. Smoothing transitions is a separate editorial pass after merge.
