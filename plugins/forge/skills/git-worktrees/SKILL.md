---
disable-model-invocation: true  # skl: on-demand pack skill
name: git-worktrees
description: Sets up an isolated git workspace (Claude Code's native worktree tools first, `git worktree` as fallback) with dependencies installed and a verified clean test baseline. Use when starting feature work that should not touch the current branch, before executing a plan, when running parallel agents that write code, or when the user asks for a worktree, a sandbox branch, or isolation.
---

# Git Worktrees

Detect existing isolation first, then use the harness's native tools, then fall back to plain git. Never fight the harness.

## Step 0: Already isolated?

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
git branch --show-current
git rev-parse --show-superproject-working-tree   # prints a path => submodule
```

- `GIT_DIR != GIT_COMMON` and not a submodule: already in a linked worktree. Don't create another; go to Step 2. Report "Already isolated at `<path>` on `<branch>`" (or "detached HEAD; a branch is needed at finish time").
- Otherwise you're in a normal checkout (a submodule counts as normal).

In a normal checkout, honor any stated preference (CLAUDE.md, the user's instructions). If none, ask once: "Set up an isolated worktree? It keeps your current branch untouched." Declined: work in place, go to Step 2. Never implement on main/master without consent either way.

## Step 1: Create

### 1a. Native tools (preferred)

Claude Code provides:

- **`EnterWorktree` / `ExitWorktree`** tools for the current session (load via ToolSearch if deferred).
- **`isolation: "worktree"`** on the Agent tool, giving a subagent its own worktree, auto-cleaned if it made no changes. Use this for parallel writers (`forge:parallel-agents`).

Native tools own placement, branching, and cleanup. Running `git worktree add` while one is available creates state the harness can't see or clean up.

### 1b. Git fallback (no native tool)

Pick the directory, first match wins:

1. A location named in the user's instructions.
2. Existing `.worktrees/` (preferred) or `worktrees/` in the repo root.
3. Default: `.worktrees/`.

A project-local directory **must** be ignored, or the worktree gets committed into the repo:

```bash
git check-ignore -q .worktrees || { echo '.worktrees/' >> .gitignore; git add .gitignore; git commit -m "chore: ignore .worktrees"; }
```

Create and enter:

```bash
git worktree add ".worktrees/$BRANCH" -b "$BRANCH"   # branch from current HEAD
cd ".worktrees/$BRANCH"
```

Permission/sandbox error: tell the user worktree creation was blocked and continue in the current directory.

## Step 2: Project setup

Install dependencies the way the project already does (lockfile decides the tool):

| Marker | Command |
|--------|---------|
| `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` / `bun.lock*` | `npm ci` / `pnpm install` / `yarn install` / `bun install` |
| `Cargo.toml` | `cargo build` |
| `uv.lock` / `poetry.lock` / `requirements.txt` | `uv sync` / `poetry install` / `pip install -r requirements.txt` |
| `go.mod` | `go mod download` |

Prefer a documented setup script (`Makefile`, `justfile`, README) when one exists. Untracked files like `.env` don't come along to a new worktree; copy them only if the user agrees.

## Step 3: Verify a clean baseline

Run the project's test command. A dirty baseline makes every later failure ambiguous.

- Passing: report ready.
- Failing: report the failures and ask whether to proceed or investigate. Don't silently start on red.

```
Worktree ready at <full path> on <branch>
Baseline: <N> tests, 0 failures
```

## Cleanup

When work is merged or abandoned (see `forge:finishing-branch`): `ExitWorktree` for native sessions; otherwise `git worktree remove <path>` then `git branch -d <branch>` if merged. `git worktree prune` clears stale entries. Never delete a worktree with uncommitted work without asking.

## Quick reference

| Situation | Action |
|-----------|--------|
| Already in a linked worktree | Skip creation |
| In a submodule | Treat as normal repo |
| Native tool available | Use it |
| No native tool | `git worktree add` in an ignored dir |
| Directory not ignored | Add to `.gitignore` and commit first |
| Sandbox blocks creation | Say so; work in place |
| Baseline tests fail | Report, ask |

| Excuse | Reality |
|--------|---------|
| "Obviously not in a worktree" | Harness isolation and submodules fool eyeballing. Run Step 0. |
| "`git worktree add` is quicker" | It creates state the harness can't manage. |
| "Surely it's ignored" | Run `git check-ignore`. |
| "Baseline can wait" | Then you can't tell your breakage from what was already there. |
