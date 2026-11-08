---
disable-model-invocation: true  # skl: on-demand pack skill
name: logo-design
description: >
  Logo and brand-mark design from brief to production SVG: choosing a mark type, generating and culling
  concepts, geometric construction, optical corrections, colour, lockups, a small-size / one-colour /
  reversed test protocol, delivery files, and studying a reference library without copying.
  Use when the user wants a logo, wordmark, monogram, symbol, favicon or app-icon mark designed,
  refreshed, critiqued or compared. Neighbours: atelier:illustration-and-icons (icon sets, spot art);
  atelier:design-systems (tokens and brand rules once a mark exists); atelier:visual-design,
  atelier:frontend-design, atelier:html-design-artifacts, atelier:prototype (placing the logo in a page
  or mock); atelier:ui-review, atelier:unslop-ui, atelier:ui-engineering-polish (judging or polishing a
  built UI); atelier:svg-character-animation, atelier:motion-design, atelier:2d-animation,
  atelier:art-motion (animating it); atelier:launch-film, atelier:video-composition,
  atelier:explainer-video, atelier:product-demo-video (logo in video); atelier:ai-video (AI-generated
  logo or sting output); atelier:video-editing, atelier:one-line-video (cutting or one-prompt video
  with a logo in it); atelier:visual-qa (render review); atelier:diagrams (not logos); atelier:ui-ux-intelligence (UI style and palette advice for interfaces; the mark itself stays here). No overlap with
  atelier:animation-reverse-engineering, video-direction, shot-recipes, audio-review, math-animation.
---

# Logo Design

A logo is an identifier, not an explanation: one idea, drawn simply, that survives 16 px, one colour
and a dark ground. Find the idea, build it with craft, prove it with tests, and present it so it is
judged on the tests rather than on taste.

Neighbours (split rules):
- `atelier:illustration-and-icons`: many consistent glyphs or spot art go there; THE brand mark stays here.
- `atelier:design-systems`: tokens, usage rules and components after the mark is approved.
- `atelier:ui-ux-intelligence`: UI/UX style, palette and pattern advice for interfaces; if the output is a mark, it stays here.
- `atelier:visual-design`, `atelier:frontend-design`: laying a finished mark into a layout.
- `atelier:html-design-artifacts`: a one-off page or deck that merely shows the logo; `atelier:prototype`:
  a clickable flow that uses it; neither designs the mark.
- `atelier:ui-review`, `atelier:unslop-ui`, `atelier:ui-engineering-polish`: critique or polish of a built
  interface; run them on the page, run this skill's tests on the mark.
- `atelier:svg-character-animation`, `atelier:motion-design`, `atelier:2d-animation`, `atelier:art-motion`:
  animating the mark once it is final.
- `atelier:launch-film`, `atelier:video-composition`, `atelier:explainer-video`,
  `atelier:product-demo-video`: logo stings and end cards inside a video; a screen-recorded demo goes to
  product-demo-video, the mark itself stays here.
- `atelier:ai-video`: AI-generated logo or sting footage goes there; the concept and construction of the
  mark stay here, and a generated image is never the master. `atelier:video-editing`,
  `atelier:one-line-video`: placing or cutting a finished mark into footage.
- No overlap: `atelier:animation-reverse-engineering`, `atelier:video-direction`, `atelier:shot-recipes`,
  `atelier:audio-review`, `atelier:math-animation`.
- `atelier:visual-qa`: generic render review. `atelier:diagrams`: not logos.

References:
- [references/construction.md](references/construction.md): SVG conventions, primitives, paths, corrections, recipes.
- [references/tests.md](references/tests.md): test protocol, copy-paste sheet, ffmpeg/ImageMagick recipes.
- [references/process-and-delivery.md](references/process-and-delivery.md): brief, mark types, colour, type, delivery, redesign, library study.

Number tags: **[upstream]** = a figure the upstream logo-design skill states (kaankiziltug/logo-design-skill,
MIT); **[practice]** = a working figure invented here, tune it. Every figure carries a tag; untagged numbers are exact maths or counts of steps.

## Work order

Decide by what already exists in the folder, then stop at the first row that matches:
- A mark file exists and the ask is "is it good": run the tests, report pass/fail per test, no redesign.
- A mark file exists and the ask is variants: skip concepts; cut small-size, mono, reversed and the file set.
- A mark file exists and the ask is a refresh: inventory what people already recognise first
  ([redesign](references/process-and-delivery.md)), then treat it as new.
- Nothing exists: concepts first, build only survivors.

Missing brief: ask once, in one message, for exact name spelling, offer, audience, three adjectives and
constraints, or write down your assumptions and go. Turn each adjective into a form cue (sharp or round,
heavy or light, closed or open); that mapping is what the tone test later checks.

