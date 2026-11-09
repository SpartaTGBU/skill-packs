---
disable-model-invocation: true  # skl: on-demand pack skill
name: launch-film-build
description: "Build, score and deliver a planned product launch film: hardest shot first with real logo, colours, UI and content; a score on one BPM grid synced at 3-5 key points; frame-pinned feedback edits on named variables; then ffprobe, determinism, contact sheet, cut-on-beat, loudness and cold-review checks, delivery formats and a share kit. Use once the treatment is approved, or to fix, score or export an existing launch film. Slice of atelier:launch-film."
---

Slice of atelier:launch-film (Stages 4-7: build, score, pinned feedback, verify and deliver). Siblings: atelier:launch-film, atelier:launch-film-plan.

Tags: [up] = figure or heuristic from the MIT upstream huashu-motion (a survey of 21 launch films and
its own examples). [practice] = our judgment, a starting guess that evidence overrides.

Reference files, read at the stage named:
- [references/direction-and-review.md](../launch-film/references/direction-and-review.md): Stages 2-3 and the cold review in Stage 7.
- [references/rhythm-and-sound.md](../launch-film/references/rhythm-and-sound.md): Stages 3 and 5.

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

## Verify

- Run Stage 7 checks 1-8 above before delivery.
- Never claim motion was reviewed from stills or sound heard from metrics.

## Do not

- A static title card or lone fading object as the opening.
- Placeholder UI or stock filler.
- Cuts that are neither carried nor on a beat.
- One ease and one energy level for the whole film.
- Declaring done because checks pass.
- Reopening a trade-off the user accepted, without new evidence.
- Claiming to have heard the audio.
