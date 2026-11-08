---
disable-model-invocation: true  # skl: on-demand pack skill
name: launch-film
description: >
  Direct a code-rendered product launch film from a one-line brief: gather real product material,
  show three directions as real key frames, write a treatment with a rhythm sheet, build one HTML
  composition, score it, take frame-pinned feedback, export and make a share kit. Use for a launch
  film, product promo, feature announcement, changelog video, "30-second film for my product", or a
  film that passes every check yet feels like slides (every scene holds the same length, move and ease). Split rules: video-direction is the
  generic gated workflow for any short coded video, this skill is the launch-specific director layer;
  explainer-video when narration teaches a concept; art-motion when a named art style is the point;
  video-composition owns capture and encode; motion-design is UI micro-motion; video-editing trims
  existing footage; ai-video is generated footage; audio-review judges a mix; visual-qa audits
  screenshots; animation-reverse-engineering copies a seen motion; svg-character-animation,
  2d-animation and math-animation are character, frame-by-frame and derivation work.
---

# Launch Film

A launch film is directed: one message with a shape, real product material, an energy curve, a score,
and a loop where the user points at a frame and you change exactly that. Passing checks is the
starting line; the finished frames and a watch at normal speed are the bar.

Tags: [up] = figure or heuristic from the MIT upstream huashu-motion (a survey of 21 launch films and
its own examples). [practice] = our judgment, a starting guess that evidence overrides.

## Route first

- `video-direction`: generic treatment-to-QA workflow for any coded video. Come here when the subject is a product launch and you need the energy curve, scoring and pinned-feedback loop.
- `video-composition`: capture and encode mechanics; this skill never owns the renderer.
- `explainer-video`: a voiceover teaches a concept. Here picture and score carry a claim.
- `art-motion`: a named art style is the point. Here the product's own look is.
- `motion-design`: UI micro-motion, not a film. `video-editing`: trimming footage. `ai-video`: generated footage. `audio-review`: judging a mix in depth. `visual-qa`: screenshot audits.
- `animation-reverse-engineering`: copying a motion you saw. `svg-character-animation`, `2d-animation`, `math-animation`: character, frame-by-frame and derivation work.
- `atelier:blender` for 3D scenes. forge:* is not relevant.

Reference files, read at the stage named:
- [references/direction-and-review.md](references/direction-and-review.md): Stages 2-3 and the cold review in Stage 7.
- [references/rhythm-and-sound.md](references/rhythm-and-sound.md): Stages 3 and 5.

## Stage 1: gather and brief

1. Read before asking. Collect real material: the project folder (images, screenshots, icons, declared colours and fonts), then the product site and launch posts, then run the product and capture real screens. Log source and licence of each image in `materials.md`; mask private data.
2. Send one message, not a form: the product, the single thing the film leaves behind, and only the decisions that change the build (venue and length, energy, narration), each with a marked default [practice: ask nothing the default covers].

## Stage 2: choose the shape and three directions

Pick the shape by asking what the viewer must be able to repeat after one watch, then test it against the failure listed.

| If | Shape | It fails when |
|---|---|---|
| a new, named thing exists | claim | it becomes a feature tour |
| an input becomes an output | workflow | no real product screen appears |
| something internal explains the result | mechanism | it is a fast reel with no cause shown |
| a measured change is the news | evidence | the figure shows under 1 s per digit group [practice]; count digit groups in the cut and divide by on-screen time |
| several items ship together | list | it is N identical slides; vary scale per item |
| a before and after state | transformation | it is a hard cut between two stills |
| a character or situation carries it | story | it is bullets over a mascot |

If two fit, take the one whose failure you can check in the treatment stills. Candidate languages per shape and the three-directions rules are in the direction reference. Show three directions as real key frames; the user picks. If the user rejects all three twice, stop proposing, ask for one reference film or frame, and rebuild the three around it [practice].

## Stage 3: plan rhythm and write the treatment

Default energy when no style is named:
- Frame 0 often becomes the feed poster. Test [practice]: export frame 0 alone; the subject covers at least 25% of the frame area, else redo it.
- Plan the first burst before 5 s [up, heuristic]; the hook event lands inside 3 s (step 2 below). Body text must read at phone width: downscale a frame to 360 px wide and read every line [practice].
- Energy comes from motion, cutting and shot scale, not colour changes. One product accent, one real typeface with weight contrast.
- A calm opening only on request; if so, write the reason into the treatment and still plan one event every 2 bars [practice].

Planning steps (monotony test: same move, same scale, one ease and idle music means the film reads slow, so plan the opposite on paper):
1. Route: continuous (0-2 cuts), montage (cuts on beats), or hybrid (spine plus 1-2 bursts, the usual launch choice). The burst idea is from upstream's survey [up].
2. Energy curve: 0-10 per few seconds. Aim for a hook inside 3 s [up heuristic that only 14 of 21 surveyed films met], so a deliberate slower open is allowed if the treatment says why. Include one mid-film burst, a hero moment on the strongest musical point, optionally a near-silent stop, and an end hold on the mark. Bar densities are in the rhythm reference.
3. Boundary diff: at each section boundary list which attributes differ between the last shot before and first shot after (scale, speed, ease, camera, density, ground, music). Fewer than two means the boundary is probably not felt; change another [practice].
4. Carry the eye: one line per transition naming the object, colour or position linking shot N to N+1. If you cannot write it, the beat must justify the cut.
5. Every shot has a verb (gather, split, align, connect, reveal); otherwise delete or merge it.
6. Ending: a launch ends on the brand; a showcase or loop returns to frame 0.

