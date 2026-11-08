---
disable-model-invocation: true  # skl: on-demand pack skill
name: generative-art
description: >
  Algorithmic and procedural art: write the algorithmic philosophy first, then ship one self-contained
  HTML viewer (p5.js or a fragment shader) with seeded randomness, seed navigation, parameter sliders
  and PNG export; ASCII and procedural video pipelines; reproducible PNG, GIF and MP4 output. Use when
  asked for generative or algorithmic art, a p5.js sketch, flow fields, particles, noise landscapes,
  a shader piece, ASCII art or ASCII video, a seeded series of variations, or a procedural background.
---

# Generative Art

A generative piece is a system, not a picture: a small algorithm with a point of view, explored
through seeds and parameters. UI motion goes to `atelier:motion-design`; math explainers to
`atelier:math-animation`; 3D scenes to `atelier:web-3d`; charts of real data to `dataviz`.

## 1. Write the algorithmic philosophy first

Before code, write 4-6 sentences (keep it in the HTML as a comment or an "about" panel):
- **Process**: what the system does (agents follow a noise field, cells subdivide, waves interfere).
- **Tension**: what pulls against it (order vs drift, density vs void, growth vs decay).
- **Character**: the mood that should survive every seed.
- **Invented element**: at least one rule that is not a stock tutorial (a field that remembers,
  agents that avoid their own past, a palette that shifts with curvature).
- **Parameters**: 3-6 knobs that change the character of the algorithm (turbulence, lifespan,
  branching), not cosmetics (stroke color picker). Each gets a range and a default.

Anti-slop: no default rainbow HSB sweep, no lone Perlin flow field with white lines on black and
nothing else, no perfectly centered symmetric blob, no glow on everything. Name the reference
(woodcut, risograph, topographic map, textile, circuit board) and design toward it.

## 2. Choose the medium

| Need | Use |
|---|---|
| Agents, lines, geometry, interaction | p5.js (Canvas 2D) |
| Per-pixel fields, millions of points, real-time distortions | GLSL fragment shader (raw WebGL or p5 `createShader`) |
| Terminal look, text texture, video stylization | ASCII pipeline (below) |
| Plotter or print vector output | p5.js-svg or hand-built SVG |
| Offline high-res or long video | headless capture of the same HTML (Export) |

Use the project's existing stack first. p5.js: pin an exact 1.11.x build from cdnjs; use 2.x only
when you need its features (async setup, OKLCH colors) and pin it too.

## 3. The self-contained viewer

One `.html` file, no build step, opens from disk. Structure:

```js
const CONFIG = { seed: 1, turbulence: 0.6, agents: 1200, lifespan: 300 }; // params with defaults
const PALETTE = ["#1b1b1e", "#e9e3d5", "#c84c32", "#2f5d62", "#d9a441"];   // 3-7 colors
let state;                                                                  // mutable, rebuilt per seed

function setup() {
  p5.disableFriendlyErrors = true;
  pixelDensity(1);
  createCanvas(1200, 1500);
  reset();
}
function reset() {
  randomSeed(CONFIG.seed); noiseSeed(CONFIG.seed);   // every random call flows from the seed
  state = initState();
  clear(); background(PALETTE[0]); loop();
}
```

Controls (plain HTML, fixed side panel, keyboard reachable, labels on everything):
- Seed: number field, prev / next / random buttons, `←`/`→` keys; show the seed on screen.
- Sliders for each CONFIG param with live value readout; changing one calls `reset()`.
- "Download PNG" (`saveCanvas("piece-" + seed, "png")`) and "Copy params" (JSON of CONFIG).
- Put seed and params in the URL hash (`#seed=42&turbulence=0.6`) so a variant is a link.

## 4. Reproducibility

- Same seed + same params + same canvas size = same image. Never call `Math.random()`, never read
  the wall clock or `millis()` for the art; derive time from `frameCount`.
- Use only seeded `random()` and `noise()`; for shaders pass the seed as a uniform and hash with it.
- Fixed canvas size in CONFIG; scale for display with CSS, not by changing the drawing.
- Record the library version in the file. Test: render the same seed twice and diff the PNGs
  (`magick compare -metric AE a.png b.png null:` must print 0).

