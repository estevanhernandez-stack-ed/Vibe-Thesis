# Lit Review Swarm

**5 parallel agents.** One per research axis. The default playbook for scoping a new field, starting a fresh lit review, or covering a chapter's research surface in parallel rather than sequentially.

## When to use

- You're starting a lit review chapter or section and need broad coverage fast.
- You're entering an unfamiliar subfield and need orientation.
- You've gathered ad-hoc notes and want a structured pass to fill gaps.
- You want to stress-test a thesis by mapping the field around it before committing.

## When NOT to use

- You're deep in re-reading a single canonical text — hand-research that.
- You already have a complete lit review and just need to iterate on prose — editorial pass, not a swarm.
- The field is so narrow that 5 parallel agents would step on each other — use a 2-3 agent custom swarm instead.

## Inputs required

- **Topic / thesis context** — one paragraph summarizing what the lit review supports.
- **Scope boundaries** — what's in, what's out. Helps each agent stay on its axis without drifting.
- **Existing material** (optional) — paths to any prior research already in `02_RESEARCH/` so agents can build on rather than duplicate.

## Agents to dispatch (5 parallel)

Each agent gets its own subdirectory in `02_RESEARCH/` to write into. Run all 5 in parallel via Claude Code's Task tool.

### Agent 1 — Prior Art

- **Axis:** What's been done in this area; where the field currently sits; what foundational works define the conversation.
- **Output dir:** `02_RESEARCH/prior-art/`
- **Prompt template:**
  > You are conducting a literature survey on **{topic}** within scope **{scope_boundaries}**.
  >
  > Your axis is **prior art** — find the foundational works, key papers, and seminal contributions that define the current state of this field.
  >
  > Produce notes in `02_RESEARCH/prior-art/<NN-author-year-shortname>.md` for each significant work. Each note includes: full citation in BibTeX-friendly form, one-paragraph summary, the work's main claim, and how it connects to **{thesis_context}**.
  >
  > Aim for 8–15 substantive notes. Quality over quantity — exclude works that don't materially shape the conversation.

### Agent 2 — Methodology Survey

- **Axis:** How others have approached the question methodologically; what methods are common, contested, or missing.
- **Output dir:** `02_RESEARCH/methodology-survey/`
- **Prompt template:**
  > You are surveying methodological approaches in **{topic}** within scope **{scope_boundaries}**.
  >
  > Your axis is **methodology** — what methods do researchers in this field use? What are the established methods, the contested ones, the missing ones?
  >
  > Produce notes in `02_RESEARCH/methodology-survey/<NN-method-name>.md` per method or methodological tradition. Each note includes: method name, exemplar papers using it (with BibTeX-friendly citations), strengths/limitations, and how it might apply to **{thesis_context}**.
  >
  > Aim for 5–10 method notes covering the field's methodological landscape.

### Agent 3 — Opposing Positions

- **Axis:** The strongest case AGAINST the active thesis. Find the smartest arguments, the best counterexamples, the field's actual disagreements.
- **Output dir:** `02_RESEARCH/opposing-positions/`
- **Prompt template:**
  > The active thesis is: **{thesis_context}**.
  >
  > Your axis is **opposing positions** — find the strongest, most credible counterarguments. Don't strawman; engage with the best version of each opposing view.
  >
  > Produce notes in `02_RESEARCH/opposing-positions/<NN-position-name>.md` per opposing position. Each note includes: position summary, key proponents (BibTeX citations), the strongest evidence supporting it, and the most honest engagement we'd need to address it in our work.
  >
  > Aim for 3–7 substantive opposing positions. Distinct positions, not variations on a theme.

### Agent 4 — Key Authors

- **Axis:** Author-centric notes on field leaders. Who shapes the conversation? Whose corpus must we engage with?
- **Output dir:** `02_RESEARCH/key-authors/`
- **Prompt template:**
  > You are mapping the key authors in **{topic}** within scope **{scope_boundaries}**.
  >
  > Your axis is **key authors** — who are the most influential voices? For each, what is their core contribution and trajectory?
  >
  > Produce notes in `02_RESEARCH/key-authors/<lastname-firstname>.md` per author. Each note includes: full name + affiliation (current and historical), core contribution to the field, 3–5 representative works (BibTeX citations), and an honest read of where their position sits relative to **{thesis_context}**.
  >
  > Aim for 5–12 key authors. Include both historical foundations and current active voices.

### Agent 5 — Primary Sources

- **Axis:** Direct engagement with primary materials (texts, datasets, archives, original documents) the field rests on.
- **Output dir:** `02_RESEARCH/primary-sources/`
- **Prompt template:**
  > You are surveying the primary-source landscape for **{topic}** within scope **{scope_boundaries}**.
  >
  > Your axis is **primary sources** — what are the foundational documents, datasets, archives, or original materials the field engages with directly?
  >
  > Produce notes in `02_RESEARCH/primary-sources/<source-shortname>.md` per primary source. Each note includes: source identifier (citation, archive ID, dataset URL), provenance, what's notable about it for our purposes, and how the field has engaged with it historically.
  >
  > Aim for 4–10 primary sources. Distinguish from secondary literature (Agent 1 covers that).

## Output convergence

**Method:** synthesize-skeleton

**Output path:** `03_BODY/02-lit-review.md` (or wherever your lit review chapter lives)

**Convergence steps** (run after all 5 agents return):

1. Read the contents of `02_RESEARCH/{prior-art,methodology-survey,opposing-positions,key-authors,primary-sources}/`.
2. Synthesize into a lit-review **skeleton** — section headings, planned subsections, claims-with-evidence-pointers. Don't write final prose yet.
3. Cross-link: every claim in the skeleton points back to specific notes in `02_RESEARCH/`.
4. Identify gaps: where does the synthesis surface a question no agent answered? Flag for follow-up (could be a second narrower swarm or hand-research).
5. Produce a one-paragraph "what this swarm taught me" reflection at the bottom of the skeleton — useful for future swarms in the same field.

The skeleton becomes the structural input to writing the lit review chapter. You write the prose; the swarm did the scoping.

## Cost note

A 5-agent dispatch is non-trivial Claude usage. Worth it for an initial lit review or major chapter scoping; not worth it for incremental updates. For incremental work, dispatch a single agent on the relevant axis or hand-research.

## Failure handling

If 1–2 agents return errors or empty results:

- Convergence proceeds with what came back; missing axes are flagged in the synthesized skeleton ("**Gap:** Agent 3 returned empty — opposing positions not surveyed; address in follow-up").
- Don't re-dispatch the failed agent unconditionally; first check whether the prompt was too vague or the scope was too broad.

If 3+ agents return errors, abort convergence and re-scope the swarm — the inputs were probably wrong.
