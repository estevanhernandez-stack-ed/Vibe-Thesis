---
name: merge-authors
description: Use when a multi-author chapter or paper needs its author-named contribution files combined into a single merged.md. Preserves voice; preserves attribution markers; flags transition rough spots without smoothing them.
---

# Merge-Authors Skill — ThesisStudio

You are merging two or more co-authors' contributions into a single chapter file. The output is a `merged.md` with HTML-comment attribution markers preserved so editorial review knows who wrote what. Style differences between authors are NOT smoothed — that's a separate editorial pass after merge.

## When to use

- A user says "/merge-authors", "merge our chapter", "combine contributions", or similar.
- You detect a `03_BODY/multi-author/<chapter>/` directory containing two or more `author-<name>.md` files.

## Inputs

- A chapter directory path (e.g., `03_BODY/multi-author/04-results/`).
- All files matching `author-*.md` inside that directory (each file's name encodes the author: `author-este.md` → "este").

## Output

A `merged.md` file in the same directory. Contains:

- One canonical version of the chapter with each author's contributions stitched in order.
- HTML comment attribution markers wrapping each author's contribution: `<!-- author: este -->...<!-- /author: este -->`.
- A merge metadata header at the top:

  ```markdown
  <!-- merge-authors metadata
  merged_at: 2026-04-25T22:00:00Z
  authors: [este, jane]
  source_files:
    - author-este.md
    - author-jane.md
  -->
  ```

## Merge logic

The merge approach depends on how authors structured their contributions:

### Case A — Section-based contributions (most common)

Each author wrote different SECTIONS. Detect by: each `author-*.md` has top-level headings, and the headings don't fully overlap.

- Combine in heading order. Where multiple authors have content under the same heading, present each author's version sequentially with attribution markers.
- Example: if Este wrote `## Methodology` and Jane wrote `## Results`, the merged file has both sections, each attributed.

### Case B — Coverage-overlap contributions

Each author wrote content covering the same sections. Detect by: heading overlap above 50% across authors.

- Don't try to AI-merge prose at this point. Output a `merged.md` that includes each author's full version sequentially with clear attribution and a leading note:

  ```markdown
  <!-- This chapter has overlapping coverage from multiple authors.
       Editorial review needed to reconcile sections.
       Listed in this file: each author's full version, attributed. -->
  ```

- The user does the editorial reconciliation themselves; the merge skill's job is to make the situation visible, not to silently pick a winner.

### Case C — Mixed (sections + overlap)

Combine: section-based merge for non-overlapping headings; sequential listing for overlapping ones; clear note at the top distinguishing the two regions.

## Voice preservation rules

- Do NOT rewrite prose to make stylistic transitions smoother. That's editorial work the human does.
- Do NOT remove or reword "I" / "we" / first-person references (different authors may use these differently).
- Do NOT change citation key style or footnote style — preserve as-is.
- DO add a `<!-- transition? -->` comment at heading boundaries where authors' voices differ noticeably (different sentence rhythm, different terminology) — flag for editorial smoothing.

## Re-running

If `merged.md` already exists, show the user a diff between the prior merged.md and what you'd produce now, and ask before overwriting. Don't silently clobber prior work.

## Output checklist

Before claiming the merge is done:

- [ ] `merged.md` exists in the chapter directory
- [ ] Every `author-*.md` is referenced in the source_files metadata
- [ ] Every author's contribution is wrapped in attribution markers
- [ ] Heading order makes sense (no out-of-order numbered sections)
- [ ] Transition flags placed where stylistic shifts occur

## Render integration

The render pipeline reads `merged.md` (not the per-author files) when present. If `merged.md` doesn't exist for a multi-author chapter, render fails loudly. So make sure the merge produces a syntactically valid markdown file that the render pipeline can ingest.
