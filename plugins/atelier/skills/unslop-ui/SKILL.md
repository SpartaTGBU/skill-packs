---
disable-model-invocation: true  # skl: on-demand pack skill
name: unslop-ui
description: >
  Detect and remove AI-looking UI ("slop tells") and turn a vibecoded screen into a designed one:
  audit with a selector-level checklist, write a short brief, then repair the shell, the content
  blocks and (for marketing pages) the hero, and prove it with a before/after render. Use when someone
  says "this looks AI-generated", "unslop", "de-slop", "make it not look vibecoded", "polish this
  generic dashboard/landing page", or a UI shows purple gradients, glows, gradient text, emoji icons,
  sparkle "New" badges, tracked uppercase labels, pulsing dots, uneven spacing. Audits AND repairs an
  existing screen; critique-only or new builds go to siblings in Neighbours.
---

# Unslop UI

Machine-made interfaces look machine-made for a small set of reasons: decoration applied evenly
everywhere, defaults nobody chose, and copy that could describe any product. The job is to find
those, replace them with decisions, and leave the product itself (features, content, section order,
wiring) untouched.

Two ways to fail: leaving the tells, or shipping a tidy screen that suits every product. The second
is just a newer template. Finish with something only this product would look like.

Principle: effects belong on content, not chrome. Keep buttons, borders, backgrounds and labels
plain; if colour or craft is spent anywhere, spend it on one thing the product actually shows.

## Neighbours (split rule)

- `atelier:ui-review`: review only, no edits. Here we audit and fix.
- `atelier:visual-design`: new design from a brief. Here an existing screen is repaired.
- `atelier:frontend-design`: build from scratch. `atelier:html-design-artifacts`, `atelier:prototype`: new standalone file.
- `atelier:design-systems`: define tokens. Here we consume or minimally adjust them.
- `atelier:ui-engineering-polish`: hit targets, states, perf. `atelier:ui-ux-intelligence`: UX strategy. Here: the visible look and copy.
- `atelier:motion-design`: motion craft. Here motion is mostly deleted.
- `atelier:visual-qa`: screenshot gates in general; borrowed here only to verify.
- `atelier:illustration-and-icons`, `atelier:logo-design`, `atelier:diagrams`: make the asset itself.
- Rendered video (`atelier:art-motion`, `launch-film`, `product-demo-video`, `explainer-video`, `one-line-video`, `video-direction`, `video-composition`, `video-editing`, `shot-recipes`, `ai-video`), drawn animation (`atelier:2d-animation`, `svg-character-animation`, `math-animation`, `animation-reverse-engineering`) and sound (`atelier:audio-review`) are out of scope; this skill ends at a static or interactive page.

Tags: [H] = a figure restated from Nutlope/hallmark (MIT; see NOTICE.md). Untagged numbers are
conventions or starting points of our own, not claims about any source.

## Procedure

1. **Capture.** Render the screen (desktop and phone widths; both themes if present). Screenshot
   only: rebuild it as one static HTML file and treat that as the original. URL only: save the HTML
   as a working copy and say in the report that the result is code for the real owner to adopt.
2. **Audit** with [references/tells.md](references/tells.md). One line per hit with `file:line` or
   selector. Count hits and note which areas they fall in (chrome, content, marketing, motion).
3. **Size the job.** Many hits across several areas: full repair. A few: fix exactly those and keep
   palette, type and layout. None: say so, offer at most three concrete refinements, stop.
4. **Write the brief** (below), show it with the audit, and wait for approval unless told to proceed.
5. **Repair** in the order below, finishing each stage on the whole screen before the next.
6. **Verify** (below), repeat only for what remains, then report: brief, hits fixed, before/after
   images, and every claim removed or left for the owner to confirm.

## Brief

Five answers, drawn from what the page says the product does, not from fashion:

- Who it is for and what they do with it, one sentence.
- Tone: two or three words a competitor would not also claim. Words that fit every SaaS page
  (clean, modern, sleek, premium) decide nothing; replace them.
- The setting the product sits next to (paper, instruments, kitchens, ledgers). It suggests the
  neutral tint, accent hue and imagery.
- Where colour is allowed: at most two places, each tied to something the product shows.
- One repeated small motif (a rule style, a number format, a corner shape).

A real brand (logo file, named colour, typeface) is kept and built around. A violet-to-blue
gradient or a sparkle is not a brand, even inside the logo, unless the owner says otherwise.

## Repair order

Reasoning: tokens change how everything else reads; words determine sizes that layout then serves;
imagery and motion should land on a screen that already works.

1. **Tokens.** Pick one base spacing step and make every gap a multiple of it; siblings of one kind
   share one value, and space inside a group is smaller than space between groups. One neutral ramp
   tinted toward the setting, a few text roles, one accent for the primary action and selection.
   Accent text and text on accent meet 4.5:1 (WCAG). Hairlines are low-opacity text colour; dark
   themes show depth by surface lightness, not shadow. Remove hue-to-hue gradients, gradient text,
   glows, washes, blobs and neon edges.
2. **Icons.** One line-icon family at one size and stroke, coloured by text role. Emoji icons go.
   Icons that carry no information go. A category colour can be a dot.
