---
disable-model-invocation: true  # skl: on-demand pack skill
name: social-media
description: >
  Plans and writes organic social media: platform choice, content pillars, hooks, posts, threads
  and carousels, repurposing, a weekly calendar, community engagement and performance review across
  LinkedIn, X, Instagram, TikTok, Facebook, YouTube and Threads. Use when the user asks for social
  posts, a LinkedIn post, an X thread, a social calendar or strategy, to repurpose content for
  social, grow an audience or account, or handle comments and replies. Paid social is atrium:paid-ads.
---

# Social media

Write posts a real person would stop for, in the brand's voice, on the platforms where the
audience already is. Consistency and specificity beat volume.

## 1. Gather context

Load BRAND.md if it exists (atrium:brand-guidelines); otherwise ask for 3–5 past posts the user
likes and match them. Then establish, asking only for gaps:
- **Goal**: awareness, community, leads, hiring, thought leadership. One primary per account.
- **Audience and platforms**: who, and where they actually spend time. Start with 1–2 platforms
  done well rather than five done badly.
- **Account**: personal (founder, employee) or brand; current followers and what has worked.
- **Resources**: hours per week, who approves, video and design capacity, source material
  (blog posts, podcasts, webinars, customer stories).
- **Constraints**: regulated claims, disclosure rules, topics to avoid.

## 2. Platforms at a glance

Starting points, not rules; adjust to resources and results. Limits and specs are in
`references/platforms.md` (verify; they change).

| Platform | Starting cadence | Formats that tend to work | Best for |
|----------|-----------------|---------------------------|----------|
| LinkedIn | 3–5 posts/week | Text stories, carousels (PDF), native video | B2B, founders, hiring |
| X | 1–3 posts/day plus replies | Threads, short takes, replies | Tech, media, real-time |
| Instagram | 3–5 posts/week, Stories most days | Reels, carousels | Consumer, visual brands |
| TikTok | 3–7 videos/week | Short native video | Consumer, younger audiences |
| Facebook | 3–7 posts/week | Groups, native video | Local, community, older audiences |
| YouTube | 1 long-form/week or less, plus Shorts | Long-form, Shorts | Search, tutorials, depth |
| Threads | Daily | Conversational text | Casual, community |

## 3. Pillars

Pick 3–5 pillars tied to the goal and brand. Example starting mix for a B2B account:
industry insight ~30%, behind the scenes ~25%, educational ~25%, personal/human ~15%,
promotional ~5–10%. Promotion stays a minority; earned trust makes it work. Track the mix in the
calendar and rebalance from results.

## 4. Writing posts

### Hooks
The first line decides everything. Hook types, each filled with a real, specific fact:
- **Curiosity**: an unexpected result or detail ("We deleted our onboarding emails. Activation went up.").
- **Story**: start in the middle of a moment ("At 2am the payment system went down.").
- **Value**: the payoff stated plainly ("How we cut support tickets by a third: 4 changes.").
- **Contrarian**: a defensible disagreement with common advice, then the reasoning.
Only use numbers the user can stand behind. Mark gaps `[NEED: real figure]`.

### Body
- One idea per post. Short paragraphs, line breaks for mobile, plain words.
- Show, do not claim: an example, a screenshot description, a before/after, a specific mistake.
- End with a natural next step: a question worth answering, a link (in a comment where the
  platform penalises links), or nothing. No begging for engagement.

### Threads and carousels
- Thread: the first post must stand alone; each post one point; number them only if it helps;
  last post summarises and points to the source.
- Carousel: slide 1 is the hook, one idea per slide, large type, last slide the takeaway and CTA.

### AI tells to avoid
Everything in atrium:copywriting section 5, plus the social-specific ones:
- Broetry: one-sentence paragraphs stacked for drama.
- Engagement bait: "Agree?", "Comment YES", "Tag someone who...".
- Manufactured vulnerability: invented failures or tearful lessons.
- Emoji bullets on every line, hashtag walls, "Let that sink in", "Here's the kicker".
Run forge:humanizer when a draft still reads machine-made.

## 5. Repurposing

Break long content into atoms: a stat, a story, a quote, a step, a mistake, a framework, a
contrarian point. Each atom becomes a post adapted to each platform's native format, not
cross-posted verbatim.

