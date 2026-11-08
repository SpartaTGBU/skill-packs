---
disable-model-invocation: true  # skl: on-demand pack skill
name: frontend-design
description: >
  Builds distinctive, production-quality front-ends: a subject-grounded aesthetic direction,
  anti-slop rules, UI copy, craft details, and stack-agnostic implementation quality (states,
  responsive, accessibility, performance budgets), checked by rendering and looking. Use when
  building or restyling a landing page, app screen, dashboard, component or any UI where the
  look matters, when a design reads as generic or AI-made, or before shipping front-end work.
  Pairs with atelier:visual-design (systems and numbers) and atelier:motion-design.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Make deliberate, brief-specific choices about palette, type, layout and copy so the result
could not be mistaken for a template. Numbers for type, color, spacing and layout live in
`atelier:visual-design`; movement lives in `atelier:motion-design`. The brief's own words always
win, including when it asks for a look this skill calls a default.

**Name the bottleneck first.** Work that lands fixes one real constraint, not everything at
once. Before touching code, say which one this job is about and spend most effort there:
- **Taste:** it reads generic or AI-made → sections 1–5.
- **Consistency:** values drift, components disagree → section 8 tokens and component library,
  `atelier:design-systems`.
- **Performance:** slow first paint, janky input, layout shift → section 8 performance budget.
- **Usability:** states missing, copy unclear, inaccessible → sections 6–8, `atelier:ui-review`.
The other axes still must not regress; they just do not get the redesign.

## 1. Ground it in the subject
- If the brief does not name the product, audience and primary job, propose one concrete
  reading and confirm. Use what you know about the user's context as a hint.
- Inventory 8–12 facts specific to the subject: materials, vernacular, artifacts, numbers,
  the people who use it. Distinctive choices come from here, not from a house style.
- Pick the mode from the surface, not the product: **Persuade** (landing, launch),
  **Operate** (app screens, tools), **Read** (docs, articles), **Experience** (portfolio,
  campaign). Operate screens may use quiet borders, small labels and repeated panels that a
  Persuade page should refuse.
- Pick light or dark from the scene of use (lit office, night console, outdoors), never by
  category ("dev tools are dark").

## 2. Write the argument before the layout
- One claim plus its proof per section. A section with no claim gets deleted.
- Write the idea sentence: "On this page, [subject thing] becomes [device]." Competitor test:
  if a rival product could ship the same page by swapping the logo, the idea is a default.
- The first screen answers the visitor's first question, carries an `h1`, and has exactly one
  primary action. Headline at most 2 lines at every width (about 32 characters); supporting
  sentence 32–48px below it, about 20 words.
- Write the copy deck (headline, section claims, CTAs, empty/error strings) before markup.
- Never invent proof: no fake logos, quotes, statistics, "99.99%", "Acme", "John Doe". Use
  real content or clearly labeled placeholder slots.

## 3. Plan the direction, then attack it
Write a compact plan:
- **Color:** 4–6 named values (ground, ink, one accent, surface steps, status).
- **Type:** one or two families, each with a role; a second family must do something the
  first cannot.
- **Layout:** one-sentence concept plus an ASCII wireframe per key screen; alignment
  (left-aligned by default, at most one centered moment).
- **Principles:** 2–3 lines on what makes this page specific.

