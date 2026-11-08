---
disable-model-invocation: true  # skl: on-demand pack skill
name: debugger-cli
description: Drive real debuggers from the terminal - Node.js via `node inspect` / --inspect and the Chrome DevTools Protocol, Python via breakpoint()/pdb, post-mortem, debugpy and remote-pdb attach. Breakpoints, stepping, scope dumps, expression eval, CPU/heap profiles. Use when print/log debugging is not enough, a value must be inspected in a closure or live process, or you need to attach to a running Node/Python process.
---

# Debugger CLI

Tool mechanics only. The process (reproduce, minimise, hypothesise, fix at the root, regression
test) is forge:debugging; come here when a hypothesis needs live state.

**Don't use a debugger** for what `console.log`/`print`/`logging` or `pytest -vv --tb=long --showlocals`
answers in a minute. Breakpoint debugging is heavier; use it when the payoff is real.

## Pick the tool

| Runtime | First choice | Escalate to |
|---|---|---|
| Node.js | `node inspect script.js` (built in, REPL) | CDP script via `chrome-remote-interface` to automate breakpoints, profiles |
| Python | `breakpoint()` then run normally (pdb) | `python -m pdb script.py`, `pdb.post_mortem`, then `debugpy` / `remote-pdb` for running or headless processes |

Details and recipes: `references/node.md`, `references/python.md`. Go and Rust have their own
debuggers (dlv, rust-gdb/lldb); see forge:go and forge:rust for language-specific testing and tooling.

## Rules for agent-driven sessions

- Interactive debugger REPLs need a PTY. If your shell tool is non-interactive, use a PTY or
  background-process mode and send commands to it, or use the scriptable route (CDP script, DAP,
  `nc` to remote-pdb) that works without a TTY.
- Never leave a paused target behind: `continue` or kill it before exiting the debugger.
- Bind inspectors to `127.0.0.1` only; `--inspect=0.0.0.0` / open debugpy ports are remote code execution.
- Run tests single-process (`--no-file-parallelism`, `--runInBand`, no xdist) or breakpoints silently never hit.
- Verify the session before trusting it: the first breakpoint actually hits, the stack/source shown is the file you meant, the PID is the one you meant.
- Clean up before committing: `rg -n 'breakpoint\(\)|set_trace\(|debugpy\.listen|--inspect' .`
  and remove stray hooks.

## Common one-shots

- "Why is X undefined/missing here?" Break just above the failing line, print the container and `bt`/`w` for how we got here.
- "Who calls this?" Break on the function entry, print the backtrace.
- "It hangs." Run with the inspector or debugpy enabled, let it hang, pause, read the stuck frame (Node `pause` then `bt`; Python `py-spy dump --pid` or attach debugpy and pause; for asyncio list `asyncio.all_tasks()`).
- "Passes alone, fails in the suite." Run the suite with `--pdb` / `-x` so it traps at the accumulated state.

After the session, record the finding in a regression test (forge:tdd), not in the debugger.
