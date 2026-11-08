---
disable-model-invocation: true  # skl: on-demand pack skill
name: product-demo-video
description: >
  Turn a scripted browser flow (Playwright) into a finished product demo video with voiceover:
  scene manifest, narration-driven holds, human-paced cursor, post-export zoom, overlays, gap
  speed-up, loudness, and cheap re-takes. Use when asked to record, automate or re-record a product
  demo, walkthrough, feature clip or README/release-notes GIF from a real web app, or to fix a demo
  whose narration drifts from the screen. Routes away: launch trailer or launch film to
  atelier:launch-film; whole film from one sentence to atelier:one-line-video; authored shot language and camera presets to atelier:video-direction or atelier:shot-recipes; generated footage to atelier:ai-video; concept explainer with no real app to atelier:explainer-video; cutting or
  trimming footage to atelier:video-editing; rendered motion-graphic clips to
  atelier:video-composition; in-app animation to atelier:motion-design; clickable app to
  atelier:prototype; app polish before filming to atelier:ui-engineering-polish; auditing the app or
  extracted frames to atelier:ui-review or atelier:visual-qa; judging the exported mix to
  atelier:audio-review. Remaining siblings each have a split clause in Neighbours. Done means the
  Verify checks pass (sync, legibility, dead air, loudness, cursor).
---

# Product Demo Video

A demo is a recording of the real product, directed. The script drives the app, the narration sets
the clock, and the camera treatment only points at what the voice is already saying. Split rule: if
a real running app is recorded under script control, it is here; if the pictures are authored,
generated or static, it is a sibling.

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

## Scene design

- One scene = one claim = one narration sentence or two. If a scene needs "and then", split it.
- Order the demo as problem, one golden path, result. Cut every feature that is not on that path;
  tour-style demos lose viewers. [practice]
- Length budget: 60-90 s for a feature demo, 20-30 s for a README clip, 2-3 min only for a full
  walkthrough. [practice] Scene count = budget / mean hold: a 70 s feature demo is 7 scenes at 10 s (hold 8-12 s). [practice]
  Separately, give the Playwright test a timeout of scenes x 15 s (Argo guide rule of thumb); that is
  a timeout allowance, not a scene length.
- Open on the result or the pain, not on a login screen. Do auth, flags and seeding off camera
  (start the recorder after setup and anchor t=0 to the first scene mark).
- Every scene begins with the target already visible. If the page is still loading, that is a gap
  (see Pacing), not content.

## Narration sync (the core rule)

Narration clip length is the master clock; the browser waits for it, never the reverse.

1. Generate all voice clips first. Pipeline order is voice, record, align, export, so the script can
   read real clip lengths while recording.
2. Hold each scene for the clip plus a short lead-in and lead-out, clamped between a floor and a
   ceiling, with a fallback when a scene has no clip. Default numbers are in the reference; a
   hand-rolled recorder uses the same shape.
3. Never hardcode a wait or effect duration. Hardcoded values drift the moment a line is reworded
   or the TTS engine changes. Derive effect beats from the scene hold: beat = (hold - setup) / n, then shorten each effect by a 150 ms gap [up: gap value]. Example: hold 9 s, setup 1 s, 4 beats gives 2 s per beat, each effect 1.85 s.
4. Action before words: the click or typed text should land 200-500 ms before the sentence that
   names it, so the eye is already there. [practice]
5. Write narration at roughly 140-160 words per minute spoken; one sentence per scene, under about
   20 words. [practice] Check: 20 words at 150 wpm is 8 s, which fits the 8-12 s scene length above. Present tense, imperative or "you", no "as you can see".
6. Silent scenes are allowed (omit the text); an all-silent demo exports without an audio track.
7. Per-scene voice and speed overrides are fine for one emphasised line; keep one voice for the film.

## Pacing

- Gaps (navigation, spinners, builds) are not narrated. Speed them up rather than cutting: Argo's README gap speed is 2x for inter-scene gaps longer than 500 ms, shorter ones left alone. Fast
  forward a slow loading scene with a per-scene playback speed instead of re-timing the voice.
- After any state change, hold 600-1000 ms of stillness so the result registers before the next
  move. [practice]
- One transition threshold for this skill: 2000 ms or more. Argo's README says 500 ms reads as a glitch and recommends 2 s for fade-through-black; applying it to every transition is [practice]. Below 2 s, use a hard cut. Prefer a cut when the app state continues; dip only at topic changes.
- Typing: character-by-character at a human rate (Argo's guide defaults to 60 ms per character); instant
  paste only for long text, and say so in the voice.
- Never let more than about 3 s pass with no visible change and no new word. [practice] Check: the freezedetect recipe in Verify.
- Precedence: the 600-1000 ms post-change hold is the only allowed stillness; past 3 s of static screen, add a highlight if the narration still describes that screen, otherwise cut or speed up the gap. [practice]

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
