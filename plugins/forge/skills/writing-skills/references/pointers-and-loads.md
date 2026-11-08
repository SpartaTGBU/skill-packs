# Pointers, loads and splitting (deeper theory for agent-facing documents)

Applies to skills, AGENTS.md/CLAUDE.md, and any doc an agent reaches by a pointer. Complements the
rules in SKILL.md; for building and evaluating a skill end to end see `forge:skill-creator`, for
auditing instruction files see `forge:agent-md-improver`.

## Context pointers
A **context pointer** is a reference held in context that names out-of-context material and encodes
when to reach it: a skill description, or a line in AGENTS.md naming a doc. The pointer's *wording*,
not its target, decides when and how reliably the agent reaches the material. A must-have target
behind a weak pointer is a variance bug: sharpen the wording first; inline the material only if
sharpening fails.
- State what the material is, then list the distinct **branches** that should trigger reaching it.
- Front-load the leading word; one trigger per branch (synonyms are one branch written twice).
- Cut identity the body already carries. An always-loaded pointer is paid for on every turn.

## Two loads
- **Context load**: always-loaded material (AGENTS.md lines, descriptions) costs tokens and attention
  every turn whether or not it fires.
- **Cognitive load**: the human must remember which docs exist and when to use them. Spend it where
  human judgement matters; remove it where it does not.
Material behind a pointer escapes context load at the price of the pointer line; material with no
pointer rides entirely on cognitive load. Invocation choice trades the two: model-invoked =
permanent context load for discoverability; user-invoked = zero context load, human is the index.
Shared reference two user-invoked skills need cannot live in either (no descriptions, so neither can
fire the other): put it in a plain file both point at. When user-invoked skills multiply, a **router
skill** (one entry that names the others and when to use each; it can only hint, not fire them)
cuts the cognitive load (`forge:using-forge` is this for forge).

## Hierarchy, sprawl, co-location
Rank content: in-file step, in-file reference (often a legitimately flat peer-set, e.g. review
rules), then disclosed reference behind a pointer. Disclosure test: inline what every branch needs,
push behind a pointer what only some branches reach. Reference buried among steps turns attending
to the steps into a coin-flip. **Sprawl** (too long even if every line is live) thins attention;
cure by disclosing and splitting by branch or sequence. **Co-locate** a concept's definition, rules
and caveats under one heading (scattering fragments one meaning; duplication repeats it).

## Completion criteria: clarity and demand
- **Clarity**: can the agent tell done from not-done? Vague bounds invite **premature completion**,
  pulled along by visible later steps. Sharpen the bound first; only if it stays fuzzy *and* you
  observe the rush, split the sequence so later steps are out of view. Hiding works only across a real
  context boundary (a handoff or subagent dispatch), not an inline call.
- **Demand**: "every modified model accounted for" forces more legwork than "produce a change list".
  Demand binds flat reference too ("every rule applied"). Best criteria are checkable and exhaustive.

## When to split
- **By sequence**: when later steps tempt the agent to rush the one in front of it. Merging
  sequences does the reverse.
- **By invocation**: split off a model-invoked skill only for a distinct trigger word you really use
  or because another skill must reach it; the new always-loaded description has to be worth it.

## Leading words and negation
A leading word is a compact concept already in pretraining (*tight*, *red*, *tracer bullet*). Hunt for
triads spelled out at several sites, or a pointer spending a sentence on one idea, and collapse them
to a token. A coined word recruits no priors; define it once or reach for an existing one. A word
too weak to beat the default (*be thorough*) is a no-op: use a stronger word (*relentless*).
Prohibitions drag the forbidden behaviour into context; state the positive target.

## Pruning extras
- No-op disputes are about the model's default; settle by running the document, not by debate.
  When a sentence fails the test, delete the whole sentence.
- Default fate without a pruning discipline is **sediment**: stale layers nobody dares remove.
