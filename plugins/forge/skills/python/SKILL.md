---
disable-model-invocation: true  # skl: on-demand pack skill
name: python
description: Idiomatic Python reference - type hints, error handling, context managers, dataclasses, generators, concurrency, packaging, tooling, and pytest testing (fixtures, parametrize, mocking, async tests). Use when writing, testing or reviewing Python code (.py files, pyproject.toml, requirements.txt, conftest.py), setting up pytest, or choosing between threads, processes and asyncio.
---

# Python

Reference idioms for writing and testing Python. How much code to write is governed by
forge:ponytail: the standard library is large - use it and the project's existing deps before
adding packages. For review, the `python-reviewer` agent.

## Before writing

- Read `pyproject.toml` / `requirements*.txt` / `uv.lock` / `setup.cfg`: Python version, package
  manager (uv, pip, poetry), formatter/linter (ruff, black), type checker (mypy, pyright), test
  setup. Use what the project uses; don't introduce a second tool for the same job.
- Match existing style for imports, typing strictness and error handling.
- Run the project's formatter, linter and tests before done.

## Principles

- Readability over cleverness; explicit over implicit. A comprehension that needs two `if`s and
  two `for`s should be a loop or a generator function.
- EAFP where it is idiomatic (`try: d[key] except KeyError:`), but don't wrap large blocks in
  `try` - keep the `try` body to the one call that can fail.
- Flat is better than nested: early `return`/`continue`.

## Type hints

- Annotate public function signatures. Use built-in generics (`list[str]`, `dict[str, int]`) and
  `X | None` (3.10+); `from __future__ import annotations` for older targets.
- `typing.Protocol` for duck-typed interfaces instead of ABC hierarchies.
- `TypeVar` / PEP 695 generics (`def first[T](xs: list[T]) -> T`, 3.12+) only when they add
  real checking value.
- Don't fight the type checker with `Any` everywhere or `# type: ignore` without a reason code.

## Errors

- Catch specific exceptions. Never bare `except:`; `except Exception:` only at top-level
  boundaries (request handler, CLI main, worker loop) and always log or re-raise.
- Chain causes: `raise ConfigError(f"bad config {path}") from e`.
- A small custom hierarchy (`class AppError(Exception)`, a few subclasses) only when callers
  branch on the type. Otherwise built-ins (`ValueError`, `KeyError`, `FileNotFoundError`) are fine.
- Don't return `None` to signal failure when the caller can't tell it from a valid value.

## Resources and data

- Always `with` for files, locks, connections, temp dirs. `contextlib.contextmanager` for small
  custom ones; `contextlib.ExitStack` for a dynamic number.
- `pathlib.Path` over `os.path` string juggling. `open(..., encoding="utf-8")` explicitly.
- `@dataclass` (with `frozen=True` / `slots=True` as appropriate) for plain records;
  `NamedTuple` for small immutable tuples; Pydantic only if the project already uses it, typically
  at I/O boundaries.
- `enum.Enum` / `StrEnum` instead of magic strings.
- Generators / generator expressions for large or streaming data (`sum(x for x in ...)`, reading
  files line by line) - don't build lists you iterate once.
- `"".join(parts)` instead of `+=` in loops. f-strings for formatting; `%`-style args for logging
  (`log.info("user %s", uid)`), which defers formatting.
- `__slots__` only for classes with very many instances.

## Concurrency

- I/O-bound, few tasks: `concurrent.futures.ThreadPoolExecutor`.
- CPU-bound: `ProcessPoolExecutor` / `multiprocessing` (the GIL serializes Python bytecode in
  threads on standard builds).
- Many concurrent I/O tasks in an async codebase: `asyncio`, `asyncio.TaskGroup` (3.11+), timeouts
  via `asyncio.timeout()`. Never call blocking I/O in a coroutine; use `asyncio.to_thread`.
- Don't make a small script async just because a library offers it.

## Packaging and layout

- `pyproject.toml` is the single config file; `src/` layout for libraries, a flat module is fine for
  scripts.
- Import order: stdlib, third-party, local (ruff's `I` rules or isort enforce it). No
  `from x import *`.
- Keep `__init__.py` small; re-export the public API only.
- Entry points: `if __name__ == "__main__": main()`, with `main()` returning an exit code.

## Anti-patterns

```python
def add(item, items=[]):        # mutable default shared across calls
def add(item, items=None):      # fix: items = [] if items is None else items
if type(x) == int:              # use isinstance(x, int)
if x == None:                   # use `is None`
except: pass                    # swallows KeyboardInterrupt and bugs
```

Over-engineering flags: class hierarchies or "managers" for what a function does; decorators,
metaclasses or descriptors for one call site; config frameworks for three settings; abstract base
classes with one subclass.

## Testing (pytest)

Use forge:tdd for the red-green loop. pytest specifics:

- Plain `assert` - pytest rewrites it to show values. Files `test_*.py`, functions `test_*`,
  names describing behaviour: `test_login_rejects_wrong_password`.
- Exceptions: `with pytest.raises(ValueError, match="invalid email"):`; inspect via `as exc_info`.
- Fixtures for setup/teardown (`yield` then cleanup). Default function scope; widen to
  `module`/`session` only for expensive, read-only resources. Shared fixtures in `conftest.py`.
  Avoid `autouse` except for genuinely global setup.
- `@pytest.mark.parametrize("inp,want", [...], ids=[...])` instead of loops inside a test.
- Built-in fixtures: `tmp_path` (files), `monkeypatch` (env vars, attributes, `chdir`), `capsys`
  (stdout), `caplog` (logging).
- Mock at the boundary (network, clock, external service), not internal functions. Patch where the
  name is *looked up*: `patch("myapp.service.requests.get")`, not `requests.get`. Use
  `autospec=True` so mocks fail on wrong signatures. Prefer a small fake object or dependency
  injection over deep `patch` stacks.
- Async: `pytest-asyncio` (`@pytest.mark.asyncio`) or `anyio` if already installed; `AsyncMock` for
  awaitables.
- Markers (`@pytest.mark.slow`, `integration`) registered in config; run `-m "not slow"` locally.
- Database tests: a transaction rolled back per test, or a throwaway database/container; never the
  dev database.
- Don't test third-party code, don't share state between tests, don't put logic (`if`/loops) in
  test bodies.

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-ra --strict-markers"
markers = ["slow: slow tests", "integration: needs external services"]
```

## Commands

```bash
ruff check . && ruff format --check .     # or black/isort if the project uses them
mypy .                                    # or pyright
pytest                                    # all
pytest tests/test_auth.py::test_login -v  # one test
pytest -k "login and not slow" -x         # filter, stop on first failure
pytest --lf                               # rerun last failures
pytest --pdb                              # debugger on failure
pytest --cov=mypkg --cov-report=term-missing   # needs pytest-cov
pip-audit                                 # dependency advisories, if installed
```

## Review checklist

- [ ] No bare `except`, no swallowed exceptions, causes chained
- [ ] Resources opened with `with`; explicit encodings
- [ ] No mutable default arguments
- [ ] No blocking calls inside `async def`
- [ ] Public functions typed; type checker clean
- [ ] No new dependency where stdlib suffices
- [ ] Tests patch at the lookup site and cover error paths
