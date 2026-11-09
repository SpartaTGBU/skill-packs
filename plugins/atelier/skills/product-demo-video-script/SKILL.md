---
disable-model-invocation: true  # skl: on-demand pack skill
name: product-demo-video-script
description: "Write and time a recorded product demo: one claim per scene on a problem, golden path, result order, a length budget, narration as the master clock with holds derived from voice clip lengths, action landing before the words, gap speed-up, post-change holds, transition and dead-air limits. Use when storyboarding or scripting a Playwright demo, or when its narration drifts from the screen. Slice of atelier:product-demo-video."
---

Slice of atelier:product-demo-video (scene design, narration sync, pacing). Siblings: atelier:product-demo-video, atelier:product-demo-video-capture.

Reference: [references/pipeline-and-recipes.md](../product-demo-video/references/pipeline-and-recipes.md): manifest shape,
timing defaults, ffmpeg recipes (audio bed, zoompan, GIF), optional tooling map.
Tags: [up] = figure from the MIT-licensed Argo project; [practice] = our judgment. Figures marked "Argo" are [up]; anything unmarked is [practice].

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

## Verify

2. **Sync**: extract a frame at each narration start: `ffmpeg -ss T -i out.mp4 -frames:v 1 f_T.png` for every scene mark T. Get T from the `timing.json` your script appends at each scene mark (minus any trimmed head); without one, sum the clip lengths (`ffprobe -v error -show_entries format=duration -of csv=p=0 clip.wav`) plus holds. The thing named in the sentence must already be on screen. Any scene whose action lands after its words is a fail.
4. **Dead air**: `ffmpeg -i out.mp4 -vf freezedetect=n=0.003:d=3 -an -f null -` lists freezes of 3 s or more; each must be a deliberate hold. The 0.003 noise value is [practice].

## Do not

- Do not hardcode waits or effect durations that should follow the voice.
- Do not stack zoom, spotlight, overlay and transition in one scene.
- Do not narrate what is plainly visible ("click the button"); say the outcome.
- Do not use transitions under 2 s and expect them to be seen (see Pacing); cut instead.
