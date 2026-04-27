# 04_AGENT_SWARMS

Reusable playbooks for dispatching parallel research agents during the research phase. The structural differentiator that makes ThesisStudio more than a static academic-writing template.

## When to dispatch a swarm vs. hand-research

| Condition | Action |
| --- | --- |
| Broad coverage across multiple axes (initial lit review, finding opposing positions, parsing N primary sources) | **Dispatch a swarm** |
| Narrow, deep engagement with a single canonical text | **Hand-research** |
| Iterating on a specific argument's evidence | **Hand-research** |
| Exploring an unfamiliar field | **Dispatch a swarm** (lit-review-swarm) |
| Stress-testing your thesis | **Dispatch a swarm** (counter-position-swarm) |

## Available playbooks

> The full playbooks land here once Phase F of the build completes. Stubs below.

- `lit-review-swarm.md` — 5 parallel agents, one per research axis (prior-art, methodology-survey, opposing-positions, key-authors, primary-sources). Output converges to `02_RESEARCH/<axis>/`.
- `counter-position-swarm.md` — 3 parallel agents looking for the strongest case AGAINST your active thesis. Output goes to `02_RESEARCH/opposing-positions/`.
- `primary-source-swarm.md` — N parallel agents (parameterized) parsing N source documents. Output goes to `02_RESEARCH/primary-sources/<source-name>/`.

## Workflow

1. Pick a playbook based on what you need.
2. Copy `swarm-plan.template.md` → `swarm-plan-<descriptor>.md` (e.g., `swarm-plan-2026-04-25-litreview.md`).
3. Fill in the template fields — agent count, axis-per-agent, prompt templates, expected outputs.
4. Dispatch via Claude Code's Task tool — one Task per agent, parallel execution.
5. After agents return, run the convergence step (described per playbook) to synthesize outputs into structured research notes.

## Adding new playbooks

A playbook is a markdown doc following the structure of the bundled ones. New playbooks land alongside the existing ones; document them here when added.
