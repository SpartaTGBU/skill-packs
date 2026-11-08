---
disable-model-invocation: true  # skl: on-demand pack skill
name: agent-md-improver
description: Audit, score and improve agent instruction files - CLAUDE.md, AGENTS.md, .claude.local.md, hermes SOUL.md/AGENTS.md, opencode and pi AGENTS.md - then make targeted, approved updates; also captures session learnings into them. Use when the user asks to check, audit, update, improve or fix CLAUDE.md/AGENTS.md, "project memory optimization", or says "revise the instructions from this session".
---

# Agent Instruction File Improver

Audit, evaluate and improve instruction files (CLAUDE.md, AGENTS.md and friends) so any coding agent has optimal project context. It writes to those files only after you present a quality report and the user approves. For writing the prose itself (what belongs in an instruction file, pruning lines), see `forge:writing-skills`; for generating a first draft from a codebase, `forge:codebase-onboarding`.

## Invoke

- "audit/improve my CLAUDE.md / AGENTS.md" -> phases 1-5 below.
- "revise from this session" / "update instructions with what we learned" -> section "Revise from session".

## Workflow

### Phase 1: Discovery

```bash
find . \( -name CLAUDE.md -o -name AGENTS.md -o -name .claude.local.md -o -name AGENTS.local.md -o -name SOUL.md \) -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null | head -50
```

| Type | Location | Purpose |
|---|---|---|
| Project root | `./CLAUDE.md`, `./AGENTS.md` | Primary project context, in git. If both exist, check they agree (one may just point to the other). |
| Local overrides | `./.claude.local.md` | Personal, gitignored |
| Subdirectory / package | `./packages/*/CLAUDE.md`, nested `AGENTS.md` | Module-level context in monorepos |
| Claude Code global | `~/.claude/CLAUDE.md` | User-wide defaults |
| opencode global | `~/.config/opencode/AGENTS.md` | User-wide defaults (opencode also reads `CLAUDE.md` as a fallback) |
| pi global | `~/.pi/agent/AGENTS.md` | User-wide defaults |
| hermes | `~/.hermes/SOUL.md` (persona/identity), project `AGENTS.md` | Identity and project context |

Harnesses auto-discover instruction files in parent directories, so monorepos work without extra wiring. Only edit global files if the user asks; they apply to every project.

### Phase 2: Quality assessment

Score each file against [references/quality-criteria.md](references/quality-criteria.md).

| Criterion | Weight | Check |
|---|---|---|
| Commands/workflows documented | High | Build/test/deploy commands present? |
| Architecture clarity | High | Can the agent understand the structure? |
| Non-obvious patterns | Medium | Gotchas and quirks documented? |
| Conciseness | Medium | No verbose or obvious content? |
| Currency | High | Matches the current codebase? Verify commands and paths exist. |
| Actionability | High | Instructions executable, not vague? |

Grades: A (90-100) comprehensive, current, actionable; B (70-89) minor gaps; C (50-69) missing key sections; D (30-49) sparse or outdated; F (0-29) missing or severely outdated.

### Phase 3: Quality report (ALWAYS before any edit)

```
## Instruction File Quality Report

### Summary
- Files found: X   - Average score: X/100   - Files needing update: X

### File-by-File Assessment
#### 1. ./CLAUDE.md (Project Root)
**Score: XX/100 (Grade: X)**
| Criterion | Score | Notes |
|---|---|---|
| Commands/workflows | X/20 | ... |
| Architecture clarity | X/20 | ... |
| Non-obvious patterns | X/15 | ... |
| Conciseness | X/15 | ... |
| Currency | X/15 | ... |
| Actionability | X/15 | ... |

**Issues:** ...   **Recommended additions:** ...
```

### Phase 4: Targeted updates

Ask for confirmation, then propose (see [references/update-guidelines.md](references/update-guidelines.md)):

1. **Targeted additions only**: commands/workflows discovered, non-obvious patterns, package relationships, testing approaches that work, config quirks.
2. **Minimal**: no restating of what the code shows, no generic best practices, no one-off fixes, no paragraphs where a one-liner works.
3. **Show diffs**: per change, the file, the exact addition, and why it helps future sessions.

```markdown
### Update: ./CLAUDE.md
**Why:** Build command was missing, causing confusion about how to run the project.
```diff
+ ## Quick Start
+ npm install
+ npm run dev  # dev server on port 3000
```
```

### Phase 5: Apply

After approval, edit surgically and preserve existing structure. Templates by project type: [references/templates.md](references/templates.md).

## Common issues to flag

1. Stale or broken build/test commands
2. Missing dependencies or tools
3. Outdated architecture / file structure
4. Missing environment setup (env vars, config)
5. Undocumented gotchas
6. Duplicate or contradictory content across CLAUDE.md and AGENTS.md

## Tips to share

- Keep it concise and dense; all commands copy-paste ready.
- Use the harness's own memory shortcut if it has one (Claude Code: `#` during a session) to capture learnings as they happen.
- Personal preferences go in a gitignored local file (`.claude.local.md`) or the user-global file, not the shared one.
- If a repo supports several harnesses, keep one canonical file (usually `AGENTS.md`) and have the other a one-line pointer to it, rather than two diverging copies.

## Revise from session

Review this session for learnings that would make future agent sessions more effective in this codebase, and update the instruction file.

1. **Reflect**: what context was missing? Bash commands used or discovered, code-style patterns followed, testing approaches that worked, environment/config quirks, warnings and gotchas hit.
2. **Find files** (Phase 1 command) and decide placement: shared file (`CLAUDE.md`/`AGENTS.md`, in git) vs local-only (`.claude.local.md`, gitignored).
3. **Draft**: one line per concept, format `<command or pattern> - <brief description>`. The file is part of the prompt, so brevity matters. Skip verbose explanations, obvious information and one-off fixes.
4. **Show** each addition as `### Update: <file>` + `**Why:**` one-liner + a diff block.
5. **Apply with approval**: ask, then edit only the files the user approves.
