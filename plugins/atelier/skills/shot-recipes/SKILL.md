---
disable-model-invocation: true  # skl: on-demand pack skill
name: shot-recipes
description: >
  Method for cinematic, editable product promos built as code with Remotion: real page captures,
  shot recipes (one motion idea per shot), energy curve, beat-synced cuts, sound design, frame-level
  QA and a plan for a re-editable deliverable. Use when asked to "make a promo/launch video for my
  product from its real UI", plan a shot list, sync cuts to a BGM, place SFX, or pick motion
  archetypes for a product film. Neighbours - one-line film from a sentence to atelier:one-line-video; story and shot theory to atelier:video-direction; generic Remotion/ffmpeg assembly goes to
  atelier:video-composition; story and voice to atelier:launch-film; live recordings to
  atelier:product-demo-video; generated footage to atelier:ai-video; UI motion in a web page to
  atelier:motion-design. Other siblings are listed in the body.
---

# Shot Recipes

A product promo is a short list of **shots**, each built from one named **recipe**: a camera move, a
subject, an entrance, a hold and a sound. Every frame is drawn by code from the product's real
screenshots and copy, so the film stays sharp, on-brand and re-editable. This skill teaches the
method and gives a small original set of archetypes; it does not ship a catalog.

Neighbours (one-line split rules). If the output is a rendered MP4 built from captured product UI, stay;
otherwise route:
- Generic Remotion/ffmpeg assembly, render settings: `atelier:video-composition`.
- Story, tone, script: `atelier:launch-film` or `atelier:video-direction`.
- Recorded walkthrough of a live app: `atelier:product-demo-video`. Teaching with narration:
  `atelier:explainer-video`.
- Generated footage: `atelier:ai-video`; existing footage: `atelier:video-editing`; exact copy of a
  reference animation: `atelier:animation-reverse-engineering`.
- Motion inside a web UI: `atelier:motion-design`. Judging a finished mix: `atelier:audio-review`.
- No captured UI in the subject (abstract, equations, hand-drawn, SVG mascot): `atelier:art-motion`,
  `atelier:math-animation`, `atelier:2d-animation`, `atelier:svg-character-animation`.
- The product's look or UI quality before capture (build, fix, audit, brand marks): the design siblings
  (`atelier:design-systems`, `atelier:visual-design`, `atelier:frontend-design`, `atelier:prototype`,
  `atelier:unslop-ui`, `atelier:ui-review`, `atelier:visual-qa`, `atelier:logo-design`,
  `atelier:diagrams`). Split: they make or check the UI; this skill films it.

Depth: [references/archetypes.md](references/archetypes.md) (eight original recipes with timing),
[references/beat-and-sound.md](references/beat-and-sound.md) (grid fitting, hit lists, SFX table).

## Invoke

1. **Scope.** Whole film, one shot, or sound-only on an existing film? Sound-only jumps to the
   sound section; do not reopen creative decisions. Full film: confirm the autonomy level (you
   decide everything vs. owner approves brief, direction, shot map, storyboard) and keep to it.
2. **Read-only product check** before any code: positioning, features worth showing, which UI states
   can be captured, data risks. Output a brief of at most one page.
3. Run the pipeline below in order. Do not start per-shot code before the direction and shot map
   are fixed.

## Principles

1. **Real UI, captured.** For a product that exists, run it locally and capture full-page textures
   at 2x plus element cut-outs and a coordinate table (id, x, y, w, h). Hand-built UI is allowed
   only for abstract openers or brand cards, and only if a viewer can name what it shows within the
   shot's first second [practice]; otherwise go back to captures.
2. **The film inherits the product's look.** Extract fonts, type scale, spacing, radii, colours and
   materials from source or computed styles into a one-page spec before any styleframe. Titles,
   captions, particles and glows then use only those tokens; every colour and font in a frame must
   trace to the spec [practice] (an added token needs a written reason in the look spec). From a
   recipe, borrow structure, timing and motion grammar; re-skin everything else.
3. **One motion idea per shot.** Each technique (fly-in, stack, page-turn, orbit) is the lead once
   per film. Edit pass: ask "what new information does this shot give?" and delete any shot whose
   answer is "the same thing again".
4. **Pick one hero per shot and give it the whole arc.** Cinema comes from camera, light, pace and
   sound, not effects. Test [practice]: every shot has exactly one named hero and at most two other moving
   layers; more means cut layers, not add them.
5. **Slow wins.** First drafts run too fast. [practice] Default the first cut one step slower. Test
   [practice]: hold frames (nothing but ambient motion) total at least 20% of runtime, and no shot
   is shorter than 1.5 s without a written reason in the storyboard.
6. **Deterministic frames.** No `Date.now()`, no `Math.random()`; derive every pseudo-random value
   from a seeded hash of the index so any frame re-renders identically.
7. **Sound is a layer placed after picture lock** and re-pinned whenever durations change.

## Pipeline

