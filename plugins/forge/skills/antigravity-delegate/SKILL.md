---
disable-model-invocation: true  # skl: on-demand pack skill
name: antigravity-delegate
description: Optional delegation recipe - hand a bounded, non-honesty-critical mechanical subtask (transcribe, reformat, apply a stated pattern, scoped single-purpose edit with a runnable check) to the Google Antigravity CLI (`agy`) via a brief file, then review the diff yourself. Use when `agy` is installed and a cheap executor fits ("delegate to antigravity/agy", bounded fixture or plotting cleanup). Never for reviews, completion verdicts, governance/security surfaces or ambiguous specs.
license: MIT
---

# antigravity-delegate (optional recipe)

Delegates a bounded mechanical subtask to the Google Antigravity CLI (`agy`; probed on 1.0.10+) as an alternative cheap executor alongside `forge:codex-delegate`. It needs the external `agy` CLI. If `agy` is not on PATH, do the work inline or use `forge:codex-delegate`; never install it unasked.

Evidence, stated honestly: one scoped-edit + no-commit compliance probe passed, and a pre-registered 5-trial reliability gate passed 5/5 (fresh sandbox per trial, planted decoy untouched, planted judgment question escalated and not acted on, zero git ops). That covered ONE fixture shape (scoped edit + decoy + escalation). New task shapes (multi-file transforms, large briefs) deserve their own small probe before heavy routing. This lane replaces nothing; it sits beside codex and the primary agent.

## Invocation contract

The wrapper preserves a July 2026 empirical invocation. Check `agy --version` and `agy --help` before assuming it matches newer runtimes. Current headless docs also describe JSON/schema output, but the result-file verification below stays mandatory.

Facts behind the wrapper flags:

1. `agy --print` exited 0 silently without editing unless `--mode accept-edits` was passed; keep it explicit.
2. `--dangerously-skip-permissions` is required alongside `--mode accept-edits` (the default `request-review` tool permission cannot be answered non-interactively). **This disables permission prompts: only ever use it with a narrowly granted workspace, and only after the user has accepted delegating to agy.**
3. The workspace must be granted by **absolute path** via `--add-dir`.
4. Expired auth can make `agy` hang. Use the installed version's supported sign-in flow; never paste credentials or OAuth codes into delegated tasks.

Use the wrapper (it adds an agy preflight, `--verify-file` / `--verify-sentinel` result-contract enforcement, auth/quota classification, optional `--model` / `--effort`):

```bash
sh scripts/run_agy.sh \
  /absolute/.ai/agy_task_<NNN>_<slug>.md /absolute/workspace 300 \
  --verify-file /absolute/.ai/agy_result_<NNN>_<slug>.md
```

Usage: `run_agy.sh <absolute-brief> <absolute-workspace> [timeout-sec > 30] [--verify-file <path>]... [--verify-sentinel <string>] [--model <id>] [--effort <level>]`. Exit codes: agy's own (or `timeout`'s, e.g. 124); 2 usage/environment error; 3 verify failed (agy exited 0 but a `--verify-file` output is missing, empty or lacks the sentinel - a delegate claiming completion without producing output); 4 auth/quota failure (only reclassifies an already-failed run, never a success; a hint, can misfire). agy may natively exit 2/3/4, so disambiguate by the stderr line, not the number. The log is capped at 10 MiB at `<brief>_log.txt`.

Raw equivalent: `timeout 300 agy --print "Read <brief> ... execute it verbatim" --add-dir "<ABSOLUTE workspace>" --mode accept-edits --dangerously-skip-permissions --print-timeout 240s`.

**Model and effort.** Without `--model`/`--effort` agy's own defaults apply; the wrapper never picks. List ids with `agy models`. A missing or flag-shaped value exits 2. Status lines show `model=<id|default> effort=<level|default>`, which describe requested overrides, not the effective configuration. An id the account cannot use can look like an auth error (exit 4): retry without `--model` before re-authenticating. Choosing a bigger model is not a rerun of the reliability gate.

## Hard rules (never optional)

- **Only bounded mechanical work**: transcribe, reformat, apply a stated pattern, scoped single-purpose edits with a runnable acceptance check.
- **Never** honesty-critical output (reviews, "all green" verdicts, spec-discrepancy calls, completion claims), governance/security surfaces, or ambiguous specs. Those stay with the primary agent.
- **Classification stays with the supervisor.** The delegate never reclassifies or extends its own scope; uncertainty escalates instead of being acted on.
- **Brief-first**: write `.ai/agy_task_<NNN>_<slug>.md` (same shape as codex briefs, see `forge:codex-delegate` `references/task-template.md`): scope-confirmation block first, files in/out of scope, acceptance checks, result path `.ai/agy_result_<NNN>_<slug>.md`.
- **Result summary** is Markdown capped at 250 words. Generated summaries never replace supervisor verification.
- **agy never commits or runs git.** The supervisor reviews the diff, runs the acceptance checks itself, and owns staging and commit. "Delegate returned" is a mandatory review trigger. Release authorization stays with the human (gate: `release_authorization`).
- Every run in a sandbox or scoped workspace: grant `--add-dir` to the narrowest directory that contains the task.
- Changing host or runtime never broadens these rules or permits unbounded delegation.

## See also

`forge:codex-delegate` (the contract this brief shape ports from), `scholar:research-hub-multi-ai` (router when a round needs two or more delegates), `forge:verification` (acceptance evidence).
