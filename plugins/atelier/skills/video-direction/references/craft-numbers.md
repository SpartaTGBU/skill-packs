# Craft numbers

Defaults; break one on purpose and log a DECISION. Figures with no tag come from the upstream
methodology (win4r/video-director). [practice] marks common craft knowledge absent upstream.
Where upstream sources disagreed, the range is shown (its own sources held a six-word line
anywhere from 1.5 to 3.5 s, so the table below is a floor, not a target).

## Register (pick one row, then check the four knobs)
| Register | fps | Spring damping | Texture | Typical runtime |
|---|---|---|---|---|
| Clean | 60 | near critical, tiny overshoot, one mover at a time | none | 15-45 s |
| Handmade | 24, drawn on twos | loose, one elastic moment | grain, line boil, squash | 30-90 s |
| Editorial | 24-30 | heavy, almost no overshoot | light | 45-120 s |
| Kinetic | 30-60 | snappy, lands on beats | flat, high contrast | 15-60 s |
Seed handmade marks in object space, or the texture reshuffles every frame.

## How long must it stay still? (look up by situation; clock starts when text finishes arriving)
| Situation | Minimum hold |
|---|---|
| Latin line of 1 / 3 / 6 / 10 words | 1.5 / 1.9 / 2.8 / 4.0 s |
| CJK line of 9 / 18 / 27 characters | 3.5 / 5.5 / 7.5 s |
| Mixed line | add the Latin and CJK parts, one 1.5 s base |
| Title or chapter card | 2.5-4 s |
| Closing wordmark | 2 s total, last 1 s motionless |
| Subtitle | longer of 1.8 s and speech length + 0.6 s; at most 3.5 words/s |
| Each side of a comparison before the verdict | 2.5 s fully in frame |
| Anything informative before a cut or morph | 1 s motionless |
| Unsure | take the next row up in word count; if the sheet still reads rushed, add 20% [practice] |

## Type (1080 short side)
Hook 84 px or more; CTA and key terms 48 px or more; no read text under 24 px [practice]. Contrast
7:1 for hook/CTA, 4.5:1 elsewhere, graded and ungraded. Measure rendered pixels.

## Motion timing by situation
| Situation | Curve | Duration |
|---|---|---|
| Small UI element appears | strong ease-out | 0.25-0.4 s |
| A line of type appears | strong ease-out | 0.5-0.8 s |
| Large state change or camera move | ease-in-out | 0.6-1.1 s |
| Something leaves | ease-in | about half its entrance |
| Drift or ambient | linear | any |
Saturated grounds morphing into each other pass through a neutral. Anticipation wind-up is 20 px
or more at 1080 short side [practice]; below that it vanishes after encode. Offset parts of one
object by 2-4 frames.

## Pace
Information changes every 2-4 s; no more than about 1 s fully dead outside a designed hold.
Acceleration: each interval at most 60% of the one before [practice], floor 3 frames, then a
breath of about 0.5 s stillness. Test: longest cut interval / shortest >= 2 [practice].

## Sound levels
- Match all sample peaks first; set hero hits louder than supporting ones on the asset, not per cue [practice]. Starting gains hero ~0.3, supporting 0.1-0.2 [practice].
- Music under voice: duck 4-10 dB (polished/editorial 9-10, warm/handmade 4-6); voice about 10 dB over music by RMS.
- Low end (20-120 Hz) about 3 dB below the rest. Fade the first ~25 ms of any hit starting at sample 0 [practice].
- Master -14 LUFS +/-1 integrated, true peak <= -1 dBTP; target -1.5 to -2 dBTP before an AAC encode, because encoding raises peaks. Confirm with `ebur128`.
- Sparse mix that cannot reach target: add a bed or deliver lower and say so. Loops: fixed gain, no limiter.
- Silence before the payoff: 0.4-4 s, drop of 15-35 dB; one at least, two in a 30-60 s film. Also deliver a silent cut.
- Sync: audio hits within 1.5 frames ideal, 3 frames pass, beyond 3 fix. A constant offset on every hit is encoder delay: apply one constant.
- Voice script estimate 2.5-2.8 words/s until measured; keep clauses at or under 3.5 words/s.
- About half the cuts carry no sound.

## Engineering
Clamp local scene time at 0. Measure encoder delay once and apply it as a constant offset. Loops
wrap time and match speed on both sides of frame 0. Constant frame rate.
