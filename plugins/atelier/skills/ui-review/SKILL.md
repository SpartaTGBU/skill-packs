---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-review
description: >
  Review UI (HTML, CSS, JSX/TSX, Vue, Svelte, or a running page) three ways: a file:line code
  audit against accessibility, keyboard, forms, states, motion, layout, performance and theming
  rules; a heuristic critique with anti-slop detection; and a polish pass. Output is a
  severity-ranked P0-P3 report. Use when asked to review, critique, audit or polish UI, check
  accessibility or UX, judge whether a design looks generic or AI-made, or before shipping a
  front-end change, or to check code against the Vercel Web Interface Guidelines.
---

# UI Review

Judge an interface against concrete rules and report verified findings ranked by user impact. This
is the UI lens. Use `forge:code-review` for correctness, tests, security and simplicity of the same
change. Design decisions belong to `atelier:visual-design`, building and fixes to `atelier:frontend-design`,
motion timing to `atelier:motion-design`, tokens to `atelier:design-systems`, and exploratory bug-hunting
in a running app to `forge:dogfood-qa`.

Rule catalog: [references/checklist.md](references/checklist.md) covers a11y, keyboard, forms,
states, animation, layout, typography, performance, hydration/locale/theming, UX rules (including
style fit by product type), premium polish, flag-on-sight anti-patterns, and AI-generated tells.
It includes every rule of the Vercel Web Interface Guidelines, so a "check against the Web
Interface Guidelines" request is an Audit run on this checklist; no fetch needed.

## Pick the mode

| Mode | When | Output |
|---|---|---|
| **Audit** | "review/audit this component/PR", pre-ship check | `path:line` findings + dimension ratings |
| **Critique** | "what do you think of this design", "does this look generic", a page or screenshot | heuristic ratings + prioritized issues |
| **Polish** | "make it feel finished", final pass before release | applied fixes + what changed |

If unclear, run Audit and Critique together; they share one report. Polish edits code, so confirm
scope first.

## Invoke

1. **Take the target**: files, a glob, a component, a diff, a URL or a screenshot. If there is none,
   ask which.
2. **Read the context**: the files in full (not grep-only), the stack (React, Vue, Svelte, plain
   HTML; Tailwind or CSS), and the design system (tokens, shared components, DESIGN.md). Note the
   product register: a *brand* surface (landing, launch, marketing) persuades, while a *product*
   surface (app, dashboard, settings, tools) gets work done. Rules on decoration and motion differ.
3. **Gather evidence**: if a browser or built page is available, screenshot at 320, 768 and 1280,
   in light and dark, and walk the main task by keyboard. The optional render/overflow/contrast
   checker in `atelier:diagrams` (`scripts/render-check.mjs`) can help. Otherwise review from code
   and say the findings are unrendered.
4. **Run the mode** (sections below), using the checklist for mechanical rules.
5. **Verify every finding** in the code or render before reporting. No speculative items; mark
   likely false positives `verify`.
6. **Write the report** (format at the end).

## Severity

| Level | Meaning | Examples |
|---|---|---|
| **P0 Blocking** | Prevents task completion or locks a user out | no keyboard path, unlabeled control, contrast fail on core text, zoom disabled, data loss, broken submit |
| **P1 Major** | Significant difficulty; fix before release | missing error/empty states, focus lost in dialog, CLS jumps, confusing primary action |
| **P2 Minor** | Annoyance with a workaround | inconsistent spacing, weak hover, vague label |
| **P3 Polish** | Nice to fix | optical alignment, `...` for `…`, `tabular-nums` |

Tie-break: "would a user contact support or give up?" means P1 or above. An a11y failure that
blocks an assistive-tech user is P0 even if sighted mouse users are fine.

## Audit: dimension ratings

Rate each dimension 0-4 (0 broken, 1 major gaps, 2 partial, 3 good with minor gaps, 4 solid):

1. **Accessibility**: names, semantics, contrast, focus, keyboard, reduced motion, zoom.
2. **Performance**: layout thrash, unvirtualized lists, unsized media, render-blocking, Web Vitals budgets.
3. **Theming**: tokens over hard-coded values, dark mode designed and checked, consistent scale.
4. **Responsive**: 320-1280 without overflow, touch targets, safe areas, adapted not shrunk.
5. **Implementation integrity**: uses the project's components and tokens, every state is
   implemented, no one-off duplicates, no dead affordances.

No totals or grades: the findings' severities carry the verdict. Any P0 means block.

## Critique: heuristic ratings

