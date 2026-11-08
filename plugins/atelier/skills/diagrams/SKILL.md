---
disable-model-invocation: true  # skl: on-demand pack skill
name: diagrams
description: >
  Picks the right diagram type and tool (C4, sequence, flow, state, ERD, network; Mermaid, D2,
  Graphviz or hand inline SVG), produces architecture and infrastructure diagrams as standalone
  HTML with inline SVG, and turns text, docs or a screenshot into a one-page HTML summary verified
  by a render loop. Use when asked to diagram a system, draw a service/cloud/network topology,
  sequence or data model, make an architecture overview, summarize content as a one-page HTML
  report, or recreate a screenshot as HTML.
---

# Diagrams and One-Page HTML

Three outputs: diagrams-as-code that live next to the source (Mermaid/D2/Graphviz), a standalone architecture/infra diagram as one HTML file with inline SVG (section A), and a one-page HTML summary of content or a screenshot (section B). Every output is rendered and looked at before it is reported. General visual decisions: `atelier:visual-design`. Auditing the resulting HTML: `atelier:ui-review`. Charts of data: `dataviz`, not this skill. Animated explainers: `atelier:motion-design`.

Files (under `~/.claude/local-plugins/forge-marketplace/plugins/atelier/skills/diagrams/`): `templates/architecture.html` (working examples of every component, arrow, boundary, legend), `templates/summary-base.html` (token-based page skeleton), `references/summary-design-rules.md` (rules plus a 15-item pass/fail rubric), `scripts/render-check.mjs` (optional verifier), `references/render-report-schema.md`.

## 1. Choose the diagram type

Start from the question the reader needs answered, not from the tool. One diagram answers one question.

