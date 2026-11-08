---
disable-model-invocation: true  # skl: on-demand pack skill
name: financial-modeling
description: >
  Builds driver-based financial models as live-formula .xlsx workbooks: assumptions tab,
  headcount, revenue, COGS and opex builds, three statements, 13-week cash flow, scenarios,
  sensitivity tables, budget-vs-actual variance and forecast accuracy checks. Use when asked for
  a financial model, operating plan, budget, forecast, runway projection, fundraising model,
  scenario or sensitivity analysis, cash flow forecast, or to audit or restructure an existing
  spreadsheet model.
---

# Financial modeling

Build the smallest model that answers the decision at hand, driven by a few explicit
assumptions, with every number traceable to an input or a source. Spreadsheet mechanics (openpyxl,
formatting, recalculation, formula error checks) live in atrium:xlsx; load it for the build.

## 1. Discovery (do this before opening a sheet)

Ask for what is missing:
- Decision the model serves: fundraise size, hiring plan, runway, pricing change, budget, board.
- Horizon and granularity: monthly for the first 12-24 months, quarterly or annual after.
- Business model: subscription, usage, transactional, services, marketplace; sales motion.
- Actuals: last 12-24 months P&L, balance sheet, cash; current headcount roster with salaries
  and start dates; customer/MRR data (see atrium:saas-metrics); current cash.
- Plans: hires, pricing, launches, funding events, big contracts.
- Existing model or template the user wants kept.

Never invent actuals. When an assumption has no source, use a stated estimate, mark it
"ESTIMATE", note its basis (benchmark, management guess, comparable), and put it in the
assumptions tab where it can be changed.

## 2. Architecture

One direction of flow: Inputs -> Calculations -> Outputs. Typical tabs:

| Tab | Contents |
|---|---|
| README | Purpose, version, date, owner, how to use, key caveats |
| Assumptions | Every driver, one row each: value, unit, source/basis, scenario columns |
| Actuals | Imported historicals, untouched, with source and date |
| Headcount | Roster + hiring plan: role, dept, start month, salary, loaded cost |
| Revenue | Driver build by segment/product |
| COGS & Opex | Cost builds tied to headcount and revenue drivers |
| P&L, Balance sheet, Cash flow | Three statements, linked |
| Cash (13-week) | Short-term liquidity view, if cash is tight |
| Scenarios / Sensitivity | Switch, scenario outputs, data tables |
| Checks | Balance sheet balances, cash ties, no errors |
| Dashboard | Handful of KPIs and charts for the decision |

Rules:
- No hardcoded numbers in calculation or output cells: every constant lives on Assumptions.
- Inputs styled distinctly (e.g. blue font, light fill); formulas black; links to other tabs
  green. Add a legend on README.
- Consistent time axis across tabs (same columns = same months).
- One formula per row, copied across; no mid-row formula changes without a comment.
- Name key ranges or keep assumptions in fixed cells; avoid deep nested IFs; avoid circularity
  (if interest on cash creates one, use prior-period balance).
- Version the file (name_v3_2026-10-30.xlsx) and log changes on README.

## 3. Driver builds

**Start with headcount.** It is usually 60-80% of opex and drives most other costs.
- Per hire: role, department (S&M, R&D, G&A, COGS/CS), start month, base salary.
- Loaded cost = salary x load factor (typically 1.25-1.45 for benefits, payroll tax, equipment;
  ESTIMATE unless the user has a payroll figure). Apply annual raises at a stated month.
- Recruiting fees, equipment and software per head as separate per-hire drivers.

**Revenue (bottom-up, never top-down "1% of TAM").**
- Sales-led: quota-carrying reps x ramp x quota x attainment x average deal size.
  Example ramp (ESTIMATE): months 1-2 at 0%, 3 at 25%, 4-6 at 50%, 7-9 at 75%, 10+ at 100%;
  attainment 70-80% of quota.
- Product-led: traffic x signup rate x activation x paid conversion x ARPA.
- Existing base: beginning MRR + expansion - contraction - churn (use the MRR bridge from
  atrium:saas-metrics); apply churn to the base, not just new logos.
