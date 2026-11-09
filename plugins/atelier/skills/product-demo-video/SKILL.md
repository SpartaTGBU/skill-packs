---
disable-model-invocation: true  # skl: on-demand pack skill
name: product-demo-video
description: "Turn a scripted browser flow (Playwright) into a finished product demo video with voiceover: scene manifest, narration-driven holds, human-paced cursor, post-export zoom, overlays, gap speed-up, loudness, and cheap re-takes. Use when asked to record, automate or re-record a product demo, walkthrough, feature clip or README/release-notes GIF from a real web app, or to fix a demo whose narration drifts from the screen. Done means the Verify checks pass. Slices: product-demo-video-script (scene design, narration sync, pacing), product-demo-video-capture (cursor, camera treatment, overlays, audio, re-takes)."
---

# Product Demo Video

A demo is a recording of the real product, directed. The script drives the app, the narration sets
the clock, and the camera treatment only points at what the voice is already saying. Split rule: if
a real running app is recorded under script control, it is here; if the pictures are authored,
generated or static, it is a sibling.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:product-demo-video-script` | writing the storyboard, narration and timing, or fixing narration drift | Scene design, Narration sync, Pacing |
| `atelier:product-demo-video-capture` | recording, camera, overlays, mix, export or a re-take | Cursor, Camera treatment, Overlays and text, Audio, Re-takes |

## Invoke

1. **Brief in four lines**: audience, the one job the viewer should be able to do afterwards, target
   length, delivery shapes (16:9 master, vertical, GIF).
2. **Pick the stack.** Any scripted recorder works: Playwright video or screencast plus TTS plus
   ffmpeg. The open-source Argo CLI (MIT) packages exactly this loop and is an optional shortcut,
   never a requirement.
3. **Write the storyboard as scenes** (one claim each), then the narration, then the script. Order
   matters: words first because they set every duration.
4. **Seed deterministic data** and a clean account before recording; retakes must look identical.
5. **Dry-run silent**, then record with voice, then review with the Verify section.

## Neighbours

| Sibling | Split rule |
|---|---|
| `atelier:launch-film` | cinematic launch or trailer, not a live app walk-through |
| `atelier:explainer-video` | concept explainer with authored visuals |
| `atelier:video-editing` | cut, trim, caption existing footage |
| `atelier:video-composition` | rendered motion-graphic clips and B-roll |
| `atelier:video-direction` | shot language and pacing for authored film, not a recorded app |
| `atelier:shot-recipes` | camera and shot presets for authored or generated shots; here the camera is post-export zoom on real screen |
| `atelier:one-line-video` | prompt-to-clip with no app to record |
| `atelier:ai-video` | generated footage; nothing here is generated |
| `atelier:audio-review` | judge the mix after export |
| `atelier:motion-design` | animation inside the app UI itself |
| `atelier:prototype` | build a clickable app to film, not film one |
| `atelier:ui-engineering-polish` | fix app polish before recording |
| `atelier:ui-review` | audit the app's UI before filming |
| `atelier:visual-qa` | check extracted frames against a visual spec; Verify here covers sync and loudness only |
| `atelier:ui-ux-intelligence` | pick UI patterns or styles for the app, not its video |
| `atelier:unslop-ui` | strip generic AI look from the app's UI, not its video |
| `atelier:visual-design` | static visual direction and layout |
| `atelier:design-systems` | tokens and component rules for the app |
| `atelier:frontend-design` | building the app's pages |
| `atelier:html-design-artifacts` | one-off HTML pages and decks, not video |
| `atelier:logo-design`, `atelier:illustration-and-icons` | brand mark or art for the outro card |
| `atelier:diagrams` | static diagrams |
| `atelier:art-motion` | generative or artistic motion pieces |
| `atelier:math-animation` | equation and plot animation |
| `atelier:2d-animation` | Lottie, Rive, sprite animation |
| `atelier:svg-character-animation` | animated SVG characters |
| `atelier:animation-reverse-engineering` | recover how an existing animation works |

Reference: [references/pipeline-and-recipes.md](references/pipeline-and-recipes.md): manifest shape,
timing defaults, ffmpeg recipes (audio bed, zoompan, GIF), optional tooling map.
Tags: [up] = figure from the MIT-licensed Argo project; [practice] = our judgment. Figures marked "Argo" are [up]; anything unmarked is [practice].
"Directed" and "human-paced" are tested by Verify 2, 3, 4 and 6.

## Verify (no special tooling)

1. **Structure**: `ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 out.mp4` shows the expected length, one video and one audio stream, correct size and a steady frame rate.
2. **Sync**: extract a frame at each narration start: `ffmpeg -ss T -i out.mp4 -frames:v 1 f_T.png` for every scene mark T. Get T from the `timing.json` your script appends at each scene mark (minus any trimmed head); without one, sum the clip lengths (`ffprobe -v error -show_entries format=duration -of csv=p=0 clip.wav`) plus holds. The thing named in the sentence must already be on screen. Any scene whose action lands after its words is a fail.
3. **Legibility**: view one frame per scene at the final resolution; the smallest text you need the viewer to read must be at least about 14 px tall on a 1080p frame. [practice]
4. **Dead air**: `ffmpeg -i out.mp4 -vf freezedetect=n=0.003:d=3 -an -f null -` lists freezes of 3 s or more; each must be a deliberate hold. The 0.003 noise value is [practice].
5. **Loudness**: `ffmpeg -i out.mp4 -af ebur128 -f null -` reports integrated loudness within 1 LU of -16 and true peak below -1 dBTP, measured on the final muxed file because the AAC encode can overshoot the WAV peak [practice for tolerance and peak]. Fix path: run the two-pass normalise recipe in the reference, then re-measure; if the peak is exceeded, lower the TP target to -2 and redo.
6. **Cursor and zoom**: scrub 10 frames at the zoom in and out; no frame shows a doubled cursor, scaled overlay or clipped target. One-frame check: at mid-zoom (S+0.4 s) extract the frame and crop the target box, `ffmpeg -ss T -i out.mp4 -frames:v 1 -vf crop=W:H:X:Y z.png`, where the crop is in output pixels: W,H = logged box size x scale, X,Y = (box origin - zoom view origin) x scale. Example: 1920x1080, scale 1.5, box x=800 y=400 w=320 h=160, centre (960,480); view origin = (320,120) after clamping, so crop=480:240:720:420. The target must fill the crop edge to edge. Offset or empty margin means a wrong centre or head-trim shift.
7. **Determinism**: record twice, extract the frame at each scene mark from both, run `ffmpeg -i a.png -i b.png -lavfi ssim -f null -`; expect All above 0.99 [practice]. Lower means seed data or time is leaking.
8. **Muted watch**: play with sound off; the story must still read from overlays and motion.

## Do not

- Do not hardcode waits or effect durations that should follow the voice.
- Do not demo on live or unseeded data, or show real emails, tokens or customer names.
- Do not stack zoom, spotlight, overlay and transition in one scene.
- Do not teleport the cursor or click without a visible approach.
- Do not narrate what is plainly visible ("click the button"); say the outcome.
- Do not use transitions under 2 s and expect them to be seen (see Pacing); cut instead.
- Do not re-record the whole demo for a script change that only touches one scene's words.
- Do not make the optional recorder CLI, a TTS service or a shader pack a hard dependency.
- Do not commit raw recordings, TTS caches or API keys.
