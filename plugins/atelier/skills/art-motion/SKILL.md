---
disable-model-invocation: true  # skl: on-demand pack skill
name: art-motion
description: >
  Art-style animation in code: pick an artistic look (painter, print, pixel, ink, cut-paper, period
  style) and make one designed picture move, or pick a named explainer grammar and lock one look for
  a whole clip. Use for "animate this in the style of Van Gogh / Bauhaus / ukiyo-e / ink wash /
  pixel art", an art-history speedrun, or a short clip in a named grammar (whiteboard, kinetic type,
  finance chart). Split rules: UI or component loop -> motion-design; Lottie/Rive/sprite asset ->
  2d-animation; script, voice, pacing -> explainer-video; whole product film -> launch-film;
  equations/proofs -> math-animation; rigging one SVG character -> svg-character-animation;
  rebuilding a recorded animation -> animation-reverse-engineering; model-made footage -> ai-video;
  frame/UI inspection -> visual-qa.
---

# Art motion

The result is one picture in which something changes on every beat, not a slideshow. Work in four
stages: decide the look, write the shot sheet, build each shot, then check the render with plain
tools. Explainer clips follow the same stages with a named grammar standing in for the art style.

Tags: [up] = figure taken from the MIT upstream huashu-art-motion (often one demo; retime on your own
material). [practice] = our judgment, a starting guess that measurement overrides.

## Route first

This skill owns the artistic look and its motion language. Hand off by asking:
- Is the subject an interface, component or app state? `atelier:motion-design`.
- Is the deliverable a Lottie, Rive or sprite file? `atelier:2d-animation`.
- Is one character's rig or acting the main work? `atelier:svg-character-animation`.
- Are equations or algorithms the content? `atelier:math-animation` (borrow only the one-object-becomes-the-next idea).
- Does script, voice or pacing still need deciding? `atelier:explainer-video`; here only grammar and style.
- A whole product film? `atelier:launch-film`; borrow styles for one segment.
- Must an existing recorded animation be matched faithfully? `atelier:animation-reverse-engineering`; here you restyle or redo it.
- Model-made clips or frames: `atelier:ai-video`, `atelier:image-generation` (motion routes B and C below call them).
- Capture and encode: `atelier:video-composition`; cutting footage: `atelier:video-editing`; shot planning for live or mixed film: `atelier:video-direction`.
- Mix checks: `atelier:audio-review`. General frame or UI inspection: `atelier:visual-qa` (Checks below are the art-motion subset). Stills and algorithmic art that do not move as a story: `atelier:generative-art`.

Reference files, read at the stage named:
- [references/style-catalog.md](references/style-catalog.md): Stage 1, looks by rendering technique.
- [references/explainer-grammars.md](references/explainer-grammars.md): Stage 1, choosing a grammar.
- [references/review-checklist.md](references/review-checklist.md): Stage 4, failures grouped by how to detect them.

## Stage 1: decide the look

1. **Classify the job**: style piece, reproduction of a reference, narrated explainer, or multi-style journey (last section). Mix kinds only on purpose.
2. **Look for real material.** A screenshot, photo, clip or source text fills the frame; code annotates and moves the camera. Draw or generate only what has no source. Test: could a real asset replace any code-drawn element? Then replace it.
3. **Pick the look or grammar.** Mechanism or derivation: whiteboard or transform. Numbers: chart. Anecdote: storytime. Era or artist: the style catalog.
4. **When the user names an artist, studio or tradition, take the visual language, not the famous picture.**
   - Keep: stroke and material, colour relations, light, form, space.
   - Re-solve for this subject: composition, scale contrast, grouping. Test [practice]: overlay your frame on the source work at 30% opacity; if the main masses line up, recompose.
   - Drop, unless asked: the original's people, objects and setting.
   - Evidence [practice]: base the brief on 3+ works that differ in subject and light (recolours and crops of one piece count once). With fewer, say so in the brief.
   - The brief is 3-5 observable traits plus 2 that separate the look from its nearest neighbour [practice] (impressionism is not one broken-stroke filter). Give palette as relations (warm vs cool, value range), not invented hex codes.
   - Studios and movements span decades: name the film or era first.