Before building the kit for a new mark, hand over the surviving concepts (each with a sentence of idea
and one honest risk, plus true 64/32/16 px renders) and name your pick. Proceed on a yes; proceed alone
only if told not to check in.

## Decision rules

Concepts are cheap sentences; builds are expensive. Therefore:
- Write more ideas than you will build [practice: about ten], over at least two mark types.
- Cull by sentence: drop an idea that fits a competitor equally well, needs "and also", or is just the
  product drawn (cup for coffee). Then build the survivors that differ most [practice: three].
- Cliché list first: before drawing, write the category's stock symbols (at least five [practice]). Pass: no concept
  silhouette matches one when both are filled solid at 64 px; "new form" means that overlay differs.
- Build flat black on white, one file per iteration (`a-v1.svg`, `a-v2.svg`), described in words
  before drawn ([construction](references/construction.md)). Render each iteration to PNG before editing
  again; if you cannot render, say so and keep the geometry plain.
- Fix what a test fails and retest; repeat until the tests pass, and log what changed and by how much.
- Detail floor: no part smaller than 1/48 of mark width [upstream], no hairlines, no gap that closes at
  16 px. Precedence: for a monoline mark that must read at 24 px, the stricter stroke at least 8% of mark
  width [upstream] wins over 1/48. More
  detail wanted? Make a separate small-size cut; never shrink the master.
- Colour: design mono; ship one or two colours; a third needs a stated reason. Effects never rescue a
  shape; if black fails, the mark fails.
- Type: two faces at most; letters are outlined; a modified letter must still read as that letter.
- Footprint: a symbol has width/height between 0.8 and 1.25 [upstream], so it fits avatars and tiles;
  lockups are wide, height fixed.
- Shelf: see [tests](references/tests.md) section 5 for the procedure; fail if you miss it or anyone
  names an existing brand.
- Library: study only ([process](references/process-and-delivery.md)); never trace or adapt a mark.
- No clearance claims: recommend a trademark and reverse-image search, and name the fonts you assumed.

## Optical corrections (last, after geometry is fixed)

Each correction is a move plus a check; make it on one or two anchors, then apply the cap.
- If horizontals read heavier than verticals, thin horizontals 5-10% [upstream]. Check: the squint render shows no darker bars.
- If round tops and bottoms look short, overshoot the line 1-3% of height for curves, 3-6% for sharp apexes [upstream]. Check: the edges look level at 32 px.
- If the reversed (light-on-dark) cut looks heavier, thin its strokes 2-5% of stroke weight [upstream], or
  ship it a touch smaller. Check: the ink-coverage ratio in [tests](references/tests.md) section 3.
- Bone effect (a straight side pinching between big rounded ends): lengthen Bézier handles from the
  circular 0.5523 x radius toward 0.65 x radius [upstream: 0.55-0.65 of corner size]. Check: rotate the render 90 degrees; if the pinch follows the new vertical, push further.
- Optical centre: if the symbol sits low in its tile, nudge it up 1-2% of its height [practice]; a lopsided shape (play triangle)
  shifts toward its heavy side by the same amount. Check: crop to a circle; the gaps between mark and
  circle edge on opposite sides differ by under 3% of the crop diameter [practice].
- Cap: flick before/after at 32 px; if you can tell them apart, undo half. Detectable at 512 px but not
  at 32 px means the move is right; if it is invisible at 512 too, drop it.

## Verify

Run on each concept before the sheet and again on final art; full recipes (HTML sheet, ffmpeg and
ImageMagick lines, grep) in [references/tests.md](references/tests.md). Order is by cost of a miss:
1. File check (`grep -nE "<text|<image|<filter|<mask|<use|style=" logo.svg` prints nothing): no live text, rasters, filters, masks, `<use>`, inline `style`; viewBox set.
2. Scale: 512/64/32/16 px real renders; idea intact at 16 px.
3. Value: black on white, white on black, greyscale; reversed coverage not heavier.
4. Unintended reading: mirror, rotate 90/180, then one cold viewer who got no brief.
5. Junctions at 800%; squint blur; shelf and familiarity checks; tone and production checks.
State exactly which you ran; never claim one you skipped.

## Do not

- Do not open with colour, gradients or mockups.
- Do not show a long gallery; show a few concepts that differ.
- Do not call unmodified stock-font text a wordmark concept.
- Do not ship a master with live text, rasters, filters or masks.
- Do not judge only on a white artboard.
- Do not run or install upstream tooling; every check here works in a browser or with ffmpeg/ImageMagick.
- Do not promise legal clearance or colour-accurate print without a proof.
