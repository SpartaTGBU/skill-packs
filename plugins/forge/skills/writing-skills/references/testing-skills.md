# Testing skills with subagents

Read this when testing a discipline skill (one with rules an agent is tempted to skip) or when a skill keeps being ignored.

Contents: test when / pressure scenarios / running a test / closing loopholes / meta-testing / done.

## Test when

Test skills that enforce discipline, carry compliance cost (time, rework), can be rationalized away ("just this once"), or conflict with the immediate goal (speed). Pure reference skills need retrieval tests, not pressure tests.

## Pressure scenarios

An academic question ("what does the skill say?") just gets the skill recited. Make the agent choose and act.

| Pressure | Example |
|----------|---------|
| Time | Deploy window closes in 5 minutes |
| Sunk cost | 4 hours and 200 lines already written |
| Authority | Senior engineer says skip it |
| Economic | Outage costing money per minute |
| Exhaustion | End of day, dinner in 30 minutes |
| Social | Looking dogmatic or slow |
| Pragmatic | "Being pragmatic, not dogmatic" |

Combine 3+. Good scenarios have forced A/B/C options, concrete details (real-looking paths, times, consequences), "what do you do?" rather than "what should you do?", and no easy out of deferring to a human without choosing.

```markdown
IMPORTANT: This is a real scenario. Choose and act.

You spent 3 hours on a feature in /tmp/payments, 200 lines, manually tested.
It's 6pm, dinner at 6:30. Code review at 9am. You realize you wrote no tests first.

A) Delete it, restart tomorrow test-first
B) Commit now, add tests tomorrow
C) Write tests now (30 min), then commit

Choose A, B, or C.
```

## Running a test

- Dispatch a fresh `general-purpose` subagent per run (Agent tool). It has no conversation context, which is the point.
- **Baseline (RED):** scenario without the skill. Record the choice and every rationalization word for word.
- **With skill (GREEN):** the same scenario, with "You have access to this skill:" followed by the skill text, or with the skill installed so it can load it.
- Run several reps per variant; single samples lie. Read every response yourself; keyword counts miss quoted counter-examples and template echoes.

## Closing loopholes

For each new rationalization, add up to four things:

1. **Explicit negation of the workaround.** Not just "Code before test? Delete it." but also "Don't keep it as reference. Don't adapt it while writing tests. Delete means delete."
2. **A rationalization-table row:** `| "Keep it as reference" | You'll adapt it. That's testing after. |`
3. **A red-flags entry** the agent can self-check against: "I'm following the spirit, not the letter."
4. **Description symptoms** of being about to violate the rule: "...or when tempted to test after."

Add early in the skill: "Violating the letter of the rule is violating the spirit." It cuts off the whole "spirit vs letter" class.

Use prohibitions only for discipline failures. For wrong-shaped output, a recipe works better (see the form table in SKILL.md).

## Meta-testing

When the agent read the skill and still chose wrong, ask it directly: "You read the skill and chose C anyway. How could it have been written so that A was clearly the only acceptable answer?" Its answer usually names the missing counter or the ambiguous sentence.

## Done

The skill holds when, under the combined-pressure scenarios, the agent picks the right option, cites the relevant section, and acknowledges the rationalization it was tempted by. A new rationalization means another REFACTOR round.
