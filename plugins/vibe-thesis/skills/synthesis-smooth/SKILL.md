---
name: synthesis-smooth
description: "Apply the project's voice profile to a draft markdown file. Reads the `## VOICE SYNTHESIS` block from CLAUDE.md (extended via /vibe-thesis:voice extend) plus auto-detected exemplars; rewrites the draft in multi-pass (micro / rhythm / macro / exemplar-comparison) preserving claims and structure. Output to <draft>.smoothed.md alongside a unified diff summary. Companion to /vibe-thesis:voice (capture) and /vibe-thesis:guard (lint) — the apply step in the three-skill voice pipeline."
user-invocable: true
disable-model-invocation: false
allowed-tools: Read Edit Write Grep Glob
---

# /vibe-thesis:smooth — Synthesis Smooth

The third skill in the voice pipeline, after `/vibe-thesis:voice` (capture)
and before `/vibe-thesis:guard` (lint). Smooth applies a captured voice
profile to a draft so the prose reads in the user's voice without
flattening the argument or shifting the structure.

## Prerequisites

1. Current directory contains a `VIBE_THESIS_MARKER` stanza in `CLAUDE.md`.
2. CLAUDE.md contains a `## VOICE SYNTHESIS` block written by
   `/vibe-thesis:voice`.
3. Ideally that block has been extended via `/vibe-thesis:voice extend` so
   layers 2a/2b/3/4 are populated. If only the base block (anchors + ratio)
   is present, smooth surfaces a warning and proceeds with reduced signal.

## Inputs

- **Required positional:** path to a draft markdown file.

  ```text
  /vibe-thesis:smooth 03_BODY/00-introduction.md
  /vibe-thesis:smooth 08_OUTPUT/medium/article.md
  ```

- **Optional flags:**
  - `--exemplars=<path1>,<path2>` — pin specific files as canonical voice
    exemplars for this run (overrides auto-detection).
  - `--paragraphs=N-M` — only smooth a paragraph range (1-indexed,
    inclusive). Useful for spot-fixes on long drafts.
  - `--passes=micro,rhythm,macro,all` — control which passes run.
    Default: `micro,rhythm,exemplar`. `--passes=all` includes macro.
  - `--register=<tag>` — pick a specific register tag from the voice
    profile's narrative samples (e.g., `--register=magazine`). Default:
    auto-detect from draft characteristics.
  - `--dry-run` — extract candidates and print plan without writing the
    smoothed file.

## Behavior

### Step 1 — Verify prerequisites

1. **Marker check.** If `VIBE_THESIS_MARKER` stanza is missing from
   `CLAUDE.md`, refuse politely. *"This isn't a vibe-thesis project.
   Smooth is scoped to projects with a captured voice profile."*

2. **Voice block check.** Grep for `## VOICE SYNTHESIS` in CLAUDE.md.
   - **Missing entirely** → refuse. *"No voice profile found. Run
     `/vibe-thesis:voice` first to lay down the base block, then
     `/vibe-thesis:voice extend` for layers smooth needs."*
   - **Base block only** (no extended layers) → warn and proceed with
     reduced signal. *"Voice profile is anchor-level only — smooth will
     use general voice principles plus auto-detected exemplars. Run
     `/vibe-thesis:voice extend` for sharper transformation."*
   - **Extended block present** → proceed at full signal.

### Step 2 — Resolve exemplars

If `--exemplars` is set, use those paths verbatim (refuse if any are
missing). Otherwise auto-detect:

1. Look in the voice profile's Layer 2a sub-block for pinned exemplar paths.
2. If 2a is empty, fall back to:
   - `operating-tenets.md` at repo root, if present
   - `03_BODY/*.md` (or `03_BODY/<chapter>/*.md` for dissertation/masters mode)
3. If neither exists, warn: *"No exemplars detected. Smooth will use only
   the rules and narrative samples from the voice profile."*

Print the resolved exemplar list to the user before any rewriting starts.

### Step 3 — Resolve register

If `--register` is set, filter Layer 2b narrative samples to only those
matching the tag. If unset, auto-detect by scanning the draft:

