---
disable-model-invocation: true  # skl: on-demand pack skill
name: video-direction
description: >
  Direct and verify short code-rendered videos (HTML/Canvas/SVG/Three.js or Remotion to MP4): decide
  the idea, hook, beat timeline, pacing, continuity, sound plan and on-screen truth, then prove it with
  stills and measurements. Use for "make a 15s video for my app", storyboarding, reviewing or fixing a
  launch film, promo, kinetic-type piece, data story, lyric video, loop or social reel, or when a coded
  video feels slow, out of sync, unreadable or generic. Split rule, direction vs execution: this skill
  decides what and when; atelier:video-composition builds the capture/encode pipeline;
  atelier:video-editing cuts live footage; atelier:ai-video prompts generative models;
  atelier:motion-design is UI/product motion; atelier:math-animation is algorithm and math explainers;
  atelier:explainer-video is teaching-led narration; atelier:launch-film is the product-launch genre
  recipe; if you have a source animation to match go to atelier:animation-reverse-engineering; hand-drawn
  frames go to atelier:2d-animation; a rigged vector character goes to atelier:svg-character-animation;
  generative or algorithmic art motion goes to atelier:art-motion; if the question is only the mix
  go to atelier:audio-review; a single still go to atelier:visual-qa. No forge:* skill applies.
---

# Video direction

Code is the camera: each frame is a pure function of time, captured offline. This skill is the
director layer: what to say, when, and how to prove it. It assumes a render pipeline exists.

## Neighbours (if X, go to Y)

- Need the capture/encode pipeline, SPEC or Remotion setup: `atelier:video-composition`.
- Genre already fixed as product launch: `atelier:launch-film`; teaching-led narration: `atelier:explainer-video`. Unsure of structure, pacing, truth or QA: stay here.
- Cutting recorded footage: `atelier:video-editing`. Prompting a generative pixel model: `atelier:ai-video`.
- Motion inside an interface: `atelier:motion-design`. Algorithm or maths scene: `atelier:math-animation`.
- Frame-by-frame drawn animation: `atelier:2d-animation`. Rigged vector character: `atelier:svg-character-animation`. Generative or algorithmic art in motion: `atelier:art-motion`.
- You have a source video or animation to match: `atelier:animation-reverse-engineering`.
- The only question is the audio mix: `atelier:audio-review`. The only question is one still image: `atelier:visual-qa`.
- forge:*: none applies unless the build is a code project; then use forge process skills for the code only.

References: [workflow](references/workflow.md) (intake, artifacts, fix cards);
[craft numbers](references/craft-numbers.md) (holds, type, easing, levels);
[QA and review](references/qa-and-critic.md) (runnable commands, defect map by stage, three-pass review).

## Start

1. One intake round at most: venue, the single message, duration/aspect/fps, locked copy and its fact source, real assets, music. Gaps get a default plus a logged `DECISION: <choice> because <reason>`. Read back the idea in one sentence.
2. Mode: stakes real and user present means ask (about 6 questions [practice]) and stop once for treatment approval; "just make it" means decide and list decisions at delivery.
3. Answer the decisions below, then work in stages, each ending in an inspectable artifact.
4. You cannot watch or hear the film. Report which claims were measured, which only seen.

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

## Fixing an existing video

1. Run the checks. 2. Translate each note into a mechanism ("cheap" is usually linear timing, flat stage or small type). 3. One fix card per issue ([workflow](references/workflow.md)). 4. Worst three, one per take, structure before surface. 5. Diff decoded frames outside the fix scope against the old render (see QA); never diff two MP4s.

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
