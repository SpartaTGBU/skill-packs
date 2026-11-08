---
disable-model-invocation: true  # skl: on-demand pack skill
name: codebase-onboarding
description: Maps an unfamiliar codebase into a scannable onboarding guide (stack, architecture, entry points, request lifecycle, conventions, commands), a starter or updated CLAUDE.md, and optionally a CodeTour `.tour` walkthrough with verified file and line anchors. Use when joining or returning to a repo, when the user says "onboard me", "help me understand this codebase", "how does X work", "generate a CLAUDE.md", or asks for a code tour, architecture walkthrough, or PR tour.
---

# Codebase Onboarding

Gather signals cheaply, verify against real code, and produce artifacts a newcomer can scan in two minutes. Flag unknowns instead of guessing.

Pick outputs from the request:

| Request | Output |
|---------|--------|
| "Onboard me", "help me understand this repo" | Onboarding guide in chat; offer a CLAUDE.md |
| "Generate/update CLAUDE.md" | Phases 1-3, then CLAUDE.md only |
| "Code tour", "walk me through X", "tour this PR" | Phases 1-2 scoped to X, then a `.tour` file |
| "How does X work?" (one-off) | Answer directly from a traced path; no artifact |

## Phase 1: Recon

Run these in parallel (Glob, Grep, a few Bash calls in one message; for a large repo, one `Explore` agent). Don't Read every file.

1. **Manifests:** `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pom.xml`, `build.gradle`, `Gemfile`, `composer.json`, `mix.exs`, `pubspec.yaml`.
2. **Framework fingerprints:** `next.config.*`, `vite.config.*`, `angular.json`, Django settings, FastAPI/Flask app, Rails config.
3. **Entry points:** `main.*`, `index.*`, `app.*`, `server.*`, `cmd/`, `src/main/`.
4. **Tree:** top two levels, ignoring `node_modules`, `vendor`, `.git`, `dist`, `build`, `target`, `__pycache__`, `.next`.
5. **Tooling:** linters/formatters, `tsconfig.json`, `Makefile`/`justfile`, Docker files, `.github/workflows/`, `.env.example`.
6. **Tests:** test dirs and naming (`*.test.ts`, `*_test.go`, `test_*.py`), runner config.
7. **Existing docs:** README, CLAUDE.md, `docs/`, ADRs.
8. **Git:** `git log --oneline -20`, recent branch names. Shallow or empty history: say "git history too shallow to infer conventions".

## Phase 2: Map the architecture

- **Stack:** languages and versions, frameworks and the libraries that shape how code is written, data stores and ORM, build tool, CI.
- **Shape:** monolith / monorepo / services / serverless; frontend-backend split; API style (REST, GraphQL, gRPC, tRPC).
- **Directory map:** top-level dirs to purpose. Skip the obvious (`src/` needs no explanation).
- **Request lifecycle:** trace one real request or command from entry to response: where it enters, how it's validated, where business logic lives, how it reaches storage. Read those specific files.

**Verify, don't guess:** if config says one framework but the code uses another, trust the code.

## Phase 3: Conventions

- **Naming:** file case, class/component patterns, test file naming.
- **Patterns:** error handling (exceptions, Result types, error codes), DI vs direct imports, state management, async style.
- **Git:** commit message style, branch naming, merge strategy if visible.
- **Commands:** exact dev, test, lint, typecheck, build, migrate commands from scripts and CI (not assumed).

## Phase 4a: Onboarding guide

```markdown
# Onboarding: <Project>

## Overview
<2-3 sentences: what it does, for whom>

## Stack
| Layer | Technology | Version |

## Architecture
<How components connect; a small diagram if it helps>

## Entry points
- **<role>**: `<path>`: <one line>

## Request lifecycle
<One traced request, entry -> response, with file paths>

## Conventions
- <naming, error handling, testing, git>

## Commands
- Dev: `...`  Test: `...`  Lint: `...`  Build: `...`

## Where to look
| I want to... | Look at... |

## Unknowns
- <what couldn't be determined>
```

Keep it scannable; it adds structure the README lacks, not a copy of it. List only dependencies that shape how you write code.

## Phase 4b: CLAUDE.md

CLAUDE.md loads into every turn, so it holds only what an agent can't find by looking: commands, non-obvious conventions, gotchas, and navigation pointers. Under ~100 lines.

