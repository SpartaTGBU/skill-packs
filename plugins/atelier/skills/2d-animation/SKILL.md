---
disable-model-invocation: true  # skl: on-demand pack skill
name: 2d-animation
description: >
  2D character and asset animation for screens and games: choosing frame-by-frame vs rigged/cutout,
  timing in frames at 12/24/30 fps, sprite sheets, Lottie (lottie-web, lottie-react, dotLottie) and
  Rive state machines, with export budgets, reduced-motion stills and frame-level verification. Use
  when asked to animate a character, mascot, icon or illustration, build a sprite sheet or game
  sprite, ship a Lottie or Rive file, make an animated empty state or loader, or fix choppy,
  oversized or blurry 2D animation.
---

# 2D Animation

Animation of drawn things: characters, mascots, icons, illustrated scenes, game sprites. Interface
transitions and micro-interactions go to `atelier:motion-design`; drawing the static artwork to
`atelier:illustration-and-icons`; rendered video edits to `atelier:video-composition`; procedural
pieces to `atelier:generative-art`.

## Pick the technique

| Technique | Strengths | Costs | Tools (options) |
|---|---|---|---|
| Frame-by-frame | Organic motion, effects, squash, smears, full stylization | Every frame drawn; large output | Krita, OpenToonz, Aseprite (pixel), Blender Grease Pencil |
| Rigged / cutout | Reuse, long scenes, lip sync, cheap variations | Stiff if overused; rig setup time | Rive bones, Spine, DragonBones, Moho, After Effects + Duik |
| Vector keyframe (Lottie) | Small, crisp, scriptable playback, designers export it | Feature subset of After Effects; no runtime logic | After Effects + Bodymovin, Lottie creator tools |
| State machine (Rive) | Interactive, input- and data-driven, blends between states | Runtime weight; learning the editor | Rive |
| Sprite sheet | Games, pixel art, no runtime dependency, CSS-only on the web | Raster size grows with frames and scale | Aseprite, ImageMagick montage, TexturePacker |
| CSS/SVG by hand | Tiny, accessible, themeable | Only simple shapes and paths | SMIL avoided; CSS keyframes or WAAPI |

Rule: the lightest technique that holds the motion. A spinning logo is CSS; a mascot that reacts
to hover, focus and form errors is Rive; a celebratory one-shot is Lottie; a game hero is a sprite
sheet or a skeletal rig.

## Timing in frames

Plan in frames, not milliseconds. Animate "on twos" (one drawing held for 2 frames at 24fps = 12
drawings per second) for hand-drawn work; use ones for fast action and camera moves. Keep one frame
rate per piece.

| Beat | 12 fps | 24 fps | 30 fps | ~ms |
|---|---|---|---|---|
| Blink | 2 | 4 | 5 | 170 |
| Small anticipation | 2-4 | 4-8 | 5-10 | 170-330 |
| Fast main action (hit, snap) | 1-2 | 2-4 | 3-5 | 80-170 |
| Impact squash hold | 1 | 1-2 | 2 | 40-80 |
| Follow-through and settle | 3-6 | 6-12 | 8-15 | 250-500 |
| Readable held pose | 4-6 | 8-12 | 10-15 | 330-500 |
| Walk cycle (2 steps) | 12 | 24 | 30 | 1000 |
| Run cycle (2 steps) | 6-8 | 12-16 | 15-20 | 500-670 |
| Idle breathing loop | 24-48 | 48-96 | 60-120 | 2000-4000 |

## Principles, applied

- **Squash and stretch**: keep volume constant (stretch 1.2x long means ~0.83x wide); never on rigid objects.
- **Anticipation**: a small opposite move before every big one; bigger action, longer anticipation.
- **Slow in, slow out**: cluster drawings near extremes; spacing charts before inbetweens.
- **Arcs**: limbs, heads and thrown objects travel on arcs; check by onion-skinning the path.
- **Follow-through and overlap**: hair, tails, clothes lag 2-4 frames (at 24) behind the body and settle after it.
- **Timing and spacing**: the same pose pair reads heavy or light by frame count alone.
- **Staging and silhouette**: each key pose readable as a filled black silhouette.
- **Secondary action**: supports, never competes with, the main action.
- **Exaggeration**: push key poses ~20-30% past reference; smears or multiples for 1-2 frames on fast moves.
- **Holds**: moving holds (1-2px drift or breathing) keep a character alive; full stops read as dead.
- Workflow: keys -> breakdowns -> timing pass (play rough at speed) -> inbetweens -> cleanup -> color.
  Fix timing on roughs; never polish frames that may be cut.

