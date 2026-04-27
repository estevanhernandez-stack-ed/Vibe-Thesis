# Verification Beats Owed to Next-Builder-Action

> Generated 2026-04-26 at end of /build for the Vibe Thesis v0.1 cycle.
>
> The Cart cycle's autonomous /build phase produced all 13 checklist items as
> file-creation work and ran every automated check that doesn't require Claude
> Code's slash-command runtime. Five verification beats remain owed because
> they require user-runtime invocation inside Claude Code, GitHub repo
> creation under Estevan's account, or Anthropic plugin marketplace
> submission — actions outside the plugin-track autonomous boundary.

## What's already empirically verified

- Plugin manifest JSON validity (both `marketplace.json` and `plugin.json` parse).
- Templates payload integrity (~103 files in `templates/full/`, 2 in
  `templates/overlay/`, marker stanza present, .gitattributes present).
- Overlay invariant (`scripts/check-overlay-invariant.sh` passes — every
  overlay file is byte-identical to its `templates/full/` counterpart modulo
  runtime scripts).
- All 4 ThesisStudio sub-skills present in `templates/full/.claude/skills/`.
- All 5 plugin-side skills present (`vibe-thesis`, `vibe-render`, `vibe-status`,
  `voice-synthesis`, `synthesis-guard`).
- All 4 slash command stubs present (`vibe-render`, `vibe-status`, `voice`,
  `guard`).
- Worked example complete (3 body sections + outline + proposal +
  claims-map + 5 real bib entries + README).
- Secrets scan over committed code: zero real secrets (only documentation
  references to design `tokens` and `--guard` flag descriptions).
- `npm audit` on `templates/full/package.json`: 0 vulnerabilities.
- All 13 checklist items committed locally with `Complete step N: <title>`
  message style.

## What's owed (and how to verify)

### Beat A — Hello-world preflight install verification ✓ COMPLETE 2026-04-26 21:08 CST

**Status:** green. Empirical findings landed below; spec.md + README updated
inline.

**What ran:**

1. Created `c:/tmp/vibe-thesis-helloworld/` initially as a bare plugin (just
   `.claude-plugin/plugin.json` + `skills/hello/SKILL.md` + `commands/hello.md`).
2. `/plugin marketplace add c:/tmp/vibe-thesis-helloworld` → **failed** with
   `Marketplace file not found at .../.claude-plugin/marketplace.json`.
3. **Finding #1:** `/plugin marketplace add` requires a marketplace, not a
   bare plugin. A marketplace is a directory with `.claude-plugin/marketplace.json`
   that points to nested plugins via `source` paths.
4. Restructured the preflight as a single-plugin marketplace (added
   `c:/tmp/vibe-thesis-helloworld/.claude-plugin/marketplace.json` pointing
   to `./plugins/vt-helloworld`; moved the plugin contents under
   `plugins/vt-helloworld/`).
5. Re-ran `/plugin marketplace add c:/tmp/vibe-thesis-helloworld` →
   **succeeded.**
6. `/plugin install vt-helloworld@vt-helloworld` → **succeeded.**
7. `/vt-helloworld:hello` → at first did not register; after a `/plugin reload`
   the skill responded with the expected preflight green message.
8. **Finding #2:** Claude Code does NOT auto-discover newly-installed plugins
   until a manual `/plugin reload` (or session restart). README updated with
   this guidance.

**Implications for the live Vibe Thesis install (Beat B):**

- Vibe-Thesis itself was already correctly structured as a marketplace (top-level
  `.claude-plugin/marketplace.json` + nested `plugins/vibe-thesis/`). No
  fix needed in the real plugin.
- Beat B users must run `/plugin reload` after `/plugin install vibe-thesis@vibe-thesis`
  before the orchestrator skill responds. Captured in README install
  instructions.

**Spec status:** spec.md > Plugin Manifest assumptions HOLD for the manifest
shape itself. The marketplace structure (separate `marketplace.json`) was
correctly captured in the original /spec via the live-docs verification at
the claude-code-guide subagent dispatch — what was NOT captured was the
plugin-reload requirement after install. Adding inline.

### Beat B — Path A (offline) round-trip

**How to verify:**

1. `gh logout` (temporary — restores at end).
2. Create fresh dir: `mkdir /tmp/vibe-thesis-pathA && cd /tmp/vibe-thesis-pathA`.
3. Open Claude Code in that directory.
4. Install the plugin: `/plugin marketplace add file:///c/Users/estev/Projects/vibe-thesis`
   (or the GitHub URL after Beat F pushes the repo).
5. `/plugin install vibe-thesis@vibe-thesis`.
6. Say: *"scaffold a vibe thesis project for me on rubber duck debugging"*.
7. Walk through the project-local `/bootstrap` interview (6 questions).
8. Walk through `/vibe-thesis:voice` (3 questions).
9. Confirm: `08_OUTPUT/pdf/example.pdf` exists and opens as a valid PDF.
10. `gh login` to restore.

### Beat C — Path B (gh template fork) round-trip

**How to verify:**

