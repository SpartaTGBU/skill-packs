---
disable-model-invocation: true  # skl: on-demand pack skill
name: visual-qa
description: >
  Check rendered visual output by looking at it: extract frames from video (fixed rate, scene
  changes, thumbnails), build contact sheets, run ffmpeg detectors for black frames, freezes,
  silence and loudness, inspect for artifacts, flicker, text errors, hands, banding, letterbox and
  A/V sync, diff web screenshots against baselines, and write a severity-ranked report. Use when
  asked to QA, review or sanity-check a video, animation, render, generated clip or UI screenshots
  before delivery, or after any render or edit step.
---

# Visual QA

Automated scores are not proof. A checker can report a pass while the output is wrong (zero cuts
detected, a hard cut scored as perfect continuity). Run the detectors, then open the frames and
look. Every finding cites a timestamp or file and an image.

Tools: ffmpeg/ffprobe 6.x+, ImageMagick 7 (`magick`), and for web Playwright or the project's
existing screenshot runner. Work in a scratch `qa/` dir; never write into the source tree.

## 1. Probe

```sh
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,pix_fmt,r_frame_rate,avg_frame_rate,channels:format=duration -of json out.mp4
ffmpeg -v error -i out.mp4 -f null -   # decode errors; silence means clean
```
Confirm against the spec: size, fps (CFR), pix_fmt `yuv420p` for web, duration, audio present.

## 2. Extract frames

| Goal | Command |
|---|---|
| One frame per second | `ffmpeg -i out.mp4 -vf fps=1 qa/f_%04d.png` |
| Dense, short clip (AI shots) | `-vf fps=4` or every frame for clips under 10s |
| Scene changes | `ffmpeg -i out.mp4 -vf "select='gt(scene,0.3)',showinfo" -fps_mode vfr qa/s_%04d.png` (timestamps in the `showinfo` log; lower to 0.2 for soft cuts) |
| Representative frame per chunk | `-vf thumbnail=n=120 -fps_mode vfr qa/t_%03d.png` |
| Exact moment | `ffmpeg -ss 12.48 -i out.mp4 -frames:v 1 qa/at_12.48.png` |
| Around every cut | frames at cut-2f, cut, cut+2f from the scene list or the edit decision list |
| First and last frame | `-frames:v 1` at 0, and `-sseof -0.1 -i out.mp4 -update 1 qa/last.png` |

Use PNG, not JPEG, so compression does not hide or create banding.

## 3. Contact sheets

One image for a whole video, for review and for the report:
```sh
ffmpeg -i out.mp4 -vf "fps=1/2,scale=320:-2,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x5" -frames:v 1 qa/sheet.png
```
Pick the `fps` so frames fit the tile (duration / 30 for a 6x5 sheet); make several sheets for long
files. ImageMagick alternative over extracted frames: `magick montage qa/f_*.png -tile 6x -geometry 320x+4+4 qa/sheet.png`.
Contact sheets show continuity, palette drift and letterbox at a glance; they do not show flicker
or motion faults, so also scrub at full speed and look at frame pairs.

## 4. Detectors

| Problem | Command | Read |
|---|---|---|
| Black frames | `-vf blackdetect=d=0.1:pix_th=0.10 -an -f null -` | `black_start/black_end` lines; allowed only where designed |
| Freezes, stalls | `-vf freezedetect=n=-60dB:d=0.5 -an -f null -` | `freeze_start/duration`; flags stuck renders, dropped source |
| Silence / missing audio | `-af silencedetect=noise=-50dB:d=1 -vn -f null -` | unexpected gaps, silent tail |
| Loudness | `-af ebur128=peak=true -vn -f null -` | integrated LUFS and true peak vs target |
| Clipped/odd levels | `-vf signalstats,metadata=print:file=qa/stats.txt -an -f null -` | YMIN/YMAX out of range, sudden YAVG jumps (flicker) |
| Interlacing | `-vf idet -frames:v 500 -an -f null -` | TFF/BFF counts on progressive delivery |
| Letterbox / bars | `-vf cropdetect=24:2:0 -frames:v 300 -an -f null -` | crop smaller than frame means baked-in bars |
| Duplicate frames | `-vf mpdecimate,showinfo -an -f null -` | many drops mean frame doubling or a 24-to-30 conversion |

