# Logo test protocol

Tags: [upstream] = figure stated by the upstream logo-design skill; [practice] = working figure invented here.
Everything below needs only a browser, ffmpeg or ImageMagick.

## Render and sheet
Copy-paste sheet (save as `sheet.html` beside `logo.svg`, open at 100% zoom):

```html
<style>body{margin:0;display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:24px;background:#fff}
body>div{display:flex;gap:12px;align-items:flex-end}
.dark{background:#000;padding:24px}.g img{filter:grayscale(1)}.sq img{filter:blur(6px)}
.rev img{filter:invert(1)}.mir img{transform:scaleX(-1)}img{image-rendering:auto}</style>
<div><img src="logo.svg" width="512"></div>
<div><img src="logo.svg" width="64"><img src="logo.svg" width="32"><img src="logo.svg" width="16"></div>
<div class="g"><img src="logo.svg" width="128"></div>
<div class="sq"><img src="logo.svg" width="128"></div>
<div class="dark rev"><img src="logo.svg" width="128"></div>
<div class="mir"><img src="logo.svg" width="128"></div>
```

The `invert(1)` panel assumes a black master; for a coloured one, supply a white file instead.
Device-pixel-ratio caveat: on a 2x display a 16 CSS px image is 32 device pixels, so it flatters the
mark. Screenshot with the browser at DPR 1 (headless: `--force-device-scale-factor=1`) or render files
at true pixel size with the CLI below, and view at 100%.

CLI renders:
- `rsvg-convert -w 16 logo.svg -o 16.png`, or `magick -background none -density 600 logo.svg -resize 16x16 16.png`.
- Ladder sheet: `magick -background white 512.png 64.png 32.png 16.png -gravity south +append ladder.png`.
- Greyscale: `magick in.png -colorspace Gray out.png`. Reversed: `magick in.png -background white -alpha remove -negate rev.png`.
- Squint: `magick in.png -blur 0x6 squint.png` or `ffmpeg -i in.png -vf gblur=sigma=6 squint.png`.
  Blur sigma about 6 on a 128 px render [practice]; raise it until detail vanishes.
- Mirror: `magick in.png -flop m.png`. Rotate: `magick in.png -rotate 90 r90.png`.
- Ink coverage (fraction black): flatten onto white first, or a transparent PNG reads as solid black: `magick in.png -background white -alpha remove -colorspace Gray -format "%[fx:1-mean]" info:`.

## 1. File check (cheapest, run first)
`grep -nE "<text|<image|<filter|<mask|<use|<clipPath|style=|filter=|mask=|href=\"data:" logo.svg`
must print nothing for a master. It misses missing viewBox (`grep -c viewBox logo.svg` must be 1) and
stroke-only shapes (`grep -c "stroke=" logo.svg` tells you if strokes remain to expand).

## 2. Scale
- 16 px [upstream: 16-24 px]: the idea survives and gaps stay open; if not, build a small-size cut (fewer parts, thicker
  strokes, wider gaps) instead of weakening the master.
- 24-32 px [practice]: recognisable at a glance (lists, avatars).
- 2000 px [practice]: curves smooth, no lumpy anchors.
- Minimum size: shrink until the identifying feature is lost; the size just above is the stated minimum
  in px and mm [upstream asks for both].

## 3. Value and reversal
- Black on white and white on black side by side at 32 px. Reversed weight: render both, take ink
  coverage of the black-on-white version (`1-mean`) and of the white shapes on dark (`mean`). Pass: the
  ratio reversed/black is between 0.92 and 1.00 [practice]. The reversed cut's strokes may be thinned 2-5%
  of stroke weight [upstream]; coverage change is shape-dependent, so judge by the ratio. Over
  1.00 fails: thin the reversed cut. View the pair at 32 px as a final look.
- Greyscale: segments must still separate by value; if two neighbours become the same grey, change one.
- On brand colour, a photo, a pattern; if it fails, define a container or outline version.
- Never carry meaning in hue alone (red-green confusion affects roughly 8% of men [upstream]).

## 4. Unintended readings
- Mirror and rotate 90/180: look for accidental letters, body parts, offensive or political shapes,
  hazard signs. Any hit is a fail, not a taste note.
- Cold read: show one viewer the mark with no brief; ask "what is it" and, for modified letters, "which
  letter". A wrong letter is a fail.
- Junctions: zoom 800% [practice] on every join; no notches, slivers, lumps, hairline gaps.
- Squint: blurred silhouette must still be distinctive and balanced. Balance check: flatten, crop each half (`magick in.png -background white -alpha remove -colorspace Gray -crop 64x128+0+0 +repage -format "%[fx:1-mean]" info:` on a 128 px render, then `+64+0`, `128x64+0+0`, `128x64+0+64`); left and right ink within 10% of each other, top and bottom likewise, unless the asymmetry is the idea [practice].

## 5. Distinctiveness
- Shelf: [practice] mix the mark with six marks you saw in the category research, shuffled, at one
  thumbnail size (six keeps the scan quick; fewer is no test). A viewer who has seen the mark once finds
  it in under 3 seconds, and its silhouette and dominant colour differ from every neighbour. Fail otherwise.
- Familiarity: ask two people [practice] what it reminds them of; any brand named means revise.
- You cannot clear it: recommend trademark and reverse-image searches.

## 6. Tone (checkable)
Take the adjectives from the brief plus an opposite for each. Without telling the viewer the target, ask
them to pick from the shuffled list for the mark, and check it for each adjective by measure where one
exists [practice cut-offs]: sharp when corner radius is under 0.25 x stroke width, round when at least 1 x; light when stroke width over mark width is under 5%, heavy when over 12%; closed when under 10% of the outline is open, open when over 25%. Pass: viewer picks at least two of three target adjectives
and no measure contradicts the brief. [practice] Two of three because a single hit is chance on a
shuffled list of six; use three viewers and take the majority if you can. Solo fallback: no viewers, so
pass on the measures alone (radius/stroke, stroke/width, open share) and mark the viewer step not run.
Also: still fits if the business expands; reads without the tagline.

## 7. Production
- One-colour print, embroidery (no hairlines; gaps about 1 mm or more at chest-logo size [upstream]),
  engraving, vinyl, dark mode.
- App icon: sits optically inside the platform tile, no fine text. Avatar: survives a circular crop.

## 8. Context
Show 3-4 [practice] relevant mockups in one style (cafe: cup, bag; dev tool: README header, terminal). Not the white
artboard alone.

## Record
Tests run, pass or fail, changes with amounts ("widened slot 4 to 9 units"), and what the
user still owes (trademark search, print proof).
