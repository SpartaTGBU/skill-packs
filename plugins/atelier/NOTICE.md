atelier is a derivative work. Design skills were moved here from forge on 2026-11-01 and extended.

Ported third-party skills:

- https://github.com/anthropics/claude-plugins-official @ f8c5e7a (Apache-2.0 / MIT per plugin): frontend-design, playground

Consolidated from the owner's Hermes skills (some derive from MIT sources: popular-web-designs/VoltAgent
awesome-design-md, claude-design, motion-web-design, architecture-diagram (Cocoon AI), design-md (spec
Apache-2.0), taste-skill, redesign-skill, web-design-guidelines, html-summary, baoyu-infographic,
manim-video, p5js, ascii-video, motion-broll, 3d-print-part-optimization).

Design-skill port (2026-11-09): full content of the loose design skills, copied or merged so atelier
no longer depends on the Hermes copies. All permit redistribution; license texts sit next to the files:

- https://github.com/leonxlnx/taste-skill @ 85fc47e (MIT, Copyright (c) 2026 Leonxlnx): tasteskill v1
  text vendored verbatim (frontmatter removed) as visual-design/references/taste-skill.md; the
  redesign skill from the same repo is visual-design/references/redesign-audit.md.
  License: visual-design/references/LICENSE-taste-skill.txt.
- https://github.com/vercel-labs/web-interface-guidelines @ 434b7f9 (MIT, Copyright (c) 2025 Vercel Labs):
  every rule of command.md merged into ui-review/references/checklist.md.
  License: ui-review/references/LICENSE-web-interface-guidelines.txt.
- https://github.com/NousResearch/hermes-agent @ dedca66 (MIT, Copyright (c) 2025 Nous Research):
  claude-design (author BadTechBandit) design doctrine, merged into
  visual-design/references/design-doctrine.md; popular-web-designs brand files in
  visual-design/references/brands/ (themselves from VoltAgent/awesome-design-md, MIT).
  License: visual-design/references/LICENSE-hermes-agent.txt.
- https://github.com/VoltAgent/awesome-design-md (MIT): 74 brand DESIGN.md files in
  design-systems/references/brands/ (license: design-systems/references/LICENSE-awesome-design-md.txt).
- design-md (Hermes Agent, MIT; Google DESIGN.md spec Apache-2.0) and motion-web-design (owner-authored
  with Hermes Agent, MIT) are merged into design-systems and motion-design.

Design merge (ideas, rules and short tables synthesized and rewritten; no scripts or CLIs bundled):

- https://github.com/emilkowalski/skills @ a81dbca (MIT)
- https://github.com/leonxlnx/taste-skill @ 12af471 (MIT)
- https://github.com/pbakaus/impeccable @ df3a4ab (Apache-2.0)
- https://github.com/heygen-com/hyperframes @ 443ded4 (Apache-2.0)
- https://github.com/ibelick/ui-skills @ 97dea9e (MIT): fixing-accessibility, fixing-motion-performance, baseline-ui ideas, reworded, in ui-engineering-polish

New-domain skills (blender, unreal-rendering, 3d-modeling, web-3d, comfyui, ai-video, image-generation,
2d-animation and others) are original writing informed by the owner's ideas-board research notes and
official vendor documentation. No vendor text is reproduced.

Web-research pass (2026-11-01): techniques were synthesized from public skill listings and READMEs
(e.g. anthropics/skills algorithmic-art and canvas-design, remotion-dev/skills, ffmpeg, Higgsfield,
ComfyUI, blender-mcp and Unreal MCP skill repos). Ideas only; no text or scripts copied.

Motion and film skills (art-motion, launch-film, animation-reverse-engineering): thresholds and ideas
tagged [up] in those skills are restated from these MIT projects; structure and wording are original.
No scripts or text bundled. Pins are default-branch HEAD (main) as of 2026-11-07; all MIT:

- https://github.com/alchaincyf/huashu-art-motion @ 8a0d7d7 (MIT)
- https://github.com/alchaincyf/huashu-motion @ 52467f9 (MIT)
- https://github.com/NiazMorshed2007/reanimate @ 3f7a55a (MIT)

Audio review (audio-review): sound-grammar ranges reported by an upstream project; ideas only, no text or scripts bundled.

- https://github.com/Leonxlnx/earshot @ 4ac3d2a (MIT; default-branch HEAD as of 2026-11-07)

UI skills (unslop-ui, ui-ux-intelligence): figures tagged [H], [pro-max] and [landing] are restated from these MIT
projects, verified against the pinned commits (default-branch HEAD as of 2026-11-07); wording is original, no text or scripts bundled:

- https://github.com/Nutlope/hallmark @ 407fa68 (MIT): [H], gate numbers such as 75
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill @ 4f2dbb6 (MIT): [pro-max]
- https://github.com/elayadesign/ai-design-skills @ 456d9e0 (MIT): [landing] (skills/landing-page-design)

unslop-ui was rewritten on 2026-11-07 with no text, structure or figures taken from the CC-BY-4.0 heydamir/unslop skill (compared against commit HEAD at that date); it is not a source.