Rate Nielsen's ten heuristics 0-4 each:
1. Visibility of system status.
2. Match with the real world: the user's words, not internal jargon.
3. User control and freedom: undo, cancel, back.
4. Consistency and standards.
5. Error prevention.
6. Recognition over recall.
7. Flexibility and efficiency: shortcuts and bulk actions.
8. Aesthetic and minimalist design.
9. Error recovery messages.
10. Help and documentation.

Mark a heuristic `n/a` when it has no surface. Rate honestly: a 4 means you looked for problems
and found none. Give one line of evidence per rating; report only those rated 0-2.

**Design specificity verdict** (pass/fail): could this screen belong to any product, or only this
one? Scan for the AI-generated tells in the checklist. Three or more on one screen is a fail; name
each tell and what a decided alternative would be (route the redesign to `atelier:visual-design`).
Also check:
- **Product fit**: the style matches the product type (checklist "UX rules"): a bank that looks like
  a game launcher, or an admin tool dressed as a landing page, is a P1 even if each part is clean.
- **Hierarchy**: the primary action is identifiable in 2 seconds. Squint test: blur the screen and
  see whether the important things still separate.
- **Composition**: rhythm from varied spacing; no uniform card grid by reflex; alignment is intentional.
- **Copy**: specific labels; errors that say how to fix; no filler or hype words (`forge:humanizer` for prose).

**Cognitive load**: count the decisions at each step; working memory holds about 4 items. Flag:
- walls of equal-weight options;
- essential actions hidden behind menus;
- jargon or internal names;
- visual noise that competes with the task;
- the same pattern done three ways;
- no progressive disclosure on long forms.

**Lenses**: walk the main task three times, as a first-time user (is the next step obvious, is
empty state helpful), a power user (keyboard, bulk, speed, no forced animations), and a user with a
screen reader or keyboard only (names, order, announcements, focus return). Each walk names where it
stalls.

## Polish pass

Polish finishes a working design; it does not redesign. If the critique fails the specificity
verdict, stop and route to `atelier:visual-design` first.
1. **Establish the system**: find the tokens, spacing scale, type scale and shared components.
   Every fix uses them. If they are missing or contradictory, note it; do not invent a parallel one.
2. **Gather evidence**: screenshots, the audit findings, the state inventory (default, hover,
   active, focus, disabled, loading, empty, error, success, long content).
3. **Triage**: fix P0/P1 first; then the polish items that a user notices in the first minute.
4. **Polish the whole path**, not one screen:
   - flow and hierarchy (one primary action per view);
   - layout and spacing on the scale, then optical nudges; more space between groups than within;
   - a restrained palette: neutrals carry the UI, one accent for action and focus;
   - layered depth from one elevation scale (stacked low-opacity shadows, one light source);
   - real imagery (product screenshots, real photos) instead of stock illustration filler;
   - type steps, line length, wrapping and numerals;
   - color from tokens, contrast in both themes, consistent icon set and stroke;
   - interaction: every state present, feedback within 100ms, motion per `atelier:motion-design`;
   - content and code: real copy, `…`, no dead links, no console errors, no one-off styles.
   Details for each item: checklist "Premium polish".
5. **Verify**: re-screenshot the same views, re-run the keyboard walk, confirm no regressions,
   and run `forge:verification` before claiming done.

Keep changes inside the existing stack; add no library to polish (see `forge:ponytail`).

## Report format

Terse, no preamble, no praise padding. Sections in this order, omitting any that are empty:

```
## Ratings
Audit: a11y 2, perf 3, theming 2, responsive 3, integrity 3
Weak heuristics: status 2 (no save feedback), errors 1 (raw codes) | Specificity: fail (gradient hero, 3-card grid, glow borders)

## Summary
P0 1 | P1 3 | P2 5 | P3 4
Top issues: icon buttons unlabeled; dialog loses focus; no empty state on /projects
Next: fix P0/P1, then rerun the keyboard walk

## Findings
### P0
src/components/IconButton.tsx:14  a11y/name - icon-only button has no accessible name -> add aria-label
### P1
src/routes/login.tsx:40  forms/label - placeholder used as label -> add <label>, autocomplete="current-password"
src/styles/card.css:22  motion/transition-all - transition: all -> list transform, opacity
### P2 / P3 ...

## Patterns
Hard-coded hex in 9 files bypasses tokens -> one sweep to theme vars

## Working well
Form validation copy is specific and actionable

## Actions
1. ... (ordered, each tied to finding ids)
```

Finding lines are `path:line  category/rule - what is wrong -> fix`, greppable, grouped by severity
and then by file. Critique findings without a code location use `screen/area` in place of `path:line`.
Pass-only files are listed as `path: pass`. Mark uncertain items `verify`. Keep "Working well" to
the 1-3 strongest things, so the fixer knows what to protect.