Prefix each with `ffmpeg -hide_banner -i out.mp4`. Detectors give candidate timestamps; extract
those frames and look before calling them faults.

## 5. What to look for

- **Generation artifacts**: morphing or melting objects, warped straight lines, texture swimming,
  identity drift, objects appearing or vanishing, physics errors.
- **Hands and faces**: finger count, fused fingers, eyes and teeth, lip-sync to audio.
- **Text**: spelling, names, numbers, dates against the source script; kerning and clipping;
  text inside title-safe area and clear of platform UI on vertical formats.
- **Flicker**: frame-to-frame brightness or texture pulsing; compare consecutive frames and the
  signalstats YAVG curve.
- **Banding**: stepped gradients in skies, vignettes and dark scenes; worse after 8-bit encodes.
  Fix with dithering/grain before encode or a 10-bit master.
- **Letterbox/pillarbox**: unintended bars, wrong aspect, stretched subjects (circles not round).
- **Edges**: green/blue spill on keyed footage, halos, aliasing on thin lines and text.
- **Cuts**: black or flash frames at joins, jump cuts, continuity breaks (wardrobe, props,
  screen direction), audio pops at edits.
- **A/V sync**: lips, claps, impacts and beat-cuts against audio; check start, middle and end,
  since drift grows over time.
- **Color**: shifts between shots, crushed blacks, clipped highlights, wrong range (washed-out
  means full/limited mismatch).
- **Accessibility**: captions present and accurate; no flashing above 3 times per second
  (photosensitive seizure risk); text contrast meets WCAG AA.

## 6. Web screenshot diffing

1. Make screenshots deterministic: fixed viewport and device scale factor, fonts loaded
   (`await document.fonts.ready`), animations and caret disabled, fixed clock and seeded data,
   network idle, dynamic regions (ads, timestamps, avatars) masked.
2. Capture the same set of pages, states (empty, loading, error, long content) and breakpoints
   (e.g. 375, 768, 1280, 1920) as the baseline.
3. Diff:
   - Playwright: `await expect(page).toHaveScreenshot('home.png', { maxDiffPixelRatio: 0.001, animations: 'disabled', mask: [...] })`;
     update baselines only with `--update-snapshots` after a human accepts the change.
   - Without a runner: `magick compare -metric AE -fuzz 2% base.png new.png qa/diff.png`
     (prints the count of changed pixels; the diff image highlights them in red).
4. Review every diff image, not just the number: a small pixel count can be a missing button,
   a large one can be a harmless 1px shift.
For interactive behaviour and exploratory bugs use forge:dogfood-qa; for design critique of the
screens use atelier:ui-review.

## 7. Checklist

- [ ] Probe matches spec (size, fps, pix_fmt, duration, audio); full decode clean
- [ ] Contact sheet reviewed; frames around every cut and title reviewed
- [ ] blackdetect / freezedetect hits all intentional
- [ ] Loudness and true peak on target; no unexpected silence
- [ ] No artifacts, hand/face errors, text errors, banding, unintended bars
- [ ] A/V sync checked at start, middle, end
- [ ] Captions present and correct; no hazardous flashing
- [ ] Web: screenshot diffs reviewed at all breakpoints and states

## 8. Report format

```
Visual QA: <file or URL>   <date>   verdict: PASS | PASS WITH NOTES | FAIL
Spec check: 1920x1080 30fps yuv420p 62.0s, -14.1 LUFS / -1.3 dBTP  (OK | mismatch: ...)
Findings:
  P0 00:12.4  black frame at cut 3 (blackdetect 0.07s)        qa/at_12.40.png
  P1 00:31.0  "Recieve" misspelled in lower third              qa/at_31.00.png
  P2 00:44-00:47  banding in sky gradient                      qa/f_0045.png
Not checked: <what and why>
Artifacts: qa/sheet.png, qa/detectors.txt
```
P0 blocks delivery (broken, wrong, unsafe, legal/consent issue), P1 visible to most viewers, fix
before release, P2 polish. List what was not checked rather than implying full coverage. Hand
fixes back to atelier:video-editing, atelier:video-composition or atelier:ai-video, re-run QA on
the new render, then forge:verification.
