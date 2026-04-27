# Demo Article — A Brief Examination of Rubber Ducks in Software Engineering

This is the bundled worked example. Vibe Thesis's orchestrator copies these
files into a freshly-scaffolded project's numbered scaffold during the
**round-trip confirmation** step (scaffold-mode step 5).

## What's here

- `01_PLANNING/proposal.md` — 1-page proposal.
- `01_PLANNING/outline.md` — 3-section outline.
- `01_PLANNING/claims-map.md` — 5 claims with referents.
- `03_BODY/01-introduction.md` — ~1 page.
- `03_BODY/02-methods.md` — ~1 page.
- `03_BODY/03-conclusion.md` — ~1 page.
- `05_CITATIONS/references.bib` — 5 real, citable entries (Brooks, Hunt &
  Thomas, Knuth, Naur, Norman).

## Why this content

Three constraints shaped the topic choice:

1. **Low-stakes.** The content is intentionally uncontroversial so the
   demo doesn't accidentally read as Estevan's authoritative position on
   anything. Rubber duck debugging is well-known programmer lore;
   describing it lightly is safe ground.
2. **Round-trip-friendly.** Three short sections + five real citations
   exercise every part of the render pipeline (Pandoc body conversion,
   biber bibliography processing, citation linking, design-token
   compilation, manifest emission) without requiring the user to write any
   content of their own to verify the install.
3. **Refreshable.** All five `.bib` entries are real, longstanding works
   with stable DOIs / ISBNs. The bibliography won't rot.

## Verifying the round-trip

After Vibe Thesis scaffolds a fresh project and the orchestrator copies this
content in:

```bash
npm install         # one-time, after scaffold
npm run render:pdf  # produces 08_OUTPUT/pdf/example.pdf
```

The orchestrator's scaffold-mode step 5 runs both of these and reports
success when `08_OUTPUT/pdf/example.pdf` exists.

## Replacing the demo content

After the round-trip succeeds, the user is encouraged to delete this content
and replace it with their own topic. The orchestrator's iterate-mode coaches
the user through this transition.
