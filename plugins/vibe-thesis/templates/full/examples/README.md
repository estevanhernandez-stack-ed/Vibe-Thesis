# examples/

Self-contained test fixtures demonstrating every feature ThesisStudio supports. CI uses these as smoke tests on every PR.

## Fixtures (populated as the build progresses)

| Fixture | Demonstrates |
| --- | --- |
| `dissertation-chapter/` | Full sample chapter — citations, headings, figures, tables, mode=dissertation. CI smoke-test target. |
| `article/` | Full short article (intro through conclusion) with `THESIS_MODE: article` |
| `multi-author-paper/` | Two `author-*.md` files + `merged.md` produced by the merge-authors skill |
| `swarm-plan-example/` | Completed `swarm-plan.md` for a lit-review swarm with mock agent outputs |
| `peer-review-cycle/` | Filled-in `reviewers.md` showing the response cycle pattern |

## Using a fixture

Each fixture is a complete mini-project. To render one:

```bash
cd examples/dissertation-chapter
npm run render:pdf  # uses parent repo's scripts and toolchain
```

(The render scripts auto-detect when invoked from inside an example fixture.)

## Adding a new fixture

A fixture exercises ONE or a few related features end-to-end. Drop a self-contained subdirectory here, with its own `CLAUDE.md` (mode/pillar overrides as needed) and source files.
