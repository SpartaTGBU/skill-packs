---
disable-model-invocation: true  # skl: on-demand pack skill
name: video-composition
description: >
  Compose and render short programmatic videos (product promos, explainers, social clips, animated
  captions, title cards) from HTML/CSS/JS: a written spec, frame composition, beat-synced motion,
  captions, sound mix, deterministic frame capture with headless Chromium and ffmpeg encoding, and
  a contact-sheet review. Two engines: plain Chromium+ffmpeg capture, or Remotion (React, frame-driven).
  Use when asked to make a video, motion graphic, animated promo, lyric or caption video, intro/outro,
  a Remotion composition, or to turn a page, script or audio track into an MP4.
---

# Video composition

A video is a web page that is **seeked, not played**: every frame is a pure function of time `t`.
Design judgment comes first (spec, composition, story); the pipeline is plain Chromium + ffmpeg.
For UI motion inside an app, use atelier:motion-design instead; this skill is for rendered video.

## 1. Spec before pixels

Write `SPEC.md` (10-20 lines) and get it agreed before animating:

| Field | Example |
|---|---|
| Duration / fps / size | 30s, 30fps, 1080x1920 (9:16) |
| Audience + where it plays | Devs scrolling X, muted autoplay |
| One message | "Deploys in 4 seconds" |
| Story beats | Hook 0-3s, problem, turn, proof, CTA + logo hold |
| Audio | Track + BPM, VO script, or "silent, captions carry it" |
| Look | 2 fonts max, palette from brand tokens, one accent |

Translate adjectives into numbers: "punchy" = cuts every 1-2 beats, entrances <= 0.4s;
"calm" = holds >= 3s, 0.8-1.2s eases, no overshoot; "premium" = generous negative space,
slow drifts (2-4% scale over a shot), restrained palette.

Sizes: 1920x1080 (16:9), 1080x1920 (9:16 Reels/Shorts/TikTok), 1080x1350 (4:5 feed),
1080x1080 (1:1). 30fps default; 60fps only for fast motion or screen recordings.

## 2. Story

- **Hook in the first 1-2s**: the result, a bold claim or motion already in progress. No slow
  logo intro.
- **Frame 0 is the thumbnail.** It must read as a finished, legible composition with the message
  or subject visible - never a blank or mid-fade frame.
- One idea per shot. A shot holds at least as long as its text takes to read (~3 words/s, minimum
  1.5s for any text).
- End on the CTA/logo held >= 1.5s; loops should make the last frame flow into the first.

## 3. Composition

- **Hero >= 40% of the frame.** Small centred content floating in empty space reads as a slide.
- **Type:** body/caption text >= 28px at 1080 short edge (scale proportionally); headlines
  64-140px; max ~8 words on screen at once.
- **Safe areas:** keep text inside 90% title-safe (5% margins). For 9:16 social, also keep text
  out of the top ~14%, bottom ~20% and right ~15% (platform UI).
- **Layout with intent:** use thirds, strong diagonals, edge-anchored type, deliberate crops and
  scale contrast. Centre only when it carries meaning (a single word, a logo lockup).
- **Depth:** at least two planes (background texture/gradient + foreground), moving at different
  rates.
- Contrast >= 4.5:1 for all text, tested against the actual frame behind it.

**Banned defaults** (the generic look): everything centred, every element fading in with the same
0.5s ease, stock gradient blobs, bouncing everything, text over busy footage without a scrim,
transitions chosen from a menu rather than caused by content.

## 4. Motion

Ease by role, not one curve for everything:

| Role | Ease | Duration at 30fps |
|---|---|---|
| Entrance | ease-out (`power3.out`, `expo.out`) | 0.3-0.6s |
| Exit | ease-in, faster than entrance (`power2.in`); video only, UI exits stay ease-out per atelier:motion-design | 0.2-0.4s |
| Move/reposition | ease-in-out (`power2.inOut`) | 0.4-0.8s |
| Playful/pop | spring or `back.out(1.4-1.7)` | 0.4-0.7s |
| Ambient drift | linear or `sine.inOut` | the whole shot |

