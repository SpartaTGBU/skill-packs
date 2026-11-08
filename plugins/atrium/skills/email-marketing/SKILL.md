---
disable-model-invocation: true  # skl: on-demand pack skill
name: email-marketing
description: >
  Designs and writes lifecycle email programs and campaigns: welcome, nurture, onboarding,
  trial-to-paid, re-engagement, win-back, billing/dunning, launch and newsletters, with timing,
  branching, exit and suppression rules, full copy, deliverability and compliance checks. Use
  when asked for an email sequence, drip or nurture flow, onboarding or welcome emails, a
  newsletter, re-engagement of a cold list, failed-payment emails, or why emails don't convert.
---

# Email marketing

Opt-in email only. Prospecting people who never opted in is atrium:cold-outreach. Every email
has one job; every sequence has a trigger, a goal and an exit. Never invent benchmarks, results
or testimonials; label any target as an estimate.

## 1. Discovery

Collect what exists, then ask for the gaps in one short list:
- **Program**: sequence type (below) or one-off campaign/newsletter.
- **Trigger**: what enters someone (signup, lead magnet download, trial start, purchase, X days
  inactive, failed charge, event attended).
- **Goal**: the one action that means success and ends the sequence (activate, book demo,
  upgrade, repurchase, reply).
- **Audience**: who they are, what they already know and believe, B2B or B2C, stage, segments
  available (behavior, plan, role, use case).
- **Other mail they get**: existing sequences, newsletters, transactional mail, in-app messages.
  Overlap is the most common failure.
- **Assets**: offers, case studies, guides, videos, landing pages, product screenshots.
- **Voice**: brand guidelines or sample emails (atrium:brand-guidelines); else clear and
  conversational.
- **Data**: current open/click/conversion/unsubscribe/complaint rates, list size and age, ESP in
  use (optional; work from plain files if none).

## 2. Sequence types and default shapes

Starting points, not rules. Length depends on sales cycle and product complexity.

| Type | Trigger | Shape |
|---|---|---|
| Welcome | Signup / subscribe | 3-7 emails over ~2 weeks: deliver what was promised now; quick win; why we exist; proof; objection; core feature; ask |
| Lead nurture | Lead magnet / content opt-in | 5-8 over 3-4 weeks: deliver asset; expand topic; problem deep-dive; framework; case study; differentiation; objection; direct offer |
| Onboarding | Account created | 5-7 over 14 days, driven by product events: first step; setup help; key feature; success story; check-in; advanced tip; upgrade/expand |
| Trial-to-paid | Trial start | Value emails early, then expiry notices (e.g. 7, 3, 1 days) summarizing what they built and what changes |
| Re-engagement | 30-90 days no opens/clicks/logins | 3-4 over ~2 weeks: genuine check-in; what's new; incentive (optional); last call to stay or be removed |
| Win-back | Trial expired / cancelled | 3-5 over ~30 days: ask what went wrong; what changed since; offer; feedback request; door open |
| Post-purchase | Order / payment | Confirmation; how to get value; review or referral ask after value; cross-sell later |
| Billing | Failed charge, renewal, plan change | Dunning: immediate notice with update link, reminders over the retry window, final notice before downgrade; renewal reminders ahead of annual charges; annual-switch offer |
| Launch | Release date | Teaser; announcement; feature spotlight; proof; deadline reminder (atrium:launch) |
| Event | Registration / attendance | Reminders; post-event recording and takeaways; next step; feedback |
| Upsell | Usage limit / milestone | Celebrate milestone; limit they hit; plan comparison with proof; optional time-bound incentive |
| Usage / milestone | Product activity | Periodic summary of their results; milestone notices; no hard sell |

