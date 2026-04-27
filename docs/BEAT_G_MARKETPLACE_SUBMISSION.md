# Beat G — Anthropic Plugin Marketplace Submission

> **Submission mechanism:** web form at <https://clau.de/plugin-directory-submission>.
> Confirmed by reading the official `claude-plugins-official` marketplace's
> [README.md](https://github.com/anthropics/claude-plugins-public/blob/main/README.md).
> The form is the canonical channel for third-party plugin inclusion in
> `external_plugins/` of the official marketplace.
>
> **What I can do:** pre-draft the form fields below so submission is one
> session of copy-paste.
>
> **What you must do:** open the form in a browser, paste the fields, submit.

---

## Pre-drafted form fields

The form's exact field set is not visible from the README link, but based on
the official marketplace's existing `external_plugins/<name>/.claude-plugin/plugin.json`
shape + the marketplace.json entries I inspected for similar community plugins
(asana, context7, github, playwright, etc.), the fields you'll likely be asked
to provide are:

### Plugin name

```text
vibe-thesis
```

### Plugin description (one-line)

```text
Vibe Thesis — scaffold and co-author thesis-shaped artifacts (PDF, HTML, lay-version) with Claude Code. Install, say "scaffold a vibe thesis project," get a styled PDF skeleton plus a working render pipeline in roughly 30 minutes.
```

### Plugin description (long-form, if asked)

```text
Vibe Thesis is a Claude Code plugin that scaffolds and co-authors thesis-shaped artifacts — academic dissertations, master's theses, long-form research articles, position essays. It wraps the ThesisStudio template (https://github.com/estevanhernandez-stack-ed/ThesisStudio) with three Claude-Code-native layers:

1. An orchestrator skill that picks the right scaffold path (offline-bundled OR `gh repo create --template`), dispatches the project-local /bootstrap interview, runs the author-voice synthesis, installs the toolchain, and confirms the round-trip via `npm run render:pdf`.

2. An author-voice synthesis skill (/vibe-thesis:voice) that interviews the user for 2-4 timeless author voices + 2-4 contemporary field experts in the topic + a synthesis ratio. Writes a VOICE SYNTHESIS block to CLAUDE.md so the LeadWriter persona reads it at drafting time.

3. A self-review-tone guard skill (/vibe-thesis:guard) that lints body content for inflationary language, self-praise framings, defensive over-qualification, and conclusions that re-assert importance. Makes ThesisStudio's "Honest Limits" pillar enforceable rather than aspirational.

The plugin ships 6 pre-installed CSL files (Chicago Author-Date, Chicago Notes-Bibliography, APA, MLA, IEEE, Nature), a dev container with three hard-won fixes for first-time users (font install script, .gitattributes LF normalization, persistent ~/.claude volume mount), and a bundled rubber-duck-debugging demo article that round-trips through the render pipeline on first scaffold.

Built and verified end-to-end via the Vibe Cartographer spec-driven development cycle. Released v0.1.1 on 2026-04-26 after empirical close of all 5 verification beats (preflight install, Path A round-trip, Path B round-trip, tree-equivalence diff, synthesis-guard pattern scan).
```

### Repository URL

```text
https://github.com/estevanhernandez-stack-ed/Vibe-Thesis
```

### Plugin homepage

```text
https://github.com/estevanhernandez-stack-ed/Vibe-Thesis
```

### Latest release

```text
v0.1.1 — https://github.com/estevanhernandez-stack-ed/Vibe-Thesis/releases/tag/v0.1.1
```

### Author / Owner

```text
626Labs LLC (Estevan Hernandez)
```

### Author email

```text
estevan.hernandez@gmail.com
```

### Category

```text
education
```

(Matches Vibe Cartographer's category, which sits in the same 626Labs plugin
family.)

### Keywords / tags

```text
vibe-thesis, thesis-writing, academic-writing, pandoc, claude-code-plugin, scaffolding, spec-driven, dissertation, thesisstudio
```

### License

```text
MIT
```

### Source / Path field (if asked — for `external_plugins/` placement)

```text
./external_plugins/vibe-thesis
```

(Mirrors how `external_plugins/github`, `external_plugins/playwright`, etc.
are structured in the official marketplace.)

### Installation instructions (if asked)

```text
/plugin marketplace add claude-plugins-official
/plugin install vibe-thesis@claude-plugins-official
/plugin reload
```

---

## Marketplace JSON entry to draft (if the form asks for the canonical entry)

This is what the entry will eventually look like in
`anthropics/claude-plugins-public/.claude-plugin/marketplace.json`'s
`plugins[]` array (modeled after existing community plugins like `context7`):

```json
{
  "name": "vibe-thesis",
  "description": "Vibe Thesis — scaffold and co-author thesis-shaped artifacts (PDF, HTML, lay-version) with Claude Code. Install, say 'scaffold a vibe thesis project,' get a styled PDF skeleton plus a working render pipeline in roughly 30 minutes.",
  "category": "education",
  "source": "./external_plugins/vibe-thesis",
  "homepage": "https://github.com/estevanhernandez-stack-ed/Vibe-Thesis",
  "author": {
    "name": "626Labs LLC"
  },
  "tags": [
    "community-managed"
  ]
}
```

(The `tags: ["community-managed"]` matches the convention `context7` uses;
distinguishes user-submitted plugins from Anthropic-internal ones.)

---

## What to expect after submission

Based on how `external_plugins/` plugins are structured in
`anthropics/claude-plugins-public`:

- Anthropic reviews submissions for "quality and security standards" per
  the official README. No public timeline; expect days-to-weeks, not
  hours.
- Approved plugins get a directory under `external_plugins/<name>/` plus a
  `plugins[]` entry in the marketplace.json. Source can be a nested
  directory inside the plugins repo, OR (more common for community plugins)
  a remote git URL pointed at the plugin's own repo.
- Once listed, users install via `/plugin install vibe-thesis@claude-plugins-official`
  rather than via the raw GitHub URL.

## Known v0.1.1 caveats to flag if the form asks about open issues

- Beat G itself is the only verification beat still owed; A through E are
  empirically green per `docs/VERIFICATION_BEATS_OWED.md`.
- Upstream ThesisStudio issue #6 (compile-tokens.js Space Grotesk hardcode)
  filed but not yet fixed; Vibe Thesis ships a documented workaround
  (option (b) of the orchestrator's font-detection prompt).
