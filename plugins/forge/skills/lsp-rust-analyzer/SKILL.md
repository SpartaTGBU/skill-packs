---
disable-model-invocation: true  # skl: on-demand pack skill
name: lsp-rust-analyzer
description: Install and wire the rust-analyzer language server for code intelligence (go-to-definition, references, diagnostics, rename) in Claude Code, opencode, and CLI fallbacks for pi and hermes. Use when working in a Rust crate (Cargo.toml, .rs) and you want type-aware navigation or diagnostics instead of grep, or when asked to set up Rust LSP.
---

# rust-analyzer LSP

rust-analyzer gives type-aware navigation and diagnostics for Rust. Use it for: finding the real
definition or all references of a symbol (not text matches), checking what a macro or trait impl
resolves to, and fast diagnostics after edits. Language rules and idioms: forge:rust. Compile
failures: `cargo check` remains the source of truth.

## Install

Check: `which rust-analyzer`. On this machine `~/.cargo/bin/rust-analyzer` exists but is only the
rustup proxy and fails with "Unknown binary 'rust-analyzer' in official toolchain" because the
component is not installed. Fix:

```bash
rustup component add rust-analyzer      # preferred, matches the toolchain
# alternatives: pacman -S rust-analyzer | mise use -g rust-analyzer
rust-analyzer --version                 # verify
```

## Wire it per harness

**Claude Code.** Register a language server through a plugin (`lspServers`), as Anthropic's
`rust-analyzer-lsp` plugin does. Its entry is:

```json
{ "lspServers": { "rust-analyzer": { "command": "rust-analyzer", "extensionToLanguage": { ".rs": "rust" } } } }
```

Put this under `lspServers` in a plugin's manifest/marketplace entry, or install the official
plugin. The binary must be on PATH for Claude Code's environment.

**opencode.** opencode ships built-in LSP support and starts rust-analyzer automatically when it
finds one for `.rs` files. To override or add, use the `lsp` key in `~/.config/opencode/opencode.json`
(currently that file has only `provider` config; add alongside it, do not replace it):

```json
"lsp": { "rust": { "command": ["rust-analyzer"], "extensions": [".rs"] } }
```

Set `"lsp": false` to disable. Verify the key names against the current opencode docs
(opencode.ai/docs/lsp) before editing; the schema has changed between releases.

**pi / hermes.** No native LSP client. Use the CLI fallbacks, run from the workspace root:

```bash
rust-analyzer diagnostics .          # compiler+analyzer diagnostics for the workspace
rust-analyzer analysis-stats .       # load the workspace, report inference stats and errors (slow, whole project)
rust-analyzer symbols < file.rs      # symbols of one file on stdin
cargo check --message-format=short   # authoritative errors
rg -n 'fn name|struct Name'          # navigation fallback when no LSP
```

`analysis-stats` is for health checks, not interactive lookup; prefer targeted `rg` plus
`cargo check` for everyday navigation.

## When to use

- Use LSP navigation for rename/refactor impact, trait-method resolution, and "who calls this".
- Do not rely on it for build truth; run `cargo check`/`clippy` (forge:verification).
- First load of a large workspace is slow; give it time before concluding it is broken.
