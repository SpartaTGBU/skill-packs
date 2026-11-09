---
disable-model-invocation: true  # skl: on-demand pack skill
name: audio-review-qa
description: "Measure a rendered audio or video file without hearing it: stream lengths, integrated loudness, true peak, LRA, noise floor, a timed event list, sound-to-picture sync offsets with a shift control, ranked defects; and A/B a mix change at matched loudness. Use for 'is the mix ok', loudness or peak checks, 'does the hit land on the cut', or comparing two mixes. Slice of atelier:audio-review."
---

Slice of atelier:audio-review (QA a file, A/B a mix change). Siblings: atelier:audio-review, atelier:audio-review-choose, atelier:audio-review-design.

References: [sound-grammar.md](../audio-review/references/sound-grammar.md) (what to sound, placement, music, mix),
[measure-recipes.md](../audio-review/references/measure-recipes.md) (ffmpeg/sox commands).

## A: QA a file
1. Probe streams; audio length vs video length must differ by less than 1 frame, else it is a bug.
2. Run the meters and compare to the targets below, measured on the final encode.
3. Render a spectrogram and a waveform PNG, plus zooms on suspect windows, and view them.
4. Event list: onsets from the envelope (recipe file), each with time, level, dominant band, and the
   nearest picture cue.
5. Sync: offset = sound onset minus picture event. Report median and spread. Pass windows per cue type (upstream, measured on pro launch
   films): hits, clicks, keys: attack at most 45 ms before and peak at most 75 ms after the cue;
   whooshes: apex within +-45 ms; risers: audible end 250 ms before to 30 ms after the hit.
   Control [practice]: shift all cues by a random 0.3-1 s and recompute the median |offset|; sync
   is real only if the shifted median is at least 2x the unshifted one.
6. Report defects ranked: clipping or peak over ceiling, silence on a cue, click on sample 0, hard
   cut at the end, then levels. Each has a timestamp, number and fix.

| Check | Pass |
|---|---|
| Integrated loudness | -14 LUFS for web/social (upstream); another target only if the user names it |
| True peak | at most -1 dBTP on a master (upstream); 0 dBTP on audio already decoded from AAC/MP3 (upstream) |
| LRA | 5-9 LU for a film with an arc (upstream); under about 3 LU suggests heavy compression [practice] |
| Floor between events | under -55 dBFS for close dry sounds (upstream, sourcing brief) |
| Loudest moment | on the hero beat, inside 30-60% of runtime (upstream) |
| Ends | first 5 ms under -50 dBFS, tail under -60 dBFS then silence [practice] |

## C: A/B a mix change
Match integrated loudness first (else the louder wins), render both, compare meters, spectrograms and
event lists, change one variable, report the winner and what numbers cannot tell.

## Verify
- Every audio claim has a number or a viewed image.
- Loudness and peak re-measured on the final encoded file, e.g.
  `ffmpeg -nostats -i out.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -n 20`.
- `ffprobe` shows audio and video durations within 1 frame.
- Per cue offset listed and inside its type's window from A.5, or marked "none" on purpose.
- Spectrogram viewed: no clip ceiling, no click line at edits, no unexpected shelf near 16 kHz.
- Taste statements are labelled "needs human listen".

## Do not
- Describing how audio sounds with no measurement behind it.
- Comparing A and B at different loudness.
- Judging a multi-take or long file from its whole-file average.
- Effect density: median about 5 per 10 s (upstream, pro launch films); more than about 8 per 10 s
  needs a cue-table justification [practice].
- Uploading audio to an outside service, or installing models/tools, without the user's yes.
