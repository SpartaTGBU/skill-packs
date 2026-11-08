---
disable-model-invocation: true  # skl: on-demand pack skill
name: receiving-code-review
description: How to act on code review feedback with technical rigor instead of performative agreement or blind implementation - verify each item against the codebase, clarify unclear items first, push back with evidence, fix one at a time and test each. Use when receiving review comments from a human, a reviewer agent, or a PR, before implementing any suggestion, especially when feedback seems unclear, wrong, or asks for more code.
---

# Receiving Code Review

Review feedback is a set of claims to evaluate, not orders to execute and not an occasion for
social performance. Verify before implementing. Ask before assuming. Technical correctness over
comfort.

## The response pattern

```
1. READ       all feedback without reacting
2. UNDERSTAND restate each item as a technical requirement (or ask)
3. VERIFY     check it against the actual code, tests, and callers
4. EVALUATE   is it right for THIS codebase, stack, and load?
5. RESPOND    short technical acknowledgment or reasoned pushback
6. IMPLEMENT  one item at a time, test each (forge:ponytail for how)
```

## Unclear items block everything

If any item is unclear, stop. Do not implement the clear ones first. Items are often related
and partial understanding produces a wrong implementation.

```
User: "Fix 1-6."  You understand 1, 2, 3, 6.
Wrong: implement 1, 2, 3, 6 now, ask about 4 and 5 later.
Right: "I understand 1, 2, 3, 6. Need clarification on 4 and 5 before starting."
```

## By source

**The user**: trusted. Implement after understanding; still ask if scope is unclear. Skip
the praise and go straight to the work or a technical acknowledgment.

**Reviewer agents and external reviewers**: be skeptical, check carefully. Before
implementing, answer:
1. Is it technically correct for this codebase?
2. Does it break existing behavior or callers?
3. Is there a reason for the current implementation (git blame, comments, compat)?
4. Does it hold on all supported platforms/versions?
5. Did the reviewer see the full context (callers, guards one frame up, framework defaults)?

Can't verify? Say so: "I can't verify this without X. Should I investigate, ask, or proceed?"
Conflicts with a decision the user already made? Stop and raise it with the user first.

Agent findings especially: open the cited `file:line` and confirm the failure scenario exists.
Reviewer agents produce confident false positives.

## YAGNI check on "do it properly"

When a reviewer asks to "implement properly", add features, or generalize:

```
grep for actual usage
  unused -> "Nothing calls this endpoint. Remove it instead (YAGNI)?"
  used   -> implement properly
```

You and the reviewer both serve the user. If the feature isn't needed, the right fix is often
deletion. Prefer fixes that remove code over fixes that add layers.

## Order of work

1. Clarify everything unclear first.
2. Then: blocking issues (breakage, security, data loss) -> simple fixes (typos, imports) ->
   complex fixes (logic, refactors).
3. Test each fix individually; re-run the full suite at the end (forge:verification).
4. Check for regressions in callers of anything you changed.

## When to push back

Push back when the suggestion:
- breaks existing functionality or a caller;
- comes from missing context;
- adds something unused (YAGNI);
- is wrong for this stack or version;
- ignores a legacy/compatibility constraint;
- conflicts with the user's architectural decisions.

How: technical reasoning, specific questions, reference to working tests or code. Involve the
user if it's architectural. If pushing back feels uncomfortable, say so and state the issue
anyway.

```
Reviewer: "Remove the legacy code path."
Bad:  "You're absolutely right! Removing it..."
Good: "Checked: build target is 10.15+, this API needs 13+. The legacy path is needed for
       compat, but its bundle ID is wrong. Fix the ID, or drop pre-13 support?"
```

## Acknowledging correct feedback

```
Good: "Fixed. <what changed>."
Good: "Good catch - <specific issue>. Fixed in <file:line>."
Good: just fix it; the diff shows you heard it.
Bad:  "You're absolutely right!", "Great point!", "Thanks for catching that!"
```

No performative agreement, no gratitude, no "let me implement that now" before verifying.
Actions over words.

## When your pushback was wrong

```
Good: "You were right - I checked X and it does Y. Implementing now."
Bad:  long apology, defending the pushback, over-explaining.
```

State the correction and move on.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Performative agreement | State the requirement or just act |
| Blind implementation | Verify against the codebase first |
| Batch of fixes, one test run | One at a time, test each |
| Assuming the reviewer is right | Check whether it breaks things |
| Avoiding pushback | Correctness over comfort |
| Implementing the clear half | Clarify all items first |
| Proceeding when unverifiable | State the limit, ask for direction |

## Replying on GitHub

Reply to inline review comments in their thread
(`gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies -f body=...`), not as a
top-level PR comment. Post only when the user has asked you to.

## Related

forge:code-review (producing reviews), forge:verification (proving fixes),
forge:ponytail (writing the fix).
