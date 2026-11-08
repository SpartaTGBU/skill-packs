---
disable-model-invocation: true  # skl: on-demand pack skill
name: contract-review
description: >
  Reviews commercial contracts (SaaS/MSA, NDA, DPA, vendor, services, reseller, order forms) from
  the user's side: clause-by-clause checklist, GREEN/YELLOW/RED risk flags against a playbook or
  stated baseline, concrete redlines with rationale and fallbacks, and an escalation list for
  counsel. Not legal advice. Use when asked to review, redline or mark up a contract, triage an
  NDA, compare terms to a playbook, find risky clauses, or prepare negotiation points before
  signing.
---

# Contract review

Give a fast, structured first-pass review that helps the user negotiate and decides what needs a
lawyer. This is not legal advice. Always end by recommending that a qualified lawyer review the
contract before signing, and say so more firmly when anything is RED.

## 1. Context first

Ask (or infer and state) before reviewing:
- Which party the user is (customer/vendor, licensor/licensee, discloser/recipient, controller/
  processor). The same clause is fine for one side and dangerous for the other.
- Contract type, deal value, term, and what is being bought or sold.
- Deadline and leverage (standard paper vs negotiable, who drafted it).
- Focus areas or known concerns; data involved (personal data, health, payment data).
- Governing jurisdiction(s).
- A playbook: the organization's standard positions, acceptable ranges and escalation triggers.
  If none exists, say "reviewing against a generic market baseline" and label positions as such.

## 2. Method

1. Identify the document set: main agreement, order forms, SOWs, DPA, policies incorporated by
   reference (terms at a URL can change; flag them).
2. Read the whole contract before commenting: clauses interact (a broad indemnity can sit outside
   a liability cap; a definition can expand an obligation elsewhere; order of precedence decides
   conflicts).
3. Walk the checklist below; note clause numbers and quote the exact language that matters.
4. Classify each issue GREEN / YELLOW / RED.
5. Draft redlines for YELLOW and RED items, highest priority first.
6. Summarize for the decision-maker.

## 3. Clause checklist

| Area | Check |
|---|---|
| Definitions | Overbroad terms ("Confidential Information", "Affiliates", "Services") that widen obligations |
| Scope & deliverables | Clear description, acceptance criteria, SLAs and remedies (service credits as sole remedy?) |
| Payment | Net terms, late fees, taxes, auto price escalators and caps, disputed-invoice process, currency |
| Term & renewal | Auto-renewal and notice window, renewal price increases |
| Termination | For convenience (either side?), for cause and cure period, insolvency, effects: refunds, data return, transition assistance |
| Limitation of liability | Cap amount and basis (fees paid in prior 12 months?), mutual?, per-claim vs aggregate, exclusion of indirect/consequential damages, carve-outs (confidentiality, data breach, IP, indemnity, gross negligence) |
| Indemnification | Who indemnifies for what (IP infringement, data breach, third-party claims), mutual?, capped or uncapped, procedures, control of defense, settlement consent; an indemnity for "any breach" effectively removes the cap |
| IP ownership | Pre-existing IP retained, ownership of deliverables and customizations, work-for-hire, license scope, feedback clauses, use of customer data to train models |
| Confidentiality | Definition, exclusions, term and survival, permitted disclosures, return/destruction |
| Data protection | DPA present, roles (controller/processor), sub-processor approval and notice, security standards, breach notification timing (GDPR requires controllers to notify regulators within 72 hours, so processor notice must be faster), cross-border transfer mechanism (SCCs), deletion at end, audit rights |
| Warranties | Performance, compliance with law, no malware, disclaimer breadth, warranty remedy |
| Insurance | Required coverage types and limits vs deal risk |
| Assignment / change of control | Consent needed?, termination right on acquisition |
| Non-solicit / exclusivity / MFN | Scope, duration, whether they bind affiliates |
| Governing law & disputes | Law, venue, arbitration vs courts, jury waiver, fee shifting, injunctive relief |
| Force majeure | Defined events, notice, termination after prolonged event, payment obligations excluded? |
| Publicity | Logo/name use without consent |
| Boilerplate | Entire agreement, order of precedence, amendments in writing, notices address, survival |

## 4. Risk classification

- **GREEN (acceptable):** matches playbook or market norm for the user's side; no action.
- **YELLOW (negotiate):** off-standard but within an acceptable range or commonly negotiable;
  propose a redline, accept a fallback if refused.
- **RED (escalate):** outside acceptable range, uncapped or unusual exposure, or a deal-breaker;
  needs counsel and a business owner decision before signing.

Typical RED triggers (generic baseline; the playbook overrides):
- Uncapped liability for the user, or a cap far below deal value while the counterparty's is high.
- Broad one-way indemnity owed by the user, or indemnities outside the cap without limits.
- Assignment of the user's pre-existing IP, or vendor rights to use customer data beyond service
  delivery (including model training) without consent.
- Personal data processed with no DPA, no breach notice duty, or unrestricted sub-processing.
- Unilateral right for the other side to change terms, prices or policies by URL.
- Auto-renewal with a long notice window plus uncapped renewal increases.
- Exclusivity, non-compete or MFN obligations, or termination rights that lock the user in.
- Governing law or venue that makes enforcement impractical for the user.

## 5. Redline format

For each YELLOW/RED item:

| # | Clause | Current language (quote) | Proposed change | Rationale | Fallback | Priority |
|---|---|---|---|---|---|---|
| 1 | 9.2 Limitation of liability | "...shall not exceed fees paid in the prior one (1) month" | Change to "prior twelve (12) months" and make mutual | One month of fees does not cover realistic loss | Six months; carve out data breach to 2x fees | Must-have |

Rules: propose specific replacement text, not "clarify this". Keep edits minimal and in the
contract's own drafting style. Priority = must-have / should-have / nice-to-have; trade
nice-to-haves for must-haves. If the user wants a marked-up document, produce a tracked-changes
.docx via atrium:docx with comments carrying the rationale.

## 6. NDA quick triage

For NDAs, check only: mutual vs one-way (fits the disclosure direction?), definition breadth and
standard exclusions (public, already known, independently developed, received from a third party),
term (2-5 years typical; trade secrets may survive longer), permitted use limited to the stated
purpose, residuals clause (RED for discloser), non-solicit or non-compete hidden inside, governing
law. Standard paper with no issues can be GREEN in one paragraph.

## 7. Output

1. Summary (three to six lines): contract, user's side, overall risk, sign / negotiate /
   escalate recommendation, top issues.
2. Issues table: clause, issue, GREEN/YELLOW/RED, impact in plain language.
3. Redline table (section 5), must-haves first.
4. Questions for the business owner (commercial calls the reviewer cannot make).
5. Items for counsel: every RED item and anything jurisdiction-specific.
6. Statement: "This is an informational review, not legal advice. Have a qualified lawyer review
   before signing."

Keep it lean: skip GREEN detail unless asked; quote only the words that matter.

## 8. Review checklist

- [ ] User's side and contract type identified; playbook or generic baseline stated.
- [ ] Entire document set read, including incorporated terms and order of precedence.
- [ ] Liability cap and indemnity interaction checked together.
- [ ] Data protection reviewed whenever personal data is involved.
- [ ] Every YELLOW/RED item has a quote, a concrete redline, a rationale and a fallback.
- [ ] RED items routed to counsel; no statement presented as a legal conclusion.
- [ ] Jurisdiction-specific points flagged rather than asserted.

Pricing clauses can feed atrium:pricing (renewal caps, escalators); proposal and order-form terms
link with atrium:proposals.
