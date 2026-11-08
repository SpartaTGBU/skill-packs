---
disable-model-invocation: true  # skl: on-demand pack skill
name: brainstorm-technical-design
description: "Combined design session: forge:brainstorming's relentless questioning run together with forge:architecture's domain modeling, seam placement and ADRs, so every resolved decision lands in GLOSSARY.md, docs/adr/ and the design doc as you go. Use when the user says \"grill me with docs\", \"grill this design\", \"design session\", wants to stress-test a plan that touches module structure or domain language, or starts a feature in an existing codebase with real architectural choices."
---

# Brainstorm technical design

One session that does both jobs: find out what the user really wants (forge:brainstorming) and
shape the code to hold it (forge:architecture). **Load both skills now and follow them**; this
skill only says how they combine. Where they conflict, this file wins.

## Before the first question

1. Read `GLOSSARY.md` (or `GLOSSARY-MAP.md`), `docs/adr/`, and the code the topic touches until
   you can say how it works today. Facts are yours to find; decisions are the user's.
2. Run the hot-spot check from forge:architecture (`git log --oneline --name-only` on the area) so
   you know where change concentrates.
3. Open with brainstorming's first-message rules. Name any ADR or glossary term the request
   already conflicts with.

## The loop

Ask every question through AskUserQuestion with proposed options, recommendation first (see
forge:brainstorming). Use **grill mode** (rounds of up to 4 questions per call, recommended answer
first) when the user brought a plan; otherwise one question per call. In every round, ask questions on three
tracks, each only once its prerequisites are settled:

| Track | Asks about | Lands in |
|-------|-----------|----------|
| **Intent** | why, who, success, non-goals, constraints only they know | design doc |
| **Language** | terms that are vague, overloaded or clash with the glossary | `GLOSSARY.md`, updated inline as each term resolves |
| **Shape** | where seams go, dependency category, interface depth, what can be deleted instead of built | design doc; an ADR when the decision is hard to reverse, surprising and a real trade-off |

Rules:
- **Write as you go, not at the end.** When a term resolves, update the glossary in the same turn
  and say so in one line. When an ADR-worthy decision lands, draft it, show it, and write it on
  approval. The docs always reflect the conversation so far.
- **Lean lens on every proposal.** Before proposing a new module, port or layer, apply the deletion
  test and the "one adapter = hypothetical seam" rule. Prefer reuse and deletion
  (forge:ponytail's ladder). Say what you chose *not* to add.
- **Design it twice** (forge:architecture) for any interface that several callers will depend on;
  bring the comparison back as a grill question.
- **Contradictions are findings.** If the user's account and the code disagree, show both and ask
  which is true before going on.

## Done when

Every branch of the design tree is visited and nothing is silently assumed. Then:

1. Lay out the approaches in their own message and get a pick (brainstorming).
2. Write the design: short, or full per forge:writing-specs for project-sized work. It links the
   glossary terms and ADRs it relies on.
3. Get approval. The brainstorming hard gate applies: no code before it.
4. Summarise what changed on disk: glossary terms added or changed, ADRs written, the design path.
5. Next step: forge:writing-plans.
