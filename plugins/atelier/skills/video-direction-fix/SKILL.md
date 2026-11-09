---
disable-model-invocation: true  # skl: on-demand pack skill
name: video-direction-fix
description: "Fix an existing code-rendered video: run the checks, translate each note into a mechanism, write one fix card per issue, fix the worst three one per take with structure before surface, and diff decoded frames outside the fix scope against the old render. Use when a coded video has review notes or feels slow, cheap, out of sync, unreadable or generic. Slice of atelier:video-direction."
---

Slice of atelier:video-direction (fixing an existing video). Siblings: atelier:video-direction, atelier:video-direction-plan.

References: [workflow](../video-direction/references/workflow.md) (intake, artifacts, fix cards);
[craft numbers](../video-direction/references/craft-numbers.md) (holds, type, easing, levels);
[QA and review](../video-direction/references/qa-and-critic.md) (runnable commands, defect map by stage, three-pass review).

## Fixing an existing video

1. Run the checks. 2. Translate each note into a mechanism ("cheap" is usually linear timing, flat stage or small type). 3. One fix card per issue ([workflow](../video-direction/references/workflow.md)). 4. Worst three, one per take, structure before surface. 5. Diff decoded frames outside the fix scope against the old render (see QA); never diff two MP4s.

## Verify

Needs only ffmpeg/ffprobe, ImageMagick and a browser; commands in [QA](../video-direction/references/qa-and-critic.md).
- [ ] Muted viewer restates the idea from frames
- [ ] Hook and CTA meet size and contrast at 3 s
- [ ] Each string held its table time (craft-numbers); 360 px sheet readable
- [ ] No unexplained pop, flash or blank; every frozen stretch is a designed hold
- [ ] Detected cuts within 1 frame of timeline; audio hits within 1.5 frames (ideal) or 3 (pass)
- [ ] `ebur128` -14 +/-1 LUFS, true peak <= -1 dBTP (-1.5 to -2 before AAC), loudest moment is the payoff
- [ ] Every term said and shown; every number traced or labelled
- [ ] Loop seam continuous; revision frames outside scope identical
- [ ] Report lists DECISIONs, weakest shot, measured vs seen vs heard

## Do not

- Reporting anything unmeasured as measured; claiming a fix not re-rendered and viewed.
- Unbounded fix loops: one round after the critic, one re-check; leave shots scoring 9+ alone.
- Invented UI or stats; placeholder text ("Acme", lorem) in a deliverable.
- Requiring any third-party QA script; they are optional extras only.
