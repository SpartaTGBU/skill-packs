# Rhythm sheet and sound plan

Used in Stage 3 (rhythm) and Stage 5 (score). Tags: [up] = in MIT huashu-motion (its rhythm
chapter, from its survey of 21 launch films); [practice] = our judgment.

## 1. Choose the route
- Continuous: precise calm brands, mechanisms, a single UI.
- Hybrid (spine plus one or two bursts): most launches.
- Montage: hype, hardware, games.

## 2. Plan event density per four-beat bar
An event is anything new to the eye or ear: a cut, a landing, a camera start or stop, a word, a hit,
an instrument entering.

| Stretch | Events per bar [up] | Purpose |
|---|---|---|
| hook | 2-4 | grab attention |
| build | 2-4, rising | read as climbing |
| stop | 0-1 | near-silent breath before the peak |
| peak | 4-8 | densest stretch, the hero |
| resolve | 1-2, hold at least 1.5 s on the mark [up] | settle on the brand |

A peak only feels big after an almost-empty stop. No stretch runs about two bars without something
new unless it is a planned stop [up]; write the reason for any other.

## 3. Write the rhythm sheet before code
One row per stretch: `stretch | bars | energy 0-10 | events per bar | moves | music`. It passes when:
- the hook lands inside 3 s; a burst exists; the hero sits on the loudest bar;
- the boundary diff between sections shows 2 or more changed attributes [up];
- no row repeats the previous row's moves.

## 4. Build the burst
A burst is a run of short shots on real material around one fixed element (a pinned prompt pill, a
dot, a grid cell).
- Shots shorten, then lock to one-beat cuts, then release into a longer hold. Upstream's measured example: shots of 1.67, 1.37, 1.10, 1.00 s, thirteen one-beat cuts all within 28 ms of the beat, then 1.10 s and 3.04 s [up].
- Test: every cut time must sit within one frame of the beat grid. Use the awk check in SKILL.md Stage 7 check 4 (tested on a generated clip).
- A tick or hit on each cut. Outside bursts, cut on phrases or on information.

## 5. Repair a flat film [practice]
Symptom: every scene about 3 s, one ease, constant music. Fix the structure, not the polish:
1. Tabulate events per bar for each row.
2. Find rows within 1 event of each other.
3. Give the weakest two a burst and a stop.
Pass when the re-tabulated sheet has at least three distinct events-per-bar values and the loudest bar is the hero.

## 6. Score
Workflow:
1. Pick 3-5 sync points (hook, turn, stop, drop, logo) [practice].
2. Pick tempo (100-125 BPM default [up]), convert seconds to beats, choose bar counts that fit.
3. Pick the music world from who uses the product and how fast.
4. Compose a motif, assign roles by register (melody, harmony, pulse, bass, drums).
5. Fit marks to the scene labels; a stretch that must bend more than about 8% means change a bar length instead [up].
6. Measure loudness per stretch against the curve (quiet stop, loudest peak); view a spectrogram.

Starting worlds [practice]: pulse minimalism or techno for dev tools and infrastructure, garage for
consumer phone apps, lo-fi for notes, cinematic for model releases, piano for human or premium,
chiptune for games, ambient for calm. Check: the first 10 s with sound off still match the product's
pace, and the world differs from the previous film's.

Transition sounds [practice]: fill before a section; tape stop or silence plus riser before the
drop; filter sweep or snare roll for builds; short lift at the reveal.

Effects [practice]: match sound to event type (UI tick, move whoosh, title impact, reveal chime,
hard-cut hit); vary repeats (pan, climbing pitch); voice them in the music's world.
