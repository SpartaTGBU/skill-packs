# Taste rules: anti-slop landing pages, portfolios, marketing sites

Contextual, not automatic. Read the brief, set the dials, then pull only the rules that fit. A brand or brief that explicitly asks for a banned thing wins; the ban is against defaulting to it.
Scope: marketing, landing, portfolio, editorial surfaces. For dashboards and dense product UI use a real design system (see `design-system-picks.md`) and apply only the type, color and state rules.

## 1. Brief inference (before any code)

Read: page kind (landing, portfolio, redesign, editorial), vibe words, reference URLs or screenshots, audience, existing brand assets, quiet constraints (accessibility-first, public sector, regulated, kids). Constraints override aesthetic preference.

State one line first: "Reading this as: <page kind> for <audience>, <vibe> language, leaning toward <system or aesthetic family>." Ask one question only if the read genuinely forks ("Linear-clean or Awwwards-experimental?"); otherwise declare and proceed.

## 2. Three dials (1-10)

DESIGN_VARIANCE (1 symmetric, 10 chaotic), MOTION_INTENSITY (1 static, 10 cinematic), VISUAL_DENSITY (1 gallery, 10 cockpit). Baseline 8/6/4. Never silently use the baseline; reason them from the read.

| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| minimalist / calm / editorial / Linear-style | 5-6 | 3-4 | 2-3 |
| premium consumer / luxury / brand | 7-8 | 5-7 | 3-4 |
| playful / experimental / agency | 9-10 | 8-10 | 3-4 |
| marketing site / portfolio default | 7-9 | 6-8 | 3-5 |
| trust-first / public sector / regulated | 3-4 | 2-3 | 4-5 |
| redesign, preserve | match | +1 | match |
| redesign, overhaul | +2 | +2 | match |

Dial meaning: VARIANCE 1-3 symmetric 12-col grid; 4-7 offset overlaps, mixed aspect ratios; 8-10 asymmetric fractional grids, masonry, big empty zones (always collapse to one column under 768px). MOTION 1-3 hover/active only; 4-7 CSS transitions, staggered load-ins, transform and opacity; 8-10 scroll-driven choreography (see `atelier:motion-design`). DENSITY 1-3 `py-32` gaps; 4-7 normal app spacing; 8-10 tight, no card boxes, 1px dividers, mono for numbers.
"Motion claimed, motion shown": if MOTION > 4 the page must actually move (hero entrance, scroll reveals, CTA hover physics). If you cannot ship working motion, drop the dial to 3 and ship clean static. Never half-build.

## 3. Typography

- Display default: tight tracking, `leading-none`, 2 lines max; body `max-w-[65ch]`, relaxed leading. Control hierarchy with weight and color, not raw scale.
- Do not default to Inter + slate. Reach first for Geist, Outfit, Cabinet Grotesk, Satoshi, Instrument Sans, Söhne-class grotesques, or a brand-appropriate face. Inter is right when the user asks for neutral/standard/Linear-style or for public-sector/accessibility-first work.
- Serif is not the default for "creative" or "premium". Allowed when the brief names one, or the aesthetic is genuinely editorial/luxury/publication/heritage and you can say why this serif fits this brand. Fraunces and Instrument Serif are the most over-used LLM display serifs: avoid. Rotate serifs across projects.
- Emphasis inside a headline uses italic or bold of the SAME family. Never inject a random second family for one word.
- Italic display words with descenders (y g j p q) need `leading-[1.1]`+ and bottom padding or they clip.
- Pairings worth knowing: Geist + Geist Mono, Satoshi + JetBrains Mono, Cabinet Grotesk + Inter Tight, IBM Plex Sans + Plex Mono.
- Number columns use `tabular-nums`; use real ellipsis and typographic quotes.

## 4. Color and surface

- One accent, saturation under ~80%, locked across the entire page (a warm-grey site does not get a teal badge in the footer). One neutral family: do not mix warm and cool grays.
- "AI purple/blue glow" is the top fingerprint: no automatic violet gradients, neon glows, gradient headline text. If the brand is purple, embrace it with restraint and harmonised neutrals.
- No pure `#000` or `#fff`; use off-black and off-white. Tint shadows to the background hue, never pure black at low alpha on light pages.
- Premium-consumer default to avoid: warm cream background + brass/clay/oxblood accent + espresso text (cookware, wellness, artisan, DTC home). Rotate to another family: cold luxury (silver/chrome/smoke), forest + bone + amber, true black + tan, cobalt + one neutral, terracotta + slate, olive + brick + paper, monochrome + one saturated pop. Never ship the same family twice in a row. Allowed only if the brand names those colors.
- Page theme lock: one theme (light, dark, or auto) for the whole page. No section flips to an inverted theme mid-scroll unless a single deliberate theme-switch device. Design both light and dark from the start for consumer pages, test both, honor `prefers-color-scheme`.
- Shape lock: one radius system (all-sharp, all-soft 12-16px, or all-pill interactive) or a documented rule ("buttons pill, cards 16, inputs 8") applied everywhere.
- Cards only where elevation expresses hierarchy; otherwise group with `border-t`, `divide-y` or whitespace. Glass needs an inner 1px border + inset highlight and a solid fallback under `prefers-reduced-transparency`; see `materials-and-patterns.md`.

## 5. Layout discipline (hard rules; failing any is broken work)

