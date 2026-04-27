# Counter-Position Swarm

**3 parallel agents.** Find the strongest case AGAINST your active thesis along three independent dimensions: empirical, methodological, theoretical. Stress-tests the thesis before you commit to writing it up.

## When to use

- You've drafted a thesis statement and want to know how it holds up against attack.
- You're approaching a defense or peer review and want to anticipate objections.
- A reviewer's comments suggest your thesis might be vulnerable in ways you haven't mapped.
- You're deciding whether the thesis is worth defending at all (a swarm that finds devastating counters might tell you to revise your thesis, not just your prose).

## When NOT to use

- You haven't articulated a clear thesis yet — counter-position requires a target to attack.
- You're early in the lit review — use the lit-review-swarm first to establish what's even out there.
- The thesis is descriptive ("A is a kind of B") rather than argumentative ("A should be understood as B because C") — descriptive theses don't have natural counter-positions.

## Inputs required

- **Active thesis statement** — one or two sentences. The clearer the better; vague theses produce vague counters.
- **Scope of "counter"** — empirical only? Theoretical too? Limit to recent literature?
- **Disqualifiers** (optional) — known bad arguments to skip ("don't bother with the X school's critique; addressed already").

## Agents to dispatch (3 parallel)

Each agent gets its own slice of `02_RESEARCH/opposing-positions/` to write into.

### Agent 1 — Empirical Counterargument

- **Axis:** Find the data, evidence, or empirical results that contradict the thesis.
- **Output dir:** `02_RESEARCH/opposing-positions/empirical/`
- **Prompt template:**
  > The active thesis is: **{thesis_statement}**.
  >
  > Your axis is **empirical counterargument** — find data, experimental results, observational studies, or replicable evidence that contradicts or substantially complicates the thesis.
  >
  > Produce notes in `02_RESEARCH/opposing-positions/empirical/<NN-evidence-shortname>.md` per piece of empirical counterevidence. Each note includes: source citation (BibTeX-friendly), the specific data/result, why it counts as counterevidence, the strength of the evidence (sample size, replications, methodological soundness), and the most honest engagement the thesis would need to address it.
  >
  > Aim for 3–7 substantive empirical counterpoints. Don't pad — weak counterevidence wastes review time.

### Agent 2 — Methodological Counterargument

- **Axis:** Find the methodological critiques. Even if the thesis's empirical foundation is sound, are the methods we'd use to argue it questionable?
- **Output dir:** `02_RESEARCH/opposing-positions/methodological/`
- **Prompt template:**
  > The active thesis is: **{thesis_statement}**.
  >
  > Your axis is **methodological counterargument** — find published critiques of the methods we'd use (or have used) to support this thesis. Critiques can target: study design, data analysis approach, interpretation framework, generalization claims, or measurement validity.
  >
  > Produce notes in `02_RESEARCH/opposing-positions/methodological/<NN-critique-shortname>.md`. Each note includes: source citation, the specific methodological critique, who's been the target of similar critiques in adjacent work, and what robust response to the critique would look like.
  >
  > Aim for 3–7 substantive methodological critiques.

### Agent 3 — Theoretical Counterargument

- **Axis:** Find competing theoretical frameworks. Even if our evidence is right and our method is sound, is there a different theoretical lens that explains the same phenomenon better?
- **Output dir:** `02_RESEARCH/opposing-positions/theoretical/`
- **Prompt template:**
  > The active thesis is: **{thesis_statement}**.
  >
  > Your axis is **theoretical counterargument** — find competing theoretical frameworks, alternative explanatory models, or rival conceptual approaches that account for the same phenomena differently.
  >
  > Produce notes in `02_RESEARCH/opposing-positions/theoretical/<NN-framework-name>.md` per competing framework. Each note includes: framework name and proponents (with citations), how the framework explains the same phenomena, where it sits in tension with our thesis, and what we'd need to demonstrate to claim our framework is preferable (or that both can coexist).
  >
  > Aim for 2–5 substantive competing frameworks. Distinct frameworks, not variations on the same approach.

## Output convergence

**Method:** contradiction-map

**Output path:** `02_RESEARCH/opposing-positions/_synthesis.md`

**Convergence steps:**

1. Read all three subdirectories under `02_RESEARCH/opposing-positions/`.
2. Build a contradiction map: for each counter-position (empirical, methodological, theoretical), what does it claim, and where does our thesis sit in tension?
3. Categorize each counter-position by severity: **devastating** (would require thesis revision) / **substantial** (must address in-text) / **manageable** (one paragraph engagement suffices) / **weak** (don't need to engage).
4. For "devastating" counters, produce an honest assessment: should we revise the thesis? Or do we have a strong response we haven't articulated yet?
5. Produce action items — what each surviving counter-position requires us to add to the body chapters.

The synthesis becomes the input to either: (a) revising the thesis, or (b) strengthening the body to address surviving counters explicitly. Either way, the work is stronger for having mapped the territory.

## Cost note

3-agent dispatch is moderate Claude usage. Worth running once mid-draft and once before submission. Don't run it on every revision pass.

## Failure handling

If an agent returns "no substantive counters found":

- Sanity-check the thesis. A thesis with no honest counter-positions is usually too vague, too obvious, or in a field too small to have generated debate.
- Try widening the scope (broader literature, longer time horizon).
- Worst case: the field genuinely lacks debate here — note that in the synthesis as a discoverable feature of the thesis ("this position is not currently contested in the literature, which itself is worth discussing").
