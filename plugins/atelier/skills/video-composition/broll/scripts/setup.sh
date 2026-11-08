#!/usr/bin/env bash
# Workspace setup for the B-roll pipeline. Creates folders and checks prerequisites.
# It NEVER installs anything unless you pass --install (get the user's consent first).
# usage: setup.sh [motion_dir] [--install]
#   --install  runs: pip install --user numpy (if missing), npm install playwright, npx playwright install chromium
#              (downloads ~150MB of browser from the Playwright CDN into the project)
set -e
MOTION_DIR="./motion"; INSTALL=0
for a in "$@"; do case "$a" in --install) INSTALL=1;; *) MOTION_DIR="$a";; esac; done
mkdir -p "$MOTION_DIR"/{clips,dist,out,work}
missing=()
command -v node >/dev/null || missing+=("node (https://nodejs.org)")
command -v ffmpeg >/dev/null || missing+=("ffmpeg")
command -v python3 >/dev/null || missing+=("python3")
if [ ${#missing[@]} -gt 0 ]; then echo "Missing: ${missing[*]}"; exit 1; fi
need=()
python3 -c "import numpy" 2>/dev/null || need+=("python: numpy (pip install --user numpy)")
[ -d "$MOTION_DIR/node_modules/playwright" ] || need+=("node: playwright + chromium (npm install playwright; npx playwright install chromium)")
if [ ${#need[@]} -gt 0 ]; then
  if [ "$INSTALL" != 1 ]; then
    echo "Not installed yet:"; printf '  - %s\n' "${need[@]}"
    echo "Re-run with --install after the user agrees to these downloads."; exit 2
  fi
  python3 -c "import numpy" 2>/dev/null || python3 -m pip install --user numpy
  if [ ! -d "$MOTION_DIR/node_modules/playwright" ]; then
    [ -f "$MOTION_DIR/package.json" ] || echo '{"private":true}' > "$MOTION_DIR/package.json"
    (cd "$MOTION_DIR" && npm install playwright && npx playwright install chromium)
  fi
fi
ffmpeg -hide_banner -encoders 2>/dev/null | grep -q prores_ks || echo "Note: your ffmpeg has no prores_ks encoder; transparent panel clips will fail."
echo "Ready. Clips go in $MOTION_DIR/clips, renders in $MOTION_DIR/out."