Then attack it: run a similar prompt through mentally. If you land in the same place, that
part is a default; revise it and say what changed. Generated design currently clusters on:
1. warm cream (~#F4F1EA) + high-contrast serif + terracotta/clay accent (~#D97757);
2. near-black with one acid-green or vermilion accent;
3. broadsheet hairlines, zero radius, dense newspaper columns;
4. the SaaS-card kit: identical rounded cards, one radius everywhere, `rgba(0,0,0,.1)`
   shadow under each, gradient washes; also violet/indigo "AI glow";
5. template chrome: tracked ALL-CAPS eyebrow over every heading, `A · B · C` meta strings,
   `WORD — fragment` labels, #0B0B0B/#111 as black, monospace for small labels, `→` on links.
Each is legitimate when the brief chooses it; where the brief leaves an axis free, do not
spend that freedom on one of these. When torn between refined and committed, commit.

## 4. Restraint and the one memorable thing
- Spend boldness in one place: one element (hero device, type treatment, image, live demo)
  is memorable; everything around it is quiet. Before shipping, remove one accessory.
- The hero opens with the most characteristic thing in the subject's world. A big number +
  small label + gradient is the default treatment; use it only if it truly is best.
- Optionally one live interactive thing built on real content: works on a phone, has a no-JS
  fallback, never blocks reading.
- Motion: one orchestrated moment beats scattered effects. Per-section fade-up and hover
  lifts on every card read as generated. Responsive motion that shows what changed is fine.
- Fullness: every section carries full content; at most one deliberate empty rest per page;
  no void wider than half a screen unless something closes it. The footer is a designed close.

## 5. Refuse by default (unless the brief or real content asks)
- Identical icon cards in threes; nested cards; cards where elevation means nothing.
- The hero-metric template; sparklines or fake charts as filler; `<div>`-built fake
  screenshots, dashboards or terminals.
- Eyebrows. Allow one only if it encodes real information. No 01/02/03 unless the content is
  a real sequence; no section-number labels, scroll cues, version tags, decorative status dots.
- Gradient text; styled accent word in a headline (one word italic/colored); decorative glass;
  floating pill nav; grain anywhere but a fixed `pointer-events: none` overlay.
- Border-left accent stripes over 1px; hard offset shadows outside an intentional
  neobrutalist brief; shadows at rest on non-floating elements.
- Monospace as costume (fine for code, data, tables); Impact/Arial Black as display; tiny
  tracked uppercase labels; more than two typefaces.
- Emoji as icons; mixed icon sets or stroke widths; blobs and fake organic masks;
  hand-drawn decorative SVG unless asked; loaded or hate symbols as decoration, ever.
- Modals where inline or a page would do; zigzag image/text beyond two sections in a row;
  the same section layout twice; sections that flip theme mid-page.
- Pure `#000`/`#fff` as ground/ink by default; neon or colored glow shadows.
Brand exception: keep a real brand asset that breaks a rule, and say so in the report.

## 6. Copy is design
- User's vocabulary, not the system's: "notifications", not "webhook config". Plain, specific
  beats clever. Sentence case, active voice, no filler verbs (Elevate, Seamless, Unleash).
- CTAs say what happens: "Save changes", not "Submit". An action keeps one name through the
  flow: "Publish" produces "Published".
- Errors state the problem and the recovery, in the interface's voice; never apologize, never
  vague. Empty states say what to do next. Each string does one job; re-read every visible
  string before shipping. Avoid em dashes as a stylistic crutch.

## 7. Craft details
- Theme the browser surfaces: `::selection`, `caret-color`, scrollbars, focus rings,
  `text-underline-offset`, `accent-color` for native controls, `color-scheme`.
- Press feedback, popover origins, tooltip timing and all easing/duration rules:
  `atelier:motion-design` (canonical).
- Gate hover effects with `@media (hover: hover) and (pointer: fine)` so touch does not stick.
- More space above a heading than below it. `text-wrap: balance` on headings, `pretty` on body.
- Controls explain themselves; visible limits and hints tied with `aria-describedby`.
- Review again with fresh eyes (next session, or after a break): unseen details compound.

## 8. Implementation quality (ponytail)
Match the repo's framework, styling method, components and tokens first; read real ones
before writing. Follow `forge:ponytail`: no new UI or animation library unless asked or clearly
earned, smallest complete change. On redesigns keep the stack, content, URLs and what works.
- **Component library.** If the project ships one (shadcn/ui, Radix, Headless UI, MUI,
  a local `components/ui/`), compose its primitives; do not hand-roll a dialog, popover,
  select, combobox, tabs, toast or tooltip it already provides, since focus trapping, escape,
  portal and ARIA wiring are the hard part. Add missing pieces the library's own way (e.g.
  the shadcn CLI copies source into the repo), then restyle through tokens, never by forking
  internals. Never ship a library's default look unstyled: radius, color, shadow and type
  come from the project's direction. One library per tree.
- **Tailwind.** Use the configured theme scale and the project's semantic tokens
  (`bg-background`, `text-muted-foreground`, `border-border`), not arbitrary values
  (`bg-[#3b82f6]`, `p-[13px]`). Tokens live in CSS variables so dark mode is a variable swap,
  not `dark:` pairs on every element. Compose repeated clusters into components, not
  `@apply` soup. Match the installed major version (v4 `@theme` in CSS vs v3 config file).
