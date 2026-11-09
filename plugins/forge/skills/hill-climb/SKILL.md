---
# skl: model-visible (in the Skill tool listing; `skl hide` leaves it alone)
name: hill-climb
description: "Turn a goal into a hill an agent can climb unattended: build a verifier that outputs a score, set a /goal condition the evaluator can check, then loop change → score → keep or revert → raise the bar, while removing whatever slows the climber. Use for long-running agentic builds: ports and rewrites against a reference, \"make X N times faster\" with tests held, shrinking prompts or tool descriptions under an eval, UI or design polish scored by a judge panel, games or apps compared to a reference. Also use it on your own when a long task has no clear way to score progress, so you can ask the user for the target, the reference and the bar. Triggers: hill climb, /goal, run until, keep going until, autoresearch, make the score go up, iterate until N/10."
---

# Hill climb

```
NO CLIMB WITHOUT A SCORE THE AGENT CAN READ ITSELF
```

A hill is a problem reshaped to look like an RL training environment: an input, a check that
says pass/fail or gives a number, and room to try again. Models are trained against verifiable
rewards (RLVR), so they are very good at making a number go up when they can measure it
themselves and very bad at "make it good" when they can't. Your job is to make the hill, not to
climb it. Then you supply the climber and remove what blocks it.

`/goal` with no hill is the fastest way to burn tokens for nothing. `/goal` pointed at a real
hill is the engine that keeps the agent running for hours or days.

## When to use it

- **Good hills:** a port or rewrite checked against a reference implementation; "N× faster with
  every test still passing"; an eval built from past failures; "same eval score at a third of
  the context"; "4× less data with no regressions"; UI or visual quality checked against
  competitors or the original by a judge panel.
- **Not a hill:** one-off fixes, anything where the only judge is you looking at it, work whose
  "done" you can't put into a number. Use forge:brainstorming or forge:writing-plans instead.
- **Cost:** climbs run for hours to weeks and use a lot of subscription quota. Do them on
  subscriptions, never metered API keys, unless the owner says otherwise. Say what the climb
  will roughly cost before starting a long one.

**Coming from forge:brainstorm-technical-design?** Its Hill track already wrote the `HILL.md`
header. Check that the header is complete, run the verifier for the baseline, and go straight to
*Climb*. When the target, the verifier or the reference is still unclear, run that design session
first. A bad hill costs more than the design session would.

## The loop

```
0 supply ─► 1 target ─► 2 verifier ─► 3 environment ─► CLIMB ─► 4 ask for blockers
   ▲                        ▲              ▲                            │
   └────────────────────────┴──────────────┴───── blockers ─────────────┘
                                        (some blockers become their own hills)
```

### Clarify first (ask, don't guess)

If the target, the reference, the guard or the bar isn't stated, **ask before building
anything.** Use AskUserQuestion, one round of up to 4 questions, each with concrete options and
your recommendation first: "Which reference: Skate 1 or Skate 3?", "Bar: 9.0 or 9.5?", "Which
models must pass?". Find facts like the current score, the available references and the tools
yourself. Only the decisions go to the user. For a hill with design choices in it, run
forge:brainstorm-technical-design (Hill track) instead. To set the stop condition, use forge:goal.

### Step 1. Pick the target. Tedious is good

Lean into tedium: rewriting a 100k-file codebase, checking 85 tool-use cases, comparing 40
screenshots. That work wears a human down; an agent doesn't care. Write the target as one
sentence with a number in it:

- "Our build of corpus C matches `tsc@5.x` output byte for byte, errors included."
- "Every model scores 85/85 on `evals/mcp`, then the tool descriptions shrink to ⅓ of their size and still score 85/85."
- "Every judge scores every UI category ≥ 9.0, and we beat Claude Code and Codex in every category."

### Step 2. Build the verifier. This step matters most

Prefer the strongest verifier you can get:

1. **Programmatic pass/fail or a number.** Differential tests against a reference, test suites,
   benchmarks, evals. This is the best kind, and it needs no human.
2. **Agent judges against references.** A panel of models from different providers scores the
   output side by side with real reference material. Noisy, but it works. Run the judges with
   `scripts/judge`: a GitHub Copilot subscription (Claude, GPT and MAI models) or any
   OpenAI-compatible API, with screenshots supported. See `references/judge-panel.md`.
3. **A human in the loop.** Avoid it. The climb stalls whenever it waits for you. One big port
   ran ~1,800 revisions and ~7,900 commits; no human can review that fast.

Verifier rules (details and recipes in `references/verifiers.md`):

- **Pin the reference.** Use an exact version of the oracle, a fixed corpus, fixed seeds and
  fixed screenshot states. If the reference moves, scores mean nothing.
- **Use real inputs, then add perturbations.** Take real projects or real history, then inject
  errors or edge cases so failure paths get checked too.
- **Guard while you optimize.** Every speed or size target carries a correctness guard: "2× faster
  *and all validation still passes*", "binary within 20% of reference performance", "no UI
  regressions on real threads".
- **The climber can't edit the verifier.** Keep the verifier read-only to the climber, in its own
  commit or directory. Keep a held-out set it never sees, because models overfit to visible
  examples. A public benchmark gets saturated, then fails on the private split.
- **Make the score cheap and fast.** The climb runs as many iterations as the verifier allows.
  A 70-minute check means a few landings a day; a 6-minute check means several times more.

Before climbing, run the verifier once on the current state and record the baseline. A verifier
that can't fail, or can't pass, is broken.

### Step 3. Give the climber what it needs

List what the agent needs to *make* the thing and to *check* it, and give it those tools before
you start: build hosts, a GUI or headless browser for screenshots, Blender, GPUs, database
access, reference material. Send heavy builds through whatever build queue or runner the
project uses, and respect its slot and memory limits. Snapshot a warm environment once, so each iteration doesn't
re-clone and rebuild the world. Queue heavy jobs so parallel climbers don't OOM the box.

