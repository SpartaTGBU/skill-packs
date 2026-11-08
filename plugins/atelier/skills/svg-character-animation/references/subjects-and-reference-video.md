# Subject idles, reference video, platforms

Units are drawing units and ms. Each figure is tagged [up] (appears in upstream) or [practice]. Choose the mechanism first, then the subject.

## Idle by mechanism
**Endless linear or wave loops**
- Rotating things (gears by tooth ratio, wheels, sun rays): constant speed, no easing [practice]. Rays turn once per 30-60 s [up].
- Drifting layers (clouds): parallax on 20-60 s loops [up].
- Flickers (flame, candle): lean 2-4 deg plus 3-6% stretch on two waves near 700 and 1100 ms [up]; inner flame on a third wave; no random jitter [practice].
- Surface motion (cloth, flag, water): offset each point by `wave(t, period, k*i)`, amplitude growing away from the fixed edge [practice]; ripples grow then fade; floaters bob 1-2 units and rock about 2 deg [up].
- Glows and twinkles: glow grows 2-5% over 2-4 s [up]; stars twinkle at seeded times [practice].
- Bobbing vehicles: 0.5-1 unit with wheels linear and parallax scenery; the frame never shakes [up].

**Falling or rising per item**
- Rain, snow, leaves: seeded `loop` per item, speed +-20%, linear; snow sways on a slow wave [up].
- Smoke and steam: 2-3 wisps out of phase, rising 8-14 units, faded by `bell` [up].

**Bursts and steps**
- Tap-waiting object (box, gift): jiggle squash 1.5-3% on 200-350 ms cadence, alternating sides, paused during the tap [practice].
- Phone buzz: +-3 deg, about 4 cycles in 0.45 s, then a pause [up].
- Clock hand: one step per second with ease-out [practice].

**One-shots**
- Icon, logo: play once on appear, then rest; press feedback is 0.97 scale on the button, not in the art [practice].
- Chart: strokes draw on by dash offset, bars grow from base with ease-out at 40-80 ms stagger, numbers count up; final frame equals the data [practice].
- Floating figure: see acting reference.

## Interface timing (for chrome around the art)
Frequency sets budget: constant actions get no animation, frequent ones minimal, occasional ones a standard transition, rare moments (onboarding, rewards) full delight. Typical durations [practice]: press 100-160 ms, tooltip 125-200, menu 150-250, sheet 200-500. Interruptions continue from the current value. Everything deeper belongs to `atelier:motion-design`.

## Working from a reference clip
Use ffmpeg/ffprobe you have; never run scripts from a reference repo. For a full analysis workflow use `atelier:animation-reverse-engineering`.
1. `ffprobe -v error -show_entries stream=r_frame_rate,duration -of csv=p=0 clip.mp4`.
2. Crop to the subject and tile a sheet: full frame rate shows timing and follow-through, 2 fps shows only poses.
3. Measure rather than eyeball: track the subject's top/left/right edges by colour (a script of your own over PNG frames), and report amplitude as a percent of subject size plus period. Motion of 1-5% is invisible on sheets but carries the aliveness.
4. Record beats as start/end ms data. Go part by part; a part idle while others move reads dead.
5. Compare proportions as ratios of one unit (head widths).
6. Compare yours: render at the same moments, `ffmpeg -i ref.mp4 -i mine.mp4 -filter_complex vstack out.mp4`, measure both the same way.
7. Published work needs original art.

Offline render: frames to PNG (SwiftUI `ImageRenderer` or headless browser), then `ffmpeg -framerate 60 -i frames/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20 out.mp4`; crop by true pixel size. For social export render at 2x, downscale with lanczos, check current platform limits.

## Platform mapping
- Loop clock: RN Reanimated `withRepeat`; SwiftUI `TimelineView(.animation)`; web rAF modulo period.
- Drawing: RN react-native-svg groups with `useAnimatedProps`; SwiftUI `Canvas`/`GraphicsContext`; web SVG attrs or CSS transforms on groups.
- Reduced motion: RN `useReducedMotion()`; SwiftUI `accessibilityReduceMotion`; web `prefers-reduced-motion`.
- Curves: RN `Easing.bezierFn`; SwiftUI `UnitCurve.bezier`; web `cubic-bezier(...)`.
