---
disable-model-invocation: true  # skl: on-demand pack skill
name: pricing
description: >
  Designs and changes pricing and packaging: value metric selection, model choice (flat, seat,
  usage, hybrid), Good-Better-Best tiers, price-point research (Van Westendorp, MaxDiff, purchase
  tests), packaging anti-pattern audit, price-increase rollout and pricing page structure. Outputs
  a model and a defensible range, not a guessed number. Use when setting a first price, adding or
  restructuring tiers, choosing per-seat vs usage pricing, planning a price increase, reviewing a
  pricing page, or when conversion or churn suggests mispricing.
---

# Pricing

Pricing has three levers: **packaging** (what is in each offer), **value metric** (what the
customer pays per) and **price point** (how much). Fix them in that order. Price sits between the
customer's next-best alternative (floor of willingness to pay) and the value delivered (ceiling).
Your cost is a floor for viability, never the basis for the price.

## 1. Discovery

Gather before recommending:
- Product, ICP and segments; who buys vs who uses; sales motion (self-serve vs sales-led).
- Current pricing, discounting practice, plan mix, ARPA, conversion, churn and expansion rates
  (see atrium:saas-metrics). Unit cost to serve per customer/usage unit.
- Alternatives the customer would use instead (competitors, spreadsheets, hiring, doing nothing)
  and their prices; use atrium:competitive-intel for a structured scan.
- Value evidence: outcomes customers report, ROI cases, interview quotes (atrium:customer-research).
- Goal: revenue, adoption, moving upmarket, reducing churn, monetizing a heavy-usage segment.

Never invent competitor prices or willingness-to-pay data. If a price is seen on a public page,
note the date; if it is a guess, label it ESTIMATE.

## 2. Value metric

Test each candidate: "As the customer uses more of X, do they get more value?" Good metrics are
aligned with value, easy to understand, predictable to budget, and grow with the customer.

| Metric | Fits | Risk |
|---|---|---|
| Per seat | Collaboration tools, value scales with users | Seat-sharing, caps adoption |
| Per usage unit (API calls, GB, minutes) | Infrastructure, AI, variable consumption | Bill shock, unpredictable revenue |
| Per outcome (transactions, revenue processed) | Payments, marketplaces | Needs instrumentation and trust |
| Per entity (contacts, projects, locations) | CRM, multi-site | Pruning to stay under limits |
| Flat | Simple single-job tools | Leaves money on the table with heavy users |

Choose the model by the spread of usage across customers: if top-decile usage is > ~10x the
median, lean usage-based or hybrid; under ~3x, a subscription is simpler; between, use a
subscription with included usage plus overage. Only price on a metric you can measure today.

## 3. Packaging: Good-Better-Best

- Three tiers is the default; a free plan or trial is a separate acquisition decision.
- Each tier has a target persona and one clear upgrade trigger (a limit, a capability, a role).
- Anchor: the top tier makes the middle look reasonable; Best is typically 2-3x Better.
- Put differentiating features where a growing customer will hit them; keep core value in every
  tier so the entry tier is genuinely useful.
- Add-ons for features only a minority needs; enterprise tier for security, compliance, SSO,
  admin controls, SLAs and support.
- Annual billing discount typically 15-20% (about two months free).

Packaging anti-patterns to audit for:
1. Decoy tier nobody should buy, which erodes trust when noticed.
2. Feature dump: Best is "everything" with no buyer in mind.
3. No upgrade trigger: customers never outgrow their tier.
4. Hidden overage: usage limits not visible until the bill.
5. Loss-leader entry tier: cost to serve above ~80% of its price.
6. "Contact us" with no anchor price or starting point at all.
7. Differentiator in all tiers: the reason to upgrade is given away.

## 4. Price point

**First price (no data yet).** Pick the order of magnitude from the value and alternatives
($10s, $100s, $1,000s per month), then a specific number you can learn from. Do not default to a
low "$9" price to avoid rejection: it attracts low-intent buyers and is hard to raise. Plan to
revisit after the first cohort.

