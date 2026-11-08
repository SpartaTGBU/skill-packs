# atrium

Business skills: office documents, brand and copy, SEO, growth, sales and CRM, customer success, finance, strategy and contracts. 42 skills.

- Skills load on demand: `skl load atrium:<name>` from Bash, or `/atrium:<name>` in Claude Code. Several names can be loaded in one call.
- `atrium:using-atrium` is the router. It maps a task to the right skill and sizes the job: trivial (just do it), small (one skill), medium (discovery questions, then skills in order, then a review pass), large (add research skills first).
- Discovery is thorough, output is lean: the deliverable is the smallest thing that does the job, in the user's voice and brand.
- If `.agents/product-marketing.md` exists, skills read it first (product, audience, positioning, voice). `atrium:marketing-plan` builds and maintains it.
- Find skills with `skl list atrium` or `skl search <words>`. Load only the one or two you need.

## Router

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:using-atrium` | Routes a business, marketing, sales or office-document task to the right atrium skill and scales discovery to the job size. | Start of any business task, or when you do not know which skill applies. | "I need to get our first 10 customers for a B2B tool. Which atrium skills should we use and in what order?" |

## Documents

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:docx` | Creates, reads, edits and reviews Word files with python-docx and OOXML edits, including tracked changes, comments and LibreOffice conversion and visual QA. | A .docx is the input or output, or you need a redline or a Word-to-PDF conversion. | "Redline the attached MSA.docx with tracked changes and comments on the liability clause." |
| `atrium:xlsx` | Creates and edits Excel and CSV workbooks with openpyxl and pandas, using live formulas, financial formatting, charts and a recalculation check for formula errors. | A spreadsheet is the input or output, or a model has broken formulas. | "Clean this leads.csv and build an xlsx tracker with a pivot by source and live totals." |
| `atrium:pptx` | Creates and edits PowerPoint decks with python-pptx: layout-based slides, template filling, native charts, speaker notes, and rendered-slide QA for overflow. | A deck, pitch, board or QBR update is needed, or a template must be filled or restyled. | "Build a 12-slide QBR deck from the attached metrics.xlsx using our company template." |
| `atrium:pdf` | Extracts text and tables, OCRs scans, merges, splits, rotates, watermarks, encrypts, fills forms and generates PDFs, then verifies by rendering pages. | A PDF is the input or output. | "Extract the tables from this scanned supplier invoice PDF into a CSV." |