| Draft signal | Inferred register |
| --- | --- |
| Path matches `08_OUTPUT/medium/**` or has "blog" in filename | magazine / blog |
| Path matches `03_BODY/**` of a dissertation/masters | academic / formal |
| Path matches `03_BODY/**` of an article | varies — fall back to user prompt |
| Path matches a README, work doc, or untagged location | professional / work |

If detection is ambiguous, ask the user one question: *"What register is
this draft written for? [magazine / academic / professional / teaching /
narrative]"*

### Step 4 — Parse the draft

Read the draft. Skip code blocks (fenced triple-backtick) and quoted
citations (blockquote-prefixed `>`). Build a paragraph list with line-range
metadata so the diff can map back to the original.

If `--paragraphs=N-M` is set, restrict the rewrite scope to that range.
Paragraphs outside the range are passed through unchanged.

### Step 5 — Run passes

Multi-pass, rule-by-rule. Each pass operates on the output of the previous
pass. Passes are deterministic in order; the macro pass is opt-in for v0.1.

#### Pass 1 — Micro-rules (always runs)

For each paragraph in scope:

- Apply punctuation rules from Layer 3 (em-dash density, ellipsis
  policy, period placement).
- Replace state verbs with motion verbs where it doesn't break meaning
  (per Layer 3 active/passive ratio).
- Strip lexicon flags (Layer 3 "avoid" list — corporate-speak hits,
  signature phrases the user explicitly rejected).
- Preserve signature phrases (Layer 3 "keep" list — discourse markers
  and phrases the user confirmed as voice).
- Adjust modal stance (hedge frequency, certainty markers) to match the
  Layer 3 register-tagged values for the resolved register.

**Hard constraints, all passes:**

- Paragraph count preserved exactly.
- Sentence count preserved within ±1 per paragraph.
- Claim content unchanged — no fact insertions, no removals, no inversions.
- Code blocks and quoted citations untouched.
- No new headings, no removed headings.

#### Pass 2 — Sentence rhythm

For each paragraph in scope:

- Match the sentence-length distribution from Layer 3 for the resolved
  register (mean and std-dev).
- Reshape sentences that overshoot the captured average length;
  combine fragments where exemplar prose runs longer; split run-ons
  where it runs shorter.
- Preserve the long-short alternation pattern from exemplars (short
  sentences clustering at section closes, etc.).

#### Pass 3 — Macro structure (opt-in via `--passes=all`)

For each paragraph in scope:

- Check argument sequencing against Layer 4 paragraph-template
  distribution. If a paragraph violates the dominant template, surface
  it as a candidate for restructuring.
