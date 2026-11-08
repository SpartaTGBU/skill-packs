---
disable-model-invocation: true  # skl: on-demand pack skill
name: icp-and-prospecting
description: >
  Defines an evidence-based ideal customer profile (firmographic, technographic, pain, budget,
  trigger and negative ICP), buyer personas and buying-committee maps, then builds a verified,
  sourced target-account and contact list with fit scores and buying signals. Use when the user
  asks "who should we sell to", wants an ICP or persona, a target account list, look-alikes of
  best customers, prospect research on a company, trigger/intent signals, or list building for
  outbound.
---

# ICP and prospecting

Goal: a short, defensible ICP and a list of real accounts and people worth contacting, each
with a source and a reason-to-reach-out. Never invent a company, person, title, email, phone
number, funding round or tech-stack fact. If you cannot verify it, leave the cell blank and
mark it `unverified` or `not found`.

## 1. Discovery (ask before building)

Gather, and ask for what is missing in one compact list:
- What is sold, price band, sales motion (self-serve, inside sales, field), sales-cycle length.
- Closed-won and closed-lost deals (CRM export or CSV: company, size, industry, deal value,
  cycle days, source/channel, loss reason). This is the best ICP input there is.
- Current customers they would clone and ones they would never sign again (and why).
- Geography, languages, regulated sectors to avoid, deal size floor.
- Data they can use: CRM, LinkedIn/Sales Navigator, enrichment tools, event lists, website
  visitor data. All optional; the method works with web search and public sources alone.
- Capacity: reps, sends/calls per week. The list should match capacity, not exceed it.

No deal data (new company)? Build a hypothesis ICP from interviews, competitor customers
(public case studies, review sites) and the founder's best guess, label it `hypothesis`,
and plan to revisit after 20-30 conversations.

## 2. Derive the ICP from evidence

When deal data exists:
1. Rank won deals by revenue, not count. Three large deals in one vertical outweigh twenty
   tiny ones elsewhere. If one account is more than ~25% of won revenue, say so and do not
   fit the ICP to that single outlier.
2. Group the top accounts and find what they share; compare with lost and churned deals to
   see what does not predict success.
3. Note which channel or source produced the best deals; it shapes where to prospect.
4. Do the arithmetic with a script or spreadsheet (see atrium:xlsx), not in your head.

Write the ICP across six dimensions, each with "evidence" (which deals, which data):

| Dimension | Capture |
|---|---|
| Firmographic | Industry, employee range, revenue range, geography, business model, growth stage |
| Technographic | Tools that signal fit or integration need; tools that signal a bad fit |
| Pain | The problem in their words, how they handle it today, cost of the status quo |
| Budget/authority | Who owns budget, typical spend band, procurement friction |
| Triggers | Events that open a buying window (see section 4) |
| Channel | Where these buyers can be reached and respond (email, LinkedIn, events, partners, communities) |

Add a negative ICP: 6-10 concrete disqualifiers (too small to pay, wrong model, in-house
build culture, regulated sector you cannot serve, competitor's locked-in customer base, etc.).

## 3. Personas and buying committee

For each target account type, map the roles and what each one cares about:
- Economic buyer: signs; cares about outcome, risk, payback.
- Champion: feels the pain daily and will sell internally; needs ammunition.
- Technical evaluator: integration, security, effort.
- End users: day-to-day workflow change.
- Blocker: procurement, legal, security, a rival internal project.
- Coach: insider who explains how decisions get made.

Per persona: titles and seniority (as actually used in this market), top 3 pains, success
metric, likely objections, the trigger that makes them act, and the message angle. Keep it
to one short card each. For complex deals plan to multi-thread: at least a champion plus the
economic buyer, and one technical contact once evaluation starts.

## 4. Signals and triggers

Rank signals by how reliably they predict a buying window; prioritize accounts that show
several:
1. Warm history: former customers, users who changed jobs (alumni), past opportunities, people
   who engaged with content or replied before.
2. New leader in the buying role (first ~90 days; outreach often lands best a few weeks in,
   once they are planning rather than onboarding).
3. High-intent first-party behaviour: pricing or comparison page visits, trial signups, demo
   no-shows. Act within a day or two.
4. Stack change: adopting a complementary tool, dropping a competitor, a migration.
5. Growth or change: funding, expansion, acquisition, new product line, regulatory deadline.
6. Hiring for roles your product supports or replaces; layoffs (cost-pressure angle, handle
   with care).

Every signal you cite needs a source and a date. A signal older than ~6 months is context, not
a trigger.

## 5. Score and tier accounts

Score fit out of 100 and keep evidence per line; `unknown` scores zero but is flagged for
research, not treated as a miss.

| Criterion | Points |
|---|---|
| Firmographic match | 25 |
| Pain likely present (evidence) | 20 |
| Budget / ability to pay | 20 |
| Technographic fit | 15 |
| Reachable contacts in the committee | 10 |
| Active trigger / timing | 10 |

Tiers: A (75+) gets researched, personalized multi-thread outreach; B (60-74) gets segment-level
personalization; C (40-59) goes to nurture or low-touch; under 40 or any negative-ICP hit is
excluded. Tune weights to the user's evidence; say what you changed.

## 6. Build the list

Sources, in order of preference: the user's CRM and past conversations; their own inbound and
event data; public sources (company sites, press releases, job posts, review sites, public
directories, conference speaker lists, open datasets); then optional tools if they have them
(Sales Navigator, Apollo, Clay, ZoomInfo, HubSpot, etc.). Use connected MCP/CRM tools when
present; never require one.

Rules:
- Respect platform terms. Do not scrape LinkedIn or other sites that prohibit it; do not
  bypass logins, rate limits or robots rules. Prefer exports and APIs the user is licensed for.
- Do not guess email addresses from name patterns or present a pattern as a contact. Emails
  come from the user's tools, a verification service, or the person's own public listing,
  and must be verified before any send (see atrium:cold-outreach).
- Collect the minimum personal data needed; business contact data only. For EU/UK people,
  note the source of each record so the user can tell the person where their data came from;
  the user's lawful basis (usually legitimate interest) is their call. Not legal advice.
- Re-check the CRM for existing owners or open opportunities before adding an account.

Output a CSV/sheet (atrium:xlsx for formatting) with columns:
`account, domain, tier, fit_score, fit_evidence, trigger, trigger_source, trigger_date,
contact_name, title, role_in_committee, linkedin_url, email, email_status, data_source,
date_collected, notes`. Blank beats invented. Cap the first batch at what the team can work
in two weeks.

## 7. Account research brief (for A-tier)

For each top account, a half-page brief: what they do and recent news (dated, sourced);
likely pains tied to the ICP; trigger; committee map with known and missing roles; one or
two personalization hooks per contact; the suggested angle and first touch. Use web search or
forge:research for depth. Hand off messaging to atrium:cold-outreach and scoring of inbound or
replied leads to atrium:lead-qualification.

## Review checklist

- [ ] ICP cites real deals/data or is labelled `hypothesis`.
- [ ] Negative ICP exists and is applied to the list.
- [ ] Every account and contact has a source and date; nothing fabricated or guessed.
- [ ] Emails marked verified/unverified; no pattern-guessed addresses.
- [ ] Signals are dated and recent; tiers match scores; unknowns flagged.
- [ ] List size fits team capacity; existing CRM owners checked.
- [ ] Scraping/ToS and data-protection notes given where relevant.

Related: atrium:customer-research (interview-led ICP), atrium:competitive-intel (competitor
customers and positioning), atrium:pipeline-management, atrium:crm-hygiene.