## 5. Craft and numbers

- Palette 3-7 colors with one dominant (60%), one secondary, one accent under 10%. Work in HSB or
  OKLCH; vary lightness more than hue. Check the accent against the background at 3:1 minimum.
- Stroke weight hierarchy: thin (0.5-1), medium (2-3), bold (5-8) at the base size; scale with canvas.
- Depth: layer speeds 1x / 0.3x / 0.1x, or opacity 1.0 / 0.4 / 0.15 for fore, mid, back.
- Composition: weight off center (thirds), leave 20-40% quiet space, keep detail at multiple scales.
- Texture: paper grain via a low-alpha noise layer in a `createGraphics` buffer, drawn once.
- Static pieces: draw progressively, then `noLoop()` when settled; show a progress indicator.

## 6. Performance

- Budget: 60fps interactive, 30fps ambient, `noLoop` for stills. Profile before optimizing.
- Hot loops: compare squared distances (no `sqrt`), precompute noise into arrays, avoid
  `push/pop` per particle, batch shapes with `beginShape(POINTS)`.
- Static layers in `createGraphics` buffers; redraw only what moves.
- Over ~20k moving elements: switch to a shader or instanced WebGL.
- Pause with `noLoop()` when the tab is hidden (`visibilitychange`).
- `prefers-reduced-motion: reduce`: render one still frame and offer a play button; never autoplay
  fast flicker (no more than 3 flashes per second).

## 7. Shaders

- Fragment shader over a full-screen quad; uniforms `u_resolution`, `u_time` (from frame count),
  `u_seed`, plus one uniform per param.
- Build from signed distance functions, domain warping (fbm of fbm), polar and tiled coordinates.
- Use `highp` float, guard division by zero, clamp colors; check on a mobile GPU or a software
  renderer before calling it portable.

## 8. ASCII and procedural video

Pipeline: input (video, image or pure procedure) -> analyze (luminance, edges, audio energy per
frame) -> scene function -> tonemap -> map to characters -> encode.
- Tools: Python with NumPy and Pillow, piping raw RGB frames to ffmpeg
  (`ffmpeg -f rawvideo -pix_fmt rgb24 -s 1920x1080 -r 24 -i - -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4`).
- Character ramps by density: `" .:-=+*#%@"` for light-on-dark; reverse for dark-on-light. Use a
  monospace font with a measured cell size; 8-12px cells at 1080p.
- Color per cell from the source, or one ink color plus one accent; keep contrast high.
- Render 3-5 test frames first and check they are not black (mean pixel value above ~8 of 255)
  and not blown out, before rendering the full video.
- Defaults: 1920x1080 at 24fps for video; GIF 640x360 at 15fps.

## 9. Export

- PNG: `saveCanvas` at the full CONFIG size; for print, render at 2-4x by scaling the drawing
  logic, not by upscaling pixels.
- GIF: `saveGif("name", seconds)` for short loops; keep under ~8 MB; make loops seamless by
  driving motion with `sin`/noise over a closed period (`t = frameCount / totalFrames * TWO_PI`).
- Video: `saveFrames` or a headless browser (Playwright or Puppeteer) stepping `frameCount`
  deterministically and screenshotting each frame, then
  `ffmpeg -framerate 30 -i f_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4`.
- SVG for plotters: p5.js-svg renderer or emit paths yourself; merge collinear segments.
- License: say what fonts, images or sampled media are inside; generated output from your own code
  is yours to license.

## 10. Verify

1. Open the HTML headless, render 6+ seeds (including min and max of every slider), screenshot
   each, and look at them as a contact sheet: is the character stable, is any seed broken, empty
   or muddy?
2. Reproducibility diff on one seed (above). Console has no errors.
3. Frame time measured at target size (DevTools performance or a `deltaTime` average) meets budget.
4. Controls work by keyboard; reduced-motion shows a still; exported PNG matches the screen.
5. For video: ffprobe resolution, fps and duration; check a frame contact sheet.
