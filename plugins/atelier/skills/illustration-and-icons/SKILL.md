---
disable-model-invocation: true  # skl: on-demand pack skill
name: illustration-and-icons
description: >
  Vector icons and illustration systems plus code-composed posters: 24px icon grids, stroke and
  optical-size rules, SVG hygiene (viewBox, currentColor, svgo), consistent style systems, and a
  philosophy-first method for composing a poster, PNG or PDF in code with minimal text. Use when
  drawing or cleaning up icons, building an icon set, making spot illustrations, optimizing SVGs,
  or creating a poster, cover, card or static artwork programmatically.
---

# Illustration and icons

Use the project's existing icon set first (Lucide, Phosphor, Material Symbols, Heroicons, an
in-house set). Draw a new icon only when the set lacks it, and draw it in that set's rules.
Generative raster art goes to `atelier:image-generation`; algorithmic/animated art to
`atelier:generative-art`; tokens to `atelier:design-systems`.

## 1. Icon grid and geometry

| Rule | Value |
|---|---|
| Canvas | 24x24 (`viewBox="0 0 24 24"`), 1-2 px padding: live area 20x20 or 22x22 |
| Stroke | 1.5 or 2 px, one value for the whole set; round or square caps and joins, set-wide |
| Keylines | Circle 20 dia; square 18x18; portrait 16x20; landscape 20x16 (optical balance) |
| Corner radius | One or two values (e.g. 2 px outer, 1 px inner) |
| Pixel snapping | Straight strokes on half-pixel centres for odd widths (x=12.5 for 1 px) and whole pixels for 2 px |
| Minimum gap | Gap between strokes >= stroke width |
| Angles | Prefer 0/45/90; consistent diagonal angle across the set |
| Fill vs stroke | Pick one style per set; filled variant is a separate, matched set |

Optical sizes: 24 px is the master. At 16 px drop interior detail and use a heavier relative
stroke (redraw, do not just scale). At 32-48 px keep the stroke width in px, add detail only if the
whole set does. Never scale a 24 px icon to 13 or 17 px; render at grid multiples.

Metaphors: one idea per icon, literal over clever, culturally neutral. Pair every icon-only button
with an accessible name (`aria-label`) and a tooltip; decorative icons get `aria-hidden="true"`.
Interactive icon targets are at least 24x24 CSS px, 44x44 on touch.

## 2. SVG hygiene

- Keep `viewBox`; remove fixed `width`/`height` on set icons (size via CSS) or keep them as the
  intrinsic default, but always keep `viewBox`.
- `stroke="currentColor"` / `fill="currentColor"` so icons inherit text colour and dark mode.
  No hard-coded hex inside set icons; multicolour icons use CSS variables.
- Outline nothing that should stay a stroke (stroke icons must keep stroke width editable);
  expand strokes only for fill-based sets.
- Strip editor junk: metadata, comments, `id`s you do not reference, empty groups, transforms
  baked into paths where possible, `xmlns:*` editor namespaces.
- Run `svgo` (multipass) with a config that keeps `viewBox` and does not merge paths that
  carry different classes. Reduce coordinate precision to 2-3 decimals; check visually after.
- Accessibility: inline meaningful SVG gets `role="img"` and `<title>`; decorative gets
  `aria-hidden="true" focusable="false"`.
- Security: SVG is executable markup. Strip `<script>`, `on*` attributes, `<foreignObject>`,
  and external `href`s from untrusted SVG before inlining; serve user SVG as `<img>` only.
- Delivery: sprite (`<symbol>` + `<use>`) or per-icon components; avoid icon fonts.

Example set icon:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true"><path d="M4 12h16M12 4v16"/></svg>
```

## 3. Illustration style system

Write the system down before drawing the second illustration:

- Palette: 3-5 colours from the design tokens plus one neutral; define how shadow and highlight
  are made (darker hue shift, not grey overlay).
- Line: none, uniform, or variable; same weight relative to scale across all pieces.
- Shapes: geometric vs organic; corner radius family; perspective (flat, isometric 30 deg, or
  free).
- Figures: proportions, face detail level, skin-tone range (diverse by default, avoid yellow
  "neutral" default), hands simplified the same way every time.
- Texture: none or one (grain, halftone, risograph overlap), applied the same way.
- Composition: consistent canvas ratios per slot (empty state 4:3, hero 16:9, spot 1:1).

Anti-slop: avoid the generic flat-corporate "big-limbed purple people" look, floating blobs,
gratuitous gradients, and stock metaphors (lightbulb, rocket, handshake). Ground illustration in
the product's real objects and users.

## 4. Posters and static art by code (philosophy first)

For a poster, cover, card, certificate or social image, compose in code so it is exact and
repeatable (SVG, HTML/CSS rendered headless, or a canvas/plotting library already in the project).

1. Write a design philosophy, 4-6 sentences: the one idea, the movement or tradition it draws on
   (Swiss grid, Bauhaus, constructivist, ukiyo-e, brutalist, data-as-art), the palette and its
   reason, the role of space, and what is deliberately absent.
2. Pick a grid and a ratio from the output (A-series 1:1.414, 4:5 social, 16:9 screen, 2:3 poster).
   Set margins >= 6% of the short side.
3. Compose with few elements: one dominant form, one or two supporting forms, generous negative
   space. Scale contrast at least 1:3 between dominant and secondary.
4. Text minimal: a title and at most one supporting line, set in one or two typefaces with
   deliberate size jumps. Text is part of the composition, not a caption under it.
5. Render: SVG -> PNG via a headless browser or `rsvg-convert`/`resvg`; PDF from SVG or HTML print
   with fonts embedded. Print: 300 dpi at final size, 3 mm bleed, CMYK conversion only if the
   printer asks.
6. Look at it: full size and thumbnail (200 px wide). The idea must read at thumbnail size.
   Iterate on spacing and scale before adding anything.

Seed any randomness and record the seed so the piece can be regenerated.

## 5. Verify

- Icons: view the set side by side at 16, 24 and 32 px on light and dark backgrounds; check
  stroke weights look equal, optical sizes balance, nothing blurry from off-grid coordinates.
- SVG: `svgo` output diffed visually against source; file has `viewBox`, uses `currentColor`,
  no scripts or editor metadata.
- Contrast: icons conveying meaning meet 3:1 against their background.
- Posters: rendered file opened at 100% and as thumbnail; fonts embedded; license of every
  typeface and source image recorded (`atelier:asset-pipeline`).
