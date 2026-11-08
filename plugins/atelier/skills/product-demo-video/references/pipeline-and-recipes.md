# Pipeline and recipes

Figures tagged Argo (MIT licence) are [up]; everything else is [practice].

## Scene manifest (tool-neutral)

One file per demo, one entry per scene: `scene` id (matches the mark in the script), `text` (omit for silent), optional `voice`, `speed`, `playbackSpeed`, and an optional overlay cue (type, text, placement, motion). Keep voice text and overlay in one entry so a reword is one edit. In Argo, manifest effects are preview metadata only; the script must still call them.

```json
{"scene":"create-project","text":"Name it and you are live.","playbackSpeed":1,
 "overlay":{"type":"lower-third","text":"New project","motion":"fade-in"}}
```

## Timing (defaults live here only)

hold = clamp(clip + leadIn + leadOut, floor, ceiling); fallback when no clip. Argo ships leadIn 200, leadOut 400, floor 2200, ceiling 30000, fallback 5000 (ms). Overlay and effect durations are read from hold, never literals.

## Hand-rolled loop

1. TTS each scene to `clips/<hash>.wav`; record `ffprobe -v error -show_entries format=duration -of csv=p=0` per clip.
2. Run the browser script; at each scene mark append `{scene, t}` (seconds since recording start) to `timing.json`, then wait `hold`. These t values are the T used in Verify.
3. Speed-up first. List the gap spans (a, b) in seconds, each between marks and longer than 0.5 s, and build the video from spans so the new timeline is known:
   ```
   [0:v]trim=0:A,setpts=PTS-STARTPTS[v0];
   [0:v]trim=A:B,setpts=(PTS-STARTPTS)/2[v1];
   [0:v]trim=B,setpts=PTS-STARTPTS[v2];
   [v0][v1][v2]concat=n=3:v=1:a=0[v]
   ```
   Gap spans have no voice, so audio needs no matching cut; instead shift every later mark: new_t = t - (gap length)/2 for each gap that ends before it. Write these as `timing.fast.json`.
4. Audio bed from the shifted times. Delays are in ms of the new timeline, one `adelay` per clip, then mix; `normalize=0` keeps levels:
   ```
   ffmpeg -i c1.wav -i c2.wav -i c3.wav -filter_complex \
   "[0]adelay=1200:all=1[a0];[1]adelay=6100:all=1[a1];[2]adelay=10900:all=1[a2];\
   [a0][a1][a2]amix=inputs=3:normalize=0:duration=longest[bed]" -map "[bed]" bed.wav
   ```
   Music under it: `-stream_loop -1 -i music.mp3`, `volume=0.15`, `afade=t=out:st=END-2:d=2`, then a second `amix` [practice wiring]. Check: bed.wav duration within 0.1 s of the sped-up video.
5. Mux: `ffmpeg -i sped.mp4 -i bed.wav -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest out.mp4` (crf 16, slow: Argo README example; yuv420p for player compatibility). Encode the video once, from the concat output, to avoid a second lossy pass.

## Loudness normalise (after the music mix) [practice recipe; -16 LUFS is Argo README]

Pass 1 measures, pass 2 applies the measured values:
```
ffmpeg -i mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
ffmpeg -i mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=MI:measured_TP=MTP:measured_LRA=MLRA:measured_thresh=MT:offset=OFF:linear=true -ar 48000 norm.wav
```
Replace the M* and OFF values with the pass-1 JSON fields (`input_i`, `input_tp`, `input_lra`, `input_thresh`, `target_offset`). Mux norm.wav instead of mix.wav, then re-run Verify 5.

## Zoom after the fact

Read the source frame rate first: `ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 in.webm` (Playwright WebM is often 25 fps, not 30; a mismatch changes duration). Use that value as FPS below. Input is the logged move: start s, end e (seconds), target centre cx, cy and scale 1.5 in output pixels. Minimal ease-in-out hold, FPS=source rate, 1920x1080 out (`on` = output frame number, `it` = input time):

```
zoompan=z='if(between(it,S,E),1+0.5*sin(PI/2*min(1,min(it-S,E-it)/0.4)),1)':\
x='clip(CX-iw/zoom/2,0,iw-iw/zoom)':y='clip(CY-ih/zoom/2,0,ih-ih/zoom)':d=1:s=1920x1080:fps=FPS
```

`clip(v,min,max)` is ffmpeg's clamp (there is no `clamp`). `zoom` inside x and y lags one frame behind z, which is invisible at 0.4 s ease. Replace S, E, CX, CY with numbers (shift S, E by head trim; scale CX, CY by device pixel ratio). Smoothing the ends over 0.4 s is [practice]. If your ffmpeg lacks `it`, use `on/FPS`. Check on a short span before a full render, then compare output and input durations with ffprobe (within one frame), and do the one-frame crop check in Verify 6. Motion blur gate and sped-up spans change the timeline: compute S, E on the final timeline.

## GIF for docs

`ffmpeg -i clip.mp4 -vf "fps=12,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" out.gif` [practice values].

## Optional tooling map

- Argo CLI: scripted flow, voice, align, export, preview, per-scene clip. A convenience only; the recipes above reproduce it.
- Any TTS engine: local models need no key, cloud ones need one in the environment.
