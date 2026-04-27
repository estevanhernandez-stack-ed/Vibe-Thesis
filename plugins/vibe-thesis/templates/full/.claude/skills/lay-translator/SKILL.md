---
name: lay-translator
description: |
  Use this skill when the user wants to produce a plain-language version of an
  academic-mode ThesisStudio article — a translation of the rendered prose from
  the academic register (citations, technical vocabulary, methodologically-careful
  hedges) into the plain-language register a non-specialist reader can pick up
  cold. Output lands in `08_OUTPUT/layman/<artifact-name>.md` and is shaped so
  BlogStudio (or any blog-style publishing pipeline) can consume it directly.
  Triggers: "make a plain-language version", "translate to layman terms", "lay
  version", "accessible summary of this article", "blog version of the article",
  "explain this article to a non-specialist".
---

# Lay-translator skill

This skill produces a plain-language version of a ThesisStudio article. It is one half of a **ThesisStudio → BlogStudio pipeline**: the academic article is canonical, the lay version is its mirror, and BlogStudio is the publishing surface that consumes the lay version.

The skill assumes the source article is in finished or near-finished draft state in `03_BODY/` (or already rendered to `08_OUTPUT/markdown/`). It does not edit the source. It produces a sibling artifact.

## When to invoke

- The user has finished or near-finished an article and wants a plain-language summary for non-specialist readers.
- The user wants a blog-publishable version of an article they wrote in academic register.
- The user mentions "BlogStudio," "blog version," "lay version," "accessible version," or any equivalent.

## When NOT to invoke

- The article is still in early draft or planning state — translate the finished argument, not a moving target.
- The user wants to *edit* the academic version (use the simplify skill for code; a normal editing pass for prose).
- The user wants to translate into a different *language* (the skill is for register, not natural language).

## What "plain language" means in this skill

The skill produces output that is:

