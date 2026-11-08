---
disable-model-invocation: true  # skl: on-demand pack skill
name: github
description: GitHub workflows with the gh CLI (REST fallback) - auth setup, issues, the PR lifecycle (branch, commit, PR, CI watch, merge), issue-to-PR delivery, reviewing someone else's PR with inline comments, repo management and releases, CI failure triage. Use when the user mentions a PR, issue, GitHub review, gh, CI checks, releases, or a github.com URL.
---

# GitHub

Work GitHub end to end with `gh` (REST via `gh api`/curl where noted). Each workflow lives
complete in a reference file: ALWAYS read the matching reference before starting that workflow;
this body only routes.

## Routing

| Task | Read first |
|---|---|
| Auth broken / new machine / token or SSH setup / gh login | `references/auth.md` |
| Create, triage, label, assign, close issues | `references/issues.md` |
| Branch, commit, open PR, watch CI, merge | `references/pr-workflow.md` |
| Carry an ISSUE to a verified PR (full delivery loop) | `references/issue-to-pr.md` |
| Review someone's PR: diffs, inline comments, verdict | `references/code-review.md` (output shape: `references/review-output-template.md`) |
| Clone/create/fork repos, remotes, releases | `references/repo-management.md` |
| CI red | `references/ci-troubleshooting.md` |
| Commit message format | `references/conventional-commits.md` |
| Endpoint the porcelain lacks | `references/github-api-cheatsheet.md` |
| Map an unfamiliar PUBLIC repo fast (gitdiagram / gitingest) | `references/repo-context-services.md` |

Assets: `scripts/gh-env.sh` (source it: detects gh vs token auth and owner/repo),
`scripts/git-credential-token.py` (reads a token from `~/.git-credentials`; prints a secret, so
never echo it into logs), `templates/` (PR bodies, bug report, feature request).
Script path prefix: `~/.claude/local-plugins/forge-marketplace/plugins/forge/skills/github/scripts/`.

## Core discipline

- Preflight once per session: `gh auth status`. If it fails, go to `references/auth.md`.
- Prefer `gh` over raw REST; use `gh api` only for what the porcelain lacks.
- Never report CI green without running `gh pr checks` yourself; never claim merged without
  verifying `state,mergedAt`.
- Read full context before writing: `gh issue view --comments` / `gh pr view --comments`;
  decisions live in threads, not titles.
- Sweep for duplicates before creating anything: `gh pr list --search`, `gh issue list --search`.
- Never paste tokens into commands that get logged; never force-push or merge without the user's say-so.

## Related skills

- forge:finishing-branch: final verification, commit cleanup and the evidence-first PR body when
  a branch is done (this skill handles the gh mechanics behind it).
- forge:triage (user-initiated; suggest `/forge:triage`, don't load it yourself): deciding what an issue or external PR needs (duplicates, repro, close with reasons).
- forge:code-review / forge:receiving-code-review: reviewing a diff vs acting on review feedback.
- forge:verification: evidence before any "done/passing" claim.

## Verification

The workflow's reference defines done for that task. Cross-cutting: every claim about remote state
(CI, merge, release, issue state) is backed by a fresh `gh` read, never memory.
