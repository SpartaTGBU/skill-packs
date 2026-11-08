# Sound grammar (what to sound, where, how loud)

Tags: (up) = reported by the upstream earshot project from pro launch films, a typical range not a law;
[practice] = common craft knowledge, not upstream-checked.

## Principles
- A sound needs a visible cause and loudness in proportion to it. Test: name the frame that causes it.
- One palette: one click voice, one keyboard, one music track [practice].
- Density: upstream measured a median of about 5 designed effects per 10 s on pro launch films, clustered
  where the music is sparse. That is a reference point for your film, not a general rule.
- Upstream measured about 85% of hard cuts in those films as carrying no sound of their own.

## Cue decisions, by how to decide
Ask in this order; the first yes settles it.

1. Is the motion continuous or ambient (hover, scroll, drift, progress, streaming text, a counter rolling)?
   Give it nothing; the music covers it. Check: no cue row for it.
2. Is it a plain cut with no event on the frame? Nothing. Add a sound only if a rule below names the event.
3. Is there a physical contact frame?
   - Click or tap: one voice for the whole film, placed 10-30 ms before the visible press [practice];
     check energy above 3 kHz and a 20 dB decay inside 10 ms [practice].
   - Toggle or lock: latch click on the contact frame, within 1 frame [practice].
   - Typing: sliced real keys, at most 12 keys/s; above about 25 characters/s sound per word or not at all.
     Takes vary by level, not pitch [practice].
4. Does a UI element appear? Short soft pop at the middle of its travel; level +2 to +9 dB over the
   music for word-like pops (up). A counter finishing gets a single tick on the final value, about 8 dB under
   the music (up).
5. Does the camera move fast? Whoosh with its apex on the velocity peak, starting 100-450 ms before (up);
   two per film is the upstream norm.
6. Is tension building to a reveal? Riser ending 30-250 ms before the hit or on it (up); no crash cymbal.
7. Is it the hero beat? Music drop on that frame plus at most one impact layer; this must be the loudest
   point (see the QA targets).
8. Is it the logo? Music stops or filters down, 0.2-0.7 s near-silence, one soft resolved note 8-20 dB under
   the film's peak, tail under -60 dBFS (up).

## Sync
- Align by attack for hits, clicks, keys; by peak for whooshes; by end for risers; by start for beds.
- Windows (up): hits, clicks, keys attack at most 45 ms early and peak at most 75 ms late; whoosh apex within +-45 ms; riser audible end 250 ms before to 30 ms after. A slow-attack sample can pass on its first
  transient yet peak late: check both.
- If misaligned, move the picture to the beat rather than moving the sound off its cause [practice].

## Music
- Practice defaults: one licensed instrumental, 110-130 BPM (or half-time), clear sections: intro, groove,
  break at 40-80% of runtime, drop on the hero frame, resolve on the logo [practice].
- Cut on downbeats (at 120 BPM a 4/4 bar is 2 s) [practice]; keep harmony across a splice; stretch only
  if tempo is off, by at most about 6% (up).
- Beat trackers lag real attacks by about 20-50 ms (up), and low-confidence grids can sit half a bar off
  (upstream saw one case): confirm the downbeat from section entrances and shift the grid onto measured attacks.
- Tune pitched elements to the track's key by resampling within +-2 semitones (up).

## Mix
- Master: -14 LUFS, at most -1 dBTP after encode, LRA 5-9 (up). Intro may sit 5-12 LU under the body (up).
- Effect spectral centroid at or below about 6.5 kHz; avoid ping sounds at 9-14 kHz, they tire on phone
  speakers (up).
- Do not let 2-6 kHz effects exceed the music's own peak in that band (up).
- A layer that adds nothing measurable in its band is deleted [practice].

## Variation
Pool of 4+ takes, no immediate repeat, jitter +-1-2 dB and at most +-0.5 semitone [practice]; pitch ramps
across a run of pops are fine; the UI click is the exception.
