---
disable-model-invocation: true  # skl: on-demand pack skill
name: lsp-gopls
description: Install and wire gopls, the Go language server, for definitions, references, diagnostics and safe rename in Claude Code and opencode, with gopls CLI fallbacks for pi and hermes. Use when working in a Go module (go.mod, .go) and you want type-aware navigation or refactoring instead of grep, or when asked to set up Go LSP.
---

# gopls LSP

gopls provides type-aware navigation, diagnostics and rename for Go. Use it for real "find all
references", interface implementers, and compiler-checked renames. Language rules: forge:go;
`go build ./... && go vet ./...` remains build truth (forge:verification).

## Install

Check: `which gopls`. On this machine Go 1.27.1 is installed (mise) but `gopls` is NOT on PATH.

```bash
go install golang.org/x/tools/gopls@latest     # installs to $(go env GOPATH)/bin
# or: mise use -g gopls   |   pacman -S gopls
export PATH="$PATH:$(go env GOPATH)/bin"       # ensure it is on PATH for the harness too
gopls version
```

## Wire it per harness

**Claude Code.** Via a plugin `lspServers` entry (Anthropic's `gopls-lsp` plugin):

```json
{ "lspServers": { "gopls": { "command": "gopls", "extensionToLanguage": { ".go": "go" } } } }
```

**opencode.** Built in: opencode starts gopls automatically for `.go` files when it is
installed. To configure explicitly, add an `lsp` key next to the existing `provider` block in
`~/.config/opencode/opencode.json` (do not replace the file):

```json
"lsp": { "go": { "command": ["gopls"], "extensions": [".go"] } }
```

Verify key names against current opencode docs (opencode.ai/docs/lsp).

**pi / hermes.** No native LSP; use the gopls CLI from the module root (positions are `file:line:col`):

```bash
gopls check ./path/file.go                 # diagnostics for files
gopls references ./path/file.go:12:6       # all references to the symbol at that position
gopls definition ./path/file.go:12:6
gopls implementation ./path/file.go:12:6   # interface <-> implementers
gopls symbols ./path/file.go
gopls rename -w ./path/file.go:12:6 NewName   # applies the rename; omit -w to preview a diff
gopls workspace_symbol Name                 # may be named `workspace_symbol` or `query` by version; see `gopls help`
```

Always preview renames (no `-w`) and run `go build ./... && go test ./...` afterwards.

## When to use

- Rename, find-references and implementer lookup across packages.
- Not for build truth or formatting (`gofmt`/`goimports`, `go vet`).