- Usage/transactional: active accounts x usage per account x price per unit.
- Recognize revenue per policy (annual prepay: cash up front, revenue ratably; show deferred
  revenue on the balance sheet).

**COGS.** Hosting/infrastructure (often 5-15% of revenue for SaaS, ESTIMATE), third-party
APIs/licences per unit, payment processing (~2-3% of collected revenue), support/CS headcount
by customers per CSM. Gross margin is an output, not an input.

**Opex.** S&M (headcount + programme spend + commissions), R&D (headcount + tools), G&A
(headcount + rent, insurance, legal, accounting, software). Tie programme spend to drivers
(e.g. CAC x target new customers) where possible.

**Balance sheet and cash.** AR from DSO, AP from DPO, deferred revenue from billing terms,
capex and depreciation, debt and equity events. Cash flow = net income + non-cash items +
working capital changes - capex + financing. Cash on the balance sheet must equal ending cash on
the cash flow statement.

## 4. 13-week cash flow (when liquidity matters)

Weekly columns: beginning cash, customer receipts (by expected collection date, not invoice),
payroll (actual pay dates), rent, vendors, debt service, taxes, other; ending cash; minimum
cash threshold. Roll forward weekly and compare forecast to actual receipts and payments.

## 5. Scenarios and sensitivity

- Base / upside / downside cases as columns on Assumptions, selected by one switch cell.
  Change the few drivers that matter (new bookings, churn, hiring pace, pricing), not everything.
- Sensitivity: two-way table of the output that matters (ending cash, runway, break-even month)
  against two drivers (e.g. growth rate x churn). Build with formulas, not Excel data tables, if
  the file must recalculate outside Excel.
- Always show the downside runway and the month cash hits the minimum threshold.

## 6. Budget vs actual and forecast accuracy

- Variance = actual - budget, and %, per line, with favourable/unfavourable sign convention
  stated (revenue up is favourable; cost up is unfavourable).
- Materiality threshold set by the user (e.g. > 10% and > $50K); explain only material lines,
  naming the driver (volume, price, timing, one-off) and the amount. Decomposition method in
  atrium:bookkeeping-close.
- Forecast accuracy: MAPE = mean(|actual - forecast| / |actual|). Track bias too: consistently
  positive or negative errors mean a systematic assumption problem, not noise.
- Re-forecast: replace elapsed months with actuals, revisit drivers, keep the original budget
  for comparison.

## 7. Checks tab (build it, keep it green)

- Balance sheet: assets - liabilities - equity = 0 every period.
- Cash flow ending cash = balance sheet cash.
- Revenue build total = P&L revenue; headcount cost total = sum of departmental payroll lines.
- No #REF!, #DIV/0!, #VALUE! anywhere (scan after recalculation, see atrium:xlsx).
- Historical periods tie to provided actuals.
- A single master check cell that shows OK only when all checks pass.

## 8. Output

Deliver the .xlsx plus a short summary (in chat or a memo via atrium:docx):
- What the model answers, top 3-5 results (runway, break-even month, funding need, ending ARR).
- The 5-10 key assumptions with their source or ESTIMATE label.
- Scenario range and the drivers that move results most.
- Known limitations.
For a board or investor deck, hand results to atrium:pptx.

## 9. Review checklist

- [ ] Every input on Assumptions with unit and source; no hardcodes in calc cells.
- [ ] Revenue built bottom-up from drivers; churn applied to the existing base.
- [ ] Headcount plan drives payroll, benefits, equipment and recruiting.
- [ ] Three statements link; checks tab all OK; no formula errors.
- [ ] Downside scenario and runway shown.
- [ ] Estimates labelled; actuals untouched and dated.
- [ ] Summary states assumptions and limitations in plain language.

Models are planning tools, not guarantees. They are not investment, tax or accounting advice;
for fundraising terms, tax positions or audited figures, have a qualified accountant or financial
adviser review.
