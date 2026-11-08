---
disable-model-invocation: true  # skl: on-demand pack skill
name: writing-skills
description: Writes and tests Claude Code skills, subagent definitions, and CLAUDE.md instructions using a baseline-first (TDD) loop and context-economy rules for agent-facing prose. Use when creating or editing a skill, writing a SKILL.md description, adding or pruning CLAUDE.md lines, defining an agent in .claude/agents, or when a skill isn't triggering or isn't being followed.
---

# Writing Skills

A skill is process documentation that changes what an agent does. Write it like code: watch an agent fail without it, write the least text that fixes that failure, verify, close loopholes. This is `forge:tdd` applied to prose.

**Core rule:** if you never saw an agent fail without the guidance, you don't know the guidance teaches anything.

## Claude Code mechanics

**Where things live:**

| Kind | Path |
|------|------|
| Personal skill | `~/.claude/skills/<name>/SKILL.md` |
| Project skill | `.claude/skills/<name>/SKILL.md` |
| Plugin skill | `<plugin>/skills/<name>/SKILL.md`, invoked as `<plugin>:<name>` |
| Subagent | `.claude/agents/<name>.md` or `<plugin>/agents/<name>.md` |
| Always-loaded instructions | `CLAUDE.md` (repo root, subdirs, `~/.claude/CLAUDE.md`) |

**Skill frontmatter:** `name` (lowercase, digits, hyphens; matches the directory) and `description` are what matter. Optional: `argument-hint` (shown for `/name <args>`), `disable-model-invocation: true` (only the user can invoke it), `allowed-tools`. Skills load via the Skill tool or `/name`; only the description sits in context until then.

**Pack skills (forge/atrium/atelier) are on-demand:** each carries `disable-model-invocation: true  # skl: on-demand pack skill` so it stays out of the per-turn listing; agents load it with `skl load <plugin>:<name>` (Bash) and users with `/<plugin>:<name>`. After adding one, run `skl hide` to add the marker (it also JSON-quotes a description containing `: ` or ` #`: invalid YAML makes Claude Code ignore the marker and list the skill anyway). Only the `using-*` routers stay model-invocable. Since the description is not listed, `skl search` matches on its words: keep trigger terms in it.

**Agent frontmatter:** `name`, `description` (when the main agent should delegate to it), optional `tools` (comma list of tool names; omit for all) and `model`. The body is the agent's system prompt; it sees nothing of the parent conversation.

**Supporting files:** `SKILL.md` plus files in the skill directory (e.g. `references/x.md`, `scripts/y.sh`), reached by relative links that say when to read them. One level deep: SKILL.md points to references; references don't chain to more references. Run bundled scripts through their interpreter (`bash scripts/x.sh`), since packaging can drop executable bits. Give long reference files a contents list at the top.

## When to write one

Write a skill when a technique wasn't obvious, recurs across projects, and an agent gets it wrong by default. Don't for: one-off solutions, things the model already does well, project conventions (put those in CLAUDE.md), or mechanical rules a linter/hook can enforce (build the check instead).

**Invocation choice:** model-invoked (has a working description) when the agent must reach it on its own or another skill must; costs context every turn. User-invoked (`disable-model-invocation: true`) when it only ever fires by hand; zero context cost, but the human must remember it.

## The description is the trigger

The description is always loaded and is the only thing deciding whether the skill fires.

- One short clause saying what the skill is or produces, then `Use when` + concrete triggers: situations, symptoms, error text, words the user actually types. Third person.
- **Never summarize the workflow steps.** An agent that reads a step summary follows the summary and skips the body ("dispatches a reviewer between tasks" got one review where the body required two).
- One trigger per distinct case; synonyms for the same case are wasted tokens. Keep it under ~600 characters.
- Name skills by the activity or core insight, verb-first or gerund: `condition-based-waiting`, not `async-helpers`.

```yaml
# Bad: vague, and summarizes process
description: Helps with testing. Writes a test, runs it, then writes code.
# Good
description: Test-first loop for non-trivial logic. Use when implementing a feature or bugfix, when the user says "TDD", or when a test passes before the code exists.
```

## Writing the body

**Structure:** overview with the core rule (1-2 sentences), when to use / not use, the steps or pattern, a quick-reference table, common mistakes. 80-250 lines is a good target; push branch-specific detail into references.

**Information hierarchy:** steps first (what the agent does, in order), then in-file reference consulted on demand, then disclosed reference behind a pointer. Inline what every path needs; disclose what only some paths reach. Keep a concept's definition, rules, and caveats together under one heading.

**Completion criteria:** every step ends on a checkable, demanding condition. "Every caller updated and the suite green" drives real work; "understand the code" invites stopping early. Sharpen the criterion before restructuring.

**Leading words:** a compact concept the model already knows (*tight* loop, *red*, *tracer bullet*, *seam*) anchors behavior in one token. Reuse the same word consistently instead of restating a triad of adjectives. Coin a term only if nothing existing fits, and define it once.

