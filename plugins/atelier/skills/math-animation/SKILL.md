---
disable-model-invocation: true  # skl: on-demand pack skill
name: math-animation
description: >
  Programmatic teaching animation with Manim Community Edition: arc and narration first, one idea per
  scene, LaTeX equations, a fixed color language, explainer pacing, render quality flags, stitching
  and frame-level verification. Use when asked to animate a math concept, derivation, proof, algorithm,
  data structure, system architecture or paper as an explainer video, "3Blue1Brown style" clip, or
  Manim scene, or when fixing a Manim script that renders wrong or reads too fast.
---

# Math Animation

Teaching animation is an argument told in pictures. Manim Community Edition (v0.18+, Python,
LaTeX, ffmpeg) is the default engine; the principles hold for any engine. Rendered video assembly,
music and captions beyond subcaptions go to `atelier:video-composition`; static diagrams to
`atelier:diagrams`; charts of real data to `dataviz`.

## Should it move at all?

Animate when a sequence unfolds, a spatial relationship changes, something is built from parts,
two states are compared, or change over time is the point. Stay static (`atelier:diagrams`) for
one labeled picture or a dense table the viewer must study. Test: "first X, then Y, then Z" means
animate; "point at parts of one picture" means static.

## Pipeline

1. **Arc.** One paragraph: the misconception fixed, the aha, the path from confusion to
   understanding, the audience (it sets pacing and notation depth).
2. **Narration then beats.** Write the script; mark each visual beat (one `play()` or a small
   simultaneous group). The picture appears slightly before the words that name it ("see, then hear").
3. **plan.md.** One new idea per scene; per scene: goal, beats, on-screen elements, duration
   (sum of `run_time` + waits = narration length), and the color assignment.
4. **Code.** `script.py`, one `Scene` class per scene, shared palette and font constants at the top,
   every scene renderable alone.
5. **Draft render** at `-ql`, still frames for layout, then final render at `-qh`.
6. **Stitch** scenes with ffmpeg concat (list file, `-c copy` when codecs match), then add audio.
7. **Review** frames (below) before calling it done.

## Scene structure

```python
from manim import *
BG, PRIMARY, SECOND, ACCENT = "#1C1C1C", "#58C4DD", "#83C167", "#FFFF00"
MONO = "JetBrains Mono"   # any installed monospace

class Pythagoras(Scene):
    def construct(self):
        self.camera.background_color = BG
        title = Text("Why a² + b² = c²", font=MONO, font_size=48).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1.5); self.wait(1.0)
        self.next_section("squares")            # enables --save_sections
        ...
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.5); self.wait(0.3)
```

Animation choice per beat: first appearance `Create`, `Write`, `FadeIn`, `GrowFromCenter`; change of
identity `Transform`, `ReplacementTransform`, `TransformMatchingTex`; attention `Indicate`,
`Circumscribe`, `Flash`; continuous relationships `ValueTracker` + `always_redraw` or updaters;
lists `LaggedStart(..., lag_ratio=0.1-0.3)`; exit `FadeOut`, `Uncreate`; static context `self.add`.

## Equations (LaTeX)

- `MathTex(r"...")` with raw strings; split into substrings (`MathTex("a^2", "+", "b^2")`) or use
  `substrings_to_isolate` so terms can be colored and transformed individually.
- `TransformMatchingTex` between algebra steps so unchanged terms stay put; never write a new
  equation over the old one.
- Dim and reveal: show the target equation at opacity 0.2, light terms in the order the argument
  needs (not left to right), drop finished terms to 0.4-0.5 as context.
- Geometry before algebra: show the shape, then the formula that names it.
- Needs a TeX install (TeX Live or MiKTeX with `standalone`, `amsmath`, `dvisvgm`); a missing
  package fails at render time, so render one equation still early.

## Visual language

- Dark background (`#1C1C1C` to `#2D2B55`), light content, at least ~15% of the frame empty.
- Palettes (pick one, keep it for the whole video): classic `#1C1C1C` bg, `#58C4DD`, `#83C167`,
  `#FFFF00`; warm academic `#2D2B55`, `#FF6B6B`, `#FFD93D`, `#6BCB77`; monochrome `#1A1A2E`,
  `#EAEAEA`, `#888888`. Neon is a last resort.