1. **Brief.** Product, audience, 3 to 5 features worth a shot, forbidden claims, sensitive data
   (replace customer/personal/internal/live data with invented content before capture; freeze
   state first).
2. **Look spec.** Tokens from principle 2; one reference still of the product at film scale.
3. **Shot map.** List features, then map each to exactly one recipe. A feature with no shot is a
   rework waiting to happen; a recipe used twice as lead is a cut.
4. **Energy curve.** Sketch low/mid/high per shot. Shape: quiet focused opener, build, one peak,
   resolve on the brand. [practice] The closing shot should be the loudest visual moment of the
   film; first drafts usually under-deliver here, so go one notch bigger than feels safe.
5. **Storyboard.** Per shot: order, seconds, exact page state, capture source, caption, transition,
   sound cue. Only now write code.
6. **Build shots** as isolated compositions. Check each with a still frame before assembling.
7. **Music and sound** (sections below), then **caption rewrite** against the final picture.
8. **Verify** (section below), then deliver the editable project plus the rendered file.

## Motion and framing rules

- Opener: one subject, one full arc, at least 3 s [practice]. Typing, filtering, clicking run at human speed
  so a viewer could repeat them.
- Hold: a brand wordmark at open and close stays still for at least 1 s once it lands [up]. Own default [practice]: a finished batch (grid, deck, list) rests
  0.5 s before the next cut. Hold budget goes in the timeline up front; every archetype row lists its hold or rest.
- No constant-velocity motion. Entrances use non-linear easing and uneven stagger. For many
  similar elements, accelerate the sequence (each arrival sooner than the last), ideally tied to a
  physical image such as dealing cards, and rest after.
- [practice] Cameras are steady for bright UI promos: no handheld shake. Tiny noise only in dark
  documentary styles, and then confirm in rendered frames that it reads as intended.
- Dense information (lists, stacks, tables) is framed head-on. Close-ups of text-bearing cards use a
  sideways, horizontal camera; steep high or low angles destroy legibility. Decide tilt per shot,
  never globally.
- Product objects: side-tilt, visible thickness, slow orbit, dark contrasting material behind,
  then pull back to rejoin the main scene.
- Glints and sheens [practice]: at most one per shot, on the hero only, clipped by the carrier's border-radius
  and overflow. Never sprinkled across a batch.
- Fly-ins land in the real layout slot (grid cell, scroll stream) and embed there; nothing hovers
  above the page after landing.
- Mock documents get native typography filled to real density with sidebars and comment rails in
  frame. A flat image with a tagline pasted on is a rework; test: at least 3 distinct text blocks [practice] (title, body, sidebar or comment rail) are visible in
  the frame.
- In-scene annotations live in the same 3D space as the subject (same perspective, small
  translateZ and shadow). Flat overlays on a tilted scene look detached.
- Raster 3D textures at 2x for full pages and 4x for hero elements [up] and downsample inside 3D; for enlargement use layout
  zoom, not transform scale. Blurry text means check the raster path before touching camera or DoF.

## Legibility (measure on the render, not in code)

Export a frame, crop the text, measure its pixel height on a 1080-line frame, then look up the
role. Floors are 56 px and 32 px [up] (the roles and the closing-line rule are ours [practice]). Extra check [up]: view the render
in a 480 px-wide window; caption text must still be readable.

| Role | Floor on 1080 lines | If below the floor |
|---|---|---|
| Narrative caption | 56 px | enlarge |
| Subtitle, stat | 32 px | enlarge |
| Closing URL or call to action | 32 px | the only text allowed to sit near the floor |
| Text inside a captured screenshot | none | mark as deliberate texture: dim or blur it |

Every text element is either at its floor or deliberate texture; delete anything that is neither.
Light backgrounds need a scrim or shadow under read-me text. Measure tilted cards on the render:
rotation squeezes the apparent height.

## Beat sync

Only when the owner has chosen strong-beat music; otherwise time to content and pick music late.

1. **Music first.** No storyboard until the grid is verified. If the length does not fit, change the
   timing parameters, never the owner's copy.
2. **Fit the grid** by least squares over the detected beat times, not from a tempo scalar
   (details in [references/beat-and-sound.md](references/beat-and-sound.md)). Accept when the
   maximum residual is about 15 ms [up]. [practice] One frame at 30 fps is 33.3 ms, so 15 ms is
   under half a frame. Check half/double ambiguity:
   under the right grid kicks land on whole beats, not half of them on the off-beat.
3. **Work in float seconds** and convert to frames at the last step into Remotion; early rounding
   accumulates drift.
4. **Write the timeline in beats** (a `beatF(n)` helper). Pin sparse accents to real transients, not
   to interpolated grid points.
5. **Time, not amplitude.** Cutting on the beat does not mean hitting the picture on every beat.
   Whole-frame or camera-layer impacts (scale pump, shake, flash frame, inverted frame) are
   scarce: at most 3 per film [up], chosen from the strongest hits. Everything else moves the subject layer only.
   Tunable defaults [up]: at least 16 beats between two such
   impacts; a beat-pump series runs at most 4 beats.
   Test: replay any 8 consecutive beats frame by frame; if the whole frame pulses each beat, cut.
