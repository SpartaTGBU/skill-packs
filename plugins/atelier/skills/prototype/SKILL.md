---
disable-model-invocation: true  # skl: on-demand pack skill
name: prototype
description: >
  Build throwaway code that answers one design question fast - a single-file clickable HTML demo
  for logic and state models, 3-5 structurally different UI variants on a real route behind a
  keyboard picker, or risk-ordered feasibility spikes - then record the verdict and keep only the
  decision. Use when the user wants to sanity-check a state machine, data shape or flow, explore
  what a screen should look like, compare directions, asks "is this even possible", or says
  "spike", "prototype", "mock it up", "show me options".
---

# Prototype

A prototype is **throwaway code that answers one question**. The question decides the shape. It
skips the plan/review/test process on purpose; what it produces is a *decision*, not a deliverable.

## Pick the branch

Name the question first (from the user's words or the surrounding code; ask if they're around).
One question per run; a second question is a second prototype.

| Question | Branch |
|---|---|
| "Does this logic / state model feel right?" | **Logic prototype**: one HTML file driving a pure module through hard cases |
| "What should this look like?" / "Show me options" | **UI prototype**: 3-5 variants on one route, switchable by picker |
| "Is this even possible?" / "A or B?" | **Feasibility spike**: read [references/feasibility-spikes.md](references/feasibility-spikes.md) |

If ambiguous and the user isn't reachable, match the surrounding code (backend module -> logic;
page/component -> UI) and state the assumption at the top of the prototype.

## Rules for every branch

1. **Throwaway, and visibly so.** Put it near where the real code will live, but with `prototype`
   in the path or filename. Follow the project's routing/layout conventions.
2. **Trivial to run.** One task-runner command, or one file to double-click.
3. **No persistence by default.** State lives in memory. If persistence *is* the question, use a
   scratch DB or file named "PROTOTYPE - wipe me".
4. **No production polish.** No tests, no error handling beyond staying runnable, no abstractions,
   no generalising for "later".
5. **Surface the state.** After every action or variant switch, show the relevant state.
6. **Write the question into it** (intro text or top-of-file comment) so the answer can be checked
   later, even asynchronously.
7. **Real content.** Realistic names, numbers, lengths and edge cases; never lorem ipsum. Long
   names, empty lists and error states are where designs break.

## Logic prototype

For business logic, state transitions or data shape: things that look fine on paper and feel wrong
once pushed through real cases.

1. **Isolate the logic as a pure, liftable module** in one `<script>` block, shaped to the question:
   a reducer `(state, action) => state` for discrete events; an explicit state machine when "which
   actions are legal now" matters; pure functions over plain data when there's no current state; a
   small class only when the logic genuinely owns ongoing state. No DOM inside it; the page calls
   in, nothing flows back. This module is the part worth keeping.
2. **Build one HTML file**: inline HTML/CSS/JS, no framework, bundler, server or CDN, so it opens by
   double-click and survives being emailed. Every label in **domain language**, not code names.
   Top to bottom:
   - title plus one-line question;
   - **current state** as a labelled panel (not raw JSON), re-rendered after every click, with the
     change highlighted;
   - **free-play buttons**, one per action, always available;
   - **guided walkthroughs**, one tab per scenario: setup, what to watch for, the ordered buttons.
     Starting one resets to a known state. Cover the happy path, a tricky edge case, and an attempt
     at something that should be illegal.
   Restrained: readable type, one accent colour, no animation.
3. **Hand it over** (absolute path, or open it). The valuable moments are "wait, that shouldn't be
   possible" and "huh, I assumed X" - bugs in the *idea*. Add actions or scenarios as asked.

## UI prototype

### 1. Recon (2 minutes)
Read the stack, component library, tokens and the page the design will live in. Reuse them so the
variants are judged in real context. With no project, default to neutral greys, one accent and the
system font stack.

### 2. Host
- **Existing route (strongly preferred):** render variants on the real page, keeping its data
  fetching, params and auth; only the subtree under question swaps. An empty route hides problems a
  populated page exposes.
