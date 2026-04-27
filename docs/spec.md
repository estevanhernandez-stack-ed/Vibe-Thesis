# Vibe Thesis — Technical Spec

> **Inputs:** [`scope.md`](scope.md), [`prd.md`](prd.md), [`cart-cycle-brief.md`](cart-cycle-brief.md), [`builder-profile.md`](builder-profile.md), [`../VIBE_THESIS_HANDOFF.md`](../VIBE_THESIS_HANDOFF.md). Generated 2026-04-26 19:16 CST in `'fully-autonomous'` autonomy mode; the cart-cycle-brief's `/spec` stance pre-statement (lift existing stack verbatim, no new deps, manifest format verified live, scaffold-path resolution = ship-both-with-auto-detection, Federation N/A) is canonical.
>
> **Live-verification status:** plugin manifest format and component layout were verified 2026-04-26 against live Anthropic docs at https://code.claude.com/docs/en/plugins.md and https://code.claude.com/docs/en/plugins-reference.md, and cross-checked against the working `vibe-cartographer` plugin at `C:/Users/estev/.claude/plugins/marketplaces/vibe-cartographer/`. Q1 from the PRD is closed.

## Stack

Lifted verbatim from the source repo. **No new dependencies introduced this cycle.** Cycle brief constraint.

| Layer | Choice | Rationale |
|---|---|---|
| Plugin runtime | Claude Code plugin (auto-discovered components) | Live-verified manifest format, see [Plugin Manifest](#plugin-manifest) |
| Render pipeline language | Node 20 LTS | Lifted from source; widely available; pandoc-runner.js pattern proven |
| Document conversion | [Pandoc](https://pandoc.org/) 3.1.13 (GitHub release pin) | Lifted from source; canonical Markdown→PDF/HTML/LaTeX bridge |
| PDF engine | [xelatex](https://www.tug.org/texlive/) (texlive-xetex) | Lifted from source; UTF-8 + custom font support via fontspec |
| Bibliography | [biber](https://biblatex-biber.sourceforge.net/) + [@retorquere/bibtex-parser](https://github.com/retorquere/bibtex-parser) | Lifted; biber for LaTeX render, parser for `check-citations.js` lint |
| Build orchestration | [latexmk](https://ctan.org/pkg/latexmk) | Lifted; multi-pass LaTeX build (run xelatex, biber, xelatex, xelatex) |
| Schema validation | [ajv](https://ajv.js.org/) + ajv-formats | Lifted; validates frontmatter, manifest, swarm-plan, tokens, lay-manifest |
| Git hooks | [husky 9](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Lifted; pre-commit token-recompile + schema-validate |
| Fonts | JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk (master) | Lifted from `install-fonts.sh`; pinned GitHub releases |
| Dev container base | Debian-slim + apt deps | Lifted; lowest-friction base for Pandoc + texlive footprint |
| Templates payload format | Plain files, not a build-time-generated artifact | Simplest possible; no scaffolding API in Claude Code, see [Templates Payload](#templates-payload) |

**Versions to pin in plugin's package.json (when scaffolded into user's tree):** Node engine `>=20.0.0`. ajv `^8.x`, ajv-formats `^3.x`, @retorquere/bibtex-parser `^9.x`, husky `^9.x`, lint-staged `^15.x`. The plugin itself has zero npm runtime deps — it ships templates, not a runtime.

## Runtime & Deployment

- **Runtime:** Claude Code plugin (no separate process). The orchestrator skill runs inside Claude Code's skill-execution environment. Sub-skills + slash commands use the same execution model. Bash invocations from skills run in the user's shell with the user's `gh`, `npm`, `node`, `docker` binaries.
- **Distribution:** Anthropic plugin marketplace (preferred) + raw git URL (fallback). Marketplace install path: `/plugin marketplace add <git-url>` → `/plugin install vibe-thesis@<marketplace-name>`. Live install verb may evolve; verify against `/plugin help` at /build time.
- **Deployment target (resolved Q6):** **`@626labs/vibe-thesis` namespace, hosted at `github.com/626labs/vibe-thesis`** if Estevan's org namespace is canonical for the other shipped plugins; **`estevanhernandez-stack-ed/vibe-thesis`** otherwise. Default selection: pattern-match against the source-of-truth plugin (`vibe-cartographer`'s repo URL) at /build time and use the same convention. Either path supports both marketplace listing and raw-git install.
- **Environment requirements (for users of the scaffolded project, not for the plugin itself):**
  - Node 20+ (for render scripts)
  - Pandoc 3.1.13 (via dev container OR native install)
  - texlive (via dev container OR native install)
  - JetBrains Mono / Source Serif 4 / Space Grotesk fonts (via `install-fonts.sh` in dev container, or manual install)
  - Optional: `gh` CLI (Path B scaffold)
  - Optional: Docker Desktop / Docker Engine (dev container path)

### Deployment — Identity & Signing

Per the deployment_target = "claude-plugin-marketplace+github" set at /onboard. This is the "Other" row in the spec SKILL's per-target lookup table.

- **Plugin manifest fields required for marketplace listing** (verified live 2026-04-26):
  - `name`: `vibe-thesis`
  - `version`: semver, increments per release
  - `description`: marketplace-listing-quality one-liner
  - `author.name`: `626Labs LLC` (or Estevan's personal handle if personal namespace selected)
- **Marketplace JSON fields** (`.claude-plugin/marketplace.json` at repo root):
  - `name`: marketplace name (`vibe-thesis` for single-plugin marketplace)
  - `owner.name`: same as plugin author
  - `metadata.description`: marketplace-level description (can mirror plugin description for single-plugin marketplaces)
  - `plugins[]`: one entry, with `name`, `source: "./plugins/vibe-thesis"` (or `./` if not nested), `description`, `author`, `keywords`, `category`
- **Suggested keywords:** `["vibe-thesis", "thesis-writing", "academic-writing", "pandoc", "claude-code-plugin", "scaffolding", "spec-driven"]`
- **Suggested category:** `"education"` (matches vibe-cartographer's category)
- **GitHub repo slug:** `626labs/vibe-thesis` (or `estevanhernandez-stack-ed/vibe-thesis`)
- **Release tag scheme:** `v<semver>` matching plugin manifest version
- **Signing:** none required — Claude Code plugins are not currently code-signed for marketplace distribution
- **Secrets:** none for marketplace listing. If a future GitHub Actions release workflow auto-bumps version + tags, it needs `GITHUB_TOKEN` with `contents: write` scope. Out of MVP.
- **CI publish step:** none in v0.1 — manual `git tag && git push --tags` is sufficient for marketplace pickup. CI can land in v0.1.x.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER (in Claude Code)                              │
│                                                                              │
│   Says: "scaffold a vibe thesis project on cellular automata"               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              ORCHESTRATOR SKILL (skills/vibe-thesis/SKILL.md)                │
│                                                                              │
│   Detects: cwd state (empty / scaffolded), gh availability, intent          │
│   Branches: scaffold-mode  vs  iterate-mode                                 │
└────┬─────────────────────────────────────────────────────────────────┬──────┘
     │                                                                  │
     │ scaffold-mode                                                    │ iterate-mode
     ▼                                                                  ▼
┌─────────────────────────────────────┐         ┌────────────────────────────────────┐
│ 1. SOURCE THE WORKSPACE             │         │ Phase detection from artifact state│
│                                     │         │   - no proposal → planning         │
│   Path A (no gh):                   │         │   - proposal, no outline → planning│
│     cp -R ${PLUGIN}/templates/full/ │         │   - outline + body → drafting      │
│           ./                         │         │   - manifest exists → review/trans │
│                                     │         │                                    │
│   Path B (gh available + authed):   │         │ Dispatches sub-skills:             │
│     gh repo create --template ...   │         │   - "merge our drafts" →           │
│     cd <name>                       │         │     skills/merge-authors/SKILL.md  │
│     cp -R ${PLUGIN}/templates/      │         │                                    │
│           overlay/ ./               │         │ Or routes to slash commands:       │
│                                     │         │   - "render the PDF" → /vibe-render│
│ 2. BOOTSTRAP IDENTITY               │         │   - "what's the state" → /vibe-...│
│   skills/bootstrap/SKILL.md         │         │     status                         │
│   - interview: title/author/mode    │         └────────────────────────────────────┘
│   - rewrite placeholders + marker   │
│                                     │
│ 3. TOOLCHAIN INSTALL                │
│   - dev container OR native         │
│                                     │
│ 4. ROUND-TRIP CONFIRMATION          │
│   - npm run render:pdf              │
│   - reads examples/demo-article/    │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USER'S SCAFFOLDED PROJECT                              │
│                                                                              │
│   00_DESIGN_SYSTEM/  01_PLANNING/  02_RESEARCH/  03_BODY/                   │
│   04_AGENT_SWARMS/   05_CITATIONS/ 06_REVIEW_RESPONSES/  07_APPENDICES/     │
│   08_OUTPUT/   .devcontainer/   .github/workflows/   .husky/                │
│   scripts/   CLAUDE.md (with VIBE_THESIS_MARKER)   README.md                │
│   package.json   .gitattributes (eol=lf)   .gitignore                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Data flow at scaffold time:**

```
Plugin's templates/ payload  ──┐
                                ├──> User's cwd  ──> bootstrap rewrites placeholders
                                │                  ──> CLAUDE.md gets VIBE_THESIS_MARKER
ThesisStudio gh template  ────┘                  ──> 03_BODY shape per chosen mode
(Path B only)                                    ──> npm run render:pdf round-trip
```

**Data flow at iterate time:**

```
User intent  ──> Orchestrator skill  ──> [Phase detection from artifact state]
                                       │
                                       ├──> sub-skill (merge-authors)
                                       ├──> slash command (vibe-render / vibe-status)
                                       └──> coaching question (next-most-useful)
```

## Plugin Manifest

Per live verification (Anthropic docs + working vibe-cartographer reference):

**File:** `.claude-plugin/plugin.json` at the plugin root.

```json
{
  "name": "vibe-thesis",
  "version": "0.1.0",
  "description": "Vibe Thesis — scaffold and co-author thesis-shaped artifacts (PDF, HTML, lay-version) with Claude Code. Install, say 'scaffold a vibe thesis project,' get a styled PDF skeleton + working render pipeline in ~30 minutes.",
  "author": { "name": "626Labs LLC" }
}
```

**File:** `.claude-plugin/marketplace.json` at the marketplace root (which for this single-plugin marketplace is the same as the plugin repo root):

```json
{
  "name": "vibe-thesis",
  "owner": { "name": "626Labs LLC" },
  "metadata": {
    "description": "Vibe Thesis — scaffold and co-author thesis-shaped artifacts (PDF, HTML, lay-version) with Claude Code."
  },
  "plugins": [
    {
      "name": "vibe-thesis",
      "source": "./plugins/vibe-thesis",
      "description": "Vibe Thesis — scaffold and co-author thesis-shaped artifacts (PDF, HTML, lay-version) with Claude Code. Install, say 'scaffold a vibe thesis project,' get a styled PDF skeleton + working render pipeline in ~30 minutes.",
      "author": { "name": "626Labs LLC" },
      "keywords": ["vibe-thesis", "thesis-writing", "academic-writing", "pandoc", "claude-code-plugin", "scaffolding", "spec-driven"],
      "category": "education"
    }
  ]
}
```

**No component-declaration fields needed in either JSON.** Components are auto-discovered from convention paths inside the plugin directory:

| Component | Convention path |
|---|---|
| Skills | `skills/<skill-name>/SKILL.md` |
| Slash command stubs | `commands/<command-name>.md` |
| Subagents | `agents/<agent-name>.md` |
| Hooks | `hooks/hooks.json` |
| MCP servers | `.mcp.json` |
| Templates | Anywhere; orchestrator skill reads + copies via Bash |

**Resolves PRD Q1 (BLOCKER).**

## Plugin Layout

Full file tree of the published plugin. This is the cleanly-separable surface — installs as one unit, auto-discovers all components.

```
vibe-thesis/                                 # marketplace + plugin root (single-plugin marketplace)
├── .claude-plugin/
│   ├── marketplace.json                    # marketplace listing (above)
│   └── plugin.json                         # plugin manifest (above)
├── plugins/
│   └── vibe-thesis/                        # the plugin itself (nested per vibe-cartographer pattern)
│       ├── .claude-plugin/
│       │   └── plugin.json                 # nested manifest (mirrors top-level for plugin auto-discovery)
│       ├── CLAUDE.md                       # plugin-level instructions to Claude (loaded when plugin invoked)
│       ├── architecture/                   # internal architecture refs (lifted ADRs condensed; see Q7 below)
│       │   └── default-patterns.md
│       ├── commands/                       # slash command stubs (auto-discovered)
│       │   ├── vibe-render.md
│       │   └── vibe-status.md
│       ├── skills/                         # all skills (auto-discovered)
│       │   ├── vibe-thesis/                # orchestrator (NOT in commands/; auto-invoked on intent)
│       │   │   └── SKILL.md
│       │   ├── bootstrap/                  # internal sub-skill (invoked by orchestrator)
│       │   │   └── SKILL.md
│       │   ├── merge-authors/              # internal sub-skill (invoked by orchestrator on multi-author intent)
│       │   │   └── SKILL.md
│       │   ├── vibe-render/                # /vibe-render slash command's actual content
│       │   │   └── SKILL.md
│       │   └── vibe-status/                # /vibe-status slash command's actual content
│       │       └── SKILL.md
│       ├── templates/                      # the scaffold payload (NOT auto-discovered; orchestrator copies via Bash)
│       │   ├── full/                       # Path A's complete payload
│       │   │   ├── 00_DESIGN_SYSTEM/
│       │   │   ├── 01_PLANNING/
│       │   │   ├── 02_RESEARCH/
│       │   │   ├── 03_BODY/
│       │   │   ├── 04_AGENT_SWARMS/
│       │   │   ├── 05_CITATIONS/
│       │   │   ├── 06_REVIEW_RESPONSES/
│       │   │   ├── 07_APPENDICES/
│       │   │   ├── 08_OUTPUT/              # gitignored content; just .gitkeep here
│       │   │   ├── scripts/
│       │   │   ├── .devcontainer/
│       │   │   ├── .github/workflows/
│       │   │   ├── .husky/
│       │   │   ├── .gitattributes          # eol=lf rule baked in
│       │   │   ├── .gitignore
│       │   │   ├── package.json
│       │   │   ├── CLAUDE.md.template
│       │   │   └── README.md.template
│       │   └── overlay/                    # Path B's local-additions overlay (subset of full/)
│       │       ├── .devcontainer/install-fonts.sh
│       │       ├── .devcontainer/devcontainer.json   # adds persistent ~/.claude volume mount
│       │       ├── .gitattributes
│       │       └── 00_DESIGN_SYSTEM/schemas/lay-manifest.schema.json   # for v0.2 readiness
│       ├── examples/
│       │   └── demo-article/                # bundled worked example
│       │       ├── 01_PLANNING/
│       │       ├── 03_BODY/
│       │       ├── 05_CITATIONS/
│       │       └── 08_OUTPUT/pdf/example.pdf
│       └── docs/
│           └── architecture.md             # condensed ADR (per Q7 resolution below)
├── README.md                               # plugin-repo-level README (install instructions, basic usage)
├── LICENSE
└── CHANGELOG.md
```

## Component: Orchestrator Skill (`skills/vibe-thesis/`)

Implements `prd.md > Epic 1` (Install & Scaffold), `prd.md > Epic 7` (Iterate Mode), `prd.md > Epic 9` (Project Detection Marker). Auto-invoked on natural-language scaffold or iterate intent — no slash command (NOT in `commands/`).

### Frontmatter

```yaml
---
name: vibe-thesis
description: "Use when the user wants to scaffold a thesis-shaped project (academic dissertation, master's thesis, long-form research article, position essay) with rendered output (PDF, HTML, lay-version), OR when working inside an existing Vibe Thesis project (detected by VIBE_THESIS_MARKER stanza in CLAUDE.md). Coaches through planning → research → drafting → review → translation phases and dispatches sub-skills (bootstrap, merge-authors) at natural moments."
disable-model-invocation: false
user-invocable: false
---
```

### Decision tree

```
ON_INVOCATION:
  current_dir_state = scan(cwd)
  marker_present = grep CLAUDE.md for "VIBE_THESIS_MARKER"

  IF marker_present:
    branch = "iterate-mode"
  ELIF current_dir_state == "empty" OR (no marker AND user said "scaffold"):
    branch = "scaffold-mode"
  ELSE:
    ask: "This directory has files but no VIBE_THESIS_MARKER. Are you scaffolding fresh, or working in an existing project?"

SCAFFOLD_MODE:
  # Step 1: SOURCE THE WORKSPACE
  IF current_dir is non-empty (excluding dotfiles):
    refuse with: "This folder has files in it. Scaffolding works best in a fresh empty directory.
                  Want to create one and rerun?"
    EXIT

  gh_ok = bash("gh --version >/dev/null 2>&1 && gh auth status >/dev/null 2>&1")
  IF gh_ok AND user did not request "use local templates":
    path = "B"
    bash("gh repo create --template estevanhernandez-stack-ed/ThesisStudio <name>")
    bash("cp -R ${PLUGIN_DIR}/templates/overlay/* ./<name>/")
    cd <name>
  ELSE:
    path = "A"
    bash("cp -R ${PLUGIN_DIR}/templates/full/* ./")
    bash("cp -R ${PLUGIN_DIR}/templates/full/.devcontainer ./")  # explicit hidden-dir copy
    bash("cp ${PLUGIN_DIR}/templates/full/.gitattributes ./")
    bash("cp ${PLUGIN_DIR}/templates/full/.gitignore ./")

  # Step 2: BOOTSTRAP IDENTITY
  Skill("vibe-thesis:bootstrap", { project_dir: cwd, scaffold_path: path })

  # Step 3: TOOLCHAIN INSTALL
  ask one question: "dev container or native install?"
  IF dev_container:
    instruct: "Run 'Reopen in Container' from VS Code's command palette"
    confirm Docker is running first (bash check)
  ELSE:
    bash check: pandoc --version, xelatex --version, biber --version, node --version
    report what's missing

  # Step 4: ROUND-TRIP CONFIRMATION
  bash("npm install")
  bash("cp -R examples/demo-article/* ./")  # populate body for round-trip
  bash("npm run render:pdf")
  IF success:
    print: "✓ Plugin installed, scaffold complete, render pipeline verified."
  ELSE:
    surface stderr; point to most likely cause from a small lookup table
    DO NOT mark scaffold-complete

ITERATE_MODE:
  phase = detect_phase(artifact_state)
  open one-line read: "Looks like you're in <phase>. Want to <next-most-useful-action>?"
  AWAIT user reply
  route based on intent:
    "merge our drafts" → Skill("vibe-thesis:merge-authors", ...)
    "render the PDF"   → SlashCommand("/vibe-thesis:vibe-render pdf")
    "what's the state" → SlashCommand("/vibe-thesis:vibe-status")
    other              → coach with phase-appropriate question
```

### Phase detection logic

```
phase = "planning"
IF exists("01_PLANNING/proposal.md") AND non-empty:
  phase = "planning" (still — outline next)
IF exists("01_PLANNING/outline.md") AND non-empty:
  phase = "drafting"
IF any("03_BODY/*.md") non-empty:
  phase = "drafting"
IF exists("08_OUTPUT/*/*.manifest.json"):
  phase = "review-or-translation"
```

## Component: Sub-Skill `bootstrap` (`skills/bootstrap/`)

Implements `prd.md > Epic 2` (Bootstrap Identity). Internal — invoked by orchestrator only. Lifted from source repo (`agentic-architect-vibe/.claude/skills/bootstrap/SKILL.md`, ~123 LOC) and **generalized beyond the ThesisStudio name**.

### Frontmatter

```yaml
---
name: bootstrap
description: "Internal sub-skill invoked by the vibe-thesis orchestrator at scaffold time. Interviews the user for project identity (title, author, mode = dissertation | article | masters), rewrites placeholders across CLAUDE.md / README.md / LICENSE / package.json / brand layer, and writes the VIBE_THESIS_MARKER stanza. Runs identically on Path A and Path B."
user-invocable: false
disable-model-invocation: true
---
```

### Behavior

1. Ask one question at a time: project title (free-form), primary author name (free-form, accepts empty → `[Author TBD]`), mode (one of `dissertation` | `article` | `masters`).
2. Construct rewrite map:
   - `{{PROJECT_TITLE}}` → user's title (LaTeX-escape `%`, `&`, `$`, `\` for files going through render pipeline)
   - `{{AUTHOR_NAME}}` → author name (or `[Author TBD]`)
   - `{{THESIS_MODE}}` → mode value
   - Literal `ThesisStudio` → user's title (case-sensitive)
3. Rewrite passes (in order):
   - `CLAUDE.md.template` → `CLAUDE.md` with all substitutions + appended `<!-- VIBE_THESIS_MARKER: v0.1.0 -->` stanza
   - `README.md.template` → `README.md` with substitutions
   - `LICENSE` → only `{{AUTHOR_NAME}}` substitution (year handled by template's pre-baked current year via `{{YEAR}}` → `bash("date +%Y")`)
   - `package.json` → name field, author field
   - `00_DESIGN_SYSTEM/brand/` → any brand-name placeholders
4. Verify invariant: post-bootstrap, `grep -r "ThesisStudio" .` returns zero matches.
5. Write `THESIS_MODE: <value>` block to CLAUDE.md (separate from the marker stanza, in a clearly-marked section).

### Edge cases

- Empty author name → `[Author TBD]` placeholder; orchestrator notes this in scaffold-complete message ("don't forget to fill in the author when you're ready").
- Title with LaTeX-special chars → escape pass for files in `00_DESIGN_SYSTEM/`, `01_PLANNING/`, `03_BODY/` and the LaTeX preamble; preserve unescaped in plain markdown (README.md, .github files).
- User aborts mid-bootstrap → orchestrator catches; tells user to rerun scaffold from clean directory.

## Component: Sub-Skill `merge-authors` (`skills/merge-authors/`)

Implements `prd.md > Epic 8`. Internal — invoked by orchestrator on multi-author merge intent. Lifted verbatim from source repo (~90 LOC).

### Frontmatter

```yaml
---
name: merge-authors
description: "Internal sub-skill invoked by the vibe-thesis orchestrator when the user expresses multi-author merge intent ('merge our drafts', 'braid the chapter together'). Reads 03_BODY/multi-author/<chapter>/author-*.md files and produces a single merged.md with attribution preserved as markdown comments."
user-invocable: false
disable-model-invocation: true
---
```

### Behavior (lifted from source)

1. Accept chapter directory path (parameter from orchestrator).
2. List `author-*.md` files; abort with helpful message if zero, copy-with-note if one.
3. Read each author file; identify common claims, divergent claims, complementary sections.
4. Produce merged.md preserving paragraph-level attribution as `<!-- author: <name> -->` markdown comments.
5. Return merged.md path to orchestrator for the user to review.

## Component: Slash Command `/vibe-thesis:vibe-render`

Implements `prd.md > Epic 5`. Stub at `commands/vibe-render.md`; actual content at `skills/vibe-render/SKILL.md`.

### Stub (`commands/vibe-render.md`)

```yaml
---
description: "Render the project to PDF, HTML, markdown, or all formats. Default: PDF."
argument-hint: "[pdf|html|md|all]"
---

Use the **vibe-render** skill to invoke the appropriate render pipeline.
```

### Skill (`skills/vibe-render/SKILL.md`)

```yaml
---
name: vibe-render
description: "Renders the current Vibe Thesis project. Pre-runs compile-tokens and check-citations. Reports manifest path on success, surfaces stderr on failure."
user-invocable: true
allowed-tools: Bash(npm run *) Read
---
```

Behavior:

1. Verify VIBE_THESIS_MARKER present in CLAUDE.md (refuse otherwise; instruct user to scaffold first).
2. Parse argument (`pdf` | `html` | `md` | `all`, default `pdf`).
3. Run pre-step: `npm run compile-tokens`. Surface failure if tokens.yaml is malformed.
4. Run pre-step: `npm run check-citations`. Surface missing-bibtex-keys list cleanly if any.
5. Run main: `npm run render:<format>` (or `render:all` for `all`).
6. On success: read sibling manifest, report output paths and design-token snapshot fingerprint.
7. On failure: surface stderr; consult lookup table for hint (missing font / missing tex package / broken bibtex / missing pandoc).

## Component: Slash Command `/vibe-thesis:vibe-status`

Implements `prd.md > Epic 6`. Stub at `commands/vibe-status.md`; actual content at `skills/vibe-status/SKILL.md`.

### Stub (`commands/vibe-status.md`)

```yaml
---
description: "Report the state of the current Vibe Thesis project: planning docs, body content, claim coverage, citations, last render."
---

Use the **vibe-status** skill to compose the status report.
```

### Skill behavior

1. Verify VIBE_THESIS_MARKER present.
2. Read CLAUDE.md for project title + mode.
3. Walk planning docs: existence + non-empty checks for `01_PLANNING/{proposal,outline,claims-map}.md`.
4. Walk body: count of `03_BODY/*.md` (or `03_BODY/<chapter>/*.md` for dissertation mode) with non-empty content.
5. Claim coverage: count claims in `claims-map.md` vs. count of `[claim:N]` references in body. Surface orphans.
6. Citations: count `[@key]` references in body vs. count of unique entries in `references.bib`. Surface missing keys.
7. Last render: scan `08_OUTPUT/*/*.manifest.json` for newest timestamp.
8. v0.1: print "lay-sync: not enabled in v0.1" rather than misleading omission.

Output is a one-screen summary (target: ≤30 lines).

## Templates Payload

The plugin ships **two** template subdirectories. Path A copies `templates/full/`; Path B applies `templates/overlay/` on top of a gh-spawned ThesisStudio template.

### `templates/full/` — Path A's complete payload

Source: snapshot of ThesisStudio's `template/main` branch + the local-additions diff applied. Tracked in plugin repo as a single committed snapshot. Refresh procedure (out of MVP for /vibe-update v0.2): `git remote add upstream-template https://github.com/estevanhernandez-stack-ed/ThesisStudio` + cherry-pick / merge into `templates/full/`.

Contents (per cycle brief §1 + §3 coupling map):

| Path under `templates/full/` | Origin (cycle brief tag) | Notes |
|---|---|---|
| `00_DESIGN_SYSTEM/tokens.yaml` + `compile-tokens.js` | T | Single-source-of-truth tokens; drives both LaTeX xcolor + CSS |
| `00_DESIGN_SYSTEM/schemas/*.schema.json` (5 files) | T+L | lay-manifest schema is local |
| `00_DESIGN_SYSTEM/editorial/` | T | Editorial CSS + LaTeX preamble |
| `00_DESIGN_SYSTEM/brand/` | T | Overridable per project via bootstrap |
| `01_PLANNING/{proposal,outline,claims-map}.md` | T | Templates with placeholders |
| `02_RESEARCH/` (empty subdirs + READMEs) | T | Scaffold for user's research notes |
| `03_BODY/*.md` per mode | T | Per-mode shape (chapters for dissertation/masters; sections for article) |
| `04_AGENT_SWARMS/*.md` (4 files) | T | Lit-review-swarm + others |
| `05_CITATIONS/references.bib` (empty stub) | T | User adds entries |
| `06_REVIEW_RESPONSES/round-NN/` template | T | For dissertation review cycles |
| `07_APPENDICES/` (empty + README) | T | Scaffold |
| `08_OUTPUT/.gitkeep` | T | Render output target; gitignored content |
| `scripts/render-pdf.js` (+ render-html.js, render-markdown.js, compile-tokens.js, validate-schemas.js, check-citations.js, lib/*) | T | ~1518 LOC verbatim |
| `scripts/lib/thesis-mode.js` | T | Reads CLAUDE.md THESIS_MODE flag |
| `scripts/lib/manifest.js` | T | Writes `*.manifest.json` after each render |
| `.devcontainer/Dockerfile` | T+L | Lifted; font install + persistent .claude volume are local |
| `.devcontainer/devcontainer.json` | T+L | Persistent ~/.claude volume mount = local |
| `.devcontainer/install-fonts.sh` | L | Local addition (cycle brief commit `978426a`, PR #4) |
| `.github/workflows/*.yml` | T | CI: schema validate, render smoke test |
| `.husky/pre-commit` | T | husky 9 + lint-staged |
| `.gitattributes` | L | `* text=auto eol=lf` (cycle brief CRLF-trap fix) |
| `.gitignore` | T | Standard Node + LaTeX + render-output ignores |
| `package.json` | T | Render scripts, deps |
| `CLAUDE.md.template` | T+L | Persona scaffold + VIBE_THESIS_MARKER placeholder |
| `README.md.template` | T+L | Project README with placeholders |
| `LICENSE` | T | MIT placeholder; bootstrap rewrites year + author |

### `templates/overlay/` — Path B's local-additions overlay

Just the L-tagged contents from above (the local additions that ThesisStudio's `template/main` doesn't have):

```
templates/overlay/
├── .devcontainer/
│   ├── install-fonts.sh
│   └── devcontainer.json    # version with persistent ~/.claude volume + Claude Code extension pinned
├── .gitattributes           # eol=lf rule
└── 00_DESIGN_SYSTEM/
    └── schemas/
        └── lay-manifest.schema.json
```

**Overlay invariant:** every file in `templates/overlay/<path>` is byte-identical to `templates/full/<path>`. Enforced at plugin build time by a check script (post-MVP) or manual diff at /build time. Confirms tree-equivalence after Path B's `cp -R overlay/* .`.

## Dual Scaffold Path Implementation

Implements `prd.md > Epic 1` (stories 3, 4) + cart-cycle-brief `/spec` stance.

### Detection logic

```bash
detect_path() {
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    echo "B"
  else
    echo "A"
  fi
}
```

User can override with one-line natural-language preference. Orchestrator passes to detect logic.

### Path A execution

```bash
cp -R "${PLUGIN_DIR}/templates/full/." ./
```

(Note the trailing `/.` to copy hidden files like `.gitattributes`, `.devcontainer/`, `.github/`, `.husky/` along with regular files.)

### Path B execution

```bash
gh repo create --template estevanhernandez-stack-ed/ThesisStudio "${PROJECT_NAME}" --public --clone
cd "${PROJECT_NAME}"
cp -R "${PLUGIN_DIR}/templates/overlay/." ./
```

If `gh repo create` fails (rate-limit, name collision, network), orchestrator catches stderr, falls back to Path A in the same `${PROJECT_NAME}` directory (creates the dir if needed), and surfaces a one-line note to user.

### Tree-equivalence test (resolves PRD Q9)

Runs at the structural verification beat (cycle item 13):

1. Scaffold a fresh project via Path A in `/tmp/vibe-thesis-pathA-test/`.
2. Scaffold a fresh project via Path B in `/tmp/vibe-thesis-pathB-test/`.
3. After bootstrap completes on both, run:

   ```bash
   diff -r --exclude='.git' --exclude='node_modules' --exclude='08_OUTPUT' \
        /tmp/vibe-thesis-pathA-test /tmp/vibe-thesis-pathB-test
   ```

4. Expected: zero diffs (modulo `.git/` directory which is Path B-only).
5. If diffs surface, the overlay is incomplete; treat as build-blocker.

**Diff method choice rationale:** `diff -r` is dependency-free, ships with every Unix-like system + Git Bash on Windows, produces human-readable output. Alternative options considered (rsync --dry-run, content-hash manifest) add complexity for marginal value at v0.1 scale (template payloads are small).

## Project Detection Marker (resolves PRD Q2)

Implements `prd.md > Epic 9`. Marker lives in `CLAUDE.md` as a stanza:

```html
<!-- VIBE_THESIS_MARKER: v0.1.0 -->
```

**Rationale for CLAUDE.md stanza over top-level `vibe-thesis.yaml`:**

- CLAUDE.md is *already* in every Claude Code project — no new file pollution.
- Stanza format (HTML comment) is invisible in rendered markdown but trivially grep-able.
- Version embedded in marker enables future `/vibe-update` (v0.2) to detect plugin-version drift.
- No new file means fewer items in `.gitignore` discussions and less surface for users to accidentally delete.

**Detection:**

```bash
grep -q "VIBE_THESIS_MARKER:" CLAUDE.md
```

**Edge case (manual marker deletion):** orchestrator falls back to structural detection — checks for presence of numbered scaffold dirs (`00_DESIGN_SYSTEM`, `01_PLANNING`, ..., `08_OUTPUT`) AND `scripts/render-pdf.js`. If both present, ask one disambiguating question rather than re-scaffolding.

## Worked Example

Implements `prd.md > Epic 10`. Lives at `examples/demo-article/` inside the plugin.

### Contents

```
examples/demo-article/
├── 01_PLANNING/
│   ├── proposal.md            # ~1 page, "A Brief Examination of Rubber Ducks in Software Engineering"
│   ├── outline.md             # 3-section outline
│   └── claims-map.md          # 5 claims with referents
├── 03_BODY/
│   ├── 01-introduction.md     # ~1 page
│   ├── 02-methods.md          # ~1 page
│   └── 03-conclusion.md       # ~1 page
├── 05_CITATIONS/
│   └── references.bib         # 5 real entries (Brooks, Naur, Hunt-Thomas, Norman, Knuth — all real, all citable)
├── 08_OUTPUT/
│   └── pdf/
│       └── example.pdf        # pre-rendered output (committed for diff comparison; regenerated periodically)
└── manifest.json              # source-commit hash for sync detection at v0.2-readiness time
```

### Round-trip behavior at scaffold time

After scaffold + bootstrap + toolchain install:

1. Orchestrator copies `examples/demo-article/01_PLANNING/`, `03_BODY/`, `05_CITATIONS/` into the user's scaffolded tree (overwrites the empty stubs).
2. Runs `npm run render:pdf`.
3. On success, the user's `08_OUTPUT/pdf/example.pdf` should be byte-similar to `examples/demo-article/08_OUTPUT/pdf/example.pdf` (modulo PDF metadata timestamps).
4. Orchestrator says: "✓ Plugin installed, scaffold complete, render pipeline verified. The demo content is in `01_PLANNING/`, `03_BODY/`, `05_CITATIONS/` — replace it with your own when you're ready."

### Edge case: user builds on top of demo content

Detected on first iterate-mode invocation by checking whether body content equals demo content (file-hash comparison against `examples/demo-article/03_BODY/`). If it does, ask one question: "Looks like you're working in the demo article — want to start fresh, or build on top of the demo?"

## Dev Container with Three Hard-Won Fixes

Implements `prd.md > Epic 4`. Lifted from source repo (`agentic-architect-vibe/.devcontainer/`).

### Three fixes baked in

1. **`install-fonts.sh`** (cycle brief commit `978426a`, PR #4):
   - Downloads JetBrains Mono v2.304, Source Serif 4 v4.005, Space Grotesk from pinned GitHub releases.
   - Installs into `/usr/share/fonts/`.
   - Runs `fc-cache -f`.
   - **Edge case:** if a release URL 404s (release deleted/moved), surface clear error naming the missing release rather than silently producing a container without fonts. The container build fails loudly rather than producing a broken downstream PDF render.

2. **`.gitattributes` with `* text=auto eol=lf`** (lifted from `agentic-architect-vibe/.gitattributes`):
   - Prevents Windows-side VS Code from CRLF-corrupting Unix-style scripts inside the dev container.
   - Documented failure mode for any dev container repo opened from Windows-side VS Code.

3. **Persistent `~/.claude` volume mount in `devcontainer.json`** (cycle brief commit `202345d`):
   - `mounts: ["source=claude-config,target=/root/.claude,type=volume"]`
   - Survives container rebuilds.
   - Documented failure mode for anyone using Claude Code in a dev container.

### Container base + apt list

```dockerfile
FROM mcr.microsoft.com/devcontainers/base:debian
RUN apt-get update && apt-get install -y --no-install-recommends \
    pandoc \
    texlive-xetex texlive-fonts-recommended texlive-latex-recommended texlive-bibtex-extra \
    biber latexmk \
    fontconfig \
    unzip curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN curl -L -o /tmp/pandoc.deb https://github.com/jgm/pandoc/releases/download/3.1.13/pandoc-3.1.13-1-amd64.deb \
    && dpkg -i /tmp/pandoc.deb && rm /tmp/pandoc.deb   # explicit pandoc version pin
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
COPY install-fonts.sh /tmp/
RUN bash /tmp/install-fonts.sh
```

(Exact Dockerfile lifted from source repo at /build time; this is the spec-time sketch.)

## ADR Lift Strategy (resolves PRD Q7)

**Decision: condense five ADRs into a single `docs/architecture.md` for plugin distribution.** Rationale:

- Plugin docs are read by users browsing the marketplace listing or the GitHub repo, not by future maintainers iterating on the plugin's internal architecture.
- Five separate ADR files create surface area without proportional value; users want the gestalt, not the decision history.
- The original ADRs remain in `agentic-architect-vibe`'s git history for archaeological reference if needed.
- Single-file `architecture.md` mirrors the cycle brief's coupling map (§3) shape.

`docs/architecture.md` sections (drafted at /build time):

1. Overview — what Vibe Thesis is and what it ships.
2. Templates payload — what's in `full/` and `overlay/`, and why.
3. Render pipeline — Pandoc + xelatex + biber path, schema validation, manifest emission.
4. Design system single-source-of-truth — `tokens.yaml` driving both LaTeX xcolor and CSS.
5. Mode flag plumbing — `THESIS_MODE` shifts emphasis, never deletes files.
6. Sub-skill composition — Skill tool dispatch with structured arguments.
7. Dual scaffold path — Path A (plugin-bundled) vs. Path B (gh template fork) tradeoffs.

## Hello-World Pre-Flight

Cycle brief named this as a load-bearing /spec deliverable. /spec hereby specifies it; /build cycle item 1 executes it.

**Goal:** before drafting the real plugin manifest, confirm the live Claude Code plugin format works as documented by building and installing a minimal "hello world" plugin. If any documented behavior diverges from observed behavior on Estevan's machine, that divergence is the load-bearing data — incorporate findings into Vibe Thesis's actual manifest before proceeding.

**Procedure (executed at /build cycle item 1):**

1. Create `/tmp/vibe-thesis-helloworld/` with this exact tree:

   ```
   .claude-plugin/
     plugin.json    # {"name": "vt-helloworld", "version": "0.0.1", "description": "...", "author": {"name": "Estevan"}}
   skills/
     hello/
       SKILL.md     # frontmatter: name: hello, description: ..., user-invocable: true
   commands/
     hello.md       # stub that invokes skills/hello
   ```

2. Install via `/plugin marketplace add /tmp/vibe-thesis-helloworld` then `/plugin install vt-helloworld@vt-helloworld` (or whatever live install verbs map to).
3. Verify Claude Code recognizes:
   - `/plugin list` shows `vt-helloworld`
   - `/vt-helloworld:hello` invokes the skill
   - `/hello` (the slash-command stub) also invokes the skill
4. **Findings get logged in `process-notes.md`** under `## /build cycle 1 — hello-world preflight`.
5. If any fact in this spec's [Plugin Manifest](#plugin-manifest) section is contradicted by observed behavior, update this spec before proceeding to cycle item 2.

## Structural Verification Beat

Implements cycle brief item 13 + cart-cycle-brief `/checklist > Verification` stance.

**Procedure (executed before /reflect, after /iterate if /iterate runs):**

1. Build the published plugin tree (publishable via `git push` to the resolved repo).
2. Install into a fresh fourth directory: `/tmp/vibe-thesis-verify/` via `/plugin marketplace add ...` + `/plugin install ...`.
3. Open Claude Code in that directory.
4. Say: "scaffold a vibe thesis project for me on rubber duck debugging."
5. Confirm orchestrator runs scaffold-mode end-to-end (sourcing → bootstrap → toolchain install → round-trip).
6. Confirm `npm run render:pdf` produces `08_OUTPUT/pdf/example.pdf` with no manual fixups.
7. Re-run with `gh logout` first (forces Path A) and `gh login` first (forces Path B). Compare trees per [Tree-equivalence test](#tree-equivalence-test-resolves-prd-q9).
8. Both paths must round-trip; tree-equivalence diff must be clean.

**On failure:** open an /iterate beat to debug rather than handing to next-builder-action. Per cart-cycle-brief stance.

## Data Model

Vibe Thesis is a templates-and-skills plugin; there is no persistent data model in the plugin itself. The user's scaffolded project has a few structured artifacts worth specifying:

### Render manifest (`08_OUTPUT/<format>/<basename>.manifest.json`)

Lifted from source. Schema validated at write time.

```json
{
  "schema_version": 1,
  "rendered_at": "2026-04-26T19:16:00-05:00",
  "source_commit": "<git rev-parse HEAD>",
  "thesis_mode": "article",
  "design_token_fingerprint": "<sha256 of tokens.yaml>",
  "format": "pdf",
  "input_files": ["03_BODY/01-introduction.md", ...],
  "output_path": "08_OUTPUT/pdf/example.pdf"
}
```

### CLAUDE.md marker stanza

```html
<!-- VIBE_THESIS_MARKER: v0.1.0 -->
```

Single line, HTML comment, version embedded.

### THESIS_MODE block in CLAUDE.md

```yaml
THESIS_MODE: article    # one of: dissertation | article | masters
```

Read by `scripts/lib/thesis-mode.js`.

## File Structure

(See [Plugin Layout](#plugin-layout) above for the complete annotated tree.)

## Key Technical Decisions

1. **Manifest format verified live.** The single biggest unknown going into /spec was the plugin manifest shape. Verified against Anthropic's live docs (https://code.claude.com/docs/en/plugins.md and https://code.claude.com/docs/en/plugins-reference.md) and cross-checked against the working vibe-cartographer plugin. Result: dirt-simple `.claude-plugin/plugin.json` with auto-discovered components — no manifest fields needed for skills/commands/hooks. Closes PRD Q1 (BLOCKER). Tradeoff accepted: trust live docs + working reference equals no field-shape surprises at /build time.

2. **Ship both scaffold paths with auto-detection.** Path A (plugin-bundled) is the always-works default; Path B (gh template fork) is the always-fresh upgrade for users with gh available. Auto-detection avoids forcing a choice at install time. Tradeoff accepted: 2x the surface area for the structural verification beat (must test both paths + tree-equivalence diff). Mitigated by `templates/overlay/` being a strict subset of `templates/full/` with byte-identical contents — invariant enforceable at plugin-build time.

3. **CLAUDE.md stanza marker over top-level `vibe-thesis.yaml`.** Lighter touch (no new file), already present in every Claude Code project, version-embedded for future /vibe-update. Tradeoff accepted: marker depends on user not deleting CLAUDE.md (mitigated by structural-detection fallback).

4. **Single condensed `docs/architecture.md` over five separate ADR lifts.** Plugin doc-shape favors gestalt over decision history. Tradeoff accepted: archaeological context lives in the source repo's git history, one extra step for someone who really wants the original ADRs. The single file mirrors the cycle brief's coupling map shape, which is the right level for plugin users.

5. **Hello-world plugin pre-flight as the first /build item.** De-risks the manifest-format unknown before any extraction work. Tradeoff accepted: ~30 min of /build time spent on a throwaway plugin. Cheap insurance against a 2-hour-into-build "the manifest field shape is different" discovery.

6. **`templates/overlay/` is a strict subset of `templates/full/` with byte-identical contents.** Avoids drift between Path A and Path B payloads by making one the literal subset of the other. Build-time check (post-MVP) enforces. Tradeoff accepted: manual sync at /build time before automated check ships in v0.1.x.

7. **No code-signing for marketplace listing.** Claude Code plugins aren't currently signed for marketplace distribution. Tradeoff accepted: trust marketplace + GitHub repo identity. Revisit if signing becomes a marketplace requirement.

## Dependencies & External Services

**Plugin runtime dependencies:** none — the plugin ships templates + skills + commands, no npm runtime deps in the plugin itself.

**Scaffolded-project npm deps** (lifted verbatim from source `package.json`):

| Package | Version | Purpose | Docs |
|---|---|---|---|
| ajv | ^8.x | Schema validation in `validate-schemas.js` | https://ajv.js.org/ |
| ajv-formats | ^3.x | Format validators (date-time, uri) | https://github.com/ajv-validator/ajv-formats |
| @retorquere/bibtex-parser | ^9.x | BibTeX AST for `check-citations.js` | https://github.com/retorquere/bibtex-parser |
| husky | ^9.x | Git hooks | https://typicode.github.io/husky/ |
| lint-staged | ^15.x | Run validators on staged files only | https://github.com/lint-staged/lint-staged |
| js-yaml | ^4.x | Read `tokens.yaml` in compile-tokens.js | https://github.com/nodeca/js-yaml |

**System / external dependencies:**

| Tool | Version pin | Why pinned | Source |
|---|---|---|---|
| Pandoc | 3.1.13 | LaTeX template compatibility (xcolor option fix from cycle brief commit `2155823`) | https://github.com/jgm/pandoc/releases/tag/3.1.13 |
| xelatex | (texlive 2024+) | UTF-8 + custom font support | https://www.tug.org/texlive/ |
| biber | latest from texlive | LaTeX bibliography processor | https://biblatex-biber.sourceforge.net/ |
| latexmk | latest from texlive | Multi-pass LaTeX build | https://ctan.org/pkg/latexmk |
| Node | >=20 | Render scripts use modern JS | https://nodejs.org/ |
| JetBrains Mono | v2.304 | Pinned for design-system stability | https://github.com/JetBrains/JetBrainsMono/releases/tag/v2.304 |
| Source Serif 4 | v4.005 | Pinned for design-system stability | https://github.com/adobe-fonts/source-serif/releases/tag/4.005R |
| Space Grotesk | master tarball | Per source repo's install-fonts.sh | https://github.com/floriankarsten/space-grotesk |
| `gh` CLI (Path B only) | latest | GitHub template fork | https://cli.github.com/ |
| Docker (dev container only) | latest | Container runtime | https://docs.docker.com/ |

**External services:** none for the plugin itself. Path B users hit GitHub's API for `gh repo create --template`; subject to GitHub's rate limits (5000 req/hr authenticated; Path B users are by definition authenticated).

**Anthropic plugin marketplace:** the plugin ships there. Marketplace metadata from `.claude-plugin/marketplace.json`. Live docs: https://code.claude.com/docs/en/plugin-marketplaces.md.

## Open Issues

Items not resolved this command. Each tagged with target resolution point.

- **Issue 1: source-repo accessibility for /build.** [/build cycle item 2] — `agentic-architect-vibe` lives at `/workspaces/agentic-architect-vibe/` in a devcontainer not directly reachable from this Windows host. /build cycle item 2 (audit `template/main` deltas) needs source repo access. Resolution options at /build time: (a) `gh repo clone` to a temp dir; (b) `gh api` calls to fetch tree + content; (c) push originating handoff sketch's inventory through and trust it. Default at /build: option (a) for highest fidelity, option (c) as fallback if `gh` auth issues surface.
- **Issue 2: ThesisStudio's exact `template/main` branch state vs. originating handoff inventory.** [/build cycle item 2] — Inventory was captured 2026-04-26 (today). If ThesisStudio has been updated between handoff time and /build time, Path B users get the newer state while Path A users get the snapshot baked into `templates/full/`. Resolution: at /build cycle item 2, fetch ThesisStudio's current `template/main` (or HEAD if `template/main` doesn't exist as a branch), diff against inventory, surface drift in process-notes. Apply discovered drift to `templates/full/` before publishing the plugin.
- **Issue 3: marketplace install verb.** [/build hello-world preflight] — Verified docs say `/plugin marketplace add ...` + `/plugin install ...` but the live verb may have evolved. Hello-world preflight will surface the actual incantation. Update this spec inline if different.
- **Issue 4: `gh repo create --template` exact flag set.** [/build orchestrator skill authoring] — Need to confirm `--public` vs `--private` default, `--clone` flag behavior on existing directory, `--include-all-branches` requirement. Resolution: test against a throwaway repo at /build orchestrator-authoring time.
- **Issue 5: pandoc version 3.1.13 .deb URL stability.** [/build cycle item authoring devcontainer] — Pinned URL is `https://github.com/jgm/pandoc/releases/download/3.1.13/pandoc-3.1.13-1-amd64.deb`. Confirm reachable at /build time; if 404, fall back to an alternate pinned version (3.1.x latest) and update spec.
- **Issue 6: Windows-host scaffolding.** [/build orchestrator authoring] — Bash commands like `cp -R` work in Git Bash but not in cmd.exe / PowerShell directly. Orchestrator skill should detect shell environment and adapt (or rely on Claude Code's Bash tool which uses Git Bash on Windows per `bash` shell config). Out of MVP if /build confirms the Bash tool consistently uses a Unix-like shell.
- **Issue 7: VIBE_MODE renaming.** [v0.2 deferred] — Cycle brief §6 Q2. v0.1 keeps `THESIS_MODE`; rename pairs with adding non-academic modes.
- **Issue 8: `/vibe-update` self-update.** [v0.2 deferred] — Cycle brief §6 Q6. v0.1 ships one-shot scaffolding.
- **Issue 9: Cross-plugin profile reads/writes.** [v0.2+ deferred] — Vibe Thesis is profile-naive in v0.1. Cross-plugin coordination with Vibe Cartographer / Vibe Doc / Vibe Test is its own /spec call.

**Closed during this command:** PRD Q1 (manifest format), Q2 (marker mechanism), Q3 (dual-path resolution), Q4 (sub-skill scope = in-plugin), Q5 (dev container = optional), Q7 (ADR condensation), Q9 (tree-equivalence diff = `diff -r --exclude`), Q10 (round-trip uses bundled example at scaffold time, user content at iterate time). Q6 (namespace) provisionally resolved as `@626labs/vibe-thesis` pending /build pattern-match.
