# Source notes

This skill is distilled from three Theo (t3.gg) videos, transcribed 2026-11-08, plus Claude
Code's `/goal` implementation (v2.1.316).

## "Agents Sucked At UI (Until Today)" (youtube.com/watch?v=xq0eB8vxeqk)

- The T3 Code UI redesign as a hill climb. Roughly 18 h of agent time, 5 models, 30+ review
  rounds, about $250–400 of subscription-equivalent usage.
- He gave `/goal` a council skill: three delegates from three providers, read-only, each scoring
  out of 10. One full review pass is one round.
- Round 1 scored ~6/10. Round 3 had every judge at 9 and the goal was met. He judged it still
  not good enough.
- He started a new thread with screenshots of Claude Code and Codex added as references and the
  goal "score higher than these in all rankings". That re-baselined the build to 7.0 → 7.4.
  Reference scores drifted up over the run (8.3 → 9.1).
- To save scarce quota: gate on one judge until it passes, then add Opus, then Muse.
- He forked a worktree for a 9.5 bar while the 9.0 PR stayed mergeable. That took 10 more
  rounds. Then a third climb aimed at 10/10, with the taste note "too grayscale, restore color".
- Lesson: the judges knowing the bar (9.5) may have inflated their scores. Next time, hide it.
- A Gemini "jester" served as a control judge. Its score was ignored; it hallucinated line numbers
  and reviewed commits it was never given.
- "Programmatic [verifiers] are better. If you can turn a problem into a program that gives a
  score, your agents are going to make that score go up."
- An MCP eval was built from his own history of wrong tool use: 66/85 at first, with a dip to
  63/85 along the way. He climbed it to a perfect score, committed and stabilized across models,
  then cut the descriptions to ⅓ while keeping the perfect score. Tokens dropped 52% (78% with
  tool search on).
- Other climbs he had running: "the MCP eval passes using ⅓ of the context", and "no UI
  regressions on my real threads while sending 4× less data".

## "How To Give Claude Unlimited Usage" (youtube.com/watch?v=NBCM_ZoWZo8)

- His framing is RL with verifiable rewards (RLVR): models are trained on "turn A into B; here
  are examples; pass or fail". The more your task looks like their training, the better they do.
- TS Rust: "Take these real-world projects, pinned TS version, match the outputs exactly. Not
  done until they all match." Then: "Don't stop until you're 2× faster than the official
  compiler; all validation must still pass." About 1,800 revisions and 7,884 commits.
- Skate 3 bench: a game built from scratch in 4 days, 12B tokens, 25 prompts (mostly
  "continue"). The hill: take screenshots of set states, compare them with footage from the
  original game, and have a judge panel give feedback each time a build looks good. It spent
  about $800 chasing the skybox. Using Skate 3 as the reference was a mistake; resetting to
  Skate 1 fixed the look.
- His steps: (0) get subscriptions you don't mind burning, never API pricing; (1) pick something
  you want, the more tedious the better; (2) find a way to verify it with no human in the loop,
  programmatic or another agent; (3) give the agents the tools they need; (4) ask the agents
  what is blocking them. Steps 3–4 are a loop, and blockers that can be measured become new
  hills (a Lust compiler to speed up TS Rust builds).
- Compute was the bottleneck. Queue wait went from up to 12 h to 1.2 h after offloading builds,
  and the build gate from about 70 min to 353 s with elastic VMs and warm snapshots. Landings
  per day roughly tripled.
- Run a separate check-in thread and ask it "what's bottlenecking the work?" Leave the climber
  alone.
- He calls `/goal` a footgun: "it doesn't work when you point it up", and the same prompt
  written well does the same job. It only works when the goal has a verifiable hill.
- Lust's goals: CI builds 100× faster than Cargo, and the output binary within 20% of
  reference performance.
- Private benchmark split: labs trained on his public SkateBench and then failed the hidden
  questions. Hence the held-out set.

## "T3 Code broke me" (youtube.com/watch?v=uLGxb4F3SyI)

This is mostly a product tour. The parts that matter for climbing:

- Delegates across harnesses (Codex, Claude, Gemini, Muse), all on your own subscriptions, run
  inside one thread. This is the setup the council uses.
- Agents can create, message and settle other threads. That lets a climber thread and an
  observer thread run side by side.
- Treat threads as an inbox: every thread you open should end closed (merged, answered, or no
  longer needed).
- The usage tab plus scheduled follow-ups for when rate limits reset: climbs run into quota
  walls, so plan for resuming after them.

## Claude Code `/goal` (v2.1.316)

- `/goal <condition>` registers a session Stop hook. After each turn, a separate evaluator
  decides whether the condition is met. If it isn't, the agent keeps working, and the evaluator
  bumps an iteration count and records `last_reason`.
- The condition is at most 500 characters. `/goal clear` clears it. It needs a trusted workspace
  and hooks that aren't restricted. The model can suggest one with ProposeGoal, which the user
  approves.
- The evaluator only sees the transcript, so the climber must print its score.