## Brand and copy

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:brand-guidelines` | Captures positioning, voice, tone, terminology and visual identity into a reusable BRAND.md, applies it to new content and reviews drafts against it. | Before writing anything that must sound like you, or when writers and agents need a style guide. | "Read our site and last five newsletters and write a BRAND.md, then check this draft against it." |
| `atrium:copywriting` | Writes and rewrites conversion copy for homepage, landing, pricing, feature and about pages, headlines, heroes and CTAs, diagnosing first and removing vague or AI-sounding phrasing. | Building a landing page, or copy reads weak or generic. | "Write the hero, subhead and CTA for our invoice-automation landing page aimed at bookkeepers." |
| `atrium:copy-editing` | Edits existing copy in seven sweeps (clarity, voice, so-what, proof, specificity, emotion, risk), with an optional expert-panel score and a refresh workflow for aging pages. | A draft exists and needs polish before publishing, or an old post is losing traffic. | "Run the seven sweeps on this pricing page draft and score it before we publish." |
| `atrium:content-strategy` | Plans pillars, prioritised topics by buyer stage, topic clusters, a scored backlog, an editorial calendar and distribution. | Deciding what to write and why, before commissioning pieces. | "Give me a 3-month content plan and scored backlog for a payroll tool, aimed at HR managers at 50-200 person firms." |
| `atrium:social-media` | Plans and writes organic posts, threads and carousels with hooks, a weekly calendar, repurposing and community engagement across LinkedIn, X, Instagram, TikTok, Facebook, YouTube and Threads. | Growing an audience or repurposing content for social. Paid social is `atrium:paid-ads`. | "Turn this webinar transcript into a LinkedIn post, an X thread and a week of calendar slots." |
| `atrium:email-marketing` | Designs lifecycle email programs and campaigns (welcome, nurture, onboarding, trial-to-paid, win-back, dunning, newsletters) with timing, exit rules, full copy and compliance checks. | You need a sequence or flow, or emails are not converting. | "Write a 6-email trial-to-paid sequence with send timing and exit conditions for our project-management app." |
| `atrium:launch` | Plans product and feature launches: readiness gate, phased rollout, owned/rented/borrowed channels, Product Hunt playbook, announcements, release notes and changelogs. | You are about to ship, or need release notes from what shipped. | "Plan our Product Hunt launch for next Tuesday and draft release notes from this changelog." |

## SEO and search

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:seo-audit` | Audits crawlability, indexation, technical health, on-page, content quality and internal links, returning a short prioritised fix list. | Traffic dropped, before or after a migration, or a page will not rank. | "Our organic traffic fell 30% after the redesign. Audit the site and give me the top fixes." |
| `atrium:keyword-research` | Finds and filters keywords, clusters them by SERP, maps each cluster to one page (existing, new or skip) and checks cannibalization. | Choosing what to write or optimise next, or sizing demand. | "Research keywords for an expense-management app and map each cluster to a page." |
| `atrium:seo-content` | Reads SERP intent, finds gaps, writes content briefs and outlines, applies on-page rules, strengthens E-E-A-T and AI citation readiness, and plans refreshes. | Briefing a writer, or improving an existing page that underperforms. | "Write a content brief for 'how to calculate CAC payback' based on what currently ranks." |
| `atrium:seo-competitors` | Finds real SERP competitors, runs keyword, content and backlink gap analysis, and writes fair "X vs Y" and "alternatives" pages with dated, sourced claims. | Asking why rivals outrank you, or planning comparison pages. | "Who actually outranks us for 'invoice software' and what are the content gaps? Draft an 'Acme alternatives' page." |
| `atrium:programmatic-seo` | Plans and audits template-and-data page sets at scale: validates the keyword pattern, specifies data, URLs, internal links and indexation, and enforces thin-content quality gates. | A repeating pattern like "[service] in [city]" or integration pages could scale. | "Evaluate whether we can build '[tool] integration' pages for 200 apps without thin-content risk." |
| `atrium:schema-markup` | Audits, writes, fixes and validates JSON-LD structured data, choosing schema.org types per page and checking current Google rich-result support. | Rich results are missing or Search Console shows structured-data errors. | "Add Product and Breadcrumb JSON-LD to these templates and fix the Search Console errors." |
| `atrium:link-building` | Finds where links are the ranking gap, builds linkable assets, qualifies prospects, drafts compliant outreach, audits backlink profiles and tracks results. | Competitors win on authority, or you need a backlink audit. | "Audit our backlink profile and plan a digital PR campaign around our salary survey data." |
| `atrium:local-seo` | Audits Google Business Profile, map pack factors, NAP consistency, citations, reviews and location pages, with a prioritised fix list. | A business depends on nearby customers or service areas. | "We run three dental clinics. Audit our Google Business Profiles and why competitors beat us in the map pack." |
| `atrium:ai-visibility` | Measures how a brand appears in AI answers (ChatGPT, Perplexity, AI Overviews, Claude, Gemini, Copilot) by sampling real answers, then fixes crawler access, entity clarity and citable content. | Asking why AI recommends competitors, whether to allow AI bots, or about llms.txt. | "Sample what ChatGPT and Perplexity say about us for 20 buyer prompts and tell me how to get cited." |

