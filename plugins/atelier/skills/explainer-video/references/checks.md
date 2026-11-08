# Verify recipes (no special tooling)

Run audio-generating steps one at a time, not in parallel.

## Speech diff
```
whisper-cli -m ggml-base.en.bin -f voice.wav -otxt -of asr     # whisper.cpp
# or: faster-whisper voice.wav --model base > asr.txt
norm(){ tr 'A-Z' 'a-z' < "$1" | tr -c 'a-z0-9\n ' ' ' | tr -s ' ' '\n' | grep .; }
diff <(norm script.txt) <(norm asr.txt)
```
Script text must be what is spoken (apply overrides first). Homophones diff falsely: reword. Low-resource languages: a few misses are normal; compare by sound.

## Contact sheet sized from duration
Aim for one tile per 2 s: `N=ceil(D/2)`, cols 6, rows `ceil(N/6)`.
`ffmpeg -i v.mp4 -vf "fps=1/2,scale=320:-1,tile=6x$(( (N+5)/6 ))" sheet.png`
For a 120 s video that is 60 tiles, 6x10. Split into several sheets if the image gets too large to read.

## Layout pass
1. Edge margin [practice; upstream checks 3.5%]: crop strips and look for ink in them.
   `ffmpeg -i f.png -vf "crop=iw:ih*0.035:0:0" top.png` (also `crop=iw:ih*0.035:0:ih*0.965`, and `crop=iw*0.035:ih:0:0` / `:iw*0.965:0` for sides). Pass: strips are background only (or `signalstats` shows near-flat luma).
2. Overlap and arrows: open the still; every arrow must start and end on a labelled box, and not cross its own label. Pass: you can name the source and target of each arrow.
3. Contrast: crop a text region, `ffmpeg -i crop.png -vf signalstats -f null -` to read min/max luma; ratio from luma values 4.5:1 or better [practice].
4. Captions: nothing important sits in the caption band.
5. Repeat for every output size; narration and timings are shared.

## Small-screen pass
Re-view stills at the player's real width and at a 480-line scale: `ffmpeg -i f.png -vf scale=-2:480 small.png`. Pass: all text readable without zooming [practice]. Upstream's own tool warns below 16 px in its player; treat that as a hint only [upstream tool default].

## File checks
`ebur128` loudness, `blackdetect`, `silencedetect`, voice audible over music (duck music about 10 dB under voice [practice]).
Deliver MP4, SRT, VTT, cover JPG, chapter list.

## Frequent failures
- Arrow targeting something drawn later; arrow crossing its label.
- Wobble from per-frame width/height changes: animate scale.
- Slide transition through a shared diagram: fade or cut.
- Oversized clips exhaust frame cache: trim first.
- Render crash on a loaded machine: fewer parallel pages.
