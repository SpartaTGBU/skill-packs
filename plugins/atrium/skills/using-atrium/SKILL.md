---
name: using-atrium
description: >
  Router for the atrium business skill set: says which atrium skill to load for documents
  (Word, Excel, PowerPoint, PDF), brand and copy, SEO, growth, sales, CRM and customer success,
  finance, strategy and contracts, and how to scale discovery to the job. Use at the start of any
  business, marketing, sales or office-document task, or when unsure which atrium skill applies.
---

# Using atrium

Atrium is one business skill set built from several popular libraries. **Discovery and review are
thorough; output is lean and usable.** The deliverable is the smallest thing that does the job (a
doc, sheet, sequence, brief), in the user's voice and brand, ready to ship.

## How to load a pack skill

Pack skills (`forge:*`, `atrium:*`, `atelier:*`) are **not** in the Skill tool, to keep context
small. Load one through Bash, only when the work needs it, and follow it as if it were invoked:

- `skl load forge:rust` (several names at once is fine) prints the skill and its directory
- `skl search <words>` finds the right one; `skl list [pack]` lists them all
- If `skl` is not on PATH: `~/.claude/local-plugins/forge-marketplace/plugins/forge/bin/skl`

Load the one or two you need, not the whole route. After compaction, re-load any you still need.

User instructions (CLAUDE.md, direct requests) override skills; skills override defaults.

## Size the job first

| Size | Signals | Route |
|------|---------|-------|
| **Trivial** | A quick edit, a question, one line of copy | Just do it. No ceremony. |
| **Small** | One clear deliverable, context known | Load the one matching skill → deliver → check against its checklist. |
| **Medium** | Several deliverables, or the audience/goal is unclear | Discovery questions first → the matching skills in order → review pass. |
| **Large** | A plan, launch, audit or model that drives decisions | Discovery → `atrium:customer-research` / `atrium:competitive-intel` if evidence is thin → plan skill → execution skills → review against goals. |

## Before anything: discovery

- If `.agents/product-marketing.md` exists in the project, read it first (product, audience,
  positioning, voice). It is optional; never create it unless asked.
- Otherwise gather what the job needs: business and offer, audience, goal and success metric,
  constraints (budget, deadline, channels, compliance), and existing assets or data. Ask for what is
  missing; one question at a time when it matters, a short list when it doesn't.

## Which skill when

**Documents**
- Word docs, reports, letters, tracked changes → `atrium:docx`
- Spreadsheets, models, CSV cleanup, formulas, charts in Excel → `atrium:xlsx`
- Slide decks → `atrium:pptx`
- Read, fill, merge, split or create PDFs → `atrium:pdf`

**Brand and content**
- Brand voice, visual identity, guideline doc → `atrium:brand-guidelines`
- Write landing pages, headlines, ads, product copy → `atrium:copywriting`
- Edit or tighten existing copy → `atrium:copy-editing` (then `forge:humanizer` to strip AI tells)
- What to publish, topic clusters, editorial calendar → `atrium:content-strategy`
- Social posts, threads, channel plans → `atrium:social-media`

**SEO**
- Site health, technical and on-page audit → `atrium:seo-audit`
- Keywords, intent, clustering → `atrium:keyword-research`
- Google Business Profile, local pack, citations, reviews → `atrium:local-seo`
- Showing up in AI answers (ChatGPT, Perplexity, AI Overviews) → `atrium:ai-visibility`
- Who outranks you and why, content gaps → `atrium:seo-competitors`
- Backlinks, digital PR, outreach for links → `atrium:link-building`
- Template pages at scale (locations, integrations, comparisons) → `atrium:programmatic-seo`
- JSON-LD structured data → `atrium:schema-markup`
- Write or refresh an article that should rank → `atrium:seo-content`

**Growth**
- Conversion of a page, signup, onboarding or paywall → `atrium:cro`
- Newsletters, nurture and lifecycle sequences → `atrium:email-marketing`
- Google/Meta/LinkedIn ads, creative, budgets → `atrium:paid-ads`
- Tracking plans, UTMs, attribution, reading the numbers → `atrium:marketing-analytics`

**Sales**
- Ideal customer profile, account and lead lists → `atrium:icp-and-prospecting`
- Cold email and LinkedIn sequences → `atrium:cold-outreach`
- Scoring and qualifying leads (BANT, MEDDICC) → `atrium:lead-qualification`
- Call prep, discovery and demo scripts, objection handling, call notes → `atrium:sales-calls`
- Proposals, SOWs, quotes → `atrium:proposals`
- Stages, forecast, deal reviews → `atrium:pipeline-management`
- Battlecards, one-pagers, playbooks → `atrium:sales-enablement`

**CRM and customers**
- Dedupe, field hygiene, CRM structure → `atrium:crm-hygiene`
- Onboarding, health scores, churn risk, QBRs, renewals → `atrium:customer-success`
- Ticket replies, macros, help-center articles, escalations → `atrium:customer-support`

**Finance**
- Three-statement, budget, forecast, unit-economics models → `atrium:financial-modeling`
- MRR, churn, LTV, CAC, cohorts → `atrium:saas-metrics`
- Price points, packaging, tiers, discounts → `atrium:pricing`
- Month-end close, reconciliations, categorizing transactions → `atrium:bookkeeping-close`

**Strategy**
- Marketing plan, channel mix, quarterly goals → `atrium:marketing-plan`
- Product or feature launch → `atrium:launch`
- Interviews, surveys, reviews mining, personas, jobs-to-be-done → `atrium:customer-research`
- Competitor research, positioning, win/loss → `atrium:competitive-intel`

**Legal**
- Review or redline a contract, NDA or terms → `atrium:contract-review`

**From forge**: page or app build → `atelier:frontend-design`; facts and prior art →
`forge:research`; charts and one-page HTML summaries → `atelier:diagrams`; prose polish →
`forge:humanizer`.

## Rules that apply to every atrium skill

- **Evidence over invention.** Never fabricate metrics, quotes, testimonials, prospects, contacts,
  rankings, search volumes or financials. Mark estimates as estimates and say where every number
  came from. If a data source is missing, say so and use web search or ask the user.
- **Compliance by default.** CAN-SPAM/GDPR (and local equivalents) for outreach, platform terms for
  scraping and automation, honest claims in ads. No legal, tax or investment advice presented as
  authoritative; recommend a professional for high-stakes calls.
- **Tool-agnostic.** Built-in tools and plain files (CSV, Markdown, .docx/.xlsx/.pptx via Python
  libraries) are enough. If a CRM, analytics or other MCP tool is connected, use it; never require
  one or tell the user to buy one.
- **SEO data.** If OpenSEO MCP tools are connected, use them for keyword/SERP/backlink data;
  otherwise use web search, Search Console/GA exports or other data the user provides. Never
  install it or tell the user to.
- **Review before handing over.** Check the deliverable against the skill's checklist and the goal
  agreed in discovery.

## Reply

End with one or two lines: what you assumed or could not verify (data, sources, numbers), and any
risk the user must know (compliance, estimates, missing inputs).
