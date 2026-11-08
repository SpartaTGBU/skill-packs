---
disable-model-invocation: true  # skl: on-demand pack skill
name: visual-design
description: >
  Art direction and visual systems for UI with concrete numbers: type scales and leading,
  OKLCH color roles and contrast, spacing scale, grids and breakpoints, radius and elevation,
  imagery, brand-reference tokens from real sites, and a redesign audit for existing UIs.
  Use when choosing or fixing typography, color, spacing or layout, when asked to "make it look
  like Stripe/Linear/Vercel", when a UI looks generic or AI-made, or when upgrading an
  existing design without breaking it.
---

# Visual Design

Decide what a UI looks like and set the systems that hold it together. `atelier:frontend-design`
owns direction, anti-slop and build quality; `atelier:motion-design` owns movement;
`atelier:design-systems` owns formal token files; `atelier:ui-review` audits finished code.

References (read only the one the task needs):
- Anti-slop rules, dials, hard limits, pre-flight:
  [references/taste-rules.md](references/taste-rules.md)
- Process, surface archetypes, slop diagnostic, deck/prototype rules: [references/design-doctrine.md](references/design-doctrine.md)
- Existing-site audit and upgrade order: [references/redesign-audit.md](references/redesign-audit.md)
- Official systems vs aesthetic, default stack: [references/design-system-picks.md](references/design-system-picks.md)
- Pattern vocabulary, glass, grain, perf: [references/materials-and-patterns.md](references/materials-and-patterns.md)
- Brand catalog + font substitutes: [references/brand-catalog.md](references/brand-catalog.md), per brand
  `references/brands/<site>.md`

## Invoke
1. **Classify the job:** greenfield, redesign-preserve (keep brand, modernize),
   redesign-overhaul (new look, same content/IA), or brand-referenced. Ask once if a redesign's
   brand stance is ambiguous. Refinement preserves; redesign replaces.
2. **Gather context first:** brand docs, screenshots, theme/token files, real components,
   copy. Context beats vibes.
3. **Commit to a surface** in one line: Monitor, Operate, Compare, Configure, Decide/Learn,
   Explore, Command/Inspect. Composition comes before color; hero + three cards suits
   Decide/Learn only.
4. **Set dials** (variance, motion, density) per taste-rules.md sections 1–2.
5. **Plan, then attack** the plan per `atelier:frontend-design` section 3.
6. **Build, then diagnose** with the slop score in design-doctrine.md; repair in the register
   the tells call for.
7. **Verify visually** at 1440/768/390, both themes if present. Report what you checked.

## Type system
- **Families:** one or two. Pairing needs contrast in structure (serif + grotesk, wide +
  narrow), not two similar sans. Choose for the subject; Inter or "a serif because creative"
  are not choices. Monospace only for code, data and tables.
- **Scale:** at most 5 sizes; most screens need 2–3 working sizes.
  - Operate/Read: ratio 1.125–1.2 (e.g. 12/14/16/20/24).
  - Persuade/Experience: ratio 1.25–1.333+ (e.g. 16/20/28/40/64); headline-to-body ≥ ~4:1
    for posters and heroes.
  - Display max 6rem (96px); use `clamp()` for fluid display, fixed sizes for UI text.
- **Body:** 16–20px (never under 16px for prose; 14px only for dense UI), leading 1.45–1.6,
  measure 45–75ch (target ~65ch). Leading moves inverse to measure: narrower column, tighter.
- **Display:** leading 0.85–1.05, tracking -0.02 to -0.04em (floor -0.04em). Larger means
  tighter; use optical-size axes (`font-optical-sizing: auto`) where the font has them.
- **Labels:** 12–14px; if uppercase is truly needed, +0.04–0.08em tracking and keep it rare.
  Statement text ≤ 36px desktop / 24px phone, about 25 words.
- **Light on dark:** +0.05–0.1 leading, +0.01em tracking, one weight step up for thin faces.
- **Data:** `font-variant-numeric: tabular-nums` in tables, counters, prices; right-align numbers.
- **Paragraphs:** space between or first-line indent, never both. `text-wrap: balance` on
  headings, `pretty` on body. Hierarchy via size, weight and space before boxes or color.
- **Loading:** self-host, subset, only the weights used (usually 2–3), `font-display: swap`,
  metric-matched fallback (`size-adjust`, `ascent-override`) so swap causes no CLS.
- **Stress:** long words, translations, 200% zoom, fallback font.

## Color system
- **Roles, not swatches:** canvas, surface steps (2–3), text primary/secondary/disabled,
  border, action/accent, focus, selection, status (success/warning/danger/info), data series.
