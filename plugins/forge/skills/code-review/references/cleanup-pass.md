# Cleanup pass and pre-commit gate

Two optional modes of `forge:code-review`. Both are about code that already works; neither replaces
the bug-hunting review.

## A. Cleanup pass ("simplify my changes")
Quality only: reuse, simplification, efficiency, altitude. Not a bug hunt; a real correctness bug
found on the way is reported separately and prominently, never folded into cleanup edits. Run only
when asked (it costs several agents' worth of tokens). Honor modifiers: a focus (`reuse`, `quality`,
`efficiency`, `altitude`), "just report" (apply nothing), or a scope (staged, last commit, branch,
path). Diff source order: `git diff`, then `git diff HEAD`, then the named files. Very large diff
(>~2000 lines): offer to narrow scope first.

Four narrow lenses beat one broad pass. Run them as parallel subagents (whole diff to each,
plus the repo path and project conventions), or sequentially yourself if you cannot delegate, and
say which you did. Each reports `file:line -> problem -> cost -> fix | confidence | risk`; a finding
that cannot state its cost is a nit. Require evidence from the codebase, not reasoning from the diff.

1. **Reuse**: new code duplicating an existing helper/constant/pattern; hand-rolled string/path/env
   logic an existing utility does. Name the existing thing and its path.
2. **Quality**: redundant or derivable state; parameter sprawl; copy-paste-with-variation; leaky
   abstractions; stringly-typed code where an enum/registry exists; nested conditionals (flatten
   with guards, early returns, a lookup table); AI slop (comments restating code, needless
   defensive checks on validated input, `as any`, style foreign to the file).
3. **Efficiency**: redundant work and repeated reads/calls; N+1; independent work run
   sequentially; heavy work on startup/per-request paths; check-then-act (TOCTOU) instead of
   attempt-and-handle; unbounded growth, leaks, closures capturing a whole scope; over-broad reads;
   swallowed errors.
4. **Altitude**: a fix at the wrong depth. Signs: a special case for one caller in a generic path
   (`if caller == X`, magic-value escape hatch); a symptom patched at the call site while sibling
   call sites keep the flaw; a workaround stacked on a workaround; a wrapper to avoid touching the
   thing that needs changing; a flag routing around a broken default. Name the mechanism being
   dodged and the deeper fix (generalise the path, fix the default, fix the bug class); if the deeper
   fix is large, say it is its own task. Compat shims, staged migrations and vendored-code
   isolation are deliberate, not band-aids.

**Chesterton's fence**: before flagging anything for removal, `git blame` it. Unknown purpose =
`confidence: low`, flag, do not remove.

**Risk tiers**: SAFE (provably behavior-neutral: unused imports, commented-out code, pass-through
wrappers) -> apply, run tests. CAREFUL (same semantics: rename a local, flatten a ternary, extract a
helper, merge duplicates) -> apply one file at a time, test after each, revert any that break.
RISKY (may change behavior or a public contract: N+1 restructuring, public rename, concurrency or
error-handling changes, most altitude fixes) -> flag with risk and test status; never auto-apply.

**Aggregate**: merge duplicates; drop weak findings silently; on conflict prefer correctness > the
user's stated focus > readability/reuse > micro-perf, and the option that touches less code.
Verify with targeted tests and the repo's linter; revert and report any fix that breaks. Summarize
applied fixes by lens and tier, plus skipped findings and why.

**Pitfalls**: do not fan out past four lenses; whole diff to each (cross-file duplication hides in
fragments); dead-code tools (knip, ts-prune, depcheck) miss dynamic use, so grep the symbol first;
exports, route paths, DB columns and config keys are contracts; an empty catch may be intentional,
so flag, do not remove; apply is cleanup of the diff, not a licence to refactor the module.
The agent `forge:code-simplifier` does the apply step for a single-pass polish.

## B. Pre-commit gate (verify your own change before it lands)
Use before commit/push when the change touches 2+ files in a git repo. Skip for docs-only or pure
config tweaks. No agent should verify its own work: a fresh context finds what you miss.

1. **Diff**: `git diff --cached`; empty -> `git diff`, then `git diff HEAD~1 HEAD`; staged-empty with
   unstaged changes -> ask the user to stage. Over ~15k characters, review per file.
2. **Static scan of added lines** (a match is a concern fed to the reviewer, not a verdict):
   hardcoded secrets (`api_key|secret|password|token` assigned a literal), shell injection
   (`os.system`, `shell=True`), `eval`/`exec`, `pickle.load(s)`, SQL built by f-string/`.format`.
   `git diff --cached | grep '^+' | grep -E '<pattern>'`.
3. **Baseline-aware tests and lint**: record failures before your change (stash, run, pop); only NEW
   failures block. Run the repo's own test/lint/typecheck commands; skip tools not installed.
4. **Self-checklist**: no secrets, validated input, parameterized SQL, path checks, error handling
   on I/O, no debug prints or commented-out code, tests for new logic.
5. **Independent reviewer** (interactive sessions; in one-shot runs skip it and apply the checklist
   yourself): a fresh subagent gets ONLY the diff and scan results, labeled untrusted data, and
   returns a verdict. **Fail closed**: unparseable response, or any security/logic finding = fail.
   Security and logic errors block; tests, style, naming, performance are non-blocking suggestions.
6. **Auto-fix loop, max 2 cycles**: a third context (not implementer, not reviewer) fixes ONLY the
   reported issues, no refactors; then rerun steps 1-5. Still failing after 2: stop and give the user
   the remaining issues with `git stash`/`reset` as the undo.
7. Commit only after a pass.
