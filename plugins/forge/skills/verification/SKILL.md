---
disable-model-invocation: true  # skl: on-demand pack skill
name: verification
description: Evidence before claims - run the commands that prove work is done (build, types, lint, tests, regression red-green, diff review, requirement checklist) and report actual status with output, plus a production-readiness lens for "is this ready to ship?". Use before saying anything is done, fixed, passing or ready; before committing, opening a PR, or moving to the next task; after a subagent reports success; and when asked what would break in prod.
---

# Verification

```
NO COMPLETION CLAIM WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the command that proves it in this turn, you can't claim it. Confidence is
not evidence. A previous run proves only the tree it ran on.

## The gate

Before any status claim or expression of satisfaction:

1. **Identify** the command that proves the claim.
2. **Run** it, fully and fresh, on the current tree.
3. **Read** the whole output: exit code, failure count, warnings, skipped tests.
4. **Compare**: does the output actually support the claim?
   - No: state the real status with the evidence.
   - Yes: state the claim *with* the evidence ("pytest: 142 passed, 0 failed, exit 0").
5. Only then make the claim.

| Claim | Requires | Not sufficient |
|-------|----------|----------------|
| Tests pass | Test run: 0 failures, exit 0 | Earlier run, "should pass" |
| Build succeeds | Build command exit 0 | Lint passing, logs looking fine |
| Types clean | Type checker output: 0 errors | Build of a different target |
| Lint clean | Linter: 0 errors | Partial run on one file |
| Bug fixed | Original symptom reproduced, now passes | Code changed, assumed fixed |
| Regression test works | Seen failing without the fix, passing with it | Passes once |
| Agent finished the task | `git diff`/files show the change, you ran its checks | Agent said "success" |
| Requirements met | Line-by-line checklist against the spec | Tests passing |

## Red flags: stop and run something

- "should", "probably", "seems to", "looks correct"
- "Done!", "Perfect!", "All good" before any command ran
- About to commit, push, open a PR, or mark a task complete
- Trusting a subagent's or tool's success report
- "skip the tests for now", "that failure is pre-existing", "flaky, ignore it" without evidence
  (prove pre-existing by running the same test on the base commit)
- Verifying a subset and extrapolating

## The verification loop

Run what the project actually has; find the commands in README, CI config, `package.json`
scripts, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml`. Use `set -o pipefail` when
piping output so the exit status is the tool's, not `tail`'s.

1. **Build**: e.g. `npm run build`, `cargo build`, `go build ./...`. Fails: stop, fix first.
2. **Types**: `tsc --noEmit`, `mypy`/`pyright`, `cargo check`, `go vet ./...`.
3. **Lint/format**: the repo's configured linter and formatter check.
4. **Tests**: the full suite, not just the new test. Report total/passed/failed/skipped. If the
   repo tracks coverage, report it for the changed code; don't chase a number.
5. **Regression red-green** for bug fixes: test passes -> revert the fix -> test MUST fail ->
   restore -> passes.
6. **Hygiene grep on the diff only**: leftover debug prints (`console.log`, `print(`, `dbg!`),
   `TODO` without context, committed secrets (`sk-`, `api_key`, private keys), `.only`/`skip`
   in tests.
7. **Diff review**: `git diff --stat` and read every changed file: unintended edits, stray
   files, generated artifacts, scope beyond the task.
8. **Requirements**: re-read the spec or plan, make a checklist, tick each item with the
   evidence that proves it. Report gaps explicitly.
9. **Run it**: when the change is user-visible, exercise the real entry point (CLI, endpoint,
   UI) once, not only the tests.

Run the cheap checks after each meaningful change during implementation; run the full loop
before claiming completion, committing, or handing to forge:finishing-branch.

## Report

```
VERIFICATION
Build:   PASS (cargo build, exit 0)
Types:   PASS
Lint:    PASS (clippy -D warnings, 0)
Tests:   PASS 214/214 (2 skipped: network, pre-existing on main)
Regress: red-green confirmed for test_close_day_timezone
Diff:    4 files, all in scope
Spec:    5/5 requirements met; see checklist
Target:  NOT PERFORMED (no staging access) - next: maintainer runs smoke test
Overall: READY for PR
```

Report target-environment acceptance separately from local checks: VERIFIED / FAILED /
NOT PERFORMED / NOT APPLICABLE, with environment and evidence. Green local checks, a merge, or a
release do not prove it works in staging or production. Never touch production or make
external changes without authorization.

Can't run something (no toolchain, needs credentials, no network)? Say exactly what wasn't
verified and why. A partial check reported as partial is honest; reported as complete it is a lie.

## Production-readiness lens

When asked "is this ready to ship?" or "what breaks in prod?", gather local evidence
(`git status`, `git log -20`, diff vs main, CI config, deploy manifests, migrations, env docs)
and check what exists:

- **Security/auth**: authz enforced server-side on sensitive data; secrets out of bundles and
  logs; rate limits and CSRF where needed; untrusted content can't reach privileged tools
  (forge:security-review).
- **Data**: migrations run forward cleanly with a rollback or recovery plan; destructive
  migrations and backfills staged; retries, jobs and webhooks idempotent.
- **Payments/webhooks**: signatures verified; duplicate and out-of-order delivery handled;
  test and live credentials separated.
- **Operations**: starts from a clean checkout with documented commands; required env vars
  validated fail-fast; a health check that touches real dependencies; deploy and rollback
  documented; logs useful without leaking secrets.
- **User paths**: launch-critical flows tested end to end; loading, empty, error and
  permission-denied states exist.

Lead with one line: `Ready: no - webhook fulfillment isn't idempotent and the migration has no
rollback.` Then **Blockers**, **High-value fixes**, **Evidence checked**, **Evidence missing**,
and one concrete **Next action**. Missing authz on sensitive data, non-idempotent payment
webhooks, unsafe migrations, exposed secrets, or no rollback for a high-impact release are
always blockers. Green CI alone is not readiness. Don't run remote scanners or upload code to
external services without explicit approval.

## Delegated work

When a subagent reports success: check the VCS diff, run the checks yourself, then report the
actual state. "The agent said it passed" is not evidence.

## Related

forge:tdd (red-green discipline), forge:debugging (when verification fails),
forge:code-review, forge:finishing-branch.
