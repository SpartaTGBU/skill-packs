# Full-body acting

Hitting poses is not enough; life is in the travel between them and in never fully stopping.

## Arm poses
Shoulder angle `a` (0 = hanging), elbow bend `e`; the forearm points at `a + e`. Pick `a` by how
much the pose opens the body, then set `e` by what the hand does: `e` near 0 reads as reaching or
balancing, a large `e` folds the hand toward the head, a negative `e` tucks it behind the body.
Two worked examples, both [practice] starting points to adjust against your art: a greeting wave
uses a around 60 and e around +110 with a small wobble on the forearm only; arms thrown up uses a
around 150 and e 0. Test: draw the pose and check the elbow, not the hand, sets the silhouette.

## Turning without new drawings (2.5D)
Drive features from one `yaw` in -1..1, sliding each by depth. Starting offsets (upstream gives eyes 10 and nose 13 in a 100-wide head; the rest are [practice]), as a
share of the part's host width: nose/beak/snout 13% of head width, eyes and mouth 10%, back parts
(ears, back hair) slide the opposite way about 9%, chest prints 8-12% of torso width, clipped to it.
Outline stays. Pupils lead the turn and a blink lands on it.

## Weight, fall, hop
- Hips slide sideways and carry everything above; legs rotate at the hips so feet stay planted, angle about shift divided by leg length; the unloaded leg lifts slightly.
- Fall (up SKILL.md figures): hover, then `lift = top * (1 - k^2)` with 5-10% stretch; arms rise just before contact. Contact: squash 15-20%, arms snap out, one small overshoot, settle.
- Hop (up SKILL.md figures): crouch 5-10%, stretch 5-10%, parabola, same squash on landing.
- Airborne body: legs limp and close, toes down (foot turned 60-80 deg), one knee folded, legs trading slowly. Float in from a quarter to a third of body height below, drift a few percent, leave rising. Flatten feet just before touchdown.
- Shadow: scale it down as height rises, e.g. `1 - height/H` with H chosen so the shadow is about half size at the top of the jump [practice; upstream's example H is 220 drawing units]. Thin pill from the side, wide oval from above.

## Props and strikes
Props enter from beyond the visible screen edge. Rolling: `angle = dx / r`, slowing with ease-out. Eyes and head follow toward then after the prop. Kick or hit: weight to support side, free limbs open, wind-up halts at the top, contact at mid-swing (fastest), follow-through, opposite arm counter-swings. Launch as a throw `x = x0 + vx*s`, `y = y0 - vy*s + g*s^2/2` with spin and a 60-100 ms contact squash (about 15% along the hit, 10% wider across). Then the character watches it go and reacts. Test: throws begin and end exactly at the hand, pan or hat.

## Camera is a build
Side view keeps drawn proportions. A view from slightly above (toy, avatar, reward) rebuilds the figure rather than nudging it. Upstream pins only that the head is 40-50% of the height, the torso is short and narrower than the head, and the shadow is a wide oval with the feet in its lower half; the other ratios (torso height, shadow width) are yours to measure from your own reference in head widths. Keep them in one `build` object and derive floor contact from it. Test: change one ratio, and if the figure still reads as the same camera angle, it was not the cause.

## Framing
Scale the figure to the largest size that still fits its widest pose and highest jump, feet low. In a phone mockup fit to the screen inside the frame; dark status bar on light screens, white on coloured ones.
