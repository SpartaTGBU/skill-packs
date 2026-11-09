---
disable-model-invocation: true  # skl: on-demand pack skill
name: svg-character-animation
description: "Make a drawn SVG character or scene feel alive with code: live faces, full-body acting, idle motion for plants, cloth, fire, water, machines, icons and charts, and short one-shot scenes, in React Native (react-native-svg + Reanimated), SwiftUI (TimelineView + Canvas) or web. Use when asked to animate an illustration or mascot, add idle motion, stop a figure looking robotic or teleporting between poses, or recreate a reference video's motion in code. Slices: svg-character-animation-rig (rules, starting numbers, character rules), svg-character-animation-scenes (scene beats, performance and pitfalls)."
---

# SVG Character Animation

Goal: a drawing that moves like a living thing and never looks busy. The usual failures are
swapping one drawing for another (the face teleports), easing every pose to a dead stop, moving all
parts in sync, flickering blinks, and hairline seams on faces. The cure is structural: one clock
per scene, parts rotating about real pivots, trailing parts a beat late, a small idle layer that
never stops, and paths that pass smoothly through key poses.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:svg-character-animation-rig` | building or tuning a character, face, limb or idle loop | Rules, Numbers to start from, Character rules |
| `atelier:svg-character-animation-scenes` | sequencing a one-shot scene or carousel, or fixing cost, seams and platform pitfalls | Scenes, Performance and pitfalls |

References, read on demand:
- [engine and faces](references/engine-and-faces.md): clock and curve helpers, the live-face layer stack, mood presets.
- [acting and scenes](references/acting-and-scenes.md): arms, turning, weight, landing, props, camera build, framing.
- [subjects and reference video](references/subjects-and-reference-video.md): idle recipes by subject, measuring a clip, platform mapping.

## Procedure

1. Look for project motion notes (a `MOTION.md` by the art, `CLAUDE.md`). They override this file. If absent, create `MOTION.md` beside the art: engine location, owner rules with dates, rig limits, how changes are checked.
2. Identify the platform and any existing clock/curve code. Reuse it; write the small engine in the reference only if none exists.
3. Inventory the drawing: subject, parts with pivots, repeated items, light, background.
4. Choose exactly one main action and at most three idle loops. Everything else stays still. Test: if you cannot name the main action in one sentence, cut until you can.
5. Split the art into layers at joints without changing how frame 0 looks (compare screenshots before and after).
6. Put every tunable number in one token object at the top of the file.
7. Build, run Verify, then report: what moves, what is deliberately still, what has not been seen on a device.

## Neighbours (split rules)

- `atelier:motion-design`: motion of interface elements (springs, durations, scroll, transitions). This skill: motion inside a drawing.
- `atelier:2d-animation`: authoring in Lottie, Rive, spritesheets or bone rigs. This skill: hand-coded transforms on SVG groups.
- `atelier:art-motion`: art-directed motion pieces where the look is the brief. This skill: when the deliverable is an app or page illustration that must run live.
- `atelier:animation-reverse-engineering`: extracting timing and structure from someone's running animation. Rule: analysing someone's running animation goes there; building the code motion from the beats goes here.
- `atelier:launch-film`, `atelier:explainer-video`, `atelier:video-direction`: story, script and shot planning for a film. This skill: the character layer inside it.
- `atelier:video-composition`, `atelier:video-editing`: assembling and cutting rendered footage. This skill: producing the frames' motion.
- `atelier:ai-video`: generated clips. This skill: deterministic code motion; if the user wants a model to invent the motion, route there.
- `atelier:math-animation`: equation and geometry scenes. This skill: organic figures.
- `atelier:audio-review`: if lip-sync or sound timing matters, check audio there; it judges sound, this skill never touches audio.
- `atelier:visual-qa`: screenshot and frame judging beyond the checks below.
- `atelier:illustration-and-icons` (drawing the art), `atelier:mobile-native` (platform app work beyond the animation code), `atelier:diagrams` (static diagrams): route there when the art or platform work dominates.

## Verify

These steps need only a browser or simulator, `ffmpeg` and `ffprobe`.

1. Capture frames: `ffmpeg -framerate 60 -i frames/%04d.png -vf "select='not(mod(n,4))',scale=320:-1,tile=6x4" -frames:v 1 sheet.png`, or screen-record and `ffmpeg -i rec.mp4 -vf fps=15 f%04d.png`. Read the sheet.
2. Reduced-motion capture: frame 0 vs t=5 s SSIM 1.0 (rule 8 in `atelier:svg-character-animation-rig`); the one-shot's last frame reads alone.
3. Loop seam: `N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 loop.mp4); ffmpeg -i loop.mp4 -vf "select='eq(n,0)'" -frames:v 1 a.png; ffmpeg -i loop.mp4 -vf "select='eq(n,$((N-1)))'" -frames:v 1 b.png; ffmpeg -i a.png -i b.png -lavfi ssim -f null -` . Pass: `All:` SSIM at least 0.98 [practice]; below that the loop jumps.
4. Frozen-channel test on the idle-loop segment only: `ffmpeg -ss 2 -t 8 -i clip.mp4 -vf "freezedetect=n=0.001:d=0.5" -f null -` reports no freeze. Over a whole clip, every freeze event must coincide with a declared hold or the one-shot's final hold.
5. Hairlines and glasses rings: zoom a still to 200-400% on eyes and clip edges.
6. Blink and snap flicker: step frame by frame at the target fps; each fast event spans 3+ frames.
7. Numeric checks: track left and right limb angles over the clip; the correlation of the pair must be below 0.9, and the head's peak must come 60 ms or more after the body's peak [practice]. At least one weight shift and one blink on a head turn, read from the sheet.
8. Hidden/backgrounded: tick counter stays still. Project type check, lint and tests pass.
9. For deeper frame review hand off to `atelier:visual-qa`.

## Do not

- Swap drawings between expressions or poses.
- Ease every pose with `track`, or add default overshoot.
- Animate everything in sync or call `Math.random()` per frame.
- Move or resize the view to fake motion.
- Loop endlessly on UI chrome; icons and logos play once and rest.
- Copy someone else's measured art or brand mascot into published work.
- Require or install any third-party skill, CLI or script; the engine is a few dozen lines you write.
