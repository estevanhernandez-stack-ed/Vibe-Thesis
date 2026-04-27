# Citation Styles (CSL)

Six citation styles ship pre-installed with the Vibe Thesis templates payload.
Each is a verbatim copy from the
[citation-style-language/styles](https://github.com/citation-style-language/styles)
canonical repo, fetched at plugin build time.

## Shipped styles

| Style | Slug | When to use |
|---|---|---|
| Chicago Author-Date | `chicago-author-date.csl` | Humanities and social sciences (default per `tokens.yaml`) |
| Chicago Notes-Bibliography | `chicago-notes-bibliography.csl` | History, philosophy, the humanities — footnote-heavy work |
| APA 7th Edition | `apa.csl` | Psychology, education, behavioral sciences |
| MLA 9th Edition | `modern-language-association.csl` | Literature, modern languages |
| IEEE | `ieee.csl` | Engineering, computer science |
| Nature | `nature.csl` | Natural sciences (Nature journals + many adjacent venues) |

## Selecting a style

1. Edit `00_DESIGN_SYSTEM/tokens.yaml`:

   ```yaml
   citation:
     style: chicago-author-date          # any slug from the table above
     csl_path: 05_CITATIONS/styles/chicago-author-date.csl
   ```

2. Run `npm run compile-tokens` to refresh.
3. Render: `npm run render:pdf`. Pandoc reads the CSL via the manifest.

## Adding a different style

The upstream CSL repo has 10,000+ styles for specific journals, conferences,
and institutions. To add one not shipped here:

1. Browse [Zotero Style Repository](https://www.zotero.org/styles) or
   [citation-style-language/styles](https://github.com/citation-style-language/styles).
2. Download the `.csl` file into this directory.
3. Update `tokens.yaml` `citation.style` and `citation.csl_path` to point at it.

## Why these six

Together they cover ~85% of academic citation needs in English-language
humanities, social sciences, sciences, and engineering. **Harvard and Vancouver
styles** are typically institution-flavored (no generic version in the upstream
repo); pick a journal-specific or institution-specific variant from the
upstream repo when you need one — most universities publish their own.

## Upstream license

CSL files in the upstream repo are licensed under
[Creative Commons Attribution-ShareAlike 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/).
This directory inherits that license for the shipped `.csl` files.
