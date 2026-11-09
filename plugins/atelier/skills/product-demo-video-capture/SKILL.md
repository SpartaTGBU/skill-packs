---
disable-model-invocation: true  # skl: on-demand pack skill
name: product-demo-video-capture
description: "Record and finish a scripted product demo: a seeded human-paced synthetic cursor, post-export zoompan or spotlight with optional gated motion blur, one overlay per scene and captions, voice loudness and music bed, and cheap resumable re-takes and multi-format exports. Use when recording, re-recording, zooming, captioning, mixing or exporting a Playwright product demo or README GIF. Slice of atelier:product-demo-video."
---

Slice of atelier:product-demo-video (cursor, camera treatment, overlays and text, audio, re-takes). Siblings: atelier:product-demo-video, atelier:product-demo-video-script.

Reference: [references/pipeline-and-recipes.md](../product-demo-video/references/pipeline-and-recipes.md): manifest shape,
timing defaults, ffmpeg recipes (audio bed, zoompan, GIF), optional tooling map.
Tags: [up] = figure from the MIT-licensed Argo project; [practice] = our judgment. Figures marked "Argo" are [up]; anything unmarked is [practice].

## Cursor

- Use a visible synthetic pointer moved by real mouse events, not teleporting clicks. Hide the native cursor with CSS while the synthetic one is active (Argo's cursor source does) so there is never a doubled pointer.
- Seed the path so a re-take draws the same curve (Argo does). Travel time should grow with distance: Argo's source uses 300-1100 ms by default.
  Sequence per click: travel, dwell 150-250 ms before pressing, press and release, settle 300-500 ms
  before the next move. [practice]
- Keep one cursor instance across all scenes; after a navigation, restore it at its last position.
- If the target moved or detached, re-find it and retarget; do not click a stale point.
- Click feedback: a circle that fades in under 1 s (Argo's source removes it after 700 ms) is enough; a ring that
  follows the pointer all the time hides the target while the click lands, so skip it unless the demo is about pointer accuracy.
- Touch demos: set mobile and touch emulation, use tap not click, and record at the phone viewport
  (Argo's guide example is 390 x 664) rather than cropping a desktop recording.

## Camera treatment

- Zoom only to make small UI legible at the delivery size. Test: zoom only when the smallest label the viewer must read is under 14 px tall at delivery size (same threshold as Verify 3). [practice]
- Zoom scale 1.5 and hold 2 s [up: example values]; the 0.4 s ease and fps handling in the reference are [practice], then return to full frame before the next scene.
- Apply zoom after recording with ffmpeg `zoompan` (`crop` cannot change size per frame), not CSS transforms on the live page, so overlays stay unscaled. Log target box and time while recording; at export, offset times by any trimmed head and multiply coordinates by the device pixel ratio. Minimal expression in the reference.
- Spotlight, ring or dim-the-rest (Argo's camera-language spec dims siblings to 30% opacity) are alternatives to zoom for
  "look here"; use one of them per scene, never stacked with a zoom.
- Motion blur is optional. If used, gate `tblend=all_mode=average` with
  `enable='between(t,S,S+0.4)+between(t,E-0.4,E)'` so only the ease windows blur (Argo gates the same
  way, intensity 0.5; ungated it does nothing visible). Check: a static-hold frame is pixel-sharp.
- Frame treatment (padding, rounded corners, shadow, gradient background) is for marketing cuts;
  keep raw edge-to-edge for docs and support.

## Overlays and text

- One overlay per scene at most: lower-third for context, headline card for a section opener,
  callout for a single annotation. Keep them in fixed zones so they never cover the action.
- Overlay lifetime equals the scene hold (derived, not typed); fade in about 300 ms, slide about
  400 ms (Argo guide preset values).
- Content the real app cannot show (title card, outro, logo sting) is rendered separately and cut in
  at export, not faked inside the app.
- Burned-in captions are required if the delivery is silent autoplay (social, README); keep them
  under about 42 characters per line. [practice]

## Audio

- Normalise loudness: EBU R128 at -16 LUFS (Argo README's loudnorm setting) keeps voice consistent across
  scenes and TTS engines. Apply it last, after the music mix, with the two-pass recipe in the reference.
- Background music at about 15% of voice level (Argo README default 0.15), looped, with a 2 s fade-out;
  duck or drop it entirely under dense narration. [practice for ducking]
- Cloud TTS gives better prosody and languages; local TTS needs no key. Whichever, never commit
  keys; the recorder reads them from the environment.

## Re-takes (make them cheap)

- Keep voice, recording and export as separate resumable steps. Changing one line should re-voice
  that scene and re-align, not re-record everything, unless the screen changed.
- Cache clips by hash of text, voice and speed; regenerate only on change.
- Preview from recorded artefacts (replay viewer or a quick ffmpeg assemble), not by re-recording.
- Extract one scene as MP4 or GIF for release notes straight from the master.
- Multi-format: re-recording at the target viewport (1080x1920, 1080x1080) lays out better than a 16:9 master [practice]; Argo's README also favours it, though its own 1:1 and 9:16 exports are blur-fill, the fast fallback. Voice is generated once and reused.
- Fix flakiness at the source: wait on the element or response, never on a fixed sleep, then re-take.

## Verify

1. **Structure**: `ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 out.mp4` shows the expected length, one video and one audio stream, correct size and a steady frame rate.
3. **Legibility**: view one frame per scene at the final resolution; the smallest text you need the viewer to read must be at least about 14 px tall on a 1080p frame. [practice]
5. **Loudness**: `ffmpeg -i out.mp4 -af ebur128 -f null -` reports integrated loudness within 1 LU of -16 and true peak below -1 dBTP, measured on the final muxed file because the AAC encode can overshoot the WAV peak [practice for tolerance and peak]. Fix path: run the two-pass normalise recipe in the reference, then re-measure; if the peak is exceeded, lower the TP target to -2 and redo.
6. **Cursor and zoom**: scrub 10 frames at the zoom in and out; no frame shows a doubled cursor, scaled overlay or clipped target. One-frame check: at mid-zoom (S+0.4 s) extract the frame and crop the target box, `ffmpeg -ss T -i out.mp4 -frames:v 1 -vf crop=W:H:X:Y z.png`, where the crop is in output pixels: W,H = logged box size x scale, X,Y = (box origin - zoom view origin) x scale. Example: 1920x1080, scale 1.5, box x=800 y=400 w=320 h=160, centre (960,480); view origin = (320,120) after clamping, so crop=480:240:720:420. The target must fill the crop edge to edge. Offset or empty margin means a wrong centre or head-trim shift.
7. **Determinism**: record twice, extract the frame at each scene mark from both, run `ffmpeg -i a.png -i b.png -lavfi ssim -f null -`; expect All above 0.99 [practice]. Lower means seed data or time is leaking.
8. **Muted watch**: play with sound off; the story must still read from overlays and motion.

## Do not

- Do not demo on live or unseeded data, or show real emails, tokens or customer names.
- Do not stack zoom, spotlight, overlay and transition in one scene.
- Do not teleport the cursor or click without a visible approach.
- Do not re-record the whole demo for a script change that only touches one scene's words.
- Do not make the optional recorder CLI, a TTS service or a shader pack a hard dependency.
- Do not commit raw recordings, TTS caches or API keys.
