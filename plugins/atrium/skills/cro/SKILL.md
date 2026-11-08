---
disable-model-invocation: true  # skl: on-demand pack skill
name: cro
description: >
  Audits and improves conversion on marketing pages, forms, signup flows, onboarding/activation,
  popups and in-app paywalls, and designs statistically sound A/B tests (hypothesis, sample size,
  MDE, duration, significance, peeking). Use when a page or flow "isn't converting", when asked
  for CRO, landing page or pricing page review, form/signup friction, activation or aha moment,
  exit-intent or popup strategy, upgrade/paywall screens, or "should I A/B test this / how long
  should the test run / is this result significant".
---

# CRO and experimentation

Find the biggest leaks first, fix the obvious ones directly, and test only what traffic can
actually measure. Never invent a baseline, lift or benchmark: label estimates and say where
numbers came from.

## 1. Discovery (do before recommending)

Collect what exists; ask for what is missing in one short list:
- **Surface**: page type (home, landing, pricing, feature, blog, demo), form, signup, onboarding,
  popup, paywall. URL, screenshot or copy.
- **Goal**: the one conversion that matters (signup, demo, purchase, subscribe, upgrade).
- **Traffic**: sources (paid, organic, email, social), volume per day/week, device split, new vs.
  returning. Paid traffic needs message match with the ad (see atrium:paid-ads).
- **Data**: current conversion rate per step, field-level drop-off, heatmaps/recordings, support
  tickets, survey or interview quotes (atrium:customer-research), past tests and what was tried.
- **Constraints**: dev capacity, testing tool (if any), legal/compliance needs on fields.

If there is no data, say so, audit heuristically, and recommend the tracking to add
(atrium:marketing-analytics).

## 2. Page audit, in order of impact

1. **Value proposition**: understandable in 5 seconds? Specific, benefit-led, in the customer's
   words, differentiated? Common failures: feature lists, clever-but-vague, saying everything.
2. **Headline**: states the core outcome; matches the traffic source's promise. Patterns:
   "Get [outcome] without [pain]", concrete numbers/timeframes (real ones only).
3. **CTA**: one primary action, visible above the fold, repeated at decision points. Copy says
   what they get ("Start free trial", "Get my report"), not "Submit"/"Learn more". Clear primary
   vs. secondary hierarchy.
4. **Visual hierarchy**: scanning alone conveys the message; important things look important;
   images support the claim.
5. **Trust**: attributed testimonials, recognizable logos, case results, review counts, security
   badges where relevant; placed near CTAs and after big claims. Only real proof.
6. **Objections**: price, "will it work for me", effort to implement, risk. Answer with FAQ,
   guarantee, comparison, process transparency.
7. **Friction**: excess fields, unclear next step, distracting nav, slow load, broken mobile.

Page notes: **landing** = single CTA, nav minimized, strict message match. **Pricing** = clear
plan comparison, recommended plan highlighted, annual/monthly toggle, objections near CTA (pricing
decisions themselves: atrium:pricing). **Home** = serve several audiences, route clearly. **Blog** =
contextual CTAs matched to the topic. Copy rewrites: atrium:copywriting; build: atelier:frontend-design.

## 3. Forms and signup

- **Every field costs completion.** For each: needed before we can help? Obtainable later
  (progressive profiling) or by inference (company from email domain, enrichment after submit)?
- Email: single field, no confirm field, inline validation, typo hint ("did you mean gmail.com?").
- Password: show/hide toggle, allow paste, requirements shown up front.
- Name: one field unless personalization needs first/last. Phone: optional or explain why.
- Social/SSO auth: B2C Google/Apple; B2B Google/Microsoft/SSO.
- Labels always visible (placeholders are examples, not labels). Single column. Easy fields
  first, sensitive last. Radios for <5 options, searchable select for long lists.
- Errors inline and specific; never clear entered data on error.
- Mobile: 44px+ tap targets, correct keyboard types, autofill attributes.
- Multi-step only for >3-4 fields: progress bar, easy questions first, save progress.
- Trust copy near submit ("No credit card required" only if true); show value before signup.
- Post-submit: clear next step, verification email with resend, consider deferred
  verification or magic link. Run enrichment async so a timeout never rejects a signup.
- Measure: start rate, completion rate, field-level drop-off, error rate, mobile vs. desktop.

## 4. Onboarding and activation

- **Define activation** as an early action that predicts retention. Method: take mature signup
  cohorts, compare actions in an early window (e.g. first 7 days) against a later retention
  outcome (e.g. active in week 4), never overlapping windows. Treat correlations as hypotheses;
  confirm on a later cohort and with an experiment before forcing the action.
- Pick the activation model first (freemium, free trial, card-required trial, money-back,
  sales-assisted); it shapes the whole path (pricing tradeoffs: atrium:pricing).
- **Minimum path to value**: delete every step between signup and the aha moment. One goal per
  first session. Doing beats touring.
- Patterns: checklist of 3-7 value-ordered items with progress, a pre-completed first step,
  celebration at the end, dismissable. Empty states explain purpose, show an example, offer the
  first action or sample data. Tours: 3-5 steps max, skippable, never repeated.
- If a step isn't happening, one of motivation, ability or prompt is missing: fix that one.
- Coordinate with lifecycle email (atrium:email-marketing): welcome, incomplete-setup nudges
  at ~24h/72h, activation celebration plus next step. Email drives back to a specific action.