## Stage 2: write the shot sheet before any renderer code

Record a header and one row per shot. Do not start code until every item holds.
- Header: one sentence naming the single style; a palette of 3-6 values or a named set, no blue-violet gradient; a character policy (none, hands/backs only, or a generated frame library).
- Each row has a concrete noun and a verb. Test: say the noun aloud; "background" or "colour" means the row is not ready.
- Opening 3 s [practice]: a small scene from the topic, not a title card.
- One example threads through the film.
- Shot lengths 2-6 s, text-led rows at most 30% [practice], text short enough to read in its shot.
- Neighbouring rows differ in composition, never in style.
- Compare the sheet with any sample or famous work you drew on; where a layout, character or prop matches, redo the row.

## Stage 3: build each shot

### 3a. The frame
Fix subject, placement and where the camera ends up. With a reference clip, take composition from the last frame before its transition; otherwise block with a plain white-model screenshot. For a new look, show three frames with different compositions (not recolours) and let the user pick before building.

### 3b. Motion route, per shot
- A, pure code (canvas/SVG renderers): exact control, swappable styles, narration sync.
- B, generated layers plus code: one image-model layer per element on a flat key colour, original coordinates kept, then code adds offset, arc and physics. For painterly quality code cannot draw.
- C, video model from one still with the camera locked: organic whole-picture flow, little control. Mood shots only.
- D, hybrid: a B or C background with an A character, on one timeline.

### 3c. Render in layers (default, not law)
Flat block of position and value; the style renderer repaints using the block as colour source; small props on a finer separate layer (big strokes shatter them); character last with matched texture and clean contour; moving highlights. Exceptions: ink adds only to paper and keeps large blanks; pattern styles are flat fill plus pattern; chiaroscuro paints bright, then multiplies a light map.

### 3d. Keep it alive
Each scene gets one continuous main action plus 2-4 small loops from that style's own motifs [practice]; Check 4 proves it. Hand-drawn line boil: reseed lines at 8-12 fps. Stepped rates belong to a look (rubber hose about 12 fps, shadow puppet about 10 [practice]; pixel segments under 0.5 s may step at 15-30 fps [up, one demo], with no general pixel rate). Everything else runs on continuous time.

### 3e. Characters
Show people as generated frames composited in code, or as hands and backs only. Code mascots: show the contact sheet to 3 viewers [practice]; if 2 call a figure generic or clip-art, replace it with generated frames or hands/backs. No faces on coins or balls. Flat-cartoon styles may use original semantic SVG figures. For a minor character, run each generation prompt against a short banned-terms list (revealing, bare, lingerie, swimwear) and view every frame before use.

## Stage 4: time, camera and checks

### Transitions and rhythm
- The entering style supplies the transition (tiles flipping, page turn, dots filling, pixelation, wireframe to shaded). Starting lengths [up, one speedrun demo]: simple shapes about 0.4 s, falling to 0.13 s as the beat grid tightens; ornate ones (foil, ribbons) about 0.5 s. Retime on your grid.
- Optional landing bump [up, one demo]: a scale overshoot of a few percent settling within about 20 frames. Skip it before a hold; run motion-diff checks after the bump, not during it.
- Pick a beat grid, put cuts and music on it, and generate the schedule from counts (eighth notes) so a retime is one edit.
- Seed every random call. Test: render one instant twice and diff to zero.

