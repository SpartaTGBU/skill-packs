---
disable-model-invocation: true  # skl: on-demand pack skill
name: explainer-video
description: >
  Narrated explainer videos and product demos built by an agent: script, synthesized voice, word-level
  timing, drawings cued to spoken words, platform sizes, and a frame-based verify loop before an MP4
  with captions. Use for "make an explainer", "how it works video", voiceover walkthrough, narrated
  tutorial, product demo with a clicking cursor, or a Short/Reel/TikTok that explains something. Not
  for silent promos, trailers, existing footage or generated clips; sibling routing is in Neighbours.
---

# Explainer video

The voice is the clock. Write the narration, synthesize it, measure when each word lands, then draw.
Pictures hang off words or markers, never off typed-in seconds.

## Neighbours

One-line split per sibling:
- `atelier:video-composition`: it renders (seeked page, headless Chromium, ffmpeg) and does silent promos and kinetic type; this skill owns script, timing, content.
- `atelier:launch-film`: narrator teaches a mechanism here; a trailer selling a feeling there.
- `atelier:video-direction`: shot plans for live or edited work there; script-driven drawn scenes here.
- `atelier:video-editing`: footage already exists, there.
- `atelier:ai-video`: any generated clip there; this skill uses drawn scenes.
- `atelier:math-animation`: equations are the content, there.
- `atelier:motion-design`: UI micro-motion with no narration, there.
- `atelier:art-motion`: artful or generative motion with no narration, there.
- `atelier:2d-animation`: hand-drawn frame-by-frame animation, there.
- `atelier:svg-character-animation`: a character rigged in SVG, there.
- `atelier:animation-reverse-engineering`: copying a motion seen on a site, there.
- `atelier:audio-review`: deep mix review, after this skill's Verify.
- `atelier:visual-qa`: judging a finished visual in depth, after Verify.
- `forge:*`: only for code changes to a renderer or tool, not the video.

References: [narration-and-voice](references/narration-and-voice.md), [scenes-and-camera](references/scenes-and-camera.md), [product-demo](references/product-demo.md), [checks](references/checks.md).

## Invoke

1. Pin topic, audience, length, destination, language. Decide look, voice, pace yourself; ask only for a missing fact, paid key, or live footage.
2. List the facts you will use. Test: every number or claim on screen has a source you can name; else cut it.
3. Write the script against the Script checks below. Test: every sentence has a picture change attached.
4. Synthesize and time it. Speech diff ([checks](references/checks.md)) if an ASR is installed, else the no-ASR spot listen. Pass: zero unexplained mismatches.
5. Per scene decide: the one thing to look at, what enters on each cue, what persists.
6. Build scenes; each element enters on a word or marker.
7. Verify, fix, re-check. Draft at half size first, then final.
8. Report paths (video, subtitles, cover), duration, which Verify steps passed, which you skipped.

## Pipeline

Script -> voice per scene -> word times (ASR on finished audio, matched to script) -> speech diff -> scenes as functions of time -> frames by seeking -> mix with music ducked under voice -> MP4 plus SRT/VTT. Cache per scene so one edited sentence redoes one scene. Local open TTS needs no key; cloud voice or your own recording are alternatives. The MIT project `explainroo` implements this pipeline as an optional extra; nothing here requires it. Word timing needs an ASR model (whisper.cpp or faster-whisper, model downloaded once); with none, use the no-ASR fallback in Verify and put cue times by ear.

## Script checks (before any picture)

Tags: [upstream] from the explainroo docs, [practice] common craft knowledge.

- Sentences run 8-18 words [practice]. Test: count; split or merge outliers.
- Cut test [practice]: delete a sentence; if no fact is lost, it stays deleted.
- A term gets its definition in the same or next sentence. Test: scan first uses.
- Every step's subject is something that exists in the scene. Test: point at it.
- Open on the problem; the last sentence states the main point [practice]. Test: read first and last sentence alone.
- At least one scene shows a real input and output you can name. Test: find it; else cut the claim.
- Length: words / 150 per minute = runtime; default target 45-120 s [practice]. Upstream gives about 150 wpm with pauses, about 270 characters/min Japanese, about 200 Chinese [upstream].
- Plain voice-friendly wording [practice]. Test: grep for em dashes, "not X but Y" patterns, filler adverbs, stock openers; reword hits. Em dashes distort TTS pacing.
- Acronyms, versions, domains, symbols have spoken overrides; spell acronyms with commas ("A, P, I"). Test: grep digits and capitals in script.

