# Grill playbook, questionnaires and design output

Extra techniques for long stress-test sessions (`forge:brainstorming` grill mode). Everything here
is optional depth; the loop itself stays in SKILL.md.

## During the session
- **Record as you go.** After each round write down what settled: one ADR per hard-to-reverse
  decision, glossary terms as they firm up (`forge:architecture`). The user may stop at any moment;
  nothing should live only in chat.
- **Push back on conflicts.** When an answer collides with an earlier decision or a non-functional
  goal (outage behaviour, cost, portability), raise it next round: recommend the hybrid and state
  the mechanism that makes the original answer risky.
- **Scope widening.** A free-text answer that adds scope gets its own decision record, not folded
  into the option it was attached to. If it collides with a recorded invariant ("all X should..."),
  accept the scope but offer the safeguarded version (e.g. only when no concurrent edit; overlay
  instead of editing third-party content) and record that the new decision amends the invariant by
  name. Applying a wide answer literally can silently destroy edits.
- **Late requirements amend earlier ones.** Add a new decision record listing which earlier ones it
  amends, then patch the spec's principles and phase plan, and note it on affected open tickets.
- **Skipped questions** the design still needs get a stated default in the record, marked "default,
  not a user decision", and configurable where sensible.
- **Unknown product/term:** look it up first; put the concrete interpretation and whether it has a
  public API in the question. **Hardware/environment:** probe it (`nproc`, `lspci`, `nvidia-smi`) and
  put the result in the question.
- **Shorthand answers** ("pick X", "give me trade-offs", "test it", "spike it") each get handled that
  turn: record a pick; give a comparison table plus recommendation; run a probe and record the
  result; create a spike (`atelier:prototype`).
- **Decree** ("we decided X"): ask one scope question if the boundary is unclear, record it listing
  the decisions it amends, retire any open evaluation it supersedes.
- **Scope-boundary questions** deserve a question even when the user sounds absolute: the narrow and
  wide readings rewrite different documents.
- **Gap analysis against a reference product:** fetch the real source/docs, not blog summaries.
  One table: feature (cite source section), what we have (cite decision/spec section), and
  COVERED / PARTIAL / GAP, noting where we are ahead. Put each structural gap to the user as its own
  question; bundle small gaps into one ("add all to the tickets they fit").
- **Before the closing confirmation** offer a research pass ("what are we missing?"): batch the
  searches, present findings as multi-select options with sources, save the source list to
  `docs/research-<date>.md`.
- **Replacing tools the user already runs:** before closing, check the spec against their existing
  workflows and ask whether each is built in; a miss sends them back to grill after tickets exist.
- **Synthesis of many research notes** that propose spec changes: dedupe into one table (source,
  affected decision, phase, cost, adopt/defer/reject) without editing the spec; decide in one round:
  in-phase changes as a bundle, each open semantic question alone, later-phase adopts as a bundle;
  record one decision record; then add tickets in front of their consumers.

## Output once the frontier is empty and the user confirmed
1. `docs/SPEC.md`: purpose, principles, topology diagram, short concept list (point to the
   glossary), one subsection per subsystem citing its decision numbers, a phase plan with the MVP
   first, and open questions to settle by spikes. Bump the decision range in its status line when
   adding records; re-render any HTML copy after every change.
2. Commit glossary, decisions, spec and research together. Check decision numbering first
   (`ls docs/adr | sort`): parallel sessions can create duplicate numbers; renumber the later one
   and grep for references.
3. Tickets (`forge:writing-plans` / tracer-bullet tickets): each names the repo path, the spec section
   and decisions to follow, TDD, and measurable acceptance criteria; finish the chain with an
   adversarial review ticket. For a build start: integration branch, an exploration ticket first
   that writes cited notes from reference source plus primary docs (unsourced claims marked
   UNVERIFIED), and standing instructions on every build ticket (own worktree, read notes, TDD,
   benchmark every perf claim, no polling on idle paths, never push to main).
4. "What is our completion %?": answer per phase in a table (phase, scope, status) and give the
   overall figure as an estimate with its method, not a requirement-by-requirement score; count
   design/spike groundwork separately from implementation.

## Questionnaire for someone else (full template)
Use when a decision needs knowledge only another person holds. **Grill the send, not the subject**:
interview the user only about the send, which they can always answer.
1. Who receives it (role, expertise, relationship)? Done when you know what they know that the user
   does not.
2. What must the user walk away able to decide or do? Done when you have a concrete list.
3. Write `questionnaire-<slug>.md` (current directory) and report the path. Done when every item
   from step 2 is covered by a question. Order most-important-first (async may give one pass).

```markdown
# <Title>
**Purpose:** why this exists and the decision riding on it.
**From:** <user>  **To:** <recipient>  **How your answers will be used:** <where they go>
## Context
One paragraph for a recipient who was not in the user's head.
## How to answer
Deadline, rough effort. Partial answers and "I don't know" are useful; flag unsure items.
## <Theme>
### <One-idea question>
_Why this matters: only where it could be misread or invite a throwaway answer._
>
## Anything else?
Anything we did not ask that we should know?
```
Group under `##` themes once past a handful of questions; park the dependent branch until answers
return.
