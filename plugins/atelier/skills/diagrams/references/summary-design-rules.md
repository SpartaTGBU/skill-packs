# Design Rules for Single-Page HTML Summaries

Distilled, checkable rules for generating (or recreating from a screenshot) a
self-contained HTML summary page. Every rule is concrete.

Rule tags: `[taste]` anti-slop frontend rules, `[wig]` web-interface guidelines, `[adm]` the convergent median across a corpus of 70+ brand design systems.

---

## 1. Typography `[adm][taste][wig]`
- Body text 16px (`body-lg` 18px acceptable), line-height 1.5 (1.4-1.7 range). `[adm]`
- Measure: body paragraph max-width 60-75ch. `[taste]`
- Type scale (px), each step ~1.25-1.5x: 12 / 14 / 16 / 20 / 24 / 32 / 48. `[adm]`
- Display/headline weight 600-700; body weight 400; never exceed 700 for display. `[adm]`
- Headlines: negative letter-spacing -0.02em to -0.04em; body ~0. `[adm]`
- One sans family for everything; add a mono family ONLY for code/technical labels. `[adm][taste]`
- Use `…` not `...`; curly quotes `“ ”` not `"`; `tabular-nums` for number columns. `[wig]`
- Headings hierarchical h1-h6, single h1; `text-wrap: balance` on headings to kill widows. `[wig]`

## 2. Spacing & Layout `[adm][taste]`
- Base unit 4px. Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. `[adm]`
- Content container max-width 1100-1400px, centered, 16px gutter mobile / 24px desktop. `[adm][taste]`
- Section vertical padding 48-96px; tight interior stacks (8-12px) inside generous sections. `[adm]`
- Use CSS Grid for columns; never flex percentage math like `calc(33%-1rem)`. `[taste]`
- Multi-column layouts collapse to 1-up below 768px — declare it explicitly. `[taste][adm]`

