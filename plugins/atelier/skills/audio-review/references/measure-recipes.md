# Measurement recipes (ffmpeg / sox, CPU-only)

Use absolute paths. Replace `in.mp4` with any file ffmpeg can read.

## Probe
- `ffprobe -v error -show_entries stream=codec_type,codec_name,sample_rate,channels,duration -of default=nw=1 in.mp4`
- Audio and video durations should match within one frame.

## Loudness, true peak, LRA
- `ffmpeg -nostats -i in.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -n 20`
  Read the Summary block: Integrated (LUFS), LRA (LU), True peak (dBFS).
- Momentary/short-term over time: same filter, read the per-line `M:` and `S:` values; plot or table them
  to find the loudest moment and check it sits on the hero beat.
- Normalise for delivery (two-pass is better, one-pass is fine for a draft):
  `ffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11 out.wav`
  (LRA=11 is ffmpeg's default; set it lower only if the arc needs it [practice].)

## Peaks, clipping, noise floor
- `ffmpeg -i in.wav -af astats=metadata=1:reset=0 -f null - 2>&1 | grep -E "Peak level|RMS level|Flat factor|Peak count|Noise floor"`
  Flat factor or Peak count above 0 on the max level means clipping.
- Noise floor between events: trim a silent stretch (`-ss -t`) and read its RMS level.

## Silence and gaps
- `ffmpeg -i in.wav -af silencedetect=noise=-50dB:d=0.3 -f null - 2>&1 | grep silence_`
  Use it to find silence where a cue needs sound, and to confirm the tail ends in silence.

## Onsets (event list)
Plain ffmpeg metadata is emitted per audio frame, so use a short script on 10 ms windows instead
(tested on a synthetic 0.3 s tone; save as `onsets.py`, run `python3 -I onsets.py in.wav`; convert
other formats first with `ffmpeg -i in.mp4 -ac 1 -ar 48000 in.wav`):

```python
import sys, wave, array, math, statistics as st
w = wave.open(sys.argv[1]); ch = w.getnchannels(); r = w.getframerate()
s = array.array('h', w.readframes(w.getnframes()))[::ch]   # 16-bit PCM
h = r // 100
db = [20*math.log10(max(1e-5, math.sqrt(sum(x*x for x in s[i:i+h])/h)/32768))
      for i in range(0, len(s)-h, h)]
last = -99
for i in range(5, len(db)):
    if db[i] - st.median(db[i-5:i]) >= 6 and i - last > 10:
        print(f"{i/100:.2f}s {db[i]:.1f} dB"); last = i
```
[practice] An onset is a window 6+ dB over the median of the previous 50 ms, at least 100 ms apart.
Subtract the picture event time for the sync offset.

## Pictures to open with the image reader
- Spectrogram (log frequency): `ffmpeg -i in.wav -lavfi showspectrumpic=s=1200x400:scale=log:legend=1 spec.png`
- Waveform: `ffmpeg -i in.wav -lavfi showwavespic=s=1200x240 wave.png`
- Zoom a window: add `-ss 12.0 -t 3.0` before `-i`.
- What to look for: a flat ceiling in the waveform (clip), a hard shelf near 16 kHz [practice] (lossy source),
  a steady horizontal band (hum or hiss), a vertical line with no decay (click), a hit that is offset
  from the cut.

## Trim, level-match, mux
- Trim: `ffmpeg -ss 1.217 -to 1.615 -i src.wav -c copy trim.wav` (re-encode instead for sample accuracy).
- Short fades on a trim: `-af afade=t=in:d=0.003,afade=t=out:st=<end-0.01>:d=0.01`.
- Replace a film's audio without re-encoding picture: `ffmpeg -i film.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4`.
- Resample-based pitch shift of a one-shot: `asetrate=48000*2^(n/12),aresample=48000` (n in semitones, keep within +-2).

## Optional model tools (only if the user already has them)
Text-audio similarity and tagging models can rank candidates by a description and tag events, but
their output is one model's opinion: prefer measurements, quote the number, and cross-check with the
spectrogram.
