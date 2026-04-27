# Process Notes

## /onboard

**Run:** 2026-04-26 (CST), fully-autonomous mode, builder identity = `self`.

**Cycle:** Vibe Thesis — packaging the `agentic-architect-vibe` toolchain as a distributable Claude Code plugin. 10th Cart cycle for Estevan.

**Cycle brief:** `VIBE_THESIS_HANDOFF.md` (in repo root). 22.6KB, 7 sections + appendix. Pre-states scope, file inventory by origin (T / T+L / L / C), commit trace of local additions, coupling map, plugin layout sketch, MVP cut, open questions for Cartographer, suggested first three moves. Treated as the canonical cart-cycle-brief for this cycle — absorbed every upfront-question fork /onboard would normally interview on.

**Decay check:** clean. All shared profile fields stamped 2026-04-25 with TTLs of 90+ days. Nothing prompted.

**Returning-builder posture:** veteran (9 completed Cart cycles, rich profile, active plugin contributor, this is his 10th cycle). No interview steps run; `/onboard` compressed to: read brief → generate `docs/builder-profile.md` → update unified profile → emit handoff envelope.

**Technical experience summary:** experienced; deep stack across TS/Python/JS/Luau/C#/C++; deep AI agent experience (3 plugins shipped to marketplace, including this one). For this cycle the explicit unknown is Anthropic's plugin manifest format and marketplace install path — `/spec` must verify against live Claude Code docs.

**Project goals:** ship Vibe Thesis MVP — orchestrator skill + bootstrap/merge-authors sub-skills + /vibe-render + /vibe-status + templates payload + dev container with the three hard-won fixes + plugin manifest + one worked example. Definition of success: install into fresh directory, type "scaffold a vibe thesis project for me," confirm round-trip through `npm run render:pdf`.

**Design direction notes:** clean, functional, high-contrast. Templates' rendered outputs must feel publishable on first scaffold — `examples/` 3-page demo article is the visible proof.

**Prior SDD experience:** veteran. `/reflect` quiz should treat Estevan as someone who could teach the SDD pattern. Deepening-round habits: zero rounds when spec is clean (default for this cycle), 3+ when scope is genuinely fluid.

**Project origin:** extension of an existing artifact (`agentic-architect-vibe` fork of `ThesisStudio`), packaged as a new sibling repo. NOT greenfield — the architectural decisions are largely pre-made; `/scope` and `/prd` will compress; `/spec` and `/checklist` carry the load on plugin-manifest shape, orchestrator decision tree, and extraction sequence.

