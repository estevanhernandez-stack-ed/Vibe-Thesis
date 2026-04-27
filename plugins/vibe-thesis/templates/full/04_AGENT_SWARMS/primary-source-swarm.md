# Primary-Source Swarm

**N parallel agents (parameterized).** Each agent parses one primary source document in depth. Use when you have a defined set of primary sources (texts, datasets, archives, transcripts, original documents) and want structured engagement with all of them in parallel rather than sequentially.

## When to use

- You have N primary sources to engage with for a chapter or paper section.
- The sources are independent enough that one agent per source makes sense (they don't need to read each other's outputs to do their job).
- Each source needs structured analysis (claim extraction, evidence catalogue, methodological notes, openings for engagement) — not just summary.
- Examples: surveying 8 founding papers in a subfield; analyzing 12 archival documents; parsing 6 interview transcripts; reviewing 5 datasets for the methodology chapter.

## When NOT to use

- The sources are deeply interrelated (e.g., a debate where source 3 responds to source 1) — sequential reading captures the dialectic better than parallel.
- You only have 1–2 sources — parallelism overhead isn't worth it; hand-research.
- The sources are extremely long (book-length each) — agents have context limits; chunk into smaller dispatches per source.
- The sources are in a language you can't verify — parallel parsing makes verification harder; do these one at a time.

## Inputs required

- **Source list** — paths to each primary source (PDFs, markdown, plaintext, URLs). One agent per source.
- **Analysis schema** — the structured fields each agent should extract per source. Default schema below; customize per project.
- **Engagement angle** — what is the purpose of reading these sources? Different purposes change what to extract.

## Agents to dispatch (N parallel)

Replicate this agent N times — once per primary source. Each gets the same prompt template parameterized by the source path.

### Agent N — Source Parse

- **Axis:** Deep structured engagement with a single primary source.
- **Output dir:** `02_RESEARCH/primary-sources/<source-shortname>/`
- **Prompt template:**
  > You are parsing the primary source at **{source_path}**.
  >
  > The engagement angle is: **{engagement_angle}**.
  >
  > Produce a structured analysis at `02_RESEARCH/primary-sources/{source_shortname}/analysis.md` covering:
  >
  > 1. **Source identification** — full citation (BibTeX-friendly), provenance (publisher / archive / dataset host), date, language, length / scope.
  > 2. **Central thesis or claim** — what is this source arguing or showing? In one paragraph.
  > 3. **Evidence catalogue** — the source's key evidence (data, examples, citations, primary observations). List 5–15 with specific page/section references.
  > 4. **Method or approach** — how does the source make its case? Empirical study? Theoretical argument? Archival analysis? Polemic?
  > 5. **Strengths** — what does this source do well that we should engage with?
  > 6. **Weaknesses or limitations** — where does the source fall short? Methodological gaps, scope limitations, interpretive moves we'd contest.
  > 7. **Openings for our engagement** — given the engagement angle (**{engagement_angle}**), where does our work intersect with this source? What can we extend, contradict, complicate, or build on?
  > 8. **Quote bank** — 5–10 verbatim quotations (with page numbers) we might want to use in our writing. Mark each as: support / counter / illustrative / context.
  >
  > Be honest about what's strong and what's weak. Don't sanitize. Don't summarize so high-level that the analysis becomes useless when we return to it later.

## Output convergence

**Method:** synthesize-skeleton

**Output path:** Wherever the chapter draws on these sources lives — typically a chapter section like `03_BODY/04-results.md` or a dedicated section of `03_BODY/02-lit-review.md`.

**Convergence steps:**

1. Read all `02_RESEARCH/primary-sources/<source>/analysis.md` files.
2. Group by claim, method, or openings (depending on engagement angle).
3. Build a synthesis skeleton: which sources support which sub-arguments, which sources contradict each other, which quotes anchor which claims.
4. Identify pattern: do the sources collectively point somewhere unexpected? A pattern across N independent sources is itself an analytical finding.
5. Produce the skeleton with cross-references back to the source-specific notes — the skeleton is the writing scaffolding; the source notes are the evidence reservoir.

## Cost note

N-agent dispatch scales linearly with source count. For 5 sources, this is a moderate dispatch; for 20 sources, it's substantial. Budget Claude usage accordingly.

## Failure handling

If an agent fails on a specific source:

- Common reason: the source is too long for one agent's context window. Re-dispatch with the source chunked (front half / back half) — produce two analyses then merge.
- Alternative: the source is in a format that didn't ingest cleanly (scanned PDF with poor OCR, etc.) — pre-process the source (clean OCR, manually extract key sections), then re-dispatch.

If multiple agents fail consistently:

- The analysis schema may be too demanding for the kind of sources you have. Simplify the schema and re-dispatch.

## Per-source customization

Each agent can have a slightly different prompt if the source warrants it. For example, an interview transcript needs different analytical fields than a published paper. The default prompt above suits published academic sources; adapt freely.
