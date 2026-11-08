# Design doctrine: process for one-off artifacts and prototypes

For landing pages, prototypes, decks, component labs, motion studies, option boards. If the user wants production code in an existing repo, build in the repo's actual stack and reuse its components and tokens instead of a standalone file.

## Start from context, not vibes

Look for source context before designing: brand docs, screenshots, current repo components, token files, UI kits, prior mockups, copy docs, constraints. If a repo exists, read the theme, tokens, global styles, layout scaffolds and real component files (the file tree is only the menu) and lift exact values. Do not design from memory when source exists. If fidelity matters and context is missing, ask a few short questions (output format, audience, fidelity, brand in play, number of variants, conservative vs divergent). Skip questions when direction is already sufficient; label only the important assumptions.

## Surface first: commit to a composition before tokens

Most slop is compositional, not cosmetic. Before colors or type, say which ONE surface archetype this is:
1. Monitor: watching state change (dashboards, status, observability). Density, glanceable hierarchy, no marketing framing.
2. Operate: acting on things (consoles, admin, queues, inboxes). Affordances and selection state dominate.
3. Compare: weighing options (pricing, specs, results). Aligned columns, structural parity, one differentiator.
4. Configure: setting up (settings, forms, wizards). Progressive disclosure, validation and save states, low decoration.
5. Decide / Learn: being convinced or taught (landing, docs, marketing). One idea per section; the only surface where a hero is usually right.
6. Explore: browsing an open space (galleries, catalogs, maps). Filters, grids, peek/zoom.
7. Command / Inspect: keyboard-driven or drilling into one object (command bars, inspectors). Speed and focus over breadth.
State it in a line ("This is a Monitor surface, so density beats a hero"). If two apply, name the primary. A dashboard is never a hero plus three cards.

## Workflow

1. Brief: what, for whom, artifact, locked constraints.
2. Gather context (above). 3. Commit to a surface. 4. Define the artifact's system: color, type, spacing, radii, elevation, motion posture, component treatment.
5. Pick format: static comparison board, clickable prototype, fixed-size deck, component lab, motion timeline.
6. Build: default to one self-contained HTML file (CSS and JS inline, opens directly, responsive), unless a repo implementation is requested. Keep prior versions for major revisions (`Name v2.html`) or toggle variants in-page.
7. Verify: file exists, no syntax errors, open in a browser and check the console if tools allow, screenshot the primary viewport, test key interactions and light/dark. State exactly what was and was not verified.
8. Report briefly: path, contents, caveats, next decision.

## Variations and tweaks

Explore at least three: conservative (closest to existing patterns), strong-fit (best reading of the brief), divergent (to find taste boundaries). Vary layout, hierarchy, density, type scale, interaction, not just color. After a pick, consolidate. Optional in-page `Tweaks` panel (theme, density, accent, type scale, motion, variant) persisted in localStorage; the design must look final with it hidden.

## Format rules

- Prototypes: primary path clickable; states for default, hover/focus, loading, empty, error, success. Design the flow, not only screen one.
- Decks: fixed 1920x1080 canvas scaled to viewport, keyboard nav, slide count, persisted slide, 24px+ text, 1-2 background colors, sparse slides solved with layout and scale not filler. A deck is a designed artifact, not markdown bullets.
- Print: 12pt+. Touch targets 44px+. Modern CSS: variables, grid, container queries, `text-wrap: pretty`, real focus and hover states, reduced-motion handling, semantic HTML. Avoid `scrollIntoView`.
- React from a CDN only when state or variants justify it; pin exact versions, avoid `type="module"` unless needed, give global style objects unique names, attach shared components to `window` when splitting Babel scripts.

## Content discipline

Every element earns its place. No filler metrics, decorative stats, generic feature grids, placeholder testimonials, invented claims. Draft copy is marked as draft. Ask before adding sections or claims the brief did not request.

## Slop diagnostic: score, then repair

Diagnose before fixing; auditing and fixing in one breath makes the model repeat its prior. Ten tells, one point each (10 = maximum slop):
1. Tech gradient: glossy blue/violet gradient everywhere. 2. Generic tech hue: indigo/violet chosen by default. 3. Feature-tile grid: icon + heading + sentence x3, equal weight. 4. Accent rail: colored left strip on cards. 5. Unearned blur: glass with no elevation system. 6. Monument stat: giant numbers filling space. 7. Icon topper: rounded-square icon above every heading. 8. Center stack: everything centered, no composition. 9. Default type: Inter/system-ui unchosen. 10. Wrong surface: composition does not match the surface (root cause of most others).
Write the score and fired tells. Repair in the matching register: tells 3, 8, 10 need re-layout (revisit the surface, do not recolor); 1, 2, 9 need recolor/re-typeset; 4, 5, 6, 7 need the decoration removed and replaced with real hierarchy. Re-score; do not finish while 3, 8 or 10 still fire.

## Type, color, layout, imagery quick rules

Type by artifact: editorial (serif or humanist headline, restrained sans body), software (precise sans, strong numerals), luxury/minimal (few weights, spacing discipline), technical (mono accents only), deck (large, high contrast). Few families and weights; hierarchy via type before boxes, icons or color.
Color: brand colors first; otherwise a small system (neutrals, surface, ink, muted, border, accent, danger/success); one primary accent; `oklch` for invented palettes; check contrast.
Layout: rhythm via scale, whitespace, density, alignment, repetition, contrast, interruption; not every section a card grid; product UIs favor speed of comprehension; marketing lets one idea land per section; no data slop.
Images: use supplied imagery; otherwise a clean placeholder, typography or abstract texture; ask for real material when fidelity matters; no elaborate fake SVG illustrations; icons only when they improve scanning.
Reference models: extract principles (density without clutter, command-first, monochrome plus one accent, editorial hierarchy, clear empty states) and build an original design; do not clone a company's proprietary layouts or copy.
