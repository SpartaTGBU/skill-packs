---
disable-model-invocation: true  # skl: on-demand pack skill
name: launch-film
description: "Direct a code-rendered product launch film from a one-line brief: gather real product material, show three directions as real key frames, write a treatment with a rhythm sheet, build one HTML composition, score it, take frame-pinned feedback, export and make a share kit. Use for a launch film, product promo, feature announcement, changelog video, '30-second film for my product', or a film that passes every check yet feels like slides. Slices: launch-film-plan (Stages 1-3: brief, shape and three directions, rhythm and treatment), launch-film-build (Stages 4-7: build, score, pinned feedback, verify and deliver)."
---

# Launch Film

A launch film is directed: one message with a shape, real product material, an energy curve, a score,
and a loop where the user points at a frame and you change exactly that. Passing checks is the
starting line; the finished frames and a watch at normal speed are the bar.

Tags: [up] = figure or heuristic from the MIT upstream huashu-motion (a survey of 21 launch films and
its own examples). [practice] = our judgment, a starting guess that evidence overrides.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:launch-film-plan` | starting a film: no approved `treatment.md` yet | Stage 1 gather and brief, Stage 2 shape and three directions, Stage 3 rhythm and treatment |
| `atelier:launch-film-build` | a treatment is approved, or an existing film needs building, scoring, feedback or delivery | Stage 4 build, Stage 5 score, Stage 6 pinned feedback, Stage 7 verify and deliver |

## Neighbours (route first)

- `atelier:video-direction`: generic treatment-to-QA workflow for any coded video. Come here when the subject is a product launch and you need the energy curve, scoring and pinned-feedback loop.
- `atelier:video-composition`: capture and encode mechanics; this skill never owns the renderer.
- `atelier:explainer-video`: a voiceover teaches a concept. Here picture and score carry a claim.
- `atelier:art-motion`: a named art style is the point. Here the product's own look is.
- `atelier:motion-design`: UI micro-motion, not a film.
- `atelier:video-editing`: trimming footage.
- `atelier:ai-video`: generated footage.
- `atelier:audio-review`: judging a mix in depth.
- `atelier:visual-qa`: screenshot audits.
- `atelier:animation-reverse-engineering`: copying a motion you saw.
- `atelier:svg-character-animation`: character work.
- `atelier:2d-animation`: frame-by-frame work.
- `atelier:math-animation`: derivation work.
- `atelier:blender` for 3D scenes. forge:* is not relevant.

Reference files, read at the stage named:
- [references/direction-and-review.md](references/direction-and-review.md): Stages 2-3 and the cold review in Stage 7.
- [references/rhythm-and-sound.md](references/rhythm-and-sound.md): Stages 3 and 5.

## Verify

- Full checks and delivery: Stage 7 in `atelier:launch-film-build`.
- Never claim motion was reviewed from stills or sound heard from metrics.

## Stop rules

- A static title card or lone fading object as the opening.
- Placeholder UI or stock filler.
- Cuts that are neither carried nor on a beat.
- One ease and one energy level for the whole film.
- Reusing the last film's band, header or score.
- Declaring done because checks pass.
- Reopening a trade-off the user accepted, without new evidence.
- Claiming to have heard the audio.

Optional extra (never required): the MIT project huashu-motion packages a similar workflow as a CLI; any HTML-to-frames capture plus ffmpeg is enough.
