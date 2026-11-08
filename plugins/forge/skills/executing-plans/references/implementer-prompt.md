# Implementer prompt template

Dispatch with the Agent tool, `subagent_type: general-purpose`, an explicit `model`, and (frontier mode) `isolation: "worktree"`. Fill the brackets; keep exact values in the brief file, not here.

```
You are implementing Task [N]: [task name].

## Requirements
Read your brief first: [BRIEF_FILE]. It is your requirements; use its exact values,
signatures and test cases verbatim.

## Context
[One line: where this task fits.]
[Interfaces/decisions from earlier tasks the brief can't know.]
[Your resolution of any ambiguity in the brief.]
Work in: [directory / worktree]. [Frontier: confirm you are based on the integration
branch tip; reset onto it if not.]

## Before you start
If requirements, approach, or dependencies are unclear, ask now (report NEEDS_CONTEXT
with the specific questions). Don't guess.

## How to build it
1. Load forge:tdd and follow it: failing test first, watch it fail, minimum code,
   watch it pass. Trivial changes need no new test.
2. Write code per forge:ponytail: smallest complete change, reuse what exists,
   no speculative options or abstractions, finish every caller and test your change
   touches. Follow the plan's file structure and the codebase's existing patterns.
   Don't restructure code outside this task.
3. Run the focused test while iterating; run the full suite once before committing.
4. Commit. [Frontier: merge the integration branch tip into your branch, rerun
   the suite.]

## Do not dispatch subagents
Do all the work yourself. Never spawn a reviewer: review comes from the controller
after you report.

## Escalate instead of guessing
Report BLOCKED or NEEDS_CONTEXT when the task needs an architectural choice the plan
didn't make, you can't find clarity after reasonable reading, or you're unsure your
approach is right. Bad work is worse than no work.

## Self-review before reporting
Read your own diff: every requirement covered? anything built that wasn't asked?
tests verify real behavior, not mocks? output pristine (no new warnings)? Fix what
you find.

## Report
Write the full report to [REPORT_FILE]:
- What you implemented (or attempted)
- Files changed
- RED: command, failing output, why that failure was expected
- GREEN: command and passing output (focused test and full suite)
- Self-review findings, concerns

Then reply with ONLY (under 15 lines):
- Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- Commits (short SHA + subject)
- One-line test summary (e.g. "14/14 passing, output pristine")
- Concerns, if any
- Report file path
If BLOCKED or NEEDS_CONTEXT, put the specifics in the reply itself.

## If resumed with review findings
Fix them, rerun the tests that cover the amended code, append a fix report (changes,
covering tests, command, output) to the same report file, reply with the same short
contract.
```