- **Proportions:** one ground, one ink, one accent. Roughly 60–70% ground, 20–30% surfaces
  and ink, ≤ 10% accent. Spend the accent on action and state, not decoration. Lock one
  accent and one neutral family page-wide.
- **Build in OKLCH:** neutrals tinted toward the brand hue (chroma 0.005–0.02); lower chroma
  near white and black to avoid muddy or neon extremes; generate steps by lightness. Write
  explicit colors per step instead of chained alpha overlays.
- **Contrast (never cut):** body text 4.5:1, large text (≥ 24px, or ≥ 18.66px bold) 3:1,
  UI components and focus indicators 3:1 against neighbors. Check hover, disabled, placeholder
  and selected states in both themes. Secondary text on a colored surface derives from that
  hue, not grey.
- **Never color alone:** pair with icon, text, pattern or position; check deuteranopia and
  protanopia (red/green status pairs especially).
- **Dark mode is composed, not inverted:** ground around L 0.15–0.22 rather than #000, text
  around L 0.9–0.95 rather than #fff; elevation shows as lighter surfaces, not shadows;
  desaturate the accent slightly. Theming remaps tokens; components never branch on theme.
- **Data color:** sequential = one hue by lightness; diverging = two hues around a neutral;
  categorical ≤ 6–8 distinguishable hues, then label directly.

## Spacing
- 4px base; scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. No off-scale values.
- Rhythm comes from contrast: tight inside groups (4–12), generous between groups (24–48),
  large between sections (desktop 120–240, phone 64–96).
- Proximity before containers: group with space first, then tone steps, then borders, and
  cards last. Squint test: groups must read with the text blurred.
- Space above a heading ≥ 1.5–2× the space below it.
- Siblings use `gap`, not margins on children. Outer page margins 16–32px, equal on both sides.

## Layout
- **Widths:** prose ~65ch; content 1120–1280px; full-bleed only for imagery or deliberate bands.
- **Grid:** 12 columns desktop, 8 tablet, 4 phone; gutters 16–24px phone, 24–32px desktop.
  Keep 2–3 shared left edges per page; everything else aligns to them.
- **Breakpoints:** design at 390, 768, 1024, 1440. Change structure at breakpoints (reorder,
  collapse, swap patterns), not only size. Use container queries for components that live in
  several contexts.
- **Alignment:** left-aligned by default; at most one centered moment. DOM and focus order
  match visual order.
- **Nav:** 56–72px tall; wordmark, 3–5 links, one action.
- **Hero:** fits the first viewport at 1440×900 and 390×844 with the primary action visible;
  one dominant image or device. Consistent crops and aspect ratios across a set; square
  media is a safe default.
- **Optical corrections:** nudge play icons right, align cap height not box, hang punctuation
  and bullets, overshoot round shapes slightly.
- Never vary section layout only for variety's sake; vary when content differs.

## Shape and depth
- **Radius language:** pick one and map it to size: e.g. 0–4px sharp, 6–8px soft, or full pill.
  Buttons square or pill; avoid the generic 9–16px everything-radius. Nested radius =
  outer radius − padding.
- **Elevation:** surfaces separate by tone steps at rest. Shadows only on floating layers
  (menus, popovers, dialogs, toasts, dragged items), with offset and blur, tinted to the
  ground, 2–3 levels max. No hairline rules between every row; use space or tone.
- **Materials:** translucency and blur only where they signal hierarchy (a sheet over content),
  with a solid fallback and sufficient text contrast; never decorative glass.
- **Icons:** one set, one stroke width (1.5 or 2px at 24px), sized to the text cap height.

## Imagery
Priority: the client's own images, then generated images for this subject, then credited
open archives, then visuals drawn in code from real data, then type and color alone. No fake
product shots or fake UI built from divs. One dominant image per view; explicit dimensions;
gradients only as a scrim behind text on photos.

## Premium polish
What separates expensive-looking from merely correct, applied after the system is set:
- **Optical spacing over metric spacing.** Measure what the eye sees, not the box. A button
  with a leading icon takes ~2–4px less padding on the icon side; all-caps labels and
  tabular figures need ~1px more top padding than the line box gives; a triangle or play
  glyph centers on its visual mass (shift ~6–10% of its width); circles and pointed shapes
  overshoot squares by ~2–4% to look the same size. Large display type gets tighter
  tracking (−0.01 to −0.03em) and smaller tight-cased labels get looser (+0.02 to +0.06em).
- **Restrained palette.** Usually one neutral family, one accent, status colors, nothing else.
  Pure #000 and #fff read cheap on screens; use near-black and off-white tinted toward the
  brand hue. Saturation is spent in one place per view. Avoid the stock "premium" defaults
  (beige-and-brass luxury, purple-to-blue AI gradient, neon on black) unless the subject
  actually earns them. One palette per project; never mix warm and cool greys.
