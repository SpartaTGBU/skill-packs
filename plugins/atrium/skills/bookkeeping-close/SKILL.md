---
disable-model-invocation: true  # skl: on-demand pack skill
name: bookkeeping-close
description: >
  Runs the month-end close: close calendar and checklist, bank and balance-sheet reconciliations,
  accruals and adjusting journal entries with support, flux and budget variance analysis
  (price/volume decomposition), sign-off evidence and a management reporting packet; scales from
  a small business on QuickBooks/Xero/CSV to a multi-entity close. Use when closing the books,
  reconciling a bank or GL account, preparing journal entries or accruals, explaining variances,
  or tidying categorizations before handing books to an accountant.
---

# Bookkeeping and month-end close

Close accurately first, fast second. Every balance is supported by evidence, every entry has a
documented basis, and nothing is plugged. Reconcile, adjust, review, lock, report.

## 1. Discovery

Ask for:
- Entity list, accounting basis (cash or accrual), fiscal calendar, currency, period to close.
- Ledger access: a connected accounting tool (QuickBooks, Xero, NetSuite...) if available,
  otherwise exports: trial balance, GL detail, bank and card statements (CSV/PDF), AR/AP aging,
  payroll register, fixed asset register, prior period close file.
- Policies: materiality and variance thresholds, capitalization threshold, revenue recognition
  method, who prepares and who reviews.
- Known events this month: new contracts, financing, large purchases, hires, write-offs.

If a document is missing, list it as an open item; do not assume its contents.

## 2. Close calendar (business-day targets; compress only the critical path)

| Day | Work |
|---|---|
| Pre-close | Confirm cut-off dates, send accrual requests, preliminary bank rec, review open POs |
| T+1 | Lock subledgers; cash entries; bank recs; payroll; AP accruals; depreciation; prepaid amortization |
| T+2 | Revenue recognition and deferred revenue; remaining accruals; AR and AP recs; FX revaluation |
| T+3 | All balance-sheet recs; intercompany; adjusting entries; preliminary trial balance; first flux review |
| T+4 | Tax provision/estimates; equity; draft statements; detailed flux; management review |
| T+5 | Final adjustments; period lock; distribute reporting packet; update forecast; close retro |

Dependencies: subledgers before recs, recs before adjustments, adjustments before TB, TB before
statements. A small business can run the whole list in one sitting, in the same order.

## 3. Reconciliations

**Bank reconciliation format (must reach $0 difference):**
```
Balance per bank statement            X
+ Deposits in transit                 +
- Outstanding checks/payments         -
+/- Bank errors                       +/-
= Adjusted bank balance               A

Balance per general ledger            Y
+ Interest earned not recorded        +
- Bank fees not recorded              -
+/- GL errors                         +/-
= Adjusted GL balance                 A   (difference = 0)
```
Matching order: exact reference/check number, then amount within a short date window, then
investigate one-to-many and transpositions (a difference divisible by 9 often signals a
transposition).

**GL-to-subledger recs:** AR to aging, AP to aging, fixed assets to register, inventory to count
or perpetual records, prepaids and accruals to schedules, payroll liabilities to the register,
deferred revenue to the billing/contract schedule, loans to lender statements.

**Reconciling items:** classify each as timing (clears next period, no entry) or error/omission
(needs a journal entry). Age every item; anything older than policy (e.g. 60-90 days) is escalated
and resolved, not carried forward. An opening balance that does not match last period's closing
is traced back to the prior period; do not book it in the current one.

## 4. Journal entries

Every entry carries: date, accounts, amounts, description, basis/calculation, supporting document
reference, preparer, reviewer. Common entries:
- **Accrued expense:** Dr expense / Cr accrued liabilities for goods or services received but not
  invoiced; set to auto-reverse next period. Basis: PO, contract, usage report.
- **Prepaid amortization:** Dr expense / Cr prepaid for the period's share of insurance, software,
  rent paid in advance.
- **Depreciation:** straight-line = (cost - salvage value) / useful life; Dr depreciation expense /
  Cr accumulated depreciation, per the asset register.
- **Payroll:** gross wages, employer taxes, benefits; accrue days worked but unpaid at period end.
- **Revenue recognition:** move billed-in-advance amounts from deferred revenue to revenue as
  earned; accrue earned but unbilled revenue.
- **Reclassifications:** fix miscategorized transactions; keep a note of the rule so it does not
  recur.

## 5. Flux and variance analysis

Compare month vs prior month, vs same month last year, and vs budget. A line is material when it
exceeds the policy threshold (e.g. > 10% and > a dollar amount), flips sign, or appears or
disappears. For each material line explain the driver, the amount and the supporting document.
Reject boilerplate like "timing" or "in line with expectations" without specifics.

**Price/volume decomposition (revenue or cost):**
- Volume variance = (actual volume - budget volume) x budget price.
- Price variance = (actual price - budget price) x actual volume.
- Example: budget 10,000 units at $50 = $500,000; actual 11,000 units at $48 = $528,000.
  Volume = (11,000 - 10,000) x 50 = +$50,000. Price = (48 - 50) x 11,000 = -$22,000.
  Net = +$28,000, which ties to the total.
- Add mix variance when several products have different margins, and rate vs headcount splits
  for payroll.

## 6. Controls

- Never plug a difference to make a reconciliation or the TB balance. An unexplained difference is
  an open item with an owner and a due date.
- Preparer and reviewer are different people; sign-off records who, when and what evidence was
  reviewed.
- Thresholds and policies come from the business (or its accountant), not from you; if none exist,
  propose defaults and label them as proposals.
- Lock the period after final adjustments; post later corrections in the open period with a note.
- Do not delete transactions, merge duplicates, recategorize in bulk or send anything to an
  external accountant without the owner's explicit confirmation. Flag first, fix on approval.

## 7. Small-business close (lightweight)

1. Pull bank, card and ledger data (connected tool or CSV exports).
2. Categorize uncategorized transactions; flag suspected duplicates, personal spend and
   unusual amounts for the owner to confirm.
3. Reconcile each bank and card account to the statement.
4. Review AR (overdue invoices, follow-ups) and AP (bills due).
5. Produce P&L, balance sheet and cash summary; compare with last month and budget.
6. Feed closed actuals into the forecast (atrium:financial-modeling).
7. Prepare the accountant packet: statements, recs, open questions, receipts list.

## 8. Reporting packet

Contents: P&L, balance sheet, cash flow, KPI summary (see atrium:saas-metrics for SaaS), material
variance commentary, reconciliation status table (account, balance, reconciled Y/N, open items),
open items list with owners, and adjustments made. Build workbooks with atrium:xlsx and memos
with atrium:docx; keep commentary to a page.

## 9. Review checklist

- [ ] Every balance-sheet account reconciled with evidence; bank recs at $0 difference.
- [ ] No plugs; unexplained differences listed as open items.
- [ ] Every JE has basis, support, preparer and reviewer; accruals set to reverse.
- [ ] Material variances explained with driver, amount and document.
- [ ] Price/volume (and mix) components tie to the total variance.
- [ ] Owner approved any deletion, merge or recategorization.
- [ ] Period locked; packet distributed; forecast updated.

This is bookkeeping support, not accounting, audit or tax advice. Tax provisions, filings,
revenue recognition judgements and audit-ready statements should be reviewed by a qualified
accountant (CPA or local equivalent).
