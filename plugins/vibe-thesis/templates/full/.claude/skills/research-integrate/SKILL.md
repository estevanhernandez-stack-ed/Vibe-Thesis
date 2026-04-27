---
name: research-integrate
description: |
  Use this skill when the lead author has done manual hand-research (read a
  paper, taken notes on a book chapter, gathered quotes from a primary source)
  and wants those notes folded into the article cleanly. The skill takes the
  notes plus a target section or claim ID, produces BibTeX additions for any
  new sources, writes engagement notes into 02_RESEARCH/prior-art/, proposes
  updated body prose with the new citations integrated, and updates the
  planning artifacts (claims-map status flags, external-citations-map entries)
  consistently. Triggers: "integrate this research into §X", "I have notes on
  Y, add them to the article", "deepen the §X.Y grounding with these sources",
  "fold this hand-research in", "I read [source], add it to the bibliography
  and §X."
---

# Research-integrate skill

This skill is the receiver for hand-research the lead author does in the editorial loop. It bridges the gap between *the lead author's reading and notes* and *the article's structured artifacts* (body prose + claims-map + references.bib + research notes). It does the bookkeeping so the lead author keeps the editorial judgment.

The skill is the symmetric counterpart of the lit-review swarm: where the swarm dispatches agents to *find* citations, this skill ingests citations the lead author *finds by hand* and integrates them.

## When to invoke

- The lead author has read one or more sources (paper, book chapter, blog post, talk transcript) and has notes ready.
- The lead author wants the notes integrated into a specific section or claim, not freely roam-folded into the whole article.
- The article's grounding for a claim has been flagged as "weakly grounded" or "needs hand-research" in the claims-map or external-citations-map.

## When NOT to invoke

- The user is doing fresh literature search (use the lit-review swarm playbook instead).
- The user wants to *replace* a citation with another (use a normal editorial pass).
- The notes don't yet contain a specific source — the skill needs at least one sourceable claim per note (author + year + work + quoted/paraphrased substance).

## Inputs

- **Hand-research notes:** either a path to a markdown/text file or content pasted into the dispatch prompt. The notes should include for each source: full citation (author, year, title, publisher/journal/URL), at least one quotable passage or paraphrased argument, and the lead author's read on what the source contributes to the article's claim.
- **Target section or claim ID:** the section header (e.g., "§1.2") or claim ID from the claims-map (e.g., "§1.2 — frame vs complete"). The skill uses this to scope the integration.
- **Article context:**
  - `01_PLANNING/proposal.md`, `01_PLANNING/outline.md`, `01_PLANNING/claims-map.md`, `01_PLANNING/glossary.md` — for understanding existing positions and avoiding duplicate citations.
  - `02_RESEARCH/external-citations-map.md` — for understanding what's already grounded and what's still flagged.
  - `05_CITATIONS/references.bib` — for checking whether a source the user provides is already cited under another key.
  - The relevant body file(s) in `03_BODY/` — for the integration's prose target.

## Outputs

The skill produces several deliverables; depending on the lead author's preference, all may be applied automatically or staged for review.

1. **BibTeX entries** added to `05_CITATIONS/references.bib` — one per new source, following the existing key conventions in the bib (lastname + year + short-name). The entry includes a `note` field documenting the source's role in the article's argument (e.g., "Cited at §1.2 as background lineage from the situated-action tradition; supplements [@suchman1987plans] with second-edition reframing").

2. **Engagement note** in `02_RESEARCH/prior-art/<topic>/<NN>-<author-year-shortname>.md` — one per substantive source, following the existing engagement-note format in `02_RESEARCH/prior-art/`: BibTeX-friendly citation, one-paragraph summary, the source's main claim, honest engagement with how the source supports or contradicts the article's claim, recommended quotable lines, "how to cite this" line keyed to claim IDs.

3. **Proposed body-prose update** for the target section — a diff or new paragraph (depending on whether the integration extends an existing claim or adds a new one), with the new `[@key]` citations slotted. Always staged for the lead author's review before being applied to `03_BODY/` (do not auto-apply prose changes; the lead author's voice is the article's voice).

4. **Claims-map status update** — if the integration moves a claim from "weakly grounded" or "needs external" to "moderately/well-grounded," the `01_PLANNING/claims-map.md` status flag flips. Update is mechanical.

5. **External-citations-map entry update** — if the integration closes an EXT-TBD flag, the row in `02_RESEARCH/external-citations-map.md` updates from "TBD" or "needs hand-research" to the cited keys.

6. **Memory note** — a project-type memory file documenting what the integration added, why, and how the lead author framed the source's contribution (so future-session continuity knows about the integration without re-reading the notes).

