# Engine and live faces

Write a small engine into the project, or reuse the one already there. Upstream's templates exist
as an optional extra, never a requirement.

## Two clocks
- Loop clock: takes a period and a live flag, runs while visible (Reanimated `withRepeat` on RN, `TimelineView(.animation)` on SwiftUI, time modulo period on web).
- One-shot clock: takes a duration and play/reduced flags, plays once, holds, and jumps to the end under reduced motion.
- One per character, group or scene.

## Helpers (pure functions of time)
- `track(t, keys)`: keys `[ms, value, 'out'?]`, each leg eased; for a single move; last key equals first in a loop.
- `flow(t, keys)`: keys `[ms, value]`, continuous speed through keys, no overshoot; for pose chains.
- `wave(t, period, phase)`: smooth -1 to 1 for sway, bob, breath.
- `loop(t, period, phase)`: 0 to 1 progress for drift or fall.
- `bell(p)`: fade in then out across 0-1; steam, drops, sparkle.
- `seg(t, a, b)`: a beat window of a one-shot as 0-1.
- `seeded(i, salt)`: stable 0-1 value per item.

Keep poses as data, one array per channel, so "hold longer" edits one row. Sketch:

```
// example [practice]: a hanging lamp whose shade lags the arm
arm   = flow(t, Pose.arm) + 2*wave(t, 6000) * visible
shade = flow(t, Pose.shade) + 0.4*(flow(t - 120, Pose.arm) - flow(t, Pose.arm))
// the shade lags and catches up, no overshoot; delay and 0.4 are tunables
```

## Live face layer stack (head coordinates)
1. Eye whites with no pupils.
2. Pupil that slides, clipped to the white.
3. Lid and cheek skin shapes clipped to a shape 2 units larger than the white (otherwise anti-aliasing leaks a ring around closed eyes).
4. Anything that covers lids: nose, fringe, glasses.
5. Mouth.

Tracks: `lookX/lookY`, `lid` (0 open to 1 shut, optional per eye), `cheek` 0-1, `mouth` depth, `tilt` degrees on the head layer.

Gaze loop starting recipe [practice: 6-9 s loop]: one resting gaze, one or two glances at something in the scene, blinks every 3-4 s (the lower lid rises about 15% so the eye shuts near its middle), a blink on each head turn, an occasional double blink, last key equal to first.

Mood is set by three numbers, all [practice] starting values; change one at a time and compare. Gaze target: viewer or friend for warm moods, floor or off-axis for low ones, fixed for concentration. Rest lid: 0 open, about 0.3 for tiredness. Blink gap: 3-4 s normal, 6 s or more when intent, 5 s with slower reopen when low.
- Low energy (tired, sad): gaze y +0.3 of the eye's travel, lid rest 0.3, reopen 1.5x slower; add one slow look up per loop when sad.
- Warm (happy): gaze on the viewer, lid 0, cheek 0 to 0.6 once per loop.
- Speech: gaze on the listener; open the mouth in bursts of roughly one syllable (120-200 ms).
- Intent: gaze held, blink gap 6 s or more, saccades under 1 unit.

Layers of a body: back hair, body, head with live face, front (hands, held props). Breathing lifts the body layer; head and back hair pivot about the neck. If an edge crops the art, extend drawing a few units past the crop so no cut shows. Faceless creatures live by breathing, ear/tail follow-through and occasional head turns.
