---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-engineering-polish-perf
description: "Rendering-cost and layout-stability fixes for existing UI code, by symptom with a test per rule: layout-property animation, scroll handlers, forced reflow, off-screen loops, blur cost, will-change, one writer per property, dvh and safe areas, z-index tokens, tabular numbers, skeleton fidelity, Tailwind and React hygiene. Use when it janks on scroll, animation stutters, the mobile viewport jumps, layers fight or layout shifts. Slice of atelier:ui-engineering-polish."
---

Slice of atelier:ui-engineering-polish (sections D-E: jank and animation cost, viewport, stacking, layout shift, code hygiene). Siblings: atelier:ui-engineering-polish-a11y.

Source key: `[WCAG]` = WCAG 2.2 criterion; `[ui-skills/fixing-accessibility]`, `[ui-skills/fixing-motion-performance]` and
`[ui-skills/baseline-ui]` = idea taken from that skill in github.com/ibelick/ui-skills (MIT), reworded and
re-tested here; `[practice]` = house judgement, tune freely. Apple HIG (44pt touch target) is cited by name where used.

## D. "Janks on scroll", "animation stutters"

Triage by where the time goes; stop at the first yes. Cost model and fixes in [references/motion-cost.md](../ui-engineering-polish/references/motion-cost.md). "Large surface" below means over 25% of viewport area or over 300x300 CSS px [practice].

- **Layout bars appear in a recording while a size, offset, margin, padding or grid track animates.** Move to `transform` (or FLIP) [ui-skills/fixing-motion-performance]. Test: re-record; Layout bars per frame drop to zero.
- **A scroll handler writes styles from `scrollY`.** Replace with `animation-timeline: scroll()/view()` behind `@supports` plus a static fallback, or `IntersectionObserver` [ui-skills/fixing-motion-performance]. Triage aid [practice]: `grep -rnE "addEventListener\(['\"]scroll"`, then check each hit writes no style or layout read.
- **"Forced reflow" warning.** [practice] A layout read follows a style write in the same frame; do all reads first, then all writes. Test: warning gone in a fresh 3s recording.
- **Work continues off-screen.** Every rAF loop has a cancel path; looping animation stops when off-screen or `document.hidden` [ui-skills/fixing-motion-performance]. Test: scroll it away, the Performance panel shows no frames for it.
- **Blur or `backdrop-filter` cost.** On a large surface while animating it is a finding; otherwise cap a one-shot blur at 8px [ui-skills/fixing-motion-performance] and prefer opacity plus translate. Test: re-record, Paint time per frame under 4ms [practice].
- **Too many layers.** Permanent `will-change` is a defect [ui-skills/fixing-motion-performance]: set it just before the motion, clear after. Test: Layers panel layer count before and after the fix does not rise by more than the number of elements you meant to promote [practice].
- **Style recalculation spikes when a variable changes.** [practice] Set the variable on the smallest element that uses it, not a container; if animated, register it with `@property` (`inherits: false`). Test: "Recalculate Style" total in a 3s recording is lower after than before.
- **Two things write one property** (CSS transition, JS library, WAAPI). [practice] Keep one writer. Test: grep the property across stylesheets and handlers; one source remains.

Guard rails owned here (design of the motion stays in `atelier:motion-design`):
- Press, hover and toggle feedback finishes within 200ms [ui-skills/baseline-ui]; entrances use ease-out [ui-skills/baseline-ui].
- If motion already exists, `prefers-reduced-motion: reduce` swaps travel for a short opacity change instead of removing feedback [practice]. Test: DevTools emulation, replay.
- Prefer a cheaper technique (width to transform, JS to CSS) over deleting the motion [practice].
- Keep view transitions for page-level navigation; widgets that users can interrupt should not use them [ui-skills/fixing-motion-performance].

## E. "Mobile viewport jumps", "layers fight", "layout shifts"

Apply only where the project has no contrary rule.

**Viewport and stacking**
- Full-height shells use `100dvh`, not `100vh`; fixed bars pad with `env(safe-area-inset-*)` [ui-skills/baseline-ui]. Test: phone emulation with collapsing URL bar, CTA not clipped.
- Stacking uses named tokens (base, sticky, overlay, modal, toast) [ui-skills/baseline-ui]. Test: `grep -rnE "z-index: ?[0-9]{3,}|z-\[[0-9]{3,}\]"` hits only the token file.

