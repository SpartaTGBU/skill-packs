---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-engineering-polish
description: >
  Design-engineer craft rules for fixing UI code, organised by symptom with a test per rule: "can't
  tab to it", "screen reader says nothing", "janks on scroll", "mobile viewport jumps", "layers fight",
  plus a small baseline convention set. Use when cleaning up a component or page, reviewing a diff
  for accessibility or jank, or fixing unlabeled icon buttons, lost focus, layout-property
  animation, scroll listeners. Splits: atelier:ui-ux-intelligence picks conventions and patterns
  (what to build), this skill patches code; atelier:unslop-ui strips AI tells; atelier:ui-review
  audits a whole surface; atelier:motion-design owns easing and choreography; atelier:visual-qa
  compares screenshots to a target (this skill checks DOM, CSS, profiler); atelier:design-systems owns
  tokens (this skill only flags off-token values); atelier:frontend-design builds new pages (this skill
  patches existing code); atelier:html-design-artifacts and atelier:prototype make new standalone
  files, not patches; atelier:visual-design picks the look; video, audio and drawn-animation skills
  are out of scope (not UI code).
---

# UI Engineering Polish

A fix-and-verify pass over UI code that already exists. It does not decide how the product looks or
how motion feels; it makes the implementation reachable, nameable and cheap to render. Work inside
the project's stack and primitives. Never migrate a library to satisfy a rule.

Neighbours (split rule, one line each):
- `atelier:ui-ux-intelligence`: chooses UI conventions, patterns and accessibility policy for a product; this skill applies them as code-level defects with tests.
- `atelier:unslop-ui`: removes generic-AI visual and copy tells; this skill fixes code correctness.
- `atelier:ui-review`: judges a whole surface against design intent; this skill patches concrete defects.
- `atelier:motion-design`: chooses easing, duration, choreography and reduced-motion design; this skill only guards the cost and safety of motion already there.
- `atelier:visual-design`, `atelier:frontend-design`, `atelier:design-systems`: decide look, build new pages, own tokens; this skill polishes what they produced.
- `atelier:visual-qa`: screenshot comparison against a target; here checks are DOM, CSS and profiler based.
- `atelier:prototype`, `atelier:html-design-artifacts`: throwaway or single-file pages; apply A, B and D there (names, keyboard and jank matter on throwaway pages too); skip C and E, which assume a real product.
- `atelier:illustration-and-icons`, `atelier:diagrams`, `atelier:logo-design`: asset making; this skill only labels and hides them correctly.
- Video, film, 2D and SVG animation siblings (`art-motion`, `launch-film`, `animation-reverse-engineering`, `explainer-video`, `svg-character-animation`, `audio-review`, `video-direction`, `one-line-video`, `product-demo-video`, `shot-recipes`, `video-composition`, `video-editing`, `ai-video`, `math-animation`, `2d-animation`): authored or rendered animation, not live UI; out of scope. Closest splits: `art-motion` is expressive canvas/GL motion made as an artwork, `svg-character-animation` is timeline-authored SVG; this skill only touches animation that runs inside shipped UI.

References:
- [references/a11y-fixes.md](references/a11y-fixes.md): fix snippets and keystroke tests per widget.
- [references/motion-cost.md](references/motion-cost.md): cost model, fixes, profiler and frame-delta recipes.

## Invoke

1. **Scope.** Named file, diff or component. Touch only what a rule flags; no renamed props, no new dependency.
2. **Detect the stack** (framework, CSS approach, primitive library, animation library) and reuse it.
3. **Match the user's complaint to a symptom below.** With no complaint, scan A through E in that order; a fix in A can change markup the later scans read.
4. **Report each finding** as quoted snippet, one-sentence reason, minimal fix, and the test that proves it. If nothing breaks a rule, say so; do not invent findings.
5. **Run Verify** and state which checks ran and which could not.

Source key: `[WCAG]` = WCAG 2.2 criterion; `[ui-skills/fixing-accessibility]`, `[ui-skills/fixing-motion-performance]` and
`[ui-skills/baseline-ui]` = idea taken from that skill in github.com/ibelick/ui-skills (MIT), reworded and
re-tested here; `[practice]` = house judgement, tune freely. Apple HIG (44pt touch target) is cited by name where used.

## A. "Screen reader says nothing" or "wrong thing"

| Defect | Fix | Test |
|---|---|---|
| Control with an empty accessible name (icon button, icon link) [ui-skills/fixing-accessibility] | visible text, `aria-label` or `aria-labelledby`; mark the glyph `aria-hidden="true"` | script 1 in Verify lists zero offenders |
| Input without a label | `<label for>` or wrapping label; placeholder is not a label | the accessibility tree shows a name on every field |
| Vague link text ("here", "more") | name the destination | read the link list out of context |
| Role added to an element that already has it, or a role missing its required state | drop the redundant role; add `aria-expanded` + `aria-controls` to disclosure triggers, `aria-selected` to tabs | ariaSnapshot shows the expected states |
| Skipped heading level, `div` grid posing as a table or list | `h1..h6` in order, `ul/li`, `table` with `th scope` | outline from script 4 has no jumps greater than 1 |
| Result or error appears silently | polite region `role="status"`; blocking error `role="alert"`; a toast is never the sole carrier | with a screen reader running, trigger it and hear it |
| Informative image without alt, or decorative image with noisy alt | descriptive `alt`; `alt=""` for decoration | script 2 |