- **Depth from layered shadows.** One heavy blurred shadow looks pasted on. Stack 2–3: a
  tight contact shadow (y 1px, blur 1–2px, alpha ~0.06–0.10), a mid shadow (y 4–8px,
  blur 8–16px, ~0.06), and an optional ambient one (y 16–24px, blur 32–48px, ~0.04).
  Tint them toward the ground hue instead of pure black. Pair a raised surface with a 1px
  inner highlight or hairline border (white ~6–10% in dark mode) so edges hold on any
  background. Glass needs that inner border, a solid fallback under
  `prefers-reduced-transparency`, and text contrast measured over the busiest backdrop.
- **Real imagery over filler.** Real product screenshots, photos of the actual subject and
  real data beat stock illustration, abstract blobs, 3D gradient orbs and emoji icons. If
  the asset does not exist yet, ship a labeled placeholder at the final aspect ratio
  ("Product screenshot, 16:10") rather than a decorative stand-in, and log the asset as
  needed. Every image is licensed and credited where required (never cut).
- **Details that compound.** Consistent icon optical size; hover and press states on every
  control (press ~0.97–0.98 scale or 1 tone step); focus rings offset 2px; numbers set in
  tabular figures; selection color themed; scrollbars and form controls styled through
  `accent-color` and `color-scheme`, not left to defaults.

## Style by product category
Default starting posture when the brief gives none; the subject and the brief still win.

| Category | Posture | Type | Color and density |
|----------|---------|------|-------------------|
| Fintech, banking | Trust, restraint, precision | Neo-grotesk, tabular figures | Cool neutrals, one deep accent; medium density |
| Developer tools | Fast, dense, keyboard-first | Grotesk UI, mono for code and data | Dark-capable, low chroma, single bright accent |
| Health, wellness | Calm, legible, reassuring | Humanist sans, body ≥ 17px | Soft tinted neutrals, high contrast text; airy |
| E-commerce, consumer | Product-led, imagery first | Clear sans, strong price hierarchy | Neutral ground so product color leads |
| Luxury, fashion | Space, slowness, editorial | High-contrast serif display + quiet sans | Near-monochrome, minimal accent; very airy |
| News, editorial, docs | Reading first | Text serif or sturdy sans, ~65ch measure | Paper-like ground, ink text, link accent |
| Enterprise, B2B dashboards | Clarity at density | Established system type | Established system tokens (see out of scope) |
| Education, kids | Friendly, forgiving | Rounded sans, large sizes | Brighter palette, larger hit targets, rounded shapes |
| Creative, portfolio, agency | Distinct, experiential | Expressive display face | Bold or unusual palette; motion via `atelier:motion-design` |
| Gov, civic, nonprofit | Plain, inclusive, robust | System or civic fonts, large | AAA-leaning contrast, minimal decoration |

Run any choice through the UX basics regardless of category: touch targets ≥ 44px, visible
focus, labels on inputs, readable measure, motion that respects `prefers-reduced-motion`.

## Brand-referenced work
Nearest catalog entry: dev tools (Linear, Vercel, Supabase, Raycast, Sentry); docs/content
(Mintlify, Notion, Sanity); marketing (Stripe, Framer, Apple, SpaceX); dark (Linear, Cursor,
ElevenLabs, Warp); light/clean (Vercel, Stripe, Notion, Cal); playful (PostHog, Figma,
Lovable, Zapier); premium (Apple, BMW, Stripe, Revolut); data-dense (Sentry, Kraken,
ClickHouse). Read its file, lift tokens into CSS variables, keep its weights, tracking and
radius language (they carry more identity than the typeface), substitute fonts from its notes.
Borrow posture, not proprietary layouts or assets. Token-file deliverables go to
`atelier:design-systems`.

## Redesigning an existing UI
Record the "before" (screenshots at all three widths, current tokens and IA), run
redesign-audit.md, then fix in order: font and type scale, palette cleanup, hover/active and
focus states, layout and spacing, generic components, loading/empty/error states, polish.
Stay in the existing stack; no framework migration (`forge:ponytail`). Never silently change
URLs, nav labels, form field names or order, logo, legal/consent copy, or analytics hooks.
Never regress accessibility. Compare before/after side by side and click through everything
that worked before.

## Out of scope
Dense dashboards, data grids, wizards, code editors and realtime collaboration need an
established system (Fluent, Carbon, Polaris, Material); native mobile goes to
`atelier:mobile-native`. Say so, point at design-system-picks.md, and apply only the type, color,
state and copy rules here.
