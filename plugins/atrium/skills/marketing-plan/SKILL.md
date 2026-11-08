---
disable-model-invocation: true  # skl: on-demand pack skill
name: marketing-plan
description: >
  Builds and maintains the product-marketing context file (product, audience, personas, positioning,
  competitors, customer language, voice, proof, goals, learnings) that every other atrium skill
  reads, then turns it into an evidence-based AARRR marketing plan with a 90-day roadmap, budget
  and kill criteria. Use when starting marketing for a product, when asked for a marketing plan,
  go-to-market strategy, positioning doc, channel strategy or marketing budget, or when another
  skill finds no context file.
---

# Marketing plan

Two deliverables, in order: (1) the **product-marketing context file**, the shared memory every
atrium skill reads first; (2) the **marketing plan** built on top of it. Never write the plan
without the context file.

## 1. The context file

Location: `.agents/product-marketing.md`. Before creating one, check `.claude/product-marketing.md`
and legacy `product-marketing-context.md`; if found, use it (offer to move it to `.agents/`).
Full template: `references/context-template.md`.

**If it exists:** read it, show a one-paragraph summary, ask which sections are stale. Update only
those; bump the version and add a changelog line.

**If it doesn't:** choose with the user:
- **Auto-draft (default when there's a codebase or site):** read README, landing pages, pricing
  page, docs, app copy, package metadata, past campaign files. Draft every section you can,
  mark each field `source: <file/url>` or `[GAP]`, then walk the user through the gaps.
- **Interview:** one section at a time, in template order. Ask for examples and exact wording,
  not adjectives. Stop each section when you can fill it without guessing.

Sections (keep each tight; bullets over prose):
1. Product overview: one-liner, what it does, category, business model, price points.
2. Target audience: company type/size, industry, roles, the primary use case.
3. Personas: User, Champion, Decision maker, Financial buyer, Technical influencer (B2B); for each,
   what they care about and what they need to hear. B2C: 1–3 user personas.
4. Problems: core pain, why current alternatives fail, the cost of the problem (time/money/risk).
5. Competitive landscape: direct (same solution), secondary (different solution, same problem),
   indirect (do nothing, spreadsheets, hire, build in-house). How each falls short.
6. Differentiation: key differentiators, how we solve it differently, why that matters.
7. Objections and anti-persona: top 3 objections with responses; who is a bad fit and why.
8. Switching dynamics (JTBD four forces): push (pain with status quo), pull (attraction of new),
   habit (inertia), anxiety (fear of switching).
9. Customer language: verbatim phrases for the problem and solution, words to use, words to avoid,
   glossary. Quotes only from real sources; cite them.
10. Brand voice: tone, style, personality (3–5 adjectives with "this, not that").
11. Proof points: metrics, logos, testimonials, value themes with evidence. Real only.
12. Goals: business goal, key conversion action, current metrics (with dates).
13. Paid ads (optional): accounts, budgets, best-performing angles.
14. Learnings: table `Date | Learning | Evidence | Applies to | Status (active/watch/retired)`.
    Keep about 20 active rows; retire contradicted ones, don't delete them.

Rules: never invent quotes, metrics or logos. Leave `[GAP]` rather than guess. Any atrium skill
that learns something durable (a winning angle, a dead channel, new objection) appends a Learnings
row; atrium:customer-research writes Customer Language; atrium:competitive-intel updates section 5.

## 2. Discovery for the plan

Ask only what the context file doesn't answer:
- Stage and model: pre-launch / early / growth; B2B or B2C; self-serve, sales-led or hybrid.
- Goal for the next 90 days and 12 months, as a number (signups, MRR, pipeline, users).
- Current funnel numbers per stage, and which are measured vs guessed.
- Team and time: who executes, hours per week, skills (writing, design, ads, sales).
- Budget, or permission to propose one. Channels already tried and what happened.
- Hard constraints: regulated industry, brand rules, geography, deadlines.

**Market gate (new products/markets):** is the problem big enough (size x frequency x willingness
to pay)? If sizing is asked for, triangulate TAM/SAM/SOM top-down (reports, census data) and
bottom-up (count of buyers x ACV), give ranges with confidence labels and sources. Label every
number as estimate or measured. Use forge:research or web search; never fabricate figures.

## 3. Rate the current state

Score each AARRR stage 0–3 (0 = nothing, 1 = ad hoc, 2 = working but unmeasured, 3 = measured and
improving), with the evidence. The lowest-scoring stage that blocks revenue is usually the first
bet. A leaky funnel is not fixed by more acquisition.

## 4. Write the plan

Smallest doc that lets someone execute. Structure:

1. **Executive summary**: goal, the 3 big bets, budget, what success looks like at 90 days.
2. **Current state**: the AARRR rubric table plus the top 3 constraints.
3. **Stage plans** (only stages that matter now), each with:
   - Acquisition: 1–3 channels max for a small team, chosen by where the ICP already is (see
     atrium:customer-research). Organic (atrium:seo-content, atrium:content-strategy,
     atrium:social-media), paid (atrium:paid-ads), outbound (atrium:cold-outreach), borrowed
     (partners, communities, podcasts).
   - Activation: first-value moment, onboarding fixes (atrium:cro).
   - Retention: lifecycle email (atrium:email-marketing), success motions (atrium:customer-success).
   - Referral: referral/affiliate loops, reviews, case studies.
   - Revenue: pricing and packaging (atrium:pricing), upgrade paths, sales motion.
4. **Every move** gets: the mechanism (why it should work for this ICP), owner, effort, a leading
   indicator, a target, and a kill criterion ("stop if <X> by <date>").
5. **90-day roadmap**, with owners per line:
   - Weeks 1–2 Unblock: tracking, context file, broken funnel steps, analytics (atrium:marketing-analytics).
   - Weeks 3–4 Foundation: positioning on site, core assets, first channel live.
   - Weeks 5–8 Velocity: ship and iterate weekly on the chosen channels.
   - Weeks 9–12 Compound: double down on what works, kill what didn't, systematize.
6. **12-month outlook**: quarterly themes, not tasks.
7. **Idea bank**: ideas triaged Now / Q2 / Q3+ / Skip, one line each with the reason.
8. **Measurement**: north-star metric, one metric per stage, review cadence, dashboard owner.
9. **RACI** for recurring work (small teams: just owner + reviewer).
10. **Open decisions**: what needs an owner call, with the cost of not deciding.

## 5. Budget

Pick the method that fits the data; show the math.
- **% of revenue:** typical range 5–40% of ARR depending on stage and growth target (early
  growth sits high). State it as a benchmark range, not a rule.
- **Goal-based:** required new customers = new ARR target / (ARPC x 12); budget = customers x CAC,
  adjusted for retention. Needs a real CAC.
- Reserve 10–20% for experiments. Default allocation 70/20/10: proven / promising / new bets.
- If CAC is unknown, say so: measuring it is the highest-impact open decision, and the budget is
  a test budget with stop-loss limits, not a forecast.
- Rate metrics only on closed cohorts (a 30-day conversion rate counts users at least 30 days old).

## 6. Review checklist (run before delivering)

- [ ] Context file exists, is versioned, and has no invented quotes, metrics or logos.
- [ ] Goal is a number with a date; every metric says measured or estimate and its source.
- [ ] At most 3 big bets; channels fit team size and where the ICP actually is.
- [ ] Every move has mechanism, owner, leading indicator, target and kill criterion.
- [ ] The 90-day roadmap fixes measurement and the leakiest stage before scaling acquisition.
- [ ] Budget math shown; unknown CAC flagged as an open decision.
- [ ] Compliance: outreach respects CAN-SPAM/GDPR; claims are substantiated; regulated
      industries flagged for professional review.
- [ ] Doc is skimmable: tables and bullets, no generic advice that would fit any company.

Deliver the plan as Markdown by default; use atrium:docx or atrium:pptx if the user wants a
document or deck, and forge:humanizer to polish prose.
