---
disable-model-invocation: true  # skl: on-demand pack skill
name: audio-review
description: "Judge and choose sound without hearing it: measure loudness, true peak and noise floor, list a soundtrack's events with times, check sound against picture cues, pick among candidate sounds, A/B a mix change, and plan a sparse sound palette for a film or UI. CPU-only, number first. Use when generated or edited video/audio needs QA, an SFX or music choice, a mix or loudness check, 'does the hit land on the cut', or sound design for a launch film, demo or UI. Slices: audio-review-qa (QA a file, A/B a mix change), audio-review-choose (pick among candidate sounds), audio-review-design (plan sound for picture, make a sound in code)."
---

# Audio review

You cannot hear. So no report line may say a sound "fits" or "feels premium" unless a number or
image sits next to it (for example "-14.2 LUFS, -1.3 dBTP" or "hit peaks +12 ms after the cut").
Taste is not measurable: state what the sound is and what it measures, and mark "is it good" as
needing a human listen.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:audio-review-qa` | a rendered file needs a loudness, sync or defect check, or a mix change needs an A/B | A: QA a file, C: A/B a mix change |
| `atelier:audio-review-choose` | you must pick one sound from candidates | B: choose among candidates |
| `atelier:audio-review-design` | picture needs a sound plan, or a sound must be synthesized | D: plan sound for picture, E: make a sound in code |

## Start
1. Pick one job and load its slice: A QA a file or C A/B a mix (atelier:audio-review-qa), B choose
   among sounds (atelier:audio-review-choose), D plan sound for picture or E build a sound in code
   (atelier:audio-review-design).
2. `command -v ffmpeg ffprobe sox`. ffmpeg alone is enough. A model-based scorer (upstream
   "earshot", https://github.com/Leonxlnx/earshot) is an optional extra, never required or installed unasked.
3. For picture-bound work get cue times from the picture code or a frame list, not by eye
   [practice: typed-in times drift by many frames].
4. Change one thing per round, re-measure, log round and numbers.

## Neighbours (one split each)
- atelier:video-composition: renders the film and owns the audio mux; this skill only decides what
  goes into the mux and checks the result.
- atelier:video-editing: owns cuts; we only report where sound sits against a cut.
- atelier:ai-video: owns generated clips; we QA their native audio and replace it if it fails.
- atelier:launch-film: owns the story and shot list; we own the sound plan and its QA.
- atelier:art-motion: owns picture of art-direction-led motion; if a film has both art-motion picture and a
  launch-film structure, launch-film owns the cue table's picture side, this skill owns the sound plan.
- atelier:explainer-video: owns script and narration text; we measure the voice and music levels.
- atelier:video-direction: owns shot and pacing intent; we turn it into cues.
- atelier:motion-design: owns UI motion timing; we sound only events it lists.
- atelier:visual-qa: owns frame review; we own the soundtrack review.
- atelier:animation-reverse-engineering: extracts timing from a reference; we extract sound timing only.
- atelier:2d-animation, atelier:math-animation, atelier:svg-character-animation: picture only; come
  here when they need sound.
- forge:*: process skills, not relevant unless the audio tooling is code you are writing.

References: [sound-grammar.md](references/sound-grammar.md) (what to sound, placement, music, mix),
[measure-recipes.md](references/measure-recipes.md) (ffmpeg/sox commands).

## Verify
- Every audio claim has a number or a viewed image.
- Taste statements are labelled "needs human listen".
- Mode-specific checks are in each slice's Verify.

## Hard bans
- Describing how audio sounds with no measurement behind it.
- Uploading audio to an outside service, or installing models/tools, without the user's yes.
- Mode-specific bans are in each slice's Do not.
