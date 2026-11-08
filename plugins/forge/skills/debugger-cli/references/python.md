# Python debugging (pdb, post-mortem, debugpy, remote-pdb)

Start with `breakpoint()`: cheapest thing that works.

| Tool | When |
|---|---|
| `breakpoint()` + pdb | local, interactive; edit source, run normally |
| `python -m pdb script.py args` | no source edits; then `b file:line`, `c` |
| `debugpy` | headless/remote, attach to a running process (DAP), thread-aware |
| `remote-pdb` | a `(Pdb)` prompt over `nc`; usually the best agent-friendly remote option |

## pdb commands

`n` next, `s` step in, `r` return, `c` continue, `unt N` run to line N, `j N` jump, `l`/`ll` list,
`w` stack, `u`/`d` up/down frame, `a` args, `p`/`pp expr`, `display expr`, `b file:line`, `b func`,
`b file:line, cond`, `tbreak`, `cl N`, `!stmt` (run Python, assignments included), `interact` (full REPL
in scope, Ctrl+D back), `q`.

## Recipes

Local breakpoint: put `breakpoint()` where needed, run normally.

pytest: `pytest tests/foo_test.py::test_bar --pdb` (trap on failure) or `--trace` (trap at start).
Non-interactive alternative: `--showlocals --tb=long`. `--pdb` does nothing under xdist or any runner
that captures per-file subprocesses; run a single file directly.

Post-mortem:
```python
import pdb, sys
try: run_the_thing()
except Exception: pdb.post_mortem(sys.exc_info()[2])
```
or `python -m pdb -c continue script.py` (lands in the crash frame), or set `sys.excepthook` to call `pdb.post_mortem`.

### debugpy

```python
import debugpy
debugpy.listen(("127.0.0.1", 5678))
debugpy.wait_for_client()   # without this, execution continues and early breakpoints are missed
debugpy.breakpoint()
```
No source edit: `python -m debugpy --listen 127.0.0.1:5678 --wait-for-client script.py` (or `-m pkg.module`).
Attach to a running PID (debugpy must be installed in the target's environment):
`python -m debugpy --listen 127.0.0.1:5678 --pid <pid>`. Hardened kernels block this
(`/proc/sys/kernel/yama/ptrace_scope`); prefer relaunching under debugpy over loosening ptrace system-wide.
Install debugpy / remote-pdb as dev dependencies of the project, not into a production environment.

Clients: VS Code/Cursor/Zed attach config (`"type":"debugpy","request":"attach","connect":{"host":"127.0.0.1","port":5678}`
plus `pathMappings`), or a small DAP script (initialize, attach, setBreakpoints, configurationDone,
then loop on events; messages are `Content-Length:`-framed JSON). The DAP script is painful interactively;
for a terminal agent, remote-pdb is simpler:

```python
from remote_pdb import set_trace
set_trace(host="127.0.0.1", port=4444)   # blocks until a client connects
```
then `nc 127.0.0.1 4444`. In a persistent worker the first trigger blocks until you connect; re-arm to trap again.

## Pitfalls

1. pdb under xdist or a capturing runner silently hangs or shows nothing.
2. `breakpoint()` in CI or non-TTY hangs; never commit it. `PYTHONBREAKPOINT=0` disables all of them (check env if one never hits).
3. pdb debugs one thread; use debugpy for threaded code. pdb does not follow forks/multiprocessing: each child needs its own hook.
4. asyncio: `await` inside pdb needs Python 3.13+ (or the `interact`/`asyncio.ensure_future` workarounds). Inspect pending work with `!import asyncio; asyncio.all_tasks()`.
5. A test harness that sets a temp HOME or strips env vars can hide a bug that depends on user config; reproduce with raw pytest, then re-confirm under the harness.

## Checklist

- `python -c "import debugpy; print(debugpy.__version__, debugpy.__file__)"` in the intended environment
- remote: port really listening (`ss -tlnp | grep 5678`)
- first breakpoint hits (else PYTHONBREAKPOINT=0, parallel runner, or process finished before attach)
- `w` shows the expected stack
- cleanup: `rg -n 'breakpoint\(\)|set_trace\(|debugpy\.listen' --type py`
