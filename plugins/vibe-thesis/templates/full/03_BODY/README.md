# 03_BODY

The main writing. Filenames are numbered for ordering — render scripts concatenate in numeric order.

## Mode-aware structure

The `THESIS_MODE` flag in `CLAUDE.md` shapes what lives here:

| Mode | Typical files |
| --- | --- |
| `dissertation` | `01-introduction.md`, `02-lit-review.md`, `03-methodology.md`, `04-results.md` (multiple), `05-discussion.md`, `06-conclusion.md` |
| `article` | `01-introduction.md`, `02-related-work.md`, `03-method.md`, `04-results.md`, `05-discussion.md`, `06-conclusion.md` (often shorter / single results section) |
| `masters` | Similar to dissertation but lighter — fewer results chapters, shorter overall |

Add, remove, or rename freely — the render pipeline orders by leading number.

## Figures

Figures live in `_figures/` with descriptive filenames. Reference them in body files via standard markdown `![Caption](_figures/figure-name.png)`.

## Multi-author

Co-authoring? See `multi-author/README.md` for the opt-in pattern.
