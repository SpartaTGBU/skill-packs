---
disable-model-invocation: true  # skl: on-demand pack skill
name: motion-design
description: >
  Motion for interfaces: timeline choreography and staggered reveals, easing and duration tokens,
  springs, micro-interactions, enter/exit, gestures, view transitions and scroll-driven motion, with
  reduced-motion paths and a frame-by-frame review. Use when adding or reviewing animation on a page
  or component, picking easing or durations, sequencing a hero or onboarding reveal, making a UI
  "feel alive", or building drawers, toasts, popovers or drag gestures. Lottie/Rive and sprites go to
  atelier:2d-animation; rendered video to atelier:video-composition.
---

# Motion Design

Motion is a layer on a finished static design, not a substitute for one. Every animation earns its
place, uses physics instead of template keyframes, and runs on the project's existing stack.
`atelier:visual-design` owns the static design and the MOTION_INTENSITY dial; `atelier:frontend-design`
builds; `atelier:ui-review` audits; `atelier:mobile-native` owns platform-native motion (SwiftUI,
Compose); `atelier:video-composition` owns video, B-roll and rendered motion-graphic clips.

References (code and depth):
- [references/web-springs.md](references/web-springs.md): spring easings, tactile press, stretch highlight, 3D tilt, scroll-reveal stagger, perspective scroll-3D, content swap, reduced-motion backstop.
- [references/scroll-patterns.md](references/scroll-patterns.md): sticky stack, horizontal pan, reveal stagger skeletons, forbidden scroll patterns.

## Invoke

1. **Classify the medium**: web UI (this file + web-springs/scroll-patterns); authored vector or
   sprite animation, Lottie, Rive (`atelier:2d-animation`); math or algorithm explainer
   (`atelier:math-animation`); generative art (`atelier:generative-art`); native app
   (`atelier:mobile-native`); anything rendered to video (`atelier:video-composition`).
2. **Classify the surface.** Persuade/experience surfaces (landing, launch, onboarding) may carry one
   rehearsed focal sequence. Operate/read surfaces (dashboards, tools, docs, settings) get feedback
   and state motion only, fast and quiet.
3. **Set the budget** from MOTION_INTENSITY: 1-3 hover/press only; 4-7 transform+opacity transitions
   and staggered load-ins; 8-10 scroll choreography. Motion claimed, motion shown: above 4 the page
   really moves; otherwise drop to 3 and ship clean static. Never half-build (cut-off triggers,
   jumpy entrances, missing cleanup).
4. **Write the motion thesis** in 2-4 lines before code: the focal moment, what stays continuous,
   what gives feedback, and the budget. "Fade-rise on every section, lift on hover" is not a thesis.
5. **Justify each animation in one sentence** (rule below), check frequency, implement with the
   lightest tool, gate reduced motion, verify.

## The one rule: motion must be motivated

Valid reasons: **hierarchy** (draw the eye), **feedback** (acknowledge an action), **continuity**
(same object across a state change), **state** (something changed), **storytelling** (narrative
reveal). "It looked cool" is not a reason. One orchestrated moment beats scattered effects. If
removing an animation loses only decoration, not meaning, remove it.

## Should it animate at all? (frequency)

| How often the user sees it | Decision |
|---|---|
| 100+ times/day (keyboard shortcuts, command palette, list navigation by key) | No animation |
| Tens of times/day (hover, tab switches, frequent menus) | Remove or cut to ~100ms |
| Occasional (modals, drawers, toasts, popovers) | Standard motion |
| Rare or first-time (onboarding, success, empty-state reveal) | Delight allowed |

Never animate keyboard-initiated actions. Speed is the product on tools people use all day.

## Choose the material by meaning

Continuity: shared element, FLIP, `view-transition-name`. Focus and depth: bounded blur, shadow,
scale. Reveal: masks and `clip-path`. State: the smallest change that shows it (color, icon swap,
one property). One strong idea per moment; do not stack fade+slide+scale+blur by reflex.

## Easing

Decision order:
- Entering or exiting: **ease-out** (fast start reads as responsive).
- Moving or morphing on screen: **ease-in-out**.
- Hover and color changes: **ease**. Constant motion (progress, marquee): **linear**.
- Never **ease-in** on UI: it delays the first frames the eye watches.

