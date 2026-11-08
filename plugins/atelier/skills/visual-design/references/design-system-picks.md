# Choosing a foundation: official design systems vs an aesthetic

Do not recreate by hand what an official package ships, and do not pretend a trend is an official system. One system per project (never Fluent plus Carbon, never shadcn inside a Material app). Do not import a system's tokens then override 90% of them. Check the dependency file before importing and print the install command when a package is missing.

## When the brief reads as a known system

| Brief reads as | Use | Install |
|---|---|---|
| Microsoft / enterprise SaaS | Fluent UI | `npm i @fluentui/react-components` (or `@fluentui/web-components @fluentui/tokens`) |
| Google-ish, Material product | Material Web (M3) | `npm i @material/web` |
| IBM-style B2B / analytics | Carbon | `npm i @carbon/react @carbon/styles` |
| Shopify app surface | Polaris web components | script from the Shopify docs (Shopify admin UI only) |
| Atlassian-style product | Atlaskit + tokens | `@atlaskit/tokens @atlaskit/button ...` |
| GitHub-style devtool | Primer CSS / Primer Brand (marketing) | `npm i @primer/css` or `@primer/react-brand` |
| UK public service | GOV.UK Frontend | `npm i govuk-frontend` |
| US public sector, trust-first | USWDS | `npm i uswds` |
| Fast local-business MVP | Bootstrap 5.3 | `npm i bootstrap` |
| Accessible React base | Radix Themes | `npm i @radix-ui/themes` |
| SaaS where you own components | shadcn/ui (never ship default state: change radii, colors, shadows, type) | `npx shadcn@latest init` |
| Tailwind-based modern SaaS / AI marketing | Tailwind v4 utilities + `dark:` | Tailwind v4 uses `@tailwindcss/postcss` or the Vite plugin, not the `tailwindcss` PostCSS plugin |

## When the brief is an aesthetic

No official package exists; build with native CSS, Tailwind and a maintained component library, and label borrowed inspiration honestly in comments.
- Glassmorphism: `backdrop-filter` + layered borders + highlight overlay; solid fallback for `prefers-reduced-transparency`.
- Bento: CSS Grid with mixed cell sizes. Brutalism: native CSS, mono, raw borders. Editorial: serif type, asymmetric grid, whitespace. Dark tech: mono + neon accent (restrained). Aurora/mesh: layered radial gradients or SVG. Kinetic type: CSS animation, scroll-driven animation, GSAP for hijacks.
- Apple Liquid Glass exists for Apple platforms only. There is no official web package. A web version is an approximation; say so (see `materials-and-patterns.md`).

## Default stack when nothing else is dictated

Match the existing project first. For a new React/Next build: Server Components by default, with motion, scroll listeners and pointer physics isolated in `'use client'` leaf components; Tailwind v4; Motion (`motion/react`) for UI motion and GSAP only for real pin/scrub work (never mix GSAP or Three.js with Motion in one component tree); `next/font` or self-hosted `@font-face` with `font-display: swap` (no render-blocking Google Fonts `<link>` in production); local state for isolated UI and Zustand/Jotai/context only to avoid deep drilling; never `useState` for continuous values (pointer, scroll progress), use motion values.

Breakpoints `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Dark mode via Tailwind `dark:` or semantic CSS variables (`--surface`, `--text-primary`, `--accent`) swapped under `[data-theme=dark]`; pick one strategy per project; keep brand recognisable and hierarchy parity across modes.
