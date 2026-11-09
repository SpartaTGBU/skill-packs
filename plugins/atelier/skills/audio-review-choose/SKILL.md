---
disable-model-invocation: true  # skl: on-demand pack skill
name: audio-review-choose
description: "Pick one sound from candidate files without hearing them: filter by measured length, attack, decay, floor and peak, describe the wanted sound by source and material, trim recordings, A/B finalists level-matched, read real vs synthesized from the floor, and check licences. Use when choosing an SFX, click, hit or music take from a set of candidates. Slice of atelier:audio-review."
---

Slice of atelier:audio-review (choose among candidates). Siblings: atelier:audio-review, atelier:audio-review-qa, atelier:audio-review-design.

References: [sound-grammar.md](../audio-review/references/sound-grammar.md) (what to sound, placement, music, mix),
[measure-recipes.md](../audio-review/references/measure-recipes.md) (ffmpeg/sox commands).

## B: choose among candidates
1. Filter by measurement first [practice]: reject a candidate if it is over 1 s for a UI cue (over 3 s
   for a hit), has attack over 30 ms for a click or hit, 40 dB decay over 400 ms for a click, floor
   above -55 dBFS, or peak above -1 dBFS. Among survivors, tie-break in order: centroid nearest
   the wanted band, shortest decay, lowest floor.
2. Describe the wanted sound as source + material + action ("small wood block, tapped once, dry"),
   not by its job; "appearing" has no sound. With no scorer, rank by the step 1 numbers; if one is available, use 3 phrasings and trust a
   result only if the top pick survives all three.
3. Trim a recording longer than 10 s [practice]: start 5 ms before the attack, end after the decay; reject if the first
   5 ms or last 10 ms sit above -30 dB re the trim peak [practice]. Measure the trim, not the file.
4. A/B two finalists level-matched; report centroid, decay and loudness differences in numbers.
5. Real vs synthesized, CPU-only [practice]: on a 1 s quiet stretch read RMS (astats) and spectral
   flatness (`-af aspectralstats=measure=flatness,ametadata=mode=print:key=lavfi.aspectralstats.1.flatness:file=-`,
   average it; tested: pink noise about 0.7, a pure sine about 0.005). Floor RMS under -85 dBFS with flatness
   under 0.05 reads synthetic or gated; a floor of -75 to -55 dBFS with flatness over 0.2 reads recorded. Also
   check the tail: decaying with irregular ripples is natural, a smooth exponential is synthetic. Evidence only;
   say "not verified" unless a human listened.
6. Licence: CC0, public domain, CC BY pass; NC, ND, SA, personal-use or unknown fail. Keep URL+credit.

## Verify
- Every audio claim has a number or a viewed image.
- Spectrogram viewed: no clip ceiling, no click line at edits, no unexpected shelf near 16 kHz.
- Third-party sounds have source and licence recorded.
- Taste statements are labelled "needs human listen".

## Do not
- Describing how audio sounds with no measurement behind it.
- Comparing A and B at different loudness.
- Judging a multi-take or long file from its whole-file average.
- Uploading audio to an outside service, or installing models/tools, without the user's yes.
