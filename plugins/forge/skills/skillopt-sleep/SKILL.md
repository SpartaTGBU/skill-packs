---
disable-model-invocation: true  # skl: on-demand pack skill
name: skillopt-sleep
description: Offline "sleep cycle" that makes an agent learn from its own past sessions - harvest transcripts, mine recurring tasks, replay them, propose bounded edits to a skill/memory file, accept only if a held-out validation gate improves, stage for review, then adopt. Drives Microsoft's skillopt_sleep engine (supports Claude Code, pi and opencode today). Use when asked to self-improve from usage, consolidate learned preferences into a skill, run a sleep/dream cycle, or review past sessions.
---

# SkillOpt-Sleep (harness-neutral)

Engine: `skillopt_sleep` Python package from microsoft/SkillOpt (MIT, Python >= 3.10). It is not
part of Temple/forge; this skill only drives it. Forge skill-writing rules for the files it
edits: forge:writing-skills. The cycle:

```
harvest local transcripts (read-only) -> mine recurring tasks -> replay under current skill+memory
  -> reflect, propose bounded add/delete/replace edits -> GATE on held-out tasks
  -> stage proposal in <project>/.skillopt-sleep/staging/<ts>/ -> (user) adopt, with backup
```

Nothing live changes until `adopt`. Harvest is read-only. Default backend `mock` makes no calls.

## Install (user step; the agent does not pip-install)

```bash
git clone https://github.com/microsoft/SkillOpt ~/src/SkillOpt     # needed for pi/opencode/handoff support (post-0.2.0)
pip install -e ~/src/SkillOpt        # in a venv/pipx; or `pip install skillopt` (0.2.0: base CLI only)
export SKILLOPT_HOME=~/src/SkillOpt
```

Runner (no network, no cron by default):
`scripts/sleep.sh <action> [args]`.
It uses `$SKILLOPT_HOME` (clone) else a `skillopt-sleep` executable on PATH, runs from the engine
dir (so use absolute paths for `--tasks-file` etc.), defaults `--project` to the CWD, and refuses
`schedule`/`unschedule` unless `SKILLOPT_ALLOW_SCHEDULE=1`.

## Invoke

| Action | Effect |
|---|---|
| `status` | state and latest staged proposal |
| `dry-run` | harvest+mine+replay+report, stages nothing |
| `run` | full cycle, stages a proposal |
| `adopt --legacy` / `--skill NAME` / `--all-skills` | apply a reviewed proposal (backs up targets) |
| `harvest --output tasks.json` | export mined tasks for review |

Procedure: (1) `status`; (2) `dry-run` with `mock` to check plumbing; (3) pick source+backend for
the harness (table below), confirm the data boundary with the user; (4) `run`; (5) read `report.md`
in the staging dir and show the user held-out baseline -> candidate score and the exact proposed
edits; (6) only on the user's explicit OK, `adopt`. Never hand-edit the target skill/memory file
to apply a proposal, and never use `--auto-adopt` unless the user asked for it.

## Which harness works today

Selection is by two independent flags: `--source` (whose transcripts to harvest) and `--backend`
(who performs model calls: mining, replay, judging, reflection). Both are plain CLI flags (or
`transcript_source` / `backend` keys in `~/.skillopt-sleep/config.json`).

| Harness | `--source` | `--backend` | Notes |
|---|---|---|---|
| Claude Code | `claude` (default; `~/.claude/projects`) | `claude` | default target skill `~/.claude/skills/skillopt-sleep-learned/SKILL.md`; memory target is CLAUDE.md |
| pi | `pi` (`~/.pi/agent/sessions`; `--pi-home`) | `pi` (needs authenticated pi CLI; `--pi-path`, `--model provider/model`) | calls disable tools/skills/extensions/session writes; `--source auto` never picks pi |
| opencode | `opencode` (read-only SQLite `~/.local/share/opencode/opencode.db`; `--opencode-db`) | `opencode` (installed CLI, plain calls disable project config/tools/plugins/MCP; `--opencode-tool-replay` opt-in) | no native opencode plugin/command; pi/opencode support needs a source install from `main` |
| hermes | none | none | not supported: needs an adapter (below) |

Always pass `--target-skill-path <abs path>/SKILL.md` for non-Claude harnesses, e.g. the forge
skill dir or `~/.pi/agent/skills/...`, `~/.config/opencode/skills/...`, `~/.hermes/skills/...`,
so the evolved skill lands where that harness loads it. Example (pi):

```bash
sleep.sh run --source pi --backend pi --model provider/model --max-sessions 5 --max-tasks 3 --progress \
  --target-skill-path /abs/path/to/skills/skillopt-sleep-learned/SKILL.md
```

Cross-harness fallbacks that need no engine code:
- Any model/harness as executor: `--backend handoff` writes `.skillopt-sleep-handoff/PROMPTS.md` +
  `pending.json`, exits 3; answer each prompt in a FRESH isolated context (a subagent given only the
  prompt text, never this session, which has seen the references and would contaminate the gate)
  into `answers/<id>.md`, rerun the same command; exit 0 = done. Max ~8 rounds.
- Any OpenAI-compatible endpoint (local vLLM/Ollama, hosted): `--backend azure_openai` with
  `AZURE_OPENAI_AUTH_MODE=openai_compatible`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`
  (see docs/sleep/openai-compatible-endpoints.md in the repo; post-0.2.0).
- Hermes: harvest has no hermes source, so either export hermes sessions to the engine's task-file
  JSON yourself and replay with `--tasks-file reviewed.json` (set `"reviewed": true` after review),
  or write a `harvest_hermes.py` adapter modeled on `skillopt_sleep/harvest_pi.py` and register the
  source name in `__main__.py`/`harvest_sources.py`. Both are outside this skill. Backend can be
  `handoff` or the OpenAI-compatible route meanwhile.

## Common flags

`--project`, `--scope invoked|all`, `--lookback-hours N` (72), `--max-sessions N`, `--max-tasks N`
(40), `--edit-budget N` (4), `--preferences "house rules"` (steers reflection, still gated),
`--tasks-file`, `--progress`, `--json`, `--model`. `python -m skillopt_sleep <action> --help` is
authoritative; main CLI does not expose `--gate`, `--rollouts-k`, budgets. Config
`~/.skillopt-sleep/config.json`: `gate_mode`, `gate_metric`, `gate_no_regression`, `evolve_memory`,
`evolve_skill`, `max_tokens_per_night` (soft cap, 400000), `evidence_log`, `redact_secrets`.

## Data boundary and rules

- A real backend sends truncated transcript excerpts and mined tasks to the chosen provider.
  Redaction is best-effort. For sensitive work: `harvest --output <abs>/tasks.json`, inspect and
  redact, set `"reviewed": true`, then `dry-run/run --tasks-file`. Real backends reject unreviewed files.
- `evidence.jsonl` in the staging tree holds redacted prompts/replies: treat as sensitive, set
  `"evidence_log": false` to disable.
- Scheduling edits crontab (`schedule`); only on the user's request, with `SKILLOPT_ALLOW_SCHEDULE=1`.
  The scheduler stores only project/backend/time; put source/model/path in the config file first and
  use absolute CLI paths (cron has a minimal PATH).
- A held-out gain is run-specific evidence, not a guarantee. Demo without providers:
  `python -m skillopt_sleep.experiments.run_experiment --persona researcher --assert-improves`.

## Dropped from the upstream Claude Code plugin

SessionEnd hook, `/plugin` install, `install-cron.sh` printer and Claude-only command wrappers;
their job is covered by the Invoke procedure above.