- Stagger groups 40-80ms per item; never animate a dozen things at once.
- Something is always moving slightly (drift, parallax) so held frames don't look frozen.
- **Transitions need a cause:** a match cut on shape or colour, an element that carries across
  shots, a wipe driven by an on-screen object, a cut on the beat. A crossfade is the fallback,
  not the default.

### Beat grid
With music, put every cut and accent on the grid. `seconds per beat = 60 / BPM`;
`frames per beat = fps * 60 / BPM`. Compute times from beat indices (`t = beatIndex * 60 / BPM +
offset`), never by eye. Cuts on downbeats, accents on beats, small pops on off-beats. Big moments
on bar boundaries (every 4 beats).

## 5. Captions

- Group words into short phrases (2-5 words, max 2 lines, ~32 characters per line); break at
  natural pauses, never splitting a name or number.
- Fit to width: measure the phrase and scale the font down to fit the safe area instead of
  overflowing; never below the 28px floor - re-break instead.
- Legibility by luminance: sample the background behind the caption; light text + dark
  stroke/shadow on dark frames, dark text on light frames, or a scrim when the background is busy.
- Timing comes from a transcript with word timestamps; highlight the active word, keep the phrase
  up until the next one replaces it.
- Match tone: energetic = bold weight, per-word pop (scale 0.9->1, 120ms); calm/serious = phrase
  fade, regular weight; technical = monospaced accents for code and numbers.

## 6. Sound

- SFX lands **1 frame after** the visual event it accompanies (reads as caused by it).
- Duck music under VO by 8-12dB: ffmpeg `sidechaincompress` with the VO as the sidechain.
- Master to **-14 to -16 LUFS integrated, peaks <= -1 dBTP**: ffmpeg `loudnorm=I=-14:TP=-1:LRA=11`
  (two-pass for accuracy).
- Silent-autoplay platforms: the video must work muted; captions carry speech.

## 7. Render pipeline: Chromium capture (deterministic)

**Determinism contract** - the same `t` must produce the same pixels on every run:
- no `Math.random()`; use a seeded PRNG (e.g. mulberry32 with a fixed seed);
- no `Date.now()`, `performance.now()`, `requestAnimationFrame` clocks or CSS animations running on
  wall time; all motion derives from `t`;
- fonts, images and video loaded and decoded before frame 0 (`await document.fonts.ready`, image
  `decode()`); embed or self-host assets, no remote fetches mid-render;
- video elements are seeked to `t` and awaited (`seeked` event), never played.

**Page contract:** build one paused timeline (GSAP with `paused: true`, or a hand-written
`render(t)`) and expose `window.__seek = async (t) => { tl.seek(t); /* await media seeks */ }`.

**Capture:** a Node or Python Playwright script opens the page in headless Chromium at the exact
viewport size with `deviceScaleFactor: 1`, then for `i = 0 .. duration*fps - 1` calls
`__seek(i / fps)` and screenshots to `frames/f%05d.png`.

**Encode:**
```sh
ffmpeg -framerate 30 -i frames/f%05d.png -i mix.wav \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow \
  -c:a aac -b:a 192k -movflags +faststart -shortest out.mp4
```
`yuv420p` is required for broad playback; `+faststart` for web. Use `-crf 16-20` (lower = larger).
The technique needs only Chromium, Playwright and ffmpeg; no packaged framework is required.

## 7b. Remotion (when the project already uses React, or the user asks)

Same contract, packaged: a composition is a React component rendered once per frame. Check the
licence first: Remotion is free for individuals and small companies (3 or fewer employees);
larger companies need a paid company licence (remotion.dev/license). Use the project's version
(4.x at time of writing); do not add Remotion to a repo that has no React just for one clip.

