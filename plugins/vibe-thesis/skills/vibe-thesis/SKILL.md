---
name: vibe-thesis
description: "Use when the user wants to scaffold a thesis-shaped project (academic dissertation, master's thesis, long-form research article, position essay) with rendered output (PDF, HTML, lay-version), OR when working inside an existing Vibe Thesis project (detected by VIBE_THESIS_MARKER stanza in CLAUDE.md). In scaffold mode: sources the workspace via Path A (offline plugin-bundled) or Path B (gh repo create --template ThesisStudio with auto-detection), dispatches the project-local /bootstrap interview, runs /vibe-thesis:voice to set author voice, installs the toolchain, and confirms round-trip via npm run render:pdf against the bundled example. In iterate mode: detects current phase from artifact state and dispatches the most useful next-skill (project-local sub-skills, /vibe-thesis:vibe-render, /vibe-thesis:vibe-status, /vibe-thesis:voice, /vibe-thesis:guard)."
user-invocable: false
disable-model-invocation: false
allowed-tools: Bash Read Write Edit Grep Glob
---

# vibe-thesis — Orchestrator

The plugin's brain. Auto-invoked when the user expresses scaffold intent or
when working inside a marked Vibe Thesis project.

## Sibling-repo hard guard (load-bearing)

**Refuse any operation whose path resolves to `agentic-architect-vibe`.**
The article repo at `github.com/estevanhernandez-stack-ed/agentic-architect-vibe`
must keep functioning as an article repo. Vibe Thesis extracts the toolchain;
it never modifies the source.

If a user is in a directory that resolves to `agentic-architect-vibe` (check
via `git remote -v` or path basename), refuse with: *"This appears to be the
agentic-architect-vibe article repo. Vibe Thesis won't modify the article
source. Move to a fresh directory and rerun."*

## Decision tree

```
ON_INVOCATION:
  cwd_path = $(pwd)
  IF basename(cwd_path) contains "agentic-architect-vibe" OR
     git remote -v contains "agentic-architect-vibe":
    REFUSE per sibling-repo hard guard above

  marker_present = grep -q "VIBE_THESIS_MARKER:" CLAUDE.md (if CLAUDE.md exists)
  cwd_state = "empty" if no non-dotfile entries, else "non-empty"

  IF marker_present:
    branch = "iterate-mode"
  ELIF cwd_state == "empty":
    branch = "scaffold-mode"
  ELIF user said "scaffold" or "set up" or "I want to write a thesis":
    # Non-empty dir but explicit scaffold intent
    confirm: "This folder has files in it. Scaffolding works best in a fresh
              empty directory. Want to create one and rerun, or proceed here
              (only the absent template files will be added — existing files
              will not be overwritten)?"
    proceed only on explicit confirmation
  ELSE:
    # Non-empty dir, no marker, no explicit scaffold intent
    ask one disambiguating question:
      "This directory has files but no VIBE_THESIS_MARKER. Are you starting
       fresh, working in an existing Vibe Thesis project I should scan for
       a misplaced marker, or doing something else?"
```

## Scaffold mode

### Step 1 — Source the workspace

#### Resolve `PLUGIN_DIR`

The plugin needs to know where its own files live to reach
`templates/full/`, `templates/overlay/`, and `examples/demo-article/`.
Resolution is **runtime-relative to this SKILL.md file's location**:

```bash
# This SKILL.md lives at $PLUGIN_DIR/skills/vibe-thesis/SKILL.md.
# Walk up two levels to find $PLUGIN_DIR.
SKILL_PATH="$(dirname "$(readlink -f "${SKILL_FILE:-$0}")")"
PLUGIN_DIR="$(cd "$SKILL_PATH/../.." && pwd)"

# Sanity check — these paths must exist for the orchestrator to function.
test -d "$PLUGIN_DIR/templates/full" || {
  echo "ERROR: cannot find templates/full/ at expected path $PLUGIN_DIR/templates/full" >&2
  echo "Plugin install may be corrupted; reinstall with /plugin install vibe-thesis@vibe-thesis" >&2
  exit 1
}
```

Claude Code resolves the orchestrator skill's working directory to the
plugin's nested install path (typically
`~/.claude/plugins/installed/vibe-thesis/plugins/vibe-thesis/skills/vibe-thesis/`
for marketplace installs, or the equivalent for raw-git installs). The
`../..` walk lands at `plugins/vibe-thesis/` — the plugin's content root.

