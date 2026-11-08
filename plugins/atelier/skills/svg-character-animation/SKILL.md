---
disable-model-invocation: true  # skl: on-demand pack skill
name: svg-character-animation
description: >
  Make a drawn SVG character or scene feel alive with code: live faces (sliding pupils, blinks,
  breathing, head tilt), full-body acting (landing, waving, weight shift), idle motion for plants,
  cloth, fire, water, machines, icons and charts, and short one-shot scenes. Targets React Native
  (react-native-svg + Reanimated), SwiftUI (TimelineView + Canvas) and web. Use when asked to
  animate an illustration or mascot, add idle motion, stop a figure looking robotic or teleporting
  between poses, or recreate a reference video's motion in code. Routing: UI transitions and
  springs go to atelier:motion-design; Lottie, Rive, sprites and rigs to atelier:2d-animation;
  designed motion pieces to atelier:art-motion; reading a reference clip frame by frame to
  atelier:animation-reverse-engineering (it analyses, this skill builds); rendered film to atelier:video-composition,
  atelier:video-direction, atelier:video-editing, atelier:launch-film or atelier:explainer-video;
  generated clips to atelier:ai-video; equations to atelier:math-animation; sound to
  atelier:audio-review (it judges sound, this skill never touches audio); frame inspection to atelier:visual-qa (it judges stills and clips, this skill builds the motion and runs the basic checks).
---

# SVG Character Animation

Goal: a drawing that moves like a living thing and never looks busy. The usual failures are
swapping one drawing for another (the face teleports), easing every pose to a dead stop, moving all
parts in sync, flickering blinks, and hairline seams on faces. The cure is structural: one clock
per scene, parts rotating about real pivots, trailing parts a beat late, a small idle layer that
never stops, and paths that pass smoothly through key poses.

## Neighbours (split rules)

- `atelier:motion-design`: motion of interface elements (springs, durations, scroll, transitions). This skill: motion inside a drawing.
- `atelier:2d-animation`: authoring in Lottie, Rive, spritesheets or bone rigs. This skill: hand-coded transforms on SVG groups.
- `atelier:art-motion`: art-directed motion pieces where the look is the brief. This skill: when the deliverable is an app or page illustration that must run live.
- `atelier:animation-reverse-engineering`: extracting timing and structure from someone's running animation. Rule: analysing someone's running animation goes there; building the code motion from the beats goes here.
- `atelier:launch-film`, `atelier:explainer-video`, `atelier:video-direction`: story, script and shot planning for a film. This skill: the character layer inside it.
- `atelier:video-composition`, `atelier:video-editing`: assembling and cutting rendered footage. This skill: producing the frames' motion.
- `atelier:ai-video`: generated clips. This skill: deterministic code motion; if the user wants a model to invent the motion, route there.
- `atelier:math-animation`: equation and geometry scenes. This skill: organic figures.
- `atelier:audio-review`: if lip-sync or sound timing matters, check audio there.
- `atelier:visual-qa`: screenshot and frame judging beyond the checks below.
- `atelier:illustration-and-icons` (drawing the art), `atelier:mobile-native` (platform app work beyond the animation code), `atelier:diagrams` (static diagrams): route there when the art or platform work dominates.

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

## Rules

Each rule is stated with its check.