## B. "Can't tab to it", "focus vanishes", "keyboard trap"

- Decision rule [ui-skills/fixing-accessibility]: if a native element exists (`button`, `a[href]`, `input`, `summary`, `dialog`) use it. A `div` with a click handler is a defect; the only exception is a primitive library's own widget.
- If native is impossible: `role`, `tabindex="0"`, and Enter plus Space handlers (Space for buttons, Enter for links).
- `tabindex` greater than 0 is a defect. DOM order must equal reading order [ui-skills/fixing-accessibility].
- `outline: none` needs a `:focus-visible` replacement. WCAG 2.2 AA (2.4.7, 2.4.11 Focus Not Obscured) requires a visible, unobscured focus: check no sticky header covers the focused element after Tab.
- Hover-only content (tooltip, menu) must also open on focus and have a tap path [ui-skills/fixing-accessibility].
- Modal behaviour test: opening moves focus inside; Tab and Shift+Tab stay inside; Esc closes; focus returns to the trigger; page behind does not scroll. Prefer native `<dialog>.showModal()` or the project's primitive; hand-rolled trapping is last resort.
- Destructive confirm: default focus on the safe button.
- Skip link first in the tab order on pages with repeated navigation [WCAG 2.4.1].
- Per-widget keystroke scripts: [references/a11y-fixes.md](references/a11y-fixes.md).

## C. "Form gives no feedback"

- Error text next to the field [ui-skills/fixing-accessibility], linked with `aria-describedby`; the field gets `aria-invalid="true"`.
- Required is in markup [practice] (`required` or `aria-required`), not only a red star.
- A disabled submit either explains itself in nearby text or stays enabled and validates on press.
- Never block paste; never clear a field on error [ui-skills/baseline-ui].
- Colour is never the only signal for error, selected or disabled: add icon, weight or text [WCAG 1.4.1].
- Contrast: 4.5:1 normal text, 3:1 large text and UI component boundaries [WCAG 1.4.3, 1.4.11]. Test on computed colours in light and dark.
- Pointer target size (script 8 measures it): at least 24x24 CSS px is the WCAG 2.2 AA floor [WCAG 2.5.8]; 44x44 is the stricter AAA figure [WCAG 2.5.5] and matches Apple's HIG touch target of 44pt (points, roughly CSS px). Treat 44 as a touch-first target, not an AA requirement, and say which one you are enforcing.
- Media: no autoplay with sound; speech in video has captions [WCAG 1.2.2].

## D. "Janks on scroll", "animation stutters"

Triage by where the time goes; stop at the first yes. Cost model and fixes in [references/motion-cost.md](references/motion-cost.md). "Large surface" below means over 25% of viewport area or over 300x300 CSS px [practice].

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
- Skeleton and loaded block differ by at most 4px in height [practice] (script 5); page CLS at or under 0.1 [practice; common "good" cut-off].
- Headings `text-wrap: balance`, body paragraphs `pretty` [ui-skills/baseline-ui]; dense rows truncate or clamp with full text reachable [practice].

**Code hygiene**
- Tailwind: a single `cn` helper builds conditional classes, no template-literal concatenation [ui-skills/baseline-ui].
- Equal `w-N h-N` pairs become `size-N` [ui-skills/baseline-ui]; `grep -P "w-(\d+) h-\1"` (backreference needs PCRE).
- Shadows come from tokens; glow (blur over 12px, saturated) never the sole state signal [practice]. Grep box-shadow not using `var(--shadow-*)` or the framework scale.
- Accent budget [ui-skills/baseline-ui]: script 6 finds distinct accent hues on interactive elements; hues more than 30 degrees apart count as different; more than one is a finding unless semantic (error, success).
- A `useEffect` whose only job is to set state from props or state: compute during render instead [ui-skills/baseline-ui]. Grep `useEffect` bodies with one `set*` call and no subscription, timer or fetch.
- A failed action shows its error next to that action [ui-skills/baseline-ui].

## Verify

No upstream tooling needed. Scripts run in the DevTools console unless noted.

1. **Unnamed controls** (replaces the unreliable `:empty` selector, which misses buttons holding an svg):
   ```js
   [...document.querySelectorAll('button,[role=button],a[href],input:not([type=hidden]),select,textarea,summary')]
     .filter(e => !(e.getAttribute('aria-label')||'').trim()
       && !(e.getAttribute('aria-labelledby')||'').trim()
       && !(e.labels&&[...e.labels].some(l=>l.textContent.trim()))
       && !(e.title||'').trim()
       && !(e.innerText||(/^(button|submit|reset)$/.test(e.type)?e.value:'')||'').trim()
       && !e.querySelector('img[alt]:not([alt=""])'))
   ```
   The result must be an empty array. Names via `aria-labelledby` pointing at empty text still pass; confirm with item 3.