When emitting `Bash(...)` invocations from inside the orchestrator skill,
use `${PLUGIN_DIR}` consistently as the prefix. **Never** hardcode
`~/.claude/plugins/...` paths — they vary across install methods.

#### Detect scaffold path

```bash
gh_ok=false
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh_ok=true
fi
```

Unless the user explicitly said "use local templates" or "use Path A,"
default per `gh_ok`:

- **Path B (`gh_ok=true`):**
  - Ask one question for project name (the directory becomes
    `<project-name>/`): *"What's the project name? This will be the GitHub
    repo name and the folder name. Lowercase + hyphens recommended."*
  - Ask one question for repo visibility: *"Public or private? Public is
    standard for theses you want citable / on a CV; private is the safe
    default for in-progress work. You can change either later."* Default
    suggestion in the prompt is **public** (matches what most thesis
    builders want); if the builder gives no answer, fall back to private.
  - `gh repo create --template estevanhernandez-stack-ed/ThesisStudio
    "${PROJECT_NAME}" --${VISIBILITY} --clone`
    (`--clone` lands the spawned tree in `./<PROJECT_NAME>/`.)
  - `cd "${PROJECT_NAME}"`
  - Apply overlay: `cp ${PLUGIN_DIR}/templates/overlay/.gitattributes ./`
  - Run marker-injection: `bash ${PLUGIN_DIR}/templates/overlay/inject-marker.sh ./`
  - On `gh repo create` failure (rate limit / name collision / network):
    surface stderr, fall back to Path A in the same `${PROJECT_NAME}` dir.

- **Path A (`gh_ok=false` OR user override):**
  - `cp -R "${PLUGIN_DIR}/templates/full/." ./` (trailing `/.` to copy
    hidden files: `.devcontainer`, `.github`, `.husky`, `.gitattributes`,
    `.claude`, `.gitignore`, `.markdownlint.json`).
  - The marker stanza is already baked into `templates/full/CLAUDE.md` — no
    inject-marker step needed.

### Step 2 — Dispatch project-local /bootstrap

The bootstrap skill ships **inside the templates payload** at
`.claude/skills/bootstrap/SKILL.md` — it's a project-local skill, lifted
verbatim from ThesisStudio. After step 1, it's present in the user's
directory.

Dispatch via the Skill tool. The bootstrap skill runs its own 6-question
interview (title, author, mode, three pillars, citation style, license) and
rewrites placeholders across CLAUDE.md, README.md, LICENSE, package.json.

Wait for bootstrap to complete before proceeding. If the user aborts
mid-bootstrap, surface that and tell them to rerun the orchestrator from a
clean directory.

### Step 3 — Voice synthesis

After bootstrap completes, dispatch `/vibe-thesis:voice` (the plugin-side
skill). It runs the three-question voice interview and writes the
`## VOICE SYNTHESIS` block to CLAUDE.md.

Voice synthesis is mandatory in fresh-scaffold mode — it's the third pillar
the orchestrator owns alongside scaffold and bootstrap. The user can re-run
`/vibe-thesis:voice revise` later if they want to change.

### Step 4 — Toolchain install

Ask one question:

> *"Toolchain install: dev container (recommended for first-time setup,
> requires Docker) or native install (faster on subsequent runs, requires
> you to install Pandoc + texlive + fonts yourself)?"*

- **Dev container chosen:**
  - Verify Docker is reachable: `docker --version && docker info >/dev/null
    2>&1`. If not, surface install instructions for Docker Desktop / Docker
    Engine for the user's OS and offer to switch to native.
  - Tell user: "Use VS Code's 'Reopen in Container' command, or run
    `devcontainer open .` from the CLI. The container build takes ~10-15
    minutes the first time (TeX Live + fonts), then is fast on rebuilds."
  - Note: the orchestrator can't drive the dev container build directly —
    it's a VS Code action. Set expectation honestly.

- **Native chosen:**
  - Run quick check: `pandoc --version`, `xelatex --version`, `biber
    --version`, `node --version`, `fc-list | grep -i "Source Serif"` (font
    presence).
  - For each missing tool, surface clear install instructions for the user's
    OS (`apt install texlive-xetex pandoc biber` on Debian/Ubuntu;
    `brew install pandoc texlive` on macOS via MacTeX; etc.).
  - Recommend switching to dev container if multiple gaps surface.

### Step 5 — Round-trip confirmation

Run, in order:

1. `npm install` — installs the project's npm deps. Surface failures
   verbatim.
2. The orchestrator copies `${PLUGIN_DIR}/examples/demo-article/.` into the
   user's tree (overwrites the empty stubs in `01_PLANNING/`, `03_BODY/`,
   `05_CITATIONS/` for the round-trip purposes).
