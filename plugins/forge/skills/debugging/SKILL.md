---
disable-model-invocation: true  # skl: on-demand pack skill
name: debugging
description: "Root-cause debugging loop: build a tight reproduction, minimise it, test ranked hypotheses, then fix once at the source with a regression test. Use when a test fails, something throws, crashes, hangs, is flaky, slow, or behaves unexpectedly, when a build or CI breaks, when the user says \"debug\", \"diagnose\", or \"why is this broken\", and especially after a first fix attempt failed."
---

# Debugging

**Iron law: no fix without a root cause.** Symptom patches are failures that haven't surfaced yet.

The fix itself follows `forge:ponytail`: before editing, grep every caller of the function you touch, then fix the root cause **once, in the shared code**, not at each call site.

Simple bugs have root causes too; the process is fast when the bug is simple. Use it hardest when under time pressure, when a "quick fix" looks obvious, or when a previous fix didn't work.

## Redact first

Show commands and output, but replace every secret with `<REDACTED>`. Drive loops from env vars so credentials stay in the environment. From captured requests or logs, quote only the lines that carry the signal.

## Phase 1: Build a feedback loop

This is most of the work. With a **tight, red-capable** loop the cause will fall out; without one, staring at code won't save you. Spend effort here aggressively and creatively.

First, read the evidence you already have: the full error and stack trace (line numbers, codes), and what changed recently (`git log`, `git diff`, dependency or config changes, environment differences).

Ways to build a loop, roughly in order:

1. A failing test at whatever seam reaches the bug (unit, integration, e2e).
2. A curl/HTTP script against a running dev server.
3. A CLI invocation with a fixture input, diffed against known-good output.
4. A headless browser script asserting on DOM, console, or network.
5. Replay a captured payload, request, or event log through the code path in isolation.
6. A throwaway harness that calls the buggy path with one function call.
7. A property/fuzz loop: many random inputs, look for the failure.
8. A bisection harness: `git bisect run <check>` between a good and bad commit.
9. A differential loop: same input through old vs new version or two configs; diff outputs.
10. Last resort, human in the loop: a small bash script that prints one instruction at a time (`read -p`) and echoes the human's observations as `KEY=value` lines you can parse.

**Tighten it:** faster (skip unrelated setup, narrow scope), sharper (assert the exact symptom, not "didn't crash"), deterministic (pin time, seed RNG, isolate filesystem and network).

**Flaky bugs:** aim for a higher reproduction rate, not a clean repro. Loop the trigger 100x, parallelise, add load, narrow timing windows. 50% is debuggable; 1% is not.

**Test pollution** (a file or state appears during the suite but not one test): run test files one at a time, checking for the artifact after each, and stop at the first that creates it.

**Can't build a loop:** stop and say so. List what you tried and ask for access to the reproducing environment, a redacted artifact (log, HAR, core dump, recording), or permission for temporary instrumentation. Do not hypothesise without a loop.

**Done when** you can name one command you have already run that drives the real bug path, goes red on the user's exact symptom, gives the same verdict every run, runs in seconds, and runs unattended.

## Phase 2: Reproduce and minimise

- Confirm the loop shows the failure the **user** described, not a nearby different one. Wrong bug, wrong fix.
- Capture the exact symptom (message, wrong value, timing) to verify the fix against later.
- Shrink: cut inputs, callers, config, data, steps one at a time, rerunning after each. Done when every remaining element is load-bearing (removing any one turns the loop green).

## Phase 3: Find the source

**Trace backward.** Bugs surface deep in the stack; the cause is usually upstream. From the failing line, ask what called it and with what value, and keep climbing until you reach where the bad value originated. When you can't trace by reading, log right before the failing operation with the inputs, `cwd`, relevant env, and a stack (`new Error().stack`, `traceback.print_stack()`); in tests write to stderr so the runner doesn't swallow it.

**Compare with working code.** Find similar code in the same codebase that works. If you're following a pattern or reference implementation, read it completely. List every difference between working and broken, however small; don't assume one "can't matter". Check what config, environment, and assumptions the broken path depends on.

