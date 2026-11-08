---
disable-model-invocation: true  # skl: on-demand pack skill
name: pr-review
description: Aspect-selectable PR review orchestrator - dispatches the specialist forge agents (comment-analyzer, pr-test-analyzer, silent-failure-hunter, type-design-analyzer, code-reviewer, code-simplifier) for chosen aspects (comments|tests|errors|types|code|simplify|all) and merges results into one action plan. Use when the user says "review PR with ...", "check tests and errors", "run the PR review toolkit", or wants a targeted pre-commit/pre-PR pass.
---

# PR review (aspect entry point)

Targeted entry point over the specialist agents. For the full multi-lens review with a ship verdict (spec fit, security, simplicity, conventions), use `forge:code-review`; do not duplicate it here. Use `forge:security-review` for security-focused work.

## Invoke

Arguments: any of `comments tests errors types code simplify all` (default `all`), plus optional `parallel`. Example: "pr-review tests errors".

## Workflow

1. **Scope**: `git status`, `git diff --name-only` (and `git diff <base>...HEAD` for a branch); `gh pr view` if a PR exists. Parse requested aspects.
2. **Pick applicable agents**:

| Aspect | Agent | Runs when |
|---|---|---|
| code | `forge:code-reviewer` | always |
| tests | `forge:pr-test-analyzer` | test files changed (or conspicuously none) |
| comments | `comment-analyzer` | comments/docs added or changed |
| errors | `forge:silent-failure-hunter` | error handling, fallbacks, I/O changed |
| types | `forge:type-design-analyzer` | types/models added or changed |
| simplify | `code-simplifier` | after the others pass; it edits code, so run last and re-run tests |

An explicitly requested aspect always runs; skip an inapplicable one only under `all`, and say so.

3. **Dispatch**: spawn each as a subagent if your harness can (parallel when asked or when 3+ agents; sequential otherwise, which is easier to act on). Give each the diff scope and the repo's conventions file (CLAUDE.md / AGENTS.md). If you cannot spawn subagents, read the agent file and apply its checklist inline, one aspect at a time.
4. **Verify** each finding against the code before reporting; drop unverified ones.
5. **Aggregate**:

```markdown
# PR Review Summary
## Critical (must fix before merge)  - [agent]: issue [file:line]
## Important (should fix)            - ...
## Suggestions                       - ...
## Strengths                         - what is well done
## Recommended action
1. Fix critical  2. Address important  3. Consider suggestions  4. Re-run the affected aspects
```

## Tips

- Run early (before committing / opening the PR); agents analyze the diff by default.
- After fixes, re-run only the aspects that had findings.
- After review feedback arrives, use `forge:receiving-code-review`.
