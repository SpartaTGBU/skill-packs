---
disable-model-invocation: true  # skl: on-demand pack skill
name: audio-review-design
description: "Plan a sparse sound palette for picture, or synthesize a sound in code: material family, music arc, silent parts, a cue table with a sound or 'none' per cue, alignment to contact frames, levels against the bed, take pools, panning; physics-modelled synthesis checked against a real reference. Use for sound design of a launch film, demo or UI, or when a sound must be made in code. Slice of atelier:audio-review."
---

Slice of atelier:audio-review (plan sound for picture, make a sound in code). Siblings: atelier:audio-review, atelier:audio-review-qa, atelier:audio-review-choose.

References: [sound-grammar.md](../audio-review/references/sound-grammar.md) (what to sound, placement, music, mix),
[measure-recipes.md](../audio-review/references/measure-recipes.md) (ffmpeg/sox commands).

## D: plan sound for picture
1. Brief: one material family, music arc, silent parts, a cue table where each cue gets a sound or
   an explicit "none", delivery target, licence rule.
2. Decide per cue with the grammar file. Default for continuous motion and most plain cuts: none.
3. Alignment: contact frame for hits and clicks, velocity peak for whooshes, riser end 30-250 ms
   before or on the hit, bed start at scene start.
4. Level against the music bed: effect at least 3 dB above the bed in its own band (upstream); test
   by band-passing both (`bandpass`) and comparing RMS. Dip music under a hit or swell and restore, not under every effect.
5. Repeats: pool of 4+ takes, no take twice in a row, jitter +-1-2 dB; the UI click stays one voice.
6. Effects mono and centred (pan within +-0.15); wide only for whooshes, risers, ambience, music;
   below about 120 Hz mono.

## E: make a sound in code
Only when synthesis is wanted. Model physics: decaying sine partials (struck body), filtered noise
burst (contact, air), swept band filter (whoosh), short comb or convolution (room), low noise floor.
Render 48 kHz, measure, view spectrogram, compare to a real reference, restructure what is wrong.
If a scorer picks the winner, you optimised the scorer: also require measured closeness to the
reference (balance, tail, length) and a blind level-matched human A/B before saying "as good as real".

## Verify
- Every audio claim has a number or a viewed image.
- Per cue offset listed and inside its type's window from atelier:audio-review-qa A.5, or marked "none" on purpose.
- Spectrogram viewed: no clip ceiling, no click line at edits, no unexpected shelf near 16 kHz.
- Third-party sounds have source and licence recorded.
- Taste statements are labelled "needs human listen".

## Do not
- Describing how audio sounds with no measurement behind it.
- Sounding scroll, cursor drift, streaming text or counters mid-roll.
- Effect density: median about 5 per 10 s (upstream, pro launch films); more than about 8 per 10 s
  needs a cue-table justification [practice].
- More than one material family column in the cue table; pitch jitter over 0.5 semitone per take.
- A crash cymbal on the hero hit (check: no cue row names one); a riser whose audible end is over 30 ms after the hit.
- Uploading audio to an outside service, or installing models/tools, without the user's yes.
