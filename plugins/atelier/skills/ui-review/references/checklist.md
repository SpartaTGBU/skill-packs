# UI review checklist

<!-- Merges the Vercel Web Interface Guidelines (github.com/vercel-labs/web-interface-guidelines @ 434b7f9, MIT; license in LICENSE-web-interface-guidelines.txt) with atelier rules. -->

Mechanical rules for the code audit. Apply each section that has a surface in the target; skip the
rest. Each item is a candidate finding: confirm it in the code before reporting.

## Accessibility and semantics

- Icon-only buttons and links have `aria-label`; decorative icons `aria-hidden="true"`; informative images have meaningful `alt`, decorative `alt=""`.
- `<button>` for actions, `<a>`/router links for navigation; never `<div onClick>`. Links are real links (middle-click and open-in-new-tab work).
- Landmarks (`header nav main aside footer`), one `h1`, headings in order, a skip-to-content link; `scroll-margin-top` on anchored headings.
- Form controls have a `<label>` (or `aria-label`), the right `type`, `name` and `autocomplete`; `inputmode` where relevant; never `placeholder` as the only label.
- Async updates (toasts, validation, live results) use `aria-live="polite"`. State is never conveyed by color alone.
- Contrast: body text 4.5:1, large text (18px+ or 14px+ bold) and UI components 3:1. Check placeholders, disabled states, ghost buttons, text over images, focus rings, both themes.
- Dialogs and popovers trap and return focus, close on Escape, and label themselves; menus, tabs, comboboxes follow the ARIA keyboard pattern.
- Page works at 200% zoom and 400% reflow (320 CSS px) without loss of content.
- Meaningful media has captions, transcripts or descriptions as applicable; media controls work by keyboard; decorative media is hidden from assistive tech.
- Brand names, code tokens and identifiers carry `translate="no"` so auto-translation does not garble them.

## Focus and keyboard

- Every interactive element is reachable and operable by keyboard with a visible `:focus-visible` ring. Never `outline: none` without a replacement; `:focus-within` for compound controls.
- Focus order matches visual order; no positive `tabindex`; no keyboard traps; custom widgets implement arrow keys.
- Autofocus sparingly (desktop, single primary input); never steal focus on load on mobile.
- Sticky headers, footers and overlays never cover the focused element (`scroll-padding-top` / `scroll-margin`).

## Forms

- Inputs 16px+ on mobile so iOS does not zoom. Never `user-scalable=no` or `maximum-scale=1`.
- Never block paste. Disable spellcheck on emails, codes and usernames.
- Submit stays enabled until the request starts, then shows progress and disables; Enter submits single-input forms; checkbox/radio and label share one hit target.
- Errors inline beside the field, specific, with a fix; focus moves to the first error on submit; warn before leaving with unsaved changes. Required state is marked. Placeholders show an example ending in `…`.
- Labels above inputs; helper text in markup; correct `type` (`email`, `tel`, `url`, `number`) and specific `autocomplete` tokens (`email`, `username`, `current-password`, `one-time-code`).
- `autocomplete="off"` on non-auth fields that would otherwise trigger password managers.

## Interaction states and feedback

- Every interactive element has default, hover, active/pressed, focus-visible, disabled; add loading, error, success where they apply. Hover increases contrast; `:active` gives tactile feedback.
- Loading uses skeletons or spinners shaped like the content; labels end with `…` ("Saving…"); buttons keep their width while loading. Empty, error and success states exist. No `window.alert`.
- Destructive actions confirm or offer undo. Optimistic updates reconcile on failure. Mutations are idempotent or de-duplicated.
- Touch: `touch-action: manipulation`; deliberate `-webkit-tap-highlight-color`; hit targets 44x44px (24px absolute minimum with spacing); `overscroll-behavior: contain` in modals, drawers, sheets.
- Hover-only affordances have a touch and keyboard equivalent.
- Drag, swipe, pinch and path gestures have a tap/click and keyboard alternative unless the gesture is essential. During drag, disable text selection and mark dragged elements `inert`.
- Page rubber-band suppression only on fine pointers: `overscroll-behavior: none` on `<html>` inside `@media (pointer: fine)`; keep coarse-pointer defaults for pull-to-refresh, and test hybrid touch devices (`none` also disables scroll chaining and swipe navigation).
- URL reflects state (filters, tabs, pagination, expanded panels) so it can be shared and survives refresh.
  Deep-link stateful UI: if it lives in component state, consider URL sync (for example `nuqs`).

