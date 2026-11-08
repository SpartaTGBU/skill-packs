# atelier

Visual design and creative production: web/UI, motion, images and AI video, 3D and CAD, diagrams.

## How it works

- Every atelier skill is on-demand. Load one with `skl load atelier:<name>` or the slash command `/atelier:<name>`.
- Only the router, `atelier:using-atelier`, is visible by default. It says which skill fits a task and how much process to apply.
- Each skill is a working method (brief first, build, then look at the render), not a reference dump.
- Skills pair up: `frontend-design` with `visual-design` and `motion-design`; any render or edit step with `visual-qa`.
- Run `skl list atelier` to see all 26 with their descriptions.

## Skills

### Web and UI

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atelier:frontend-design` | Builds distinctive production front-ends: aesthetic direction, anti-slop rules, UI copy, states, responsive, a11y, checked by rendering. | Landing page, dashboard or component where the look matters or the first draft reads as generic. | "Build a landing page for our bike-repair app that doesn't look like every other SaaS template." |
| `atelier:visual-design` | Type scales, OKLCH color roles and contrast, spacing, grids, radius and elevation, brand-reference tokens, redesign audit. | Choosing or fixing typography, color or spacing, or "make it look like Linear". | "Our settings page looks off. Fix the type scale, spacing and contrast, and keep it close to Stripe's feel." |
| `atelier:design-systems` | Authors, lints, diffs and exports design tokens: DESIGN.md, token tiers, Tailwind/DTCG export, shadcn theming. | You need a theme or token spec that agents and code both consume. | "Write a DESIGN.md for our brand and export the tokens to Tailwind, with a contrast check." |
| `atelier:motion-design` | Interface motion: choreography, easing and duration tokens, springs, micro-interactions, view transitions, scroll motion, reduced-motion paths. | Adding or reviewing animation on a page or component. | "Add a staggered hero reveal and a scroll-driven section transition, with reduced-motion support." |
| `atelier:ui-review` | Reviews UI three ways (file:line code audit, heuristic critique with anti-slop detection, polish pass) into a P0-P3 report. | Before shipping a front-end change, or when asked if a design looks AI-made. | "Review components/Checkout.tsx for accessibility, states and anything that looks generic." |
| `atelier:mobile-native` | Native feel on phones: viewport units, safe areas, input zoom, iOS HIG and Material 3, SwiftUI, Compose, React Native/Expo, haptics. | A PWA or app that "feels like a website" on a phone, or porting web to native. | "Our PWA jumps when the keyboard opens and ignores the notch. Make it feel native on iOS and Android." |
| `atelier:prototype` | Throwaway code that answers one design question: clickable HTML demo, 3-5 variants behind a keyboard picker, or feasibility spikes; records the verdict. | Comparing directions or asking "is this even possible" before committing. | "Mock up four different layouts for the onboarding screen so I can flip between them." |
| `atelier:playground` | Single-file interactive HTML explorer with controls, live preview and a copyable prompt to paste back. | A choice is easier to make by dragging sliders than by describing it. | "Make a playground where I tune the card shadow, radius and spacing, then copy the result as a prompt." |
| `atelier:visual-qa` | Checks rendered output by looking: frame extraction, contact sheets, black-frame/freeze/loudness detection, screenshot diffs, severity report. | After any render, edit or UI change, before delivery. | "QA this exported promo.mp4: contact sheet, black frames, loudness, and any text errors." |

### Motion, animation and video

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atelier:2d-animation` | Character and asset animation: frame-by-frame vs rigged, timing at 12/24/30 fps, sprite sheets, Lottie and Rive, export budgets. | Shipping an animated mascot, loader, empty state or game sprite. | "Animate our mascot waving as a Lottie under 100 KB with a reduced-motion still." |
| `atelier:math-animation` | Manim Community Edition explainers: narration first, one idea per scene, LaTeX, fixed color language, frame-level verification. | Turning a concept, proof or algorithm into a "3Blue1Brown style" clip. | "Make a Manim video explaining how binary search halves the range." |
| `atelier:video-composition` | Programmatic video from HTML/CSS/JS or Remotion: spec, beat-synced motion, captions, deterministic capture, ffmpeg encode, contact-sheet review. | Promo, explainer, caption video or title card generated from code. | "Make a 15-second product promo MP4 with animated captions from this script and audio track." |
| `atelier:video-editing` | Headless ffmpeg editing: probe, stream-copy, trim, concat, crop, grade, captions, loudness, delivery presets in batch. | Cutting, converting or prepping existing footage. | "Trim the first 12 seconds, burn in captions, normalize loudness and export 1080p for YouTube." |
| `atelier:ai-video` | Shot list, shot-grammar prompts, image-to-video from locked keyframes, model routing (Veo, Kling, Seedance, Runway, Wan...), cost check, consent and continuity. | Generating clips, ads or b-roll with an AI video model. | "Turn this 6-shot storyboard into AI video clips for a sneaker ad, and tell me the cost first." |