| Reader's question | Type | Notes |
|---|---|---|
| What is the system and who uses it? | C4 L1 context | One box for the system, people and external systems around it. No tech. |
| What runs where, and how do the parts talk? | C4 L2 container | Apps, services, DBs, queues; label tech and protocol. The usual "architecture diagram". |
| How is one container built inside? | C4 L3 component | Only for a container with real internal seams. Skip if the code is small. |
| How is a component coded? | C4 L4 code | Almost never draw it; generate from code (class/ERD) if needed. |
| What happens, in what order, for one request? | Sequence | Lifelines left to right in call order; one scenario per diagram; show errors/async explicitly. |
| What are the steps and decisions? | Flowchart / activity | One start, explicit end(s), decisions as yes/no labeled branches. |
| What states can X be in? | State machine | Every state reachable, every transition labeled with event[guard]. |
| How is the data shaped? | ERD | Entities, keys, cardinality (crow's foot); omit audit columns. |
| Where is it deployed, what can reach what? | Network / deployment | Regions, VPCs, subnets, security groups, ports; trust boundaries drawn. |

Zoom levels do not mix: no classes on a container diagram, no subnets on a context diagram. If one view needs more than about 9 nodes, split it by C4 level or by subsystem and link the views.

## 2. Choose the tool

Prefer what the repo already uses (grep for ` ```mermaid `, `*.d2`, `*.dot`, `*.puml`). Diagrams-as-code are committed next to the code they describe, so they get reviewed and updated with it; check in the rendered SVG only if the host cannot render the source.

| Tool | Use when | Render |
|---|---|---|
| Mermaid | Docs on GitHub/GitLab/most wikis; flow, sequence, state, ER, C4, gantt | Renders inline in Markdown. SVG: `npx -p @mermaid-js/mermaid-cli mmdc -i in.mmd -o out.svg` |
| D2 | Architecture/container views that need better auto-layout, nested containers, themes | `d2 --layout=elk in.d2 out.svg` (dagre default; ELK for orthogonal edges) |
| Graphviz | Large generated graphs (deps, call graphs, pipelines), precise rank control | `dot -Tsvg in.dot -o out.svg`; `rankdir=LR`, `subgraph cluster_*` for groups |
| Inline SVG (section A) | One polished, presentation-grade standalone file; full control of layout and look | Hand-placed; no tooling |

None of these CLIs is assumed installed; check with `command -v` and ask before installing. Do not add a diagram library to an app's dependencies to draw a doc diagram. A render that fails is a bug: fix the syntax, never ship unrendered source in a doc that will not render it.

## 3. Layout and labeling rules

- One primary direction of flow: left to right for request paths and pipelines, top to bottom for layers and hierarchies. Users/clients start at the left or top; data stores sit at the right or bottom.
- Minimize edge crossings: reorder nodes before adding bends. Prefer orthogonal or straight edges; no edge passes under a node it does not touch.
- Align to a grid (8px or the template's 40px); equal spacing between siblings; group related nodes inside a labeled boundary (system, region, VPC, team) rather than with color alone.
- Node label: noun name on line 1, technology or kind on line 2 (`Orders API` / `Go, gRPC`). No abbreviations the reader has not seen.
- Edge label: verb phrase plus protocol or payload (`publishes OrderPlaced [Kafka]`, `reads [SQL/TLS]`). Arrows point in the direction of the call or data flow; say which in the legend. Label every edge that is not obvious.
- Every diagram has a title, a one-line scope ("Container view, checkout path, as of 2026-11"), and a legend for every color, shape and line style used.
- Content fidelity: show only components and links the user described or the code proves; mark inferred ones (dashed outline or `(inferred)`).

## 4. Accessible color and text alternatives

- Color is never the only signal: pair each semantic color with a shape, icon, label or dash pattern (e.g. async = dashed, security = dashed rose plus a lock label).
- Contrast: text at least 4.5:1 against its fill; strokes and arrows at least 3:1 against the background. The section A palette passes on `#020617`; re-check any change.
- Use a colorblind-safe set (avoid red/green as the only distinction); keep at most about 7 semantic colors.
- Inline SVG: `role="img"` and `aria-labelledby` pointing at a `<title>` (short name) and `<desc>` (one or two sentences of what it shows). Decorative grids get `aria-hidden="true"`.
- Provide a text alternative next to the diagram: a short list or table of nodes and edges, or the diagram source in a collapsed `<details>`. In Markdown, Mermaid source is its own text alternative; add one sentence of takeaway under it.
- Support both themes where the host does: Mermaid `theme: neutral` reads on light and dark; standalone HTML sets `color-scheme` and keeps its own background.
- Text in the SVG stays at least 7px at 1x and is real `<text>`, not outlined paths, so it scales and can be searched.

## A. Architecture diagram (standalone HTML)

Best for software layers, cloud (VPC, regions, subnets, managed services), microservice and mesh topology, API and database maps, deployments. For science, floor plans, narrative journeys or whiteboard sketches a more specific tool fits better; this skill is a fine generic SVG fallback but carries the dark technical look.

### Invoke
1. Gather components, connections, technologies, trust/security boundaries, and what the reader must take away. Ask only for what is missing.
2. Read `templates/architecture.html` for the exact structure, then write one `.html` file (default `./<project>-architecture.html`, or the user's path).
3. Render and look (see Verify); fix overlaps before reporting. Give the user the path.

### Visual language
- Semantic color per component type (fill `rgba`, stroke hex): frontend `rgba(8,51,68,.4)` / `#22d3ee`; backend `rgba(6,78,59,.4)` / `#34d399`; database `rgba(76,29,149,.4)` / `#a78bfa`; cloud `rgba(120,53,15,.3)` / `#fbbf24`; security `rgba(136,19,55,.4)` / `#fb7185`; message bus `rgba(251,146,60,.3)` / `#fb923c`; external `rgba(30,41,59,.5)` / `#94a3b8`. Keep the mapping consistent and put it in the legend.
- Monospace type from the local system stack (no remote fonts): 12px names, 9px sublabels, 8px annotations, 7px tiny labels. Background `#020617` with a 40px grid pattern.
- Components: rounded rects (`rx="6"`, 1.5px stroke). Draw an opaque `#0f172a` rect first, then the translucent styled rect on top so arrows behind do not show through.
- Draw arrows right after the grid so they render behind boxes; arrowheads via SVG `<marker>`. Security flows dashed rose `#fb7185`; security groups dashed (`4,4`) rose; regions large dashed (`8,4`) amber `rx="12"`.
- Spacing: services about 60px tall (large components 80-120), at least 40px between them, message buses in the gap between services, not over them. The legend sits outside all boundaries, at least 20px below the lowest one.
- Document shell: header (title and subtitle), the SVG in a rounded bordered card, three summary cards below (key flows, tech choices, risks or notes), minimal footer. A CSS-only pulse on the header dot is the only animation; honor `prefers-reduced-motion`.
- One file, no external dependencies, no JavaScript, valid in any modern browser.

## B. One-page HTML summary

Produces ONE self-contained `.html` (inline CSS, inline SVG or data-URI images, no CDN, no remote fonts or images unless the user opts in). Use the tokens in `templates/summary-base.html`; do not invent ad-hoc colors or spacing. Never invent facts that are not in the input.

**Mode A, content to HTML.** (1) Plan: outline title, one-sentence lead, 3-7 sections, and which items become cards, stat blocks, lists, tables or code. (2) Copy the base template, fill placeholders; one accent, 4px spacing grid, body measure at most 75ch. (3) Render and check. (4) Grade the 15-item rubric in `references/summary-design-rules.md` against the screenshots. (5) Fix only what failed. Repeat.

**Mode B, screenshot to HTML.** (1) Inspect the reference: grid, sections, type sizes, colors, spacing, pixel size; render at that viewport. (2) Build from the base template with tokens overridden to match. (3) Render with the reference for a pixel diff; target `diffScore` at most 0.05 (0.02 for flat UIs, 0.10 if the reference has photos or fonts unavailable offline; say which). Fix the biggest diff regions first: layout, then spacing, color, type.

**Stop** on: success (checks and rubric pass; Mode B diff target met); budget (4 render iterations); plateau (an iteration fixes nothing or diff improves < 0.005); or blocked (renderer cannot run after one setup retry). Report the output path, iterations used, final status, remaining failures and screenshot paths. Never claim a pass without evidence.

## Verify (every output)

- Diagrams-as-code: render to SVG with the tool's CLI (or the host's preview) and look at it. Check: no overlapping labels, no edge crossing a node, flow direction consistent, legend matches what is drawn, text readable at 100% zoom.
- HTML: your harness's browser or screenshot tool at 1280x800 and 390x844; look for overlap, clipped text, horizontal scroll, low contrast. A wide diagram may scroll horizontally inside its card on mobile; the page itself must not.
- Optional scripted check (Node + Playwright; downloads a browser, so run only with the user's consent, from a scratch copy so the skill stays clean):
```bash
mkdir -p /tmp/render-check && cp ~/.claude/local-plugins/forge-marketplace/plugins/atelier/skills/diagrams/scripts/* /tmp/render-check/ && cd /tmp/render-check && npm install && npx playwright install chromium
node /tmp/render-check/render-check.mjs page.html --out render --viewports 1280x800,390x844 [--ref ref.png --diff-threshold 0.05]
```
It reports console errors, failed requests, horizontal overflow, clipped text, axe color-contrast violations and (with `--ref`) pixel diff to `render/report.json` (schema in `references/render-report-schema.md`; exit 0 pass, 1 failures, 2 runtime error). Local files only; no network calls beyond what the page requests.

## Common mistakes

- Mixing zoom levels, or one giant diagram of everything: split it.
- Unlabeled arrows, or arrows that mean "calls" in one place and "data flows" in another.
- Color-only meaning; a legend that lists colors not used, or uses colors not listed.
- Drawing what the system should be while calling it what it is: say "proposed" in the title.
- Reporting a diagram that was never rendered.
