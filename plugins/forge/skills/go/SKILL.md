---
disable-model-invocation: true  # skl: on-demand pack skill
name: go
description: Idiomatic Go reference - error handling, interfaces, concurrency, context, package layout, and testing (table-driven tests, subtests, fakes, golden files, fuzzing, benchmarks, race detector). Use when writing, testing or reviewing Go code (go.mod, .go files), designing Go packages, debugging goroutine leaks or races, or adding tests to a Go module.
---

# Go

Reference idioms for writing and testing Go. How much code to write is governed by
forge:ponytail: Go's standard library covers most needs; a little copying beats a little
dependency. For build failures, the `go-build-resolver` agent; for review, the `go-reviewer` agent.

## Before writing

- Read `go.mod`: Go version (features like `for range n`, generics, `slices`/`maps`, `errors.Join`,
  `log/slog`, enhanced `http.ServeMux` patterns depend on it) and existing dependencies.
- Follow the package's existing error, logging and constructor style.
- `gofmt`/`goimports` always; `go vet ./...` before done; `golangci-lint` only if the repo has it.

## Principles

- Clear beats clever. Boring, predictable code is the goal.
- Return early: handle the error, keep the happy path at the left margin.
- Make the zero value useful (`var mu sync.Mutex`, `var buf bytes.Buffer` work without init).
- Accept interfaces, return concrete structs.
- Define interfaces where they are *consumed*, not next to the implementation, and keep them small
  (1-3 methods). Don't create an interface until there are two implementations or a test needs a
  fake.

## Errors

- Errors are values. Never discard one with `_` without a comment explaining why.
- Wrap with context: `fmt.Errorf("load config %s: %w", path, err)`. Lowercase, no trailing
  punctuation, no "failed to" chains at every level.
- Use `%w` only when callers should be able to inspect the cause; `%v` hides it deliberately.
- Inspect with `errors.Is(err, ErrNotFound)` and `errors.As(err, &target)`, never string
  comparison or `==` on wrapped errors.
- Sentinel errors (`var ErrNotFound = errors.New("not found")`) for conditions callers branch on;
  a custom error type only when callers need fields.
- `panic` is for programmer bugs and impossible states, not control flow. Don't panic in library
  code on bad input.
- Combine independent errors with `errors.Join` (Go 1.20+).

## Concurrency

- Every goroutine needs a clear exit: who stops it and how? A goroutine blocked forever on a send
  is a leak.
- `context.Context` is the first parameter (`ctx context.Context`), never stored in a struct.
  Respect `ctx.Done()` in loops and blocking selects.
- When a goroutine sends a single result that may be abandoned, use a buffered channel of size 1
  or `select { case ch <- v: case <-ctx.Done(): }`.
- `errgroup.Group` (golang.org/x/sync) for "run N things, cancel all on first error", with
  `g.SetLimit(n)` to bound concurrency. `sync.WaitGroup` when errors don't matter.
- Bound fan-out: a worker pool or semaphore, never one goroutine per input item from an unbounded
  source.
- Mutex vs channel: a mutex protecting a field is often simpler than a channel-based actor. Use
  channels to transfer ownership or signal, not as a general lock.
- Close a channel only from the sender side, and only once.
- Graceful shutdown: `signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)`, then
  `server.Shutdown(ctxWithTimeout)`.
- Run tests with `-race` whenever goroutines are involved.

## Packages and layout

- Package names: short, lowercase, singular, no `util`/`common`/`helpers`. Avoid stutter
  (`user.User` is fine, `user.UserService` stutters).
- `cmd/<name>/main.go` for binaries, `internal/` for code other modules must not import. A
  small tool can be a single `main` package - don't scaffold `pkg/`, `internal/` and `api/` for 300
  lines.
- Avoid package-level mutable state and `init()` side effects; pass dependencies explicitly.
- Keep `main` thin: parse flags/env, build dependencies, call `run(ctx) error`, exit non-zero on
  error.

## Structs and APIs

