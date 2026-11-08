---
disable-model-invocation: true  # skl: on-demand pack skill
name: audio-review
description: >
  Judge and choose sound without hearing it: measure loudness, true peak and noise floor, list a
  soundtrack's events with times, check sound against picture cues, pick among candidate sounds, A/B
  a mix change, and plan a sparse sound palette for a film or UI. CPU-only, number first. Use when
  generated or edited video/audio needs QA, an SFX or music choice, a mix or loudness check, "does
  the hit land on the cut", or sound design for a launch film, demo or UI.
  Split rule, this skill judges and chooses audio, siblings own everything else:
  render and muxing go to atelier:video-composition;
  cuts to atelier:video-editing;
  generated clips to atelier:ai-video;
  launch picture and story to atelier:launch-film;
  scripts and narration to atelier:explainer-video;
  shot intent to atelier:video-direction;
  UI motion timing to atelier:motion-design;
  frame review to atelier:visual-qa;
  reference timing to atelier:animation-reverse-engineering;
  picture of atelier:art-motion, atelier:2d-animation, atelier:math-animation and
  atelier:svg-character-animation stays with them.
  Coding-process skills (forge:*) are not relevant here.
---

# Audio review

You cannot hear. So no report line may say a sound "fits" or "feels premium" unless a number or
image sits next to it (for example "-14.2 LUFS, -1.3 dBTP" or "hit peaks +12 ms after the cut").
Taste is not measurable: state what the sound is and what it measures, and mark "is it good" as
needing a human listen.

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

## Start
1. Pick one job: A QA a file, B choose among sounds, C A/B a mix, D plan sound for picture, E build a
   sound in code.
2. `command -v ffmpeg ffprobe sox`. ffmpeg alone is enough. A model-based scorer (upstream
   "earshot", https://github.com/Leonxlnx/earshot) is an optional extra, never required or installed unasked.
3. For picture-bound work get cue times from the picture code or a frame list, not by eye
   [practice: typed-in times drift by many frames].
4. Change one thing per round, re-measure, log round and numbers.

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

## C: A/B a mix change
Match integrated loudness first (else the louder wins), render both, compare meters, spectrograms and
event lists, change one variable, report the winner and what numbers cannot tell.

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
- Loudness and peak re-measured on the final encoded file, e.g.
  `ffmpeg -nostats -i out.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -n 20`.
- `ffprobe` shows audio and video durations within 1 frame.
- Per cue offset listed and inside its type's window from A.5, or marked "none" on purpose.
- Spectrogram viewed: no clip ceiling, no click line at edits, no unexpected shelf near 16 kHz.
- Third-party sounds have source and licence recorded.
- Taste statements are labelled "needs human listen".

## Hard bans
- Describing how audio sounds with no measurement behind it.
- Comparing A and B at different loudness.
- Judging a multi-take or long file from its whole-file average.
- Sounding scroll, cursor drift, streaming text or counters mid-roll.
- Effect density: median about 5 per 10 s (upstream, pro launch films); more than about 8 per 10 s
  needs a cue-table justification [practice].
- More than one material family column in the cue table; pitch jitter over 0.5 semitone per take.
- A crash cymbal on the hero hit (check: no cue row names one); a riser whose audible end is over 30 ms after the hit.
- Uploading audio to an outside service, or installing models/tools, without the user's yes.
