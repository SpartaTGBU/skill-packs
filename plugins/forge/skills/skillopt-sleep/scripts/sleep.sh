#!/usr/bin/env bash
# Lean runner for the SkillOpt-Sleep engine (microsoft/SkillOpt, MIT).
# Usage: sleep.sh <status|dry-run|run|adopt|harvest> [engine args...]
#
# Engine location, first match wins:
#   1. $SKILLOPT_HOME  - a clone of the SkillOpt repo (contains skillopt_sleep/)
#   2. `skillopt-sleep` executable on PATH (pip/uv/pipx install of `skillopt`)
# Optional: SKILLOPT_PYTHON to pick the interpreter (needs >= 3.10).
# Never searches the current directory (it is the possibly-untrusted project).
# No network of its own (backend `mock`/`handoff` make none; real backends call
# their provider). schedule/unschedule edit crontab and are refused unless
# SKILLOPT_ALLOW_SCHEDULE=1.
set -euo pipefail

[ "$#" -eq 0 ] && set -- status

case "$1" in
  schedule|unschedule)
    if [ "${SKILLOPT_ALLOW_SCHEDULE:-0}" != "1" ]; then
      echo "[sleep] refusing '$1': it edits your crontab. Set SKILLOPT_ALLOW_SCHEDULE=1 to allow." >&2
      exit 2
    fi ;;
esac

if [ -n "${SKILLOPT_HOME:-}" ]; then
  if [ ! -d "$SKILLOPT_HOME/skillopt_sleep" ]; then
    echo "[sleep] SKILLOPT_HOME=$SKILLOPT_HOME has no skillopt_sleep/ package." >&2
    exit 1
  fi
  PY="${SKILLOPT_PYTHON:-}"
  if [ -z "$PY" ]; then
    for cand in python3.13 python3.12 python3.11 python3.10 python3; do
      if command -v "$cand" >/dev/null 2>&1 &&
         "$cand" -c 'import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)' 2>/dev/null; then
        PY="$cand"; break
      fi
    done
  fi
  [ -n "$PY" ] || { echo "[sleep] need Python >= 3.10." >&2; exit 1; }
  # Run from the engine checkout (so only trusted code is importable) and pin the
  # project explicitly, since the engine would otherwise default --project to CWD.
  has_project=0
  for a in "$@"; do case "$a" in --project|--project=*) has_project=1 ;; esac; done
  if [ "$has_project" = 0 ]; then set -- "$@" --project "$PWD"; fi
  cd "$SKILLOPT_HOME"
  exec "$PY" -m skillopt_sleep "$@"
fi

if command -v skillopt-sleep >/dev/null 2>&1; then
  exec skillopt-sleep "$@"
fi

echo "[sleep] engine not found. Set SKILLOPT_HOME to a clone of https://github.com/microsoft/SkillOpt" >&2
echo "[sleep] or install it yourself ('pip install skillopt' / 'pip install -e <clone>')." >&2
exit 1
