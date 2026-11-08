---
disable-model-invocation: true  # skl: on-demand pack skill
name: design-systems
description: >
  Authors, validates, diffs and exports design tokens: DESIGN.md specs (YAML tokens plus
  rationale prose, WCAG contrast lint, Tailwind/DTCG export), primitive-semantic-component
  token tiers, and shadcn/Tailwind theming through CSS variables for light and dark. Use when
  asked for a DESIGN.md, design tokens, a theme or style guide agents can consume, token
  export to Tailwind or W3C DTCG, contrast validation of a palette, theming a shadcn/Tailwind
  app, or porting a brand's look into a reusable spec.
---

# Design Systems (DESIGN.md)

DESIGN.md is an open spec (Apache-2.0, `google-labs-code/design.md`) that describes a visual identity to coding agents in one file: **YAML front matter** with normative tokens, plus a **Markdown body** that says why the values exist and how to apply them. A Node CLI (`@google/design.md`, run via `npx -y`) lints structure and WCAG contrast, diffs versions, and exports to Tailwind or W3C DTCG JSON. The CLI needs network access to install on first use; if unavailable, validate by hand with the rules below.

Use this skill when the deliverable is the spec file. For a one-off designed page use `atelier:visual-design`; to implement the tokens in UI use `atelier:frontend-design`; to audit built UI use `atelier:ui-review`.

## Anatomy

```md
---
version: alpha
name: Heritage
description: Architectural minimalism meets journalistic gravitas.
colors:
  primary: "#1A1C1E"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
typography:
  h1: {fontFamily: Public Sans, fontSize: 3rem, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em"}
  body-md: {fontFamily: Public Sans, fontSize: 1rem}
rounded: {sm: 4px, md: 8px, lg: 16px}
spacing: {sm: 8px, md: 16px, lg: 24px}
components:
  button-primary: {backgroundColor: "{colors.tertiary}", textColor: "#FFFFFF", rounded: "{rounded.sm}", padding: 12px}
  button-primary-hover: {backgroundColor: "{colors.primary}"}
---
## Overview
## Colors
- **Tertiary (#B8422E):** the sole driver for interaction.
```

A full starter lives in `templates/starter.md`.

Token types: color (any CSS color: hex, `rgb()`, `oklch()`, named); dimension (number + `px`/`em`/`rem`); reference `{path.to.token}` (dotted path; `{colors.primary}`, never `{primary}`); typography object (`fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation`). Component properties allowed: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Variants are sibling entries (`button-primary-hover`), never nested.

Canonical section order (all optional; those present keep this order, no duplicate headings): Overview (Brand & Style), Colors, Typography, Layout (Layout & Spacing), Elevation & Depth, Shapes, Components, Do's and Don'ts. Unknown sections are preserved; unknown token names are accepted if the value type is valid.

## Invoke

### Author

1. Establish tone, accent color and type direction (ask, or infer from a site, image or brand name). To start from a known brand, read its file in `../visual-design/references/brands/` (see `references/brand-sources.md` for the larger corpus), translate its palette roles and type scale into tokens, and keep the rationale prose in your own words.
2. Write `DESIGN.md` at the project root. Always `name:` and `colors:`; include `primary`, typography tokens, and `on-*` colors for text on filled surfaces.
3. Use references (`{colors.primary}`) in `components:` instead of repeating hex values; the palette stays single-source.
4. Write the prose per section: what each token is for and when not to use it (one accent, what is reserved for interaction, density, radius language).
5. Lint, fix, then (for existing projects) export next to the file.

### Lint, diff, export

```bash
npx -y @google/design.md lint DESIGN.md                     # structure, refs, WCAG contrast; exit 1 on errors
npx -y @google/design.md diff DESIGN.md DESIGN-v2.md        # exit 1 = regression
npx -y @google/design.md export --format json-tailwind DESIGN.md > tailwind.theme.json
npx -y @google/design.md export --format css-tailwind  DESIGN.md > theme.css      # Tailwind v4 @theme
npx -y @google/design.md export --format dtcg          DESIGN.md > tokens.json    # W3C design tokens
npx -y @google/design.md spec --rules-only --format json    # print the spec for prompts
```
All commands accept `-` for stdin; `export` succeeds regardless of lint findings, so run `lint` separately to gate. On Windows the `design.md` binary can collide with the `.md` association: `npx -y -p @google/design.md designmd lint DESIGN.md`.

Lint rules: `broken-ref` (error); warnings `contrast-ratio` (component text vs background under AA 4.5:1), `missing-primary`, `missing-typography`, `orphaned-tokens` (colors no component uses), `section-order`, `unknown-key` (likely typo such as `colours:`); info `token-summary`, `missing-sections`. When the user cares about accessibility, call out the WCAG findings explicitly.

## Token tiers

Three tiers; each references only the tier below it. Components never touch primitives.

| Tier | Holds | Naming | Example |
|------|-------|--------|---------|
| Primitive | Raw values, the full ramp | `{hue}-{step}`, `space-{n}` | `blue-600: oklch(0.55 0.18 255)`, `space-4: 16px` |
| Semantic | Intent, theme-switchable | `{role}[-{variant}]` | `primary: {blue-600}`, `muted-foreground`, `border`, `danger` |
| Component | One part's decisions | `{component}-{part}-{state}` | `button-primary-bg-hover: {primary-hover}` |

