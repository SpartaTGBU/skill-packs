---
disable-model-invocation: true  # skl: on-demand pack skill
name: playground
description: >
  Creates interactive HTML playgrounds: self-contained single-file explorers with controls, a live
  preview and a copyable prompt output the user pastes back to the agent. Use when the user asks
  for a playground, explorer, tuner or interactive visual tool for a topic (design tuning,
  data/query building, concept maps, document critique, diff review, code maps), or when a choice
  is easier to make by dragging sliders than by describing it.
---

# Playground Builder

Related: a throwaway build that answers a feasibility question is `atelier:prototype`; tuning
values that should become tokens goes on to `atelier:design-systems`; charts inside a playground
follow `dataviz`.

A playground is a self-contained HTML file with interactive controls on one side, a live preview on the other, and a prompt output at the bottom with a copy button. The user adjusts controls, explores visually, then copies the generated prompt back to the agent.

## When to use this skill

When the user asks for an interactive playground, explorer, or visual tool for a topic — especially when the input space is large, visual, or structural and hard to express as plain text.

## How to use this skill

1. **Identify the playground type** from the user's request
2. **Load the matching template** from `templates/`:
   - `templates/design-playground.md` — Visual design decisions (components, layouts, spacing, color, typography)
   - `templates/data-explorer.md` — Data and query building (SQL, APIs, pipelines, regex)
   - `templates/concept-map.md` — Learning and exploration (concept maps, knowledge gaps, scope mapping)
   - `templates/document-critique.md` — Document review (suggestions with approve/reject/comment workflow)
   - `templates/diff-review.md` — Code review (git diffs, commits, PRs with line-by-line commenting)
   - `templates/code-map.md` — Codebase architecture (component relationships, data flow, layer diagrams)
3. **Follow the template** to build the playground. If the topic doesn't fit any template cleanly, use the one closest and adapt.
4. **Open in browser.** After writing the HTML file, launch it in the user's default browser (`xdg-open <filename>.html` on Linux, `open` on macOS) or tell the user the path if there is no display.

## Core requirements (every playground)

- **Single HTML file.** Inline all CSS and JS. No external dependencies.
- **Live preview.** Updates instantly on every control change. No "Apply" button.
- **Prompt output.** Natural language, not a value dump. Only mentions non-default choices. Includes enough context to act on without seeing the playground. Updates live.
- **Copy button.** Clipboard copy with brief "Copied!" feedback.
- **Sensible defaults + presets.** Looks good on first load. Include 3-5 named presets that snap all controls to a cohesive combination.
- **Dark theme.** System font for UI, monospace for code/values. Minimal chrome. No remote fonts.
- **State in the URL hash** (optional, cheap): serialize `state` to `location.hash` so a tuned
  setup can be bookmarked or shared; read it on load before applying defaults.

## State management pattern

Keep a single state object. Every control writes to it, every render reads from it.

```javascript
const state = { /* all configurable values */ };

function updateAll() {
  renderPreview(); // update the visual
  updatePrompt();  // rebuild the prompt text
}
// Every control calls updateAll() on change
```

## Prompt output pattern

```javascript
function updatePrompt() {
  const parts = [];

  // Only mention non-default values
  if (state.borderRadius !== DEFAULTS.borderRadius) {
    parts.push(`border-radius of ${state.borderRadius}px`);
  }

  // Use qualitative language alongside numbers
  if (state.shadowBlur > 16) parts.push('a pronounced shadow');
  else if (state.shadowBlur > 0) parts.push('a subtle shadow');

  prompt.textContent = `Update the card to use ${parts.join(', ')}.`;
}
```

## Accessibility

- Every control has a visible `<label>` (or `aria-label` for icon-only buttons); sliders show
  their current value as text next to them.
- Everything works by keyboard: native `<input>`, `<select>` and `<button>`, logical tab order,
  visible focus ring; no click-only `<div>` controls.
- UI text at least 4.5:1 contrast against the dark background; status (copied, error) is not
  conveyed by color alone and is announced via an `aria-live="polite"` region.
- Animated previews honor `prefers-reduced-motion`.

## Verify before handing over

1. Open the file (screenshot at about 1280x800 and a narrow width if the harness allows).
2. Load each preset: the preview changes and the prompt text reads as a sensible instruction.
3. Change one control from default: the prompt mentions it; reset it: the prompt drops it.
4. Click copy: the clipboard holds the prompt (a `navigator.clipboard` failure on `file://`
   falls back to selecting the text) and the feedback shows.
5. Console is clean; no network requests.

## Common mistakes to avoid

- Prompt output is just a value dump → write it as a natural instruction
- Too many controls at once → group by concern, hide advanced in a collapsible section
- Preview doesn't update instantly → every control change must trigger immediate re-render
- No defaults or presets → starts empty or broken on load
- External dependencies → if CDN is down, playground is dead
- Prompt lacks context → include enough that it's actionable without the playground
