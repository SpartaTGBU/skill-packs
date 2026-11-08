---
disable-model-invocation: true  # skl: on-demand pack skill
name: launch
description: >
  Plans and runs product launches and feature announcements: readiness gate, phased rollout
  (alpha, beta, early access, full launch), owned/rented/borrowed channel plan, Product Hunt
  playbook, tiered announcements, and turning shipped changes into grounded release notes and
  changelog digests. Use when launching a product or feature, planning a launch or Product Hunt
  day, announcing an update or pricing change, writing release notes or a changelog, or asking
  "how do we market what we just shipped".
---

# Launch

Read `.agents/product-marketing.md` first (fallback `.claude/product-marketing.md`); if missing,
run atrium:marketing-plan to create it. A launch is not one day: it is a sequence of chances to
reach people, moving them from rented and borrowed channels into owned ones.

## 1. Discovery

Ask what the context file doesn't answer:
- What is launching (new product, major feature, minor update, pricing change, integration)?
- Who is it for, and how big is the current audience (email list, followers, users, community)?
- Owned channels available (list, blog, in-app, community, changelog)?
- Timeline and any hard date (event, funding news, contract)?
- Past launches: what worked, what flopped? Product Hunt or similar planned?
- Who is available on launch day to engage, and for how long?

## 2. Readiness gate

Launch only when the product is **SLC**: Simple (does one job clearly), Lovable (people want it,
not just tolerate it), Complete (the core job works end to end with no dead ends).
Two failure modes to call out:
- **Stealth mode:** building for months without showing anyone; no audience at launch.
- **"Just one more feature":** delaying for scope that doesn't change the core job.
If the gate fails, say what is missing and propose a smaller launch tier instead of waiting.

## 3. Channel plan: owned, rented, borrowed (ORB)

- **Owned** (you control reach): email list, blog, changelog, in-app, community, product itself.
  Every launch tactic should end by growing owned audience.
- **Rented** (platform controls reach): social networks, marketplaces, app stores, Product Hunt,
  Reddit, Hacker News. Pick 1–2 where the ICP already is; use them to funnel into owned.
- **Borrowed** (someone else's audience): guest posts, podcasts, newsletters, co-marketing,
  integration partners, influencers, affiliates. Pitch these 3–6 weeks ahead.
The plan must use all three. Respect each platform's rules (no vote-buying, no fake accounts,
disclose paid or affiliate relationships).

## 4. Phased rollout

| Phase | Goal | Moves |
|---|---|---|
| Internal | Validate the core job | Team and friendly users test; fix blockers |
| Alpha | Start the audience | Landing page + waitlist; share build progress |
| Beta | Build anticipation | Teasers, early-access invites, collect testimonials |
| Early access | Learn and create proof | Share screenshots and demos; invite in batches (5–10% of waitlist at a time); run the PMF survey (see atrium:customer-research) |
| Full launch | Maximum reach | Coordinated touchpoints across ORB channels, open signups |

Skip phases for small updates; never skip collecting proof before the full launch.

## 5. Announcement tiers

- **Major** (new product, big capability, pricing change): full campaign: email, blog post,
  social, in-app, PR/borrowed channels, sales enablement (atrium:sales-enablement), site update.
- **Medium** (meaningful feature): targeted email to affected segment, in-app message, blog or
  social post, changelog.
- **Minor** (fix, polish): changelog and in-app note only.
Pricing changes are launches: lead with the value, explain the change and timing, honor
existing commitments, and coordinate with atrium:pricing and atrium:customer-success.

## 6. Product Hunt (if chosen)

- **Before:** build relationships in the community weeks ahead; prepare tagline, gallery images,
  short demo video, maker comment telling the story; line up supporters to *visit and comment
  honestly* (never ask for upvotes; follow current PH rules).
- **Launch day:** treat it as an all-day event; reply to every comment fast and personally; post
  to owned channels; convert visitors to email signups or trials, not just votes.
- **After:** thank supporters, email everyone who engaged, publish a short recap, add the badge
  only if earned.
Same pattern for Hacker News (Show HN), Reddit and marketplaces, within their rules.

## 7. Shipped-changes workflow (release notes, changelog, "what's new")

1. Gather what actually shipped: merged PRs, commits, release tags, tickets in the date range.
2. Keep only what is live for users: not behind a feature flag, not reverted, not internal-only.
   If unsure, ask.
3. Translate each change into a user benefit: "You can now ___" (job, not implementation).
4. Tier each item (major / medium / minor) and group by audience.
5. Ground every claim in the change itself. Never invent results, speedups or customer outcomes;
   if a number isn't measured, leave it out.
6. **Claim-drift check:** search the site, docs, help center and ads for statements the change
   makes outdated (old limits, removed features, old prices); list them for update.
7. Output a digest in Keep a Changelog headings (Added, Changed, Fixed, Removed, Deprecated,
   Security), plus draft copy per channel for major/medium items.
8. Stage drafts for human approval; nothing publishes automatically.

## 8. Checklists

**Pre-launch**
- [ ] Context file current; positioning and one-line message agreed.
- [ ] Landing page live, tracked (atrium:marketing-analytics), conversion path tested (atrium:cro).
- [ ] Site QA: no staging `noindex` shipped to production, meta tags, OG images, broken links.
- [ ] Launch email(s) drafted (atrium:email-marketing); social posts (atrium:social-media).
- [ ] Borrowed channels confirmed with dates; press/partner kit ready.
- [ ] Support briefed (atrium:customer-support); FAQ and docs updated.
- [ ] Owner and time slot for every launch-day task.

**Launch day**
- [ ] Publish in the planned order; check every link and form live.
- [ ] Monitor comments, support inbox and errors; reply fast.
- [ ] Track signups/trials per channel hourly.

**Post-launch (first 2 weeks)**
- [ ] Onboarding emails for new signups; roundup email to the full list.
- [ ] Comparison and alternative pages (atrium:competitive-intel, atrium:programmatic-seo).
- [ ] Update site, pricing, docs; add proof (testimonials, logos) with permission.
- [ ] Interactive demo or walkthrough for those who didn't sign up.
- [ ] Retro: results vs targets, learnings appended to the context file.

## 9. Deliverable

A one-page launch plan: goal (number), tier, readiness verdict, phase timeline, ORB channel table
(channel, owner, date, asset, metric), launch-day run sheet, post-launch follow-ups, and
risks. For release notes: the changelog digest plus per-channel drafts. Write copy with
atrium:copywriting and polish with forge:humanizer.

## 10. Review checklist

- [ ] Readiness gate explicitly passed or a smaller tier chosen.
- [ ] Owned, rented and borrowed channels all present; rented/borrowed funnel into owned.
- [ ] Every claim traceable to a shipped change or real data; nothing behind a flag is marketed.
- [ ] Claim-drift list produced; nothing auto-publishes.
- [ ] Platform rules and CAN-SPAM/GDPR respected (consent, unsubscribe, disclosures).
- [ ] Every task has an owner and date; success metric set before launch.
