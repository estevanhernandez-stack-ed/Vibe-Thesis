---
# swarm-plan template — fill in for each swarm dispatch.
# Validated against 00_DESIGN_SYSTEM/schemas/swarm-plan.schema.json.
# Copy this file as `swarm-plan-<descriptor>.md` (e.g., `swarm-plan-2026-04-25-litreview.md`)
# and fill in the fields below before dispatching.

swarm_id: ""                          # unique slug, e.g., "2026-04-25-litreview-quantum-cryptography"
playbook: ""                          # one of: lit-review-swarm | counter-position-swarm | primary-source-swarm | custom
dispatched_by: ""                     # author name
dispatched_at: ""                     # ISO datetime, e.g., "2026-04-25T22:00:00Z"

thesis_context: |                     # one-paragraph summary of the active thesis context this swarm is informing
  

agents:
  - id: ""                            # agent slug, e.g., "agent-prior-art"
    axis: ""                          # research axis (e.g., "prior-art")
    prompt: |                         # full prompt template for the dispatched agent
      
    inputs: {}                        # additional structured inputs (free-form per playbook)
    expected_output_schema: ""        # description of expected output structure
    output_dir: ""                    # where this agent's output lands (e.g., "02_RESEARCH/prior-art/")

  # Add more agents below as needed. Each gets its own list entry with the same shape.

convergence:
  method: ""                          # one of: synthesize-skeleton | deduplicate | contradiction-map | manual-review
  output_path: ""                     # where the converged output lands (e.g., "03_BODY/02-lit-review.md")
  notes: ""                           # any synthesis instructions specific to this swarm
---

# Swarm Plan: `<descriptor>`

<!-- Free-form prose below the frontmatter. Use this space for:
     - Why this swarm now (what triggered it)
     - What success looks like
     - Known constraints or guardrails
     - Notes for future-you when reviewing the converged output
-->

## Why this swarm

(Describe the problem this swarm is solving. Example: "I'm starting the lit review for chapter 2 and need parallel coverage of 5 axes to scope the field before writing.")

## Success criteria

(What does "done" look like for this swarm? Example: "Each axis directory in 02_RESEARCH/ has at least 5 substantive notes; convergence produces a lit-review skeleton I can iterate on without re-reading every source.")

## Notes

(Anything else worth capturing — agents to skip, terminology to standardize, etc.)
