# Measure and compare: working notes

Read at Stages 3-6 of SKILL.md. Tags: [up] = figure also in MIT reanimate (0.08 s, 0.04 s, 10%, 2%,
5%, 0.5% at rest frames, up to 5 rounds, the overshoot-damping relation, ~10% overshoot ~ zeta 0.59);
[practice] = our judgment, a starting guess that measurement overrides. Text with no tag is method.

## A. What each spec row needs
One row per element and property. Fields: trigger, from, to, start, duration, easing, stagger, number
source. Put capture facts (viewport, fps, crop, steps) once above the rows; keep rest boxes, z-order,
clipping and transform origin in a separate static list. Record the source of each number, best
first: declared in the page, sampled per frame, estimated from frames only.

## B. Get each number from the best source
| Source | What you read | How |
|---|---|---|
| declared | delay, duration, easing, iterations | running animations and `@keyframes` on the page |
| sampled | delay, visible duration, overshoot, best-fit named easing | per-frame values (recipe V5) |
| canvas | the kind of each animated value: clock, transition, there-and-back, oscillation, steps | log values per frame |
| frames only | first and last changing frame per element | contact sheet plus the easing test below |

Frames-only easing test [practice], on the middle of the move: more than half the travel done in the
first third of the time is ease-out; under a quarter is ease-in; symmetric is ease-in-out; equal
increments is linear; passing the end value and returning is back or spring. Overshoot above 2% of
travel means spring or back [practice]: record overshoot % and settle time. For stagger, list gaps
between sibling start times and classify them as constant, growing, or per character or word.

## C. Priors, only to know what to look for first [practice]
A measurement always beats these.
- Pointer follow: fit k in `x += (target - x) * k`. Frame-rate independent: `x += (target - x) * (1 - (1 - k) ** (dt / 16.67))`.
- Marquee: duplicated row, linear; measure the period over 2 loops.
- Loader pulse: oscillation; measure period and easing.
- Scroll-linked or parallax: value keyed to scroll px; layer speed ratio from two samples.
- Clip reveal: an inset edge moves, no fade.
- Hover lift or menu scale-in: a few px, scale near 0.9 to 1, roughly 100-200 ms. Far outside that: re-check crop and fps.
- Staggered entrance or text reveal: travel 10-60 px, per-item step 20-100 ms.

## D. Turn a measured curve into code
Reference curves [practice]: ease-out expo `cubic-bezier(0.16,1,0.3,1)`; ease-in-out cubic
`cubic-bezier(0.65,0,0.35,1)`; back-style needs a y control above 1, e.g. `cubic-bezier(0.34,1.56,0.64,1)`.
Fit by sampling and comparing, never by guessing a name. Framer Motion takes the same four numbers.
A spring becomes CSS `linear()` sampled from the curve, or a spring type with stiffness and damping.

Spring from measurements. Relation [up]: overshoot = exp(-pi z / sqrt(1 - z^2)); stiffness
k = w^2 for mass 1; damping c = 2 z w. Worked example (computed and checked in Python; settle
approximation [practice]): measured 10% overshoot, settle 0.6 s.
1. Solve for z: 0.59.
2. Settle ~ 4 / (z w), so w = 4 / (0.59 * 0.6) = 11.3.
3. k = w^2 = 128; c = 2 * 0.59 * 11.3 = 13.3.
4. Render, sample, compare overshoot and settle against the spec; change damping first.

## E. Trigger code
- Enter viewport: observer threshold = fraction of the element visible when the reference starts moving (its y at the first moving sample over viewport height). Framer `whileInView` with `once` and `amount`; CSS `animation-timeline: view()` plus `animation-range` where supported.
- Scroll-linked: CSS `animation-timeline: scroll()`, GSAP ScrollTrigger `scrub`, Framer `useScroll` + `useTransform`.
- Line reveal [practice]: clip each line in an `overflow: hidden` box and slide its inner span from `translateY(100%)` (or a little more) to 0. Keep the text readable to assistive tech, for example one visually hidden copy.

## F. A check failed: what to try, by symptom [practice]
| Symptom | Likely cause | First change |
|---|---|---|
| whole curve shifted | trigger latency or missing delay | add or remove delay |
| early start and late end | delay and duration both wrong | fix together |
| front-loaded, short | easing too steep, or duration read from the visible window only | re-read duration, soften easing |
| flat where reference is spiky | wrong easing family | refit family |
| reference passes its end value | needs spring or back curve, not bezier within 0..1 | spring or y control above 1 |
| sibling gaps off | stagger formula | `delay = base + index * step`; check order |
| mismatch at rest | layout, font fallback or crop | fix those before timing |
| only last frames differ | no fill-forwards, or end value rounding | fill-mode forwards, exact end value |
| clone moves while reference is still | stray transition or hover from a parked cursor | remove; park cursor away |
| scroll effect early or late | threshold or rootMargin | adjust |
| canvas colour or edges differ | colour space, pixel ratio, antialias, alpha | match renderer settings |
| canvas steppier or smoother | draws per frame or lag rate differ | match them |