- **States.** Hover, `:active`, `:focus-visible`, disabled, loading (skeletons shaped like
  content), empty, error (inline, specific), success. Dead `#` links, `alert()` and instant
  color flips are bugs.
- **Responsive.** Mobile-first; Grid and `gap` over percentage math; `min-height: 100dvh`;
  container queries for components; structural changes per breakpoint, not just shrinking;
  no horizontal scroll at 320px; touch targets ≥ 44×44px (24px absolute minimum with spacing);
  safe-area insets for full-bleed.
- **Accessibility (never cut).** Semantic HTML (`button` acts, `a` navigates, landmarks, one
  `h1`, ordered headings); visible labels (no placeholder-as-label); alt text; contrast 4.5:1
  body, 3:1 large text and UI/focus indicators, in every state and both themes; color never the
  only signal; DOM and focus order match visual order; `prefers-reduced-motion` and
  `prefers-color-scheme` honored; never disable zoom; works at 200% zoom.
- **Tokens.** Color, type, spacing, radii, shadows, z-index as variables or the framework
  theme, semantic names (`--surface`, `--text`, `--accent`), light and dark defined explicitly;
  no magic hex in components.
- **Performance budget (never cut).** Targets at p75 on a mid-range phone over 4G:
  LCP < 2.5s, INP < 200ms, CLS < 0.1. Measure before and after (Lighthouse, the framework's
  bundle analyzer, the browser's network waterfall); a change that blows a budget is not done.
  - *No request waterfalls.* Start independent fetches together (`Promise.all`, parallel
    loaders, server components fetching side by side); never await A only to start unrelated B.
    Fetch on the server or in the route loader, not in a child `useEffect` after render.
    Hoist data needs to the route; stream slow parts behind a skeleton or Suspense boundary
    instead of blocking the page.
  - *Bundle.* Initial JS for a landing page ≤ ~170KB gzipped, app routes ≤ ~300KB; CSS
    ≤ ~50KB. Import by path, not barrel files that pull a whole icon or utility set.
    Lazy-load below-the-fold and interaction-only code (charts, editors, maps, 3D, rich
    motion). Prefer platform features (`<dialog>`, CSS scroll-snap, `Intl`) over a
    dependency; check a new package's size before adding it. Keep static content in
    server-rendered or static HTML; client components only where interaction lives.
  - *Images.* Explicit `width`/`height` or `aspect-ratio`; AVIF/WebP with `srcset` and
    `sizes`; the LCP image gets `fetchpriority="high"` and is never lazy; everything below
    the fold `loading="lazy"` and `decoding="async"`. Use the framework's image component
    if it has one. Hero images ≤ ~200KB at the shipped size.
  - *Fonts.* Self-host, subset to the scripts used, WOFF2 only, at most 2 families and the
    weights actually used (or one variable file); preload only the one or two files above
    the fold; `font-display: swap` with a metric-matched fallback (`size-adjust`,
    `ascent-override`) so the swap causes no shift.
  - *Runtime.* Animate only `transform`/`opacity`; no layout reads inside scroll handlers;
    virtualize lists past ~100 rows; debounce search input; reserve space for late content
    (ads, embeds, banners) so nothing shifts.
- **CSS hygiene.** Watch specificity (a `.section` padding rule and a `.cta` rule can cancel
  each other); documented z-index scale; no inline styles mixed with the system; no debug code.
- **Harden.** Stress-test long names and strings, translated text (+30–40% length), RTL if
  relevant, empty and huge data sets, slow network, missing images, fallback fonts.

## 9. Render and look
Build still first: tokens, then the hero at desktop and phone, then sections, each different
from its neighbors. Add motion last. Then:
1. Run the app or open the file. Screenshot at 1440, 768 and 390 wide, in both themes if both
   exist, at shipped sizes. Judge from the pictures, not the code.
2. Critique against the brief, the clusters and the refuse list; fix the top three problems.
   Up to three rounds.
3. Click through every interaction and state; run the build, type and lint commands.
4. Run `atelier:ui-review` on changed files and `forge:verification` before claiming done.
   Report what you verified and any brand exceptions kept.

## Related
`atelier:visual-design` (type/color/spacing/layout systems, brand references, redesign audit),
`atelier:motion-design`, `atelier:design-systems` (DESIGN.md tokens), `atelier:ui-review`,
`atelier:prototype` (throwaway variants), `atelier:mobile-native`, `forge:humanizer` (copy polish),
`forge:dogfood-qa`.
