---
disable-model-invocation: true  # skl: on-demand pack skill
name: brand-guidelines
description: >
  Captures a brand (positioning, voice, tone, terminology, visual identity, do/don't rules) into a
  reusable BRAND.md, applies it to new content, and reviews drafts against it. Use when the user
  wants to define or document their brand voice or style guide, says "make this sound like us",
  "on-brand", "check this against our brand", needs a style guide for writers or agents, or before
  writing copy, social posts, emails or pages that must match an existing brand.
---

# Brand guidelines

Three modes. Pick from the request, say which one you are in:

| Mode | Trigger | Output |
|------|---------|--------|
| **Capture** | No brand doc, or "define/document our brand" | BRAND.md (template: `references/BRAND-template.md`) |
| **Apply** | "Write X on-brand", any atrium writing skill | Content plus a short note on which brand choices drove it |
| **Review** | "Is this on-brand?", pre-publish check | Deviations by severity with before/after fixes |

Always look for an existing brand doc first: `BRAND.md`, `brand/`, `docs/brand*`, `style-guide*`,
`DESIGN.md`, a voice section in README or CLAUDE.md. If one exists, use it; do not re-capture
unless asked or it is clearly stale or contradicted by the user.

## Capture

### 1. Gather evidence (more sources = higher confidence)

Ask for whichever of these exist. Do not stall if only one does:
- The user's own website, product, docs, about page (read with WebFetch only if the user gives the URL).
- Existing brand decks, pitch decks, style guides, past campaigns.
- 3–10 pieces of content the user considers "most us" and 1–3 they consider "not us".
- Call or interview transcripts, founder posts, support replies (real customer-facing language).
- A plain-words description: who it is for, what it does, what it must never sound like.
- Visual assets: logo files, colour codes, fonts in use, screenshots.

Redact personal data (customer names, emails, phone numbers) from any example you quote.

### 2. Discovery questions (ask only what the evidence does not answer)

- Who is the primary audience, and what do they already believe about this category?
- What is the one thing the brand wants to be known for? What does it refuse to be?
- Three words for the personality. Three words it must never be confused with.
- Which competitor or adjacent brand do you sound closest to, and how are you different?
- Where does the tone change: support, sales, error messages, legal, social, crisis?
- Fixed terms: product names, capitalisation, words that are banned or required.
- Formality: contractions, jargon, humour, emoji, exclamation marks, first person plural or singular.

### 3. Extract patterns, do not invent them

For each voice attribute, find it in the evidence. Quote the line that proves it. Rate confidence:
- **High**: seen in 3+ independent sources.
- **Medium**: 1–2 sources, or inferred from consistent style.
- **Low**: single source, or sources conflict. Put it in Open Questions, not in the rules.

When sources conflict (deck says "playful", support replies are formal), do not average them.
Record both, ask the user which wins, and note the context where each applies.

### 4. Write BRAND.md

Use `references/BRAND-template.md`. Required sections:
1. Metadata: version, date, sources used, overall confidence.
2. Positioning: one-sentence what/for whom/why different. Audience and their main problem.
3. Personality: 3–5 traits.
4. **We are / We are not** table: each row a trait and its failure mode ("Direct, not blunt").
5. Voice attributes: each with a definition, a "sounds like" example, a "does not sound like" example,
   and the evidence it came from.
6. Tone matrix: voice stays constant, tone flexes. Rows per context (marketing page, social,
   onboarding, support, error/incident, sales email, legal) with formality, energy, humour, length.
7. Messaging pillars: 3–5 claims the brand repeats, each with its proof point (real, sourced).
8. Terminology: must-use, preferred (use X not Y), avoid, never. Product names with exact casing.
9. Style mechanics: Oxford comma, heading case, contractions, numerals, dates, units, emoji policy,
   exclamation marks, first/second person, spelling variant (US/UK).
10. Visual identity: colour palette as hex with role (primary, accent, surface, text, semantic) and
    usage ratios; type families with role and weights; logo variants, clear space, minimum size,
    misuse list; imagery and illustration style; iconography.
11. Accessibility: WCAG AA contrast for every text/background pair you list (4.5:1 body, 3:1 large
    text and UI). Flag any brand pair that fails and propose the nearest passing shade.
12. Do / Don't list: concrete, testable rules, 5–10 each.
13. Open questions: unresolved items, each with your recommendation.

Keep it short enough to be read before every writing task: aim for 1–3 pages. Put long example
libraries in an appendix or a separate file.

### 5. Approve, then save

Show the draft, highlight Low-confidence items and Open Questions, and write the file only after
the user approves. If replacing an existing BRAND.md, archive the old one as `BRAND-YYYY-MM-DD.md`
first and bump the version. Default location: project root, or where the user's docs live.

For design tokens and UI implementation of the visual identity, hand off to atelier:frontend-design.

## Apply

1. Load BRAND.md (or the user's equivalent). If none exists, offer a 5-minute capture or proceed
   with the user's stated voice and say the result is unanchored.
2. Identify the context row in the tone matrix. Keep voice attributes fixed; set tone from the row.
3. Use terminology exactly. Never introduce a banned word, even in headings or alt text.
4. Use only the messaging pillars' approved proof points. If a claim needs proof the doc lacks,
   write `[NEED: proof for ...]` instead of inventing it.
5. After the content, add 2–4 lines: which attributes and rules shaped the main choices, and any
   place you had to guess.

## Review

Check the draft against every section, in this order:
1. **Terminology**: banned/avoided words, product-name casing, required terms.
2. **Voice**: each attribute, using the "does not sound like" examples as the failure test.
3. **Tone**: matches the context row (too casual for an incident note, too stiff for social).
4. **Messaging**: claims trace to a pillar and proof point; nothing contradicts positioning.
5. **Mechanics**: comma, case, numbers, dates, emoji, exclamation marks.
6. **Visual** (if layouts, slides or images are included): palette, type roles, logo use, contrast.
7. **Legal and claims flags** (flag, do not rule): superlatives ("best", "#1", "fastest") without
   substantiation, competitor comparisons, testimonials and endorsements (need permission and
   typical-results context), pricing or guarantee language, regulated claims (health, finance),
   missing required disclaimers. Recommend legal review for anything high-stakes.

Report as a table: severity (Must fix / Should fix / Nice to have), location, issue, rule violated,
suggested rewrite. End with a one-line verdict: ship, ship after must-fixes, or rework.

Severity guide:
- **Must fix**: banned term, wrong product name, unsubstantiated claim, legal flag, failed contrast.
- **Should fix**: off-tone for the context, generic phrasing a competitor could use, mechanics drift.
- **Nice to have**: tightening, a stronger brand-specific word choice.

## Rules

- Evidence over invention: every rule in BRAND.md traces to a source or an explicit user decision.
- Never fabricate proof points, customer quotes, awards or metrics for pillars.
- Do not copy another company's guidelines; brands are distinct by definition.
- One brand doc per brand. Sub-brands get a short delta section, not a fork.
- Revisit when positioning, audience or product changes; keep the version and date current.

## Related

atrium:copywriting, atrium:copy-editing, atrium:social-media and atrium:content-strategy load
BRAND.md before writing. forge:humanizer for stripping AI tells while keeping the voice.
atelier:frontend-design for turning the visual identity into UI.