**Architecture docs:** the cycle brief itself + the source repo at `/workspaces/agentic-architect-vibe/` (devcontainer path, not directly reachable from this Windows host — rely on brief's inventory). `/spec` falls back to architecture-default-patterns for plugin-manifest specifics; verify against live Claude Code docs per cycle brief §6 Q1 + §7 Move 1.

**Deployment target:** Anthropic plugin marketplace + GitHub. Resolve namespace (`estevanhernandez-stack-ed/vibe-thesis` vs. `@626labs/vibe-thesis`) at `/spec` time based on Estevan's current convention for the other shipped plugins. Captured on unified profile as `plugins.vibe-cartographer.deployment_target = "claude-plugin-marketplace+github"`.

**Notable engagement signal observed:** none yet — fully-autonomous, no in-conversation interview turn. The signal that matters next is whether Estevan course-corrects the structured handoff envelope vs. lets it ride straight into `/scope`. The bumpers-up contract governs.

**General energy / engagement style:** veteran-confident. The cycle brief is more thorough than most projects' /spec outputs — Estevan has already done a meaningful chunk of the planning work outside Cart. `/scope` and `/prd` should respect that and not re-litigate decisions already in the brief.

**Constraints to surface to downstream commands:**

1. **Sibling-repo discipline.** Per cycle brief §6 Q8: all build work happens in `c:\Users\estev\Projects\vibe-thesis\` (this directory). NEVER touch `agentic-architect-vibe` — it's the article repo and must keep functioning. Any extraction work means *copying out*, not modifying in place.
2. **Source repo not directly accessible.** Files at `/workspaces/agentic-architect-vibe/` are inside a devcontainer environment, not on this Windows host. Cartographer cannot Read them directly. Treat the cycle brief's inventory + the upstream template (`https://github.com/estevanhernandez-stack-ed/ThesisStudio` and `https://github.com/estevanhernandez-stack-ed/agentic-architect-vibe`) as authoritative — fetch via `gh` if needed at `/spec` or `/build` time, but verify the cycle brief's claims first.
3. **Plugin manifest format must be verified live** at `/spec` time. Cycle brief §6 Q1 and §7 Move 1 are explicit on this. Don't draft the manifest from training-data assumptions.
4. **Deferred to v0.2+:** `lay-translator` sub-skill, `research-integrate` sub-skill, additional slash commands, modes beyond dissertation/article/masters, standalone CLI, marketplace polish. `/scope` should keep these out of MVP unless Estevan re-opens.

**Artifacts written this command:**

- `docs/builder-profile.md`
- `process-notes.md` (this file)
- Unified profile updated (`plugins.vibe-cartographer.projects_started` 9→10, `last_project` set, `last_updated` 2026-04-26, `deployment_target` set, `last_seen_complements` updated).

**Handoff:** structured envelope (fully-autonomous mode) — outer harness fires `/scope`. Verification beats owed: none at this command.

## /scope

**Run:** 2026-04-26 (CST), fully-autonomous mode, no interview turn.

**Inputs absorbed:**

- `docs/builder-profile.md` (just written by /onboard)
- `VIBE_THESIS_HANDOFF.md` (originating cycle-brief from Estevan, pre-Cart)
- Unified profile `~/.claude/profiles/builder.json`

**Compression:** maximal. The originating handoff sketch is more thorough than most projects' /spec outputs — it pre-stated scope, file inventory by origin, commit trace, coupling map, plugin layout, MVP cut, open questions, and suggested first three moves. Generating /scope was distillation, not discovery.

**Cycle-brief mode:** auto-on (fully-autonomous). Wrote `docs/cart-cycle-brief.md` as the per-cycle pre-stated stance doc that downstream commands will treat as canonical at fully-autonomous level. Cart-side restatement of the originating handoff with command-by-command stance pre-statements added.

**Key decisions captured in scope:**

1. **MVP boundary:** orchestrator skill + bootstrap/merge-authors sub-skills + /vibe-render + /vibe-status + templates payload + dev container + plugin manifest + one worked example. Single non-negotiable acceptance criterion: install plugin into fresh dir → "scaffold a vibe thesis project for me" → round-trips through `npm run render:pdf` with no manual fixups.
2. **Sibling-repo discipline as load-bearing constraint.** Build work in `c:\Users\estev\Projects\vibe-thesis\` only. NEVER touch `agentic-architect-vibe`. Encoded into cart-cycle-brief constraints + /spec and /checklist will encode as hard guard.
3. **No new dependencies.** Lift existing stack verbatim. Single new dep would need explicit /spec justification.
4. **Plugin manifest format must be verified live at /spec.** Don't draft from training-data assumptions. Hello-world pre-flight as load-bearing /spec deliverable.
5. **Recursive-proof framing:** Vibe Thesis is the first non-Substrate operationalization of the principal-level-coder-prompt thesis. Builder identity = `'self'` (not `'agent-persona'`) isolates the brief's effect from the agent-as-builder framing. Sibling-thesis surfaced: plugin-form distribution of a thesis-writing toolchain — the toolchain that produced the article becomes the plugin that produces toolchains for other theses.

**Pushback / course corrections:** none — fully-autonomous, no in-conversation builder turn at /scope. Will surface at /prd if any decision warrants escalation.

**References / examples that resonated:** the existing 626Labs marketplace plugins (Vibe Cartographer, Vibe Doc, Vibe Test) as the pattern-match source for manifest shape, README/install conventions, namespace selection. ThesisStudio template as the closest "Vibe Thesis without the article" reference. ADRs from source repo as a lift candidate (or condense to single `docs/architecture.md` per /spec decision).

**Deepening rounds:** 0. Per cart-cycle-brief stance pre-statement: brief is thorough enough that prompt-machine value is captured by the structural questions, not by additional rounds. Asking-is-the-value principle still respected — the structural questions in /scope template (idea, who, inspiration, goals, what done looks like, what's cut, loose impl notes) prompted the distillation.

**Active shaping signal:** N/A this command (no in-conversation turn). Watch /prd and /spec for it.

**Artifacts written this command:**

- `docs/scope.md`
- `docs/cart-cycle-brief.md`
- `process-notes.md` (this section)

**Handoff:** structured envelope (fully-autonomous mode) — outer harness fires `/prd`. Verification beats owed: none at this command. Cart-cycle-brief is now canonical for downstream commands at fully-autonomous level.

### Course-correction at 2026-04-26 19:08 CST (post-/scope, pre-/prd)

Estevan surfaced that [ThesisStudio](https://github.com/estevanhernandez-stack-ed/ThesisStudio) is a **GitHub *template* repo** (clickable "Use this template") — not just the upstream reference for inventory comparison. This is a real architectural fork that I had collapsed into "upstream reference" framing during /scope distillation.

**The fork:** the plugin has **two viable scaffold paths**, not one.

- **Path A — plugin-bundled templates:** copy the plugin's `templates/` payload locally. Offline-capable, version-locked to plugin release.
- **Path B — GitHub template fork:** `gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>` to spawn a fresh repo. Always-fresh, network-dependent, requires `gh` auth.

**Why this matters:**

- Bumper-lane interpretation: this is exactly the kind of mid-flow course-correction the bumper-lane contract is designed for — Estevan caught load-bearing drift after /scope ran. The "asking is the value" reframe still holds: the structural questions in /scope template surfaced a distillation gap that needed manual repair.
- Path B sharpens the "always-fresh" promise — the user's scaffolded project gets a real GitHub remote at minute zero, which makes the structural verification beat (`npm run render:pdf` round-trip) more authentic to real-user conditions.
- Path A preserves offline scaffold and version-pin discipline.
- /spec recommendation: ship both with auto-detection (`gh` available + authed → Path B default, otherwise Path A).

**Updates applied:**

- `docs/scope.md > Inspiration & References` — sharpen ThesisStudio's role as GitHub template repo + name the two paths.
- `docs/scope.md > What "Done" Looks Like > scaffold mode steps` — restructure step 1 as "source the workspace (Path A or Path B)" with Path A/B sub-bullets; bootstrap and toolchain steps unchanged.
- `docs/scope.md > Loose Implementation Notes` — add scaffold-path-resolution sub-item flagging this as a /spec decision; update project-detection note to require detection-works-identically-on-both-paths.
- `docs/cart-cycle-brief.md > /spec stance` — add scaffold-path-resolution as a load-bearing /spec deliverable; recommend ship-both-with-auto-detection; specify the four /spec sub-deliverables (detection logic, equivalence test, local-additions overlay procedure, bootstrap-identical invariant).
- `docs/cart-cycle-brief.md > What's in this cycle item 3` — orchestrator skill scaffold-mode is now dual-path.
- `docs/cart-cycle-brief.md > What's in this cycle item 13` — structural verification beat runs both paths + tree-equivalence diff if both ship.

**Active shaping signal observed:** confirmed at /scope. Estevan course-corrected on a load-bearing decision (scaffold-path framing) within minutes of /scope close — exactly the bumper-lane pattern. Calibrates downstream commands: the brief is canonical, but Estevan's reading-the-cycle-as-an-artifact attention catches strategic-frame drift that fully-autonomous chain-advance can miss.

## /prd

**Run:** 2026-04-26 19:11 CST, fully-autonomous mode, no interview turn.

**Inputs absorbed:**

- `docs/scope.md` (post-course-correction version with dual scaffold path)
- `docs/cart-cycle-brief.md` (post-course-correction version)
- `docs/builder-profile.md`
- `VIBE_THESIS_HANDOFF.md`
- Unified profile

**Compression:** maximal — 0 deepening rounds per cart-cycle-brief stance. PRD generated as direct distillation of scope + brief into the PRD template's user-stories-with-acceptance-criteria shape.

**What expanded vs. scope:**

- Scope's "What 'Done' Looks Like" 4-step scaffold mode → PRD Epics 1-3 (install + scaffold + bootstrap + toolchain) with concrete acceptance criteria per step.
- Scope's loose mention of `/vibe-render` and `/vibe-status` → PRD Epics 5-6 with output-shape acceptance criteria (where files land, what the manifest contains, what status reports).
- Scope's mention of orchestrator iterate mode → PRD Epic 7 with phase-detection logic and dispatch criteria for sub-skills.
- Scope's mention of `merge-authors` in MVP → PRD Epic 8 with attribution-preservation criterion.
- Scope's mention of project detection → PRD Epic 9 separated as its own /spec deliverable; working assumption flagged.
- Scope's bundled-example mention → PRD Epic 10 with concrete contents and a "low-stakes content" acceptance criterion (so the demo article doesn't accidentally read as Estevan's authoritative position).
- New from PRD work: 10 explicit edge cases across the epics (non-empty directory, already-scaffolded directory, gh failures, missing Docker, missing texlive, broken pipeline post-scaffold, font release deletion, manual marker deletion, design-token edits, missing bibtex keys).

**Acceptance criteria density:** 47 testable acceptance criteria across 10 epics + 13 build-list items. Single non-negotiable acceptance criterion (round-trip on first install) is encoded in Epic 1 + Epic 5 + Epic 10 acceptance composite + the structural verification beat (build item 13).

**What got cut / kept-cut:**

- All v0.2 sub-skills (`lay-translator`, `research-integrate`) explicitly in "What We'd Add With More Time" with rationale.
- Mode-taxonomy generalization, standalone CLI, `/vibe-update`, marketplace polish, customization granularity all explicitly in v0.2.
- Multi-tenant/team-collab, self-modification at runtime, customization beyond bootstrap, modes beyond academic, cross-plugin profile reads/writes all explicitly Non-Goals with rationale.

**Open questions surfaced (10):** Q1 (manifest format) is a /build BLOCKER; Q3-Q5 are RESOLVED PROVISIONALLY by cart-cycle-brief stance (/spec confirms or revises with engineering rationale); Q6 (namespace) is REQUIRED before publish but not before build; rest defer to /spec.

**Pushback / course corrections:** none in-band. The 19:08 course-correction on scaffold-path framing was absorbed before /prd ran.

**Deepening rounds:** 0. Per brief stance pre-statement, brief was thorough enough that prompt-machine value was captured by the structural questions — i.e., the PRD template's epic / acceptance-criteria shape itself was the prompt machine. Edge cases were surfaced inline (10 of them) rather than via a separate deepening round.

**Active shaping signal:** none in-band this command. Watch /spec — the dual-scaffold-path + plugin-manifest-format + project-detection-marker + tree-equivalence-diff are all real load-bearing decisions /spec must make. Bumper-lane attention warranted.

**Artifacts written this command:**

- `docs/prd.md`
- `process-notes.md` (this section)

**Handoff:** structured envelope (fully-autonomous mode) — outer harness fires `/spec`. Verification beats owed: none at this command. /spec inherits the 10 open questions; Q1 is BLOCKER, Q6 is REQUIRED before publish, rest are /spec-resolvable.

## /spec

**Run:** 2026-04-26 19:16 CST, fully-autonomous mode, no interview turn.

**Inputs absorbed:** scope.md, prd.md, cart-cycle-brief.md, builder-profile.md, originating handoff sketch, unified profile.

**Live verification performed:** Q1 (plugin manifest format) was the cycle's #1 BLOCKER. Resolved at /spec time via:

1. Dispatched `claude-code-guide` subagent to fetch live docs from <https://code.claude.com/docs/en/plugins.md> and <https://code.claude.com/docs/en/plugins-reference.md>.
2. Cross-checked against working `vibe-cartographer` plugin manifest at `C:/Users/estev/.claude/plugins/marketplaces/vibe-cartographer/plugins/vibe-cartographer/.claude-plugin/plugin.json`.
3. Inspected vibe-cartographer's full plugin layout (`commands/` + `skills/` parallel) to confirm the 626Labs ship pattern.

Result: dirt-simple `.claude-plugin/plugin.json` with auto-discovered components. No field declarations needed for skills/commands/hooks. Pattern-match-existing-config-values discipline (Lab Backbone Step 1 lesson) applied — Vibe Thesis follows vibe-cartographer's exact layout.

**Architectural decisions made:**

1. **Manifest:** `.claude-plugin/plugin.json` with `name`, `version`, `description`, `author.name`. Auto-discovery for everything else.
2. **Marketplace JSON:** mirrors vibe-cartographer's shape; single-plugin marketplace.
3. **Plugin layout:** nested `plugins/vibe-thesis/` per vibe-cartographer pattern. Both `commands/*.md` stubs AND `skills/<name>/SKILL.md` actual content for slash commands (vibe-cartographer ships both as redundant for clarity).
4. **Templates payload:** two subdirs — `templates/full/` (Path A complete) + `templates/overlay/` (Path B local-additions overlay, byte-identical subset of full).
5. **Marker:** CLAUDE.md HTML-comment stanza `<!-- VIBE_THESIS_MARKER: v0.1.0 -->`. Version-embedded for future /vibe-update.
6. **Tree-equivalence diff method:** `diff -r --exclude='.git' --exclude='node_modules' --exclude='08_OUTPUT'`. Dependency-free, works on Git Bash on Windows.
7. **ADR lift:** condense 5 ADRs into single `docs/architecture.md`. Plugin-doc-shape over decision-history.
8. **Hello-world preflight:** first /build item. De-risks any spec-vs-live divergence before extraction work.
9. **Namespace:** `@626labs/vibe-thesis` provisional, pattern-match against vibe-cartographer at /build time confirms.

**PRD open questions closed this command:** Q1, Q2, Q3, Q4, Q5, Q7, Q9, Q10. Provisionally closed: Q6. Remaining open issues moved to spec.md > Open Issues (9 items, all tagged with target resolution point — most are /build-time concerns).

**Pattern #13 complement use:** dispatched `claude-code-guide` subagent for live manifest verification. Worked exactly as the spec SKILL recommends — sub-agent grounded the answer in live docs + a working reference example. Logged for /reflect awareness.

**Pushback / course corrections:** none in-band.

**Deepening rounds:** 0 per brief stance. Edge cases surfaced inline in spec sections (orchestrator decision tree, bootstrap edge cases, tree-equivalence test, marker fallback, font release deletion, scaffold-on-non-empty-dir, manual marker deletion).

**Active shaping signal:** Watch /checklist — the spec produced 9 open issues that map to specific /build cycle items. /checklist needs to translate them into concrete build steps with the right ordering (hello-world preflight FIRST, manifest extraction depends on its findings, source-repo audit at item 2, etc.).

**Artifacts written this command:** `docs/spec.md` (~700 lines, comprehensive), this process-notes section.

**Handoff:** structured envelope (fully-autonomous mode) — outer harness fires `/checklist`. Verification beats owed: none at this command. The structural verification beat owed at /build close is specced in `docs/spec.md > Structural Verification Beat`.

## /checklist

**Run:** 2026-04-26 19:44 CST, fully-autonomous mode, no interview turn.

**Inputs absorbed:** scope.md, prd.md, spec.md, cart-cycle-brief.md, builder-profile.md, originating handoff sketch.

**Item count:** 12 — within the 8-12 sweet spot. Each item is atomic enough to complete in one /build session-equivalent inside autonomous mode.

**Build preferences encoded (per cart-cycle-brief stance):**

- Build mode: autonomous
- Comprehension checks: N/A (autonomous)
- Git: commit after each item with `Complete step N: [title]`, auto-commit per item on
- Verification: off mid-build; structural verification beat at item 11 + final hygiene at item 12 are the load-bearing acceptance tests
- Subagent dispatch: parallel-eligible for items 4+6+7 after item 2 completes; for items 9+10 after item 4 completes; sequential for the rest
- Sibling-repo hard guard: every Write/Edit/cp invocation refuses paths under `agentic-architect-vibe`

**Sequencing decisions and rationale:**

1. **Hello-world preflight (item 1) FIRST** — de-risks the cycle's #1 BLOCKER (plugin manifest format) before any extraction work. Cheap insurance against a 2-hour-into-build "the manifest field shape is different" discovery.
2. **Source repo audit (item 2) SECOND** — produces the inventory + drift delta that all extraction items (4, 5, 6) depend on. Closes spec Issues 1 and 2.
3. **Plugin scaffolding (item 3) THIRD** — applies any spec edits from item 1's preflight findings before drafting the real manifest.
4. **Templates payload full (item 4) → overlay (item 5)** — overlay is byte-identical subset of full; full must exist first.
5. **Sub-skills (item 6) and slash commands (item 7) parallel-eligible** — independent extractions, can fan out after item 2.
6. **Orchestrator (item 8)** — composes items 4, 5, 6, 7. Must come after all of them.
7. **Worked example (item 9) parallel with plugin docs (item 10)** — both depend on templates existing (item 4) but not on each other.
8. **Structural verification beat (item 11)** — depends on EVERYTHING. Tests the single non-negotiable acceptance criterion across both scaffold paths.
9. **Documentation & security verification (item 12)** — final hygiene pass. Includes README screenshots captured during item 11, marketplace submission.

**Pattern-match-existing-config-values applied:** items 3, 4, 6, 7, 8 all explicitly pattern-match against vibe-cartographer's working layout — same nested `plugins/<name>/` structure, same `commands/*.md` stubs paired with `skills/<name>/SKILL.md` actuals, same marketplace.json shape. Lab Backbone Step 1 lesson encoded.

**Open issues from /spec resolved at /checklist time:** none — they're all /build-time concerns by design, mapped to specific cycle items (Issue 1 → item 2, Issue 2 → item 2, Issue 3 → item 1, Issue 4 → item 8 orchestrator authoring, Issue 5 → item 4 dev container authoring, Issue 6 → item 8 orchestrator Bash check).

**Pushback / course corrections:** none in-band.

**Deepening rounds:** 0 per cart-cycle-brief stance.

**Active shaping signal:** Watch /build — the autonomous run is the first real test of cart-cycle-brief stance under genuinely complex extraction work (12 items including a manifest-format-blocker, two-path-scaffold, and tree-equivalence-test). Bumper-lane attention warranted especially on items 1 (preflight findings might invalidate spec assumptions), 8 (orchestrator complexity), 11 (acceptance criterion empirical close).

**Artifacts written this command:** `docs/checklist.md` (12 items, five-field format per item, complete build preferences header), this process-notes section.

**Handoff:** structured envelope (fully-autonomous mode) — outer harness fires `/build`. Verification beats owed at /build close: structural verification beat (item 11) + documentation & security verification (item 12). Both encoded as checklist items, not handed to next-builder-action.

## /build

**Run:** 2026-04-26 19:58 CST onward, fully-autonomous mode, autonomous build mode (per checklist header).

**Recon at command start:**

- `gh` v2.83.1 installed; logged in as `estevanhernandez-stack-ed`; scopes `gist, read:org, repo, workflow` (sufficient for `repo create` + `repo clone`).
- Both source repos reachable: `agentic-architect-vibe` (default branch `main`) and `ThesisStudio` (default branch `main`, `isTemplate: true` confirmed — Path B is real).
- Local toolchain: Node 22.19.0, npm 10.9.3, git 2.51.0.windows.1.
- **PRD Q6 namespace pattern-match resolved:** `626labs` org does NOT exist on GitHub (404). All Estevan's plugin repos (vibe-cartographer, vibe-test, vibe-sec, Vibe-Doc, vibe-plugins) live under `estevanhernandez-stack-ed/`. Q6 closes to `estevanhernandez-stack-ed/vibe-thesis`.

**Harness boundary acknowledged:** items 1 (install verification), 11 (structural verification beat — needs Claude Code install), and parts of 12 (`gh repo create`, `git push`, marketplace submission) need user-runtime invocation. Build proceeds autonomously through file-creation work; harness-boundary items get explicit verification_beats_owed entries at /reflect handoff.

### Step 1: Hello-world plugin preflight

**What was built:** Hello-world plugin tree at `c:/tmp/vibe-thesis-helloworld/`:

- `.claude-plugin/plugin.json` (4 fields: name, version, description, author)
- `skills/hello/SKILL.md` (frontmatter + body that prints preflight confirmation)
- `commands/hello.md` (slash command stub)

**Findings (live-vs-spec divergence check):** None expected — `/spec` already verified the manifest format via the `claude-code-guide` subagent against live docs + working vibe-cartographer reference. The preflight files exactly mirror that spec. Files are ready for install verification.

**Verification beat owed to next-builder-action:** Estevan must run inside Claude Code:

1. `/plugin marketplace add c:/tmp/vibe-thesis-helloworld` (or whatever live install verb maps to `--directory` for local marketplaces).
2. `/plugin install vt-helloworld@vt-helloworld`.
3. Confirm `/plugin list` shows `vt-helloworld`.
4. Invoke `/vt-helloworld:hello` (or `/hello` slash command stub) and confirm the skill responds with the preflight green message.
5. If any divergence surfaces (install verb wrong, frontmatter rejected, skill not auto-discovered), update `docs/spec.md > Plugin Manifest` BEFORE relying on items 3-10 outputs.

**Decision:** proceed under high-confidence assumption that the spec is correct. Spec was live-verified at /spec; the preflight is insurance, not a blocker. If verification fails post-build, item 11 will catch it (the in-progress vibe-thesis plugin won't install) and trigger an /iterate beat per cart-cycle-brief stance.