Per podcast episode or webinar, a reasonable yield: 3–5 short clips, 1–2 LinkedIn posts, 1 thread,
1 carousel, 1 newsletter section. Per blog post: 3–5 posts across platforms over two weeks.
Reshare evergreen winners every 3–6 months with a new hook.

## 6. Calendar and workflow

- Batch: 2–3 hours a week to draft; keep a 1–2 week approved queue.
- Weekly template: map pillar per slot (e.g. Mon educational, Tue behind the scenes, Wed industry,
  Thu customer story, Fri personal), then fill from the idea bank.
- Calendar columns: date, platform, pillar, hook, format, asset needed, source atom, owner,
  status (idea / draft / approved / scheduled / live), link, result.
- Never publish or schedule without the user's approval. Never invent prices, claims, quotes,
  customer names or results. Testimonials and partner mentions need permission.

## 7. Engagement

- Budget about 30 minutes a day; reply to every genuine comment in the first hours.
- Comment substantively on 5–10 posts a day from target accounts and peers.
- Keep a list of 20–50 relationship accounts (customers, partners, peers, creators) and engage
  consistently. A few genuine DMs a week; no automated or templated DM blasts.

Response framework:
| Type | Response |
|------|----------|
| Question | Answer quickly and specifically; link to help if useful |
| Complaint | Acknowledge publicly, move details to private channel, follow up publicly when resolved |
| Praise | Thank and amplify (reshare with permission) |
| Misinformation | Correct once, politely, with a source |
| Trolls | Ignore unless factually wrong or harmful; hide or report abuse per platform rules |
Escalate anything legal, safety-related or press-related to a human immediately.

## 8. Platform notes

- **LinkedIn**: the hook must land before the "see more" cut (~210 characters); posts of roughly
  1,200–1,500 characters often perform well; put external links in the first comment; reply in the
  first hour; dwell time matters, so make the post worth reading to the end.
- **X**: put the specific claim in the first few words; native video with captions; space posts
  out (roughly an hour apart); replies to larger accounts are a major growth channel.
- **Instagram / TikTok**: hook in the first second of video; captions on; trend formats only when
  they fit the brand; post natively, not with another platform's watermark.
- **YouTube**: title and thumbnail are the hook; front-load the value; chapters for long-form.

## 9. Listening

Track brand, product, competitor and category mentions with web search or the platform's own
search and notifications (or a listening tool the user already has). Respect platform terms; do
not scrape. Log recurring questions as content ideas (atrium:content-strategy) and complaints for
atrium:customer-support.

## 10. Measure

| Goal | Metrics |
|------|---------|
| Awareness | Impressions, reach, follower growth, profile visits |
| Engagement | Engagement rate, comments, saves, shares, replies |
| Conversion | Link clicks, signups, demo requests, attributed pipeline (UTM-tagged links) |

Weekly review: top 3 and bottom 3 posts with a hypothesis for each; adjust the next week's hooks,
formats and pillar mix. Monthly: compare against the goal, not against vanity numbers. Use only
numbers from the platform or analytics exports (atrium:marketing-analytics); say when data is missing.

## 11. Output

- **Posts**: ready-to-paste text per platform, with hook alternatives (2–3), suggested visual or
  asset, link placement, and any `[NEED: ...]` gaps.
- **Strategy**: platforms and why, pillars and mix, cadence, engagement routine, metrics.
- **Calendar**: table for 1–4 weeks (Markdown or .xlsx via atrium:xlsx).

## 12. Review checklist

- [ ] Hook is specific and true; would the target reader stop scrolling?
- [ ] On-brand voice; no AI tells from section 4.
- [ ] Native to the platform (length, format, link placement, hashtags within limits).
- [ ] No invented numbers, quotes, customers or results; permissions noted.
- [ ] Sponsored or affiliate content disclosed per platform rules and local advertising law.
- [ ] Clear purpose: which pillar, which goal.
- [ ] Approved by the user before scheduling.

## Related

atrium:brand-guidelines, atrium:copywriting, atrium:content-strategy, atrium:marketing-analytics,
atrium:cold-outreach (DM outreach rules), atrium:paid-ads (boosting and paid social),
forge:humanizer.