- **Otherwise:** a throwaway `/prototypes/<slug>` route under the project's routing convention, or
  a single HTML file when there's no dev server.
- Plan in one line in a top-of-file comment: "Four variants of the settings page on `/settings`,
  diverging on density."

### 3. Diverge on a named axis
Pick the axis the question is really about: **layout, information density, personality, motion,
or interaction model**. Each variant takes a clearly different position on it.
- Default 3 variants, max 5. Name them by direction ("Quiet", "Editorial", "Dense", "Sidebar"),
  not A/B/C.
- Structurally different: hierarchy, layout, primary affordance. If two differ only in colour or
  copy, replace one with an explicit constraint ("no card grid", "single column").
- Don't share layout code between variants; a shared header or data hook is fine.

### 4. Craft bar (every variant, not just the favourite)
A sloppy variant loses for the wrong reason. Each one gets:
- real interactions (hover, focus, pressed, empty and loading states where relevant);
- focus-visible rings, keyboard reachability, AA contrast, hit targets >= 44px on touch;
- motion, if any: ease-out entrances (never ease-in), UI motion < 300ms, animate only
  `transform`/`opacity`, correct `transform-origin`, a `prefers-reduced-motion` fallback.
Details: atelier:frontend-design, atelier:motion-design.

### 5. Picker
Show **one variant at a time, full size, in real context** - never side-by-side thumbnails. Swaps
are instant. One shared picker, visually distinct from the design, hidden in production builds:
- dark pill fixed at bottom-centre (`bottom: 24px`, ~`rgba(10,10,10,.82)` with a 12px backdrop
  blur), items ~28px tall in 13px system font, label shows `2 - Editorial`;
- active highlight slides (~250ms, `cubic-bezier(0.23,1,0.32,1)`) only after first paint; instant
  under reduced motion;
- keys: `1`-`N` jump, `←`/`→` cycle with wrap, `R` replays entrance motion. Ignore keys while an
  input, textarea, select or contenteditable has focus, or while a modifier key is held;
- selection lives in the URL (`?v=2`, via the framework's router) so it is shareable and
  reload-stable; switching re-mounts the variant so entrance motion replays;
- `data-position="top"` (move to top-centre) when a variant's own UI occupies bottom-centre.

### 6. Read-only
Point any mutation at a stub; the question is the look, not the backend.

### 7. Verify, present, stop
- Flip through every variant yourself: clean console, no layout breaks at mobile and desktop
  widths; screenshot each if a browser tool is available.
- If two variants converged, cut one and say so.
- Hand over the URL and keys plus a table, then stop - no favourite unless asked:

| # | Variant | Axis position | When it's right | Its cost |
|---|---|---|---|---|

Expect "header from Editorial, list from Dense" - that remix is the actual design. Riff again
around the chosen direction if asked.

## Capture the answer, then clean up

1. **Record the verdict**: question, answer, why - in the design doc, ticket or commit message.
2. **Keep the prototype as a primary source off main**: commit it to `prototype/<name>` and leave
   a pointer where the decision is recorded.
3. **Main keeps only the decision.** Logic: lift the pure module through the normal process. UI:
   rebuild the winner properly in the real page; delete the losers, the picker and any throwaway
   route.
4. **Never promote prototype code directly.** Prototype to production is a new request: back
   through forge:brainstorming, then built per forge:ponytail and forge:tdd, checked with
   atelier:ui-review and forge:verification.

## Anti-patterns

- Tests, real database writes, frameworks or servers in a logic demo.
- Logic tangled with the page so it can't be lifted out.
- Variants that differ only in colour or copy, or named A/B/C with no stated axis.
- Side-by-side thumbnails instead of full-size, in-context swaps.
- Lorem ipsum, or one polished variant next to sloppy ones.
- Picking a favourite unprompted, or answering two questions in one prototype.
- Leaving variants, pickers or prototype routes in main.
- "It works, let's keep building on it" without going back through the gate.