### Camera moves
Per move ask what must be readable now and what the previous shot did, then choose a speed class.
- Hold while something draws, grows, plays as footage, or is being read. A hold is legal only if the sheet says "hold" and it is shorter than the longest planned shot.
- Slow push [up, measured from reference films]: 0.6-1.5 s eased, usually 10-40% scale; slide to the next item 0.5-0.9 s; follow a tracked line 1.3-1.8 s. A push over 2x may need up to 2 s [practice].
- Accent moves [up, one demo; starting points]: push of 18-32% in about 0.25-0.35 s, slam about 0.17 s. Only for a reveal, reversal, key number or punchline; on at most a third of explainer shots [practice].
- Follow a push, pull, slide or cut with a different scale. Never three identical moves in a row.
- Push-ins per minute: above about 8 is the upstream amber gate [up]; re-watch at speed.
- Ambient drift of 1-4 %/s [up, one demo] suits art-style ambience shots and reads as slideshow in explainers, so skip it there. Explainer shots may hold (storytime is mostly still); art-style pieces must clear Check 4.

### Checks (plain tools)
1. Contact sheet [practice]: `ffmpeg -i out.mp4 -vf "fps=2,scale=320:-1,tile=6x4" -frames:v 1 sheet.png`, set beside the sheet. Pass: each frame shows its row noun in the locked style and palette.
2. Determinism: render frame N twice and `cmp` the PNGs. Pass: identical.
3. Judder [practice]: total = `ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 clip.mp4`; kept = `ffmpeg -i clip.mp4 -vf mpdecimate,showinfo -f null - 2>&1 | grep -c pts_time`; dropped share = 1 - kept/total. On a clip cut to one smooth move, over 10% (a guess; calibrate on a known-smooth clip) signals stutter. Then watch once at real speed, full screen.
4. Dead beats [practice]: `ffmpeg -i out.mp4 -vf "freezedetect=n=0.003:d=0.3" -f null -`. The n value is a guess: run it on a known-static and a known-moving clip and tune until they separate. Reported stretches must match "hold" rows. Also count scene hits with `select='gt(scene,0.02)'` over total frames. Upstream gate [up]: share under about 3.5% is red (too static), under about 6% amber. ffmpeg's scene score only approximates upstream's measure and is noisy under about 10 s, so treat it as a prompt to look.
5. Length and rate: `ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate,duration out.mp4` against the spec.
6. Style recognition [practice]: export one uncaptioned frame to 4 viewers; pass when 3 name the intended style or period. Also set it beside the reference and compare palette relations.
7. Walk [references/review-checklist.md](references/review-checklist.md). For delivery, someone who did not build it reviews the final video only.

## Journey / speedrun films (only when asked)

One scene across many styles (art history, a street over a century, a person from 18 to 80). Figures come from a single upstream demo; re-test them.
- Anchors stay put: measure each anchor object's centre between consecutive segments; pass if drift is within about 40 px [up, demo at roughly 1920 px wide; scale to your width], so only style changes.
- One counter on global time and one hero action run through every segment.
- Segments shorten along the beat grid and the last is held longest for the payoff. Test [practice]: segment lengths in beats never increase except the last.
- Scroll variant: one file per world, hero walks left to right, camera only forward.
- Three styles can be enough. Never use this skeleton for explainers or single-style pieces.

## Stop rules

- Swapping images is not animation. Test: at any beat, something changes inside one picture.
- No reuse of layout, characters or props from a sample or famous work for a new subject.
- One style across the whole piece. Test [practice]: 3 of 4 viewers name the same style for 3 random frames.
- No blue-violet gradient grounds, deep-purple starfields or neon cyan-purple unless requested. Check [up]: sample frames at 2 fps, 160 px wide; a frame is blue-violet when 30% or more of its pixels have hue 225-300 degrees, saturation >= 0.30 and value 0.06-0.90; red at 30% of frames, amber at 12%. Runnable (tested) script in references/review-checklist.md Group 3.
- No code-drawn stand-ins for existing screenshots, photos or footage.
- No parametrised clip over about 8 s without a cut, no fixed header or page-number chrome, no ending on a centred quote card.
- Do not call a style production-ready from one scene; try a second subject first.

Optional extra: upstream huashu-art-motion (MIT) ships its own engine and QA scripts. Never required; nothing is bundled.
