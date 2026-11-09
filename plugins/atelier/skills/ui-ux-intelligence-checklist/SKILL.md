---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-ux-intelligence-checklist
description: "Measurable UI/UX thresholds and a pre-delivery gate: contrast, target sizes, focus, pressed-state timing, widths, type measure, spacing ramp, CLS, list virtualisation, motion timings, navigation caps; a CRITICAL/HIGH checklist with a named measurement per line and tooling-free Verify recipes. Use while building against a brief, when a UI looks unprofessional and nobody can say why, or before shipping. Slice of atelier:ui-ux-intelligence."
---

Slice of atelier:ui-ux-intelligence (hard numbers and the pre-delivery gate). Siblings: atelier:ui-ux-intelligence-brief.

## Hard numbers

Tags: [WCAG] standard, [pro-max] the ui-ux-pro-max repo, [landing] the landing-page-design skill in the ai-design-skills repo, [practice] our default. Untagged lines are plain definitions.

Accessibility and input
- [WCAG] Normal text contrast at least 4.5:1, large text 3:1; meaningful icons and control borders 3:1 against neighbours. Check dark mode separately; light values do not carry over.
- Touch targets 44x44pt on iOS, 48x48dp on Android [pro-max]; gap of at least 8px between targets [practice]; if the icon is smaller, enlarge the hit area, not the glyph. Web pointer targets: 24x24 CSS px is the WCAG 2.2 minimum (SC 2.5.8) [WCAG]; aim for 44 on touch-first pages [practice].
- Visible keyboard focus on every interactive element; sticky bars and overlays must not cover the focused control. Never disable zoom. Honor reduced motion.
- Color is never the only carrier of meaning: pair with icon or text. Every drag action has a click or keyboard alternative.
- Show a pressed state within 100ms of input [pro-max, citing Apple HIG; pro-max's other file allows 80-150ms, so we use 100ms as the single bound]; test by slowing a recording to 10 fps and counting frames between tap and change.

Layout and type
- Mobile-first; test widths 375, 768, 1024, 1440. No horizontal page scroll at 375.
- Body text 16px or more on mobile; measure about 35-60 characters on mobile, 60-75 on desktop [pro-max]; verify by counting one rendered line.
- Spacing: 4px base, a short fixed token list, no in-between values. A workable list is 4, 8, 12, 16, 24, 32, 48, 64 [practice]; any ramp is fine if it is closed.
- Nested rounded shapes: the inner radius is the outer radius less the gap, so both curves share a center [landing, ai-design-skills repo, idea only]. If that leaves under 2px, use a square inner corner [practice]. Test: zoom the corner; the gap must look even.
- Decision rule: cap hero heading and subheading width so each line break lands at a phrase boundary [landing, idea only]. Test: resize from 1440 to 375; if a line ends on a preposition or single word, narrow the cap.
- One primary action per screen; secondary actions visibly subordinate.

Performance and stability
- Layout shift budget 0.1 CLS [pro-max, web-vitals "good" bound]; reserve image and async slots to hit it.
- Virtualise long lists once scrolling stutters in a trace; pro-max also suggests lists of 50+ items [pro-max]. Keep per-frame script under about 16ms [pro-max].
- Skeletons, not spinners, for waits over about 1 second.

Motion (full policy in `atelier:motion-design`)
- Animate transform and opacity only. Exit faster than enter. Reveal-on-scroll: short rise, played once per element, slow enough to read as intent but never blocking content [landing, idea only]; persuade surfaces only. Test: with scroll fast-forwarded, no text is unreadable for over 1s. Stagger between siblings: pick one step, keep it, and cap the total sequence (pro-max suggests 30-50ms [pro-max]; the ai-design-skills landing skill uses a larger step with a total cap [landing]; ours: 30-60ms step, total under 400ms [practice]).
- Do not animate keyboard-driven or high-frequency actions [practice].

Navigation
- Bottom navigation: five items is our cap [practice]; back behavior is predictable; deep links resolve.

## Pre-delivery checklist

Our own test list; each line names the measurement. Pass CRITICAL before looking at HIGH.

CRITICAL
- [ ] Contrast: every text/icon pair, light and dark, at or above the ratios above (list the lowest pair and its ratio)
- [ ] Keyboard: Tab from page top reaches every control in visual order; focused element is fully visible (zero overlap with sticky bars)
- [ ] Targets: smallest hit box measured in devtools meets the target numbers above
- [ ] Motion and color: with reduced motion on, nothing moves; grayscale screenshot still shows every status
- [ ] Stability: CLS at or under 0.1; every `img` has width and height or an aspect-ratio

HIGH
- [ ] Data views: each of empty, loading, error renders once in a screenshot
- [ ] Tokens: grep components for `#[0-9a-f]{3,8}` and raw px colors; zero hits outside the token file
- [ ] Touch parity: every hover-revealed action has a tap or keyboard route (test with devtools touch emulation)
- [ ] Width sweep: 375 wide to 1440 wide (steps 375, 768, 1024, 1440) plus a phone in landscape; `scrollWidth <= innerWidth` each time
- [ ] Icons: one family, one stroke width, SVG; search source for emoji codepoints used as icons, expect none
- [ ] Stress text: 40-character unbroken string and largest browser text size, no clipping or overlap
- [ ] Hierarchy: exactly one primary-styled button per screen (count them)

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

- Apply mobile-app rules (safe areas, haptics, bottom nav, dynamic type) to desktop web, or desktop hover patterns to touch.
- Use emoji as icons, mix icon families, or hardcode per-screen colors.
- Ship dark mode by inverting light values.
- Require, install or run upstream CLIs, scripts or datasets; they are optional extras and their output is advice.