- Hero fits the first viewport: headline 2 lines max, subtext 20 words / 4 lines max, CTAs visible without scrolling. A 4-line headline is a font-size error, not a copy error. Plan font and image sizes together (`text-4xl md:text-5xl lg:text-6xl` default; larger only for 3-5 word headlines). Hero top padding at most `pt-24`.
- Hero stack: at most 4 text elements (eyebrow or none, headline, subtext, 1 primary + max 1 secondary CTA). No tagline under CTAs, trust strip, pricing teaser, bullet list or avatar row in the hero. Logo walls go in their own section under the hero.
- Full-height sections use `min-h-[100dvh]`, never `h-screen`. Multi-column uses CSS Grid, not flex percentage math. Contain width (`max-w-7xl` / 1200-1400px).
- Nav on one line at desktop, 64-72px (80 max).
- Section layout families do not repeat: 8 sections use at least 4 different families. Image+text zigzag at most 2 in a row. No 3 identical equal feature cards; use asymmetric trio, 2-col with hierarchy, scroll-pinned, or horizontal scroll.
- Eyebrows (small uppercase tracked labels above headings): at most 1 per 3 sections, hero counts. Mechanical check: count `uppercase tracking` labels; must be <= ceil(sections/3). Prefer none.
- No split header (big left headline + small floating right paragraph). Stack headline over body, or make the right column a real visual or interactive element.
- Bento: exactly as many cells as content (N items, N cells, no blank tile), real rhythm, and at least 2-3 cells with real visual variation (image, gradient, pattern), not white cards of text.
- Mobile collapse declared per multi-column section (`< 768px` fallback in the same component).
- Long lists (> 5 items) need a better component than `ul` with hairlines: grouped chunks, card grid, tabs/accordion, scroll-snap pills, featured-vs-rest disclosure. No `border-t` + `border-b` on every row of a spec table.
- Z-index only for real layers (sticky nav, modal, overlay) from a documented scale; never `z-50` spam or `9999`.

## 6. Interactive states and forms

- Implement the full cycle: loading (skeletons shaped like content, not generic spinners), empty (composed, says how to populate), error (inline for forms, toast only for transient), and tactile `:active` (`translateY(1px)` or `scale(.98)`).
- Button contrast: every CTA label vs background at least 4.5:1 (3:1 large). Ghost buttons over photos need a scrim or stroke. CTA labels must not wrap at desktop (3 words max for primary).
- One label per intent on a page: "Get in touch", "Contact us", "Let's talk" are the same intent; pick one and use it in nav, hero and footer. Same for signup and portfolio intents.
- Forms: label above input, helper in markup, error below, no placeholder-as-label. Inputs, placeholders, helper and error text all pass AA against the section background.

## 7. Imagery and content

- Landing pages are visual products. Priority for assets: (1) an image-generation tool if the environment has one, at the section's aspect ratio; (2) real images the brief supplies, or seeded placeholders (`https://picsum.photos/seed/<descriptive-seed>/<w>/<h>`); (3) clearly labeled placeholder slots plus a note to the user listing needed images. Do not fill the page with hand-built `<div>` fake screenshots, fake dashboards or fake terminals (the number one tell), nor with hand-drawn decorative SVG illustrations unless asked. Even minimalist pages need 2-3 real images.
- Icons from one library with one stroke width (Phosphor, Tabler, Radix, Hugeicons; Lucide only if the project already uses it). Do not hand-roll icon paths.
- Logo walls: real SVG marks (Simple Icons, devicon) or generated monograms for invented brands; logo only, no category label under each; works on light and dark.
- Copy: short. Section = headline (<= 8 words) + sub (<= 25 words) + one visual or CTA. Quotes <= 3 lines, attributed with name + role. Self-audit every visible string for broken grammar, unclear referents, forced metaphors, "elegant nothing" copy; replace doubtful lines with plain functional sentences. One copy register per page.
- Realistic data: no "John Doe", "Acme", "Nexus", "99.99%", "50%", `1234567`; use organic values (`47.2%`) and believable names. Fake-precise numbers must be real, or labelled mock. No filler verbs (Elevate, Seamless, Unleash, Next-Gen, Revolutionize).

## 8. Forbidden tells (unless the brief asks)

Neon/outer glows; custom cursors; gradient headline text; oversized screaming H1s; centered hero over dark mesh by default; version labels (V0.6, BETA) in the hero; section-number eyebrows (`01 / Capabilities`), `01 / 4` image pagination, generic "Step 1 / Phase 01" labels (use the verb: Install, Configure, Ship); middle-dot separator spam (max one per line); decorative status dots; pills or caption tags overlaid on photos; pretentious photo-credit captions ("Plate 03"); decoration strip at hero bottom (`BRAND. MOTION. SPATIAL.`); locale/time/weather strips; version footers on marketing pages; scroll cues ("Scroll to explore"); vertical rotated text and hairline crosshair grids as decoration; progress bars with filled background tracks as comparison visuals; "Quietly trusted by", "From the field", "Field notes" style poetic labels; micro-meta sentences under headings.
Em dash (and en dash as separator) in visible copy is the single most common LLM stylistic crutch: use a period, comma, colon, parentheses or plain hyphen.

## 9. Pre-flight (mechanical; any miss means not done)

Design read declared; dials reasoned; system chosen or aesthetic honestly labeled; redesign mode audited; no em dashes in copy; theme/accent/shape locks hold; every CTA and form contrast-checked, no wrapped CTAs, no duplicate CTA intent; serif and palette checks passed; italic descenders cleared; hero fits viewport with <= 4 text elements; eyebrow count within limit; no split header; zigzag <= 2; bento exact and varied; real images or labeled slots; logo wall under hero; copy self-audited; every animation justified in one sentence; max one marquee; nav one line; empty/loading/error states exist; both color modes tested; mobile collapse declared; LCP < 2.5s, INP < 200ms, CLS < 0.1 plausible.