- Rebranding swaps primitives; theming (light/dark, high contrast) remaps semantics; neither
  edits components. If a dark theme needs a component-level override, the semantic layer is
  missing a role: add it.
- Ramps: 10–12 lightness steps per hue (50…950), generated in OKLCH so equal steps look equal.
- Every surface role has a paired text role (`primary` / `primary-foreground`, `card` /
  `card-foreground`); lint the pair, not the swatch.
- Keep the semantic set small (~15–25 color roles). Add component tokens only where a part
  genuinely diverges; most components read semantics directly.
- In DESIGN.md, primitives live as palette entries, semantics as named `colors:` roles, and
  components under `components:` with `{colors.x}` references.

## shadcn / Tailwind theming via CSS variables

Semantic tokens become CSS custom properties; Tailwind utilities read them; dark mode swaps
the variables, not the markup.

```css
:root {
  --radius: 0.5rem;
  --background: oklch(0.99 0.004 255);   --foreground: oklch(0.21 0.02 255);
  --card: oklch(1 0 0);                  --card-foreground: var(--foreground);
  --primary: oklch(0.55 0.18 255);       --primary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.96 0.006 255);        --muted-foreground: oklch(0.50 0.02 255);
  --border: oklch(0.91 0.008 255);       --ring: var(--primary);
  --destructive: oklch(0.58 0.21 27);
}
.dark {
  --background: oklch(0.18 0.012 255);   --foreground: oklch(0.94 0.006 255);
  --card: oklch(0.22 0.014 255);         --muted-foreground: oklch(0.70 0.02 255);
  --primary: oklch(0.68 0.16 255);       --primary-foreground: oklch(0.18 0.02 255);
  --border: oklch(1 0 0 / 10%);
}
@theme inline {                          /* Tailwind v4: expose vars as utilities */
  --color-background: var(--background); --color-foreground: var(--foreground);
  --color-primary: var(--primary);       --color-primary-foreground: var(--primary-foreground);
  --color-muted-foreground: var(--muted-foreground); --color-border: var(--border);
  --radius-md: var(--radius);            --radius-lg: calc(var(--radius) + 4px);
}
```

- Follow the names the project's shadcn config already uses (`background`, `foreground`,
  `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`,
  `input`, `ring`, `chart-1..5`, `sidebar-*`); add roles, never rename them, so generated
  components keep working. Match the value format already in use (OKLCH in current
  shadcn, bare HSL triplets in older `hsl(var(--x))` setups).
- Tailwind v3: map the same variables in `tailwind.config` `theme.extend.colors` instead of
  `@theme`. One dark-mode strategy per project (`.dark` class or `[data-theme]`), matched to
  the Tailwind `darkMode` / `@custom-variant dark` setting.
- Tokens come from DESIGN.md (`export --format css-tailwind`) or are written by hand; either
  way one source of truth, and generated files are not edited directly.
- Never ship the library's default palette and radius: set at least primary, radius, font
  and neutrals from the project's direction.

## Contrast numbers

Lint every foreground/background pair in every theme and state (rest, hover, placeholder,
selected, focus; disabled is exempt from WCAG but should stay legible):

| Pair | AA minimum | AAA |
|------|-----------|-----|
| Body text (< 24px regular, < 18.66px bold) | 4.5:1 | 7:1 |
| Large text (≥ 24px, or ≥ 18.66px bold) | 3:1 | 4.5:1 |
| UI component boundaries, icons, chart marks | 3:1 vs adjacent color | n/a |
| Focus indicator | 3:1 vs both the component and the background | n/a |

- Target AA as the floor; aim for 7:1 on long-form body text and civic or health products.
- APCA (advisory, not a WCAG pass/fail): roughly Lc ≥ 75 body, ≥ 60 large or UI text,
  ≥ 45 large headlines and non-text. Use it to catch dark-mode pairs that pass WCAG 2 yet
  read poorly.
- Alpha colors (`/ 10%` borders, overlays) are measured as composited over their real
  background, not in isolation.
- Status color never carries meaning alone; the text label or icon must meet the numbers.

## Pitfalls

- Hex colors and negative dimensions must be quoted strings (`"#1A1C1E"`, `"-0.02em"`); unquoted `#` or `-` breaks YAML.
- Do not nest variants (`button-primary.hover` is wrong).
- Typography sub-property typos (`fontwight`) are silently dropped in exports: check names against the schema.
- Reorder prose into canonical section order before saving; consumers expect it.
- `version: alpha` is the current spec version and may change; watch for breaking changes.
- Orphaned tokens are fine for foundations (palette steps) but should be intentional.
- If no CLI is available, check by hand: every `{ref}` resolves, text/background pairs meet 4.5:1 (3:1 large), quoted values, section order, no duplicate headings.

## Done when

Lint exits 0 with no unexplained warnings (or manual checks pass), every foreground/background pair meets the contrast table in both themes, components read semantic tokens only, exports exist if the project consumes them, and the prose explains intent rather than restating values.