### Climb

Write the ledger first (format below), then set the goal. **Use the `/goal` that matches the
harness:**

- **Claude Code:** `/goal <condition>`, or the ProposeGoal tool when the user wants it proposed.
  After every turn a *separate evaluator* reads the transcript and decides whether the condition
  is met. If it isn't, the agent keeps going and the evaluator records why. The condition is
  limited to 500 characters. `/goal clear` stops it.
- **Elsewhere** (opencode, Codex, custom runners): the same prompt with "do not stop until…".
  The evaluator here is the verifier you run each round.

The evaluator only sees the transcript, so write a condition it can check from a printed
scoreboard. **Print the ledger's latest row every turn.**

```
/goal Climb per HILL.md. Each round: one change, run `just verify`, print the ledger row,
keep if score ≥ best else revert. Done when the ledger shows ≥ 9.0 from every judge in every
category, and `just verify` passes on main.
```

Each round:

1. Read the ledger and the last verifier output. Pick the **largest** failing bucket or worst
   category, not the easiest one.
2. Make one coherent change. Small enough to revert cleanly, big enough to move the score.
3. Run the verifier. Append a ledger row.
4. **Ratchet:** if the score improved, or held while a secondary target improved, commit. If not,
   revert. A drop is information, not a disaster: keep the best commit and record why it dropped.
5. Once the target is met, **stabilize**: rerun the verifier several times on all target models
   or inputs before calling it done. LLM-judged scores need two consecutive passing rounds.

### Raise the bar (you decide where the top is)

Once a hill is climbed, the top can usually move up:

- **Stack, don't overwrite.** Land or open the PR at the current level. Then fork a new branch or
  worktree for the next bar (9 → 9.5 → 10). The mergeable baseline stays safe.
- **Do it in phases.** First get it correct, commit, and stabilize. *Then* optimize with
  correctness as the guard: "now make it ⅓ the size and keep a perfect score", "now 2× faster".
- **Add stronger references.** If the absolute scores look generous, compare against a better
  competitor or the original. A score with no reference drifts upward.
- **Expect each step up to cost more.** 6 → 9 took 3 rounds. 9 → 9.5 took 10 more.

### Step 4. Ask the climber what's blocking it

Run a second, **observer** thread next to the climber. Never interrupt the climber to ask.
When progress slows, ask the observer: "Read the ledger and git log. What is bottlenecking the
work? What is the agent waiting on?" Then fix what it reports:

- Waiting for compute → queue it, add hosts, snapshot environments, move to elastic VMs.
- Slow checks → make the verifier faster or split it into a fast gate and a full gate.
- Missing tools or access → give them.
- A blocker that is itself measurable (a slow compiler, a bloated context) → **that blocker is
  a new hill.** Start a new climb for it.

You act as a manager: you build the environment and remove blockers. You don't read every diff
the climber makes. Final review still happens before landing (forge:code-review,
forge:verification).

## The ledger

Keep `HILL.md` at the repo root of the climbing branch. It is the single source of truth, and
it survives compaction and restarts. "continue" should be enough to resume.

```markdown
# Hill: <one-sentence target with a number>
Verifier: `<command>` (pinned: <oracle version / corpus hash / judge panel>)
Guard: <what must stay true while optimizing>
Bar: <current bar>   Next bar: <next bar, or "stop">
Held-out: <where the hidden set lives; climber must not read it>

| round | commit | change | score | best | kept | note |
|------:|--------|--------|------:|-----:|:----:|------|
| 0 | abc123 | baseline | 66/85 | 66/85 | — | |
| 1 | def456 | split thread vs sub-agent tool descriptions | 74/85 | 74/85 | ✓ | |
| 2 | — | merged settle into close | 71/85 | 74/85 | ✗ | broke settle cases |
```

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Hours spent on one cosmetic detail (one climb spent ~$800 of tokens on a skybox) | The verifier weights something you don't care about | Re-weight the verifier, or add "ignore X" to the judge brief |
| The output drifts toward the wrong look (too bright, too grey) | Wrong or bad reference, or no taste input | Reset with the right reference. Steer with one line of taste ("restore some colour") |
| The score climbs but the thing isn't better | The climber gamed the verifier: special-cased inputs, weakened tests, edited the checker | Verifier read-only, held-out set, review the diff for test or verifier edits |
| Scores jump around from round to round | Non-deterministic judges | Several judges, several samples, scores against references, require agreement |
| The judges' scores creep up toward the target | The judges know the target | Never tell the judges the bar. Only the parent knows it |
| The loop stalls on one judge | A slow or rate-limited judge blocks every round | Gate with the cheap judge, bring in slow judges only once it passes |
| `/goal` runs forever and nothing lands | No real hill, or the evaluator can't see the score | Print the ledger row every turn. Make the condition checkable from text |
| Progress slows over days | The environment, not the model, is the limit | Step 4: ask the observer and remove the blocker |

## Before you start the climb

- [ ] The target is one sentence with a number in it
- [ ] The verifier runs with one command, needs no human, and its baseline is recorded
- [ ] The reference is pinned; the held-out set exists; the climber can't write the verifier
- [ ] Every optimization target has a correctness guard
- [ ] Tools and compute are in place; heavy jobs are queued
- [ ] `HILL.md` is written; the `/goal` condition is ≤ 500 characters and checkable from the printed ledger
- [ ] The observer thread is planned; the expected cost has been stated

Recipes: `references/verifiers.md`. Judge panels: `references/judge-panel.md`. Source notes and
numbers: `references/sources.md`.
