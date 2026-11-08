---
disable-model-invocation: true  # skl: on-demand pack skill
name: headroom
description: Headroom is an optional external context-compression proxy/SDK (python+rust, Apache-2.0) that shrinks tool outputs, logs and history before they reach the LLM, with reversible retrieval via headroom_retrieve. Teaches when it helps, how to run it for Claude Code, opencode, hermes and pi, how to verify savings, and the risks. Use when a session is dominated by large tool output, when asked to cut token spend or context size, or to set up/debug Headroom.
---

# Headroom (optional external accelerator)

**Status: optional, external.** Headroom is a separate Python/Rust program you run beside an
existing harness. It is NOT a Temple/forge dependency and nothing in the harness hot path may
require it; every workflow must work without it. Recommend it, never assume it. It is not a skill
pack. Design context: forge:agent-harness (context budgeting, caching).

## What it does

Compresses what an agent reads (JSON tool results, logs, search output, history) locally before
the provider call; originals are cached locally (CCR) and the model can fetch them with
`headroom_retrieve(hash=...)`. Modes: library (`compress(messages)`), proxy (`headroom proxy
--port 8787`, zero code changes), `headroom wrap <agent>`, MCP server. Components: ContentRouter ->
SmartCrusher (JSON), CodeCompressor (AST), Kompress-v2-base (prose, HF model), CacheAligner (flags
cache-busting content, never rewrites prompts). Also: output-token shaping (off by default),
cross-agent memory, `headroom learn` (writes corrections into CLAUDE.local.md/AGENTS.md).

## When it helps (and when not)

Helps: long agent sessions with accumulated tool output; repetitive JSON arrays, log lines, build/test
output, many-tool agents. Upstream numbers: ~21-57% on mixed agent payloads, >90% on repeated
arrays/log lines. Little or nothing: short chats, source code (protected: recent code and
analysis/debug/review turns pass through), grep output, system prompts, images, prose-only
sessions (adds latency, saves cost). Measure on your own traffic before adopting.

## Install / run (user step; do not install on the user's behalf unprompted)

```bash
uv tool install --python 3.13 "headroom-ai[all]"   # or: pip install "headroom-ai[all]" in a venv; npm headroom-ai = TS SDK only, no CLI
headroom doctor                                      # health check
headroom proxy --port 8787                           # start the local proxy
```

| Harness | Route traffic through the proxy | `headroom_retrieve` |
|---|---|---|
| Claude Code | `headroom wrap claude` (starts proxy, sets `ANTHROPIC_BASE_URL`, registers Serena MCP for the project; undo `headroom unwrap claude`), or manually `ANTHROPIC_BASE_URL=http://127.0.0.1:8787 claude` with the proxy running | `headroom mcp install` registers the MCP tools `headroom_compress`, `headroom_retrieve`, `headroom_stats` |
| opencode | `headroom wrap opencode` (injects config, `unwrap` undoes), or add the npm plugin `headroom-opencode` in opencode.json: `"plugin": [["headroom-opencode", {"proxyUrl": "http://127.0.0.1:8787"}]]` (OpenCode 1.x; 2.x uses `plugins`). Non-OpenAI upstream: pass `--openai-api-url`. Exclude hosts with `HEADROOM_OPENCODE_EXCLUDE_HOSTS` | provided by the plugin as a tool |
| hermes | point Hermes' provider base URL at the proxy; proxy has Hermes tool-call unwrapping built in | copy `plugins/hermes/headroom_retrieve` from the repo into `~/.hermes/plugins/`, add `headroom` to `toolsets` and `headroom_retrieve` to `plugins.enabled` in `~/.hermes/config.yaml`, restart; also set `HEADROOM_EXCLUDE_TOOLS=read_file` on the proxy |
| pi | no first-class `wrap pi`. Run `headroom proxy` and set the provider base URL in pi's custom-provider config (`~/.pi/agent/models.json`) to `http://127.0.0.1:8787` (Anthropic- or OpenAI-compatible path matching the provider). `headroom wrap omp` exists for Oh My Pi | no pi plugin: either register the headroom MCP server if your pi build has MCP, or call the proxy directly: `POST http://127.0.0.1:8787/v1/retrieve` with the hash from the marker |

Verify provider routing with one real request before trusting it; check the harness' own docs for
the exact provider-config key names, they change between versions.

## `headroom_retrieve`

Compressed output carries a marker such as `[1500 items compressed to 50. Retrieve more: hash=abc123]`
or `<<ccr:abc123>>`. If the 50 items answer the question, stop. If you need omitted data, call
`headroom_retrieve` with the hash (bare hash or the whole marker both work); it returns the full
original. Do not re-run the original command, and do not `cat` the marker as a file path. Expired
hash (TTL) or unreachable proxy: re-run the original command. Never exclude `headroom_retrieve`
from the proxy's retrievable set (built-in defaults already protect it from re-compression).

## Verify savings

```bash
headroom doctor        # routing works
headroom perf          # latency/ratios
headroom savings       # tokens saved on your traffic
headroom dashboard     # live view (proxy running)
curl -s http://127.0.0.1:8787/stats   # loopback stats incl. recent_requests
headroom output-savings   # estimated output-token trimming (only with HEADROOM_OUTPUT_SHAPER=1)
```

Compare tokens before/after on a representative task and confirm task success is unchanged;
savings without the same answer is not a win. Reproduce vendor claims offline:
`uv run python benchmarks/index_proof_table.py --seed 20260902` (in the repo).

## Risks and mitigations

- **Telemetry on by default** (anonymous compression stats, OS/arch, model IDs; no prompts or
  paths). Disable: `HEADROOM_TELEMETRY=off` or `HEADROOM_BEACON=off` or `DO_NOT_TRACK=1` or
  `HEADROOM_OFFLINE=1`. Set before starting the proxy.
- **Man-in-the-middle for your API traffic.** The proxy sees prompts and forwards credentials.
  Keep it bound to loopback; never expose 8787 on a network; check plugin options so a
  remote `proxyUrl` is not used silently.
- **Lossy view of tool output.** The model may act on the compressed form. Exclude verbatim-needed
  tools (`HEADROOM_EXCLUDE_TOOLS=read_file,...`) and keep verification on real outputs (forge:verification).
- **Cache interplay.** Changing prompts mid-session can bust provider prefix cache; keep default
  `--mode cache`; output shaping and learned verbosity are opt-in.
- **Side effects of `wrap`/`learn`/`mcp install`.** They edit harness configs (e.g. `~/.claude.json`),
  register Serena, and write memory files. Prefer manual proxy + base URL first; use `unwrap` to undo.
- **Heavy install** (torch/HF model download for text compression with `[all]`). Use a lighter
  extra (`[proxy]`, `[mcp]`) if you only need JSON/log compression.
- Version-sensitive: flags and docs move fast (0.22/0.23 era); check `headroom --help` and
  https://docs.headroomlabs.ai/llms.txt before relying on a flag.

## Not ported

`plugins/headroom-agent-hooks` (Claude Code / Copilot startup hook that runs `headroom init hook ensure`)
and `plugins/headroom-snip` (Claude Code TUI mod showing live savings) are Claude-specific; install
from the upstream repo only if wanted.
