---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-ux-intelligence
description: "Design reasoning for UI/UX: turn a product type, audience and platform into a justified choice of style, palette, typography, layout pattern and interaction rules, record it as a DESIGN.md-style brief, and gate delivery with a measurable checklist. Use when starting a page, app or dashboard with the direction open, when asked what style, colors or fonts fit X, when a UI looks unprofessional and nobody can say why, or before shipping. Slices: ui-ux-intelligence-brief (reasoning ladder, pattern choice, brief), ui-ux-intelligence-checklist (hard numbers, pre-delivery checklist)."
---

# UI/UX Intelligence

A decision procedure, not a style catalog: derive the direction from the product, write it down,
build against it, then test it. Every choice must trace to a product fact (who, where, how often,
what is at stake). Taste words ("clean", "modern", "premium") are allowed only when attached to a
check from this file.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:ui-ux-intelligence-brief` | choosing the direction and writing the brief | Reasoning ladder, Pattern choice, Brief discipline |
| `atelier:ui-ux-intelligence-checklist` | building against the brief or gating before delivery | Hard numbers, Pre-delivery checklist, Verify recipes |

References:
- [references/product-matrix.md](references/product-matrix.md): product type to pattern, style, palette mood, type mood, avoid list.
- [references/design-brief-template.md](references/design-brief-template.md): the DESIGN.md-style brief to fill in.

## Invoke

1. **Intake** (one batch of questions, assume and state the rest in one line each): product type,
   primary action, audience and usage context (desk, commute, glance, all-day tool), platform
   (web, iOS, Android, desktop), stack, existing brand assets, regulated domain yes/no.
2. **Classify the surface**: persuade (landing, onboarding), operate (dashboard, admin, editor),
   read (docs, content), transact (checkout, forms). Surface drives density and motion more than
   industry does.
3. **Reason to a direction** with the ladder in `atelier:ui-ux-intelligence-brief`, producing the brief.
4. **Build** against the brief; page-level deviations go in a short override note, never silently.
5. **Gate** with the checklist in `atelier:ui-ux-intelligence-checklist` and the Verify recipes before declaring done.

## Neighbours (split rule, one line each)

- `atelier:visual-design`: aesthetic direction and dials. This skill picks the direction from product facts, then hands taste decisions there.
- `atelier:design-systems`: token pipelines, component APIs. This skill writes the brief; that one builds the system. Test: if the task needs a token file or component API, hand off; if it needs a style or palette choice, stay here.
- `atelier:frontend-design`: writes the page code. This skill decides what it should look like and why.
- `atelier:ui-review`: audits an existing UI. `atelier:visual-qa`: checks rendered screenshots. Both audit what exists. This skill is for choosing before and gating after.
- `atelier:unslop-ui`: removes generic-AI tells from a finished page; use it as the last pass here.
- `atelier:ui-engineering-polish`: code-level finish (states, focus, perf); the checklist in `atelier:ui-ux-intelligence-checklist` only gates it.
- `atelier:prototype`: disposable mocks; skip the brief unless the prototype will be kept.
- `atelier:motion-design`: all animation choices beyond the timing numbers quoted here.
- `atelier:html-design-artifacts`: packaging a single HTML deliverable.
- `atelier:illustration-and-icons`: icon and illustration assets. `atelier:logo-design`: marks. `atelier:diagrams`: diagrams.
- `atelier:art-motion`: generative or abstract motion pieces, not product UI.
- `atelier:launch-film`: a product launch video; this skill only supplies the UI look it shows.
- `atelier:explainer-video`: scripted concept video. `atelier:product-demo-video`: screen-recorded walkthrough of a finished UI.
- `atelier:video-direction`: shot planning. `atelier:shot-recipes`: camera recipes. `atelier:one-line-video`: one-prompt clips.
- `atelier:video-composition`: code-built timelines. `atelier:video-editing`: cutting footage. `atelier:ai-video`: generated footage.
- `atelier:2d-animation`: frame animation. `atelier:svg-character-animation`: SVG rigs. `atelier:math-animation`: equation visuals.
- `atelier:animation-reverse-engineering`: recovering how an existing animation works. `atelier:audio-review`: judging sound.
All of these output rendered clips or sound, not UI; route there when that is the deliverable.

## Verify (no special tooling)

- Contrast: sample pixel colors from a screenshot (browser devtools color picker) and compute the ratio with L = 0.2126R + 0.7152G + 0.0722B (each channel c/255 linearised: c<=0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4), ratio = (L1+0.05)/(L2+0.05) with L1 the lighter; or use the devtools accessibility contrast readout. Test hover, disabled and dark states too.
- Responsive: browser devtools device mode at the four widths; run `document.documentElement.scrollWidth > innerWidth` in the console, expect false.
- Keyboard: unplug the mouse, Tab through the whole flow; every stop visible, order matches visual order, Esc closes overlays.
- Motion: toggle "prefers reduced motion" in devtools rendering panel and reload; confirm movement is gone and content still appears.
- Layout shift: devtools Performance panel or Lighthouse run once; read CLS.
- Landscape phone: devtools device mode, rotate to 667x375 (or 844x390); confirm no fixed bar eats more than a third of the height, no clipped content, and the primary action stays reachable.
- Text stress: set browser text size to the largest, and paste a 40-character unbroken label into one button and one table cell.
- Screenshots: capture each key screen at 375 and 1440 (headless browser or devtools), view them side by side at thumbnail size; hierarchy should still read in under a second.
- Video check of motion, if any: record the screen at 60 fps, run `ffmpeg -i rec.mp4 -vf fps=10 f_%03d.png`, and flip through frames; no frame may show content shifted then snapped back (layout jump). For timing, `ffmpeg -i rec.mp4 -vf fps=60 g_%03d.png` and count frames between trigger and settle (at 60 fps, 6 frames = 100ms); compare against the dials in the brief.

## Do not

- Pick a style from a trend or an upstream label without a product reason written in the brief.
- Copy a sample palette or font pairing verbatim; derive from roles and mood, then check contrast.
- Apply mobile-app rules (safe areas, haptics, bottom nav, dynamic type) to desktop web, or desktop hover patterns to touch.
- Use emoji as icons, mix icon families, or hardcode per-screen colors.
- Ship dark mode by inverting light values.
- Use more than one expressive device on an operate surface.
- Require, install or run upstream CLIs, scripts or datasets; they are optional extras and their output is advice.
- Stall on missing answers: assume, state the assumption, continue.
