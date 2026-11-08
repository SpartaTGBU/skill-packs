---
disable-model-invocation: true  # skl: on-demand pack skill
name: codex-delegate
description: Optional delegation recipe - hand implementation-heavy or repetitive coding work (batch edits, boilerplate, multi-file refactors with a clear pattern, test scaffolding) to the OpenAI Codex CLI via an on-disk brief, then review the diff yourself. Use when token cost outweighs judgment cost and `codex` is installed ("delegate to codex", "let codex do this", "batch refactor across files", "scaffold tests for"). Not for architecture, security review or root-cause debugging.
license: MIT
---

# Codex Delegate (optional recipe)

The primary agent is the supervisor. The Codex CLI runs the mechanical work. The supervisor plans, constrains scope, reviews the diff and verifies outcomes. Everything here is optional: it needs the external `codex` CLI. If `codex --version` fails, do the work inline (see `forge:ponytail` for how) or tell the user how to install it (`npm install -g @openai/codex`); never install it unasked.

## Why a wrapper instead of raw `codex exec`

Use the wrapper when the workflow needs its on-disk brief convention and `.result.json` / sentinel contract. Native `codex exec --json` already gives machine-readable events; prefer it when that satisfies the workflow, and do not build another broker. No matched comparison has shown the wrapper beats other Codex integrations on quality or total token cost.

| Wrapper handles | Raw `codex exec` cost |
|---|---|
| stdin closure (`</dev/null`) | A direct caller must close stdin or the run can hang (historic 25-minute zero-byte hang). |
| `.result.json` sidecar + done/error/fallback sentinels | Native `--json` events must be adapted if a consumer expects the sidecars. `risks` and `tests_run` stay empty until supervisor acceptance. |
| Brief-on-disk convention (`references/task-template.md`) | The wrapper validates a brief path; it does not enforce allowed paths. Independent scope review is still required. |

Directional (not measured against a real control) savings: repo-wide mechanical sweeps with > 20 files ~7x fewer supervisor tokens; multi-locale mirror sync large; multi-file rename ~3x; a single-file fix under 50 lines ~1x (just edit it yourself); architecture, debugging and security review: the skill cannot help. Be honest about which kind of task you have.

Anti-patterns this prevents: Codex over-applying a sweep rule to documentation that describes the rule (list in-scope files explicitly in the brief); the supervisor calling raw `codex exec` and losing the stdin closure, the result contract and the brief template; the zero-byte hang.

Optional routing rule you may add to your own project instructions: tasks that are mechanical, multi-file, clearly patterned, or batch-edit >= 3 files go through this recipe, not ad-hoc `codex exec`. Raw `codex --version`, `codex exec resume` and `codex exec review` remain fine.

## Hard rules

- Run `codex --version` first. On failure stop (see above).
- When calling `codex exec` directly instead of the wrapper, close stdin explicitly (`</dev/null`).
- The wrapper leaves machine-readable status at `<log-file>.result.json`. Acceptance (reading the diff, running checks) is the supervisor's job, never the wrapper's.
- Do not wrap the wrapper in a background launcher (e.g. PowerShell `Start-Process`); call it inline so file writes persist.
- Default sandbox is `workspace-write`; use `--sandbox read-only` for review-only tasks. Sandbox choice is not blanket permission - the host's own approval and policy settings still apply. Do not widen access to make a run pass.
- Do not commit, push, or release from a delegate run. Release authorization stays with the human (gate: `release_authorization`).

## Brief discipline

- The brief MUST be on disk before invoking the wrapper: `.ai/codex_task_<NN_or_version>_<short_slug>.md`. It is the audit record.
- Pass `--brief-file <path>` (preferred). The wrapper derives the prompt "Read <brief> and execute all instructions inside." and writes results next to the brief at `<brief_stem>.txt` and `<brief_stem>.txt.result.json`.
- An inline `--prompt` longer than 500 chars with no brief reference is refused (exit 2). Short prompts that name a brief file are fine.
- Escape hatch `CODEX_DELEGATE_ALLOW_INLINE=1` is for one-off shell debugging only, never shipping tasks.

## When to delegate

Mechanical -> Codex. Reasoning, long-context synthesis, judgment, review -> the primary agent. Full routing table and good/bad examples: `references/delegation-targets.md`. If one round needs two or more delegates (Codex plus `forge:antigravity-delegate`, or parallel sessions), plan first with `forge:research-hub-multi-ai`.

## Workflow

1. **Brief**: write `.ai/codex_task_<name>.md` with Context / Goal / Constraints / Acceptance (template `references/task-template.md`). For judgment-sensitive work (debugging, write-capable change, review, research) also add the XML blocks from `references/codex-prompt-blocks.md`. If a task splitter or `forge:research-hub-multi-ai` already wrote the brief, read its plan (`.coord/plan.yml` or `.coord/multi_ai_plan.md`) for round context first.
2. **Run** the wrapper from the repo:
   ```bash
   bash ~/.claude/local-plugins/forge-marketplace/plugins/forge/skills/codex-delegate/scripts/run_codex.sh \
     --brief-file .ai/codex_task_<name>.md \
     --repo "$PWD"
   ```
   Override the log path with `--log-file` only with a reason. `--repo` defaults to `$PWD`; pass it explicitly. Optional `--model`, `--effort`, `--service-tier`, `--sandbox`. PowerShell variant (`scripts/run_codex.ps1`) and env vars: `references/wrapper.md`.
3. **Read status**: `cat .ai/codex_task_<name>.txt.result.json`. `success` -> the diff still needs review. `fallback` -> Codex quota hit; the primary agent takes over the task. `error` -> check `<log>.error`.
4. **Accept**: read the diff, confirm scope, run the verification commands from the brief (`forge:verification`), reject drift. Extended checklist: `references/review-checklist.md`.

## Output contract

`.result.json` has at least: `status` (success|fallback|error), `delegate` ("codex"), `model`, `reasoning_effort`, `service_tier`, `log_file`, `output_file`, `summary`, `risks`, `files_changed`, `tests_run`, `timestamp_utc`. Schema and semantics: `references/output-contract.md`.

## Compatibility

- Tested with `@openai/codex` 0.128 to 0.144. Needs a version that accepts `codex exec --sandbox workspace-write`; check `codex exec --help` (`-C/--cd` selects a working root, `--full-auto` may be absent).
- No default model, effort or service tier: unless passed (flags, or `CODEX_DELEGATE_EFFORT` / `CODEX_DELEGATE_SERVICE_TIER`; flag wins) the user's own `~/.codex/config.toml` applies. See `references/model-selection.md`.
- `codex exec` is non-interactive; do not infer bypassed approval from the lack of an approval flag.
- The PowerShell wrapper needs `$ErrorActionPreference` not set to `Stop`.

## See also

`references/handoff-protocol.md` (bidirectional rounds via `.ai/handoff/` files), `delegation-targets.md`, `wrapper.md`, `task-template.md`, `codex-prompt-blocks.md`, `output-contract.md`, `review-checklist.md`, `patterns.md`, `multi-agent.md`, `examples.md`, `model-selection.md` (all under this skill's `references/`).
