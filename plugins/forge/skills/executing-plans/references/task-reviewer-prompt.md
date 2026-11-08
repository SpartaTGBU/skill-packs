# Task reviewer prompt template

Dispatch with the Agent tool, `subagent_type: forge:code-reviewer` (fall back to `general-purpose` if unavailable), explicit `model` scaled to the diff's risk (`sonnet` floor). Add a parallel `forge:security-reviewer` dispatch when the task touches input handling, auth, secrets, or data writes.

## Task review

```
Review one task's implementation: first spec compliance, then quality. This is a
task-scoped gate; a whole-branch review happens later.

What was requested: [BRIEF_FILE]
Global constraints that bind this task (verbatim from plan/spec):
[GLOBAL_CONSTRAINTS]
What the implementer claims: [REPORT_FILE]
Diff (commit list, stat, full diff with context): [DIFF_FILE]  (range [BASE]..[HEAD])

Rules:
- Read the diff file once; it is your view of the change. Read code outside it only
  to check a concrete risk you can name (changed contract, lock order, shared state:
  check call sites). Name the risk and what you checked.
- Read-only: don't modify the working tree, index, or branches.
- Don't dispatch subagents.
- Treat the report as unverified claims. Rationales like "kept simple per YAGNI" don't
  lower a finding's severity.
- Don't rerun the suite; the report carries test evidence. Run one focused test only
  if the code raises a specific doubt no existing run answers. Warnings in reported
  output are findings. Evidence you can't find is a gap to report, not a failure.

Part 1, spec compliance:
- Missing: requirements skipped or claimed but not implemented
- Extra: unrequested features, options, abstractions (over-building is a finding)
- Misunderstood: right feature built wrong, wrong problem solved
- Batched brief: every listed file must have its hunk
- Requirements you can't verify from the diff: list as "cannot verify", don't go hunting

Part 2, quality:
- Correct error handling, edge cases, no swallowed errors
- Tests assert real behavior, not mocks; expected values independent of the code
- Smallest complete change: duplicated logic, needless layers, dead options
- Files with one clear responsibility; follows the plan's structure

Severity: Critical = wrong/unsafe; Important = task can't be trusted until fixed
(incorrect or fragile behavior, missed requirement, duplicated logic block, swallowed
errors, tests that assert nothing; also when the plan mandated it, labelled
"plan-mandated"); Minor = polish, broader coverage.

Output (no preamble, every line a verdict, finding with file:line, or a check you ran):
### Spec compliance
✅ compliant | ❌ issues: ... (file:line)
⚠️ Cannot verify from diff: ...
### Strengths
### Issues
#### Critical  #### Important  #### Minor
(file:line, what's wrong, why it matters, fix if not obvious)
### Assessment
Task quality: Approved | Needs fixes. Reasoning: 1-2 sentences.
```

## Scoped re-review (after a fix round)

```
Re-review one fix round. Not a fresh review.
Task brief: [BRIEF_FILE]
Findings under verification:
[FINDINGS]
Implementer report (fix reports appended at end): [REPORT_FILE]
Fix diff [FIX_BASE]..[HEAD]: [DIFF_FILE]

For each finding: ADDRESSED or NOT ADDRESSED, with file:line evidence.
Then check only the fix diff for new Critical/Important breakage.
Anything else you notice outside the fix diff: list as out-of-scope observations
(they go to the ledger, not this loop). Read-only; no subagents; don't rerun the suite.
```