2. **Images**: `[...document.images].filter(i=>!i.hasAttribute('alt'))` must be empty.
3. **Accessibility tree**: DevTools Accessibility pane, or Playwright `locator.ariaSnapshot()` on the region under test (`page.accessibility.snapshot()` is removed in current Playwright). Every interactive node shows role and name.
4. **Heading outline**: `[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>h.tagName[1]+' '+h.textContent.trim())`; no level jumps by more than 1.
5. **Skeleton fidelity**: log `getBoundingClientRect().height` of each block while skeleton, again after load; compare.
6. **Accent hues** (assumes computed colours serialise as `rgb()`/`rgba()`; on `oklch`, `lab` or `color(...)` values the regex returns nothing useful, so read those by eye or convert first). Prints the sorted hues; merge any within 30 degrees (circular) as one accent; count the groups. Neutral = saturation under 0.2 or lightness outside 0.1-0.9 [practice]:
   ```js
   [...new Set([...document.querySelectorAll('a,button,[role=button]')].map(e=>getComputedStyle(e).backgroundColor)
     .map(c=>c.match(/^rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?/)).filter(m=>m&&(m[4]===undefined||+m[4]>0))
     .map(m=>{let [r,g,b]=m.slice(1,4).map(v=>v/255);const x=Math.max(r,g,b),n=Math.min(r,g,b),l=(x+n)/2,d=x-n;
       if(!d||l<.1||l>.9||d/(1-Math.abs(2*l-1))<.2)return null;
       return Math.round(((x==r?((g-b)/d+6)%6:x==g?(b-r)/d+2:(r-g)/d+4)*60))%360}).filter(h=>h!==null))].sort((a,b)=>a-b)
   ```
7. **Keyboard run**: unplug the mouse; Tab and Shift+Tab through everything, activate with Enter/Space, Esc each overlay. Record unreachable controls and lost focus. Then run the widget scripts in the a11y reference.
8. **Contrast and target size** (rgb() colours; opaque backgrounds assumed, walk up to the first non-transparent ancestor):
   ```js
   const lum=c=>{const [r,g,b]=c.match(/[\d.]+/g).slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
   const bg=e=>{for(;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor;if(!/rgba\(.*, ?0\)|transparent/.test(c))return c}return 'rgb(255,255,255)'};
   const cr=e=>{const a=lum(getComputedStyle(e).color),b=lum(bg(e));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
   [...document.querySelectorAll('a,button,[role=button],input,select,textarea,[tabindex]')].map(e=>{const r=e.getBoundingClientRect();return {e,w:r.width,h:r.height,cr:cr(e).toFixed(2)}})
     .filter(o=>o.w&&(o.w<24||o.h<24||o.cr<4.5))
   ```
   Every row is a finding (below 24px, or text contrast under 4.5; large text and UI boundaries need 3.0, judge those rows by hand). Run in light and dark. Inline links inside a sentence are exempt from the 24px floor [WCAG 2.5.8].
9. **Profiler**: Performance, 4x CPU throttle [practice], record 3-5s. A compositor-only animation shows no Layout or Paint bars per frame; Rendering > Paint flashing shows no flashes. Read frame timings in the Frames track: frames above 16.7ms (60 Hz) are drops; pass when over 95% of frames are at or under 16.7ms [practice].
10. **Stutter without the Performance panel**: the rAF gap script in [references/motion-cost.md](references/motion-cost.md) catches main-thread stalls only; a compositor-only animation can look smooth there. Instead record the screen at a constant frame rate (force it, e.g. `ffmpeg -r 60` or OBS fixed 60 fps, since variable-rate captures skip static frames) and run `ffmpeg -i rec.mp4 -vf mpdecimate,showinfo -f null - 2>&1 | grep -c pts_time`. mpdecimate also drops frames of near-static content, so use it only on motion that changes most pixels. Pass if kept frames are at least 90% of (duration x 60) during the motion window; below 90% means more than 10% duplicate frames, i.e. drops. Screen capture itself costs CPU and can add drops, so compare before and after the fix under the same recorder rather than trusting an absolute number, and confirm in the Frames track.
11. **Reduced motion**: emulate `prefers-reduced-motion: reduce`, replay, confirm travel is gone and feedback remains.
12. **Viewport**: 375px wide with device emulation and collapsing toolbar.
13. Re-run the original failing case and diff-review that nothing adjacent changed.

## Do not

- Do not introduce new animation, gradients or glow in this pass. Existing motion may be made cheaper or safer; its easing, timing design and choreography stay with `atelier:motion-design`.
- Do not add ARIA where native HTML already says it.
- Do not suppress focus rings, block paste or use `tabindex` above 0.
- Do not leave `will-change` on permanently or poll scroll position.
- Do not rewrite a component for a small defect or swap UI or animation libraries.
- Do not claim a performance win without a before/after profile, or an a11y pass without a keyboard run.
- Do not cite WCAG 2.5.8 (24px) and 2.5.5 (44px) as the same requirement.