### Images and generative

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atelier:image-generation` | Raster generation and editing with diffusion/multimodal models: prompt grammar, quoted text, edit-vs-generate, model routing, seeded iteration. | Hero images, product shots, mockups, or a prompt that keeps failing. | "Generate a hero image of a ceramic mug on a walnut desk, and fix the prompt if the text comes out wrong." |
| `atelier:comfyui` | Drives a local ComfyUI server headlessly: API-format workflows, param map, /prompt and /history, ControlNet, LoRA, upscale, inpaint. | Scripting or batching a ComfyUI graph. | "Turn my ComfyUI workflow into a script that renders 20 seeds and saves the graph beside each output." |
| `atelier:asset-pipeline` | Delivery prep: formats (AVIF, WebP, SVG), srcset sizes, compression budgets, color spaces, naming, provenance and license manifest. | Slow or blurry images, an image build step, or tracking asset licenses. | "Optimize everything in /assets for the web with responsive sizes and a license manifest." |
| `atelier:generative-art` | Algorithmic art: philosophy first, then a self-contained p5.js or shader viewer with seeds, sliders and PNG export; ASCII and procedural video. | Flow fields, particles, shader pieces, seeded series. | "Make a p5.js flow-field piece with a seed picker, sliders and PNG export." |
| `atelier:illustration-and-icons` | Vector icons and illustration systems: 24px grids, stroke rules, SVG hygiene (viewBox, currentColor, svgo), code-composed posters. | Building or cleaning an icon set, or composing a poster in code. | "Draw a 12-icon set on a 24px grid with consistent stroke, and clean up the SVGs." |

### 3D, CAD and rendering

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atelier:blender` | Scripted Blender: BRIEF.md, modeling strategy, bpy, headless `blender -b -P`, Cycles/EEVEE, lighting, render-and-look check. | Modeling and rendering a product, prop or room from scripts. | "Write a bpy script that models a desk lamp and renders a headless turntable." |
| `atelier:3d-modeling` | Assets correct for their target: topology, triangle budgets, UVs, PBR sets, LODs, baking, units, glTF/FBX/USD export validated. | Creating or auditing a model for web, game or AR. | "Audit this GLB for a mobile web budget and rebuild the LODs." |
| `atelier:web-3d` | three.js, React Three Fiber or model-viewer: glTF loading, lighting, color management, Draco/Meshopt/KTX2, budgets, blank-canvas checklist. | A 3D hero or product viewer on a site, or a black canvas. | "Add an interactive 3D product viewer to the page; the canvas currently renders black." |
| `atelier:unreal-rendering` | UE5 cinematics and stills: Level Sequences, Movie Render Queue presets, batch rendering, AA samples, EXR/ProRes, path tracer. | Clean, automated Unreal renders; fixing flicker or noise. | "Set up a Movie Render Queue preset for a 4K path-traced product shot and batch it from the command line." |
| `atelier:cad-and-3d-print` | Parametric CAD (OpenSCAD, FreeCAD, build123d, CadQuery) and print prep: walls, overhangs, clearances, orientation, STL/3MF/STEP, manifold checks. | A bracket, enclosure or replacement part, or a mesh that won't print. | "Design a parametric enclosure for a Raspberry Pi in build123d, printable on FDM without supports." |

### Diagrams

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atelier:diagrams` | Picks diagram type and tool (Mermaid, D2, Graphviz, inline SVG); architecture/infra diagrams as standalone HTML; text or screenshot to one-page HTML, render-verified. | Explaining a system, sequence, data model or topology. | "Draw the architecture of our checkout service as a C4 diagram in standalone HTML." |

### Router

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atelier:using-atelier` | Router: says which atelier skill to load and how much process to apply. | Start of any visual task, or when unsure which skill applies. | "I need a launch video for the app. Which atelier skills should I use?" |

## Walkthroughs

### Landing page with scroll motion

1. `atelier:using-atelier` routes the task to web/UI and motion.
2. `atelier:frontend-design` sets the aesthetic direction, copy and page structure, then builds it and checks the render.
3. `atelier:visual-design` fixes the numbers: type scale, OKLCH colors, spacing, contrast.
4. `atelier:motion-design` adds the hero reveal and scroll-driven sections, with reduced-motion paths.
5. `atelier:asset-pipeline` converts hero images to AVIF/WebP with srcset.
6. `atelier:ui-review` produces a P0-P3 report to fix before shipping.

Order matters: direction and system first, so motion decorates a settled layout; review last, on the finished page.

### AI video ad from a shot list

1. `atelier:ai-video` turns the brief into a shot list, one camera move per shot, a prompt per clip, and a cost check before batching.
2. `atelier:image-generation` produces the locked keyframes used for image-to-video, so characters and product stay consistent.
3. `atelier:visual-qa` reviews each generated clip (frames, artifacts, text errors) and rejects bad takes before assembly.
4. `atelier:video-editing` trims, concatenates, grades and normalizes loudness with ffmpeg, then exports delivery formats.
5. `atelier:video-composition` adds animated captions and an end card if the ad needs them.
6. `atelier:visual-qa` runs again on the final MP4 (black frames, loudness, sync) before delivery.
