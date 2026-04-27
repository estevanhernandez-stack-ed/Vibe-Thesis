---
name: vibe-status
description: "Compose a one-screen summary of the current Vibe Thesis project: title and mode, planning docs presence, body content counts, claim coverage, citations health, last render timestamp. Read-only."
user-invocable: true
allowed-tools: Read Grep Glob Bash(test *) Bash(stat *)
---

# /vibe-thesis:vibe-status

A one-screen project state report. Read-only — no writes.

## Prerequisites

Current directory must contain a `VIBE_THESIS_MARKER` stanza in `CLAUDE.md`.

## Behavior

1. **Verify marker.** Refuse politely if missing.

2. **Read project identity.** Parse `CLAUDE.md` for the title placeholder
   (or substituted value) and the `THESIS_MODE` field.

3. **Walk planning docs.** For each of `01_PLANNING/proposal.md`,
   `01_PLANNING/outline.md`, `01_PLANNING/claims-map.md`, report:
   - `✓` if file exists and has substantive content (>200 chars, ignoring
     placeholder text like `[YOUR PROPOSAL HERE]`).
   - `—` if missing or still placeholder.

4. **Walk body content.** Count `03_BODY/*.md` files (or `03_BODY/<chapter>/*.md`
   for `dissertation` and `masters` modes) with non-empty content. Report
   `<populated>/<total>`.

5. **Claim coverage.** Count claims listed in `claims-map.md` (heuristic:
   lines matching `^- \[claim:` or numbered `^[0-9]+\.`). Count `[claim:N]`
   references in `03_BODY/`. Surface orphans (claims in body not in map, OR
   claims in map not referenced anywhere).

6. **Citations.** Use `check-citations.js` output if available; else count
   unique `[@key]` references in `03_BODY/` vs unique entries in
   `05_CITATIONS/references.bib`. Surface missing keys.

7. **Last render.** `find 08_OUTPUT -name '*.manifest.json' -printf '%T@ %p\n'`,
   sort, pick newest. Report `<format>` + timestamp.

8. **Voice synthesis.** `grep -q "## VOICE SYNTHESIS" CLAUDE.md`. Report
   `set` or `not yet — run /vibe-thesis:voice`.

9. **Lay-sync.** v0.1: print `lay-sync: not enabled in v0.1` rather than
   omitting — keeps the status output honest about what the plugin doesn't
   yet track.

## Output format (target: ≤30 lines)

```text
Vibe Thesis status — <project title>
Mode: <thesis_mode>     Voice synthesis: <set|not yet>

Planning
  proposal.md      ✓
  outline.md       ✓
  claims-map.md    —

Body
  3 of 8 chapters populated

Claims
  12 claims in map; 9 referenced in body. 3 orphan claims (see claims-map.md
  lines 14, 22, 31).

Citations
  47 references in body; 45 entries in references.bib. 2 missing keys:
  @smith2024, @jones2025.

Last render
  pdf — 2026-04-26 19:48 CST (08_OUTPUT/pdf/example.pdf)

Lay-sync
  not enabled in v0.1
```

## Edge cases

- Project just-scaffolded (no content): show zeros and reasonable next-step
  hints. ("Write your proposal in `01_PLANNING/proposal.md` to get started.")
- Multi-author chapters present: count `merged.md` files for body counts;
  ignore unmerged `author-*.md` siblings.
- `claims-map.md` uses a custom format the heuristic doesn't match: surface
  `claim coverage: heuristic didn't match your claims-map format; skipping`.
