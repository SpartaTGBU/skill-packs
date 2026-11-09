---
disable-model-invocation: true  # skl: on-demand pack skill
name: video-direction-plan
description: "Plan a short code-rendered video: answer the director's questions (idea, words, clock, reads, seams, pace, register, accent, hook sizes, peak, easing, sound, truth), run the treatment, timeline, look proof, build, sound, render and critic gates, keep the time-only build contract, and brief another agent with real values. Use when making or storyboarding a new coded video. Slice of atelier:video-direction."
---

Slice of atelier:video-direction (decisions, stages and gates, build contract, briefing another agent). Siblings: atelier:video-direction, atelier:video-direction-fix.

References: [workflow](../video-direction/references/workflow.md) (intake, artifacts, fix cards);
[craft numbers](../video-direction/references/craft-numbers.md) (holds, type, easing, levels);
[QA and review](../video-direction/references/qa-and-critic.md) (runnable commands, defect map by stage, three-pass review).

## Decisions, grouped by the question

**What is it and who is it for?**
- Idea: one sentence a muted viewer could restate from frames. Test: show three frames to someone (or a fresh reviewer) and compare their sentence.
- Words: pick 1-3 searchable terms (subject name plus the field's standard word for each key property); each is spoken and shown for its read time right after the intuition it names. The subject name is in the hook.
- Avoid the default: write three beat sheets and keep the least obvious. Test: put the kept sheet beside the first one you thought of (or the user's last film) and name 2 concrete differences, one of them in the opening or the ending [practice].

**What drives timing?**
- Clock: music grid, measured voice words, or read time. Test: pick five reveals; each must name its cue. Silent autoplay means picture and type carry everything.
- Voice-led: render VO first and use measured word times. Music-led: fit the beat grid first. Neither: choose tempo and whole bars; loops are whole bars.
- Reads: list what must be understood, in order. One read at a time, text still while read; hold times in the craft-numbers table. Rushing is the usual complaint, so cut words before cutting holds; a line that fails its table time is a defect, not a taste call.

**How does it connect?**
- Spatial subject: one continuous journey. List: cuts, each shot complete on frame 1. Transformation: morph chain with at most one hard cut, saved for the payoff.
- Every seam has a sayable cause (next step, match, morph, scale-through, callback). Adjacent shots must not repeat a camera move. No stock wipes or crossfades.
- Pace: one acceleration (each interval at most 60% of the last, floor 3 frames [practice]) then one breath of about 0.5 s; new information every 2-4 s. Test: longest cut interval / shortest >= 2 [practice], else it is one even speed.

**What does it look and feel like?**
- Register (clean 60 fps, handmade 24 fps on twos, editorial 24-30, kinetic 30-60) fixes fps, spring damping, texture, density (craft-numbers table). Test: list fps, damping, grain, hold length and check each against its row; a mismatch needs a logged reason.
- One accent hue, and its meaning written as a single phrase in TREATMENT.md (for example "the thing you act on"). Test: every use of the accent matches that phrase and a palette sample shows 1 saturated hue; a second one needs a DECISION. Tinted dark instead of #000, no large #fff [practice].
- Key subject >= 1/3 of frame height [practice]. Text clear of platform UI. Measure rendered pixels after scale.
- Hook: frame 0 is a finished poster. By 3.0 s the subject in the audience's words and any CTA are fully visible, hook >= 84 px, CTA/key terms >= 48 px at 1080 short side, contrast >= 7:1 against what is actually behind. Test: first-3 s contact sheet alone says what it is and what to do.

**Where does the peak go?**
- One hero thing held stable; one peak at about 60-90% of runtime carrying the film's single native trick; ending answers the opening. Express change as a number per beat, not a mood.
- Each reveal completes, then a still read. At most two cues per beat [practice]; only the hero idles during holds.

**How does motion feel?**
- Entrances ease out hard; state changes ease in-out; exits ease in and run shorter than the entrance (about half); linear only for drift.
- Parts of one object offset by 2-4 frames; one visible overshoot per move. Defect to hunt: every part on one curve.
- Anticipation must be visible in delivered pixels: wind-up of 20 px or more at 1080 short side [practice]; smaller vanishes after encode.

**What does sound do?**
- Accent, do not narrate: about half the cuts stay silent. Align by measured peak, not file start. Real silence (0.4-4 s, 15-35 dB drop) before the payoff, loudest moment on it, density thinned just before. Levels in craft-numbers.

**What is true?**
- Every number maps to a FACTS.md row (claim, source, quoted wording) and is no stronger than the source. Timing is not cause; unfinished periods say "to date". Label illustrative visuals. A counter stops on its caption's value before any label states it. Capture real UI; show the action, never a caption claiming it; no logos except supplied files.

## Stages and gates

| Stage | You produce | Passes when |
|---|---|---|
| Treatment | idea, hook copy, terms, benchmark, chosen structure, beats, sound plan, FACTS.md | approved or DECISIONs logged |
| Timeline | one `timeline.json` of named beats in seconds | no gaps, nothing outside the film, hero not early |
| Look proof | 2-4 full-size stills of the most different beats | hook, accent, size tests pass |
| Build | shot by shot, stills per shot, strips across seams | two renders pixel-identical |
| Sound | score, SFX, VO placed from the timeline | measured on the final mix |
| Render | low-res draft, then master | checks pass or each failure explained |
| Critic | fresh reviewer, one fix round, one re-check | no must-fix left |

Under about 20 s you may merge treatment, timeline and look proof in one message; stills before render and measurement after remain.

## Build contract

- Time is the only input: no `Date.now()`, timers, CSS transitions, carried state; seeded random; simulations precomputed from `t`; seekable libraries only. Test: render a frame twice, then out of order; pixels match.
- One timeline file drives picture, sound, captions and checks; components cite named beats.
- HTML pages expose `DUR`, `FPS`, `seek(t)`, a `READY` promise; await fonts before frame 0; abort on console errors. Engine details: `atelier:video-composition`.

## Briefing another agent

Real values, never adjectives: "0.6 s ease-out, 64 px", not "smooth and big". Sections: inputs, direction (idea, dials, hook sizes, terms, bans), beats as `t | what | read | cue | transition | sound | guard`, truth, build, checks, where to stop. Put each ban beside the beat that tempts it.

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
- Copying a benchmark film's structure; adjectives as acceptance criteria.
- Invented UI or stats; placeholder text ("Acme", lorem) in a deliverable.
- Requiring any third-party QA script; they are optional extras only.
