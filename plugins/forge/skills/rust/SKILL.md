---
disable-model-invocation: true  # skl: on-demand pack skill
name: rust
description: Idiomatic Rust reference - ownership, error handling, enums, traits, concurrency, async, crate layout, and testing (unit, integration, doc, async, property tests). Use when writing, testing or reviewing Rust code (Cargo.toml, .rs files), fixing borrow-checker or lifetime errors, choosing error crates, or adding tests and benchmarks to a crate.
---

# Rust

Reference idioms for writing and testing Rust. How much code to write is governed by
forge:ponytail: reuse what the crate already has, prefer `std` and existing dependencies, add no
abstraction nobody asked for. For build/compile failures, the `rust-build-resolver` agent;
for review, the `rust-reviewer` agent.

## Before writing

- Read `Cargo.toml` first: edition, MSRV (`rust-version`), existing deps (`anyhow`, `thiserror`,
  `tokio`, `serde`, `rstest`, `proptest`, `mockall`...). Use what is there; do not add a crate for
  a few lines.
- Match the crate's existing error style, async runtime and module layout.
- Run `cargo check` early and often; `cargo clippy --all-targets -- -D warnings` before done.

## Ownership and borrowing

- Take `&T` / `&str` / `&[T]` when you only read; take ownership (`String`, `Vec<T>`) only when
  you store or consume. `fn greet(name: &str)`, not `fn greet(name: String)`.
- `impl Into<String>` / `impl AsRef<Path>` on constructors and public APIs is fine; don't sprinkle
  it on private helpers.
- A `.clone()` added only to silence the borrow checker is a smell. Restructure first: shorten the
  borrow's scope, split the struct borrow, use indices, or move the value. Cloning an `Arc` or a
  small `Copy`-ish value is fine.
- `Cow<'_, str>` when a function usually returns its input unchanged and only sometimes allocates.
- Fight lifetimes on structs sparingly: an owned field is often simpler than `struct Foo<'a>`.

## Error handling

- `Result` + `?`. No `unwrap()` / `expect()` on fallible input in library or production paths.
  `expect("why this can't fail")` is acceptable for true invariants (poisoned mutex, a constant
  regex) and in tests.
- Applications: `anyhow::Result` with `.context()` / `.with_context(|| format!(...))` at each I/O
  boundary so the error chain says what was being done.
- Libraries: a typed error enum. `thiserror` if already a dependency; otherwise a plain enum with
  `impl Display` + `impl std::error::Error` + `From` impls is a few lines and adds no crate.
- Don't return `Box<dyn Error>` from a public library API; callers can't match on it.
- Never `let _ = fallible();` without a comment saying why the error is irrelevant.
- `bail!` / early `return Err(...)` for validation; keep the happy path unindented.

```rust
#[derive(Debug)]
pub enum StoreError { NotFound(String), Io(std::io::Error) }
impl std::fmt::Display for StoreError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotFound(id) => write!(f, "record not found: {id}"),
            Self::Io(e) => write!(f, "io: {e}"),
        }
    }
}
impl std::error::Error for StoreError {}
impl From<std::io::Error> for StoreError { fn from(e: std::io::Error) -> Self { Self::Io(e) } }
```

## Types, enums, matching

- Make illegal states unrepresentable: `enum State { Connecting { attempt: u32 }, Connected { session: String }, Failed { reason: String } }`
  instead of a struct with optional fields and a status flag.
- Match exhaustively on domain enums. A `_ =>` arm silently swallows new variants; list them.
- Parse, don't validate: convert raw input into typed structs at the boundary (serde, `FromStr`),
  then pass the typed value.
- Newtypes (`struct UserId(u64)`) where two same-typed arguments are easy to swap. Not for every
  integer.
- `Option`/`Result` combinators (`map`, `and_then`, `ok_or_else`, `unwrap_or_default`) over nested
  `match` when they read clearly; a `match` or `let else` is fine when they don't.
- `#[must_use]` on functions whose return value is the whole point.

## Traits and generics

- Accept generics/`impl Trait`, return concrete types.
- Generics (static dispatch) by default; `Box<dyn Trait>` / `&dyn Trait` for heterogeneous
  collections or to cut compile time/binary size.
- Don't introduce a trait with one implementation "for testability" unless a test actually needs a
  fake now. Concrete types are easier to read.
- Derive what's cheap and useful (`Debug`, `Clone`, `PartialEq`, `Default`); avoid deriving
  `Copy` on types that may grow.

## Over-engineering flags (small crates)

- Builder pattern for a struct with 2-4 fields: use a plain struct literal, `Default` +
  struct-update syntax (`Config { port: 8080, ..Default::default() }`), or `new()`.
- Typestate / PhantomData machinery for a CLI tool.
- `async` + tokio for a program that does a handful of sequential requests: blocking `std` or the
  existing client is fine.
- `Arc<Mutex<_>>` where single ownership or passing `&mut` works.
- A workspace with many crates for a few thousand lines.