1. **No swaps.** Every change is an interpolation of a transform or a color. Check: no conditional that renders a different drawing for an expression or pose.
2. **Pivots.** Each moving part is its own group rotating about a joint (stem base, hinge, neck). Check: no part translates in a straight line when a rotation would explain it.
3. **Trailing parts lag.** Tips and children follow the parent with a phase delay that grows along the chain. Check: in a frame strip, the tip's extreme comes after the base's.
4. **Amplitude** [practice]. For the main body, idle displacement at most 2-3% of its size and rotation at most 6 deg. Exempt, with their own figures in the lists below and in the subjects reference: tail/ear/hair (4-10 deg), plant sway, fire stretch, phone buzz, and acting moves. Check: track the subject's edges over a 10 s capture and read max minus min as a percent of its height; above 3% means halve it (acting moves are exempt).
5. **Variety, not chaos** [practice]. Repeated items take phase, speed (about +-20%) and size from a stable `seeded(i)`. Check: grep for `Math.random` inside render or tick code finds nothing.
6. **Opacity only to enter or leave.** Check: log every opacity channel; none sits between 0.2 and 0.8 for more than 200 ms [practice].
7. **Layout is fixed** [practice]. Motion is a group transform inside the drawing. Check: the view's bounding box is identical on every frame.
8. **Reduced motion.** Loops freeze on a good frame 0; one-shots jump to a self-explanatory last frame. Check: with the OS setting on, capture frame 0 and a frame at t=5 s; SSIM between them is 1.0 for loops (`ffmpeg -i a.png -i b.png -lavfi ssim -f null -`), and the one-shot's t=5 s frame equals its last frame.
9. **Pause when unseen.** Every clock stops when off screen, hidden or backgrounded. Check: log tick count while hidden; it must be zero.
10. **Short events need frames.** Under about 100 ms is 2-3 frames at 30 fps and flickers. Make blinks, contacts and snaps at least 100 ms and target 60 fps.
11. **Calm curves.** No overshoot unless the brand is bouncy. Travel moves use ease-in-out `(0.77, 0, 0.175, 1)` [up MOTION.md], arrivals ease-out `(0.23, 1, 0.32, 1)` [up MOTION.md], exits and falls ease-in, endless loops linear. Declare curves once at module top.

## Numbers to start from

Drawing units and ms; tune after Verify. [up MOTION.md] / [up SKILL.md] = figure appears in that
upstream file; [practice] = common craft knowledge.

**Body life**
- Breathing lifts 1-2 units on a 3-5 s cycle [up MOTION.md].
- Plants sway 1.5-4 deg about the base over 3-6 s [up MOTION.md].
- Tail, ear, hair swing 4-10 deg at the root, each segment 0.1-0.2 of a cycle later [up MOTION.md, up SKILL.md].
- Head tilt: upstream disagrees (+-2 deg in SKILL.md's idle list, 3-6 deg in its tables and MOTION.md). We use +-2 deg over 4-5 s for idle, up to 6 deg for a deliberate cock. No tilt while a hand is on the face [up SKILL.md].

**Eyes**
- Blink every 3-4 s: lids close in about 110 ms and reopen in about 190 ms with ease-out [up MOTION.md], plus a 30-50 ms dwell [up SKILL.md]. Total closed-and-moving time therefore exceeds 100 ms, which satisfies rule 10.
- Gaze glides about 500 ms, then holds 1 s or more [up SKILL.md].

**Weight and contact**
- Landing squash 15-20%, width = 1 / height^0.6 [up SKILL.md].
- Follow-through: child reads the parent 60-150 ms earlier at 0.3-0.6 strength [up SKILL.md]; MOTION.md says 90-140 ms. Pick one range per scene.

**Chrome around the art**
- Interface moves under 300 ms [up MOTION.md]; entrances start at scale 0.9-0.97, never 0 [up SKILL.md]; exits faster than entrances [practice].

## Character rules

- **`flow` for acting, `track` for single moves.** `track` stops at every key, so a pose chain freezes at each one. `flow` keeps speed continuous through keys without overshoot. To hold a pose, repeat its value across keys. Check: a velocity plot of any acting channel has no zero between non-hold keys.
- **No frozen channel.** While on stage each channel gets a low idle layer on a period that divides the loop, left and right out of phase [practice: breathing about +-1%, limb sway on two periods, weight drift]. Check: take the speed of every channel at 20 random times; none is exactly 0 outside a deliberate hold.
- **Layer channels:** final = key pose + idle + delayed-parent follow-through + gated accent (e.g. a wave window).
- **Live eyes** (details in the engine reference): pupil-less whites, sliding clipped pupil, lids clipped to a shape 2 units bigger than the white, then nose/fringe/glasses, then mouth.
- **Limbs bend:** two equal segments with a round joint; forearm angle = shoulder angle + bend.
- **Break symmetry:** left and right differ in angle, phase and bend. Check: no pair of mirrored channels has identical keys.
- **Shadow tracks height** and stays on the floor; airborne feet hang limp.
- **Props enter already moving** from beyond the visible screen edge; eyes and head follow.

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
2. Reduced-motion capture: frame 0 vs t=5 s SSIM 1.0 (rule 8); the one-shot's last frame reads alone.
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