Built-in CSS curves are weak. Use stronger ones as tokens:
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
--ease-settle: cubic-bezier(.2, .8, .2, 1);
--ease-overshoot: cubic-bezier(.34, 1.56, .64, 1); /* one tiny overshoot, sparingly */
```
No elastic or large-overshoot bounce on product UI.

## Duration

| Element | Duration |
|---|---|
| Button press, toggle feedback | 100-160ms |
| Tooltip, small popover | 125-200ms (instant, no delay, once one is already open) |
| Dropdown, select, menu | 150-250ms |
| Routine state change | 150-300ms |
| Modal, drawer, layout shift, view transition | 200-500ms |
| Authored focal entrance (persuade surfaces only) | 500-800ms |

Keep interactive UI under 300ms and never over ~400ms. Exit faster than entrance (~60-75%).
Asymmetric: slow where the user decides (hold-to-confirm press), fast where the system responds
(release, dismiss). Stagger 30-80ms between siblings, at most ~8 children (else animate the
container); stagger is decorative and never blocks interaction.

## Timeline and choreography

Treat any multi-element moment (hero load, onboarding step, modal with content, success state) as
a timeline, not a pile of independent transitions.

1. **Beat sheet first.** List beats in order with start time and duration, e.g.
   `0ms headline 400ms | 120ms subhead 350ms | 240ms CTA 300ms | 360ms visual 500ms`. Total for a
   focal sequence 600-1200ms; a routine reveal under 500ms. Nothing important waits past ~1s.
2. **Overlap, do not queue.** Start the next beat when the previous is 40-70% done (offset
   `-=0.2s` in GSAP terms, or `delay` steps in CSS). Strict back-to-back sequencing feels slow.
3. **Order by reading path**: the primary element leads, supporting elements follow, the action
   lands last so it reads as the conclusion. Large elements move less and slower; small ones move
   more and faster.
4. **Stagger rules**: 30-80ms per sibling (40ms for lists, 60-80ms for cards); cap at ~8 animated
   children, then animate the group; total stagger spread under ~400ms. Stagger from the origin
   of attention (top-left, the clicked item, or center-out for grids), not always index order.
5. **One motion vocabulary per sequence**: same direction (rise 8-24px or slide from one side),
   same easing token, distances scaled to element size. Mixing up/left/scale in one reveal is noise.
6. **Hold and settle**: let the final state rest; no secondary loops after the sequence ends.
7. **Implement with the lightest tool**: CSS `animation-delay` via `--i` index
   (`animation-delay: calc(var(--i) * 50ms)`) or `@starting-style`; WAAPI with `delay` for JS
   control; a GSAP timeline only when it is already in the project or the sequence needs
   scrub/pin/labels. Library-agnostic beat sheets port to any of them.

Easing vocabulary for sequences (map to the tokens below): entrances `--ease-out` 300-500ms;
moves between positions `--ease-in-out` 400-600ms; exits ease-out at 60-75% of the entrance
duration; scrubbed scroll beats `linear` (the scroll is the easing); camera-style pushes
`--ease-in-out` 600-900ms, persuade surfaces only.

## Springs and physicality

- Springs for anything gesture-driven, interruptible, or that should feel physical. Motion:
  `{ type: "spring", duration: 0.5, bounce: 0.2 }` or `stiffness ~100, damping ~20`. Bounce 0.1-0.3
  only for drag and playful elements; a dashboard stays crisp. Springs keep velocity when retargeted.
- **Never `scale(0)`.** Enter from `scale(0.9-0.97)` + `opacity: 0`; nothing in the world appears from nothing.
- **Origin-aware popovers**: scale from the trigger (`transform-origin: var(--radix-popover-content-transform-origin)` or the library's equivalent). Centered modals are exempt.
- **Press**: `:active { transform: scale(0.97) }` over ~160ms ease-out on every clickable (or `translateY(1px)`).
- **Leading and trailing edges ride different springs**: a moving highlight or underline stretches (front fast, back slow) then settles. This one trick makes motion read as physical.
- **One continuous object**: morph size, radius and color of one element instead of cross-fading two.
- **Content swap** inside a container: out ~120ms, in ~220ms with `filter: blur(2px)` masking the crossfade; keep blur under ~20px (expensive, and Safari suffers).
- **Focus scale**: the active item scales up slightly while neighbors dim and recede.

## Interruptibility

CSS transitions retarget mid-flight; keyframe animations restart from zero. Use transitions (or
springs) for anything the user can trigger rapidly: toasts, toggles, hover, drawers. Use
`@starting-style` for entry animation without JS. Content is visible by default: a failed or late
script must never leave the page hidden at `opacity: 0`.

## What to animate and how

- Only `transform` and `opacity` (plus `filter` and `clip-path` where they carry meaning). Never
  `top/left/width/height/margin/padding`; never `transition: all`, list the properties.
- `translateY(100%)` is relative to the element itself: use it for drawers and toasts of unknown height.
- `clip-path: inset()` gives cheap reveals, hold-to-delete fills, tab color sweeps and before/after sliders.
- `will-change: transform` only while animating, and never on anything a zoom scales (blurred text).
- Do not drive many children through a CSS variable on the parent (style recalc on every child);
  set `transform` on the element itself.
- Framer Motion `x`/`y` shorthands animate on the main thread; under load prefer a full `transform`
  string, CSS, or WAAPI (`element.animate()`), which gives JS control at compositor performance.
- Scroll: CSS scroll-driven animations (with a fallback), then IntersectionObserver, then GSAP
  ScrollTrigger only for real pin/scrub. Scroll-linked motion only when the scroll relationship
  carries meaning. No `scroll` listeners for animation, no scroll position in React state.
- Pointer-driven values (tilt, spotlight, magnetic) go through CSS custom properties in a
  rAF-throttled handler, or motion values / `useSpring`; never per-frame React state.
- Expensive effects stay in an isolated region; nonessential loops pause offscreen
  (IntersectionObserver) and on `visibilitychange`.

## Gestures and drag

Dismiss on distance or velocity (a flick above ~0.11 px/ms dismisses even if short). Damp past
boundaries (rubber-band) instead of hard stops. Use pointer capture once a drag starts; ignore extra
touches mid-drag; disable text selection and set `inert` on the dragged element. Return to rest on a spring.

## Hover and interaction

Gate hover motion with `@media (hover: hover) and (pointer: fine)` so touch does not get stuck
states. Directional fills and underlines enter from the pointer's side. 3D tilt: clamp to 6-9deg on
a `perspective: 800-1200px` parent, return on a spring (large tilt is a tell). Perpetual loops
(pulse, float, shimmer) only for real live-state indicators.

## Hard bans

Bouncy or elastic easing on product UI; ease-in on UI; `scale(0)` entrances; particles; glows and
neon; gradients on UI chrome; purposeless infinite loops; custom cursors; animated layout
properties; motion that delays the user or hides weak hierarchy; more than one marquee or
scroll-hijack per page; animating keyboard actions; adding GSAP, Motion or any library because it
is installed or fashionable. Use what the project already has; add a dependency only when the
platform cannot do it and the user agrees.

## Accessibility (non-negotiable)

`prefers-reduced-motion: reduce` means fewer and gentler animations, not zero: keep opacity and
color changes that aid comprehension, drop movement, parallax, tilt, scroll-hijack, loops and
magnetic physics. Write per-component reduced blocks (`useReducedMotion()` in Motion); the global
`animation-duration: .001ms` catch-all is only a backstop. Pause control for autoplay over 5s. Keep
`:focus-visible` rings and never animate them away. Never convey information by motion alone.

Reduced-motion mapping for sequences: slides and scales become a 150-200ms opacity fade (or an
instant swap); staggers collapse to one group fade; parallax and scroll-scrubbing render the end
state; loops and Lottie/Rive autoplay show a meaningful static frame; view transitions become a
crossfade. Also honor in-app motion settings and the OS setting changing mid-session (listen to
the media query, do not read it once). No flashing above 3 times per second, ever (WCAG 2.3.1).

## Cohesion

Match the product's personality once and apply it everywhere: one set of easing tokens, one
duration scale, one spring. Playful products may bounce slightly; tools, finance and dashboards are
crisp and fast. Mixed personalities on one page read as assembled from parts.

## Verify

- Screenshot rest and mid-interaction (or mid-scroll) states.
- Slow it down 2-5x (DevTools Animations panel or a duration multiplier) and watch every frame:
  origin, overlap, swap timing, settle.
- Interrupt it: click rapidly, reverse mid-flight, repeat 20 times; it retargets and never janks.
- Keyboard path and touch path both work; gestures tested on a real device.
- 60fps in the performance panel on a mid-range throttle profile; only transform/opacity/filter
  in the animation; no blurred scaled text; cleanup on unmount.
- Reduced-motion path exists and was actually toggled (DevTools rendering emulation or Playwright
  `reducedMotion: 'reduce'`); screenshot both paths at the same timestamp.
- For sequences, capture frames at each beat boundary (pause via WAAPI `currentTime` or the
  library's seek) and check order, overlap and the final rest state against the beat sheet.
- Each animation still has its one-sentence reason; re-run the slop diagnostic from
  `atelier:visual-design` so motion is not hiding a composition problem.
- Look again with fresh eyes later; motion that felt good at minute one often grates by minute twenty.

## Review output

When asked to review motion, report as a table: `before | after | why`, one row per change, using
the rules above. Report in that table only. Do not use separate "before:" and "after:" lines.

## Video and B-roll

Motion-graphic cutaways, product clips, B-roll and anything rendered to video belong to
`atelier:video-composition`; cutting real footage goes to `atelier:video-editing`. Teaching
animations go to `atelier:math-animation`, Lottie/Rive/sprites to `atelier:2d-animation`, seeded
canvas art to `atelier:generative-art`.