- Functional options (`New(addr, WithTimeout(5*time.Second))`) only for constructors with many
  optional settings and external callers. For internal code a config struct or plain arguments is
  simpler.
- Embedding for composition; don't embed to fake inheritance or leak methods unintentionally
  (embedding `sync.Mutex` in an exported struct exports `Lock`/`Unlock`).
- Pick pointer or value receivers per type and be consistent; pointer if any method mutates or the
  struct is large.
- Avoid naked returns except in very short functions.

## Performance (only when measured)

- Preallocate when size is known: `make([]T, 0, n)`.
- `strings.Builder` instead of `+=` in loops.
- `sync.Pool` only after a profile shows allocation pressure.
- Profile with `go test -bench . -benchmem -cpuprofile cpu.out` and `go tool pprof`.

## Testing

Use forge:tdd for the red-green loop. Go specifics - the standard `testing` package covers almost
everything; testify is fine only if the module already uses it.

- Table-driven tests with named subtests:

```go
func TestParse(t *testing.T) {
    tests := []struct {
        name    string
        in      string
        want    Config
        wantErr bool
    }{
        {"empty", "", Config{}, true},
        {"port", "port=80", Config{Port: 80}, false},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Parse(tt.in)
            if (err != nil) != tt.wantErr {
                t.Fatalf("Parse(%q) err = %v, wantErr %v", tt.in, err, tt.wantErr)
            }
            if got != tt.want {
                t.Errorf("Parse(%q) = %+v, want %+v", tt.in, got, tt.want)
            }
        })
    }
}
```

- Failure messages state input, got and want. `t.Fatalf` when continuing is pointless,
  `t.Errorf` otherwise.
- Helpers call `t.Helper()`; cleanup via `t.Cleanup`; temp files via `t.TempDir()`; env via
  `t.Setenv`.
- `t.Parallel()` for independent tests (since Go 1.22 the loop variable is per-iteration, so no
  `tt := tt` copy is needed).
- Fakes: a small struct implementing the consumer-side interface. No mocking framework needed.
- HTTP handlers: `httptest.NewRecorder()` + `httptest.NewRequest`; clients against
  `httptest.NewServer`.
- Golden files in `testdata/` with an `-update` flag to regenerate: `var update = flag.Bool("update", false, "...")`.
  Review regenerated goldens in the diff.
- Fuzzing (Go 1.18+) for parsers and decoders: `func FuzzX(f *testing.F)`, seed with `f.Add`,
  run `go test -fuzz=FuzzX -fuzztime=30s`. Failing inputs are saved under `testdata/fuzz/` - commit
  them as regression cases.
- Benchmarks: `func BenchmarkX(b *testing.B)`; use `b.Loop()` (Go 1.24+) or `for i := 0; i < b.N; i++`;
  `b.ReportAllocs()`. Compare runs with `benchstat`.
- Test through the exported API where possible; use a `_test` package (`package foo_test`) for
  black-box tests.
- No `time.Sleep` for synchronization: use channels, `sync.WaitGroup`, or injected clocks.
- `testing.Short()` + `go test -short` to skip slow integration tests locally.

## Commands

```bash
go build ./... && go vet ./...
go test ./...                       # all packages
go test -run 'TestParse/port' -v ./pkg/config
go test -race ./...                 # always for concurrent code
go test -count=10 -run TestFlaky ./...   # flush out flakiness (also bypasses cache)
go test -cover -coverprofile=c.out ./... && go tool cover -func=c.out
go test -bench=. -benchmem ./...
go test -fuzz=FuzzParse -fuzztime=30s ./pkg/parser
go mod tidy                         # after adding/removing imports
govulncheck ./...                   # if installed
```

## Review checklist

- [ ] No ignored errors; wrapping uses `%w` where callers inspect causes
- [ ] Every goroutine has an exit path; ctx is first param and honored
- [ ] Shared state guarded; `-race` clean
- [ ] No interface declared before it has a second implementation or a consumer need
- [ ] No package-level mutable state or `init()` side effects added
- [ ] Tests table-driven where cases vary only by data; error paths covered
