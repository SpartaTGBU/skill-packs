---
disable-model-invocation: true  # skl: on-demand pack skill
name: ui-engineering-polish
description: "Fix-and-verify pass over existing UI code, organised by symptom with a test per rule: unlabeled controls, lost focus, silent forms, scroll jank, viewport jumps, z-index fights, layout shift. Use when cleaning up a component or page, or reviewing a diff for accessibility or jank; patches code, does not pick the look or design motion. Slices: ui-engineering-polish-a11y (screen reader names, keyboard and focus, form feedback), ui-engineering-polish-perf (scroll and animation jank, mobile viewport, stacking, layout shift, code hygiene)."
---

# UI Engineering Polish

A fix-and-verify pass over UI code that already exists. It does not decide how the product looks or
how motion feels; it makes the implementation reachable, nameable and cheap to render. Work inside
the project's stack and primitives. Never migrate a library to satisfy a rule.

## Slices

| Slice | Load it when | Covers |
|---|---|---|
| `atelier:ui-engineering-polish-a11y` | screen reader says nothing, can't tab to it, focus vanishes, form gives no feedback | A, B, C and their Verify scripts |
| `atelier:ui-engineering-polish-perf` | janks on scroll, animation stutters, mobile viewport jumps, layers fight, layout shifts | D, E and their Verify scripts |

References:
- [references/a11y-fixes.md](references/a11y-fixes.md): fix snippets and keystroke tests per widget.
- [references/motion-cost.md](references/motion-cost.md): cost model, fixes, profiler and frame-delta recipes.

## Invoke

1. **Scope.** Named file, diff or component. Touch only what a rule flags; no renamed props, no new dependency.
2. **Detect the stack** (framework, CSS approach, primitive library, animation library) and reuse it.
3. **Match the user's complaint to a symptom** (A-C in `atelier:ui-engineering-polish-a11y`, D-E in `atelier:ui-engineering-polish-perf`). With no complaint, scan A through E in that order; a fix in A can change markup the later scans read.
4. **Report each finding** as quoted snippet, one-sentence reason, minimal fix, and the test that proves it. If nothing breaks a rule, say so; do not invent findings.
5. **Run Verify** and state which checks ran and which could not.

Source key: `[WCAG]` = WCAG 2.2 criterion; `[ui-skills/fixing-accessibility]`, `[ui-skills/fixing-motion-performance]` and
`[ui-skills/baseline-ui]` = idea taken from that skill in github.com/ibelick/ui-skills (MIT), reworded and
re-tested here; `[practice]` = house judgement, tune freely. Apple HIG (44pt touch target) is cited by name where used.

## Neighbours (split rule, one line each)

- `atelier:ui-ux-intelligence`: chooses UI conventions, patterns and accessibility policy for a product; this skill applies them as code-level defects with tests.
- `atelier:unslop-ui`: removes generic-AI visual and copy tells; this skill fixes code correctness.
- `atelier:ui-review`: judges a whole surface against design intent; this skill patches concrete defects.
- `atelier:motion-design`: chooses easing, duration, choreography and reduced-motion design; this skill only guards the cost and safety of motion already there.
- `atelier:visual-design`, `atelier:frontend-design`, `atelier:design-systems`: decide look, build new pages, own tokens; this skill polishes what they produced.
- `atelier:visual-qa`: screenshot comparison against a target; here checks are DOM, CSS and profiler based.
- `atelier:prototype`, `atelier:html-design-artifacts`: throwaway or single-file pages; apply A, B and D there (names, keyboard and jank matter on throwaway pages too); skip C and E, which assume a real product.
- `atelier:illustration-and-icons`, `atelier:diagrams`, `atelier:logo-design`: asset making; this skill only labels and hides them correctly.
- Video, film, 2D and SVG animation siblings (`atelier:art-motion`, `atelier:launch-film`, `atelier:animation-reverse-engineering`, `atelier:explainer-video`, `atelier:svg-character-animation`, `atelier:audio-review`, `atelier:video-direction`, `atelier:one-line-video`, `atelier:product-demo-video`, `atelier:shot-recipes`, `atelier:video-composition`, `atelier:video-editing`, `atelier:ai-video`, `atelier:math-animation`, `atelier:2d-animation`): authored or rendered animation, not live UI; out of scope. Closest splits: `atelier:art-motion` is expressive canvas/GL motion made as an artwork, `atelier:svg-character-animation` is timeline-authored SVG; this skill only touches animation that runs inside shipped UI.

## Verify

No upstream tooling needed. Scripts run in the DevTools console unless noted.

Per-symptom checks live in the slices: scripts for A-C in `atelier:ui-engineering-polish-a11y`, for D-E in `atelier:ui-engineering-polish-perf`. Shared final step:

1. Re-run the original failing case and diff-review that nothing adjacent changed.

## Do not

- Do not introduce new animation, gradients or glow in this pass. Existing motion may be made cheaper or safer; its easing, timing design and choreography stay with `atelier:motion-design`.
- Do not add ARIA where native HTML already says it.
- Do not suppress focus rings, block paste or use `tabindex` above 0.
- Do not leave `will-change` on permanently or poll scroll position.
- Do not rewrite a component for a small defect or swap UI or animation libraries.
- Do not claim a performance win without a before/after profile, or an a11y pass without a keyboard run.
- Do not cite WCAG 2.5.8 (24px) and 2.5.5 (44px) as the same requirement.