## Iterators

- Iterator chains (`filter`/`map`/`collect`) for transforms; a `for` loop when there are side
  effects or early returns that make the chain awkward.
- `collect::<Result<Vec<_>, _>>()` short-circuits on the first error.
- Annotate the target: `let ids: HashSet<_> = ...collect();`.
- Avoid `collect()` just to iterate again; keep it lazy.

## Concurrency and async

- Threads: `std::thread::scope` lets threads borrow locals without `Arc`. Use `Arc<Mutex<T>>` only
  for shared mutable state that outlives the scope.
- Channels: `std::sync::mpsc::sync_channel(n)` (bounded, backpressure). Drop the original sender so
  the receiver loop ends.
- Async: never block the executor (`std::thread::sleep`, blocking file/network I/O, heavy CPU) -
  use `tokio::time::sleep`, `tokio::fs`, or `spawn_blocking`.
- Don't hold a `std::sync::MutexGuard` across `.await`; scope it or use `tokio::sync::Mutex`.
- Put timeouts on network calls (`tokio::time::timeout`). Propagate `JoinError` instead of
  ignoring it.
- Bound concurrency (`JoinSet`, a semaphore, `buffer_unordered(n)`) instead of spawning one task per
  item unbounded.

## Unsafe

Acceptable only at FFI boundaries or measured hot paths, each block with a `// SAFETY:` comment
stating the invariant, and `unsafe fn` with a `/// # Safety` doc section. Never to bypass the
borrow checker, never `transmute` between unrelated types. In edition 2024 the
`unsafe_op_in_unsafe_fn` lint warns by default: wrap unsafe operations inside an `unsafe fn` in an
explicit `unsafe {}` block.

## Layout and visibility

- Organize modules by domain (`auth/`, `orders/`), not by kind (`models/`, `utils/`).
- Default private; `pub(crate)` for internal sharing; re-export the public API from `lib.rs`.
- A binary with real logic: thin `main.rs`, logic in `lib.rs` so integration tests can reach it.

## Testing

Use forge:tdd for the red-green loop. Rust specifics:

- Unit tests live beside the code in `#[cfg(test)] mod tests { use super::*; ... }`; they can test
  private items.
- Integration tests in `tests/*.rs` (each file is its own binary; shared helpers in
  `tests/common/mod.rs`) use only the public API.
- Doc tests in `///` examples are compiled and run - keep them correct; `no_run` for examples that
  need I/O, `ignore` sparingly.
- Name tests for the behaviour: `rejects_email_without_at_sign`.
- Prefer `assert_eq!` / `assert_ne!` (shows both values) over `assert!(a == b)`. Use
  `assert!(matches!(err, MyError::NotFound(_)))` for enum variants.
- Tests may return `Result<(), Box<dyn std::error::Error>>` and use `?`.
- Test error paths with `is_err()` / `matches!`; use `#[should_panic(expected = "...")]` only for
  real panics.
- Async: `#[tokio::test]`; for time-dependent code use `#[tokio::test(start_paused = true)]` and
  `tokio::time::advance` instead of real sleeps (requires tokio's `test-util` feature).
- Fakes: a small hand-written struct implementing the trait is usually clearer than a mocking
  crate. Use `mockall` only if the project already does.
- Parameterized cases: a table (`for (input, want) in [(..), (..)]`) needs no crate; `rstest` if
  already present.
- Property tests (`proptest`) earn their keep for parsers, encoders, round-trips
  (`decode(encode(x)) == x`) and invariants (sorted output stays sorted).
- Benchmarks: `criterion` in `benches/` with `harness = false`; use `std::hint::black_box` to stop
  the optimizer deleting the work. Only benchmark code with a performance question.
- No `sleep` for synchronization; use channels, barriers or paused time.
- Keep tests independent: no shared mutable statics; use `tempfile`/`std::env::temp_dir` with a
  unique name for filesystem tests.

## Commands

```bash
cargo check                              # fast type check
cargo clippy --all-targets -- -D warnings
cargo fmt --check
cargo test                               # unit + integration + doc tests
cargo test name_substring -- --nocapture # filter, show stdout
cargo test --lib | --test api | --doc    # one kind
cargo test -- --ignored                  # slow/ignored tests
cargo tree -d                            # duplicate dependency versions
cargo llvm-cov                           # coverage (if cargo-llvm-cov is installed)
cargo audit                              # advisories (if cargo-audit is installed)
```

## Review checklist

- [ ] No `unwrap()`/`expect()` on external input outside tests
- [ ] Errors carry context; no silently discarded `Result`
- [ ] No clones that exist only to appease the borrow checker
- [ ] No blocking calls or `MutexGuard` held across `.await`
- [ ] Every `unsafe` has a `SAFETY:` comment with a real invariant
- [ ] Domain enums matched exhaustively
- [ ] `pub` surface minimal; new deps justified
- [ ] Tests cover the error path, not just the happy path
