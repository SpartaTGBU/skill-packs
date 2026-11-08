# Beat grid and sound placement

## Fit a grid (Python, numpy + librosa; run on your own audio only)

```python
import numpy as np, librosa
y, sr = librosa.load("bgm.mp3", sr=None, mono=True)
_, beats = librosa.beat.beat_track(y=y, sr=sr, units="time", tightness=400)
n = np.arange(len(beats))
period, offset = np.polyfit(n, beats, 1)          # beat k ~ offset + k * period
resid_ms = np.abs(beats - np.polyval([period, offset], n)).max() * 1000
print(f"{60/period:.2f} bpm, first beat {offset:.3f}s, max residual {resid_ms:.1f} ms")
```

Detected beat times are usually good even when the tempo scalar is a few percent off, hence the
line fit. A large residual means tempo changes: fit per section. For dense mixes, separate
percussion first (harmonic/percussive split, or a stem separator) and detect on that.

## Hit classes

Rank onset energy at each whole beat in three bands. The bands are [up]:
about 40 to 160 Hz for kicks, 150 to 500 Hz plus 1 to 3 kHz for snares (want both), 6 to 14 kHz for
hats. Mapping, our wording: the kick list is the candidate pool for the at-most-3 whole-frame
impacts (a pool, not a trigger); snare hits suit swaps and composition changes; hat density sets how
busy small motion may be, dense passages allow it, sparse ones must stay calm.

## Onset script for the cut-error check

```python
import numpy as np, sys
from scipy.io import wavfile
sr, x = wavfile.read("a.wav"); x = x.astype(float)
if x.ndim > 1: x = x.mean(axis=1)   # mono guard
hop = 512
mag = np.abs(np.array([np.fft.rfft(x[i:i+1024]*np.hanning(1024))
                       for i in range(0, len(x)-1024, hop)]))
flux = np.maximum(np.diff(mag, axis=0), 0).sum(1)
pk = np.where((flux > flux.mean()+2*flux.std()) & (flux >= np.roll(flux,1)) & (flux >= np.roll(flux,-1)))[0]
onsets = (pk+1) * hop / sr
cuts = np.array([float(t) for t in sys.argv[1:]])        # pts_time values from ffmpeg
err = [min(abs(onsets - c)) for c in cuts]
print("worst error frames @30fps:", max(err)*30)
```

[practice] An onset is a flux peak above mean + 2 standard deviations; tune the factor 1.5 to 3 by ear. Treat an
onset within 1 frame of an SFX frame as the SFX, not the music. Thresholds are a starting point; if cuts sit on SFX rather than music, restrict to the
BGM-only render.

## SFX search terms by picture action

Name the source, material, attack and tail, not just "click" or "impact".

| Picture | Query shape | Screen for |
|---|---|---|
| card flies in | short soft whoosh | peak position, no long tail |
| paper slide/page | dry paper slide | single real action |
| switch/tap | mechanical switch click | short, physical, not a beep |
| wordmark lands | short cinematic impact | weight without masking the music |
| typing | computer keyboard typing | density, length, floor noise |
| build and afterglow | cinematic riser, subtle shimmer | riser reaches the landing |

Measurement note: a tool that reports 10 ms RMS windows and sample peak is not LUFS or true peak.
For multi-hit or swelling sounds choose the semantic landing point by hand, not the file maximum.

## Audio offset recipe

[practice] Render a sharp SFX at a known frame `f`, pull `a.wav` as in Verify, then:

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import correlate   # fft path; np.correlate is minutes at 5 s
FPS = 30
sr, out = wavfile.read("a.wav"); sr2, src = wavfile.read("sfx.wav")   # same sr, mono
assert sr == sr2 and out.ndim == src.ndim == 1
c = correlate(out[:sr*5].astype(float), src.astype(float), mode="valid", method="fft")
print("lag s:", np.argmax(np.abs(c))/sr - f/FPS)   # positive = audio late
```
