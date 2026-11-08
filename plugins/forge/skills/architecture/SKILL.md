---
disable-model-invocation: true  # skl: on-demand pack skill
name: architecture
description: Design and improve code structure - deep modules behind small interfaces, seams placed where something really varies, a shared domain glossary, ADRs for hard-to-reverse decisions, ports & adapters only when earned, API shape, and a "complexity you can delete" lens. Use when designing a module or API, deciding where a boundary goes, untangling logic from I/O, finding refactor/deepening opportunities, auditing bloat or shortcut debt, naming domain terms, or recording why the code is shaped this way.
---

# Architecture

Aim: **leverage** for callers, **locality** for maintainers, testability for everyone - with the
least structure that achieves it. Structure is a cost; every layer, port and wrapper must earn its
place. Architecture work is thorough in analysis and lean in what it proposes; the code itself is
written per forge:ponytail.

## Vocabulary (use these terms exactly)

- **Module**: anything with an interface and an implementation - function, class, package, slice.
- **Interface**: everything a caller must know to use it correctly: types, plus invariants,
  ordering, error modes, required config, performance. Not just the signature.
- **Depth**: behaviour a caller (or test) can exercise per unit of interface learned. **Deep** =
  small interface, lots behind it. **Shallow** = interface nearly as complex as the implementation.
- **Seam**: the place where you can alter behaviour without editing in that place; where an
  interface lives. Where to put it is its own decision.
- **Adapter**: a concrete thing that fills a seam (a role, not a size).
- **Leverage** (callers' gain) and **locality** (maintainers' gain: change, bugs and knowledge
  concentrate in one place).

Say "seam" or "interface", not "boundary"; "module", not "component/service".

## Principles

- **Depth lives at the interface.** A deep module may be built from small parts internally; they
  just aren't exposed. Internal seams used by its own tests stay internal.
- **The deletion test.** Imagine deleting the module. Complexity vanishes -> it was a pass-through;
  delete it. Complexity reappears across N callers -> it earns its keep.
- **The interface is the test surface.** Callers and tests cross the same seam. Wanting to test past
  the interface means the module is the wrong shape.
- **One adapter = hypothetical seam; two adapters = real seam.** Don't add a port, interface or
  injection point unless at least two adapters are justified now (typically production + test).
- **Design for testability:** accept dependencies rather than constructing them; return results
  rather than mutating shared state; keep the surface small.
- **Dependencies point inward:** domain rules import nothing from frameworks, transport or storage.
- **Entry points, not barrels.** A package's public surface is a few small entry files; internals
  live in subfolders nobody outside imports. Avoid barrels that re-export whole subtrees. Enforce
  with the stack's import-boundary lint where one exists, and prove the rule fails on a violation.
- **Complexity you can delete beats complexity you can organise.** Before proposing structure,
  check whether code can simply go (see the lens below).

## Placing a seam: classify the dependency

| Dependency | Example | Treatment |
|------------|---------|-----------|
| In-process | pure computation, in-memory state | Merge and test through the new interface. No adapter. |
| Local-substitutable | Postgres (PGlite/testcontainer), filesystem (tmp dir) | Test with the local stand-in. Seam stays internal. |
| Remote but owned | your other services | Port at the seam; HTTP/queue adapter in prod, in-memory adapter in tests. |
| True external | Stripe, Twilio | Injected port; mock adapter in tests. |

Ports & adapters (hexagonal) is the treatment for the last two rows, not a default layout. When it
is earned: model ports as capabilities, not technologies; keep transport objects (`req`, job
envelopes) and mapping in adapters; wire everything in one explicit composition root; translate
infra errors into domain errors at the seam. Migrate one high-churn, low-blast-radius slice at a
time behind characterization tests (strangler), never a big-bang rewrite. Details and layouts:
[references/api-and-ports.md](references/api-and-ports.md).

**Testing: replace, don't layer.** Once tests exist at the deepened interface, delete the old unit
tests of the shallow parts. Tests assert observable outcomes and survive internal refactors.

## Improving an existing codebase

1. **Scope before scanning (YAGNI).** Take the direction the user names. Otherwise find hot spots in
   `git log --oneline --name-only` (files that keep changing); deepening pays where change happens.
   Read `GLOSSARY.md` and ADRs in the area first.
2. **Explore** with a fresh Explore subagent, organically, noting friction: understanding one concept
   means bouncing through many small modules; shallow modules; pure functions extracted for
   testability while bugs hide in the calls; coupling leaking across seams; code untestable through
   its current interface. Apply the deletion test to every suspect.