**Layout shift**
- Values that change in place (counters, timers, table columns) use `tabular-nums` [ui-skills/baseline-ui]. Test: change the value, neighbours move 0px.
- Skeleton and loaded block differ by at most 4px in height [practice] (script 1); page CLS at or under 0.1 [practice; common "good" cut-off].
- Headings `text-wrap: balance`, body paragraphs `pretty` [ui-skills/baseline-ui]; dense rows truncate or clamp with full text reachable [practice].

**Code hygiene**
- Tailwind: a single `cn` helper builds conditional classes, no template-literal concatenation [ui-skills/baseline-ui].
- Equal `w-N h-N` pairs become `size-N` [ui-skills/baseline-ui]; `grep -P "w-(\d+) h-\1"` (backreference needs PCRE).
- Shadows come from tokens; glow (blur over 12px, saturated) never the sole state signal [practice]. Grep box-shadow not using `var(--shadow-*)` or the framework scale.
- Accent budget [ui-skills/baseline-ui]: script 2 finds distinct accent hues on interactive elements; hues more than 30 degrees apart count as different; more than one is a finding unless semantic (error, success).
- A `useEffect` whose only job is to set state from props or state: compute during render instead [ui-skills/baseline-ui]. Grep `useEffect` bodies with one `set*` call and no subscription, timer or fetch.
- A failed action shows its error next to that action [ui-skills/baseline-ui].

## Verify

No upstream tooling needed. Scripts run in the DevTools console unless noted.

1. **Skeleton fidelity**: log `getBoundingClientRect().height` of each block while skeleton, again after load; compare.
2. **Accent hues** (assumes computed colours serialise as `rgb()`/`rgba()`; on `oklch`, `lab` or `color(...)` values the regex returns nothing useful, so read those by eye or convert first). Prints the sorted hues; merge any within 30 degrees (circular) as one accent; count the groups. Neutral = saturation under 0.2 or lightness outside 0.1-0.9 [practice]:
   ```js
   [...new Set([...document.querySelectorAll('a,button,[role=button]')].map(e=>getComputedStyle(e).backgroundColor)
     .map(c=>c.match(/^rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?/)).filter(m=>m&&(m[4]===undefined||+m[4]>0))
     .map(m=>{let [r,g,b]=m.slice(1,4).map(v=>v/255);const x=Math.max(r,g,b),n=Math.min(r,g,b),l=(x+n)/2,d=x-n;
       if(!d||l<.1||l>.9||d/(1-Math.abs(2*l-1))<.2)return null;
       return Math.round(((x==r?((g-b)/d+6)%6:x==g?(b-r)/d+2:(r-g)/d+4)*60))%360}).filter(h=>h!==null))].sort((a,b)=>a-b)
   ```
3. **Profiler**: Performance, 4x CPU throttle [practice], record 3-5s. A compositor-only animation shows no Layout or Paint bars per frame; Rendering > Paint flashing shows no flashes. Read frame timings in the Frames track: frames above 16.7ms (60 Hz) are drops; pass when over 95% of frames are at or under 16.7ms [practice].
4. **Stutter without the Performance panel**: the rAF gap script in [references/motion-cost.md](../ui-engineering-polish/references/motion-cost.md) catches main-thread stalls only; a compositor-only animation can look smooth there. Instead record the screen at a constant frame rate (force it, e.g. `ffmpeg -r 60` or OBS fixed 60 fps, since variable-rate captures skip static frames) and run `ffmpeg -i rec.mp4 -vf mpdecimate,showinfo -f null - 2>&1 | grep -c pts_time`. mpdecimate also drops frames of near-static content, so use it only on motion that changes most pixels. Pass if kept frames are at least 90% of (duration x 60) during the motion window; below 90% means more than 10% duplicate frames, i.e. drops. Screen capture itself costs CPU and can add drops, so compare before and after the fix under the same recorder rather than trusting an absolute number, and confirm in the Frames track.
5. **Reduced motion**: emulate `prefers-reduced-motion: reduce`, replay, confirm travel is gone and feedback remains.
6. **Viewport**: 375px wide with device emulation and collapsing toolbar.
7. Re-run the original failing case and diff-review that nothing adjacent changed.

## Do not

- Do not introduce new animation, gradients or glow in this pass. Existing motion may be made cheaper or safer; its easing, timing design and choreography stay with `atelier:motion-design`.
- Do not leave `will-change` on permanently or poll scroll position.
- Do not rewrite a component for a small defect or swap UI or animation libraries.
- Do not claim a performance win without a before/after profile, or an a11y pass without a keyboard run.