## Sprite sheets

- One row per animation (or a packed atlas with a JSON frame map for games). Equal frame cells;
  power-of-two atlas sizes and 1-2px padding (extruded edges) for GPU texture sampling.
- Pack: `magick montage f_*.png -tile x1 -geometry +0+0 -background none sheet.png`.
- Pixel art: draw at native size, scale by integers only (2x, 3x, 4x), `image-rendering: pixelated`
  (fall back to `crisp-edges`); no fractional transforms or subpixel positions.
- CSS playback: `animation: run 0.8s steps(8) infinite;` with `background-position` from 0 to
  `calc(-1 * var(--frame-w) * var(--scale) * 8)`; size the element to one scaled frame.
- Reduced motion: show a chosen representative frame (a `--static-frame` custom property), not frame 0
  if frame 0 is mid-blink.
- Budgets: web sheets under ~200 KB each (WebP or PNG with indexed palette for pixel art); game
  atlases sized to the target GPU (2048x2048 is safe on mobile).

## Lottie

- Players: `lottie-web` (`lottie.loadAnimation({ container, renderer: "svg", loop, autoplay, path })`),
  `lottie-react` in React projects, the dotLottie player for `.lottie` files. Use whichever the project already has.
- Renderer: `svg` for crisp scaling, DOM styling and few instances; `canvas` for many instances or
  heavy scenes. Measure both if in doubt.
- Size: keep JSON under ~100 KB (hard ceiling ~250 KB); no embedded rasters, flatten precomps,
  trim hidden layers, round keyframe precision, avoid expressions and effects the player does not
  support (check the player's supported-features list). Prefer `.lottie` (zipped, can bundle
  themes and multiple animations) when the player supports it.
- Behavior: lazy-load below the fold, pause when offscreen (IntersectionObserver) and when the tab
  is hidden, `destroy()` on unmount, limit loops (a celebration plays once).
- Reduced motion: `goToAndStop(frame, true)` on a meaningful frame; decorative animations get
  `aria-hidden="true"`; informative ones get a text alternative.

## Rive

- Use when motion depends on state or input: hover, press, focus, drag, scroll position, form
  validity, live values (progress, score, temperature).
- Design the state machine first: states, inputs (boolean, number, trigger), transitions with
  blend durations (100-300ms), listeners for pointer events. Name inputs as the app will set them.
- Drive it from app code by setting inputs (or data binding in recent runtimes), not by replaying
  timelines. One artboard per component; keep text in the app unless it must animate.
- Runtimes: web canvas/WebGL, React, iOS, Android, Flutter. Measure the added runtime weight
  against the page budget; load it lazily.
- Keyboard and screen readers: the `<canvas>` is opaque; mirror state with real buttons and labels,
  and drive Rive inputs from those controls.

## Anti-slop

- Not every illustration bounces. Motion must express the character or state, not decorate.
- No uniform easing on every property; no lip sync without mouth shapes; no 60fps tweened puppets
  pretending to be hand-drawn.
- Consistent line weight and light direction across frames; no boiling unless it is the style.
- Loops end on the frame before the first (no doubled frame at the seam).

## Export

| Target | Format | Notes |
|---|---|---|
| Web decorative | Lottie / .lottie, CSS sprite, animated WebP or AVIF | Avoid GIF except for email and chat |
| Web interactive | Rive (.riv) | Plus static fallback image |
| Game | Atlas PNG + JSON, or skeletal data + atlas | Premultiplied alpha as the engine expects |
| Video / social | ProRes 4444 with alpha, or H.264 / VP9 | Edit in `atelier:video-composition` |
| Frames | PNG sequence, sRGB, straight alpha | Name `name_0001.png` |

Check transparent edges for dark or white halos (premultiplied vs straight alpha mismatch).
License: record the source of every font, rig, and purchased asset; do not ship marketplace assets
outside their license terms.

## Verify

1. Contact sheet of every frame (`magick montage` or `ffmpeg ... tile=8x4`): check arcs, volume,
   line consistency, seam frame.
2. Play at target fps and at 0.25x; for Lottie seek with `goToAndStop`, for CSS sprites pause via WAAPI
   (`anim.currentTime = (k + 0.5) * frameDuration`) and screenshot specific frames.
3. Check at device pixel ratios 1, 2 and 3 for blur or pixel-art smearing; in Chromium, Firefox and WebKit.
4. Toggle reduced motion (Playwright `reducedMotion: "reduce"`) and confirm the static frame.
5. Measure file sizes against the budgets above and frame time (no long tasks during playback).