**Positive over negative:** state the target behavior ("write one-line comments"); a bare prohibition puts the forbidden thing in context. Keep a prohibition only as a hard guardrail, paired with the positive target.

**Match the form to the failure** (classify the baseline failure first):

| Baseline failure | Right form | Wrong form |
|------------------|------------|------------|
| Knows the rule, skips it under pressure | Hard rule + rationalization table + red flags | Soft "prefer..." |
| Complies, but output has the wrong shape | A recipe: the output's parts, in order | A list of "don't"s |
| Omits a required element | A REQUIRED slot in the template | A reminder near the template |
| Behavior depends on a condition | A conditional on an observable predicate | A rule plus exemption clauses |

No nuance clauses ("don't X unless it matters" reopens negotiation); make the exception its own conditional. Exemption clauses don't scope; restructure so the rule can't reach the exempt part.

**Examples:** one excellent, realistic, runnable example in the most relevant language beats several mediocre ones. No fill-in-the-blank templates passed off as examples, no session narratives ("on 2025-10-03 we found...").

**Flowcharts:** only for non-obvious decisions or loops an agent might exit early. Tables for reference, numbered lists for linear steps, code blocks for code.

**Cross-references:** name the other skill (`forge:tdd`) and say whether it's required. Don't use `@path` links; they force-load files into context.

## Pruning

- **Single source of truth:** each meaning in one place. Don't repeat what a referenced skill says.
- **The environment is a source of truth.** Don't restate `package.json` scripts, configs, or `--help` output; cache only what can't be found by looking (unwritten conventions, the why, gotchas).
- **No-ops:** delete any sentence the model already obeys by default ("be thorough", "write clean code"). If a default needs to be beaten, use a stronger word, not more words.
- **Relevance:** cut exposition, stale lines, and branches that should be disclosed. Without pruning, files accumulate stale layers nobody dares remove.
- **No time-sensitive content** ("as of v3...", "new in 2024") unless it's in a clearly marked legacy section.
- **CLAUDE.md** is paid for on every turn: navigation pointers, commands, and gotchas only.

## Going deeper

For context-pointer wording, context vs cognitive load, router skills, sprawl, premature completion and when to split, read [references/pointers-and-loads.md](references/pointers-and-loads.md). For the full create/evaluate/optimize-description workflow use `forge:skill-creator`; to audit CLAUDE.md/AGENTS.md files use `forge:agent-md-improver`. Do not duplicate their steps here.

## The test loop

**Iron law: no skill or skill edit ships without a baseline failure first.** That includes "just adding a section".

1. **RED, baseline:** run a realistic scenario with a fresh subagent (Agent tool, `general-purpose`) *without* the skill. Record its choices and rationalizations verbatim. If it already behaves correctly, there's nothing to write; stop.
2. **GREEN:** write the minimum guidance addressing those specific failures. Run the same scenario with the skill content included (or the skill installed); it should now comply.
3. **REFACTOR:** each new rationalization gets an explicit counter (rule, table row, red flag). Re-run until it holds.

**Micro-test wording first** when shaping output: fresh single-shot samples with realistic surrounding context, a no-guidance control, 5+ reps per variant, and read every flagged match yourself. If the control doesn't show the failure, don't add the guidance. Divergent outputs across reps mean the wording isn't binding: tighten the form before adding words.

**By skill type:**

| Type | Test with | Passes when |
|------|-----------|-------------|
| Discipline (TDD, verification) | Pressure scenarios, 3+ combined pressures | Complies under maximum pressure |
| Technique (how-to) | Apply to a new scenario, edge variations | Applies it correctly |
| Pattern (mental model) | Recognition and counter-examples | Knows when and when not |
| Reference | Retrieval and use tasks | Finds and applies the right info |

For pressure-scenario design, loophole closing, and the rationalization-table method, read [references/testing-skills.md](references/testing-skills.md).

## Checklist (per skill; don't batch untested skills)

- [ ] Baseline run without the skill; failures recorded verbatim
- [ ] Pack skill: `skl hide` run, `skl search <trigger words>` finds it
- [ ] `name` matches directory; description = what it is + `Use when` triggers, no workflow summary
- [ ] Form matches the failure type
- [ ] Core rule up front; steps end on checkable criteria
- [ ] One good example; quick-reference table; common mistakes
- [ ] Cross-refs named, no `@` force-loads; supporting files only for heavy reference or tools
- [ ] Re-run with the skill: complies; new rationalizations countered
- [ ] Pruned: no no-ops, no duplication, no restated environment

| Excuse | Reality |
|--------|---------|
| "It's obviously clear" | Clear to you isn't clear to a fresh agent. Test it. |
| "It's just a reference" | References have gaps. Test retrieval. |
| "Small edit, no test needed" | Edits break skills too. Same law. |
| "I'll test if problems show up" | Problems show up as agents silently ignoring it. |
