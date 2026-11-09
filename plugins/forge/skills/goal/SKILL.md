---
# skl: model-visible (in the Skill tool listing; `skl hide` leaves it alone)
name: goal
description: "Turn a request into one checkable done-condition and set it as a session goal (Claude Code /goal or ProposeGoal; a \"do not stop until\" prompt elsewhere), asking the user to pick or sharpen the condition when it is vague. Use when the work spans many turns and has a verifiable end state (\"make the tests pass\", \"migrate every call site\", \"get the eval to 85/85\"), when you are unsure what done means before a long run, or when the user says goal, /goal, keep going until, don't stop until."
---

# Goal

```
ONE MEASURABLE END STATE, CHECKABLE FROM THE TRANSCRIPT, THAT THE USER ACTUALLY ASKED FOR
```

This skill follows Claude Code's built-in `/goal`. When a goal is set, a Stop hook runs after
every turn. A **separate evaluator** reads the conversation and decides whether the condition is
met, not yet met (you keep working), or impossible (the goal fails with a reason). The evaluator
**cannot run commands or read files**. It only sees what the transcript shows.

## When to set a goal

- **Yes:** the user asked for an outcome with a verifiable end state, and reaching it will take
  several turns. Examples: tests passing, every call site migrated, a benchmark ratio, an eval
  score, a judge-panel bar.
- **No:** one-off tasks; open-ended exploration; anything where "done" is taste with no judge.
  Never use a goal to widen scope: the condition must follow from the user's request.
- If the end state is a number to push up (faster, smaller, a higher score), load
  forge:hill-climb as well. The goal is the stop condition; the climb is how you get there.

## Clarify first (ask, don't guess)

When the end state is fuzzy, ask before setting anything. Use AskUserQuestion with 2–4 candidate
conditions, your recommendation first. Each option should be a complete condition the user could
approve as written:

- "`cargo test --workspace` exits 0, and clippy has no warnings"
- "every `oldClient(` call in `src/` is migrated; `rg 'oldClient\('` returns nothing"
- "the eval prints 85/85 for Sonnet 5.5 and Opus 5.5"

Ask about only the parts you can't settle from the code yourself: which bar, which models, which
paths are in scope, which checks count. Find the facts yourself; leave the decisions to the user.
If a scoring method doesn't exist yet, say so. Building it is the first task (forge:hill-climb,
Step 2).

## Writing the condition

- **One end state plus the check that proves it.** "X, shown by `cmd` exiting 0 / printing N."
- **At most 500 characters.** The user has to be able to read all of it in the approval dialog.
- **Checkable from text.** Name the command whose output you will print. A condition like "the
  code is clean" can't be checked; "`just lint` exits 0" can.
- **No moving targets.** Pin the versions, the corpus and the models the check runs against.
- **Include the guard** when you optimize: "...and the full test suite still passes".

| Weak | Strong |
|---|---|
| make the UI look better | every judge in the hill-climb panel scores every category ≥ 9.0, per the printed HILL.md row |
| fix the flaky tests | `bun test` passes 10 consecutive runs; the printed run log shows 10/10 |
| speed up the build | `just bench` shows ≥ 2.0× vs. baseline, and `just verify` passes |

## Setting it

- **Claude Code, the user types it:** `/goal <condition>`. `/goal clear` stops it. Only one goal
  is active at a time; a new one replaces the old one.
- **Claude Code, you propose it (ProposeGoal tool):**
  - Ask the user to approve by default (`ask_user` true). Set it directly only when the user's
    own words in this conversation stated this exact outcome. If you inferred it, or are in
    doubt, ask.
  - If they decline, don't bring it up again and don't propose a reworded version.
  - The goal starts only once a kickoff message arrives. Keep working in the meantime.
  - It isn't available in plan mode (propose it after the plan is approved), in subagents, or in
    non-interactive sessions.
- **Other harnesses** (opencode, Codex, custom runners): put the same condition into the prompt as
  "Do not stop until <condition>. Before ending each turn, print the check's output." Your own
  check plays the evaluator.

## Working under a goal

- **Print the evidence every turn**: the command, its exit code, the score line. If the evaluator
  can't see it, it can't count it.
- When the evaluator says "not met", treat its reason as the next task. Don't argue with it in
  prose. Produce the evidence instead.
- If the goal turns out to be **impossible** (the premise is wrong, access is missing, the bar
  can't be reached as stated), stop and say why, plainly. Ask the user how to change it. Don't
  quietly weaken the condition or the check.
- Never edit the check to make it pass, whether by deleting tests, special-casing inputs or
  loosening thresholds. If the check itself is wrong, that's a question for the user.
- A goal with no real check just burns tokens. If you can't write a check, the work needs
  forge:brainstorming or forge:brainstorm-technical-design first, not a goal.

Source: this paraphrases Claude Code v2.1.316's `/goal` command and the guidance built into its
ProposeGoal tool, plus the field notes in forge:hill-climb (`references/sources.md`).