## Workflow

1. **Read the notes.** Identify each distinct source. For each: confirm full citation details (author, year, title), confirm at least one quotable passage or argument, confirm the lead author's framing of what the source contributes.

2. **Check for duplicates.** Grep `05_CITATIONS/references.bib` for the source's author/year — is it already cited under another key? If yes, surface the conflict and ask the lead author whether to deduplicate or use both keys.

3. **Read the target section.** Open the relevant `03_BODY/` file and the relevant claims-map row. Note the existing citations for the target claim. Identify whether the integration *extends* an existing claim, *adds new evidence to an existing claim*, or *introduces a new sub-claim*.

4. **Draft the BibTeX entries.** One per new source, following the conventions in references.bib (citation-key form, fields populated, `note` field documenting the source's role).

5. **Draft the engagement notes.** One per substantive source, in `02_RESEARCH/prior-art/<topic>/`. Follow the existing engagement-note format. The lead author's framing of the source's contribution is the load-bearing content of the engagement note's "honest engagement" section.

6. **Draft the body-prose update.** Compose the new paragraph or sentence-level edit that incorporates the new citations. Preserve the lead author's voice. Preserve the article's existing framing (lineage-not-identity, original-to-this-thesis flags, honest-limits language). Do not paraphrase verbatim quotes from the lead author's notes; carry them through as direct quotes if the article's prose convention permits.

7. **Apply mechanical updates.** BibTeX entries, engagement notes, claims-map status flags, external-citations-map entries — apply directly. The lead author's editorial judgment is in the source selection and the source-to-claim mapping, not in the bookkeeping.

8. **Surface the body-prose update for review.** Do not auto-apply prose changes to `03_BODY/`. Surface the proposed paragraph(s) in the report and ask the lead author for sign-off before applying.

9. **Save the memory note.** Document what was integrated, why, into which section, with citation keys.

10. **Report.** Tell the lead author: how many sources integrated, BibTeX keys added, engagement notes written, claims-map flags flipped, external-citations-map entries updated, and the proposed body-prose update with explicit "apply this?" prompt.

## Anti-bias guardrails

- **Do not fabricate sources.** If the lead author's notes are missing a bibliographic field (e.g., page range), flag it as missing rather than inventing.
- **Preserve the lead author's editorial judgment** about what's load-bearing in each source. The skill's job is bookkeeping, not editorial selection.
- **Do not auto-apply body-prose changes.** Always stage for review. The article's voice is the lead author's.
- **Surface mapping conflicts** between the notes and the existing article framing. If the lead author's notes suggest a *different* framing than the current outline (e.g., the source contradicts a claim), say so explicitly — don't smooth over the conflict.
- **Preserve verbatim quotes verbatim.** When the lead author's notes include direct quotes, carry them through as direct quotes; ask before paraphrasing or compressing.
- **Update planning artifacts consistently.** A claims-map flip without an external-citations-map update, or vice versa, leaves the audit trail half-correct. The skill applies both.

## Example invocation

> "I have notes on Suchman 2007 *Human-Machine Reconfigurations* and Hutchins 1995 *Cognition in the Wild* that deepen the §1.2 grounding. Notes are in `~/notes/suchman-hutchins-2026-04-27.md`. Integrate."

The skill reads the notes, finds two new sources (Suchman 2007 second edition; Hutchins 1995), checks the bib for duplicates (Suchman 1987 is there as `suchman1987plans`; Suchman 2007 is a separate edition that warrants its own entry as `suchman2007reconfigurations`), drafts the BibTeX entries, writes engagement notes at `02_RESEARCH/prior-art/ai-agent-design/07-suchman-2007-human-machine-reconfigurations.md` and `08-hutchins-1995-cognition-in-the-wild.md`, drafts a body-prose update for §1.2 that adds the second-edition reframing and the distributed-cognition extension, flips claims-map §1.2 status from "moderately grounded (background lineage)" to "well-grounded (background lineage; second-edition reframe; distributed-cognition extension)," updates the external-citations-map entry, and surfaces the proposed §1.2 paragraph for editorial review.

## Future work / open questions

- A `--dry-run` mode that produces the integration plan without writing any files (useful when the lead author wants to evaluate the plan before letting the skill apply mechanical updates).
- A `--with-claims-map-rationale` mode that, in addition to flipping the status flag, records the *reason* the claim's grounding strengthened (e.g., "added second-edition reframe, distributed-cognition extension"). The current external-citations-map already supports this kind of rationale; the skill could be more explicit about generating it.
- Integration with the lit-review swarm convergence — when a swarm produces "needs hand-research" flags, the research-integrate skill is the natural receiver for those follow-ups.
