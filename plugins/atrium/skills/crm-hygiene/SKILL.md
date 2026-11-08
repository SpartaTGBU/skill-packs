---
disable-model-invocation: true  # skl: on-demand pack skill
name: crm-hygiene
description: >
  Cleans and standardizes CRM data: deduplicates contacts, companies and deals, sets field
  standards and stage definitions with exit criteria, audits stale or incomplete opportunities,
  and defines lead routing rules. Works on plain CSV/XLSX exports without any CRM connected.
  Use when asked to dedupe or merge records, clean a contact list or CRM export, define pipeline
  stages, set data standards, audit pipeline data quality, or design lead assignment rules.
---

# CRM hygiene

Bad data silently breaks forecasts, routing and outreach. Fix it with explicit rules, propose
every change as before → after, and apply nothing until the user approves. Never delete; merge
or archive with a log.

## 1. Discovery

- System of record: a CRM (any vendor, connected or not) or files. Export CSV/XLSX is enough.
- Objects in scope: contacts, companies/accounts, leads, deals/opportunities.
- Field list with sample rows, and which fields are required today.
- Current stage list and what each stage means to the team.
- Pain driving the cleanup (duplicate outreach, wrong forecast, unassigned leads, migration).
- Data protection context: regions (GDPR/UK GDPR, CCPA), consent fields, suppression lists.
  Preserve opt-outs and consent flags through every merge.

Keep the original export untouched. Write outputs to new files.

## 2. Field standards

Define one standard per field and validate against it:

| Field | Standard |
|---|---|
| Email | Lowercase, trimmed, valid syntax; flag role addresses (info@, sales@) |
| Domain | Lowercase, no protocol, no `www.`, no path (`https://www.Acme.com/x` → `acme.com`) |
| Company name | Trimmed; legal suffixes stripped for matching only (Inc, LLC, Ltd, GmbH) |
| Person name | Proper case; first/last split; no titles in name fields |
| Phone | E.164 (`+14155550123`); country inferred only from an explicit country field |
| Country / state | ISO 3166 codes or one picklist; no free text |
| Job title | Free text kept; derived seniority and function picklists for segmentation |
| Lifecycle / lead status | Fixed picklist with written definitions |
| Owner | Active user only; reassign records of departed users |
| Amount / currency | Number plus ISO currency; no text in amount |
| Dates | ISO 8601 |
| Source | Fixed picklist (inbound, outbound, referral, partner, event...) |

Required-at-stage rules: e.g. amount and close date required from Qualified onward; decision
maker and next step from Proposal onward.

## 3. Deduplication (CSV method)

1. **Normalize** into helper columns: email, domain (from email if no website, ignoring free
   mail providers like gmail.com), company name stripped of suffixes and punctuation, phone in
   E.164, name lowercase without accents.
2. **Exact match** keys, strongest first: email → (domain + normalized full name) → phone →
   company domain (for accounts) → external ID.
3. **Fuzzy match** on what remains: name/company similarity (e.g. token-sort ratio) above a set
   threshold (start ~90), only within the same domain or city to avoid false merges. Send
   matches between ~80 and 90 to manual review, never auto-merge.
4. **Clusters**: group matches into duplicate sets with a cluster ID and a match reason.
5. **Survivorship** — choose the master record, then fill fields:
   - Master: most complete, or most recent activity, or oldest create date (pick one rule, state it).
   - Field-level: most recent non-blank value wins, except: keep consent/opt-out if any record
     has it; keep the earliest create date and original source; concatenate notes.
   - Child records (activities, deals) re-parent to the master.
6. **Merge log**: cluster ID, master ID, merged IDs, rule applied, fields changed before → after,
   reviewer. This is the audit trail and undo map.

Python with pandas (and rapidfuzz for fuzzy matching) handles tens of thousands of rows; a
spreadsheet works for small lists. If a CRM is connected, use its native merge only after the
user approves the cluster list.

## 4. Stage definitions

Each stage gets a definition, **exit criteria** (verifiable evidence, not feelings), and an
expected age. Example B2B ladder, adapt to the team:

| Stage | Exit criteria (evidence required to move on) |
|---|---|
| Discovery | Pain confirmed in buyer's words; meeting with a relevant role held |
| Qualified | Budget range, authority path, need and timeline known (atrium:lead-qualification) |
| Solution / Demo | Success criteria agreed; key stakeholders saw the solution |
| Proposal | Proposal sent to and acknowledged by the decision maker |
| Negotiation / Commit | Verbal selection; legal/procurement engaged; signature date agreed |
| Closed won / lost | Signed / loss reason recorded from a fixed picklist |

Rules: one stage at a time; no skipping without a note; closed-lost requires a reason;
probability per stage from the team's own conversion history when available.

## 5. Opportunity audit

Flag each open opp, citing the field value that triggered it:
- Critical: amount blank or 0; close date in the past; no owner or departed owner; no stage.
- Attention: next step blank, or unchanged 14+ days; no activity 14+ days; time in stage
  > 2× that stage's median; close date unchanged on an opp older than 30 days while the stage
  hasn't moved; 0–1 contacts; current stage's exit criteria not evidenced.
- Clean: none of the above.

Suggested fixes (proposals only):
- Next step in the format `MM/DD - [verb] [what] with [who]`.
- Close date = stage-entered date + median remaining cycle for that stage; label as estimate.
- Stage moved back when exit criteria are not evidenced.
Group output by owner so each rep gets their own fix list. Forecast impact: atrium:pipeline-management.

## 6. Lead routing rules

Order of precedence (adapt):
1. Existing account match (by domain) → account owner.
2. Open opportunity on the account → opp owner.
3. Territory: region → company size band → industry/vertical.
4. Round-robin within the matched pod, skipping users who are out or at capacity.
Every assignment records which rule fired; manual overrides require a reason. Set an SLA for
first touch on inbound (e.g. same business day) and a re-route if it lapses.

## 7. Ongoing hygiene

- Required fields and picklists enforced at entry; validation over cleanup.
- Weekly: stale opp list per rep. Monthly: duplicate scan on new records. Quarterly: owner
  reassignment, picklist review, bounced/unsubscribed contacts suppressed.
- Retention: delete or anonymize personal data you no longer have a basis to keep, per the
  company's policy; this is not legal advice.

## 8. Deliverables

- `cleaned.csv` (or .xlsx via atrium:xlsx) plus `merge_log.csv` and `review_queue.csv`.
- Field standard and stage definition doc (Markdown or atrium:docx).
- Audit summary: counts by flag, % records failing each standard, top fixes by impact.

## 9. Review checklist

- [ ] Original export untouched; all changes in new files with a log.
- [ ] Match rules, thresholds and survivorship rule stated; borderline matches in manual review.
- [ ] Consent, opt-out and suppression flags preserved through merges.
- [ ] No records deleted; no values invented to fill blanks (blanks stay blank or flagged).
- [ ] Every flag cites the field value; every change shown before → after.
- [ ] Stage exit criteria are observable evidence.
- [ ] Nothing applied to a live CRM without explicit user approval.
