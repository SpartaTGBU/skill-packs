---
disable-model-invocation: true  # skl: on-demand pack skill
name: html-design-artifacts
description: >
  Producing polished UI mockups, interactive prototypes, wireframes, one-page decks and design boards
  as single self-contained HTML files that a person can open, review and hand on. Covers the brief,
  real design context, one-file packaging, artboard and slide structure, honest placeholder content,
  revision rounds and a browser-only verification pass. Use when asked for "a mockup", "a clickable
  prototype", "wireframes", "a deck in HTML" or "a design board of options": a design shown, not code
  shipped. Not for shipped code or rendered video (mp4); sibling routing is in Neighbours.
---

# HTML Design Artifacts

<!-- Provenance: written from scratch. Only the general idea of a single-file design deliverable was taken from baoyu-design (MIT); no text, code, assets or structure copied, so nothing is attributed in NOTICE.md. -->

A design artifact is a deliverable you hand to a person: one HTML file that opens by double-click,
shows the design at honest fidelity, and survives being passed around. Think of it as the exhibit,
not the production code.

Neighbours (split rule, one line each):
- `atelier:prototype` proves a flow works; this skill packages what gets shown and reviewed.
- `atelier:frontend-design` ships real components in the project stack; here nothing ships, it is viewed.
- `atelier:visual-design` decides look and dials; this skill decides format, structure and verification.
- `atelier:design-systems` builds token libraries; here you only consume or sketch tokens.
- `atelier:ui-review` / `atelier:visual-qa` audit finished UI; this skill's Verify section is a self-check only.
- `atelier:diagrams` for technical diagrams; `atelier:motion-design` for animation craft inside the page.
- `atelier:ui-engineering-polish` hardens production CSS and interaction; here nothing ships.
- Not this skill when the deliverable is an mp4 or other rendered film:
  - `atelier:video-composition`: code-driven video.
  - `atelier:product-demo-video`: product walkthrough.
  - `atelier:explainer-video`: concept explainer.
  - `atelier:launch-film`: announcement film.
  - `atelier:one-line-video`: video from a single prompt.
  - `atelier:video-direction`: shot plan and look.
  - `atelier:video-editing`: cutting existing footage.
  - `atelier:ai-video`: generative clips.
  - `atelier:audio-review`: sound checks.
  - `atelier:shot-recipes`: reusable shot patterns.
  - `atelier:math-animation`: equation and proof animation.
  - `atelier:2d-animation`: hand-built frames and cutouts.
  - `atelier:svg-character-animation`: rigged SVG characters.
- `atelier:art-motion` makes generative or kinetic art as the piece itself; here motion is at most a
  transition in a reviewed mockup.
- `atelier:animation-reverse-engineering` recovers how an existing animation works; here you build a
  new artifact, not analyse one.
- `atelier:logo-design` makes marks; here the user's mark is used as given.
- `atelier:illustration-and-icons` makes artwork; here imagery is placeholder or inline SVG.
- `atelier:unslop-ui` is a taste pass on finished UI; run it after this skill, not inside it.
- `atelier:ui-ux-intelligence` looks up styles and patterns; run it before this skill if the look is open.

References:
- [references/artifact-shapes.md](references/artifact-shapes.md): file skeletons for board, deck, prototype and wireframe.
- [references/review-rounds.md](references/review-rounds.md): turning comments into revisions without drift.

## Invoke

1. **Name the deliverable shape** (table in the reference): board of options, deck, clickable
   prototype, wireframe set. One shape per file; mixed asks become two files.
