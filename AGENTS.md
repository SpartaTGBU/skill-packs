# AGENTS.md

Operating contract for an agent using these skill packs. Read this once; it is short on purpose.

## What this repo is

A Claude Code plugin marketplace with three packs: `forge` (engineering), `atrium` (business), `atelier` (visual design). Skills live at `plugins/<pack>/skills/<name>/SKILL.md`. Reviewer agents live at `plugins/forge/agents/`.

## Rules

1. **Size the task first.** Trivial: just do it. Small: ponytail then verify. Medium: brainstorm, plan, implement, review. Large: add a spec, execute the plan, finish the branch.
2. **Find skills with `skl`, do not guess names.**
   - `skl search <words>` ranks skills by match.
   - `skl list [pack]` lists a pack.
   - `skl load <pack:name> [...]` prints the skill. Follow it as if it were invoked.
   - If `skl` is not on PATH, run `plugins/forge/bin/skl` (installed copy: `~/.claude/plugins/.../forge/bin/skl`).
3. **Load one or two skills per stage, not the whole route.** Re-load what you still need after compaction.
4. **Start from the router** when unsure: `forge:using-forge`, `atrium:using-atrium`, `atelier:using-atelier`.
5. **`forge:ponytail` is already injected.** Do not load it. It applies to all implementation, not to plan mode.
6. **Process before code.** Planning skills (`brainstorming`, `debugging`) come before implementation skills.
7. **Verify before claiming done.** Load `forge:verification`; run the check; report failures with output.
8. **User instructions override skills; skills override defaults.**

## Routing table

| Situation | Load |
|-----------|------|
| Unclear request, "let's build X" | `forge:brainstorming` |
| Agreed design to write down | `forge:writing-specs` |
| Break work into steps | `forge:writing-plans`, then `forge:executing-plans` |
| Bug or unexpected behavior | `forge:debugging` (root cause before fix) |
| Behavior worth pinning first | `forge:tdd` |
| Before merge | `forge:code-review`, plus `forge:security-review` for auth, input, secrets |
| Before saying done | `forge:verification` |
| Rust, Go, Python, Docker, Postgres | `forge:rust`, `forge:go`, `forge:python`, `forge:docker`, `forge:postgres` |
| Word, Excel, PowerPoint, PDF, SEO, sales, finance | `atrium:using-atrium` |
| Web UI, motion, images, video, 3D, diagrams | `atelier:using-atelier` |

## Dispatching reviewers

During review, send independent reviewers in one parallel batch: `code-reviewer` always; add `security-reviewer`, `silent-failure-hunter`, `pr-test-analyzer`, `type-design-analyzer`, and the language or database reviewer that matches the diff. Accept only findings with `file:line` and a concrete failure scenario. Full list in [docs/forge.md](docs/forge.md).

## Skill file format

Each skill is a folder with `SKILL.md`: YAML frontmatter (`name`, `description`) and a body. Pack skills carry `disable-model-invocation: true  # skl: on-demand pack skill`, which keeps them out of the per-turn listing. After adding a skill, run `skl hide`.

## Do not

- Load a heavy skill for a trivial task, or skip review and verification on a large one.
- Invent skill names. Search first.
- Edit upstream attributions in `NOTICE.md` files.
