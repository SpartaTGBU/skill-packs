# QA and critic

Automated checks find broken, not bad. Run them first. Everything uses ffmpeg, ffprobe,
ImageMagick and a browser. `$V` is the video, `$FPS` its frame rate.

## 1. Runnable checks

Spec: `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,avg_frame_rate,duration -of default=nw=1 $V` (rates must agree; duration within 2 frames of plan).

Loudness and peak: `ffmpeg -i $V -af ebur128=peak=true -f null - 2>&1 | tail -15` (integrated -14 +/-1 LUFS, true peak <= -1 dBTP, -1.5 to -2 before AAC).

Silence map: `ffmpeg -i $V -af silencedetect=n=-50dB:d=0.4 -f null - 2>&1 | grep silence_` (a gap should precede the payoff).

Cuts: `ffmpeg -i $V -vf "select='gt(scene,0.4)',showinfo" -an -f null - 2>&1 | grep -o 'pts_time:[0-9.]*'` and compare with timeline within 1 frame.

Frozen runs and blanks: `ffmpeg -i $V -vf "freezedetect=n=-60dB:d=0.5,blackdetect=d=0.04" -an -f null - 2>&1 | grep -E 'freeze_|black_'`; each freeze must be a designed hold.

Pops and flashes: `ffmpeg -i $V -vf "tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG" -an -f null - 2>&1 | grep YAVG`; a value over 3x both neighbours [practice] is a pop. Flash: frames n-1 and n+1 match but n differs.

Audio onsets: `ffmpeg -i $V -af "highpass=f=200,astats=metadata=1:reset=1:length=0.02,ametadata=print:key=lavfi.astats.Overall.Peak_level:file=-" -vn -f null -`; rises of 10+ dB between consecutive 20 ms windows are hits [practice]; compare their times with picture hits (1.5 frames ideal, 3 pass).

Determinism: render twice, extract with `ffmpeg -i a.mp4 a_%04d.png` and `b_%04d.png`, then `compare -metric AE a_0042.png b_0042.png null:` must print 0. Out of order: seek the page to t=2 then t=1 then t=2 again and screenshot both t=2 frames; they must match. Forward vs reversed: render frames 0..N and N..0 and compare same-time pairs.

Contrast: `magick frame.png -crop WxH+X+Y -resize 1x1 -format '%[fx:luminance]' info:` on the text box and on a background-only box, then ratio = (L1+0.05)/(L2+0.05) with L1 the lighter; need 7 (hook) or 4.5.

Text height: `magick frame.png -crop WxH+X+Y -trim -format '%h' info:` on cap height region gives rendered px.

Palette count: `magick frame.png -resize 100x100 -colors 8 -unique-colors txt:` then count saturated hues (target 1 accent; an illustrated world may carry 3-5 named colours).

Phone sheet: `ffmpeg -i $V -vf "fps=1,scale=360:-1,tile=6x" -frames:v 1 sheet.png`; read every string.

Loop seam: `ffmpeg -i $V -vf "select='eq(n,0)+eq(n,LAST)'" -vsync 0 s_%d.png`; `compare -metric RMSE s_1.png s_2.png null:` should be no larger than two typical frame-to-frame steps [practice].

Revision scope: extract frames of old and new to PNG, `compare -metric AE` for every frame outside the fix timecodes; all 0. Never compare MP4 files.

Leaks: grep source for `Acme|lorem|Your headline|TODO|debug`. Voice: transcribe the mix and match the script. Facts: strip across each counter, check against FACTS.md.

## 2. Visual review sheets
A frame 0.3 s after each beat (still-moving text means a short hold); overview at 1-2 fps; strips every 0.1-0.2 s over each seam and fast move; first and last 0.5 s of each shot; a few full-size stills. Review in separate passes (sync, motion with audio off, then one cold read asking what you remember). The user is never the first viewer.

## 3. Symptom to cause (by stage)

| Stage | Symptom | Likely cause | Fix |
|---|---|---|---|
| Plan | idea clear only at the end | promise saved for the hero | promise and CTA before 3 s |
| Plan | subject never named | term avoided | say and show it after its intuition |
| Plan | resembles earlier film | structure reused | rewrite opening and ending first |
| Timing | feels rushed | holds below the table | lengthen holds, cut words |
| Timing | events arrive for no reason | no cue | bind to beat, word or read |
| Timing | one speed throughout | evenly spaced cuts | add acceleration plus breath |
| Timing | hits early/late | aligned to file start | align by measured peak plus constant offset |
| Timing | flat payoff | no silence before | 0.4-4 s drop, thin density first |
| Motion | looks cheap | linear, opacity-only, small type | role easing with travel, bigger type |
| Motion | churn, nothing lands | endless loops | bound every move; only hero idles |
| Motion | text collides in a swap | shared window | early short exit, then entrance |
| Motion | click missed | camera moving at click | settle camera first |
| Render | shimmer | unseeded random, carried state | seed, derive from t |
| Render | blank at seam | negative local time | clamp; next scene enters moving |
| Render | muddy morph | saturated blend | via neutral |
| Render | loop stutter | speed jump at seam | wrap time, match velocity |

Template look to refuse unless briefed: centred title on gradient, scene-number chrome, tiny
subject in empty frame, glow/particle/rainbow gradient, default font, emoji art, placeholder names,
a whoosh on every cut, stock piano-strings, slow logo opener, crossfades. Test: count how many
appear; more than one means redo the opening.

## 4. Fresh-eyes review
A reviewer who never saw the build gets the file or sheets (with the first-3 s sheet), brief,
timeline and FACTS.md; anything missing is "unverifiable". Run three passes and ask for different
output each time.
1. Cold pass, sound off: write the message you took from the frames. Mismatch with the idea sentence is a P0.
2. Mechanics pass: list defects as time, symptom, probable cause, measurable fix, tagged P0 (breaks message or truth), P1 (visible flaw), P2 (polish).
3. Sound pass: do hits sit on the picture, is the payoff loudest, is there a drop before it.
Ship when no P0 remains and each P1 has a fix or a logged reason. Fix once, re-check once, and
keep a revision only if side-by-side beats the old; leave shots with no listed defect alone.