## Scene checks (while building)

- Visible change at least every 2 s; fail any gap over 4 s [practice]. Upstream suggests 2-4 s [upstream].
- At most 6 elements visible at once [upstream: five or six]. Exit old ones.
- Type at 1080p: titles 80-110 px, labels 40-56, never under 32 [upstream]; scale tall frames from the long side. Test: measure in a still.
- A spoken list shows each item on screen as it is said [practice]. Test: scrub at each item word.
- Screen text is a few words; with captions on, do not also print the spoken sentence [practice]. Test: no on-screen line over 6 words.
- Colors: write a color-to-meaning list, one meaning per color, one accent for the key item [practice]. Test: any color with two meanings fails.
- Final still of each scene shows that scene's key element [practice]. Test: grab the last frame.
- Text contrast 4.5:1 or better [practice]. Test: luma sampling recipe in checks.
- A diagram reused across scenes keeps element positions; join by fade or cut [practice].

## Render checks

Run the Verify section. Nothing in a render should differ between two renders of the same frame.

## Sizes

| Target | Pixels | Source |
|---|---|---|
| Wide / YouTube | 1920x1080 | [practice] |
| Shorts, TikTok, Reels | 1080x1920 | [upstream] presets |
| 4:5 feed | 1080x1350 | [practice] |
| Square | 1080x1080 | [practice] |

- Vertical safe band: keep key content out of the top 15% and bottom 35% (side margins 6-20% by app; use 20% right, 11% left to serve Shorts, TikTok and Reels at once) [upstream, platform templates as of 2026; apps shift]. Test: crop those bands from a still; only background and captions-free ink allowed.

- Vertical and square: captions on [practice]. Title on screen from frame one if it may become the cover [practice].
- `pace` (whole video: voice, pauses, animation): range 0.7-1.6; 1.15-1.3 for social or expert viewers; above 1.4 hard to follow [upstream AGENTS.md]. Voice `speed` is separate; ranges in [narration-and-voice](references/narration-and-voice.md).
- Cue-relative times survive a pace change; fixed seconds do not [upstream].

## Verify

Plain ffmpeg/ffprobe plus a viewer. Recipes in [checks](references/checks.md).

1. Duration: `D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 v.mp4)`.
2. Stills per scene end and busiest moment: `ffmpeg -ss T -i v.mp4 -frames:v 1 f.png`. Pass: nothing cut off, overlapped, or under the 32 px floor; vertical: nothing in the safe-band exclusions.
3. Contact sheet sized from D (formula in checks): every frame at most 2 s apart in the sheet. Pass: no half-empty frame, no step that looks identical across 4 s.
4. Speech check. With ASR: diff recipe in checks, pass when normalized word lists match or each diff is explained. Without ASR: play the audio at two spots (one early, one near the end) against the script text; pass when every word heard matches and cues land on their words.
5. Loudness: `ffmpeg -i v.mp4 -af ebur128 -f null -`; about -16 LUFS for web speech [practice] (upstream default -14).
6. `blackdetect` and `silencedetect` hit nothing unintended.
7. Edge-margin crop test and 480p / player-width re-view (checks).
8. Never upload the draft; never write "checked" for a skipped step.

## Hard bans

Each has a detection test.

- Typed-in seconds where a word or marker exists. Test: change pace or voice; pictures drift off words.
- Whole narration on screen, over 6 elements, text under 32 px at 1080p. Test: Scene checks.
- Invented numbers, customers, quotes, features. Test: name the source of each; none means cut.
- Words rendered inside AI images, unreviewed AI images. Test: view full size.
- Frames that differ between renders (random, time-conditional creation). Test: render the same t twice, `ffmpeg -i a.png -i b.png -lavfi psnr -f null -` must show infinite psnr.
- Printing or committing API keys; sending script text to a cloud voice unknown to the user. Test: grep the repo and logs for key patterns before delivery.