| Piece | Rule |
|---|---|
| `<Composition id width height fps durationInFrames component defaultProps>` | registered in `Root.tsx` via `registerRoot`; one per deliverable size (make 9:16 and 16:9 separate ids sharing components) |
| `useCurrentFrame()` / `useVideoConfig()` | the only clock. Inside a `<Sequence>` the frame is local (starts at 0) |
| `interpolate(frame, [in0, in1], [out0, out1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})` | always clamp, or values run past the range |
| `spring({frame, fps, config: {damping: 200}})` | 0 to 1 with physics; damping ~200 = no overshoot, 10-15 = bouncy. Feed it into `interpolate` for px/scale |
| `<Sequence from={30} durationInFrames={90}>` / `<Series>` | place shots on the timeline; `<Series>` for back-to-back shots, `<TransitionSeries>` for transitions |
| `<AbsoluteFill>`, `<Img>`, `<OffthreadVideo>`, `<Audio>`, `staticFile()` | assets wait for load automatically; use these, not raw `<img>`/`<video>` |
| `delayRender()` / `continueRender(handle)` | block a frame until async data (fetch, font) is ready |
| `random('seed')` | deterministic randomness; never `Math.random()` |

**Banned in Remotion:** CSS `transition`/`@keyframes`, `animation:` properties, `setTimeout`,
`useEffect`-driven state that advances time, Tailwind `animate-*` classes. They run on wall time,
so frames render differently per worker and per run. Every moving value is computed from `frame`.

Convert seconds to frames once: `const s = (sec: number) => Math.round(sec * fps)`; keep beat
times from the beat grid above as frames.

```sh
npx remotion studio                                   # preview / scrub
npx remotion still src/index.ts Promo frame0.png --frame=0
npx remotion render src/index.ts Promo out/promo.mp4 \
  --codec=h264 --crf=18 --props='{"title":"Deploys in 4s"}'
```
Other codecs: `--codec=prores --prores-profile=4444` for alpha/hand-off, `vp9` for web alpha.
Render a few stills (frame 0, each cut, last frame) before the full render. Data-driven batches:
loop `render` over a props JSON per variant, or use `@remotion/renderer` `renderMedia()` from a
script; audio is mixed from `<Audio>` tracks, then loudness-checked as in section 6.

## B-roll and cutaways

For motion-graphic cutaways over talking-head or screen video, read
[references/broll-motion-graphics.md](references/broll-motion-graphics.md) (style method,
time-pure renderer rules). A working engine sits in `broll/` (API `broll/reference/engine-api.md`,
example `broll/examples/`, MIT `broll/LICENSE-motion-broll.md`). Install its prerequisites
(node, ffmpeg, Playwright) only with the user's consent. Never fabricate data shown in clips.

## 8. Review

1. **Contact sheet:** `ffmpeg -i out.mp4 -vf "fps=1,scale=480:-1,tile=6x5" sheet.png` and look at
   it - story flow, text legibility, composition variety, frame 0.
2. Scrub key moments at full size: first frame, every cut, every caption change, last frame.
3. Check: loudness (`ffmpeg -i out.mp4 -af ebur128 -f null -`), sync of SFX/cuts to beats, no
   dropped or duplicated frames, safe areas respected.
4. Write notes as **P0** (broken: wrong size, illegible text, audio clipping, blank frame 0),
   **P1** (weak: generic motion, missed beats, cramped composition), **P2** (polish).
   Fix P0/P1 before delivery.
5. **Delivery note:** file path, duration, size, fps, codec, loudness, and any known P2s.

Deeper frame QA (flicker, banding, black/frozen frames, sync): atelier:visual-qa. Cutting, grading
or re-delivering existing footage: atelier:video-editing. Generated shots: atelier:ai-video.

Run forge:verification before calling it done: the file plays, matches the spec, and the review
notes are closed.
