# B-roll and motion-graphic clips (continuous one-shape style)

Principles for motion-graphic cutaways over talking-head or screen video, and for any product-animation clip. Rendering needs an HTML-to-video pipeline (a headless browser that seeks a pure function of time, frame by frame, with sub-frame motion blur, then ffmpeg); this reference carries the creative method and the engine design rules; the working engine lives in `broll/`.

A runnable pipeline implementing this lives in `broll/` (see "B-roll and cutaways" in `SKILL.md`; engine API in `broll/reference/engine-api.md`). Its install steps are consent-gated.

## The style

Every clip is ONE shape that never cuts. It morphs size, corner radius and color between states while its content swaps with a short blur. A cursor drives changes with real clicks and drags. Every change lands on a spoken word (clip-local time = word time minus clip in-point). Word times from an SRT are estimates (+/- 0.2s): put important changes on the first or last word of a cue.

## Engine design rules (if you build or extend a renderer)

- Every style is a pure function of time `seek(t)`: no CSS transitions, timers or carried state. That is what makes frame-exact rendering and motion blur possible.
- Animate with closed-form springs, summed per target change: `value(t) = v0 + sum over changes of spring(t - ti) * delta`. Presets as `[omega, zeta]`: MORPH (shape), FAST/SLOW (leading/trailing edges), SOFT, CAM (camera), INSTANT (invisible resets).
- Leading edge rides FAST, trailing edge rides SLOW, so indicators stretch then settle.
- Camera: world to screen as `center + cam * (world - focus)`; choose `cam` per state so the state fills the frame (cards ~1.2-1.6, pills ~1.8-2.2). The cursor keeps a constant on-screen size and must stay in frame during zooms and morphs.
- Content swap inside a morphing container: exit blurs out fast, enter waits then blurs in (about 120ms out, 220ms in), each layer with its own in/out timing, or old and new text overlap.
- Gotchas: never `will-change` on anything the camera scales (blurry text); `mix-blend-mode: difference` labels need the blend mode on their own layer, and a filtered parent isolates it; items sliding under a highlight need FAST springs or the highlight row sits empty.

## Workflow

1. **Interview (one round):** the video, a timestamped transcript (else get word timestamps from the audio), density (light 2-4 clips/min, medium 4-7, heavy most lines with short gaps of face), look (default palette or brand colors/font/logo), things to avoid or include.
2. **Inspect footage:** resolution, fps, layout sections (full speaker vs picture-in-picture with an empty region). Clips match the video's resolution and fps.
3. **Plan table, approval before code:** `# | in-out | line covered | what the shape does on which words | treatment | why`.
   - Full-frame cutaway when the frame is all speaker and the line describes something to see (product, process, comparison, number, chapter change). 3-10s, then return the face. Not in the first second of the hook, nor on personal, emotional or opinion lines; at least ~2s of face between cutaways.
   - Panel in the empty space when the edit already leaves room: a transparent clip centred in the empty region, sized clear of the speaker box at every moment; can run 15s+ as one continuous morph. If the box moves or resizes, ask, then size for the largest or split the panel.
   - Nothing when the line is about the speaker or too close to another clip.
4. **Content rules:** show the subject's real objects (folder, terminal, file, product, result). One idea per clip. Pace to speech: one change per spoken beat, 0.4-1.2s apart. Never invent numbers, quotes, prices or results: use relative bars, skeleton lines or transcript labels and list what is illustrative.
5. **Build, check stills at the key words and a few mid-morph moments** (fix anything cramped, clipped, off-word, or with the cursor out of frame), **render** at the video's fps (transparent panels to ProRes 4444 `.mov`), **deliver** clips named by timeline in-point, a `TIMING.md` (file, in, out, line, treatment, what is illustrative), a preview cut with hard cuts and original audio, and a side-by-side compare page. Say plainly the preview is for review; the final cut is placed in the user's editor.

## Style defaults (brand overrides)

Canvas warm gray `#E9E7E2`, ink `#0B0B0B`, white components, one accent `#FF5A1F`; light shapes (`#F4F2EE`) for panels on dark footage. Geist for UI, Geist Mono for code and terminals, one icon set at one stroke weight. Springs with at most a tiny overshoot. Banned: bouncy easing, particles, glows, gradients on UI chrome, mixed icon strokes, dead time, template looks, made-up data.
