# Fixture — Multi-Author Paper

Demonstrates the file-per-author + merge pattern. Two authors (Este, Jane) each draft their contributions to the Results chapter; the `merge-authors` Claude skill produces `merged.md` with attribution markers preserved.

## What's here

```text
multi-author-paper/
├── 03_BODY/
│   └── multi-author/
│       └── 04-results/
│           ├── author-este.md       ← Este's contribution
│           ├── author-jane.md       ← Jane's contribution
│           └── merged.md            ← output of the merge-authors skill
└── README.md
```

## What it demonstrates

- Per-author drafting in isolation (no merge-conflict pain)
- The merge skill's output: combined content with HTML-comment attribution markers
- Voice preserved (no smoothing) — stylistic differences are flagged for editorial review, not removed
- The render pipeline reads `merged.md`, ignoring the per-author files

## Inspection

Look at `merged.md`. You'll see:

- Attribution markers wrapping each author's contribution (`<!-- author: este --> ... <!-- /author: este -->`)
- A merge metadata header at the top
- Content from both authors in heading order
- `<!-- transition? -->` flags where the voices noticeably shift (editorial smoothing pass needed before publication)

## Trying the merge yourself

In Claude Code:

1. Delete or move `merged.md`.
2. Run the `merge-authors` skill on `examples/multi-author-paper/03_BODY/multi-author/04-results/`.
3. The skill regenerates `merged.md`. Diff against the prior version to see the merge logic in action.