- **Same load-bearing claims**, different vocabulary. Technical terms get glossed in-line at first use, then used; jargon that resists glossing gets replaced with the closest plain phrase. The article's *argument* is preserved; the *register* changes.
- **Citations as endnotes, not inline.** The plain-language reader is not following Pandoc `[@authorYear]` markers in the prose. Citations move to a "Sources" section at the end, formatted as readable bibliography entries with one-line summaries of why each source matters.
- **Hedges preserved, technical hedges plainened.** "Non-identifiable in the formal sense" becomes something like "we can't separate these two effects with the data we have." The honest limit is preserved; the methodological term is unpacked.
- **Section structure simplified.** Four to six plain headings rather than the article's six numbered sections plus front matter and closing. Group where the academic version separates.
- **Lead author's voice preserved.** The plain-language version is still *the lead author's* article. Voice carries through; the register shifts.
- **Verbatim quotes that are load-bearing in the academic version stay verbatim** (the hinge sentences, the bumper-lanes line, the lead author's posture). Verbatim quotes that are *jargon-laden* get rendered with a plain-language gloss alongside.

## What "plain language" does NOT mean in this skill

- **Not dumbed-down.** The reader is non-specialist, not unintelligent. Respect their capacity to follow a real argument.
- **Not de-claimed.** Honest limits stay; recursion-bias caveats stay; the article's pillar-3 commitments survive translation.
- **Not de-cited.** Sources stay in a "Sources" section; the audit trail to the academic version is preserved.
- **Not de-contextualized.** If the academic version has a load-bearing technical detail (e.g., the Volatile Fact Registry's prior-art overlap with Twelve-Factor Factor III), the plain-language version explains the overlap in plain terms — it does not skip it.

## Inputs

- **Source article:** the most recently completed `03_BODY/` predraft *or* the rendered `08_OUTPUT/markdown/thesis.md`. Prefer the rendered output if it exists, since it has citations resolved and the design tokens applied. **When working from `03_BODY/` directly, Pandoc cross-references (`{#sec:foo}`, `[@sec:methodology]`) cannot be resolved without rendering — flag any unresolved cross-refs in the final report rather than guessing.**
- **Citation library:** `05_CITATIONS/references.bib` — for resolving cited keys into readable bibliography entries.
- **Glossary (optional):** `01_PLANNING/glossary.md` — adopted prior-art terms vs. coined-by-this-thesis terms; useful for deciding which jargon to keep (with gloss) vs. replace.
- **Cited companion pieces in research material:** `02_RESEARCH/` — when a verbatim quote attribution (e.g., bumper-lanes line cited as from a companion blog post) doesn't appear as a verbatim string in body prose, check whether the cited companion piece is mirrored as a research file (e.g., `02_RESEARCH/2026-04-24-bones-and-texture.md`). If so, lift the verbatim sentence from the companion piece. If not, flag the missing-verbatim and ask the lead author for the source sentence.

## Outputs

- **Primary artifact:** `08_OUTPUT/layman/<thesis-name>-lay.md` — a single markdown file containing the plain-language version, ready for BlogStudio consumption.
- **Manifest sidecar:** `08_OUTPUT/layman/<thesis-name>-lay.manifest.json` — records the source article's commit hash, the citation library version, and the skill version, so the lay version's provenance is reproducible.
- **Optional:** if the user asks for a shorter teaser version (for a social-media post or email lede), write a second file `<thesis-name>-lay-teaser.md` with the headline argument compressed to ~250 words.

## Workflow

1. **Read the source article** end-to-end. Note the load-bearing claims (use the claims-map in `01_PLANNING/claims-map.md` if present).
2. **Read the glossary** if present — note which terms the article adopted from prior art (these can be kept with gloss) versus coined (these probably need replacing or careful gloss).
3. **Pull verbatim hinge passages** the article protects. If the lead author has supplied an explicit verbatim list in the dispatch prompt, use it. Otherwise, scan for these heuristic patterns:
   - First-person posture statements from the lead author (often in front matter or closing).
   - Italicized full-sentence quotes attributed to a cited source via `[@key]`.
   - Sentences the article calls a "hinge," "anchor," or "bookend" in nearby prose.
   - Sentences that immediately precede a structural-finding citation.
   When a verbatim phrase is named but not present in body prose as a literal string, check companion pieces in `02_RESEARCH/` (e.g., the cited blog post's `.md` mirror) and lift the source sentence from there. If still not found, flag the missing-verbatim in the final report — do not paraphrase a verbatim requirement.
4. **Translate section by section.** For each academic section:
   - State the load-bearing claim in plain terms.
   - Carry the evidence in plain terms (file paths and code references stay; the *narration* around them simplifies).
   - Preserve honest limits explicitly.
   - Move citations to the Sources section.
   - Preserve the *rhetorical priority* of competing arguments (e.g., if the academic version frames a first-principles derivation as *stronger* than an instance-count argument, the lay version preserves that priority — do not present them at equal weight).
5. **Compose a Sources section.** For each citation in the academic version, write a one-line plain-language note: *"Pearl 2009, *Causality*: a textbook on when and why you can't separate the contributions of two things from each other; the article cites this for the limits of what its own existence proves."* For internal research syntheses (sources cited via `02_RESEARCH/` filepath rather than external publication), note the internal status and path: *"626Labs Research Swarm, 'The Architect Within — Producer-Side Synthesis' (internal research synthesis, 2026-04-26): a structured investigation of the dashboard's Architect role; located at `02_RESEARCH/2026-04-26-architect-research-synthesis.md`."*
6. **Write the manifest sidecar.** Schema (formalized for BlogStudio consumption):

   ```json
   {
     "skill_version": "v1",
     "translated_at": "<ISO-8601 datetime>",
     "source_article": {
       "commit": "<git SHA from `git rev-parse HEAD`>",
       "body_files": ["03_BODY/00-front-matter.md", "..."],
       "rendered_source": "<path to rendered markdown if used, else null>"
     },
     "citations": {
       "references_bib": "<path>",
       "references_bib_hash": "<md5 or sha256 sum of references.bib>"
     },
     "section_grouping_map": {
       "<lay-section-heading>": ["<source-section-id>", "..."]
     },
     "verbatim_phrases_preserved": ["<list of verbatim strings carried through>"],
     "translator_flags": ["<short list of judgment-call flags for lead-author review>"]
   }
   ```

   The `section_grouping_map` is what BlogStudio uses to map back to the academic version when a reader clicks "see the academic source." The `verbatim_phrases_preserved` and `translator_flags` are review surface for the lead author.
7. **Report.** Tell the lead author: word count, load-bearing claims preserved, any sentence the translator wasn't able to render in plain language without losing the academic version's precision, any unresolved verbatim or cross-reference, and any unclarity in this SKILL.md the workflow surfaced (so the skill can be refined for the next run).

## Anti-bias guardrails

- Do not soften limits. If the academic version says "the article cannot disentangle these contributions," the plain-language version says the same in plain words — not "we should investigate this further" or other softening.
- Do not amplify novelty. If the academic version positions a primitive as a domain-extension of prior art, the plain-language version does the same — it does not call the primitive "new" when the academic version is careful not to.
- Do not invent examples. If the academic version is abstract, the plain-language version is allowed to ground in concrete examples *only if those examples are already present in the article's research material*. Inventing a new example breaks the audit trail.
- Preserve the lead author's voice. Plain language ≠ generic register. The lead author's first-person framings and posture statements carry through.

## Pipeline output for BlogStudio

The output is shaped to be picked up by BlogStudio without further translation:

- Single markdown file with simple section headings.
- Frontmatter block (YAML) with title, author, date, source-article-link, summary line.
- Sources section formatted as a list, BlogStudio-friendly.
- No Pandoc-specific syntax (no `{#sec:foo}` cross-refs, no `[@key]` inline citations) — those got resolved during translation.

The lay version is **canonical for what it is** (the lay reading). The academic version is **canonical for the underlying argument**. The skill maintains the link via the manifest sidecar; BlogStudio inherits the link via the lay version's frontmatter.

## Length guidance

A full lay version of a ~10,000-word academic article typically runs 5,000–6,000 words — about 60% of source length. This is *not* a "two-minute read"; it is a translation that consolidates structure (six sections instead of nine source files) and moves citations to a Sources section, but preserves the argument's density. Readers expecting a brief summary need the teaser variant below.

If the lead author wants a shorter form, request the `--teaser` mode explicitly in the dispatch prompt (see Future work). Without that mode, the skill produces the full lay version only.

## Future work / open questions

- A `--teaser` mode that compresses the headline argument to ~250 words for social-media or email-lede use, output as `<thesis-name>-lay-teaser.md` alongside the full lay version.
- A `--with-comparison` mode that produces a side-by-side academic-vs-lay diff for editorial review (e.g., when the lead author wants to verify a particular passage's translation didn't lose precision).
- Integration with the BlogStudio publish pipeline — at what point does BlogStudio pull the lay version, and does it transform further? Out of scope for this skill; coordinate with BlogStudio's own SKILL.md.

## Test-drive notes (v1, 2026-04-26)

The skill was test-driven on the *Agentic Architect* article (~9,000 source words, nine body files). The full lay version came in at 5,332 words. All five categories of load-bearing claim (definition, four-surface, primitives, counter-evidence, limits) survived translation. Both verbatim hinge sentences carried through; the lead-author posture quote carried through. Three passages required compression that the lead author should verify in editorial review (the inter-rater-agreement methodological distinction; the MCP "necessary but not sufficient" caveat; the CAP-theorem rhetorical priority). The bumper-lanes verbatim handling surfaced the gap that step 3 of the workflow now addresses (companion-piece lookup). Schema for the manifest sidecar was formalized in v1 based on the test-drive's findings; pre-v1 runs invented their own schema.