## Growth and measurement

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:marketing-plan` | Builds and maintains the product-marketing context file that other atrium skills read, then turns it into an AARRR marketing plan with a 90-day roadmap, budget and kill criteria. | Starting marketing for a product, or when other skills find no context file. | "Create our product-marketing context and a 90-day go-to-market plan with a 5k monthly budget." |
| `atrium:paid-ads` | Plans, builds, audits and optimises paid campaigns on Google, Meta, LinkedIn, TikTok, X and Microsoft: structure, audiences, copy, creative tests, budgets and a weekly optimisation loop. | Launching or restructuring campaigns, or CPA is high and ROAS low. | "Our LinkedIn ads cost 180 per lead. Audit the account and propose a restructure with ad copy tests." |
| `atrium:cro` | Audits pages, forms, signup, onboarding, popups and paywalls for conversion, and designs sound A/B tests (hypothesis, sample size, MDE, duration, peeking). | A page or flow is not converting, or you ask how long a test should run. | "Review our signup flow for friction and design an A/B test with sample size for the new form." |
| `atrium:marketing-analytics` | Designs and audits tracking plans, UTMs, GA4/GTM, attribution, KPI trees, dashboards, reports and consent compliance. | Fixing tracking, reconciling platform vs CRM numbers, or building a reporting cadence. | "Write a tracking plan and UTM convention for our site, and explain why GA4 and HubSpot disagree on leads." |
| `atrium:customer-research` | Analyses interviews, surveys, tickets, reviews and NPS, mines communities for voice-of-customer, plans interviews and PMF surveys, and synthesises JTBD and evidence-backed personas. | Evidence is thin before positioning or messaging work, or you have raw feedback to synthesise. | "Synthesise these 15 interview transcripts into jobs-to-be-done, top pains and verbatim phrases." |
| `atrium:competitive-intel` | Identifies direct, indirect and future competitors, builds dated profiles, positioning maps, feature gaps, battlecards and win/loss programs, and writes honest comparison pages. | Positioning against a rival or monitoring competitor changes. | "Profile our top four competitors with pricing and positioning, dated and sourced, and map the gaps." |
| `atrium:pricing` | Designs pricing and packaging: value metric, model (flat, seat, usage, hybrid), Good-Better-Best tiers, price research, price-increase rollout and pricing page structure. | Setting a first price, restructuring tiers, or churn suggests mispricing. | "Should we move from per-seat to usage pricing? Design tiers and a rollout plan for existing customers." |

## Sales, CRM and customer success

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:icp-and-prospecting` | Defines an evidence-based ICP, personas and buying-committee maps, then builds a sourced target-account and contact list with fit scores and signals. | Deciding who to sell to, or building an outbound list. | "Define our ICP from our 30 best customers and build a scored list of 50 look-alike accounts." |
| `atrium:cold-outreach` | Writes compliant cold emails, LinkedIn messages and sequences, handles replies, and covers deliverability setup (SPF, DKIM, DMARC, warmup) and CAN-SPAM/GDPR basics. | Starting outbound, low reply rates, or emails landing in spam. | "Write a 4-step cold sequence for VP Engineering at fintechs and check our sending domain setup." |
| `atrium:lead-qualification` | Scores and triages leads with ICP fit times intent, BANT or MEDDPICC with a source per answer, P0-P2 routing with SLAs and disqualification messages. | Deciding whether a lead is worth pursuing, or setting up scoring and routing. | "Triage these 40 inbound leads from the CSV into P0, P1, P2 and disqualify, with reasons." |
| `atrium:sales-calls` | Prepares discovery, demo and cold calls (briefs, question plans, agendas), and produces post-call summaries, follow-up emails, CRM updates and objection answers. | A call is coming, or you have notes or a transcript to turn into follow-up. | "Prep me for tomorrow's discovery call with Northwind Logistics, then draft the follow-up from my notes." |
| `atrium:sales-enablement` | Builds objection libraries, battle cards, talk tracks, call scripts, demo and POC plans and rep coaching scorecards from win/loss evidence. | Reps lose deals on the same objections, or you need a demo plan. | "Build a battle card against Competitor X and an objection library from our last 20 lost deals." |
| `atrium:proposals` | Writes proposals, SOWs, RFP/RFI responses, business cases and mutual action plans from the buyer's stated pains, with tiered pricing, conservative ROI, explicit scope and a bid/no-bid call. | A buyer asked for a proposal or RFP response, or a deal needs a close plan. | "Write a three-tier proposal and SOW for Acme based on these discovery notes, with conservative ROI." |
| `atrium:pipeline-management` | Runs pipeline reviews, forecasts (commit and best case), deal reviews, slip scenarios and win/loss analysis from a CRM or CSV export, showing coverage math. | Before a forecast call or QBR, or to inspect a single deal. | "Review this pipeline.csv, give me commit and best-case for the quarter, and flag deals likely to slip." |
| `atrium:crm-hygiene` | Deduplicates contacts, companies and deals, sets field standards and stage definitions with exit criteria, audits stale opportunities and defines lead routing, working on plain CSV/XLSX. | CRM data is messy or stages are undefined. | "Dedupe this HubSpot export, define stage exit criteria and list stale deals older than 90 days." |
| `atrium:customer-success` | Runs onboarding plans, success plans, health scores, churn-risk detection and save plays, renewal readiness, QBR/EBR prep and expansion opportunities. | After the sale: onboarding a customer, spotting at-risk accounts, preparing a renewal. | "Score account health from this usage export, list at-risk accounts and prep the Globex renewal." |
| `atrium:customer-support` | Triages and prioritises tickets, drafts replies and macros, writes knowledge-base articles, escalation briefs and support trend reports. | Ticket backlog, a tricky reply, or repeated questions needing a help article. | "Triage these 30 tickets by priority and write a macro and help article for the password-reset issue." |