3. **Copy.** Claims must be checkable from the page; test by swapping in a rival's name (if it
   still reads true, rewrite). No exclamation marks; greetings become context (a date, a page name);
   short noun labels; no full stop on headings, labels or buttons; a change states its baseline.
   Remove hype verbs. Metrics, quotes, logo walls, ratings: ask the owner, delete if unreal; never
   invent them [H]. Placeholder data is plausible, not `123,456` or `[X]`.
   Stricter house rules, optional [H]: no eyebrow above a heading, no middle-dot meta strings, no
   arrow glued to link text, a hero headline of 7 words or fewer, 1-2 actions.
4. **Type.** Keep a brand face; otherwise at most two families chosen for a stated reason. Make
   hierarchy with size and colour more than weight; avoid the heaviest weights. Sentence case;
   tracked or uppercase text of 15px or less past 0.03em is a tell [H]. No negative tracking on
   small text; no italic emphasis; `tabular-nums` and one number format for figures. Running text
   is not under 12px and functional text not under 11px [H gate 75].
5. **Components.** Nested radii: inner = outer minus the padding between (geometry), with a small
   floor. Counts and meta are muted text, shortcuts are keycaps. Charts: muted grid and labels,
   one accent on the point being made, a chart type matched to the question (trend line,
   comparison bars, share stacked bar, goal progress). One chart is clearly the largest; neighbours
   differ in kind. Stat card = label, figure, change; no filler sparklines or icons. Rows of
   identical cards get varied widths or one wide panel. Active nav is a small surface step. Hover and
   a visible focus ring exist, in palette. Logo: name in the main face plus a flat mark.
6. **Page frame (marketing).** Keep sections and order. Hero is either a full-bleed scene with text
   on its calm area, or an asymmetric split giving the visual at least half the width; a fully
   stacked, centred hero is acceptable only when short and visual-less. Left-align long headlines.
   One primary action, at most one secondary. Nav: logo, existing links, one button. Nothing empty
   under the first screen. On phones stack in reading order and simplify dense previews. Borrowed
   checks [H]: headline, sentence and primary action visible at 1280x800; container capped near
   1360-1520; no horizontal scroll from 320 to 1920; hero height in `dvh`/`svh`; no card in a card.
   App screens keep real proportions: the shell fills the viewport, no narrow centred column.
7. **Visuals.** Delete filler (blobs, orbs, floating cubes, glowing grids, brains, robots). Every
   element in a hero visual must be something the copy already claims: build a product preview in
   code from plausible data, or generate a scene from the brief's setting with room for text. Apps
   rarely need generated imagery. No text, buttons or logos baked into a raster. No image tool:
   build in code, write prompts, leave right-sized slots. A real screenshot beats a styled mock when
   the product runs; no hand-drawn browser chrome; photos below the hero cover at most a third of
   the page [H].
8. **Motion.** Remove infinite loops on non-live things, shimmer, breathing glows, floating,
   parallax, `transition: all`, bounce, card scale on hover. Keep motion that explains: quick hover
   colour change, slight press, menus that fade and rise a little, tweened numbers. Transition named
   properties; never animate layout properties or large blurs. One easing curve, a few durations,
   at most one load entrance. Every animation has a `prefers-reduced-motion` fallback and content
   shows without script [H]. Deeper work: `atelier:motion-design`.

## Verify

Any browser or headless screenshot tool will do; no third-party scripts are needed.

1. Before/after pair at the same viewport, data and scroll. Look at it before reading code.
2. Grep the source for what is left:
   `grep -nE "animate-(pulse|ping)|transition-all|transition: *all|background-clip: *text|bg-clip-text|(from|via|to)-(purple|violet|indigo|fuchsia|pink)|uppercase|tracking-(wide|wider|widest)|font-(extrabold|black)|shadow-(2xl|\[)|blur-(2xl|3xl)"`
   Emoji: `grep -nP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]'`. Exclamations in strings:
   `grep -nE "[\"'>][^\"'<]*[A-Za-z]!( |[\"'<])" src` (skim; template literals can slip through).
   Not Tailwind? Evaluate `getComputedStyle` on every element and print selector plus value where
   `boxShadow`, `filter`, `backdropFilter` is not `none` or `animationName` is not `none`.
3. Computed styles: list distinct font sizes, weights, radii, paddings, gaps. Short lists expected.
4. Contrast: 4.5:1 for text, 3:1 for icons and focus rings.
5. Squint (`ffmpeg -i in.png -vf gblur=sigma=12 out.png`): one focal point survives.
6. Swap test: put a rival's name in; if it still fits, sharpen the brief.
7. Overflow at 320, 390, 1440, 1920; no horizontal scroll, no wrapped buttons.
8. Emulate `prefers-reduced-motion: reduce`: nothing loops, content visible.
9. Remaining hits go back to their stage; hand the tail to `atelier:visual-qa`.

## Do not

- Rename the product or change what it is.
- Replace removed decoration with other decoration or with a trend (glass, grain, neon, bento).
- Invent features, claims, data, testimonials or logos.
- Edit before the brief is approved (unless told), or touch wiring: links, ids, form names,
  handlers, test hooks. Never edit a test to make a restyle pass [H].
- Fix from screenshots alone: change source, re-render.
- Call a clean-but-generic screen done.