2. **Write the one-sentence point** the viewer should leave with ("checkout feels two steps, not
   five"). Every screen, slide or artboard must serve it or be cut. Decide this before any markup.
3. **Name the viewer and the screen**: reviewer at a laptop, exec on a phone, projector in a room.
   That sets the canvas size, type floor and how much text each view carries (rules below).
4. **Gather real context first** (see Context). Starting from the user's actual screens, tokens or
   code beats starting from taste [practice].
5. **Choose fidelity on purpose** and say it in the file's header: wireframe (grey, no brand),
   mid (real type and spacing, placeholder imagery), high (brand-true). Never mix levels in one view.
6. **Build the shell, then fill**, verify, and hand over with a short note of what is invented.

## Context before pixels

Ask for, in this order, and stop at the first that exists: a codebase or design-system file; a
screenshot or Figma export; a live URL; a brand name or colour. If none exists, say so and pick a
neutral system, and mark the file "no brand context".
- Extract tokens, do not eyeball them: read computed values from the source (colours, font stack,
  radius, spacing step) and put them in `:root` custom properties. A hex typed from memory is a bug.
- Reuse the user's real names, labels and mark exactly as given. Never redraw or recolour a
  logo, never substitute another company's visual identity.
- When something is invented (a number, a person, a screen state), list it in a visible footer
  note "Made up for this mockup:" so nobody quotes it as fact.

## One-file packaging

- One `.html`, CSS and JS inline, opens with no server and no network. Fonts: a system stack, or
  base64 `@font-face` for the one display face; never a CDN link the viewer may be offline for.
- Images: inline SVG or `data:` URIs. Decision rule [practice]: any single image over 200 KB gets
  resized or turned into SVG; if the whole file passes 5 MB, split it into two files or drop images
  before adding more (mail limits and diffs get painful past that).
- No build step, no framework required. A small amount of vanilla JS handles tabs, a slide
  index or a state toggle. Keep state in the DOM or a single object; no storage needed to render.
- Structure with landmarks and ids (`#screen-cart`, `#slide-3`) so a reviewer's comment can name
  a target exactly and a revision can touch one block.
- Include `<meta name="viewport">`, a real `<title>`, and a `lang` attribute.

## Structure by shape

- **Board**: artboards laid out in a grid on a neutral ground, each labelled with name and
  state ("Cart / empty"). Fixed artboard sizes per device (for example 390x844 phone,
  1440x900 desktop [practice]). Options sit side by side so differences are visible without scrolling.
- **Deck**: fixed-size stage (say 1280x720; any 16:9 size works) scaled to fit with one CSS
  transform; arrow keys, a visible slide counter and a hash per slide (`#s3`); print stylesheet, one
  slide per page. One idea per slide, about 40 words at most [practice]; over that, split the slide.
  Skeleton in the shapes reference.
- **Prototype**: every clickable thing has a visible hover/focus state and a destination;
  dead ends are marked "not in scope" rather than silently inert. Budget 3 to 7 screens [practice]. See `atelier:prototype` for flow depth.
- **Wireframe**: grey boxes, one typeface, labelled regions; no colour except one accent for the
  thing under discussion.
- Make variants switchable on the page (a small variant switcher: density, theme, copy length)
  instead of shipping three near-identical files. Cap at five toggles [practice]; check: count `[data-variant]` controls (or switcher buttons) in the source, 5 or fewer, or the page is two files.

## Content honesty

- Zero placeholder text: `grep -niE 'lorem|ipsum|placeholder|todo|xxx' file.html` returns nothing.
  Each text slot is tested with a short string, a 2x-length string and an empty state.
- Numbers shown on screen are either from the user's material or flagged invented. Charts are
  drawn to a true scale with the baseline at zero for bars.
- Any claim of size or speed on screen carries a figure, or is cut: grep the visible text for
  "fast", "huge", "tiny" and "easy" and replace each hit with a number or delete it.
- The opening view must state what the thing is without scrolling or clicking.

## Layout and legibility floors

Checkable minimums (all [practice] unless you have a project standard):
- Body text 16px on a screen artboard; 24px or more on a deck stage 1280 wide (scale up with the stage); nothing under
  12px except legal footers.
- Contrast: 4.5:1 for body text, 3:1 for large text and UI borders.
- Tap targets 44x44px on touch artboards.
- One focal element per view [practice]: add `html{filter:blur(8px)}` via the console, screenshot, and
  name the lead element from the blurred image alone; fail if you name two or none. Scripted
  run: `chromium --headless --hide-scrollbars --window-size=1280,720 --force-device-scale-factor=1 --screenshot=blur.png file:///abs/path/file.html` on a copy with that rule added.
- Spacing from one scale (4 or 8 px base); distinct `gap` and `margin-bottom` values, 6 or fewer (one-liner in Verify).
- One display face and one text face at most; three weights at most. Check: `[new Set([...document.querySelectorAll('body *')].map(e=>getComputedStyle(e).fontFamily)).size, new Set([...document.querySelectorAll('body *')].map(e=>getComputedStyle(e).fontWeight)).size]` gives 2 or fewer and 3 or fewer (system fallback stacks may add one).

## Revision rounds

Treat feedback as edits to named blocks, not a rewrite. Quote the id, change only that block,
and log what changed in a short changelog comment at the top of the file. Keep the previous file
as `name-v1.html` before overwriting. Detail in the review-rounds reference.

## Verify (browser only, no special tooling)

1. Open the file by `file://` path in a normal browser with the network disabled; it must render
   fully. Any broken image or font fallback means a hidden external dependency.
2. Find external references: `grep -nE '(src|href|url\()[^>]*https?://' file.html` lists every
   loaded resource. Plain `<a href>` links to pages are fine; any `src`, stylesheet `href` or `url(`
   hit is a defect or a deliberate, labelled exception.
3. Screenshot at each target width (devtools device toolbar, or headless: `chromium --headless --disable-gpu --hide-scrollbars --window-size=1280,720 --screenshot=out.png file:///abs/path/file.html`). Look at the screenshot, not the DOM: check clipping, overflow,
   overlap, and that the opening view states its point.
4. Resize 320px to 1920px; no horizontal scrollbar on responsive pages. Console at each width:
   `document.documentElement.scrollWidth > innerWidth` must be `false`. Floors via console:
   - Small text: `[...document.querySelectorAll('body *')].filter(e=>e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>[e.tagName,e.className])` must list only legal footers.
   - Tap targets: `[...document.querySelectorAll('a,button,input,select,[data-go]')].filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44})` empty on touch artboards.
   - Spacing [practice]: `new Set([...document.querySelectorAll('body *')].flatMap(e=>{const s=getComputedStyle(e);return [s.rowGap,s.marginBottom]}).filter(v=>v!='0px'&&v!='normal')).size` must be 6 or fewer; 7 or more fails, so snap values to the scale.
   - Contrast: devtools colour picker shows the ratio per pair, or script it: `const L=c=>{const a=c.match(/\d+/g).slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*a[0]+.7152*a[1]+.0722*a[2]};const cr=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)}` then `cr(getComputedStyle(el).color, getComputedStyle(el).backgroundColor)` is 4.5 or more (3 for large text); needs an opaque background.
5. Keyboard only: Tab reaches every control, focus is visible, deck arrows work, Escape closes layers.
6. Open the console: zero errors and zero 404s.
7. Print preview for decks: one slide per page, nothing cut; export to PDF and count pages equal slides [practice].
8. After any fix, rerun step 3 (screenshots), the focal blur test, the 2x-string test and the small-text and tap-target one-liners; repeat once.
9. Read the "Made up" footer against the content; every invented item is listed.

## Do not

- Do not link CDN fonts, scripts or images in a deliverable meant to travel.
- Do not hand over an unchecked screenshot-free build; "looks fine in code" is not a pass.
- Do not redraw, recolour or imitate another company's logo, product UI or brand to look real.
- Do not mix wireframe and high-fidelity treatments inside one view.
- Do not bury many options inside one scroll; lay them out side by side or behind labelled tabs.
- Do not ship dead controls that look live, or invented numbers that look sourced.
- Do not rewrite the whole file to answer a one-block comment.
- Do not require any upstream tool, editor server or installer; the file must stand alone.
