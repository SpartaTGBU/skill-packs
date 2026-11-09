---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-engineering-polish-a11y
description: "Accessibility fixes for existing UI code, by symptom with a test per rule: empty accessible names, missing labels and alt, silent results, divs posing as buttons, tabindex and focus rings, modal focus traps, skip links, form errors, required markup, contrast and target size. Use when a screen reader says nothing, you can't tab to it, focus vanishes, or a form gives no feedback. Slice of atelier:ui-engineering-polish."
---

Slice of atelier:ui-engineering-polish (sections A-C: screen reader, keyboard and focus, form feedback). Siblings: atelier:ui-engineering-polish-perf.

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
- Per-widget keystroke scripts: [references/a11y-fixes.md](../ui-engineering-polish/references/a11y-fixes.md).

## C. "Form gives no feedback"

- Error text next to the field [ui-skills/fixing-accessibility], linked with `aria-describedby`; the field gets `aria-invalid="true"`.
- Required is in markup [practice] (`required` or `aria-required`), not only a red star.
- A disabled submit either explains itself in nearby text or stays enabled and validates on press.
- Never block paste; never clear a field on error [ui-skills/baseline-ui].
- Colour is never the only signal for error, selected or disabled: add icon, weight or text [WCAG 1.4.1].
- Contrast: 4.5:1 normal text, 3:1 large text and UI component boundaries [WCAG 1.4.3, 1.4.11]. Test on computed colours in light and dark.
- Pointer target size (script 6 measures it): at least 24x24 CSS px is the WCAG 2.2 AA floor [WCAG 2.5.8]; 44x44 is the stricter AAA figure [WCAG 2.5.5] and matches Apple's HIG touch target of 44pt (points, roughly CSS px). Treat 44 as a touch-first target, not an AA requirement, and say which one you are enforcing.
- Media: no autoplay with sound; speech in video has captions [WCAG 1.2.2].

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
5. **Keyboard run**: unplug the mouse; Tab and Shift+Tab through everything, activate with Enter/Space, Esc each overlay. Record unreachable controls and lost focus. Then run the widget scripts in the a11y reference.
6. **Contrast and target size** (rgb() colours; opaque backgrounds assumed, walk up to the first non-transparent ancestor):
   ```js
   const lum=c=>{const [r,g,b]=c.match(/[\d.]+/g).slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
   const bg=e=>{for(;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor;if(!/rgba\(.*, ?0\)|transparent/.test(c))return c}return 'rgb(255,255,255)'};
   const cr=e=>{const a=lum(getComputedStyle(e).color),b=lum(bg(e));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
   [...document.querySelectorAll('a,button,[role=button],input,select,textarea,[tabindex]')].map(e=>{const r=e.getBoundingClientRect();return {e,w:r.width,h:r.height,cr:cr(e).toFixed(2)}})
     .filter(o=>o.w&&(o.w<24||o.h<24||o.cr<4.5))
   ```
   Every row is a finding (below 24px, or text contrast under 4.5; large text and UI boundaries need 3.0, judge those rows by hand). Run in light and dark. Inline links inside a sentence are exempt from the 24px floor [WCAG 2.5.8].
7. Re-run the original failing case and diff-review that nothing adjacent changed.

## Do not

- Do not add ARIA where native HTML already says it.
- Do not suppress focus rings, block paste or use `tabindex` above 0.
- Do not rewrite a component for a small defect or swap UI or animation libraries.
- Do not claim a performance win without a before/after profile, or an a11y pass without a keyboard run.
- Do not cite WCAG 2.5.8 (24px) and 2.5.5 (44px) as the same requirement.
