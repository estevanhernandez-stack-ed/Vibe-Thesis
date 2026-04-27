# 05_CITATIONS

Single canonical bibliography source for the thesis, plus the citation styles the render pipeline consumes.

## Files

| Path | Purpose |
| --- | --- |
| `references.bib` | Your BibTeX library. Single source of truth for all citations. |
| `styles/` | CSL (Citation Style Language) files. Default is `chicago-author-date.csl`. Add others as needed; switch active style in `00_DESIGN_SYSTEM/tokens.yaml` (`citation.csl_path`). |

## Citing in body markdown

Use Pandoc-style citation syntax:

```markdown
This claim is supported by prior work [@smith2020].
Multiple sources: [@smith2020; @jones2021; @lee2022].
With page reference: [@smith2020, p. 45].
```

The render pipeline (`--citeproc`) resolves these against `references.bib` using the active CSL style.

## Validation

`npm run check:citations` walks `03_BODY/*.md`, extracts every citation key, and checks each exists in `references.bib`. Missing keys fail with file + line number.

The pre-commit hook runs this on staged body files.

## Adding a new citation style

1. Find the CSL file from [Zotero Style Repository](https://www.zotero.org/styles) or [official-repository](https://github.com/citation-style-language/styles).
2. Drop it into `styles/`.
3. Update `00_DESIGN_SYSTEM/tokens.yaml`:

   ```yaml
   citation:
     style: "your-style-name"
     csl_path: "05_CITATIONS/styles/your-style.csl"
   ```

4. Re-render.
