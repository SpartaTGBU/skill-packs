---
disable-model-invocation: true  # skl: on-demand pack skill
name: video-direction
description: "Direct and verify short code-rendered videos (HTML/Canvas/SVG/Three.js or Remotion to MP4): decide the idea, hook, beat timeline, pacing, continuity, sound plan and on-screen truth, then prove it with stills and measurements. Use for 'make a 15s video for my app', storyboarding, reviewing or fixing a launch film, promo, kinetic-type piece, data story, lyric video, loop or social reel, or when a coded video feels slow, out of sync, unreadable or generic. Slices: video-direction-plan (decisions, stages and gates, build contract, briefing another agent), video-direction-fix (fixing an existing video)."
---

# Video direction

Code is the camera: each frame is a pure function of time, captured offline. This skill is the
director layer: what to say, when, and how to prove it. It assumes a render pipeline exists.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:video-direction-plan` | making a new coded video, or briefing another agent to make one | Decisions grouped by the question, Stages and gates, Build contract, Briefing another agent |
| `atelier:video-direction-fix` | an existing video has notes or feels slow, out of sync, unreadable or generic | Fixing an existing video |

## Start

1. One intake round at most: venue, the single message, duration/aspect/fps, locked copy and its fact source, real assets, music. Gaps get a default plus a logged `DECISION: <choice> because <reason>`. Read back the idea in one sentence.
2. Mode: stakes real and user present means ask (about 6 questions [practice]) and stop once for treatment approval; "just make it" means decide and list decisions at delivery.
3. Answer the decisions in `atelier:video-direction-plan` (or, for an existing video, follow `atelier:video-direction-fix`), then work in stages, each ending in an inspectable artifact.
4. You cannot watch or hear the film. Report which claims were measured, which only seen.

## Neighbours (if X, go to Y)

- Need the capture/encode pipeline, SPEC or Remotion setup: `atelier:video-composition`.
- Genre already fixed as product launch: `atelier:launch-film`.
- Teaching-led narration: `atelier:explainer-video`.
- Unsure of structure, pacing, truth or QA: stay here.
- Cutting recorded footage: `atelier:video-editing`.
- Prompting a generative pixel model: `atelier:ai-video`.
- Motion inside an interface: `atelier:motion-design`.
- Algorithm or maths scene: `atelier:math-animation`.
- Frame-by-frame drawn animation: `atelier:2d-animation`.
- Rigged vector character: `atelier:svg-character-animation`.
- Generative or algorithmic art in motion: `atelier:art-motion`.
- You have a source video or animation to match: `atelier:animation-reverse-engineering`.
- The only question is the audio mix: `atelier:audio-review`.
- The only question is one still image: `atelier:visual-qa`.
- forge:*: none applies unless the build is a code project; then use forge process skills for the code only.

References: [workflow](references/workflow.md) (intake, artifacts, fix cards);
[craft numbers](references/craft-numbers.md) (holds, type, easing, levels);
[QA and review](references/qa-and-critic.md) (runnable commands, defect map by stage, three-pass review).

## Verify

Needs only ffmpeg/ffprobe, ImageMagick and a browser; commands in [QA](references/qa-and-critic.md).
- [ ] Muted viewer restates the idea from frames
- [ ] Hook and CTA meet size and contrast at 3 s
- [ ] Each string held its table time (craft-numbers); 360 px sheet readable
- [ ] No unexplained pop, flash or blank; every frozen stretch is a designed hold
- [ ] Detected cuts within 1 frame of timeline; audio hits within 1.5 frames (ideal) or 3 (pass)
- [ ] `ebur128` -14 +/-1 LUFS, true peak <= -1 dBTP (-1.5 to -2 before AAC), loudest moment is the payoff
- [ ] Every term said and shown; every number traced or labelled
- [ ] Loop seam continuous; revision frames outside scope identical
- [ ] Report lists DECISIONs, weakest shot, measured vs seen vs heard

## Hard bans

- Reporting anything unmeasured as measured; claiming a fix not re-rendered and viewed.
- Unbounded fix loops: one round after the critic, one re-check; leave shots scoring 9+ alone.
- Copying a benchmark film's structure; adjectives as acceptance criteria.
- Invented UI or stats; placeholder text ("Acme", lorem) in a deliverable.
- Requiring any third-party QA script; they are optional extras only.