```markdown
# <Project>

## Commands
- Test: `...` (single file: `...`)
- Lint/typecheck: `...`
- Build/run: `...`

## Layout
- `<dir>`: <purpose, only where non-obvious>

## Conventions
- <rule the code follows that a newcomer would get wrong>

## Gotchas
- <trap, and what to do instead>
```

If CLAUDE.md exists, read it first, preserve everything project-specific, and enhance it; tell the user exactly what you added or changed. Don't restate what `package.json`, configs, or `--help` already say unless the lookup is expensive. See `forge:writing-skills` for wording.

## Phase 4c: Code tour (`.tour` files)

A CodeTour file is a JSON walkthrough that opens real files at real lines. Write to `.tours/<persona>-<focus>.tour`. Create only `.tour` files; never modify source.

**Persona and depth:**

| Request | Persona | Steps |
|---------|---------|-------|
| quick tour | vibecoder | 5-8 |
| onboarding | new-joiner | 9-13 |
| feature / bug path / RCA / security / PR | feature-explainer, bug-fixer, rca-investigator, security-reviewer, pr-reviewer | 7-11 |
| architecture | architect | 14-18 |

**Step types:** `{"directory": ...}` to orient; `{"file": ..., "line": N}` (the default); `{"file": ..., "selection": {"start": {"line": a, "character": 0}, "end": {"line": b, "character": 0}}}` for one block; `{"file": ..., "pattern": "export default class App"}` when lines drift; `{"uri": ...}` for a PR or issue; content-only (title + description) for the closing step only. The first step must anchor to a real file or directory.

**Descriptions (SMIG):** Situation (what the reader sees), Mechanism (how it works), Implication (why it matters to this persona), Gotcha (what a smart reader would miss). Compact and concrete.

**Arc:** orientation -> module map -> core execution path -> an edge case or gotcha -> closing with what the reader can now do. A path, not an inventory. For PR tours, changed files first. In monorepos, scope to the relevant packages.

**`ref`:** when set and not the reader's checked-out branch, CodeTour opens files from that git revision, so files missing there won't open. PR tour: the PR branch, never the base (new files don't exist on base). Onboarding: the branch the reader uses, or omit. Unsure: omit, and files are read from disk.

```json
{
  "$schema": "https://aka.ms/codetour-schema",
  "title": "Payments request path",
  "description": "From HTTP entry to the ledger write.",
  "steps": [
    { "directory": "src", "title": "Source root", "description": "All runtime code starts here." },
    { "file": "src/server.ts", "line": 12, "title": "Entry", "description": "Boots and wires middleware before any route runs." },
    { "file": "src/routes/payments.ts", "line": 8, "title": "Payment routes", "description": "Every payment request enters here; validation happens before the service call." },
    { "title": "Next steps", "description": "You can now follow any payment end to end." }
  ]
}
```

**Validate before finishing:** every path exists (at `ref`, if set); every line and selection is in range (read the file to confirm; never guess line numbers); the JSON parses (`python3 -m json.tool <file>`).

## Size and language stats (optional)

For "how big is this repo" or a stats line in the guide, use `pygount` (`pip install pygount`):

```bash
pygount --format=summary \
  --folders-to-skip=".git,node_modules,venv,.venv,__pycache__,.cache,dist,build,.next,.tox,.turbo,coverage,vendor,third_party" .
pygount --suffix=py,yaml --format=summary .     # only some languages
pygount --format=json .                          # machine-readable
```

Always pass `--folders-to-skip` or it crawls dependency trees for minutes. Columns: language, files, code, comment, %. Pseudo-languages: `__empty__`, `__binary__`, `__generated__`, `__duplicate__`, `__unknown__`. Markdown counts as comments (0 code lines); JSON counts are conservative, use `wc -l`. In monorepos target languages or subdirs with `--suffix`. If pygount is unavailable, `git ls-files | xargs wc -l` with extension filters is a rough substitute. For a public repo you won't clone, see forge:github `references/repo-context-services.md`.

## Rules

- Recon with Glob/Grep; Read selectively, only to resolve ambiguity or trace the lifecycle.
- Every claim about the code comes from a file you looked at. Say "could not determine X" rather than guess.
- Don't describe obvious directory names or list every dependency.
