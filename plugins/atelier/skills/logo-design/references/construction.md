# Logo construction in SVG

## File conventions
- Symbol canvas `viewBox="0 0 256 256"` (or 512); lockups keep height 256 and the width follows.
- For symbols, padding inside the viewBox about 4-8% of the size [upstream]; for lockups, or crop tight and rely on clear space. Be consistent across a set.
- Integer or 1-2 decimal coordinates. Excess precision hides misalignment.
- Add `<title>`, group as `<g id="symbol">` and `<g id="wordmark">` so lockups recompose. One file per variant, predictable names (`brand-symbol-black.svg`).

## Think in primitives
Write the construction in words first: "circle r=96 at (128,128), 45 degree wedge removed top right, small circle r=28 in the gap". Choose a unit (8 or 16 on a 256 canvas) and snap radii, gaps and stroke widths to multiples. Keep a list of the radii and angles used and reuse them.

## Paths
- Prefer `<circle>`, `<rect rx>`, `<polygon>` for simple parts; one merged `<path>` for the final silhouette.
- Circular geometry uses arcs (`A`), not many Bézier points. Béziers for organic curves, anchors at extrema with horizontal or vertical handles.
- A quarter circle as a cubic uses handles of about 0.5523 times the radius.
- Fewest anchors that work; every extra anchor is a chance to wobble.
- Angles from exact values (0, 15, 30, 45, 60, 90). 30/60 use offsets 0.5 and 0.866; 45 uses equal x and y. Avoid 2 degrees off vertical and similar near misses.
- Close filled paths with `Z`.

## Holes and negative space
- Outer contour and holes in one path with `fill-rule="evenodd"`.
- For a hidden figure, design the negative shape first, then build positives around it.
- Merge touching same-colour shapes into one path so no seam appears when rendered or cut.
- Bake masks and clip paths into plain paths for the master; exploration may use them.

## Strokes
Explore with strokes (round caps and joins), then deliver filled outlines so scaling, cutting and embroidery tools behave. If you cannot expand strokes, say which remain so a vector editor can.

## Letters
Final marks use constructed letter paths, never `<text>`. Short wordmarks and monograms are best built from geometry, which also forces ownable letters. Check each modified letter still reads as itself.

## Variants to export from the master
Black, white, one brand colour, square symbol, small-size cut, thinned reversed cut. Name each file for its use.

## Recipes (describe, then draw)
- Containment: a shape inside a circle or rounded square with one element breaking out.
- Negative space: a letter or arrow cut from a solid block.
- Modular repetition: one unit rotated or mirrored on a grid.
- Overlap: two shapes where the intersection is a third shape, drawn as its own path.
- Colour segments: split one silhouette into 2-3 value-distinct pieces; check greyscale.

## Avoid in a master
Live text, rasters, filters, blur, gradients that carry the form, thousands of anchors, hairlines, unnamed groups.