- Adjust transitions between paragraphs (em-dash bridges, paragraph-break
  pivots; remove signposting like "as discussed above" or "in the next
  section").
- Rewrite section-close moves to match Layer 4 closing-move references
  (one-line landings, naming the principle, no summaries).

This pass carries the highest risk of altering argument flow. Surface a
diff specifically for paragraphs touched by the macro pass so the user
can spot semantic drift before accepting.

#### Pass 4 — Exemplar comparison (always runs, last)

For 3-5 paragraphs of greatest revision, present a 4-way comparison:

```text
─── Paragraph 14 ──────────────────────────────────────────
[Original]
<original paragraph>

[Smoothed]
<smoothed paragraph>

[Written exemplar reference]
<closest-matching paragraph from Layer 2a>

[Narrative exemplar reference, register: <tag>]
<closest-matching paragraph from Layer 2b cleaned copy>
───────────────────────────────────────────────────────────
```

The narrative exemplar is the gut-check — *does this sound like me when
I'm just talking?* If the smoothed paragraph diverges hard from both
exemplars, it's a candidate for manual revision rather than acceptance.

### Step 6 — Write output

Write the smoothed draft to `<original-stem>.smoothed.<ext>` next to the
original. Never overwrite the input file.

Print a summary to the terminal:

```text
Smoothed: 03_BODY/00-introduction.md
       → 03_BODY/00-introduction.smoothed.md

Voice profile:
  Anchors: <author list> @ <ratio>
  Extended layers: 2a (3 exemplars), 2b (2 narrative samples), 3, 4
Resolved exemplars: operating-tenets.md, 03_BODY/01-legitimacy.md
Resolved register: magazine

Passes run: micro, rhythm, exemplar
Paragraphs in scope: 31
Paragraphs touched: 24
Largest revisions: paragraphs 4, 12, 18 (4-way comparisons above)

Next: review the diff, then accept or run /vibe-thesis:guard on the result.
```

If `--dry-run` was set, skip the write and print the plan only.

## What smooth does not do

- **Doesn't change claims.** If the original says X, the smoothed says X.
  Smooth is a voice-layer rewrite, not a content edit.
- **Doesn't add or remove paragraphs.** Same structure, different voice.
- **Doesn't fact-check.** Out of scope.
- **Doesn't touch code blocks or quoted citations.** Skip-fence the same
  way `/vibe-thesis:guard` does.
- **Doesn't capture voice.** That's `/vibe-thesis:voice`'s job. If the
  voice profile is missing or thin, surface that — don't try to bootstrap
  one inline.
- **Doesn't lint for self-praise.** That's `/vibe-thesis:guard`'s job.
  Smooth might *introduce* self-review tone if exemplars contain it;
  guard is the second-line defense. The summary message reminds the user
  to run guard, but smooth never auto-runs it.
- **Doesn't transcribe audio.** Audio handling is out of scope. Narrative
  samples in the voice profile are pre-transcribed by the user.

## Edge cases

- **Voice profile has Layer 2b but no Layer 2a.** Smooth uses narrative
  samples as the only exemplar source. Surface the limitation: *"No
  written exemplars in profile — smoothing against narrative samples
  only. Output may lean conversational."*
- **Voice profile has Layer 2a but no Layer 2b.** Smooth runs without a
  narrative gut-check. Pass 4's 4-way comparison degrades to 3-way
  (no narrative exemplar shown). Surface: *"No narrative samples in
  profile — exemplar comparison runs without spoken-voice reference."*
- **Draft is empty or contains no prose** (just headings, just code).
  Report `0 paragraphs in scope. Nothing to smooth.` Don't write a
  smoothed file.
- **Draft already very close to the voice profile.** Surface that — *"0
  paragraphs flagged for substantive change. Draft is already in voice."*
  Don't write a smoothed file. Print noop summary.
- **Draft is in a register the voice profile has no narrative samples
  for.** Fall back to written exemplars only and surface the mismatch:
  *"Detected register 'professional / work' but no Layer 2b samples
  match. Using written exemplars only for this run."*
- **`--paragraphs=N-M` range is out of bounds.** Refuse and report the
  draft's actual paragraph count. *"Draft has 24 paragraphs; range 30-40
  is out of bounds."*
- **Exemplar file doesn't exist** (stale path in voice profile, file
  deleted). Skip the missing exemplar with a warning; proceed with
  available ones. If all are missing, fall back to auto-detection.
- **Macro pass introduces semantic drift.** The 4-way comparison is the
  detection surface. If the user runs `--passes=all` and the comparison
  shows a paragraph whose smoothed version no longer carries the same
  claim, the user rejects manually — smooth doesn't auto-revert. (v0.2
  could add a `--strict-claim` mode that diffs claim content and refuses
  to write paragraphs where claims drift.)

## Integration with the pipeline

Smooth lives in the middle of the three-skill voice pipeline:

```text
/vibe-thesis:voice   →   /vibe-thesis:smooth   →   /vibe-thesis:guard
   (capture)              (apply)                  (lint)
```

Each skill stands alone — smooth doesn't invoke voice or guard, and
neither invokes smooth. The summary message tells the user the next step;
composability is the user's call.

## v0.1 acceptance test

Re-run smooth on a draft known to have come back robotic — for the
canonical test case in this plugin's home project, that's
`08_OUTPUT/medium/how-i-ship-a-vibe-coded-app-medium.md` after a manual
register pass corrected it.

If smooth's output approaches the manual pass:
- Sentence-length distribution within 10% of the manual version
- No corporate-speak hits the manual pass removed
- Discourse markers from narrative samples preserved where appropriate
- Paragraph structure and claim content intact

…we ship v0.1. If smooth overshoots in either direction (too casual,
not casual enough, claim drift), tune the channels in the voice profile
before adding the macro pass to the default.
