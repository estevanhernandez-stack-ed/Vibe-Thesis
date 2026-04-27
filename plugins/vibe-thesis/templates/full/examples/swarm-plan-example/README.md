# Fixture — Swarm Plan Example

Demonstrates a completed swarm-plan + mock agent outputs from a `lit-review-swarm` dispatch. Shows what the artifacts look like AFTER agents have returned, before the convergence step runs.

## What's here

```text
swarm-plan-example/
├── 04_AGENT_SWARMS/
│   └── swarm-plan-2026-04-25-litreview.md   ← filled-in plan (validated against schema)
├── 02_RESEARCH/
│   └── prior-art/
│       ├── 01-knuth-1984-texbook.md         ← mock agent output (Agent 1: Prior Art)
│       └── 02-lamport-1986-latex.md         ← mock agent output
└── README.md
```

A real dispatch would have outputs across all 5 axes (`prior-art/`, `methodology-survey/`, `opposing-positions/`, `key-authors/`, `primary-sources/`); this fixture shows the prior-art axis only for brevity.

## What it demonstrates

- A completed `swarm-plan.md` with all required schema fields filled
- The structure of mock agent outputs (one note per work, structured analysis)
- How outputs cluster into the axis subdirectory ready for convergence

## Trying convergence yourself

The convergence step for `lit-review-swarm` is described in `04_AGENT_SWARMS/lit-review-swarm.md` § Output convergence. Briefly:

1. Read all `02_RESEARCH/<axis>/` notes.
2. Synthesize into a lit-review skeleton (headings + planned subsections + cross-links to the source notes).
3. Identify gaps and follow-up actions.
4. Write the skeleton to `03_BODY/02-lit-review.md`.

Run convergence in Claude Code by referencing this fixture's research notes and following the playbook's convergence steps.