## 3. Color & Contrast `[adm][taste][wig]`
- Neutral base (near-white or near-black) + exactly ONE accent; accent saturation < 80%. `[taste][adm]`
- No pure `#000` or pure `#fff` for text/background — use off-black / off-white. `[taste][adm]`
- One accent locked across the whole page; one palette (don't mix warm/cool grays). `[taste]`
- Body/normal text contrast ≥ 4.5:1; large text (≥18px) and UI ≥ 3:1 (WCAG AA). `[wig][taste]`
- Verify every button: text readable on its background (no white-on-white). `[taste]`
- Set `color-scheme` on `<html>`; `<meta name="theme-color">` matches page bg. `[wig]`

## 4. Hierarchy & Components `[adm][taste]`
- One corner-radius system: pick a scale (0 / 4 / 8 / 12 / 16px) and apply consistently. `[adm][taste]`
- Cards only when elevation marks real hierarchy; otherwise group with borders/whitespace. `[taste]`
- Shadows: subtle, tinted to background hue, stacked small offsets — no heavy pure-black drop. `[adm][taste]`
- Buttons: one primary intent per label; specific labels ("Save API Key" not "Continue"). `[wig][taste]`
- Forms: label above input, error below, no placeholder-as-label. `[taste][wig]`
- Interactive elements need visible hover + `:focus-visible` ring; never `outline:none` alone. `[wig]`

## 5. Accessibility Minimums `[wig]`
- Icon-only buttons need `aria-label`; decorative icons `aria-hidden="true"`.
- Images need `alt` (or `alt=""` if decorative) and explicit `width`/`height` (prevents CLS).
- Use `<button>` for actions, `<a>` for navigation — never `<div onclick>`.
- Form controls need `<label>`/`aria-label`, correct `type`, and `autocomplete`.
- Honor `prefers-reduced-motion`; honor `prefers-color-scheme`.
- Touch targets ≥ 44x44px.

## 6. Motion (if any) `[taste][wig]`
- Animate only `transform` and `opacity`; never `transition: all` — list properties.
- Every animation must communicate (hierarchy/feedback/state); no motion for decoration.
- Reduced-motion variant disables loops, parallax, autoplay > 5s.

---

## Visual-Verification Rubric (pass/fail, ≤15 items)
Run every box; any fail = not done.

1. Body text 16-18px, line-height 1.5-1.7, measure 60-75ch? `[adm][taste]`
2. Type scale uses discrete steps (12/14/16/20/24/32/48), not arbitrary sizes? `[adm]`
3. Spacing all multiples of 4px on a consistent scale? `[adm]`
4. Content width capped (~1100-1400px) and centered? `[adm]`
5. Exactly one accent color, used consistently page-wide? `[taste]`
6. No pure `#000`/`#fff`; off-black/off-white instead? `[taste][adm]`
7. Body contrast ≥ 4.5:1, large/UI ≥ 3:1? `[wig]`
8. Every button's text readable on its background? `[taste]`
9. One corner-radius system applied everywhere? `[adm][taste]`
10. Headings hierarchical (one h1, ordered h2-h6)? `[wig]`
11. All images have alt + explicit width/height? `[wig]`
12. Icon-only buttons have aria-label; focus-visible rings present? `[wig]`
13. Layout collapses cleanly to single column < 768px? `[taste][adm]`
14. `prefers-reduced-motion` and `prefers-color-scheme` honored? `[wig]`
15. Typography uses `…`, curly quotes, tabular-nums for number columns? `[wig]`

---

## Anti-Patterns (reject on sight)
- AI-purple/blue glow gradients, neon outer glows as default decoration. `[taste]`
- Three identical equal-width feature cards in a row. `[taste]`
- Centered hero + dark mesh + generic glassmorphism on everything. `[taste]`
- Inter as default font when any brand-appropriate choice exists; display weight > 700. `[taste][adm]`
- Em-dash `—` as a styling device (and generally); use hyphen or restructure. `[taste]`
- `border-t` + `border-b` on every row of a long list/spec table (10+ hairlines). `[taste]`
- `...` instead of `…`; straight quotes; `transition: all`; `outline: none` without replacement. `[wig]`
- `<div onclick>` for actions; icon buttons without `aria-label`; images without dimensions. `[wig]`
- Placeholder-as-label; blocking paste on inputs; disabling zoom (`user-scalable=no`). `[wig][taste]`
- Mixing two accent colors or warm+cool grays on one page. `[taste][adm]`
- Div-based fake screenshots / fake dashboards built from styled `<div>`s. `[taste]`
- Heavy pure-black drop shadows on light backgrounds. `[taste][adm]`

---

## Minimal Default CSS Token Set
Neutral + single accent, light-first with dark-mode override. Open-source fonts.

```css
:root {
  /* Fonts — Inter/Geist (sans), JetBrains/Geist Mono (code) [adm] */
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Type scale (px) [adm] */
  --fs-caption: 12px; --fs-sm: 14px; --fs-body: 16px; --fs-lead: 18px;
  --fs-h3: 20px; --fs-h2: 24px; --fs-h1: 32px; --fs-display: 48px;
  --lh-body: 1.6; --lh-tight: 1.15;
  --tracking-display: -0.03em;

  /* Spacing — 4px base [adm] */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-6: 24px; --sp-8: 32px; --sp-12: 48px; --sp-16: 64px; --sp-24: 96px;

  /* Radius — one system [adm] */
  --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px;

  /* Color — off-black/off-white + 1 accent [taste][adm] */
  --canvas: #fafafa; --surface: #ffffff; --hairline: #ebebeb;
  --ink: #171717; --body: #4d4d4d; --mute: #888888;
  --accent: #0070f3; --on-accent: #ffffff;

  /* Elevation — subtle stacked, tinted [adm] */
  --shadow-1: 0 1px 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04);

  /* Layout [adm] */
  --container: 1200px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #0f1011; --surface: #18191a; --hairline: #23252a;
    --ink: #f7f8f8; --body: #d0d6e0; --mute: #8a8f98;
    --accent: #828fff;
  }
}
html { color-scheme: light dark; }
body { font: 400 var(--fs-body)/var(--lh-body) var(--font-sans);
       color: var(--ink); background: var(--canvas); }
p { max-width: 70ch; }
h1,h2,h3 { line-height: var(--lh-tight); letter-spacing: var(--tracking-display);
           text-wrap: balance; font-weight: 600; }
:where(a,button):focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```
