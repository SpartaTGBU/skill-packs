---
disable-model-invocation: true  # skl: on-demand pack skill
name: svg-character-animation-scenes
description: "Sequence short one-shot SVG scenes and keep them cheap: beats as data windows on one clock, overlapping beats, held final frame, carousel hand-off; one clock per scene, one canvas for many items, React Native and SwiftUI pitfalls, unique clip-path ids, hairline seams, winding holes. Use when building a scene or carousel, or when an SVG animation stutters or shows seams. Slice of atelier:svg-character-animation."
---

Slice of atelier:svg-character-animation (scene beats, performance and pitfalls). Siblings: atelier:svg-character-animation-rig.

## Scenes

A scene is one one-shot clock of a few seconds. Write beats as data windows, e.g. `{ ring: [0, 900], reach: [900, 1500] }`, map each to 0-1 with `seg`, start the next beat slightly before the last ends, and hold the final frame while idle loops carry on. In a carousel the leaving scene completes its exit (or crossfades) before the next starts, and only the visible scene runs.

## Performance and pitfalls

- One clock per character/group/scene; every value is a pure function of its time.
- Many items (particles, stars): one SVG or `Canvas` driven by that clock, never one animated view each.
- React Native: include `live` in each `useAnimatedProps` dependency list; reset a repeating value to 0 before `withRepeat` and cancel in cleanup; define easings at module top.
- SwiftUI: `TimelineView(.animation)` redraws every frame; pause it; one per scene.
- Clip-path ids are global per screen: make them unique. Do not stack large Skia canvases.
- Seams: two anti-aliased edges on one line leave a hairline. Draw one outline rather than cap plus hole.
- Overlapping subpaths in one path can cancel under nonzero winding and punch holes: fill each separately.

## Verify

These steps need only a browser or simulator, `ffmpeg` and `ffprobe`.

1. Capture frames: `ffmpeg -framerate 60 -i frames/%04d.png -vf "select='not(mod(n,4))',scale=320:-1,tile=6x4" -frames:v 1 sheet.png`, or screen-record and `ffmpeg -i rec.mp4 -vf fps=15 f%04d.png`. Read the sheet.
2. Reduced-motion capture: frame 0 vs t=5 s SSIM 1.0 (rule 8 in `atelier:svg-character-animation-rig`); the one-shot's last frame reads alone.
3. Loop seam: `N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 loop.mp4); ffmpeg -i loop.mp4 -vf "select='eq(n,0)'" -frames:v 1 a.png; ffmpeg -i loop.mp4 -vf "select='eq(n,$((N-1)))'" -frames:v 1 b.png; ffmpeg -i a.png -i b.png -lavfi ssim -f null -` . Pass: `All:` SSIM at least 0.98 [practice]; below that the loop jumps.
4. Frozen-channel test on the idle-loop segment only: `ffmpeg -ss 2 -t 8 -i clip.mp4 -vf "freezedetect=n=0.001:d=0.5" -f null -` reports no freeze. Over a whole clip, every freeze event must coincide with a declared hold or the one-shot's final hold.
5. Hairlines and glasses rings: zoom a still to 200-400% on eyes and clip edges.
6. Hidden/backgrounded: tick counter stays still. Project type check, lint and tests pass.
7. For deeper frame review hand off to `atelier:visual-qa`.

## Do not

- Animate everything in sync or call `Math.random()` per frame.
- Loop endlessly on UI chrome; icons and logos play once and rest.
- Copy someone else's measured art or brand mascot into published work.
- Require or install any third-party skill, CLI or script; the engine is a few dozen lines you write.
