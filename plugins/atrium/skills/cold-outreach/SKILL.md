---
disable-model-invocation: true  # skl: on-demand pack skill
name: cold-outreach
description: >
  Writes and runs compliant cold outreach: personalized cold emails, LinkedIn messages and call
  touches, multi-step sequences, reply handling, plus email deliverability setup (SPF, DKIM,
  DMARC, sending domains, warmup, volume) and CAN-SPAM/GDPR basics. Use when the user asks for
  a cold email, outbound or prospecting sequence, follow-ups, LinkedIn outreach, help with
  replies, low reply or open rates, emails landing in spam, or setting up a domain for outbound.
---

# Cold outreach

Goal: a short sequence of relevant, honest messages to verified contacts, sent from
infrastructure that reaches the inbox, in the user's voice. Relevance beats volume. Never
invent facts about a prospect, fake familiarity ("loved your recent post" when you did not
read one), fabricate case studies, or use deceptive subject lines.

## 1. Discovery

Ask for what is missing:
- Offer: what problem it solves, for whom, proof (real customers, results, numbers they can
  stand behind), price band. No proof yet? Say so and use a question-led or insight angle.
- Audience: ICP and personas (atrium:icp-and-prospecting), list source, how contacts were
  verified, geography (drives compliance).
- Channels available: email, LinkedIn, phone; sending domains and tool (any; none required).
- Goal of the sequence (meeting, reply, trial) and capacity (sends per day, reps).
- Voice samples: two or three emails the user actually wrote. Match them.

## 2. Message rules

- Length: first email roughly 50-120 words. Follow-ups shorter.
- Subject: 2-7 words, lower friction, about their situation or the hook, not your product.
  Must reflect the content (CAN-SPAM). No "Re:" or "Fwd:" on a first touch.
- Opening line about them (trigger, role problem, observation), never about you. No "hope
  this finds you well", "I wanted to reach out", "quick question" padding.
- One idea, one call to action. Prefer a low-commitment interest CTA ("Worth a look?",
  "Open to comparing notes?") over a calendar link on touch one.
- Plain text, no images, at most one link (zero on touch one is best), no attachments.
- Write like a person: short paragraphs, no bullets in cold email, no buzzwords. Run
  forge:humanizer on drafts if they read machine-made.

## 3. Frameworks (pick per angle, not per habit)

- Observation, connection, ask: a specific fact about them, why it links to a problem you
  solve, a soft ask.
- Problem, proof, ask: name a pain common to their role, one real proof point, ask.
- Trigger: lead with the dated event (new role, funding, launch, hiring), then the implication.
- Before/after: their likely current state versus the outcome, no feature list.
- Give first: a useful insight, benchmark or teardown with no strings, then a light ask.
- Do the math: a simple, clearly-labelled estimate of what the problem costs them; show the
  assumption so they can correct it.
- Peer/neutral insight: what similar teams are doing differently (only from real observations).
- Ask before pitch: a genuine question about how they handle X today.

Offer the user 2-3 angles, then write the full sequence for the one they choose.

## 4. Personalization levels

1. Account/role-level (default for B/C tiers): segment pain + industry language.
2. Trigger-level: a recent, dated, sourced event.
3. Person-level (A tier): something they wrote, said or built, cited accurately.
Every personalized line must be traceable to a source in the list. If none exists, use role-
level relevance rather than invent a hook.

## 5. Sequence shape

Default: 4-6 touches over about three weeks, each adding a new angle; never "just bumping this".

| Day | Channel | Touch |
|---|---|---|
| 1 | Email | Main angle, interest CTA |
| 2-3 | LinkedIn | Connection request without pitch (or view + follow) |
| 4-5 | Email | New angle or proof point, reply in-thread |
| 7-8 | Phone (optional) | Call; short voicemail referencing the email (see atrium:sales-calls) |
| 10-12 | LinkedIn | Message once connected: brief, value-first |
| 14-18 | Email | Different angle: insight, peer example or math |
| 21 | Email | Polite close-the-loop; makes it easy to say "not now" or name the right person |

Stop immediately on reply, opt-out, or bounce. Recycle non-responders after ~90 days with a
new trigger, not the same copy.

## 6. Handling replies