Put all of it in `treatment.md` before any full build (template in the direction reference).

## Stage 4: build

Build the hardest shot first, then the rest; inspect frames and watch at 1x.
- Use the real logo file and the product's own colours and type.
- If the UI must move, rebuild it in code from a same-size capture, then overlay the capture on the rebuild; mismatched text or icons fail. No grey placeholder boxes or panned screenshots.
- Content inside the UI (avatars, thumbnails) is real too: project's own, then found, then openly licensed; record the source.
- Exactly one of the three directions offers depth (UI in space, product as studio object) so the user can compare flat against spatial (upstream idea); the other two get no z-axis camera move.

## Stage 5: score

Silent motion reads as a draft; skip sound only for overlays or on request.
- Choose the music world after the direction is picked, not on the cards.
- Sync 3-5 key points (hook, turn, stop, drop, logo), not every cut [practice].
- Tempo is a weak lever; speed mostly comes from cut density. Default 100-125 BPM [up, director guidance]; upstream's worked example used 124 [up]. Vary feel (half-time, double-time hats), not tempo.
- One grid: picture and score share BPM, scene boundaries sit on beat numbers, beats = seconds x bpm / 60. If a section must stretch more than about 8% [up], change a bar length instead.
- A 3-4 note motif stated early, varied mid-film, ending as the sonic logo [practice].
- Hits land on the visible landing frame, not the tween start; measure it from the render.
- You cannot hear: check loudness per stretch follows the curve, view a spectrogram, and tell the user the final listen is theirs.

## Stage 6: take pinned feedback

- Make the film addressable: editable values (titles, numbers, colours, hold times) are named variables, pointable elements have stable ids, scenes are named timeline labels.
- Per comment: view the commented frame and a close-up first, change only that thing at that place and time, prefer editing a variable, do not reformat the file.
- A timing change shifts later moments: keep them anchored to their events and redo the sound fit.
- Ambiguous comment: apply the likeliest reading and state it in one line in the user's language ("hold 1.2 s -> 2.0 s, later scenes shift 0.8 s").
- Keep each version so undo is a file copy.

## Stage 7: verify and deliver

Checks (plain tools):
1. `ffprobe -show_streams -show_format out.mp4`: duration, fps, size, aspect and audio match the spec; `ffmpeg -v error -i out.mp4 -f null -` prints nothing.
2. Determinism: extract the same timestamp twice (`ffmpeg -ss T -i out.mp4 -frames:v 1`) and compare hashes.
3. Frame review: frame 0, each scene's first 1 s at 6 fps, the hero and the last frame into a contact sheet (`ffmpeg -i out.mp4 -vf "fps=2,scale=320:-1,tile=6x4" -frames:v 1 sheet.png`); look for pops, empty frames, clipped or covered text, missing fonts.
4. Cuts and dead time: `ffmpeg -i out.mp4 -vf "select='gt(scene,0.05)',showinfo" -f null - 2>&1 | grep -o 'pts_time:[0-9.]*'` lists cuts. Gaps over about 4 s [practice] need an event or a planned reason. Burst-on-beat (tested): append `| sed 's/pts_time://' > cuts.txt` to the command above, then `awk -v bpm=120 -v fps=25 '{b=$1*bpm/60; d=b-int(b); if(d>0.5)d=1-d; print $1, (d<=bpm/60/fps ? "on" : "MISS")}' cuts.txt`; a miss is a cut more than one frame from the nearest beat. List the misses.
5. Loudness: `ffmpeg -i out.mp4 -af ebur128 -f null -`, integrated level and per-stretch.
6. Watch at 1x with sound; note timestamps where attention drops.
7. Write the three notes a demanding director would give before showing it, then fix them.
8. Cold review by a separate agent when possible (brief in the direction reference). Never claim motion was reviewed from stills or sound heard from metrics.

Delivery:
- MP4 master; transparent MOV/WebM only for overlays; GIF for READMEs. Social masters sit near -14 LUFS integrated [up]; treat that as a ceiling, not a target, and do not boost a quiet film to reach it. 60 fps for UI-heavy films [practice].
- Other aspect ratios are re-layouts, not crops.
- Share kit: a GIF under 10 MB [up] (opening plus end frame) and post text with one concrete making-of detail. Never post anything yourself.
- Record version and file hash with code, timeline, asset references and sound.
- A credit line on the end frame is the user's call; leave it off for client work.

## Stop rules

- A static title card or lone fading object as the opening.
- Placeholder UI or stock filler.
- Cuts that are neither carried nor on a beat.
- One ease and one energy level for the whole film.
- Reusing the last film's band, header or score.
- Declaring done because checks pass.
- Reopening a trade-off the user accepted, without new evidence.
- Claiming to have heard the audio.

Optional extra (never required): the MIT project huashu-motion packages a similar workflow as a CLI; any HTML-to-frames capture plus ffmpeg is enough.
