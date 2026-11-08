---
name: handoff
description: "User-initiated: compacts the current session into a handoff document a fresh agent can pick up cold, and optionally launches that agent. Run only when the user asks (\"handoff\", \"write a handoff\", \"hand this off\", \"continue in a new session\", or to pass work to another agent or person)."
disable-model-invocation: true
argument-hint: "What will the next session focus on?"
---

# Handoff

Write the minimum a fresh agent needs to continue the work without this conversation, and nothing it can find on its own.

If the user passed arguments, treat them as the focus of the next session and tailor the document to it: drop threads that don't serve that focus.

## Where it goes

Save to the OS temp directory, not the workspace: `${TMPDIR:-/tmp}/handoff-<short-slug>-<YYYYMMDD-HHMM>.md` (`%TEMP%` on Windows). If a plan ledger exists (`forge:executing-plans`), the handoff points at it rather than restating it. Print the path when done.

## Gather first

- `git status`, `git branch --show-current`, `git log --oneline -10`, and whether there are uncommitted or unpushed changes.
- Paths of the artifacts already holding the truth: spec, plan, ledger, ADRs, issues/PRs, test logs.
- The last command run and its result, if the work is mid-verification.

## Template

```markdown
# Handoff: <task in a few words>

## Goal
<One or two sentences: what done looks like, in the user's terms.>

## State
- Branch/worktree: <branch> at <path>; uncommitted: <yes/no, what>; pushed: <yes/no>
- Done: <bullets, each with a commit SHA or file path as evidence>
- In progress: <the exact step underway and how far it got>
- Last verification: `<command>` -> <result>

## Next steps
1. <first concrete action, with file/command>
2. ...

## Decisions and constraints
- <decision> — <why> (the reasoning a newcomer would otherwise re-litigate)
- <constraint the user stated that isn't written anywhere else>

## Dead ends
- <approach tried> — <why it failed> (so it isn't retried)

## Open questions
- <question for the user, or unknown still to resolve>

## Pointers
- Spec: <path>  Plan: <path>  Ledger: <path>  Issue/PR: <url or #>

## Suggested skills
- forge:<name> — <why it applies next>
```

## Rules

- **Reference, don't duplicate.** Anything already in a spec, plan, ledger, ADR, issue, commit, or diff gets a pointer, not a copy.
- **Evidence over assertion.** "Tests pass" needs the command and result; "done" needs a SHA or path.
- **Include what only this conversation knows:** the user's stated preferences, rejected options and why, dead ends, verbal decisions.
- **Redact** API keys, tokens, passwords, connection strings, and personal data. Write `<REDACTED>`; name the env var instead.
- **Suggested skills** names the forge skills the next agent should load (e.g. `forge:executing-plans` to resume a plan, `forge:debugging` for an open bug, `forge:verification` before claiming done).
- Keep it scannable: a newcomer should be acting within a minute of reading it. Cut narrative and history.

## Launching the next agent (only if asked)

- **Background subagent in this session:** Agent tool with the handoff file's path in the prompt ("Read <path> first; it is your brief"), `run_in_background: true`, and a descriptive `description`.
- **New Claude Code session:** tell the user to run `claude "$(cat <path>)"` in the repo, which seeds a fresh interactive session with the handoff as the first prompt. Passing the file through `cat` keeps the shell from expanding backticks or `$` inside it. If their installed CLI supports background sessions (check `claude --help`), offer that instead, with a descriptive session name.

Since the handoff may become another agent's prompt, re-check redaction before launching.