Trigger on behavior (did X, didn't do Y) over the calendar wherever the data allows. Onboarding
email supports in-app onboarding, never duplicates it (activation design: atrium:cro).

## 3. Architecture before copy

1. **Arc**: the progression from first to last email (trust, then value, then ask). Map each
   email to a journey stage.
2. **Timing**: first email immediately; early emails 1-2 days apart; nurture 2-4 days; long-term
   weekly or less. Send in the recipient's time zone. B2B: weekdays; B2C: test weekends.
3. **Branching**: e.g. clicked → skip ahead; opened but no click → softer re-ask; did the key
   action → move to the next stage's sequence.
4. **Exit**: remove on conversion (define it exactly), on unsubscribe, on reply if a human should
   take over.
5. **Suppression**: already in another active sequence with higher priority, recent support ticket
   or open incident (e.g. last 48h), customers excluded from acquisition offers, unsubscribed or
   bounced.
6. **Re-entry**: whether and when someone can repeat a sequence (e.g. win-back again after 90
   days, never twice in a month).
7. **Frequency cap** across all programs per person per week.

## 4. Copy

- **One email, one job, one primary CTA.** Button for the main action, text links for secondary.
  Button copy = action + outcome ("See my report", "Finish setup"), not "Click here".
- **Structure**: hook (first line earns the second), context (why this matters to them now),
  value, CTA, human sign-off from a real person where possible.
- **Subject**: clear beats clever; specific; roughly 30-60 characters with the key words first for
  mobile. Patterns: question, how-to, number, direct ("Your report is ready"), story tease.
  Write 2-3 options per email for testing.
- **Preview text**: extends the subject, never repeats it; set it explicitly or the client shows
  the first body line.
- **Length**: transactional ~50-125 words, educational ~150-300, story-driven ~300-500. Shorter
  unless the content earns it.
- **Format**: 1-3 sentence paragraphs, white space, scannable, mobile-first, works with images off,
  real alt text, accessible contrast, plain-text part included.
- **Personalization**: merge fields with safe fallbacks; dynamic blocks by segment, plan or
  behavior; reference what they actually did. Never fake intimacy ("Re:" on a first email, fake
  forwards).
- **Avoid AI tells**: "it's not X, it's Y" reversals, stacked negations, stock openers ("I hope
  this finds you well"), filler intensifiers. Run final copy through forge:humanizer; deeper copy
  work in atrium:copywriting and atrium:copy-editing.
- **Honesty**: real deadlines only, real scarcity only, offers honored as stated.

## 5. Newsletters and campaigns

- Define the promise (what, how often) at signup and keep it.
- Consistent format: one lead item, a few short items, one clear CTA; a reason to open each time.
- Segment campaign sends (engaged recent clickers first; exclude the long-unengaged).
- Promotions and pricing changes: give notice, state what changes and when, link details.

## 6. Deliverability

- **Authentication**: SPF, DKIM and DMARC on the sending domain, aligned with the From domain.
  Bulk senders to Gmail/Yahoo must also offer one-click unsubscribe (List-Unsubscribe headers)
  and keep spam complaints low (stay well under 0.3%, aim near 0.1%). Verify current rules with
  the providers.
- Separate streams (subdomains or IPs) for transactional and marketing so promotions can't hurt
  receipts and password resets.
- Warm new domains or IPs gradually, starting with the most engaged contacts.
- **List hygiene**: double opt-in where practical, remove hard bounces immediately, never buy or
  rent lists, sunset policy (re-engage after ~90-180 days inactive, then suppress).
- Spam-trigger content matters less than engagement; still avoid all-image emails, link
  shorteners, misleading subjects.

## 7. Measurement

- Opens are unreliable (Apple Mail Privacy Protection preloads images); use them only for
  directional subject tests and deliverability alarms. Judge on clicks, conversions and
  revenue per recipient.
- Per email: delivered, click rate, unsubscribe rate, complaint rate, bounce rate.
- Per sequence: conversion to the goal, time to conversion, drop-off by email, revenue
  attributed (with the window stated).
- Use a holdout group for big programs to measure incremental lift, not just correlated
  conversions.
- UTM-tag every link consistently (atrium:marketing-analytics). Test one variable at a time with
  enough recipients to detect the change (sample sizing: atrium:cro).
- Benchmarks vary widely by industry and list; only quote ones the user's data or a named source
  supports, labeled as such.

## 8. Compliance (not legal advice)

- **CAN-SPAM (US)**: accurate From/headers, non-deceptive subject, identify ads as such, valid
  physical postal address, clear unsubscribe that works for at least 30 days and is honored
  within 10 business days, no fee or login to unsubscribe.
- **GDPR/UK GDPR (EU/UK)**: lawful basis (usually consent for marketing; soft opt-in for existing
  customers under PECR where it applies), unticked consent boxes, record when and how consent
  was given, easy withdrawal, data minimization.
- **CASL (Canada)**: express or implied consent with expiry, sender identification, unsubscribe.
- Transactional emails (receipts, password resets, dunning) can't carry heavy promotion without
  becoming marketing.
- Recommend counsel for regulated sectors (health, finance, children) or cross-border edge cases.

## Output

1. **Sequence overview**: name, trigger, goal, length, timing, exit, suppression.
2. **Table**: # | Send timing | Subject | Purpose | CTA | Condition.
3. **Text flow diagram** of branches and exits.
4. **Full drafts** per email: send timing, 2-3 subject options, preview text, body, CTA → link,
   segment/condition notes.
5. **Measurement plan**: primary metric, per-email metrics, 1-3 tests, review cadence.
6. **Setup checklist** for any ESP: create automation, set trigger, add emails and delays,
   configure branches/exits/suppression, tag links, send tests to real inboxes, monitor week one.

If an email tool is connected, map the flow to its automation builder; otherwise deliver
copy-paste-ready content.

## Review checklist

- [ ] Every email has one job, one primary CTA, and a stated condition and timing
- [ ] Trigger, exit on conversion, suppression and frequency cap defined
- [ ] No overlap or conflict with the recipient's other sequences or in-app messages
- [ ] Subject and preview distinct, specific, honest; no fake "Re:" or false urgency
- [ ] Copy reads as a human wrote it; mobile and images-off checked
- [ ] Links UTM-tagged and pointing to message-matched pages
- [ ] Unsubscribe, postal address, consent basis in place; deliverability basics confirmed
- [ ] Metrics judged on clicks/conversions; any benchmark sourced or labeled as an estimate