- Stalled users: define the trigger (X days inactive, setup incomplete), then email, in-app
  "pick up where you left off", human outreach for high-value accounts (atrium:customer-success).
- Metrics: activation rate, time to activation, setup completion, D1/D7/D30 retention, by
  cohort and source.

## 5. Popups and overlays

- Purpose first: email capture, lead magnet, discount, exit save, announcement, feedback.
- Triggers, best to worst for annoyance: click-triggered > behavior (cart abandon, pricing
  revisit, N pages) > exit intent > scroll depth (25-50%) > time (never "after 5 seconds").
- Copy: benefit headline, what they get and how often, specific CTA ("Get weekly tips"),
  one field. Exit offers differ from entry offers.
- Respect: obvious close, readable decline ("No thanks"), not shaming; frequency cap and
  cool-down; suppress for subscribers/customers; don't stack popups.
- Mobile: avoid intrusive full-screen interstitials on entry (search penalty risk); use
  bottom sheets or banners.
- Compliance: explicit consent wording for email capture, link the privacy policy, no
  pre-ticked boxes where GDPR applies, honor the discount terms shown.
- Measure: impression rate, conversion rate per impression, close rate, downstream quality
  (do these subscribers open, buy?), and bounce impact.

## 6. Paywalls and upgrade screens

- Show after value, at a natural moment: feature gate, usage limit, trial ending (warnings at
  7/3/1 days), or periodic gentle reminders. Never during onboarding or mid-task.
- Components: outcome headline ("Unlock X to Y"), preview of the gated value, plan comparison
  with current plan marked, simple pricing (annual vs. monthly), real social proof, specific
  CTA, and a clear escape ("Continue with Free").
- Trial expiry: summarize what they accomplished and what changes, not threats.
- Frequency caps and cool-down measured in days; track dismiss patterns.
- Upgrade path: fewest steps, in context, prefilled; instant access and a guide after paying.
- Mobile app stores: follow the platform's subscription disclosure rules (price, period,
  renewal, restore purchases).
- Measure: paywall view rate, view-to-upgrade, revenue per viewer, refund/churn after upgrade.

## 7. A/B test design

Test only when traffic can detect the effect; otherwise ship the clear fix and monitor.
Full tables and formulas: `references/ab-test-design.md`.

1. **Hypothesis**: "Because [evidence], we believe [change] will cause [effect] for [audience];
   we'll know when [primary metric] moves." No evidence, no test.
2. **One meaningful change** per variant, bold enough to matter. A/B by default; A/B/n and
   multivariate need far more traffic.
3. **Metrics**: one primary (decides the test), secondaries (explain it), guardrails (refunds,
   support tickets, unsubscribes, downstream revenue) that stop a harmful variant.
4. **Sample size before launch** from baseline rate, minimum detectable effect (MDE, the
   smallest lift worth acting on), alpha 0.05, power 0.80. Use the specific step's baseline,
   not the sitewide rate. Plan segment analysis? Size for the smallest segment.
5. **Duration** = sample per arm x arms / (daily eligible visitors x share exposed). Run at
   least one full week (two for B2B cycles), whole weeks only, usually under 4-8 weeks.
6. **No peeking**: decide at the planned sample. Need early looks? Use a sequential or
   Bayesian method designed for it and interpret it on its own terms.
7. **Opt-in elements** (video, calculator, chat): compare only visitors exposed to the trigger
   point in both arms, or the test is drowned by unexposed noise.
8. **Launch QA**: variants render on all devices, tracking fires in both arms, assignment is
   sticky, no flicker, no other test collides on the same traffic.
9. **Read results**: reached sample? Effect size and confidence interval, not just p-value.
   Guardrails clean? Segments are exploratory unless pre-registered. A p-value is not "the
   chance the result is random". Inconclusive means report the interval and move on; never
   extend a finished test until it turns significant.
10. **Low traffic**: raise the MDE, test upstream where volume is higher, pool similar pages,
    drop variants, or skip testing and decide on qualitative evidence.

Prioritize the backlog with ICE (impact, confidence, ease, 1-10 each). Log every test:
hypothesis, variants, dates, sample, result with interval, decision, reusable pattern.

## Output

Deliver, in this order, kept tight:
1. **Quick wins**: obvious fixes to ship now (no test needed).
2. **High-impact changes**: bigger fixes, with the reasoning and evidence for each.
3. **Test plan**: top 1-3 hypotheses with metric, MDE, sample size and estimated duration.
4. **Copy alternatives**: 2-3 options for headline/CTA with rationale.
5. **Measurement gaps**: tracking needed to judge the change.
For flow audits use a table: Issue | Impact | Fix | Priority.

## Review checklist

- [ ] Recommendations tied to the stated goal and traffic source
- [ ] Every number sourced or labeled as an estimate; no invented benchmarks or social proof
- [ ] Quick wins separated from things that need a test
- [ ] Tests have hypothesis, primary + guardrail metric, sample size, duration
- [ ] Sample size feasible for the actual traffic, or an alternative given
- [ ] Mobile checked; accessibility (labels, contrast, focus) not degraded
- [ ] Popups/forms consent-compliant; no dark patterns (fake urgency, confirmshaming, traps)
