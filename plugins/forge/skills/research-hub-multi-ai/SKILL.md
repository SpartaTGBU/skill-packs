---
disable-model-invocation: true  # skl: on-demand pack skill
name: research-hub-multi-ai
description: Router that writes `.coord/multi_ai_plan.md` when one research round needs two or more bounded delegates (forge:codex-delegate, forge:antigravity-delegate) touching `.research/`, `.paper/`, Zotero, Obsidian or NotebookLM artifacts. Long-context, CJK, judgment and review work stay with the primary agent. Use for dependency-aware multi-delegate plans and reconciling their outputs; for a single delegate use its leaf skill directly.
---

# research-hub Multi-AI Router

> **Optional tooling.** This skill is prompt-first: the workflow works from files and conversation. Steps that call the external `research-hub` CLI (pip package `research-hub-pipeline`), its MCP/REST server, Zotero, Obsidian or NotebookLM apply only **if research-hub is installed / the service is configured and the user has authorized the write**. Check with `research-hub describe --json` (or `command -v research-hub`); if absent, skip those steps, say so, and use the manual or inline alternative. Never install packages, log in to services or fabricate CLI output. Part of the research pipeline: see `forge:research-lifecycle`.

This is a planning router. It writes a coordination plan and per-leaf briefs;
the supported leaves execute. The current leaf set is:

- `forge:codex-delegate`: implementation-heavy or repetitive work with a structured
  `result.json` contract.
- `forge:antigravity-delegate`: narrowly scoped, non-honesty-critical mechanical work
  with an `agy_result_*.md` contract.

The archived Gemini delegate is not a supported leaf. Long-context reading,
CJK drafting, scientific judgment, governance, and final review stay with the
primary model unless the operator has separately verified another adapter.

## When to invoke

Invoke only when a single round needs two or more delegates and at least one
task operates on research-hub artifacts. Examples:

- Codex scaffolds tests while Antigravity applies an already-approved metadata
  transform to a disjoint fixture subtree.
- Two independent Codex tasks prepare separate adapters, followed by primary
  model reconciliation.
- Antigravity performs a bounded transcription, then Codex consumes the
  verified artifact to generate a deterministic report.

For one delegate, use its leaf skill directly. For generic, non-research
multi-agent work, split tasks with `forge:parallel-agents`.

## Do not invoke

- One Codex or Antigravity task.
- A single `research-hub auto --llm-cli ...` run.
- Translation, long-form CJK drafting, literature judgment, security,
  governance, or final review. Keep those with the primary model.
- Work whose delegates would edit overlapping files in parallel.

## Prerequisite and health checks

Before writing a plan:

1. Verify every named leaf skill and wrapper exists.
2. Run the leaf's documented preflight (`codex --version` or `agy --version`).
3. If the plan calls `research-hub`, run `research-hub doctor`.
4. Record an unavailable leaf as a blocker. Never silently substitute an
   unverified executor.

If the research-hub CLI is missing, do not emit commands that call it. Plans
that use only healthy delegate wrappers may proceed.

## Output artifact

Write `.coord/multi_ai_plan.md`, or a plan-id suffixed sibling when another plan
is active. Use `references/multi_ai_plan_template.md`.

Every task declares:

- a unique id and agent (`codex`, `antigravity`, or `primary`);
- a brief path;
- dependencies;
- verifiable success criteria;
- its exact `result_artifact` path and explicit `result_contract` discriminator;
- in-scope paths and a stop condition.

The router writes each non-inline brief. Leaves never edit the plan and never
commit or push.

## Reconciliation

1. Wait for dependencies before launching a task.
2. Read the exact declared `result_artifact`:
   - Codex: wrapper `.result.json` plus diff and tests.
   - Antigravity: bounded `agy_result_*.md` plus independently verified file
     and sentinel checks.
3. Compare actual files changed and evidence against task and round criteria.
4. Reject scope drift or unsupported completion claims.
5. Append a new fix-up task rather than mutating completed task history.
6. Primary model performs judgment, final review, and any commit/push.

## Single-LLM research-hub routing

The `--llm-cli` option is a research-hub runtime feature, not a router decision:

```bash
research-hub auto "TOPIC" --with-crystals --llm-cli codex
python -c "from research_hub.auto import detect_llm_cli; print(detect_llm_cli())"
```

Use only a CLI returned by current detection and compatible with the requested
task. Do not preserve a retired model route merely because an old command still
appears in history.

## Guardrails

- At least two delegate tasks per router plan.
- No fabricated citations, metadata, tool output, or completion status.
- Antigravity receives only bounded mechanical work; it never reviews or makes
  scientific/governance decisions.
- No overlapping write ownership.
- Do not overwrite an active plan with a different `plan_id`.
- Do not mutate remote libraries, overwrite vault notes, publish, merge, or
  delete without the workflow's human gate.
