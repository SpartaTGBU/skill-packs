# Audit checklist, by how a tell is detected

Each line: tell -> default fix. Record `file:line` or selector; the count sizes the job
(SKILL.md step 3). Items tagged [H] come from Hallmark (MIT; NOTICE.md); the rest are our own.

## Grep on source
- `bg-clip-text`, `background-clip: text`, shimmer keyframes -> solid text colour
- gradients between two hues -> flat surface, or tone shift within one neutral
- coloured glow shadows, `drop-shadow` on icons -> surface step plus hairline
- `animate-pulse`, `animate-ping`, `transition: all`, `hover:scale-*` on cards -> named properties, quick colour change
- `uppercase` with wide tracking on labels -> sentence case, tracking 0
- `font-extrabold`, `font-black` -> lighter weight
- emoji in labels, buttons, counts, status -> line icon, dot or plain number
- `!` in visible strings; full stops on headings, labels, buttons -> plain statement
- arbitrary values (`mt-[13px]`) -> scale step
- `#000`/`#fff` page background, repeated colour literals [H] -> tinted tokens defined once on `:root`
- `vh` hero height, no `prefers-reduced-motion` rule, content hidden until script runs [H] -> `dvh`/`svh`, fallback, visible by default

## Computed styles
- many font sizes, more than two families, mixed icon sizes, two icon libraries [H] -> collapse to one scale
- sibling cards/rows differing in padding, gap or height -> one value per component type
- nested box with the same radius as its parent -> parent minus gap
- two number formats, non-tabular figures -> one format, `tabular-nums`
- running text under 12px or functional text under 11px [H gate 75]; muted text under 4.5:1 -> raise
- focus outline removed, nothing replacing it -> visible in-palette ring
- animating width, height, top, left, margin -> transform and opacity

## Squint at a screenshot
- every surface has a colour effect; nothing is calmer than anything else -> plain chrome, colour on 1-2 content moments
- row of 3+ identical icon-title-sentence tiles [H] -> vary widths, inline icons
- twin charts, sparkline or icon in every stat card -> one main chart; label, figure, change
- card in a card, thick coloured side stripe [H] -> one containment layer
- heading nearer the section above than its own content [H] -> more space above
- rainbow or glowing bars, heavy grid -> one or two series, muted grid
- stacked centred hero with orbs, glowing grids, robots, 3D blobs -> split layout or code-built product preview
- raster with hard edge on a mismatched page; text baked into an image -> soft edge, live text
- hand-drawn browser bar, empty gradient slot [H] -> real screenshot or nothing
- full-screen fixed layers (wash, noise, grid, blob) -> remove
- page recipe hero / tile trio / call to action / wide footer [H] -> order sections by the visitor's job

## Read the words
- copy that survives a rival's name; "Welcome back" greetings -> state the thing or the period
- pill above the headline announcing a version [H], one accent-coloured or italic word [H] -> delete unless real news
- delta without baseline; stand-in data (`1,234,567`, `[X]`, "Acme", "Jane Doe") -> baseline; plausible values
- Beta/New/Pro badges with sparkle or rocket -> delete or one plain text badge
- fabricated metrics, quotes, logo walls, ratings [H] -> ask owner, delete if unreal
- "You're subscribed"/"Sent" with no request behind it [H] -> real endpoint or no state
- newsletter closer with no mailing list [H] -> remove or give it a job
- search placeholder that is a sentence -> "Search"
- stock dark page, default font, leftover brand-colour button on a product with a different setting -> retint toward the brief
