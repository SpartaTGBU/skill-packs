---
name: using-forge
description: Router for the forge skill set. Says which forge skill to load for each phase of work (plan, implement, review) and how to scale process to task size. Use at the start of a session or when unsure which forge skill applies.
---

# Using forge

Forge merges several skill libraries into one workflow with three phases. **Planning and review
are thorough; implementation is lean (ponytail).** Process scales with the task.

## How to load a pack skill

Exception: the clarify-and-goal skills (`forge:brainstorming`, `forge:brainstorm-technical-design`,
`forge:goal`, `forge:hill-climb`) are in the Skill tool listing. Invoke them yourself whenever you
need clarification or a clearer goal; don't wait for the user to ask.

Pack skills (`forge:*`, `atrium:*`, `atelier:*`) are **not** in the Skill tool, to keep context
small. Load one through Bash, only when the work needs it, and follow it as if it were invoked:

- `skl load forge:rust` (several names at once is fine) prints the skill and its directory
- `skl search <words>` finds the right one; `skl list [pack]` lists them all
- If `skl` is not on PATH: run `<forge plugin root>/bin/skl`. The `forge plugin root:` line is at the end of this router.

Load the one or two you need, not the whole route. After compaction, re-load any you still need.

User instructions (CLAUDE.md, direct requests) override skills; skills override defaults.
forge:ponytail is injected into every session and subagent automatically (not in plan mode or
planner/architect agents); don't load it. Subagents: follow your task prompt plus ponytail.

## Size the task first

| Size | Signals | Route |
|------|---------|-------|
| **Trivial** | One obvious edit, a question, a lookup | Just do it, ponytail-style. No ceremony. |
| **Small** | Clear goal, 1–2 files | forge:ponytail → verify (forge:verification). |
| **Medium** | Several files, or a real design choice | forge:brainstorming (short) → forge:writing-plans → implement → forge:code-review. |
| **Large / ambiguous** | New feature, unclear requirements, architecture | brainstorming → writing-specs → writing-plans → executing-plans → code-review → verification → finishing-branch. |

When unsure between two sizes, pick the larger for *planning* and the smaller for *code*.

## Which skill when

**Plan (comprehensive)**
- Unclear request or "let's build X" → `forge:brainstorming`
- Design session that should also shape structure and record glossary/ADRs → `forge:brainstorm-technical-design`
- Turn an agreed design into a spec → `forge:writing-specs`
- Break work into verified steps or tickets → `forge:writing-plans`
- Structure, module boundaries, domain model, deleting complexity → `forge:architecture`
- Need facts, docs or prior art before deciding → `forge:research`
- Answer a question by building something throwaway → `atelier:prototype`

**Implement (ponytail)**
- Writing or changing any code → `forge:ponytail` (already injected; always applies)
- Behaviour worth pinning down first → `forge:tdd`
- Bug, failure or unexpected behaviour → `forge:debugging` (root cause before fix)
- Executing a written plan → `forge:executing-plans`
- Independent tasks that can run concurrently → `forge:parallel-agents`
- Long unattended run toward a measurable target (`/goal`, "keep going until", N× faster, score ≥ N) → `forge:hill-climb`
- Multi-turn work whose "done" should be one checkable condition, or you're unsure what done means → `forge:goal`
- Need an isolated workspace → `forge:git-worktrees`

**Review (comprehensive)**
- Before merge, or when asked to review → `forge:code-review`
- Quick plain-English review of a change, "is this over-engineered?" → `forge:lean-review`
- Responding to review feedback → `forge:receiving-code-review`
- Audit a whole repo or folder (bugs, risk, scale, tests, bloat) → `forge:audit`
- Ledger of `shortcut:` markers and deferred work → `forge:debt`
- Auth, secrets, input handling, dependencies, agents/MCP → `forge:security-review`
- Before saying "done", "fixed" or "passing" → `forge:verification`
- Wrapping up a branch or opening a PR → `forge:finishing-branch`

**Design and visual** (web/UI, motion, images, AI video, Blender/3D, UE5, 2D animation, diagrams,
video editing, CAD) → `atelier:using-atelier`. Prose de-AI pass → `forge:humanizer`.

**Business**: docs (Word/Excel/PowerPoint/PDF), brand, SEO, growth, sales, CRM, finance, legal →
`atrium:using-atrium`.

**Ops**: `forge:writing-skills`, `forge:codebase-onboarding`. User-initiated only (never load these
yourself; the user types them): `forge:handoff` (pass work to a fresh session), `forge:triage` (issues),
`forge:retro` (see below).

**Stacks**: `forge:rust`, `forge:go`, `forge:python`, `forge:docker`, `forge:postgres`,
`forge:database-migrations`, `forge:mcp-server-patterns`, `forge:agent-harness`.

**Agents** (dispatch with the Agent tool, usually in parallel during review): code-reviewer,
security-reviewer, silent-failure-hunter, pr-test-analyzer, type-design-analyzer,
rust-reviewer, go-reviewer, python-reviewer, database-reviewer, architect, planner,
rust-build-resolver, go-build-resolver.

## End of session: offer a retro

`forge:retro` is user-initiated: never start it on your own. When the user signals the session is
over ("thanks, that's all", "we're done", "wrapping up", "good night", or a final sign-off after the
work is finished), ask once, in one line: "Want a quick retro on this session before you go?"
- Yes → read `<forge plugin root>/skills/retro/SKILL.md` and
  follow it in session mode (they can also type `/forge:retro`).
- No, or no answer → drop it. Don't ask again this session.
Don't offer after trivial sessions (a single question or lookup).

## Rules of thumb

- Process skills (brainstorming, debugging) come before implementation skills.
- Announce briefly which skill you're using and why, then follow it.
- Don't load a heavy skill for a trivial task. Don't skip review or verification for a large one.