**Rank hypotheses.** Write 3-5 falsifiable hypotheses before testing any: "If X is the cause, changing Y makes the bug disappear / changing Z makes it worse." A hypothesis with no prediction is a vibe; sharpen or drop it. Show the ranked list to the user; they often re-rank instantly ("we just deployed #3"). Don't block on an answer if they're away.

## Phase 4: Instrument and test hypotheses

- Each probe maps to one prediction. Change one variable at a time.
- Prefer a debugger or REPL breakpoint; else targeted logs at boundaries that distinguish hypotheses. Never "log everything and grep".
- Multi-component systems (CI -> build -> deploy, API -> service -> DB): log what enters and exits each boundary once, find the layer where good data turns bad, then dig only there.
- Tag every debug line with a unique prefix like `[DEBUG-a4f2]` so cleanup is one grep.
- **Performance:** logs mislead. Establish a baseline measurement (timer, profiler, query plan), then bisect. Measure first, fix second.
- Hypothesis wrong: form a new one from what you learned. Never stack another change on a failed one.
- Say "I don't understand X" when true. Don't pretend.

## Phase 5: Fix and regression test

1. **Find the seam.** A correct seam exercises the real bug pattern as it occurs at the call site. If the only available seam is too shallow (single caller when the bug needs several, a unit that can't replicate the chain), say so: that is a finding about the architecture, not a reason to write a test that gives false confidence.
2. **RED:** turn the minimised repro into a failing test at that seam and watch it fail (`forge:tdd`).
3. **Grep every caller** of what you're about to change. Fix the root cause once in the shared code. No "while I'm here" changes, no bundled refactors.
4. **GREEN:** watch the test pass, run the full suite, and rerun the Phase 1 loop on the original un-minimised scenario.
5. **Defense in depth (only where it pays):** if bad data crossed several layers, add validation at the trust boundary where it entered, and a guard before any dangerous operation (e.g. refuse filesystem writes outside a temp dir in tests). Don't scatter checks through every layer by default.

**Truly external or timing-dependent cause:** document what you investigated, add appropriate handling (retry, timeout, clear error) and logging. Most "no root cause" verdicts are incomplete investigations; be sure first.

**Delegating investigation:** a subagent briefed to investigate gets the full error, the failing path, and the exact test command, and is told to report findings and the proposed root cause, not to fix.

## Three failed fixes: stop

Count fix attempts. After two failures, return to Phase 1 with what you learned. After three, stop fixing: each fix revealing a new problem elsewhere, or needing a large refactor, signals a wrong design, not a wrong hypothesis. Bring it to the user with the evidence, and consider `forge:architecture`.

## Phase 6: Clean up

- [ ] Original repro no longer reproduces (Phase 1 loop rerun).
- [ ] Regression test passes, or the missing seam is documented.
- [ ] All `[DEBUG-...]` lines removed (grep the prefix).
- [ ] Throwaway harnesses deleted or clearly marked.
- [ ] The confirmed root cause is stated in the commit or PR message.
- [ ] Completion claimed with evidence (`forge:verification`).

## Red flags: back to Phase 1

- "Quick fix now, investigate later" / "just try changing X".
- Several changes at once, then rerun.
- Proposing fixes before tracing the data flow.
- Adapting a reference pattern you only skimmed.
- Fixing the symptom at the call site that crashed instead of the source.
- "One more attempt" after two failures.
- User signals: "Is that actually happening?", "stop guessing", "we're stuck?" mean you skipped evidence.

| Excuse | Reality |
|--------|---------|
| "Emergency, no time for process" | Guess-and-check thrashing is slower than a loop. |
| "I see the problem" | Seeing the symptom isn't knowing the cause. |
| "I'll add the test after the fix works" | Untested fixes don't stick; the failing test proves the fix. |
| "Multiple fixes at once saves time" | You won't know which one worked or which one broke something. |
