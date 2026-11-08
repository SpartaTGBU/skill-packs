---
disable-model-invocation: true  # skl: on-demand pack skill
name: parallel-agents
description: Splits work into independent lanes and runs them concurrently with the Agent tool (one agent per problem domain, worktree isolation for parallel writes), then integrates and verifies. Use when facing 2+ independent tasks, failures in unrelated subsystems, many independent checks or reads, multi-ticket fan-out, or when the user asks to "parallelize", "run agents in parallel", "fan out", or "speed this up".
---

# Parallel Agents

Turn the work into a dependency graph, run the independent lanes at once, and merge only on evidence. Concurrency is a speed tool; correctness still gates "done".

## When to parallelize

| Situation | Do |
|-----------|----|
| Failures in different files/subsystems, each understandable alone | One agent per domain, in parallel |
| Failures that may share a cause (fix one might fix others) | One investigation first (`forge:debugging`) |
| You don't know what's broken yet | Explore first; parallelize once domains are clear |
| Lanes edit the same files or shared state (DB, ports, fixtures) | Sequential, or isolate each write surface |
| Several independent reads/searches/checks | Batch them as parallel tool calls in one message; no agent needed |
| A handful of tool calls you could just run | Do it yourself; a spawned agent costs context, tokens, and a lossy handoff |

## 1. Build the lane matrix

Write it before a large push:

```text
Lane            | Parallel? | Write surface      | Risk   | Verification
Repo scan       | yes       | none               | low    | grep / git status output
Backend fix     | yes       | src/api (worktree) | medium | unit tests
Frontend fix    | yes       | src/ui  (worktree) | medium | component tests
Migration       | gated     | database           | high   | user approval, then dry run
```

Mark each lane parallel, sequential, or gated. Parallel only when write surfaces don't collide. Never parallelize destructive commands, migrations, writes to the same table, or deploys without an explicit gate.

## 2. Pick isolation

- **Read-only lanes** (research, review, analysis): no isolation. Use `subagent_type: Explore` for searches, reviewer agents (`forge:code-reviewer`, `forge:security-reviewer`, etc.) for review lenses.
- **Writing lanes with disjoint files**: one checkout is acceptable only if file sets truly don't overlap and no lane runs a formatter/codegen over the tree. When in doubt, isolate.
- **Writing lanes that might overlap, or any multi-file implementation**: `isolation: "worktree"` on the Agent call. Each agent gets its own git worktree and branch; it's auto-cleaned if unchanged. See `forge:git-worktrees`.

## 3. Write each agent's brief

The brief is the agent's only context. It knows nothing of your conversation. Each brief contains:

1. **Goal and scope:** one domain ("make the 3 failures in `src/agents/abort.test.ts` pass"), not "fix all the tests".
2. **Context:** the error messages, test names, file paths, what you've already ruled out. Pointers to files rather than pasted content.
3. **Constraints:** what not to touch ("don't change production code outside `src/agents/`", "don't just raise timeouts; find the race").
4. **How to work:** for code changes, `forge:tdd` and `forge:ponytail`; for bugs, `forge:debugging`. No sub-agent spawning.
5. **Output contract:** what to return, short ("root cause, files changed, test command + result, concerns; under 15 lines"). Long detail goes to a file you name.

Brief like a peer: say what you know and what's unknown, not your conclusion to be confirmed. An agent handed a hypothesis tends to return it confirmed.

## 4. Dispatch

- Put all independent Agent calls in **one message**; that's what makes them concurrent. One per message is sequential.
- Long lanes: `run_in_background: true`; you're notified on completion. Keep doing local work meanwhile; don't poll in tight loops.
- Set `model` deliberately: cheap (`haiku`) for mechanical lanes with complete instructions, `sonnet` for judgment, `opus` for design-level review.
- Continue a finished agent with SendMessage to its ID (its context is intact); a new Agent call starts fresh.

## 5. Integrate and verify

When agents return:

1. Read each summary. Treat them as claims; agents make confident systematic errors. Spot-check the diff.
2. Check for conflicts: did lanes touch the same code or contradict each other?
3. Merge worktree branches one at a time into the target branch; resolve conflicts there.
4. Run the **full** suite on the integrated result. Each lane being green alone proves nothing about the combination.
5. A lane that discovers a blocker changing the plan: pause dependent lanes, update the matrix, re-dispatch.

## 6. Report

```text
Parallel run:
- Lanes: 4 run, 3 done, 1 blocked (migration: waiting on approval)
- Integrated: branches fix-api, fix-ui merged to feat/x; no conflicts
- Verification: full suite 212/212, lint clean
- Skipped/unverified: <anything>
```

## Coordinating many agents (multi-ticket fan-out)

Treat each agent as a teammate with a narrow contract, tracked in a small table (in the plan ledger or a markdown file, not just chat):

| Card | Owner (agent ID) | Scope (files/branch) | State | Merge gate | Evidence |
|------|------------------|----------------------|-------|------------|----------|

States: ready, running, review, blocked, merged. One owner per card, no overlapping write scope without a single integrator, and an explicit merge gate (focused tests + review pass). You are the integrator: merge sequentially, rerun tests after each merge, then launch work the merge unblocked. For plan/ticket execution, use the frontier mode in `forge:executing-plans`.

## Failure modes

- **Agent soup:** many agents, no owner or merge gate.
- **Overlapping writes** without worktrees: silent clobbering.
- **Too broad a brief:** the agent wanders. One domain each.
- **No constraints:** the agent refactors everything.
- **Trusting summaries:** "all fixed" with no test output.
- **Speed claimed before correctness:** the integrated suite run is the done signal.
- **Forgotten background agents:** reconcile every launched agent before finishing.