## Finance, strategy and legal

| Skill | What it does | When it earns its place | Example prompt |
|---|---|---|---|
| `atrium:financial-modeling` | Builds driver-based live-formula .xlsx models: assumptions, headcount, revenue, COGS, opex, three statements, 13-week cash flow, scenarios, sensitivities and variance checks. | A budget, forecast, runway or fundraising model is needed, or an existing model needs auditing. | "Build a 3-year driver-based model with scenarios and a 13-week cash flow for a seed-stage SaaS." |
| `atrium:saas-metrics` | Computes MRR/ARR bridge, churn, GRR/NRR, CAC, CAC payback, LTV:CAC, quick ratio, burn multiple, Rule of 40, runway and cohort retention, flagging data gaps. | Board or investor KPI packs, or asking whether unit economics are healthy. | "From this subscriptions.csv compute NRR, CAC payback and burn multiple and tell me what looks unhealthy." |
| `atrium:bookkeeping-close` | Runs the month-end close: calendar, bank and balance-sheet reconciliations, accruals and adjusting entries with support, variance analysis and a reporting packet. | Closing the books, reconciling accounts, or tidying categorisations before an accountant. | "Walk me through the October close and reconcile this bank statement CSV against the ledger export." |
| `atrium:contract-review` | Reviews commercial contracts (MSA, NDA, DPA, vendor, order forms) from your side with a clause checklist, GREEN/YELLOW/RED flags, redlines with fallbacks and a counsel escalation list. Not legal advice. | Before signing, or triaging an NDA. | "Review this vendor MSA against our playbook, flag RED clauses and propose redlines with fallbacks." |

## Walkthroughs

### Launch page and SEO plan for a SaaS

1. `atrium:using-atrium`: sizes this as large and runs discovery (product, audience, goal, constraints).
2. `atrium:marketing-plan`: no context file yet, so it writes `.agents/product-marketing.md` that every later skill reads.
3. `atrium:keyword-research`: finds demand and maps each keyword cluster to one page, so the landing page targets the right query.
4. `atrium:seo-competitors`: shows who actually ranks and what gaps to beat (optional if the SERP is thin).
5. `atrium:copywriting`: writes the page against the context file and keyword map; `atrium:copy-editing` then runs the seven sweeps.
6. `atrium:schema-markup`: adds JSON-LD for the finished page.
7. `atrium:seo-content`: briefs supporting articles; `atrium:launch` plans the announcement and `atrium:cro` sets up a first A/B test after launch.

### Sales proposal deck and follow-up

1. `atrium:lead-qualification`: confirms the opportunity is real and gaps in BANT/MEDDPICC are known before investing effort.
2. `atrium:sales-calls`: turns call notes into a recap and surfaces the buyer's stated pains.
3. `atrium:proposals`: builds the proposal and tiered pricing from those pains, with conservative ROI and explicit scope. Add `atrium:pricing` if the tiers need work.
4. `atrium:pptx`: renders the proposal as a deck and checks every slide for overflow; `atrium:pdf` exports the version to send.
5. `atrium:sales-calls`: drafts the follow-up email and CRM update after sending.
6. `atrium:pipeline-management`: reviews the deal and slip risk for the forecast; `atrium:contract-review` handles the buyer's paper at signature.
