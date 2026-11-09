forge is a derivative work merging the following MIT-licensed projects:

- https://github.com/mattpocock/skills @ a496f55  (Copyright (c) 2026 Matt Pocock)
- https://github.com/dietrichgebert/ponytail @ 96608e0  (Copyright (c) 2026 DietrichGebert)
- https://github.com/affaan-m/ECC @ 91b5f6a  (Copyright (c) 2026 Affaan Mustafa)
- https://github.com/multica-ai/andrej-karpathy-skills @ 2c60614  (license: MIT per plugin.json)
- https://github.com/obra/superpowers @ 2ce8aa1  (Copyright (c) 2025 Jesse Vincent)

Ported third-party skills (harness-native versions):

- https://github.com/akin-ozer/cc-devops-skills @ 276af75 (Apache-2.0) - 31 devops generator/validator skills
- https://github.com/WenyuChiou/ai-research-skills catalog -> research-hub @ 9cbf601, academic-writing-skills @ 404eb2a, zotero-skills @ e390313, codex-delegate @ 5592763, antigravity-delegate @ 49d9569 (MIT) - 17 research skills + research-lifecycle router
- https://github.com/anthropics/claude-plugins-official @ f8c5e7a (Apache-2.0 / MIT per plugin): pr-review-toolkit, skill-creator, session-report, claude-md-management, frontend-design, playground, rust-analyzer-lsp, gopls-lsp, mcp-tunnels, mcp-server-dev
- https://github.com/microsoft/SkillOpt @ bc0a392 (MIT) - skillopt-sleep
- https://github.com/headroomlabs-ai/headroom @ 1fe8549 (Apache-2.0) - headroom usage skill (runtime not bundled)

Consolidated from the owner's Hermes skills (some derive from MIT sources: popular-web-designs/VoltAgent awesome-design-md, claude-design, motion-web-design, architecture-diagram (Cocoon AI), design-md (spec Apache-2.0), humanizer (blader/humanizer, Siqi Chen), spike (GSD)): debugging, tdd, handoff, code-review, prototype, brainstorming, writing-skills, frontend-design, visual-design, motion-design, design-systems, ui-review, diagrams, github, debugger-cli, dogfood-qa, output-completeness, humanizer, research, codebase-onboarding.

Design merge (ideas, rules and short tables synthesized, rewritten; no scripts or CLIs bundled) into frontend-design, visual-design, motion-design, ui-review, prototype, mobile-native and video-composition:

- https://github.com/emilkowalski/skills @ a81dbca (MIT)
- https://github.com/leonxlnx/taste-skill @ 12af471 (MIT)
- https://github.com/pbakaus/impeccable @ df3a4ab (Apache-2.0)
- https://github.com/heygen-com/hyperframes @ 443ded4 (Apache-2.0)

- forge:hill-climb draws on Theo Browne (t3.gg) videos on hill climbing with agents (youtube.com/watch?v=xq0eB8vxeqk, NBCM_ZoWZo8, uLGxb4F3SyI); forge:goal paraphrases Claude Code's /goal and ProposeGoal behavior.