Classify the reply first: interested, question, objection (timing, budget, competitor, no
need, authority), referral ("talk to X"), not now, unsubscribe, out-of-office, negative.
- Interested: propose two specific times or a link, confirm the agenda in one line.
- Objection: acknowledge, ask one question to understand it; do not argue (atrium:sales-calls).
- Referral: thank them, ask permission to mention their name, reach out to the referred person.
- Not now: ask when to reconnect, set the reminder, stop the sequence.
- Unsubscribe or "stop": remove at once across all channels and tools, confirm only if asked.
Look across replies periodically: if one objection repeats, fix the message that provokes it.

## 7. Deliverability basics

Set up before the first send; give these as a checklist, not a lecture:
- Use separate sending domains (look-alikes of the main brand) so cold mail reputation never
  touches the primary domain. Redirect them to the main site. Two or three mailboxes per domain.
- Authentication on every sending domain:
  - SPF: exactly one TXT record, under 10 DNS lookups, ending `~all` or `-all`, never `+all`.
  - DKIM: enabled in the mail provider, 2048-bit key.
  - DMARC: start at `p=none` with reporting, move to `quarantine`, then `reject` once reports
    are clean.
  - Custom tracking domain if link tracking is used at all.
- Warmup: let new domains age at least two weeks, then warm mailboxes gradually for several
  weeks (about four minimum) before cold volume. Keep warmup running alongside.
- Volume: ramp slowly to roughly 30-50 cold emails per mailbox per day; spread across
  business hours in the recipient's timezone with randomized gaps. Scale with more mailboxes,
  not more volume per mailbox.
- List hygiene: verify every address before sending; remove catch-all/risky where possible;
  keep hard bounces under about 2% and spam complaints near zero (well under 0.3%).
- Content: plain text, no link shorteners, minimal links, no open-tracking pixel if inboxing
  struggles (open rates are unreliable anyway; judge by replies).
- Monitor replies per mailbox; low reply rates hurt reputation. Pause a mailbox whose bounces,
  complaints or blocklist status spike, and diagnose before resuming.
Figures here are common practitioner guidance, not guarantees; providers change rules.
Large senders to Gmail/Yahoo also need one-click unsubscribe and aligned DMARC.

## 8. Compliance (not legal advice)

US (CAN-SPAM) for every commercial email: truthful From, Reply-To and routing; a subject that
is not deceptive; identify the message as an ad where required; the sender's valid physical
postal address; a clear way to opt out, honored within 10 business days and kept honored.
EU/UK (GDPR, plus ePrivacy/PECR): B2B cold email usually relies on legitimate interest; keep
it relevant to the person's professional role, collect minimal data, say where you got their
details, make objecting easy, and keep a suppression list. Some countries (e.g. Germany)
require prior consent even in B2B; check before emailing there. Canada (CASL) is stricter
than CAN-SPAM. LinkedIn: follow its user agreement; no automation that violates it. For
high-volume programs or regulated sectors, recommend the user check with counsel.

## 9. Measure and test

Track per step and per segment: delivered, bounce, reply rate, positive-reply rate, meetings
booked. Reply rates vary hugely by market; treat any benchmark you quote as an estimate and
prefer the user's own baseline. A/B test one variable at a time (angle, subject, CTA) with
enough sends per arm (a few hundred) before calling a winner. Reporting: atrium:marketing-analytics.

## Output

A sequence doc: the angle, per touch the channel, day, subject and body in the user's voice,
the personalization source for each variable, and a deliverability/compliance checklist status.

## Review checklist

- [ ] Every fact and personalization line is sourced; no fake familiarity or fake proof.
- [ ] Touch one: under ~120 words, one CTA, plain text, subject matches content.
- [ ] Each follow-up adds a new angle; stop rules on reply, opt-out and bounce.
- [ ] SPF/DKIM/DMARC, warmup, volume and verification covered for the sending setup.
- [ ] Opt-out and postal address present; EU/UK legitimate-interest notes where relevant.
- [ ] Sounds like the user, not a template.

Related: atrium:copywriting, atrium:email-marketing (opt-in newsletters, not cold),
atrium:lead-qualification, atrium:sales-calls, atrium:crm-hygiene.