1. Confirm `gh auth status` reports authenticated.
2. Create fresh dir: `mkdir /tmp/vibe-thesis-pathB && cd /tmp/vibe-thesis-pathB`.
3. Open Claude Code in that directory.
4. (Plugin already installed if Beat B ran.)
5. Say: *"scaffold a vibe thesis project for me on rubber duck debugging"*.
6. Walk through bootstrap + voice.
7. Confirm: `08_OUTPUT/pdf/example.pdf` exists and opens as a valid PDF.
8. Confirm: `gh repo view <project-name>` shows the spawned repo on github.com.

### Beat D — Tree-equivalence diff between Path A and Path B

**How to verify:**

After Beats B and C succeed, run:

```bash
diff -r --exclude='.git' --exclude='node_modules' --exclude='08_OUTPUT' \
     /tmp/vibe-thesis-pathA/<project> /tmp/vibe-thesis-pathB/<project>
```

**Expected:** zero diffs.

**On non-zero diff:** the overlay is incomplete. Investigate which file
differs and either add it to `templates/overlay/` (if it's a local addition
ThesisStudio doesn't have) or remove it from `templates/full/` (if it's
ThesisStudio-only and somehow drifted into the plugin's bundled copy). Per
cart-cycle-brief stance, this triggers an `/iterate` beat to debug, not
next-builder-action.

### Beat E — Synthesis-guard end-to-end

**Why it's owed:** the synthesis-guard skill needs Claude Code's runtime to
execute the LLM-driven pattern scan. Bash regex would catch the easy cases
but miss the contextual ones.

**How to verify:**

A synthetic test body file is already at `c:/tmp/vibe-thesis-verify-<timestamp>/guard-test/03_BODY/test.md`
with 5+ self-review patterns. To use it:

1. Open Claude Code in that directory.
2. `/vibe-thesis:guard strict`.
3. Confirm 4-6 findings on the synthetic file (groundbreaking, contributions,
   to the best of our knowledge, comprehensively, rigorous, novel).
4. Replace `test.md` content with a clean version (e.g., the demo article's
   `03_BODY/01-introduction.md` content).
5. Re-run `/vibe-thesis:guard standard`.
6. Confirm 0 findings.

### Beat F — GitHub repo creation + push

**Why it's owed:** creating a GitHub repo under Estevan's account is a
visible-to-others action that warrants explicit Estevan authorization per
the system-instruction guidance on shared-state actions.

**How to do it (when ready):**

```bash
cd c:/Users/estev/Projects/vibe-thesis
gh repo create estevanhernandez-stack-ed/vibe-thesis \
  --description "Vibe Thesis — scaffold and co-author thesis-shaped artifacts (PDF, HTML, lay-version) with Claude Code." \
  --public \
  --source . \
  --remote origin \
  --push
gh release create v0.1.0 --title "v0.1.0 — initial release" --generate-notes
```

### Beat G — Anthropic plugin marketplace submission

**Why it's owed:** marketplace submission is an external-publication action
that warrants explicit Estevan authorization, AND the exact submission
mechanism (marketplace listing PR, form submission, support email) may have
evolved since the last 626Labs plugin shipped.

**How to do it (when ready):**

1. Verify the live submission process at https://code.claude.com/docs/en/plugin-marketplaces.md
   (or the latest equivalent URL).
2. Pattern-match against how Vibe Cartographer was submitted — Estevan's
   prior plugin shipping convention is the most current reference.
3. Submit per current process; the marketplace.json + plugin.json shapes
   are already correct (verified live at /spec time + cross-checked against
   working vibe-cartographer plugin).

## Notes on autonomous-mode boundary

This cycle was the second non-Substrate operationalization of the
`'fully-autonomous'` autonomy level (after Substrate Step 2 itself). Findings:

- **The plugin-track ran cleanly autonomous.** All 13 checklist items
  produced as file-creation work without builder-turn between items.
- **The harness boundary held.** Beats A-G are honest acknowledgments of what
  the plugin can't reach without user-runtime / GitHub-account /
  marketplace-portal invocation. Each is documented with a runnable procedure;
  none rely on undocumented assumptions.
- **The mid-build course-correction worked.** When item 2 (source repo
  audit) surfaced ThesisStudio drift that materially simplified the
  architecture, the orchestrator stopped, surfaced the finding, and asked
  Estevan for sign-off before applying the revision. Bumper-lane contract
  honored. Estevan also added two new requirements (voice-synthesis +
  synthesis-guard) at that beat — the chain absorbed both as new checklist
  items 7 and 8.

## What `/reflect` should evaluate

When `/reflect` runs after Beats A-G are closed:

1. Did Path A and Path B both round-trip cleanly on first install? (single
   non-negotiable acceptance criterion)
2. Was the tree-equivalence diff (Beat D) clean? (validates the overlay
   architecture)
3. Did synthesis-guard catch real self-review patterns in the synthetic test
   AND report zero findings on clean content? (validates the guard's
   precision/recall posture)
4. Did voice-synthesis produce a useful `## VOICE SYNTHESIS` block that
   the LeadWriter persona actually picked up at drafting time? (validates
   the voice-synthesis layer's utility)
5. Was the calibration-trust gap pattern present? (e.g., did any "feels
   good" decision turn out to bite at verification time?)
6. Did fully-autonomous chain-advance produce artifacts of equivalent
   quality to a guided multi-turn run? (validates the recursive-proof
   framing from cart-cycle-brief)
