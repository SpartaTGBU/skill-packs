"""Harness-neutral LLM runner for skill evals.

Set SKILL_EVAL_CMD to a command that reads a prompt on stdin and prints the
model's text answer on stdout, e.g.:
    SKILL_EVAL_CMD="claude -p"
    SKILL_EVAL_CMD="pi -p"
If unset, autodetects the first of these found on PATH:
    claude -p | opencode run | pi -p | hermes chat -q
Commands that take the prompt as an argument rather than stdin (opencode run,
hermes chat -q) are handled: the prompt is appended as the final argument.
Use SKILL_EVAL_MODEL_FLAG (e.g. "--model") to pass --model through; by default the
harness's configured model is used.
"""
import os
import shlex
import shutil
import subprocess

# (binary, argv prefix, prompt_via_stdin)
_CANDIDATES = [
    ("claude", ["claude", "-p"], True),
    ("opencode", ["opencode", "run"], False),
    ("pi", ["pi", "-p"], True),
    ("hermes", ["hermes", "chat", "-q"], False),
]
_ARG_STYLE = {"opencode", "hermes"}


def resolve() -> tuple[list[str], bool]:
    env = os.environ.get("SKILL_EVAL_CMD", "").strip()
    if env:
        argv = shlex.split(env)
        return argv, os.path.basename(argv[0]) not in _ARG_STYLE
    for binary, argv, stdin in _CANDIDATES:
        if shutil.which(binary):
            return argv, stdin
    raise RuntimeError(
        "No LLM runner found. Set SKILL_EVAL_CMD (prompt on stdin, answer on stdout), "
        "or install one of: claude, opencode, pi, hermes."
    )


def call_llm(prompt: str, model: str | None = None, timeout: int = 300) -> str:
    argv, via_stdin = resolve()
    argv = list(argv)
    flag = os.environ.get("SKILL_EVAL_MODEL_FLAG")
    if model and flag:
        argv += [flag, model]
    if via_stdin:
        result = subprocess.run(argv, input=prompt, capture_output=True, text=True, timeout=timeout)
    else:
        result = subprocess.run(argv + [prompt], capture_output=True, text=True, timeout=timeout)
    if result.returncode != 0:
        raise RuntimeError(f"{' '.join(argv[:2])} exited {result.returncode}\nstderr: {result.stderr[:500]}")
    return result.stdout
