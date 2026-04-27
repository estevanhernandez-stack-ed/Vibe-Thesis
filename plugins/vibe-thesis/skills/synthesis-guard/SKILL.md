---
name: synthesis-guard
description: "Lint pass over the project's body content for self-review tone. Scans 03_BODY/*.md (and chapter subdirs in dissertation / masters mode) for inflationary language, self-praise framings, defensive over-qualification, and conclusions that re-assert importance instead of letting findings speak. Reports findings as file:line references with one-line suggestions. Advisory — doesn't auto-fix. Makes ThesisStudio's third pillar default (Honest Limits) enforceable."
user-invocable: true
disable-model-invocation: false
allowed-tools: Read Grep Glob
---

# /vibe-thesis:guard — Synthesis Guard

The third moment in the writing loop, after **scaffold** (orchestrator) and
**voice** (voice-synthesis): catching when the prose drifts toward
self-review tone.

## Prerequisites

Current directory must contain a `VIBE_THESIS_MARKER` stanza in `CLAUDE.md`.

## Why this exists

Academic prose has a characteristic failure mode: **the work praising itself**.
Symptoms include:

- Inflationary adjectives (*groundbreaking*, *comprehensive*, *rigorous*,
  *definitive*, *novel*, *state-of-the-art*).
- Self-praise framings (*we make N contributions*, *to the best of our
  knowledge no prior work*, *our approach uniquely*, *this is the first*).
- Defensive over-qualification (*despite limitations, our findings demonstrate*,
  *while the methodology is bounded, the results clearly show*).
- Conclusions that re-assert importance instead of letting findings speak
  (*these results have profound implications*, *this work opens new directions*).

The third ThesisStudio pillar default is **Honest Limits**. Self-review tone
is the inverse — and it's the dominant failure mode of LLM-assisted academic
writing because the model is trained to defend its outputs.

This skill catches the pattern as a lint pass. Advisory — the user revises.

## Behavior

1. **Verify marker.** Refuse politely if missing.

2. **Parse argument.**
   - `standard` (default): inflationary language + self-praise framings only
     (the highest-signal patterns, lowest false-positive rate).
   - `strict`: full pattern set including defensive over-qualification +
     conclusions-re-asserting-importance.

3. **Determine body file set.** Read `THESIS_MODE` from CLAUDE.md.
   - `dissertation` / `masters` → `03_BODY/<chapter>/*.md` recursively.
   - `article` → `03_BODY/*.md`.
   - If mode is missing or unparseable, fall back to `03_BODY/**/*.md`.

4. **Scan each file.** For each `.md` file in the body set, scan line-by-line
   for the patterns below. Skip code blocks (lines between fenced
   triple-backtick blocks).

5. **Report.** For each finding, emit one line:

   ```text
   <file>:<line>  <pattern-category>  "<quoted offending phrase>"  → <one-line suggestion>
   ```

6. **Summary.** End with: `<N> findings across <M> files. Strict pattern set:
   <yes/no>. Pillar reference: Honest Limits (ThesisStudio default pillar #3).`

7. **Exit cleanly always.** This is advisory; not a gate. Pre-render integration
   in `/vibe-thesis:vibe-render --guard` is what blocks renders if findings are
   present, not this skill itself.

## Pattern table

### Standard (always-scanned)

| Category | Match | Suggestion |
|---|---|---|
| Inflationary | `\b(groundbreaking\|comprehensive\|rigorous\|definitive\|novel\|state-of-the-art\|seminal\|paradigm-shifting\|cutting-edge)\b` | Name what's covered or claimed instead. "Comprehensive" → list the dimensions. "Novel" → name what's new and what came before. |
| Self-praise framings | `\b(we make \w+ contributions?\|to the best of our knowledge\|no prior work has\|our approach uniquely\|this is the first\|we are the first to\|this work demonstrates that)\b` | Let the work demonstrate; don't announce the demonstration. Cite the comparison point if claiming first-ness. |

### Strict-only (additional patterns)

| Category | Match | Suggestion |
|---|---|---|
| Defensive over-qualification | `\b(despite limitations,?\|while \w+ is bounded\|notwithstanding\|albeit\|while not exhaustive)\b.{0,80}\b(demonstrate\|show\|prove\|establish\|evidence)` | Either the limitation matters (then own it without demonstrating around it) or it doesn't (then drop the qualifier). |
| Conclusion re-assertion | `(in conclusion\|to summarize\|in summary).{0,200}(profound\|important\|significant\|crucial\|critical\|opens new\|paves the way)` | Conclusions should restate findings, not their importance. Let the reader weigh significance. |
| Hedging-with-importance | `\b(arguably\|perhaps\|it could be said).{0,80}(important\|significant\|profound\|notable)` | If you have to argue it's significant, the work hasn't earned the claim. Strengthen the evidence or drop the importance claim. |

## Output examples

**Clean run:**
```text
0 findings across 8 files. Strict pattern set: no.
Pillar reference: Honest Limits (ThesisStudio default pillar #3).
```

**Findings run:**
```text
03_BODY/01-introduction.md:14   inflationary       "We propose a comprehensive framework"   → "Comprehensive" → list the dimensions covered.
03_BODY/01-introduction.md:23   self-praise        "to the best of our knowledge, no prior work has addressed"   → Either cite the comparison point or rephrase as a positive claim ("This work addresses X by ...").
03_BODY/03-methods.md:8         inflationary       "a novel approach to"   → "Novel" → name what's new and what came before.
03_BODY/05-conclusion.md:42     conclusion-reassertion (strict)   "These results have profound implications for"   → Restate the findings instead. Significance is the reader's call.

4 findings across 2 files. Strict pattern set: yes.
Pillar reference: Honest Limits (ThesisStudio default pillar #3).
```

## Edge cases

- Body content is empty (just-scaffolded project): report `0 findings across
  0 files. Body is empty — guard pass deferred until you write content.`
- A pattern lives inside a code block or a quoted citation: skip it. Code
  blocks are detected by triple-backtick fences; quoted citations are
  blockquote-prefixed (`>`).
- A file has 50+ findings: print the first 10, then `... <N more findings
  in this file. Re-run with --strict for full output.`
- The user has explicitly approved an inflationary phrase via a per-file
  pragma comment (`<!-- guard: ignore inflationary -->`): respect the pragma
  for that file. (v0.2 feature — for v0.1, all findings surface.)

## Integration with `/vibe-thesis:vibe-render --guard`

When invoked from `/vibe-thesis:vibe-render` with the `--guard` flag, the
render skill dispatches `/vibe-thesis:guard standard`, surfaces findings, and
asks the builder to acknowledge or fix before rendering. The guard skill
itself doesn't know about that integration — it just runs the lint and
reports.
