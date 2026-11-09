---
disable-model-invocation: true  # skl: on-demand pack skill
name: svg-character-animation-rig
description: "Rig rules for a living SVG character: no swaps, real pivots, trailing lag, amplitude caps, seeded variety, fixed layout, reduced motion, pause when unseen, calm curves; starting numbers for breathing, sway, blinks, gaze, squash and follow-through; character rules for flow vs track, no frozen channel, layered channels, live eyes, bending limbs, broken symmetry. Use when building or tuning a face, limb or idle loop. Slice of atelier:svg-character-animation."
---

Slice of atelier:svg-character-animation (rules, starting numbers and character rules for a rig). Siblings: atelier:svg-character-animation-scenes.

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

## Verify

These steps need only a browser or simulator, `ffmpeg` and `ffprobe`.

1. Capture frames: `ffmpeg -framerate 60 -i frames/%04d.png -vf "select='not(mod(n,4))',scale=320:-1,tile=6x4" -frames:v 1 sheet.png`, or screen-record and `ffmpeg -i rec.mp4 -vf fps=15 f%04d.png`. Read the sheet.
2. Reduced-motion capture: frame 0 vs t=5 s SSIM 1.0 (rule 8); the one-shot's last frame reads alone.
3. Hairlines and glasses rings: zoom a still to 200-400% on eyes and clip edges.
4. Blink and snap flicker: step frame by frame at the target fps; each fast event spans 3+ frames.
5. Numeric checks: track left and right limb angles over the clip; the correlation of the pair must be below 0.9, and the head's peak must come 60 ms or more after the body's peak [practice]. At least one weight shift and one blink on a head turn, read from the sheet.
6. Hidden/backgrounded: tick counter stays still. Project type check, lint and tests pass.
7. For deeper frame review hand off to `atelier:visual-qa`.

## Do not

- Swap drawings between expressions or poses.
- Ease every pose with `track`, or add default overshoot.
- Animate everything in sync or call `Math.random()` per frame.
- Move or resize the view to fake motion.
