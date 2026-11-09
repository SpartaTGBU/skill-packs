---
disable-model-invocation: true  # skl: on-demand pack skill
name: session-report
description: Generate an explorable self-contained HTML report of agent usage - tokens, cache hit rate, subagents, skills, most expensive prompts - from local session stores of Claude Code, pi, hermes or opencode. Use when the user asks for a usage/cost/token report, "where did my tokens go", cache-break analysis, or a weekly session summary.
---

# Session Report

Produce a self-contained HTML report of agent usage and save it to the current working directory. Node is the only runtime.

## Harnesses

| Harness | Store | Script | Status |
|---|---|---|---|
| Claude Code | `~/.claude/projects/**/*.jsonl` | `analyze-sessions.mjs` | full: per-call tokens, cache breaks, subagents, skills, per-prompt cost |
| pi | `~/.pi/agent/sessions/<cwd-slug>/*.jsonl` | `analyze-other-harnesses.mjs --harness pi` | verified format; per-call tokens and cache; no subagent/skill attribution |
| hermes | `~/.hermes/state.db` (SQLite, `sessions` table) | `analyze-other-harnesses.mjs --harness hermes` | schema verified; session-level aggregates; assumes `input_tokens` excludes cache reads (UNVERIFIED) |
| opencode | `~/.local/share/opencode/opencode.db` (SQLite, `session` + `session_v2`) | `analyze-other-harnesses.mjs --harness opencode` | schema verified; session-level aggregates; child sessions shown as subagents; token semantics UNVERIFIED |

For hermes and opencode there are no cache-break, skill or per-prompt rows; `top_prompts` lists the heaviest sessions. SQLite is read with Node's built-in `node:sqlite` (Node >= 22.5), opened read-only. If the user does not name a harness, use the one running this session, or run all that have data and report them separately.

## Steps

1. **Get data.** Default window is the last 7 days; honor a different range (`24h`, `30d`, `all` = omit `--since`). Scripts live in ``:
   ```sh
   S=.
   node $S/analyze-sessions.mjs --json --since 7d > /tmp/session-report.json            # Claude Code
   node $S/analyze-other-harnesses.mjs --harness pi --since 7d > /tmp/session-report.json   # or hermes / opencode
   ```
   Override store locations with `--dir`.

2. **Read** `/tmp/session-report.json`. Skim `overall`, `by_project`, `by_subagent_type`, `by_skill`, `cache_breaks`, `top_prompts` (and `notes` for non-Claude harnesses).

3. **Copy the template** to the output path in the current working directory:
   ```sh
   cp $S/template.html ./session-report-$(date +%Y%m%d-%H%M).html
   ```

4. **Edit the output file** (targeted edits, not a rewrite: preserve the template's JS/CSS):
   - Replace the contents of `<script id="report-data" type="application/json">` with the full JSON from step 1. The page's JS renders the hero total, tables, bars and drill-downs from it.
   - Fill the `<!-- AGENT: anomalies -->` block with **3-5 one-line findings**, figures as a **% of total tokens** where possible (total = `overall.input_tokens.total + overall.output_tokens`). Exact markup:
     ```html
     <div class="take bad"><div class="fig">41.2%</div><div class="txt"><b>cc-monitor</b> consumed 41% of the week across just 3 sessions</div></div>
     ```
     Classes: `.take bad` waste/anomalies (red), `.take good` healthy signals (green), `.take info` neutral facts (blue). `.fig` is one short number (a %, a count, or a multiplier like `12x`); `.txt` is one plain sentence naming the project/skill/prompt, subject in `<b>`. Look for: a project or skill eating a disproportionate share, cache-hit <85%, a single prompt >2% of total, subagent types averaging >1M tokens/call, cache breaks clustering.
   - Fill the `<!-- AGENT: optimizations -->` block (bottom of page) with 1-4 `<div class="callout">` suggestions tied to specific rows (e.g. "`/weekly-status` spawned 7 subagents for 8.1% of total - scope it to fewer parallel agents").
   - Do not restructure existing sections.

5. **Report** the saved file path. Do not open or render it.

## Notes

- The template provides the interactivity (sorting, expand/collapse, block-char bars). Your job is data plus narrative.
- Keep commentary terse and specific: real project names, numbers, timestamps from the JSON.
- Claude: `top_prompts` already includes subagent tokens and rolls task-notification continuations into the originating prompt. API responses are split into several JSONL entries; the analyzer dedupes by requestId and entry uuid.
- Reports can contain prompt text and project paths; treat the HTML as private.
