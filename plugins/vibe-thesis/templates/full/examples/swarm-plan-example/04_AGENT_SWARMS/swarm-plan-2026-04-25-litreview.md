---
swarm_id: "2026-04-25-litreview-document-infrastructure"
playbook: "lit-review-swarm"
dispatched_by: "Este Hernandez"
dispatched_at: "2026-04-25T22:00:00Z"

thesis_context: |
  Writing infrastructure decisions (citation regime, sectional structure, visual apparatus,
  genre conformity) shape argumentative possibilities in ways the writing-process literature
  has under-mapped. We argue infrastructure is itself argumentative — not a neutral substrate.

agents:
  - id: "agent-prior-art"
    axis: "prior-art"
    prompt: |
      You are conducting a literature survey on document infrastructure and academic
      argumentation within scope: humanities and humanistic social sciences, 1980-present.

      Your axis is prior art — find the foundational works that define the current state
      of this conversation.

      Produce notes in 02_RESEARCH/prior-art/<NN-author-year-shortname>.md per significant
      work. Each note: full citation, one-paragraph summary, main claim, connection to thesis.
    inputs: {}
    expected_output_schema: "Markdown note per work; 8-15 substantive notes total"
    output_dir: "02_RESEARCH/prior-art/"

  - id: "agent-methodology-survey"
    axis: "methodology-survey"
    prompt: |
      Survey methodological approaches to studying document infrastructure and writing process.
      What methods are common, contested, or missing in this area?
    inputs: {}
    expected_output_schema: "Markdown note per method; 5-10 method notes"
    output_dir: "02_RESEARCH/methodology-survey/"

  - id: "agent-opposing-positions"
    axis: "opposing-positions"
    prompt: |
      Find the strongest case AGAINST the thesis that infrastructure is argumentative.
      Likely candidates: the conventionalist view (infrastructure is inherited, not chosen);
      the formalist view (form and content are separable); empirical critiques of any
      attempt to attribute argumentative effect to formal choices.
    inputs: {}
    expected_output_schema: "Markdown note per opposing position; 3-7 positions"
    output_dir: "02_RESEARCH/opposing-positions/"

  - id: "agent-key-authors"
    axis: "key-authors"
    prompt: |
      Map the key authors in document infrastructure / writing-process scholarship.
      Include both technical typesetting voices (Knuth, Lamport) and writing-studies voices.
    inputs: {}
    expected_output_schema: "Markdown note per author; 5-12 authors"
    output_dir: "02_RESEARCH/key-authors/"

  - id: "agent-primary-sources"
    axis: "primary-sources"
    prompt: |
      Identify primary sources for studying document infrastructure: published academic
      works that exhibit the patterns we want to analyze. Aim for diversity across fields,
      time periods, and infrastructure choices.
    inputs: {}
    expected_output_schema: "Markdown note per primary source; 4-10 sources"
    output_dir: "02_RESEARCH/primary-sources/"

convergence:
  method: "synthesize-skeleton"
  output_path: "03_BODY/02-lit-review.md"
  notes: |
    Cross-link every claim in the skeleton back to specific notes in 02_RESEARCH/.
    Identify gaps where no agent answered a relevant question — flag for follow-up
    (narrower swarm or hand-research). Produce a "what this swarm taught me" reflection
    at the bottom for future-you.
---

# Swarm Plan: Lit Review — Document Infrastructure (2026-04-25)

## Why this swarm

Starting the lit review chapter for the dissertation. Need broad coverage across 5 axes
to scope the conversation before committing to specific readings. Hand-researching the
field has been slow; parallel coverage gives us a map in one dispatch instead of weeks
of reading.

## Success criteria

- Each axis subdirectory in 02_RESEARCH/ has 4+ substantive notes
- Convergence produces a lit-review skeleton I can iterate on without re-reading every source
- At least one axis surfaces an angle I hadn't anticipated (otherwise the swarm was redundant
  with what I already knew)

## Notes

- Skip the "writing pedagogy" subliterature — that's a separate chapter, not this one
- Prefer works with explicit authorial reflection on infrastructure decisions (interviews,
  prefaces, methodological essays); these ground inference
- Don't include works the dissertation already discusses in detail in the proposal
