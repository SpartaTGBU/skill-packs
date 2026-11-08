---
disable-model-invocation: true  # skl: on-demand pack skill
name: saas-metrics
description: >
  Computes and interprets SaaS unit economics with exact formulas: MRR/ARR bridge, churn, GRR/NRR,
  ARPA, CAC, CAC payback, LTV and LTV:CAC, quick ratio, burn multiple, Rule of 40, runway, cohort
  retention. Flags data gaps and concentration risk and benchmarks against directional ranges.
  Use when asked for SaaS metrics, a board/investor KPI pack, "is our unit economics healthy",
  churn or retention analysis, CAC payback, LTV, NRR, burn multiple, or when checking a model's
  revenue assumptions.
---

# SaaS metrics

Turn raw billing, CRM and P&L data into a small, correct KPI set with the formula shown for every
number. Metrics are only as good as their definitions; state each definition once and apply it
consistently across periods.

## 1. Gather inputs first

Ask for (or locate in files the user provides) before calculating:
- Subscription/billing export: customer id, plan, MRR per month, start date, cancel date, billing
  interval (monthly/annual/multi-year). If you use Stripe/Chargebee/a CRM, an export is enough.
- Sales & marketing spend by month (fully loaded: salaries, commissions, tools, ads, agencies).
- Gross margin inputs: COGS (hosting, third-party APIs, support/CS headcount, payment fees).
- Cash balance and monthly net burn (from the bank or cash flow statement).
- Business context: segment (SMB/mid-market/enterprise), sales motion (PLG/sales-led), stage.

If an input is missing, say which metrics cannot be computed rather than guessing. Label any
assumed number "ESTIMATE: <basis>". Never fabricate customer counts, revenue or spend.

## 2. Normalize revenue

- MRR = sum of recurring monthly revenue for active subscriptions at period end. Exclude one-time
  fees, services, setup, usage overage you cannot predict (report usage separately), and taxes.
- Annual contracts: MRR = ACV / 12. Multi-year: use the annual value, not total contract value.
- Discounts: use the actual billed amount, not list price. Free/trial accounts: MRR = 0.
- ARR = MRR x 12 (a run rate, not booked revenue; not GAAP revenue).
- Pick one period convention (calendar month, beginning-of-period customer base) and keep it.

## 3. MRR/ARR bridge (always reconcile)

```
Beginning MRR
+ New MRR          (customers who were not paying last period)
+ Expansion MRR    (upgrades, seats, cross-sell from existing customers)
+ Reactivation MRR (returning churned customers; or fold into New, but say which)
- Contraction MRR  (downgrades from customers who stay)
- Churned MRR      (customers who cancelled to $0)
= Ending MRR
```
Net new MRR = New + Expansion + Reactivation - Contraction - Churned. The bridge must tie to
ending MRR; if it does not, find the classification error before reporting anything.

## 4. Formulas

| Metric | Formula | Notes |
|---|---|---|
| Customer (logo) churn | customers lost in period / customers at start of period | Monthly; annualize as 1-(1-m)^12, not m x 12 |
| Gross MRR churn | (Churned + Contraction MRR) / Beginning MRR | Revenue lost from existing base |
| GRR (gross revenue retention) | (Beginning - Churned - Contraction) / Beginning | Capped at 100% |
| NRR (net revenue retention) | (Beginning + Expansion - Churned - Contraction) / Beginning | Usually measured on a trailing-12-month cohort |
| ARPA | MRR / active paying customers | Use per segment |
| Gross margin % | (Revenue - COGS) / Revenue | Include hosting, support, payment fees in COGS |
| CAC (blended) | S&M spend in period / new customers acquired in period | Lag spend 1 quarter for long cycles; say if lagged |
| CAC (paid) | paid-channel spend / customers from paid channels | Avoids flattering CAC with organic |
| CAC payback (months) | CAC / (ARPA x GM%) | Margin-adjusted; state if not |
| LTV | (ARPA x GM%) / monthly revenue churn | Cap lifetime at 5 years or 60 months when churn is tiny |
| LTV:CAC | LTV / CAC | Meaningless without margin and a stable churn rate |
| Quick ratio | (New + Expansion MRR) / (Churned + Contraction MRR) | Growth efficiency of the base |
| Burn multiple | Net burn / Net new ARR (same period) | Undefined if net new ARR <= 0: report as "n/m, ARR shrinking" |
| Rule of 40 | Revenue growth % (YoY) + profit margin % (EBITDA or FCF; say which) | |
| Magic number | (Qtr revenue - prior qtr revenue) x 4 / prior qtr S&M spend | Sales-efficiency signal |
| Runway (months) | Cash / average monthly net burn (last 3 months) | Also show runway at planned burn |
| Revenue concentration | Largest customer ARR / total ARR | Flag any single customer > 20% |

