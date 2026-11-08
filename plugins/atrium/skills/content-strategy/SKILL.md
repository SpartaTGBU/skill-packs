---
disable-model-invocation: true  # skl: on-demand pack skill
name: content-strategy
description: >
  Plans what content to create and why: content pillars, prioritised topics mapped to buyer stage,
  topic clusters, a scored backlog and an editorial calendar, plus distribution and repurposing.
  Use when the user asks for a content strategy, content plan, editorial calendar, blog or topic
  ideas, topic clusters or pillar pages, "what should we write about", or wants content to drive
  traffic, leads or authority. For writing the pieces use atrium:copywriting or atrium:seo-content.
---

# Content strategy

Content earns its place when it is either **searchable** (captures existing demand) or
**shareable** (creates demand), and ideally both. Every piece maps to a business goal, a reader, a
buyer stage and a distribution path before anyone writes it.

## 1. Gather context

Load BRAND.md if it exists (atrium:brand-guidelines). Then establish, asking only for gaps:
- **Business**: product, model, ICP, sales motion (self-serve, sales-led), the goal content must
  move (traffic, signups, pipeline, retention, authority) and how it will be measured.
- **Customer research**: questions customers ask, words they use, objections, jobs to be done.
  Sources: sales and support transcripts, reviews, surveys, community threads (atrium:customer-research).
- **Current state**: existing content inventory, what performs (from analytics or Search Console
  exports if available), what is stale, domain strength if known.
- **Resources**: who writes, how many pieces per month is realistic, SME access, budget, formats
  the team can actually produce (writing, video, audio, design).
- **Competitors**: who ranks or gets shared for the topics that matter; their gaps
  (atrium:competitive-intel, atrium:seo-competitors).

## 2. Searchable vs shareable

| | Searchable | Shareable |
|--|-----------|----------|
| Captures | Existing demand (queries) | Attention (feeds, newsletters, communities) |
| Built on | Keyword intent, comprehensive answers | Original insight, data, story, a strong take |
| Lifespan | Compounds for years | Spikes, then fades unless it earns links |
| Measured by | Rankings, organic traffic, conversions | Shares, mentions, links, signups |

**Searchable checklist**: one primary query and its intent; matches the format of what currently
ranks; answers the query early; covers related subtopics; internal links to and from its cluster.
**Shareable checklist**: a point of view someone could disagree with; original data, experience or
example; a reason to forward it; a hook that survives being summarised in one line.

**Information-gain gate** (both types): what does this piece contain that the top existing pieces
do not? First-hand experience, proprietary data, a worked example, a better framework, expert
input. If the answer is "nothing", do not publish it; rework the angle or drop it.

## 3. Content types

- **Use-case / job pages**: "[job] for [audience]", tied to product capability.
- **Hub and spoke**: a pillar page covering a broad topic, linking to spokes covering subtopics.
- **Templates, checklists and tools**: high intent, high link potential, natural product bridge.
- **Thought leadership**: a defensible point of view from someone with standing to hold it.
- **Data-driven**: original surveys, product data (aggregated, anonymised, permitted), analyses.
  Tends to earn links and citations; label sample size and method.
- **Comparisons and alternatives**: "X vs Y", "X alternatives". Keep fair, factual and dated.
- **Roundups and expert input**: only with real, attributed contributions.
- **Case studies**: real customer, real numbers, with written permission.
- **Behind the scenes**: how the team works, builds, decides; strong for trust and social.

Formats that tend to earn links: original research, free tools, templates, definitive guides,
visual explainers. Treat this as a tendency, not a promise; no link rate is guaranteed.

## 4. Pillars

Choose 3–5 pillars: broad themes where the business has standing and the audience has need.
Pick the lens that fits:
- **Product-led**: problems the product solves.
- **Audience-led**: the reader's job and career beyond the product.
- **Search-led**: clusters with meaningful demand (from keyword research).
- **Competitor-led**: gaps competitors leave open.
For each pillar: why we can win, target reader, buyer stages covered, 5–15 starter topics.

## 5. Map to buyer stage

| Stage | Reader state | Modifiers / formats | Goal |
|-------|-------------|--------------------|------|
| Awareness | Has a problem, not a solution | what is, how to, guide, why, examples | Reach, trust |
| Consideration | Comparing approaches | best, vs, alternatives, checklist, template | Preference |
| Decision | Choosing a vendor | pricing, reviews, demo, case study, ROI | Conversion |
| Implementation | Customer, getting value | tutorial, setup, integration, best practices | Activation, retention |

