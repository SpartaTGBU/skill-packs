---
disable-model-invocation: true  # skl: on-demand pack skill
name: finishing-branch
description: Finish a development branch - verify the suite on the final tree, clean up commits with messages matching repo convention, then let the user choose merge locally, push and open a PR (with an evidence-first PR body), or keep as-is; handles worktree cleanup and never discards or force-pushes without explicit confirmation. Use when implementation is complete and reviewed, when the user says "wrap up", "open a PR", "merge this", "write the PR description", or after the last task of a plan.
---

# Finishing a Branch

Verify -> tidy commits -> detect environment -> present options -> execute the choice ->
clean up. Integration is the user's decision; present options and wait.

## 1. Verify

Run the full suite and build on the tree you are about to integrate (forge:verification). Tests
passing earlier in the session prove nothing about this tree.

Failing: report the failures and stop. The options menu comes after a green suite. If
forge:code-review hasn't been run on a multi-file change, run it now and fix Must-fix items.

## 2. Tidy commits

- `git status` clean? Uncommitted work: ask whether it belongs in this branch.
- Read the convention: `git log --no-merges --format=%s -30`. Match it: conventional prefix
  (`feat|fix|docs|refactor|perf|test|build|ci|chore`) and scope only if the repo uses them,
  subject length from the history (don't assume 50), imperative mood, no trailing period.
- Body only when the *why* isn't obvious from the diff. Breaking change: `type(scope)!:` plus a
  `BREAKING CHANGE:` footer with the migration. Issue refs in the footer (`Closes #482`).
- One concern per commit. A diff mixing a fix, a refactor and a dependency bump should be split.
- Squashing or rewording local, unpushed commits is fine with the user's OK. Never rebase or
  rewrite history that's been pushed and shared; never commit secrets or generated artifacts.
- Commit only within the user's authorization; otherwise present the message and ask.

## 3. Detect the environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)   # capture now; step 6 changes directory
```

| State | Menu | Cleanup |
|-------|------|---------|
| `GIT_DIR == GIT_COMMON` (normal repo) | 3 options | none |
| linked worktree, named branch | 3 options | by provenance (step 6) |
| linked worktree, detached HEAD | 2 options (no local merge) | host-managed, leave it |

**Base branch**: whatever this work forked from (plan, conversation, upstream). If unsure, ask:
"This branched from `<guess>` - correct?" Merging into the wrong base is expensive to undo.

## 4. Present options

Exactly these, then wait:

```
Implementation complete and verified. What would you like to do?
1. Merge back to <base> locally
2. Push and open a Pull Request
3. Keep the branch as-is (handle it later)
```

Detached HEAD: offer only "push as a new branch and open a PR" and "keep as-is".
Don't offer to discard the work; that happens only when the user asks.

## 5. Execute

**Merge locally**
```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git checkout <base> && git pull --ff-only
git merge <feature-branch>
<full test command>        # on the merged result
```
Merged result fails: stop, leave branch and worktree in place, investigate (forge:debugging).
Nothing was pushed, so it's recoverable. Green: clean up (step 6), then `git branch -d <feature-branch>`.

**Push and open a PR**
```bash
git push -u origin <feature-branch>          # detached: git push origin HEAD:refs/heads/<name>
gh pr create --base <base> --title "<subject>" --body-file <file>
```
Follow the repo's PR template if one exists (`.github/pull_request_template.md`); otherwise
use the body below. Report the PR URL. Keep the worktree: review feedback gets fixed there
(forge:receiving-code-review).

A rejected push means the remote moved: fetch and investigate. Use `--force-with-lease`, and
only when the user explicitly asks; never plain `--force` to a shared branch.

**Keep as-is**: report "Keeping branch `<name>`, worktree at `<path>`."

**Discard (only on explicit request)**: show what will be lost (branch, commit list, worktree
path) and require the user to type `discard`. "Yeah, get rid of it" is not confirmation. Then
cd to main root, clean up (step 6), `git branch -D <feature-branch>`.

## PR body

Skip preambles; brief prose; use the project's own domain terms.

```markdown
## Summary
<the smallest view that makes the point: pseudocode, call tree, file tree,
 component tree, Mermaid diagram, or a `diff` sketch of the shape that changed>

## Evidence
- **Before:** <failing test / output / screenshot>
- **After:** <passing test / output / screenshot>

## Merge danger
**Door:** one-way | two-way
**Blast radius:** <one word, then what could break: consumers, data, layout, mobile...>
```

- **Summary**: pick one or two visuals, not all. Use a `diff` sketch when the surrounding shape
  exists and the point is what changed; show the whole block when most of it is new.
- **Evidence**: screenshots for visual changes are best; otherwise execution evidence (the
  exact test that failed before and passes now, command output). Pull it from the
  forge:verification report.
- **Merge danger**: two-way doors roll back cheaply; destructive migrations, data deletes,
  public API removals, and published releases are one-way doors and say so. Keep PRs small;
  a 1000+ line PR should usually be split.

## 6. Clean up the worktree

Runs after a local merge or a confirmed discard, from the main root, using the values captured
in step 3. PR and keep-as-is always preserve the worktree.

- Normal repo: nothing to do.
- `WORKTREE_PATH` under `.worktrees/` or `worktrees/` (created by forge:git-worktrees): we own it.
  `git worktree remove "$WORKTREE_PATH" && git worktree prune`.
- Removal refused (modified/untracked files): those files exist nowhere else. Never `--force`
  on your own. Show `git -C "$WORKTREE_PATH" status --porcelain -uall` and ask: commit them,
  move them to the main repo, or delete them.
- Anywhere else: the host owns it; leave it.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Tests passed earlier" | Run them on the tree you integrate |
| "They obviously want it merged" | Present the menu and wait |
| "Base is obviously main" | Confirm the fork point |
| "Merged-result failure is flaky" | It stops everything until investigated |
| "PR is up, worktree is clutter" | Feedback gets fixed there |
| "That other worktree looks stale" | Only clean ones under `.worktrees/`/`worktrees/` |
| "Push rejected, force it" | The remote moved; investigate |

## Related

forge:verification, forge:code-review, forge:git-worktrees, forge:receiving-code-review.