6. **After render**, pull the audio from the output and measure cut error against the grid; pass is at most
   3 frames [up] (our reading: 2 to 3 frames is where viewers stop hearing the sync [practice]); recipe in Verify.
7. When music is present, deliver two renders from one timeline: with BGM and without (SFX kept),
   toggled by an input prop.

## Sound design

- Vocabulary for a product promo: whoosh (camera moves), impact (landings), riser (build),
  sparkle (light), transition. Real actions get real foley: typing gets keyboard sound, items
  dropping in get individual pops. A generic swoosh does not cover a recognizable action.
- Avoid game-pack and notification-style tones unless the film is deliberately about system alerts.
- Order: lay BGM first for the energy skeleton, then pin sounds only to actions the music does not
  already carry. Do not add an impact to every kick.
- Keep one declarative table of `{ frame, source, volume }` with a comment on the picture action
  per row; scenes carry no audio of their own. Derive it from the same shot list used for picture.
- Repeated sounds [practice]: alternate two distinct samples, step volume down along the run, and let the gaps shrink with the animation curve; when the
  run blurs together, fade into a single swoosh. Verify the two samples are not the same recording
  (compare file hashes, then listen). Avoid pitch shifting (it smears transients).
- Trim long samples to the action length; let impacts ring past the landing frame.
- Picture lock first. After any duration or order change, re-pin the whole table.
- Rendered audio lags the video by encoder priming, and the size depends on encoder, container and
  Remotion version. Do not port a constant. Measure: cross-correlate 2 or 3 sharp samples against
  the output, subtract one constant in the placement formula, and measure each source's own peak
  offset rather than assuming the file start. Record the result with codec, sample rate and
  container; re-measure when any changes.
- Mix by measurement: check for clipping with many layers stacked, and that SFX are not masked by
  music. Volume is a multiplier, not a loudness target. Candidate sounds are judged in the film,
  not alone, and are never described as "heard" unless played.
- Check licence per sound and per track; music and SFX licences differ. Keep a credits file next
  to the audio.

## Verify (works with plain tools)

- **Stills:** `npx remotion still src/index.ts <CompId> out/f.png --frame=<n>` for each shot's
  first, peak and hold frame. Or screenshot the composition in the Remotion preview.
- **Contact sheet:** `ffmpeg -i out.mp4 -vf "fps=2,scale=480:-1,tile=6x5" sheet.png`; scan for
  repeated shots, dead air and uneven energy.
- **Hold check:** `ffmpeg -i out.mp4 -vf "mpdecimate=frac=1,showinfo" -f null - 2>&1 | grep pts_time`
  lists only frames that differ from the previous kept frame. To ignore scripted ambient motion,
  add `crop=w:h:x:y` before `mpdecimate` around the hero. [practice] Pass: inside a declared hold,
  no more than one listed frame per 0.5 s; a hold of N s shows a gap of about N s between lines.
  Compression noise can add lines; if so raise `hi`/`lo` and note it.
- **Text size:** crop a caption from an exported frame, measure its pixel height against the
  1080-line rule above.
- **Determinism:** render the same frame twice, `cmp` the PNGs, expect identical.
- **Audio:** `ffmpeg -i out.mp4 -vn -ac 1 -ar 48000 a.wav`, then `ffmpeg -i a.wav -af astats -f null -`
  for peak level (pass: below 0 dBFS, no clipped runs).
- **Cut-to-beat error:** take cut times from the storyboard frames (frame / fps). Scene detection
  (`select='gt(scene,0.3)',showinfo`) misses dissolves and camera-move cuts, so use it only as a
  cross-check. Onset times from a numpy spectral-flux script on
  `a.wav` ([references/beat-and-sound.md](references/beat-and-sound.md)). For each cut take the
  nearest onset; pass when every error is at most 3 frames (0.1 s at 30 fps), and report the worst.
- **Audio offset:** run the cross-correlation recipe in
  [references/beat-and-sound.md](references/beat-and-sound.md) for 2 or 3 sharp SFX; record the lag.
- **Sign-off:** a fresh-context reviewer (a second agent, or you after a break) goes through the
  brief, direction, shot map and storyboard with frame numbers as evidence. The maker never skips
  to the owner without a self-render check.
- **Aesthetic self-check:** note each deliberate rule violation and why in the project notes.

## Do not

- Do not copy another project's shot catalog, recipe card text or demo source; write recipes from
  this method.
- Do not hand-draw a replica of a page that exists; capture it.
- Do not invent a promo skin unrelated to the product.
- Do not put sensitive or live data in a capture.
- Do not use random or wall-clock values in frames.
- Do not hit the whole frame on every kick, or scatter glints.
- Do not lead two shots with the same technique, or repeat a tagline.
- Do not hand the first review to the owner.
- Do not publish, post or upload the film unless the owner asks; Remotion has its own licence
  terms for company use, so check them.
