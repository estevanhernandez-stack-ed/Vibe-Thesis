# Citation Styles

CSL (Citation Style Language) files defining how citations render in PDF and LaTeX outputs.

## Default

ThesisStudio defaults to **Chicago Author-Date** (`chicago-author-date.csl`).

> **First-time setup:** download the official CSL file and place it here as `chicago-author-date.csl`. The file is too large to ship inline in the template (~700 lines of XML), but it's a one-line download:
>
> ```bash
> curl -L https://raw.githubusercontent.com/citation-style-language/styles/master/chicago-author-date.csl -o chicago-author-date.csl
> ```
>
> The CI workflow includes this step. The devcontainer `postCreateCommand` should also fetch it on first build.

## Switching styles

To use a different style:

1. Find the CSL file from [Zotero Style Repository](https://www.zotero.org/styles) (~10,000 styles available) or the [official-repository](https://github.com/citation-style-language/styles).
2. Drop it into this directory.
3. Update `00_DESIGN_SYSTEM/tokens.yaml`:

   ```yaml
   citation:
     style: "your-style-name"
     csl_path: "05_CITATIONS/styles/your-style.csl"
   ```

4. Re-render.

## Common alternatives

| Field / journal | Style filename |
| --- | --- |
| Humanities | `chicago-note-bibliography.csl` |
| Social sciences | `apa.csl`, `apa-7th-edition.csl` |
| Literature | `mla.csl`, `modern-language-association.csl` |
| Engineering | `ieee.csl` |
| Physics | `physical-review-letters.csl` |
| Biology | `nature.csl`, `cell.csl` |
| Computer science | `acm-sig-proceedings.csl`, `ieee.csl` |

## Bundling considerations

The template ships with the README pointing at the download rather than the CSL itself because:

- CSL files are licensed CC-BY-SA — bundling requires preserving the license header.
- They evolve frequently; pinning a version in the template would go stale.
- The Zotero repository download path is stable and well-known.

Forking users get instructions; CI/devcontainer fetches automatically.
