---
name: using-atelier
description: >
  Router for the atelier visual design skill set: web/UI, design systems, motion, 2D animation,
  generative art, images, ComfyUI, AI video, video editing, Blender and 3D, web 3D, Unreal
  rendering, CAD and 3D printing, diagrams. Says which atelier skill to load and how to scale
  process to the job. Use at the start of any visual or creative task, or when unsure which
  design skill applies.
---

# Using atelier

Atelier covers everything visual. **Discovery, taste and QA are thorough; implementation is lean
(forge:ponytail).** Decide the look on purpose, build it with the tools already in the project,
then look at the real output (screenshot, render, frame grab) before calling it done.

## How to load a pack skill

Pack skills (`forge:*`, `atrium:*`, `atelier:*`) are **not** in the Skill tool, to keep context
small. Load one through Bash, only when the work needs it, and follow it as if it were invoked:

- `skl load forge:rust` (several names at once is fine) prints the skill and its directory
- `skl search <words>` finds the right one; `skl list [pack]` lists them all
- If `skl` is not on PATH: run `<forge plugin root>/bin/skl`. The forge router injected at session start ends with the `forge plugin root:` line.

Load the one or two you need, not the whole route. After compaction, re-load any you still need.

**Hubs and slices.** audio-review, launch-film, product-demo-video, video-direction,
ui-engineering-polish, ui-ux-intelligence and svg-character-animation are hubs. Load the hub first.
Its `## Slices` table names the slice (`<hub>-<mode>`) that holds that mode's steps. When you already
know the mode, load that slice directly; each slice works on its own.

## User instructions override skills

The user's brief, brand, existing design system and stack win over any default here. Skills
override generic habits. A subagent dispatched for a specific task follows its prompt, plus the
one skill it was pointed at.

## Size the job first

| Size | Signals | Route |
|------|---------|-------|
| **Trivial** | Tweak a color, swap an icon, re-export a file | Do it; check the result once. |
| **Small** | One component, one image, one short clip, one model edit | Load the one matching skill → build → atelier:visual-qa or a screenshot. |
| **Medium** | A page, a motion sequence, an asset set, a scene | Short discovery (forge:brainstorming) → skill(s) → build → review pass. |
| **Large** | Site redesign, brand system, video piece, 3D pipeline | brainstorming → design direction approved → design-systems/tokens → build in slices → full review (ui-review / visual-qa). |

## Discovery (before any pixels)

Ask or infer: audience and use, medium and delivery format (web, 1080p/4K video, print, game
engine, 3D print), brand constraints, references the user likes, existing assets and tools,
deadline and budget (render time, GPU, paid services). Name an aesthetic direction in one line
before building. Reuse the project's tokens, components and pipelines.

## Which skill when

**Web and UI**
- Build or restyle a page, screen or component → `atelier:frontend-design`
- Type, color, spacing, layout, hierarchy numbers → `atelier:visual-design`
- Anti-slop landing page, portfolio or marketing site (taste dials, full tasteskill rules) → `atelier:visual-design`
- Upgrade an existing site without breaking it (redesign audit) → `atelier:visual-design`
- Page styled like a known brand (Stripe, Linear, Vercel; 74 brand systems) → `atelier:visual-design`, token file via `atelier:design-systems`
- Tokens, DESIGN.md, brand look as a reusable spec → `atelier:design-systems`
- Audit an existing UI (a11y, polish, anti-slop, Vercel Web Interface Guidelines) → `atelier:ui-review`
- Open direction: which style, palette, fonts fit this product (before building) → `atelier:ui-ux-intelligence`
- UI looks AI-generated or vibecoded; repair it → `atelier:unslop-ui`
- Fix UI code by symptom (focus, screen reader, jank, viewport) → `atelier:ui-engineering-polish`
- Mockup, clickable prototype, wireframes or HTML deck as one file (one-off designed artifact) → `atelier:html-design-artifacts`
- Throwaway build to answer a design question → `atelier:prototype`
- Interactive single-file explorer or tweakable demo → `atelier:playground`
- iOS / Android / React Native / Flutter UI → `atelier:mobile-native`

