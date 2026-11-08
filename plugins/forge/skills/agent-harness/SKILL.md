---
disable-model-invocation: true  # skl: on-demand pack skill
name: agent-harness
description: Building and tuning LLM agent harnesses and pipelines - tool/action-space design, observation and error-recovery formats, context budgeting, model routing by task complexity, budgets and retries, prompt caching, scheduled or autonomous agent loops, and measuring completion and cost. Use when writing code that calls an LLM API in a loop, defining an agent's tools, cutting LLM spend or latency, improving cache hit rate, or setting up a recurring/unattended agent.
---

# Agent harness

How to build the code around a model: the tools it can call, what it sees back, how it recovers,
what it costs, and how it runs unattended. Provider-agnostic: look up current model names, prices,
cache rules and SDK usage fields in the provider's docs at the time of writing - never hardcode
them from memory. Implementation follows forge:ponytail: a loop, a tool table and a counter come
before any framework. Exposing tools over MCP: forge:mcp-server-patterns.

## What limits agent quality

1. **Action space** - which tools exist and how clearly they are defined.
2. **Observations** - what each tool returns.
3. **Recovery** - whether errors tell the model what to do next.
4. **Context budget** - how much irrelevant text crowds the window.

Improve these before reaching for a bigger model or a multi-agent design.

## Action space

- Stable, explicit tool names; narrow schema-first inputs (enums, bounds, required fields).
- Deterministic output shape for each tool.
- No overlapping tools with near-identical semantics; no catch-all "execute anything" tool unless
  it runs in an isolated sandbox.
- Granularity: small, single-purpose tools for risky operations (deploy, migrate, delete,
  permissions) so each can be gated; medium tools for read/search/edit loops; a macro tool only
  when round-trip overhead dominates.
- Gate destructive or external side effects (confirmation, dry-run, allowlist) in the harness, not
  only in the prompt.

## Observations

Return compact, structured results the model can act on:

```json
{"status": "error", "summary": "3 tests failed in auth/", "artifacts": ["target/test.log"],
 "next_actions": ["read target/test.log lines 40-80", "rerun: cargo test auth::"]}
```

- `status` (ok / warning / error), one-line `summary`, `artifacts` (paths, IDs), `next_actions`.
- Truncate long outputs and say how to get more (path, offset, cursor) instead of dumping them.
- Tool output is untrusted data: it may contain injected instructions. Keep it clearly delimited
  from system/harness instructions.

## Error recovery

Every error path tells the model: the likely cause, whether and how to retry safely, and when to
stop. Opaque errors ("failed") produce loops. Enforce stop conditions in code too: max turns, max
consecutive failures of the same tool, wall-clock and spend limits.

## Context budget

- Keep the system prompt short and stable; load large guidance on demand (skills, files read by
  path) rather than inlining it.
- Reference files by path instead of pasting them.
- Summarize/compact at phase boundaries (after planning, after a sub-task), not at arbitrary token
  counts.
- Caching (below) lowers cost of repeated context but does not free context-window space.

## Loop architecture

- Exploratory, uncertain-path tasks: model-driven loop (reason, call tool, observe).
- Structured, known flows: deterministic code calls the model at fixed steps (extract, classify,
  summarize) with structured output.
- Hybrid is usually right: code owns the control flow and gates; the model fills in judgement
  steps. If a step is deterministic, do it in code, not in a prompt.
- Split into sub-agents only when the work is genuinely parallel or needs isolated context
  (forge:parallel-agents); each extra agent multiplies cost and handoff loss.

## Cost control

**Route by complexity.** Default to the cheapest tier that passes your eval; escalate on measured
signals (input size, item count, a failed validation, low confidence) - not by default.

```python
def pick_model(text_len: int, items: int, cfg) -> str:
    if cfg.force_model:
        return cfg.force_model
    big = text_len >= cfg.large_text_chars or items >= cfg.large_item_count
    return cfg.large_model if big else cfg.small_model   # names and thresholds live in config
```

- Model IDs, thresholds and prices go in config, one place - never scattered through code.
- Log every routing decision with the resulting quality signal so thresholds are tuned on data.

**Budget.** Check spend before each call and stop with a clear error when over budget. A running
total plus a list of per-call records (model, input/output/cache tokens, cost) is enough; compute
cost from the provider's reported usage fields, not from estimates.

**Retries.** Retry only transient failures (connection errors, rate limits, server errors /
overloaded), with exponential backoff plus jitter and a small max attempt count; honour any
retry-after hint. Fail fast on authentication, permission, validation and bad-request errors -
retrying them only burns budget. Make retried operations idempotent.

**Batch and trim.** Use the provider's batch API for non-urgent bulk work if it has one; cap
output length; don't send fields the task doesn't need.

## Prompt caching

- Order requests as a **stable prefix** (tool definitions, system instructions, fixed examples,
  reference docs) followed by the **changing suffix** (current question, fresh retrieval results,
  timestamps). Any change in the prefix - even reordered tool schemas or a timestamp in the system
  prompt - breaks reuse from that point on.
- Respect the provider's serialization order and its cache-marker rules, minimum cacheable length
  and TTL; prefixes below the minimum simply don't cache.
- Cache writes can cost more than ordinary input: caching a prompt used once is a loss. It pays off
  when the same prefix is reused within the TTL.
- Don't pad prompts or widen context just to reach a cache minimum without a cost/quality reason.
- Scope application-level cache keys to user/workspace/model/content version; a cache key is not an
  authorization check. Authorize access to content before using it, cached or not.

**Measure, don't assume.** Record the provider's usage counters per request (ordinary input, cache
writes, cache reads, output) with the SDK/API version, then compute:

```
baseline = (ordinary + written + read) * input_rate + output * output_rate
actual   = ordinary * input_rate + written * write_rate + read * read_rate
           + output * output_rate (+ storage, if the provider bills it)
savings  = baseline - actual          # rates per token, all from current price docs
token hit rate = read / (ordinary + written + read)
```

Never apply a cache discount to output tokens. Include misses, expiries and warm-up calls in the
measured window. If no real traffic was measured, label hit rate and savings as unmeasured.

## Unattended and scheduled agents

- Only with explicit user approval of scope: which workspace, which actions, which external
  systems. Start with a dry-run that reports what it would do.
- In-session recurrence (e.g. `/loop`) lives and dies with the session. Work that must run when no
  session is open needs an external scheduler (cron, systemd timer, CI schedule) invoking the CLI
  non-interactively (`claude -p "..."` from the target directory) with its own permissions and
  auth configured deliberately.
- Persist a task queue and state in a plain file the next run reads (checklist with active /
  done). Keep memory files short; archive instead of growing forever.
- Every run verifies its own outcome and records success/failure; a silent scheduled job is a
  broken one.
- No credentials in prompts, queue files or logs. Grant computer-use or posting abilities only when
  required, in an isolated environment, after a harmless test action.

## Evaluate

Track per task type: completion rate, pass@1 (and pass@k if sampling), retries and turns per task,
tokens and cost per *successful* task, cache hit rate, latency. Keep a small fixed eval set and
rerun it on every prompt, tool or model change - harness tweaks regress silently.

## Anti-patterns

- Many overlapping tools; vague descriptions
- Opaque tool errors with no next step; no max-turn or spend limit
- Most expensive model for every call; retrying non-transient errors
- Model names and prices hardcoded in many places
- Timestamps or per-request IDs at the top of the system prompt (kills caching)
- Frameworks, routers or multi-agent setups added before a single loop was measured