Worked check: ARPA $500, GM 80%, monthly revenue churn 2%, CAC $6,000.
Payback = 6,000 / (500 x 0.8) = 15 months. LTV = (500 x 0.8) / 0.02 = $20,000. LTV:CAC = 3.3.

## 5. Cohorts beat blends

- Build a cohort table: rows = signup month, columns = months since start, cells = % of starting
  logos (logo retention) and % of starting MRR (net dollar retention). Expansion can push dollar
  retention above 100%; logo retention cannot exceed 100%.
- Compute CAC, payback and LTV per segment and per channel. A blended LTV:CAC can hide an
  unprofitable segment behind a profitable one.
- Look for: retention curves that flatten (good) vs keep falling (no durable core); newer cohorts
  worse than older (product/ICP drift); expansion concentrated in a few accounts.

## 6. Benchmarks (directional only)

These are rough industry ranges, not targets; they vary by stage, segment and motion. Always label
them "directional" and prefer the user's own trend over any benchmark.

| Metric | Concerning | Healthy | Strong |
|---|---|---|---|
| LTV:CAC | < 1.5 | 3-5 | > 5 (may be under-investing in growth) |
| CAC payback | > 24 mo | 12-18 mo | < 12 mo (< 6 exceptional, typical of PLG/SMB) |
| NRR | < 90% | 100-110% | > 120% (enterprise) |
| GRR | < 80% | 85-90% | > 90% |
| Gross margin (software) | < 60% | 70-80% | > 80% |
| Monthly logo churn, SMB | > 8% | 3-5% | < 2% |
| Monthly logo churn, enterprise | > 3% | ~1% | < 0.5% |
| Burn multiple | > 2x | 1-1.5x | < 1x |
| Quick ratio | < 1 | 2-4 | > 4 |
| Runway | < 12 mo | 18-24 mo | > 24 mo |

## 7. Diagnose, do not just report

For each metric outside the healthy band, name the likely driver and the next diagnostic:
- High CAC: channel mix, sales cycle length, win rate, ramping reps. Split paid vs organic.
- Long payback: low ARPA (pricing, see atrium:pricing) or low GM (hosting, support load).
- Low NRR: churn concentrated in a segment or cohort, no expansion path, weak onboarding
  (see atrium:customer-success).
- High burn multiple: hiring ahead of revenue, low-efficiency channels; compare to magic number.
- Concentration > 20%: a single-customer risk to disclose in any investor pack.

## 8. Output

Default deliverable is a one-page KPI table plus a short commentary:
- Table: metric, value, formula used, period, trend vs prior period, benchmark band.
- Commentary: three to five bullets: what changed, why, what to check next.
- Data notes: sources, exclusions, assumptions, metrics not computable and why.

For a workbook, build it with atrium:xlsx (raw data tab, calc tab with live formulas, KPI tab).
For charts use clear trend lines (MRR bridge as a waterfall, cohorts as a heat map). For a deck
use atrium:pptx. For forward projections feed these drivers into atrium:financial-modeling.

## 9. Review checklist

- [ ] MRR bridge ties to ending MRR every period.
- [ ] Annual and multi-year contracts normalized; one-time revenue excluded.
- [ ] Churn uses customers at start of period as denominator; annualized correctly.
- [ ] CAC uses fully loaded S&M; lag convention stated.
- [ ] Payback and LTV are gross-margin adjusted.
- [ ] Segment/cohort cuts shown where blended numbers could mislead.
- [ ] Every estimate labelled with its basis; benchmarks labelled directional.
- [ ] Concentration and runway flagged if out of range.

These are analytical estimates, not investment advice. For fundraising, valuation or audit-grade
reporting, have a finance professional review the definitions and numbers.