3. `npm run render:pdf`
4. Verify `08_OUTPUT/pdf/example.pdf` exists.

**On success:**

```
✓ Plugin installed.
✓ Project scaffolded ([Path A | Path B]).
✓ Bootstrap interview complete.
✓ Voice synthesis recorded.
✓ Toolchain verified ([dev container | native]).
✓ Round-trip PDF rendered: 08_OUTPUT/pdf/example.pdf

The demo content is in 01_PLANNING/, 03_BODY/, 05_CITATIONS/ — replace it
with your own when you're ready. Talk to me as you write — I'll dispatch the
right sub-skill for each phase.

Try /vibe-thesis:vibe-status to see the project state at a glance.
```

**On failure (any step):** stop. Do NOT silently mark scaffold-complete.
Surface the failing step's stderr. Consult the lookup table in
`/vibe-thesis:vibe-render` for diagnostic hints.

## Iterate mode

Project is already scaffolded (marker present). Detect phase from artifact
state and surface the next-most-useful question.

### Phase detection

```
phase = "planning"  # default
IF exists("01_PLANNING/proposal.md") AND length(content) > 200 chars:
  phase = "planning-outline"  # have proposal, need outline
IF exists("01_PLANNING/outline.md") AND length(content) > 200 chars:
  phase = "drafting"
IF any("03_BODY/**/*.md") with > 200 chars:
  phase = "drafting"
IF exists("08_OUTPUT/*/*.manifest.json"):
  phase = "review-or-translation"
```

### Opening (one sentence)

Read project title, mode, current phase. Open with a one-sentence read:

- *"Looks like you're in **planning** — proposal not started yet. Want to
  draft it?"*
- *"Looks like you're in **drafting** — 3 of 8 chapters populated. Continue
  on chapter 4, or pivot?"*
- *"Looks like you're in **review** — last render was 2 hours ago. Want a
  fresh render, or move into reviewer responses?"*

Then await user reply.

### Intent routing

Bridge natural-language intent to the right action:

| User says | Dispatch |
|---|---|
| "render the PDF" / "give me the HTML" / "produce all formats" | `/vibe-thesis:vibe-render <format>` |
| "what's the state" / "where am I" / "project status" | `/vibe-thesis:vibe-status` |
| "set my author voice" / "revise the voice" / "change the voice synthesis" | `/vibe-thesis:voice` |
| "check for self-review tone" / "lint the body" / "synthesis guard" | `/vibe-thesis:guard` |
| "merge our drafts" / "braid the chapter" | project-local `/merge-authors` |
| "translate this for a general audience" / "make a lay version" | project-local `/lay-translator` |
| "I read this paper, integrate it" | project-local `/research-integrate` |
| "rebootstrap" / "I want to change the title/author/pillars" | project-local `/bootstrap` (re-run mode) |
| Anything else (drafting, structure, research questions) | Coach with phase-appropriate question; no skill dispatch |

### Pre-render guard offering

When the user asks for a render, **proactively suggest** running
`/vibe-thesis:guard` first if the current phase is `drafting` or
`review-or-translation` AND a `## VOICE SYNTHESIS` block exists:

*"Before rendering, want me to run synthesis-guard first? It catches
self-review tone (inflationary language, self-praise framings) before the PDF
goes out. Pass `--guard` to /vibe-thesis:vibe-render to integrate this into
the render flow, or run /vibe-thesis:guard standalone."*

Don't push if the user declines. Once per session is enough.

## Edge cases

- Marker present but `templates/full/` shape missing (e.g., user moved
  scaffold dirs around): orchestrator still runs iterate-mode but warns
  about the structural mismatch in the opening read.
- `${PLUGIN_DIR}` can't be resolved (unusual install path): surface clearly
  and ask the user to verify the install. Don't fabricate a path.
- User runs orchestrator from a non-empty dir with a marker AND content
  that looks like the demo article (file-hash matches `examples/demo-article/`):
  ask once: *"Looks like you're working in the demo content from your
  scaffold. Want to start fresh with your own topic, or build on top of the
  demo?"*
- User says "scaffold for me" but already has `gh repo create --template`
  spawned tree: detect via presence of ThesisStudio's stamp (e.g.,
  `[YOUR THESIS TITLE]` in CLAUDE.md AND no marker) and switch to overlay-only
  mode (skip step 1's `gh repo create`, just apply overlay + bootstrap +
  voice).
