# Feasibility spikes ("is this even possible?", "A vs B")

A third branch of `atelier:prototype` for questions that research cannot answer: can this work, which
approach is better, what is the hidden unknown. Skip it when docs or reading the code answers the
question (do `forge:research`), when the work is production path (plan it), or when the idea is
already validated.

**Loop:** decompose -> align -> research -> build -> verdict; iterate on findings.

1. **Decompose** into 2-5 independent feasibility questions, one spike each, as Given/When/Then with
   an observable output and a risk. Order by risk: the spike most likely to kill the idea runs first.
   Comparison spikes (same question, different approaches) share a number with letter suffixes
   (`002a`, `002b`). Bad questions: too broad, no observable output, "read the docs about X". Skip
   decomposition only when the user already named the single thing to spike.

   | # | Spike | Given/When/Then | Risk |
   |---|-------|-----------------|------|
   | 001 | ws-streaming | Given a WS connection, when tokens stream, then client gets chunks < 100ms | High |

2. **Align** (multi-spike): show the table; let the user drop, reorder or reframe before any code.
3. **Research per spike, briefly**: 2-3 sentence brief (what, why, key risk); if there is real
   choice, a table of approaches (tool, pros, cons, maintained/abandoned); pick one and say why, or
   build quick variants if 2+ are credible. Skip for pure logic with no external dependency.
4. **Build**: one standalone directory per spike (`spikes/001-name/` with a `README.md` and the
   code). Bias toward something the user can *feel*: a runnable CLI with observable output, a
   minimal HTML page, a one-endpoint server, or a test with recognisable assertions, never only a
   log line saying "it works". Hardcode everything; avoid package managers, bundlers, Docker, config
   systems unless they are the question. **Depth over speed**: never declare success after one happy
   path; test edge cases and follow surprises. Parallel comparison spikes that need real engineering
   can go to separate subagents, each returning its own verdict; you write the head-to-head.
5. **Verdict**, closing each spike's README: `VALIDATED` (core question answered yes, with
   evidence), `PARTIAL` (works under stated constraints), or `INVALIDATED` (does not, and why; a
   successful spike). Then What worked / What didn't / Surprises / Recommendation for the real build.
   Comparison spikes end with a head-to-head table (dimension, A, B) and a winner for this use case.

**Frontier mode** ("what should I spike next?"): read the existing spikes and look for integration
risks (two validated spikes touching one resource, tested apart), unproven data handoffs, assumed
but unproven capabilities, and alternative angles on PARTIAL/INVALIDATED spikes. Propose 2-4 as
Given/When/Then and let the user pick.

A spike that takes days to "clean up for production" was a bad spike. Record the verdict where the
decision lives (see Capture the answer in SKILL.md).