**Van Westendorp price sensitivity.** Ask target buyers four questions about the product:
1. At what price would it be so cheap you would doubt its quality? (too cheap)
2. At what price is it a bargain? (cheap)
3. At what price does it start to feel expensive, though you would still consider it? (expensive)
4. At what price is it too expensive to consider? (too expensive)
Plot cumulative curves (too cheap and cheap descending, expensive and too expensive ascending).
Intersections:
- Point of marginal cheapness (PMC): too cheap x expensive.
- Point of marginal expensiveness (PME): cheap x too expensive.
- Optimal price point (OPP): too cheap x too expensive.
- Indifference price point (IDP): cheap x expensive.
The acceptable range is PMC to PME. It is a range, not "the price". Use at least 30 responses per
segment (100+ preferred), segment by ICP, describe the product concretely, and for new categories
add purchase-likelihood follow-ups at each price.

**Other methods.** MaxDiff or conjoint for which features drive tier choice; real purchase tests
(new-customer cohorts, landing page variants, sales quotes) beat survey answers. A/B testing
prices on the same page at the same time carries trust and legal risk; prefer cohort or
geography tests and check local consumer law.

**Signals to raise price:** trial-to-paid or close rate well above norms (e.g. > 40% sales close),
low churn, prospects saying "that's cheap", competitors priced well above with similar value,
heavy users far exceeding the value implied by price.
**Signals price or packaging is wrong the other way:** high churn in the entry tier, long
sales cycles stalled on price, heavy discounting to close.

## 5. Changing prices

1. Model the impact: revenue at current mix, expected churn and conversion change, break-even
   churn that would wipe out the gain (build in atrium:financial-modeling).
2. Test on new customers first; measure conversion and ARPA for a full cycle.
3. Existing customers: decide grandfather (time-limited, not forever), migrate with notice, or
   migrate with added value. Roll out to a small slice (5-10%) first, then in waves.
4. Notify well ahead (30-90 days; longer for annual contracts and per contract terms), explain
   the added value, offer a lock-in such as annual at the old rate.
5. Equip sales and support with the rationale and objection handling (atrium:sales-enablement,
   atrium:customer-success). Watch churn, downgrades and support tickets weekly after launch.

Check contracts before changing prices for existing customers; price-increase notice and caps may
be contractual (atrium:contract-review).

## 6. Pricing page

- Three columns, recommended tier highlighted, monthly/annual toggle with savings shown.
- Lead each tier with who it is for and the upgrade trigger, then key limits, then features.
- Prices as plain text (not images) so search and AI assistants can read them; add product/offer
  structured data via atrium:schema-markup and see atrium:ai-visibility.
- FAQ covering billing, overage, cancellation and refunds; enterprise "contact us" with a
  "starting at" figure where possible.
- Charm prices ($49) read as value; round prices ($50) read as premium. Pick one convention.
- Optimize layout and copy with atrium:cro and atrium:copywriting.

## 7. Output

Deliver a short pricing recommendation:
- Value metric and model, with the reason.
- Tier table: name, persona, price (or range), limits, key features, upgrade trigger.
- Evidence: what data supports it, what is ESTIMATE, what research would firm it up.
- Revenue impact model and rollout plan with metrics to watch.
Recommend a range and the trade-offs; the owner picks the final number.

## 8. Review checklist

- [ ] Value metric passes the "more use, more value" test and is measurable now.
- [ ] Price justified by value and alternatives, not cost-plus.
- [ ] Each tier has a persona and an upgrade trigger; none of the seven anti-patterns.
- [ ] Research sample sizes stated; survey output given as a range.
- [ ] Existing-customer impact, contract terms and notice periods covered.
- [ ] All competitor and WTP figures sourced or labelled ESTIMATE.
