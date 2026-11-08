---
disable-model-invocation: true  # skl: on-demand pack skill
name: tdd
description: Test-first red-green-refactor loop that produces small tests worth keeping, with the minimum code to pass each one. Use when implementing a feature, fixing a bug, or changing behavior in non-trivial logic (a branch, loop, parser, money, security, data writes), when the user says "TDD", "test first", or "red-green-refactor", or when a plan step says to write a failing test.
---

# Test-Driven Development

Write the test. Watch it fail. Write the least code that makes it pass. Repeat.

**Core rule:** if you never watched the test fail, you do not know it tests anything.

How the green code is written is governed by `forge:ponytail`: reuse before writing, stdlib and existing deps first, no speculative abstraction, finish every caller the change touches. This skill only governs the loop.

## When it applies

Scale the loop to the change:

| Change | Test |
|--------|------|
| Trivial: rename, copy text, config value, one-line wiring, pure deletion | None. Run the existing suite. |
| Non-trivial logic: a branch, loop, parser, money, security, data write, new script | One small test at the seam, written first. |
| Bug fix | A failing test that reproduces the bug, written first (see `forge:debugging`). |
| Throwaway prototype, generated code, pure config | None; say so (ask first if unsure). Production code built from the prototype starts at RED. |

"Trivial" is a property of the change, not of your confidence. If it has a branch, it is not trivial.

## The loop

One slice at a time: one behavior, one test, one minimal implementation. Never write all the tests first and then all the code (horizontal slicing tests imagined behavior). Each test is a tracer bullet that responds to what the last cycle taught you.

### 1. Pick the seam

A **seam** is the public boundary where you can observe behavior without reaching inside: the function callers use, the route, the CLI, the emitted query. Test there, never against internals or private methods. On multi-seam work, state the seams you intend to test in one line each (what it catches, what it misses) and confirm with the user before writing tests at them.

### 2. RED: write one failing test

- One behavior; the name says what should happen ("rejects empty email"), not how.
- Before writing the body, **name the break**: what production change would make this test fail? Can't name one: you are testing nothing; pick an observable behavior.
- Expected values come from an independent source: a literal, a worked example, the spec. Never recompute the expectation with the code under test (`expect(add(a,b)).toBe(a+b)` passes by construction).
- Real code over mocks. Mock only at system boundaries: external APIs, time, randomness, sometimes the DB or filesystem. Never mock your own modules.

### 3. Verify RED: watch it fail (mandatory)

Run the single test. Confirm:

- It **fails**, not errors, or it fails at compile time *because* the new code path is missing (a valid compile-time RED).
- The failure message is the one you expected.
- It fails because the behavior is missing, not because of a typo, bad import, or broken setup.

A test that passes immediately is testing existing behavior or nothing: fix the test. A test that was written but never run is not RED.

### 4. GREEN: the minimum code

Write the simplest code that passes this test and nothing more (hardcoding the return value is legitimate when the next test will force the generalisation), following `forge:ponytail`'s ladder: does it need to exist, does the codebase already have it, does the stdlib, does an installed dep, can it be one line, otherwise the minimum. No options, parameters, or hooks the test does not demand.

```typescript
// GREEN for "retries 3 times": enough
async function retry<T>(fn: () => Promise<T>): Promise<T> {
  for (let i = 0; ; i++) {
    try { return await fn(); } catch (e) { if (i === 2) throw e; }
  }
}
// Not GREEN: adding { maxRetries, backoff, onRetry } nobody tested or asked for.
```

### 5. Verify GREEN

Run the test: it passes. Then run the project's real test command (bare `pytest`, `npm test`, `cargo test`, `go test ./...`), not just your file. Output pristine: no new warnings. Test fails: fix the code, not the test. Another test fails: fix it now. Any failure you saw, even one you did not cause, goes in your report by name.

### 6. REFACTOR (optional, only while green)

Remove duplication you just created, fix names. Rerun after each edit. Refactor never adds behavior, never adds an abstraction "for later", never touches code outside the change. If nothing needs cleaning, skip it. Broader cleanup belongs to review (`forge:code-review`), not to the loop.

### 7. Next slice

Next behavior, next failing test. Stop when the task's behaviors are covered, not when coverage looks high. One good test per risky behavior beats a coverage number.

## Good tests

| Quality | Good | Bad |
|---------|------|-----|
| Behavior | "user can check out with a valid cart" | "checkout calls paymentService.process" |
| Interface | Verifies through the public API (`getUser(id)` after `createUser`) | Queries the DB directly to verify |
| Independent | Literal expected values | Expected value built by the code's own helper |
| Focused | One behavior; "and" in the name means split | `validates email and domain and whitespace` |
| Real | Asserts on the component | Asserts a `*-mock` element exists |

- **Survives refactors:** breaks only when behavior breaks.
- **No change detectors:** don't assert a constant's value or exact wording; assert the behavior that depends on it ("the 6th attempt never happens", not `MAX_RETRIES === 5`).
- **Your code, not the framework:** test the contract you own, not that the router calls a registered handler.
- **Mocks mirror reality:** a mock response has the full real shape; learn the real method's side effects before replacing it, and keep the ones the test relies on real.
- **No test-only methods in production classes:** cleanup helpers live in test utilities.
- **Wait on conditions, not sleeps:** poll for the state you need with a timeout (`waitFor(() => job.done)`); a fixed sleep is only right when testing timing itself, with a comment saying why.

**Mutation check before finishing:** mentally break the code (wrong constant, wrong branch, missing side effect, empty return, missing validation for empty/zero/null/unauthorized). At least one test should fail for each realistic mutation. One that survives marks an unprotected behavior or a tautological test.

## Red flags: stop and restart the slice

- Production code written before its test. Delete it and start from RED; don't keep it "as reference".
- The test passed on first run.
- You can't say why the test failed.
- "I'll add tests after", "I already tested it manually", "too simple to test" for code with a branch.
- The test asserts on a mock, or mock setup is more than half the test.
- GREEN added a parameter, option, or class the test does not exercise.

| Excuse | Reality |
|--------|---------|
| "Tests after give the same result" | Tests written after pass immediately and prove nothing; they check what the code does, not what it should do. |
| "Deleting this work is wasteful" | Sunk cost. Code you can't trust is the waste. |
| "Need to explore first" | Fine: explore, throw it away, start at RED. |
| "Hard to test" | Hard to test means hard to use. Simplify the interface. |
| "Must mock everything" | Too coupled. Inject the boundary dependency. |

## When stuck

- Don't know how to test it: write the call you wish existed and the assertion first.
- Test setup is huge: the design is too complicated; simplify the interface before adding helpers.
- No seam reaches the bug: that is a finding; say so instead of writing a shallow test (see `forge:debugging`).

## Evidence

When reporting a slice or task done, include:

- **RED:** the command, the relevant failing output, why that failure was expected.
- **GREEN:** the command and passing output for the test and the full suite.

Claims of "tests pass" without this output are not done; see `forge:verification`.