- One color = one concept for the whole video (if `x` is blue in scene 1 it is blue in scene 6).
  Same concept keeps the same screen region.
- Opacity layering: focus 1.0, context 0.4, structure (axes, grids) 0.15.
- Text: monospace font for `Text` (Pango kerning breaks proportional fonts); sizes title 48,
  heading 36, body 30, label 24, caption 20, never below 18; edge text `buff >= 0.5`.
- Check contrast: text on bg at least 4.5:1; never encode meaning in red vs green alone.
- Transform rather than replace to show connection; a small reused motion vocabulary.

## Pacing (the universal mistake is too fast)

| Moment | run_time | wait after |
|---|---|---|
| Title or intro | 1.5s | 1.0s |
| New equation | 2.0s | 2.0s |
| Transform or morph | 1.5s | 1.5s |
| Supporting label | 0.8s | 0.5s |
| Aha moment | 2.5s | 3.0s |
| Cleanup fade-out | 0.5s | 0.3s |

Always wait after a reveal. Vary tempo: slow build for the core idea, quick succession for
supporting detail, a pause before the reveal. Viewers track one or two simultaneous animations.
Rate functions: `smooth` default, `rate_functions.ease_in_out_cubic` for moves, `linear` only for
constant processes (a sweeping tracker).

## Render

| Flag | Output | Use |
|---|---|---|
| `-ql` | 854x480, 15fps | iteration (text kerning looks poor here; judge text at `-qm`) |
| `-qm` | 1280x720, 30fps | review drafts |
| `-qh` | 1920x1080, 60fps | final |
| `-qk` | 3840x2160, 60fps | only if asked |

- `manim -ql script.py SceneName`; `-a` renders all scenes; `-p` previews.
- Still of the last frame: `manim -qm -s --format=png script.py SceneName`.
- Vertical (shorts): `--resolution 1080,1920`; set `config.frame_width` accordingly and re-check margins.
- `--save_sections` with `self.next_section()` outputs per-section clips for editing.
- Put defaults in `manim.cfg` (`[CLI] background_color`, `frame_rate`) rather than repeating flags.
- GIF: render MP4, then ffmpeg two-pass `palettegen`/`paletteuse` at 480-640px wide, 15fps.
- Captions: `self.add_subcaption("text", duration=...)` writes an `.srt` beside the video; ship it.
  Burned-in or styled captions go to `atelier:video-composition`.

## Common bugs

- Animating a mobject that was never added, or one already removed: add it first, or use
  `ReplacementTransform` so the scene graph stays clean.
- `Transform(a, b)` keeps `a` on screen as the morphed object; later code that touches `b` does
  nothing visible. Use `ReplacementTransform` when you continue with `b`.
- Updaters that never stop: `clear_updaters()` before the next beat.
- Overlapping labels after a transform: re-position with `next_to(..., buff=0.25)` after layout changes.
- Text overflowing the frame at 16:9 or 9:16: check `width` against `config.frame_width - 1`.

## Patterns

- Pipeline or architecture: five clear boxes beat twelve abbreviated ones. Box appears and is
  explained, arrow grows, next box; then flow a dot along the arrows. For depth: overview, zoom into
  one box (`MovingCameraScene`), expand, zoom out.
- Algorithm: show the data structure, then step the algorithm one operation per beat, highlight
  the active element, keep a small state panel (counters, pointers) in a fixed corner.
- Paper explainer: problem and key figure first, method as a build-up, result last; never recite the abstract.
- Anti-patterns: everything at once, equations with no picture, identical pacing for 3 minutes,
  skipping the why, decorative particles, reflexive camera spins.

## Verify

1. Render stills at each beat boundary (`-s` on a truncated scene, or extract with
   `ffmpeg -ss <t> -i out.mp4 -frames:v 1 beat_<t>.png`) and look at every one: nothing clipped,
   no overlaps, labels legible at phone size, colors match the concept map.
2. Contact sheet of the whole video: `ffmpeg -i out.mp4 -vf "fps=1/2,scale=480:-1,tile=4x4" sheet.png`.
3. Check duration per scene against plan.md; ffprobe the final for resolution, fps and audio sync.
4. Watch it once at 1x with sound and once muted (does the picture alone carry the argument?).
5. Captions present and aligned; no flashing above 3 per second.
