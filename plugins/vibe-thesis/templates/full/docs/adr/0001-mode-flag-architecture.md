# ADR 0001 — Mode flag architecture for `THESIS_MODE`

**Status:** Accepted

## Context

ThesisStudio needs to serve three distinct academic forms — PhD dissertation (multi-chapter, multi-year, formal defense), journal article (10–30pp, single submission), master's thesis (lighter chapter structure with defense). These differ in directory expectations, depth of lit review, presence of defense materials, and output expectations.

Three obvious approaches:

- **A.** Mode flag in `CLAUDE.md` — all directories coexist; flag dictates which are load-bearing.
- **B.** Separate sub-templates — parallel scaffolds per form; user deletes the two they aren't using.
- **C.** Bootstrap-time choice — script copies in only the chosen scaffold.

## Decision

Adopted **A**. `CLAUDE.md` contains a `THESIS_MODE: dissertation | article | masters` flag. All directories exist in every fork; the flag tells the lead writer (and `scripts/lib/thesis-mode.js`) which directories are active for the current project.

## Consequences

**Easier:**

- Switching modes mid-project is non-destructive — no files deleted, just dimmed.
- The same fork can host multiple related works (e.g., a paper extracted from a dissertation chapter) by toggling the flag.
- Users who fork for one mode can later see what the other modes would have looked like.

**Harder:**

- Some directory clutter for users who'll only ever use one mode.
- Mode-aware logic in `scripts/lib/thesis-mode.js` adds a small amount of indirection in render scripts.
- Documentation in `CLAUDE.md` must keep its per-mode active-dirs table accurate as directories are added/renamed.

The clutter cost is low (~3 unused directories per mode); the flexibility gain is high. Approved.
