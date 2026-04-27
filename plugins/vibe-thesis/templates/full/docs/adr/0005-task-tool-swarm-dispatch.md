# ADR 0005 — Claude Code Task tool subagents for swarm dispatch

**Status:** Accepted

## Context

Research-phase agent swarms are the structural differentiator that distinguishes ThesisStudio from a static academic-writing template. Each swarm dispatches N parallel agents along different research axes (prior art, methodology survey, opposing positions, key authors, primary sources) and converges their outputs.

How to actually dispatch and orchestrate the swarm:

- **External orchestrator** — write a custom Python or Node service that calls Claude API directly, handles parallelism, manages convergence.
- **Claude Code Task tool subagents** — dispatch agents from within Claude Code; rely on Task tool's parallel execution; convergence is a follow-up Claude command.
- **MCP server** — write a custom MCP server that exposes swarm dispatch as a tool.

## Decision

Adopted **Claude Code Task tool subagents**. Playbooks in `04_AGENT_SWARMS/` are markdown documents that tell the lead writer (the human or Claude they're collaborating with) how to scope a swarm and dispatch via Task tool. No external orchestrator.

The swarm-plan.md (validated against `swarm-plan.schema.json`) captures the dispatch parameters; the lead writer fires N parallel Task tool calls; outputs land in `02_RESEARCH/<axis>/`; a convergence Claude command synthesizes results.

This keeps the entire swarm pattern in-band with Claude Code — no auth tokens to manage, no separate process to debug, no external service dependency.

## Consequences

**Easier:**

- Zero infrastructure beyond Claude Code itself. Forking users get swarms working immediately.
- Playbooks are easily extensible (add a new playbook = write a new markdown file).
- Convergence step is Claude-native — synthesis benefits from Claude's reasoning.

**Harder:**

- Swarms only run inside Claude Code (vs. an external orchestrator that could run from CI). For v1, this is acceptable — swarms are research-phase work, not CI work.
- Failure handling is informal — if 1 of 5 agents errors, the convergence step has to handle the partial result. Documented per playbook.
- Cost is the user's Claude usage budget (no special accounting). User decides when a swarm is worth the spend.

Approved. If swarms ever need CI integration or third-party orchestration, a future ADR can add an external dispatch path alongside the Task tool one.