## Animation

- `prefers-reduced-motion` honored per component. Animate only `transform` and `opacity` (plus meaningful `filter`/`clip-path`); list properties, never `transition: all`; correct `transform-origin`.
- Interruptible, never blocks interaction; nothing enters from `scale(0)`; no bounce/elastic easing on product UI; content visible if the script fails.
- SVG transforms on a `<g>` wrapper with `transform-box: fill-box`. Timing and easing: `atelier:motion-design`.
- Autoplaying motion longer than 5s alongside other content has pause, stop or hide controls; muted decorative loops stop under `prefers-reduced-motion`.

## Layout and responsive

- No horizontal scroll; verify at 320, 768, 1280. `min-h-[100dvh]` not `100vh`; `env(safe-area-inset-*)` with `viewport-fit=cover` for full-bleed.
- Flex/grid over JS measurement; long content truncates (`truncate`, `line-clamp-*`), wraps, or gets `min-w-0`; handle empty, 1-item and very-long-string cases.
- Images have `width`/`height` or `aspect-ratio`; below-fold `loading="lazy"`; the LCP image preloaded with `fetchpriority="high"`.
- `<video autoplay muted loop playsinline>` instead of animated GIF, with a still alternative; for short non-essential loops add a Safari H.264 MP4 source and a `prefers-reduced-motion` media condition with a still fallback.
- No unwanted scrollbars: fix the overflowing content first, `overflow-x: hidden` on the container only as the last step.
- A documented z-index scale; spacing from the scale, not arbitrary values; optical alignment of icons and play buttons (1-2px nudges).
- Adapted, not shrunk: mobile reorders and simplifies; no hidden-but-essential features.

## Typography and content

- `…` not `...`; typographic quotes; non-breaking spaces between number and unit (`10&nbsp;MB`, `⌘&nbsp;K`); `tabular-nums` in number columns; `text-wrap: balance` or `pretty` on headings.
- Body line length 45-75ch; body 16px+; clear hierarchy from size and weight steps, not color alone.
- Sentence case; active voice; specific button labels ("Save API key", not "Continue"); errors say what happened and how to fix it; numerals for counts.
- Second person, not first; `&` over "and" only where space is tight. Vercel's guidelines prefer Title Case for headings and buttons; follow the product's existing convention, default sentence case.
- Content survives real data: long names, URLs, zero items, 10,000 items.

## Performance

- Virtualize or paginate lists over ~50 items (`virtua`, `content-visibility: auto`); no layout reads (`getBoundingClientRect`, `offsetHeight`) interleaved with writes in render or scroll paths; throttle controlled inputs on heavy forms; no context re-render storms.
- `preconnect` for critical third-party origins; critical fonts preloaded with `font-display: swap`; heavy libraries lazy-loaded; no render-blocking scripts.
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1.

## Hydration, locale, theming, meta

- Controlled `value` has `onChange`; otherwise use `defaultValue` (prefer uncontrolled inputs; controlled ones must be cheap per keystroke); date/time/random output guarded against server-client mismatch; no `localStorage` reads in first render. `suppressHydrationWarning` only where truly needed.
- Dates, numbers, currency, lists via `Intl.*`; language from `Accept-Language`/`navigator.languages`, not IP.
- Colors from tokens, not hard-coded hex; dark mode is designed (not inverted): `color-scheme` on `<html>`, matching `<meta name="theme-color">`, explicit colors on native `<select>`, contrast checked in both modes.
- `<title>` and meta description per route; `lang` on `<html>`; `rel="noopener"` on `target="_blank"`.

## UX rules