**Motion and 2D**
- UI transitions, micro-interactions, scroll effects → `atelier:motion-design`
- Animate in a named art style (Van Gogh, ukiyo-e, pixel) or explainer grammar → `atelier:art-motion`
- Bring a drawn SVG character or mascot alive (blinks, idle, acting) → `atelier:svg-character-animation`
- Clone or measure an existing animation, match it with numbers → `atelier:animation-reverse-engineering`
- Frame-by-frame, rigged 2D, sprites, Lottie/Rive → `atelier:2d-animation`
- p5.js, shaders, ASCII, procedural visuals → `atelier:generative-art`
- Explainer math or technical animation (Manim) → `atelier:math-animation`

**Video**
- HTML/code-driven video, titles, motion graphics → `atelier:video-composition`
- Cut, color, audio, captions, encode (ffmpeg, NLEs) → `atelier:video-editing`
- Text/image-to-video (Higgsfield, Kling, Veo, Runway and others) → `atelier:ai-video`
- Check frames and renders for defects before delivery → `atelier:visual-qa`
- Whole film from one line, with review room → `atelier:one-line-video`
- Launch film or product promo from real product material → `atelier:launch-film`
- Direct, storyboard or fix any coded video (hook, beats, pacing) → `atelier:video-direction`
- Remotion promo shot list, beat-synced cuts, SFX → `atelier:shot-recipes`
- Scripted browser flow (Playwright) to demo video → `atelier:product-demo-video`
- Narrated how-it-works explainer with synthesized voice → `atelier:explainer-video`
- Loudness, mix and sound-choice QA without listening → `atelier:audio-review`

**Images**
- Prompting and choosing image models → `atelier:image-generation`
- Node workflows, ControlNet, LoRA, batch via API → `atelier:comfyui`
- Icons, illustrations, SVG, vector style systems → `atelier:illustration-and-icons`
- Logo, wordmark, monogram, app-icon mark → `atelier:logo-design`
- Formats, sizes, compression, naming, provenance → `atelier:asset-pipeline`

**3D**
- Blender modeling, shading, lighting, headless renders → `atelier:blender`
- Topology, UVs, LOD, export to engines/web → `atelier:3d-modeling`
- three.js / R3F / glTF on the web → `atelier:web-3d`
- UE5 cinematics, Movie Render Queue, path tracing → `atelier:unreal-rendering`
- Parametric CAD, FreeCAD/OpenSCAD, printable parts → `atelier:cad-and-3d-print`

**Diagrams**
- Architecture, flow and infra diagrams; one-page HTML summaries → `atelier:diagrams`

## Cross-plugin pointers

- Charts, dashboards, data viz → `dataviz`
- Brand voice and identity docs → `atrium:brand-guidelines`; decks → `atrium:pptx`
- Social and ad creative specs → `atrium:social-media`, `atrium:paid-ads`
- Research references, vendor docs, prior art → `forge:research`
- Code changes behind a design → `forge:ponytail`, then `forge:code-review`
- QA a running web app → `forge:dogfood-qa`; before saying done → `forge:verification`
- UI or marketing copy that reads as AI-written → `forge:humanizer`

## Rules that apply to every skill

- Commit to one direction; no generic defaults (purple gradients, centered hero plus three cards,
  stock glassmorphism, default model looks). Every choice should trace to the subject.
- Use concrete numbers: sizes, durations, easings, fps, resolutions, bitrates, samples, poly counts.
- Prefer scriptable, reproducible pipelines (CLI, headless, API workflows) and keep the source
  files: prompts, seeds, node graphs, .blend, project files.
- Accessibility is not optional: contrast, focus, reduced motion, captions, alt text.
- Track the license and provenance of every asset, font and model. Get consent before using a real
  person's likeness or voice.
- Look at the output. A render you didn't view, or a page you didn't screenshot, isn't done.

## Reply

Lead with the result: what was made, where it lives, and how it was checked (screenshot, frames,
render stats). Note open choices the user may want to change. Keep the process notes short.
