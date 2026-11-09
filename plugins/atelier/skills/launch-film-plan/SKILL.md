---
disable-model-invocation: true  # skl: on-demand pack skill
name: launch-film-plan
description: "Plan a product launch film before building it: collect real product material with sources, send one brief message with defaults, pick the film's shape by what the viewer must repeat, show three directions as real key frames, then plan route, energy curve, boundary diffs, carry lines, shot verbs and ending into treatment.md. Use at the start of a launch film, promo or feature announcement. Slice of atelier:launch-film."
---

Slice of atelier:launch-film (Stages 1-3: gather and brief, shape and three directions, rhythm and treatment). Siblings: atelier:launch-film, atelier:launch-film-build.

Tags: [up] = figure or heuristic from the MIT upstream huashu-motion (a survey of 21 launch films and
its own examples). [practice] = our judgment, a starting guess that evidence overrides.

Reference files, read at the stage named:
- [references/direction-and-review.md](../launch-film/references/direction-and-review.md): Stages 2-3 and the cold review in Stage 7.
- [references/rhythm-and-sound.md](../launch-film/references/rhythm-and-sound.md): Stages 3 and 5.

## Stage 1: gather and brief

1. Read before asking. Collect real material: the project folder (images, screenshots, icons, declared colours and fonts), then the product site and launch posts, then run the product and capture real screens. Log source and licence of each image in `materials.md`; mask private data.
2. Send one message, not a form: the product, the single thing the film leaves behind, and only the decisions that change the build (venue and length, energy, narration), each with a marked default [practice: ask nothing the default covers].

## Stage 2: choose the shape and three directions

Pick the shape by asking what the viewer must be able to repeat after one watch, then test it against the failure listed.

| If | Shape | It fails when |
|---|---|---|
| a new, named thing exists | claim | it becomes a feature tour |
| an input becomes an output | workflow | no real product screen appears |
| something internal explains the result | mechanism | it is a fast reel with no cause shown |
| a measured change is the news | evidence | the figure shows under 1 s per digit group [practice]; count digit groups in the cut and divide by on-screen time |
| several items ship together | list | it is N identical slides; vary scale per item |
| a before and after state | transformation | it is a hard cut between two stills |
| a character or situation carries it | story | it is bullets over a mascot |

If two fit, take the one whose failure you can check in the treatment stills. Candidate languages per shape and the three-directions rules are in the direction reference. Show three directions as real key frames; the user picks. If the user rejects all three twice, stop proposing, ask for one reference film or frame, and rebuild the three around it [practice].

## Stage 3: plan rhythm and write the treatment

Default energy when no style is named:
- Frame 0 often becomes the feed poster. Test [practice]: export frame 0 alone; the subject covers at least 25% of the frame area, else redo it.
- Plan the first burst before 5 s [up, heuristic]; the hook event lands inside 3 s (step 2 below). Body text must read at phone width: downscale a frame to 360 px wide and read every line [practice].
- Energy comes from motion, cutting and shot scale, not colour changes. One product accent, one real typeface with weight contrast.
- A calm opening only on request; if so, write the reason into the treatment and still plan one event every 2 bars [practice].

Planning steps (monotony test: same move, same scale, one ease and idle music means the film reads slow, so plan the opposite on paper):
1. Route: continuous (0-2 cuts), montage (cuts on beats), or hybrid (spine plus 1-2 bursts, the usual launch choice). The burst idea is from upstream's survey [up].
2. Energy curve: 0-10 per few seconds. Aim for a hook inside 3 s [up heuristic that only 14 of 21 surveyed films met], so a deliberate slower open is allowed if the treatment says why. Include one mid-film burst, a hero moment on the strongest musical point, optionally a near-silent stop, and an end hold on the mark. Bar densities are in the rhythm reference.
3. Boundary diff: at each section boundary list which attributes differ between the last shot before and first shot after (scale, speed, ease, camera, density, ground, music). Fewer than two means the boundary is probably not felt; change another [practice].
4. Carry the eye: one line per transition naming the object, colour or position linking shot N to N+1. If you cannot write it, the beat must justify the cut.
5. Every shot has a verb (gather, split, align, connect, reveal); otherwise delete or merge it.
6. Ending: a launch ends on the brand; a showcase or loop returns to frame 0.

Put all of it in `treatment.md` before any full build (template in the direction reference).

## Verify

- Rendered checks: Stage 7 in `atelier:launch-film-build`.
- Never claim motion was reviewed from stills or sound heard from metrics.

## Do not

- A static title card or lone fading object as the opening.
- Cuts that are neither carried nor on a beat.
- One ease and one energy level for the whole film.
- Reusing the last film's band, header or score.
- Reopening a trade-off the user accepted, without new evidence.
