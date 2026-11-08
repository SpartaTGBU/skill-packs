---
name: retro
description: "User-initiated retrospective, in one of two modes: a session retro that proposes changes to the agent's environment (checks, CLAUDE.md, skills, tooling) from what went wrong in a coding session, or a codebase retro that audits an existing slice, reconstructs past decisions and produces an evidence-backed gap register. Run only when the user asks (\"retro\", \"retrospective\", \"what went wrong\", \"audit this module\") or says yes to the end-of-session offer."
disable-model-invocation: true
---

# Retro

Pick the mode from the request:

- **Session retro:** "retro this session", "why did that take so long", "how do we stop this happening again". Improves the agent's environment.
- **Codebase retro:** "what did we miss in X", "audit this module", "we inherited this", "why is it like this, and should it stay?". Improves the code.

Not for team or sprint process retros: this audits sessions and code, not people.

## Session retro

### Steps

1. **Read the primary sources** for the session the user names (default: this one). Past Claude Code sessions are JSONL transcripts under `~/.claude/projects/<project-path-slug>/`; grep them for errors, retries, long tool outputs, and user corrections rather than reading whole files.
2. **Read the environment:** `CLAUDE.md` (repo and `~/.claude/`), any coding-standards doc, the repo's check commands (`package.json` scripts, Makefile, CI workflows, pre-commit config), and relevant skills.
3. **Find candidates** in these categories. Each needs a concrete moment from the session as evidence.

| Category | Look for | Typical fix |
|----------|----------|-------------|
| **Navigation** | Long searches for a file or fact; hidden dependencies between files | A one-line navigation pointer in CLAUDE.md or a doc |
| **Automated checks** | Mistakes a linter, type check, test, or file-layout check would catch; a check that exists but isn't wired or is silently broken; a repo with no guardrail at all (no pre-commit, no CI running lint/typecheck/test) | Wire or add the check |
| **Coding standards** | The reviewer missed something | **Mechanical** violation (banned API, import shape, file location): a deterministic check in the repo's linter, a hook, or CI. Only **judgment calls** go in a standards doc |
| **Steering bloat** | Large CLAUDE.md; rules that belong in standards or checks | Move them out; keep CLAUDE.md for pointers |
| **No-ops** | Instructions the agent already follows by default | Delete them |
| **Tool economy** | Expensive calls: huge outputs, repeated full-file reads, chatty custom tools | Narrower commands, output to file, better tool |
| **Information access** | A crucial fact wasn't reachable (server logs, a third-party dashboard) | Tee dev logs to a file, read-only access |

4. **Present** candidates in order of severity: what happened (with the moment), the proposed change, and the exact file it lands in. Apply only what the user approves. Use `forge:writing-skills` for any skill or CLAUDE.md wording.

### Placement rules

- **Implementation vs review.** The implementing agent carries the most context pressure (exploring, coding, debugging); the reviewer gets a diff. So standards are enforced at review (`forge:code-review`), not loaded into implementation.
- **CLAUDE.md** loads into every turn: use it sparingly, mostly for navigation pointers.
- **Standards doc** is read during review; split it behind pointers if it passes ~1,000 lines.
- **Docs** are reference reached by pointers; search for an existing one before writing a new one.
- **Skills** for reusable procedures whose description earns its always-loaded cost.
- Prefer building the check over writing the rule.

## Codebase retro

Slice-first: start from what the user cares about, not a whole-repo map. Every phase writes to disk so any session can resume.

**Artifacts** in `docs/retro/<slice>/` (or where the user prefers): `gap-register.md` (the state: perimeter, `Current phase:` marker, rows; the only file needed to resume), `baseline-audit.md`, `reconstructed-spec.md`, `target-design.md`.

### Phase 0: Pick the slice

| User names | Slice |
|------------|-------|
| A directory, module, service | That path plus its direct callers |
| A feature or flow | The files implementing it, traced from the entry point |
| A bug or pain point | The code that produced it plus one level of call chain |
| A dependency or tech choice | Everything touching it |
| Nothing | Propose the 2-3 highest-churn paths (`git log --format= --name-only \| sort \| uniq -c \| sort -rn \| head`); let them pick |

