# Motion cost reference

Frame work happens in three stages: layout (geometry), paint (pixels), composite (layer moves).
A property sits at the earliest stage it forces; later stages always follow.

## Which stage a property forces
| Forces | Typical properties | Allowed when |
|---|---|---|
| Layout then paint | width, height, top/left, margin, padding, font-size, grid tracks | one-off, subtree under 50 elements, under ~150ms [practice]; otherwise swap |
| Paint | color, background, border, box-shadow, filter, mask | element under 5% of viewport area, e.g. hover scale [practice] |
| Composite only | transform, opacity | anything, including scroll-linked |

State surface size and duration whenever you keep a layout or paint animation.

## Fixes
```css
/* drawer: height -> clip/translate */
.drawer { transition: height .25s; }                       /* before */
.drawer { transform: translateY(100%); transition: transform .25s; }  /* after */
.drawer[open] { transform: none; }

/* sticky header shrink on scroll: JS scrollY -> scroll timeline */
@supports (animation-timeline: scroll()) {
  .bar { animation: shrink linear both; animation-timeline: scroll(root); animation-range: 0 120px; }
}
@keyframes shrink { to { transform: translateY(-8px) scale(.96); } }
```
FLIP in four lines: measure first rect; apply final layout; measure last rect; set inverse
transform with no transition, then clear it next frame under a transition.

Registered variable (the acceptable case):
```css
@property --tilt { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
.card { transform: rotate(var(--tilt)); transition: --tilt .2s; }
```

## Frame-delta test (no recording needed)
Paste in the console, run the interaction, read the result. It only reads rAF timestamps and touches
no layout-forcing API, so it does not perturb the animation it measures:
```js
const g=[]; let prev, t0;
(function s(now){ if(prev!==undefined) g.push(now-prev); prev=now; t0??=now;
  if(now-t0<2000) requestAnimationFrame(s); else console.log('max gap ms',Math.max(...g).toFixed(1),'frames >25ms',g.filter(v=>v>25).length,'of',g.length); })(performance.now());
```
On a 60 Hz display a healthy run has max gap near 17ms; pass when no gap reaches 33ms (one dropped frame).
Do not add `getBoundingClientRect` or `offsetWidth` reads to this sampler: they force layout and
change the result. This reads main-thread stalls only; compositor animations can still drop frames on
screen, so confirm with the Frames track.

## Profiler steps
1. Performance panel, 4x CPU throttle [practice], record the interaction.
2. Layout or Recalculate Style bars on a transform-only animation mean something else dirties layout.
3. Rendering > Paint flashing, Layer borders: promoted layers are few and element-sized.
4. Main-thread task over 50ms during motion [practice]: split it or move it off-thread.