3. **Present candidates** (no interfaces yet), each with: files involved, problem, solution in plain
   words, benefits in terms of locality/leverage/tests, dependency category, and strength (`Strong`,
   `Worth exploring`, `Speculative`). Use domain glossary names ("the Order intake module", not
   "FooBarHandler"). Before/after diagrams help: mermaid in markdown, or a self-contained HTML report
   in the temp dir when visuals carry the argument. End with a top recommendation, then ask which to
   explore.
4. **ADR conflicts:** surface a candidate that contradicts an ADR only if the friction justifies
   reopening it, and say so explicitly.
5. **Drill in** on the chosen candidate with forge:brainstorming (grill mode): constraints,
   dependencies, the deepened module's shape, what sits behind the seam, which tests survive.

### Design it twice

For an important interface, your first idea is rarely the best. Write the constraints (dependencies
and their category, a rough sketch), then spawn 3+ subagents in parallel, each with the same
technical brief and glossary but a different constraint:
1. Minimise the interface: 1-3 entry points, maximum leverage each.
2. Optimise for the most common caller: the default case is trivial.
3. Maximise flexibility for many use cases.
4. (If relevant) Ports & adapters for cross-seam dependencies.

Each returns: interface (types, invariants, ordering, errors), usage example, what it hides,
dependency strategy, trade-offs. Compare on depth, locality and seam placement; be opinionated,
propose a hybrid if one is better. Bias toward the smallest interface that serves real callers.

## Complexity you can delete (lean lens)

Run this lens in every architecture review, and on its own for "find bloat" / "what can I delete":

- **Delete:** dead code, unused options, flags and config, speculative features.
- **Reuse:** two helpers doing one job - keep one, name the path.
- **Native:** stdlib or platform already does it; a dependency doing what a few lines can.
- **YAGNI:** interface with one implementation, factory with one product, pass-through wrapper.
- **Merge:** near-copies that must change together.
- **Split:** one unit doing unrelated jobs - by job, never by line count.

Every finding needs a concrete case. Before calling code unused, grep the whole tree including tests,
fixtures, config and string/dynamic references. Prefer fixes that delete code; never propose layers
or frameworks the problem doesn't need. Report `Lean: -N lines, -M dependencies possible`.

**Shortcut ledger.** Deliberate shortcuts carry `shortcut: <limit>, <when to upgrade>` comments
(older code: `ponytail:`). To list them:
`git grep -nE '(#|//|/[*]) ?(shortcut|ponytail):'`. One row per hit:
`file:line - what was simplified. ceiling: X. upgrade: Y.` Tag any without a trigger `no-trigger`
(those rot). A documented shortcut is a decision, not a finding - unless the current load already
crosses its ceiling.

## Domain model

Build the shared language while designing, not afterwards.

- **Challenge** terms that conflict with `GLOSSARY.md` the moment they're used. **Sharpen** fuzzy
  ones ("account": Customer or User?). **Stress-test** relationships with concrete edge-case
  scenarios. **Cross-check** stated behaviour against the code and surface contradictions.
- Update `GLOSSARY.md` inline as each term resolves (create it lazily). Format:

  ```markdown
  # <Context name>
  <One or two sentences: what this context is.>
  ## Language
  **Order**: A customer's request to buy items, fixed at checkout.
  _Avoid_: purchase, transaction
  ```

  Opinionated (pick one word, list the rest under _Avoid_), one or two sentences, what it *is*.
  Only project-specific concepts; no implementation details. Multiple contexts: a root
  `GLOSSARY-MAP.md` lists each context's glossary and how contexts relate.

## Architecture decision records

Offer an ADR only when all three hold: **hard to reverse**, **surprising without context**, and
**the result of a real trade-off**. Good subjects: architectural shape, integration patterns,
lock-in technology choices, ownership/scope decisions (the no's matter), deliberate deviations from
the obvious path, constraints invisible in code, non-obvious rejected alternatives. Also offer one
when the user rejects a candidate for a load-bearing reason, so future reviews don't re-suggest it.

Draft it and get approval before writing. `docs/adr/NNNN-slug.md`, next number in sequence, folder
created lazily:

```markdown
# NNNN: <Decision title>
Status: accepted   Date: YYYY-MM-DD
<Context, decision and why, in 1-5 sentences. Present tense.>
## Alternatives considered   (only if the rejection is non-obvious: option - why not)
## Consequences              (only if non-obvious: what gets easier/harder, risks)
```

Short is the point. Superseded ADRs link their replacement. Backfilled ADRs say so. When asked "why
is it like this?", read `docs/adr/` first.

## API and boundary shape

For HTTP/event/RPC interfaces, the design rules (resources, status codes, error format, pagination,
versioning, checklist) are in [references/api-and-ports.md](references/api-and-ports.md). When the
boundary has an independent consumer, the contract-first rules in forge:writing-specs apply.

Hand off: decisions go into the spec (forge:writing-specs) or plan (forge:writing-plans); the code is
written per forge:ponytail.