Budget roughly 15 files / 2,000 lines; split bigger picks into named sub-slices. Write the perimeter (paths, entry points, callers, blast radius) at the top of the register first.

### Phase 1: Present-state audit (no fixes)

1. Recon the slice: stack, entry points, tests, CI (`forge:codebase-onboarding`, scoped to the perimeter).
2. Run reviewer agents in parallel, each finding with `file:line`: the stack's reviewer (`forge:rust-reviewer`, `forge:go-reviewer`, `forge:python-reviewer`, or `forge:code-reviewer`), `forge:security-reviewer`, `forge:silent-failure-hunter`, `forge:type-design-analyzer` where types encode invariants, `forge:database-reviewer` for data access.
3. Snapshot: test count, coverage if configured, lint/CI status, TODO/FIXME/HACK inventory.

Write `baseline-audit.md`. Fixing during the audit corrupts the baseline.

### Phase 2: Reconstruct

1. **Behavioral spec** of what the code does today: requirements (WHEN -> THEN) and invariants, into `reconstructed-spec.md`.
2. **Git archaeology:** `git log --oneline -- <slice>` for age and cadence; largest and reverted commits (where design changed under pressure); churn hotspots; abandoned scaffolding.
3. **Decision inventory:** stack, data model, boundaries, error strategy, state management. Check each against ADRs, README, comments. An unrecorded decision is a gap for Phase 3.

### Phase 3: Gap register

| Axis | Question |
|------|----------|
| Thinking | What was decided but never recorded? Which invariants live only in code? |
| Coding practice | Where does it diverge from good practice? Spec items with no test? |
| Missing features | What would a day-one build have had: input validation at boundaries, observability, idempotency, migrations with rollback, a11y, CI gates? |
| Technology | Is a dependency outdated, duplicated, risky, or fighting the codebase? |

```markdown
| ID | Axis | Gap | Evidence | Forward fix | Severity | Effort | Status |
|----|------|-----|----------|-------------|----------|--------|--------|
| G-001 | practice | Errors swallowed in retry loop | src/api/retry.ts:42 | Propagate, map at boundary | P1 | S | open |
```

Severity: P0 security/data loss, P1 correctness, P2 practice/observability, P3 cleanup. Effort: S (<1 session), M (few), L (own plan). Every row needs evidence; a gap you can't point at is an opinion.

### Phase 4: Decide

1. For P0/P1 rows, write `target-design.md` (consider the `forge:architect` agent or `forge:architecture`): target shape, fix sequence, and an explicit "what does not change" list.
2. Backfill ADRs for undocumented decisions, marked `proposed (reconstructed)` with the retro date; separate observed history from inferred intent; the owner confirms before `accepted`. Never present one as written at decision time.
3. Triage every row: `fix-forward`, `rewrite`, or `wont-fix` with a recorded reason.
4. Sequence: P0 first, then interleave quick wins with larger repairs. Get approval before rewrites, tech replacements, or migrations, and use the project's existing task system if it has one.

### Phase 5: Fix forward

One row at a time: scope it (`forge:writing-plans` for M/L), `forge:tdd` (the first test usually encodes the missing invariant from the reconstructed spec), implement per `forge:ponytail`, `forge:code-review`, commit, mark the row done. Hand off between sessions with `forge:handoff`, pointing at the register.

### Phase 6: Re-audit

When every row is done or wont-fix: rerun Phase 1 on the same perimeter, diff against the baseline, verify claimed closures with evidence (`forge:verification`), record the delta at the bottom of the register. Resurfaced gaps become new rows.

### Resuming

Read `gap-register.md`: a row in-progress -> Phase 5; rows open, none in progress -> the `Current phase:` marker; all closed -> Phase 6; no register but a baseline -> Phase 2; nothing -> Phase 0.