Most teams under-invest in decision and implementation content; check the balance.

## 6. Ideation sources

- **Keyword data** (atrium:keyword-research): build a table
  `Keyword | Volume | Difficulty | Stage | Type | Priority`. Volumes and difficulty come from the
  user's tool (OpenSEO MCP if connected, or exports); never estimate them silently. If no data
  source exists, mark the columns "unknown" and rank by intent and fit instead.
- **Transcripts** of sales and support calls: repeated questions become articles; objections
  become comparison or FAQ content.
- **Surveys**: themes raised by roughly 30%+ of respondents are high priority.
- **Communities and forums** (via web search): recurring questions and complaints in the reader's
  own words. Respect each site's terms; read, do not scrape.
- **Competitor content**: what ranks, what gets shared, what is missing or outdated.
- **Sales and support teams**: ask directly what they wish existed to send to prospects.

## 7. Prioritise

Score each idea 1–5 per factor, then weight:

| Factor | Weight | Question |
|--------|--------|----------|
| Business impact | 40% | Does it move the goal (pipeline, signups, retention)? |
| Fit and authority | 30% | Can we say something better than what exists? |
| Search / share potential | 20% | Real demand or a clear distribution path? |
| Resource cost | 10% | Cheap to produce well? (higher = cheaper) |

Sort by weighted score. Mark any input that is an estimate.

## 8. Clusters and calendar

- Group topics into clusters: one pillar page, its spokes, internal links both ways
  (atrium:seo-content for on-page, atrium:programmatic-seo for templated pages at scale).
- Starting mix (adjust with data): about 60% searchable, 30% shareable, 10% experimental.
- Cadence the team can sustain beats an ambitious one it abandons. Plan a quarter, commit a month.
- Calendar columns: date, title, pillar, stage, type, primary keyword (if any), owner, status,
  distribution channels, repurpose plan, success metric.

## 9. Per-format discipline

- **Blog / article**: write ~10 title options and pick one; outline before drafting; several
  editing passes (atrium:copy-editing); one clear next step.
- **Guide / pillar**: build the hub page first with a table of contents; spokes link back.
- **Video**: hook in the first seconds; script the structure; captions always.
- **Podcast / webinar**: plan clips and quotes before recording; atomise afterwards.
- **Email newsletter**: one idea per send; a reason to open next time (atrium:email-marketing).

## 10. Distribution and repurposing

Create once, distribute at least twice. For each piece plan: owned channels (site, email list),
rented channels (social platforms, atrium:social-media), borrowed channels (partners, guest
spots, communities, podcasts). Route attention from borrowed to rented to owned: every borrowed
appearance points to something that grows the email list or site.

Repurpose: a long piece becomes social posts, a thread, a carousel, a newsletter section, short
clips. Refresh evergreen winners on a schedule (atrium:copy-editing, content refresh).

## 11. Failure modes

- **Spray and pray**: many unrelated posts, no clusters, no stage logic.
- **Platform dependency**: all reach rented from one platform; one algorithm change ends it.
- **Ownership paradox**: content built for a platform with no path back to owned channels.
- **Vanity metrics**: traffic that never converts; measure against the business goal.
- **Undifferentiated content**: fails the information-gain gate; adds nothing to the results page.
- **Fabricated proof**: invented stats, quotes or case studies. Never; mark gaps as `[NEED: ...]`.

## 12. Output

Deliver the smallest useful plan:
1. **Strategy summary** (half a page): goal, audience, metric, pillars and why we can win.
2. **Pillars** with stage coverage.
3. **Priority topic list** with scores, stage, type, data source for any numbers.
4. **Cluster map** (pillar → spokes; optional diagram via atelier:diagrams).
5. **Calendar** for the first month or quarter (Markdown table or .xlsx via atrium:xlsx).
6. **Measurement**: what to track per type and when to review (atrium:marketing-analytics).

## 13. Review checklist

- [ ] Every piece maps to a goal, reader, stage and distribution path.
- [ ] Each passes the information-gain gate.
- [ ] Stage balance checked; decision and implementation content not neglected.
- [ ] Search numbers sourced or marked unknown; no invented volumes.
- [ ] Cadence matches stated resources.
- [ ] Repurposing and refresh planned for the top pieces.

## Related

atrium:keyword-research, atrium:seo-content, atrium:programmatic-seo, atrium:link-building,
atrium:social-media, atrium:email-marketing, atrium:launch, atrium:customer-research,
atrium:competitive-intel, atrium:marketing-analytics, atrium:marketing-plan.
