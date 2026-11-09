# Verifier recipes

Each recipe gives you a command that prints a score. Wrap it as `just verify` (or a script) and
have it print one line the ledger can copy, for example `SCORE 74/85  guard=pass  t=6m`.

## 1. Differential port against an oracle

Use it for rewrites and ports (a TypeScript compiler in Rust, a library in another language).

- Pin the oracle at an exact version. Collect a corpus of **real** projects.
- Run the oracle once and snapshot its outputs: emitted files, diagnostics, exit codes.
- **Perturb:** inject random errors or edge cases into copies of the corpus, run the oracle on
  those too, and snapshot the results. This checks the failure paths, not only the happy path.
- Score = the fraction of cases where the port's output matches the oracle byte for byte.
- Keep part of the corpus held out. The climber sees the failing case names from the visible
  split only.

Target: "not done until every corpus project produces the same output as the oracle".

## 2. Performance ratio with a correctness guard

Use it after recipe 1 passes. This is phase 2: "now make it fast".

- Score = the reference time divided by your time, as the median of N runs on a quiet machine
  (`hyperfine`, or the project's bench). Use the same host class for both.
- Guard = the whole recipe-1 suite plus the existing tests. A round where the guard fails scores
  0, whatever the speed.
- Watch for the climber setting the number to exactly the bar. A target of "2×" tends to land at
  2.0×. Set the bar you actually want.
- Optionally add an output-quality guard: "the binary built by our compiler runs within 20% of
  the reference compiler's binary".

## 3. An eval built from your own failure history

Use it for agent or tool behaviour: MCP tool choice, prompt wording, routing.

- Search real transcripts and logs for the times the model did the wrong thing (opened a new
  thread when it should have spawned a sub-agent, left a thread open that should have been
  settled, and so on).
- Sort them into categories and turn each into a case: input context → the expected tool call or
  outcome. Around 85 cases is enough to start.
- Run the eval against **every model you care about**, not just one. Score = cases passed per
  model. The bar is a perfect score on all of them.
- Commit the eval itself. Later changes can then be checked against it.

## 4. Shrink while holding the score

Use it for context bloat: tool descriptions, system prompts, skill files, API payloads.

- Phase A: climb recipe 3 to a perfect score. Commit, and stabilize across models.
- Phase B: invert the goal. "Cut as much as possible. Target ⅓ of the current tokens or bytes.
  The score must stay perfect."
- Score = size; guard = the phase-A eval. Report the before and after token counts (in one
  case, 52% less without tool search and 78% less with it).

## 5. No regressions on real data while cutting cost

Use it for "send 4× less data to the client" or "use half the memory".

- Replay real recorded state (actual user threads, real DB snapshots) through the old and new
  versions.
- The guard is a structural or visual diff of the outputs; it must be empty. The score is the
  cost metric (bytes, ms, MB).

## 6. Visual or experiential match against a reference

Use it for UI polish, games, and anything where "does it look or feel right" is the question.

- Script the states to capture (fixed routes, fixed game moments, light and dark mode, an empty
  state, a dense state), so every round compares like with like.
- Capture the same states from the references (the original game's footage, competing apps).
- Score with a judge panel (see `judge-panel.md`). The judges see your build and the references
  side by side.
- Stronger form, worth it for interactive things: record real inputs (controller or keyboard
  replays) and replay them in both versions, then compare frames and behaviour, not only stills.

## Making the verifier fast

- Split it into a **fast gate** (seconds to a few minutes; runs every round) and a **full gate**
  (before commit or merge).
- Cache warm builds; snapshot environments; run independent shards in parallel on separate hosts.
- Track time spent waiting for compute as its own number. If waiting time dwarfs build time, fix
  the compute supply before anything else (Step 4 in SKILL.md).