- **Style fits the product type.** Dashboards and admin tools: dense, neutral, data-first, minimal decoration. Marketing and consumer: one expressive idea, generous space. Finance, health, legal, gov: conservative, high-contrast, no playful motion, trust signals near every commitment. Dev tools: mono for code only, keyboard-first. Kids/games may be loud; nothing else should be by default.
- **Navigation and IA**: the user can always tell where they are (active nav state, page title, breadcrumbs past depth 2) and how to get back; labels use the user's words, not internal names; at most about 7 top-level items.
- **Visibility of state**: every action gives feedback within 100ms; work over 1s shows progress; long jobs are cancellable and survive a reload.
- **Error prevention over error messages**: constrain inputs (pickers, masks, sensible `inputmode`), confirm or undo destructive actions (prefer undo), disable submit only with a visible reason.
- **Errors that help**: say what happened and how to fix it, next to the field, in plain language; keep the user's input.
- **Consistency**: the same action has the same name, icon and position everywhere; platform conventions win over novelty.
- **Fitts**: primary actions large and near the user's focus or thumb; destructive actions away from frequent ones; 44x44px minimum target, 8px between targets.
- **Progressive disclosure**: show the 20% used 80% of the time; advanced options behind one clear affordance, never hidden in hover.
- **Recognition over recall**: recent items, autocomplete, visible options; no codes the user must remember between screens.
- **Sensible defaults**: pre-fill what is known, pick the safe/common option, remember last choices.
- **Empty, first-run and zero-data states** teach the next action; no blank tables.
- **Forgiveness**: drafts autosave; navigating away from unsaved work warns once.

## Premium polish

- **Optical spacing**: spacing on the scale (4/8pt), then nudged by eye: icons beside text often need 1-2px vertical offset; rounded or triangular shapes need slight overshoot to look aligned; space between groups is clearly larger (about 2x) than space within a group.
- **Restrained palette**: neutrals carry most of the UI, one accent for primary action and focus, semantic colors only for status; roughly 60/30/10 neutral/secondary/accent. One gray family, slightly tinted toward the accent or brand.
- **Layered depth**: an elevation scale of 3-5 levels used consistently; each shadow is 2-3 stacked layers (tight contact shadow plus soft ambient), low opacity (about 4-12%), tinted to the background hue, one consistent light source. In dark mode raise elevation with lighter surfaces, not bigger shadows.
- **Real imagery**: product screenshots, real photos or data over stock illustration and abstract blobs; one consistent treatment (crop ratio, radius, color grade); correct dimensions and responsive sources; meaningful alt text; licensed assets only.
- **Type finish**: tight tracking on large headings, tabular numerals in tables, balanced headings, no orphans in key copy, at most 2 families and 3 weights.
- **Edges and detail**: consistent radii by size (nested radius = outer minus padding), hairline borders at 1px device pixel, crisp icons on the pixel grid, focus rings that match the brand.
- **Micro-interactions**: hover and press states on every interactive element, 150-250ms ease-out, nothing that blocks input.

## Flag on sight

`transition: all`; `outline: none` alone; `<div>`/`<span>` click handlers; images without dimensions;
icon buttons without a name; placeholder-as-label; blocked paste; disabled zoom; `...` for `…`;
hard-coded date/number formats; hover-only affordances; `autoFocus` everywhere; large lists rendered
whole; inline `<style>` per render; dead `#` links; color-only error states; hard-coded colors that
bypass tokens; one-off components duplicating a design-system component.
Also: inline `onClick` navigation without `<a>`; `.map()` over large arrays without virtualization;
animated GIF where compressed video fits; gesture-only actions with no tap/keyboard path.

## AI-generated tells (anti-slop)

Each one is weak alone; three or more on a screen means the design was not decided.
- Indigo/violet-to-pink gradients, gradient text on headings or metrics, cyan-on-dark neon glow.
- Glassmorphism by default; purple-tinted shadows; glow borders.
- Centered hero + three identical icon cards + logo strip + testimonial grid + gradient CTA band.
- Cards nested in cards; everything in a rounded card with the same radius and shadow.
- Thick colored side-stripe borders on cards and alerts; pill badges on everything.
- Hero metric layout (giant number, small label, sparkline) with no decision attached.
- Emoji or generic line icons as section headers; sparkle icons for "AI".
- Inter/system font with no type scale; one weight; gray text on colored backgrounds.
- Bounce or elastic easing; fade-up on every section; perpetual pulse/float loops.
- Copy: "Elevate", "Seamless", "Unleash", "Supercharge", "Effortless"; rule-of-three taglines; placeholder testimonials; made-up stats.
- Modals for everything; generic illustrations; dark mode as the only theme because it "looks techy".
