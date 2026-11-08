---
disable-model-invocation: true  # skl: on-demand pack skill
name: seo-content
description: >
  Plans, briefs and optimizes search content: reads SERP intent and competitors, finds topic,
  depth and information gaps, writes content briefs and outlines, applies on-page rules,
  strengthens E-E-A-T and AI citation readiness, builds topic clusters with hub/spoke linking,
  checks cannibalization and plans refreshes. Use when the user asks for a content brief,
  article outline, on-page or content optimization, improving an existing page's rankings,
  E-E-A-T review, helpful-content quality, topic clusters or pillar pages, keyword-to-page
  mapping, cannibalization, content refresh or decay, or getting cited by AI answers.
---

# SEO content

Write pages that deserve to rank: the best answer to the searcher's real intent, with something
the current results lack. No keyword density targets and no word-count padding.

## Data

If OpenSEO MCP tools are connected, use them for keyword/SERP/backlink data; otherwise use web
search, Search Console/GA exports or other data the user provides. Label every volume, ranking
and traffic number with its source and date; mark modeled numbers as estimates. Never invent
statistics, quotes, studies or competitor data. Unchecked items say "Not assessed".

## 1. Discovery and mode

Ask for what is missing:
- Site, audience, offer, and what this page should make the reader do.
- Target query (or seed topic), market and language.
- Existing URL, if any; Search Console queries and pages for it.
- Real expertise available: authors, practitioners, first-party data, customer cases.

Pick a mode:
- Improve: an existing page. Keep what works (sections that earn clicks, existing links),
  add what is missing, fix intent mismatch. Avoid full rewrites unless intent is wrong.
- New page: full brief and outline.
- Outline only: headings, section goals and word ranges, no prose.
- Cluster: a topic area, not one page (section 8).

Read the homepage, main navigation and sitemap to learn what the site covers and which pages
already exist. Relevance rule: only propose topics the site can credibly cover.

## 2. Intent and SERP

1. Classify intent: informational, commercial investigation, transactional, navigational. Mixed
   SERPs exist; name the dominant one.
2. Note the format the SERP rewards: guide, list, comparison, tool, product/category page,
   video, local pack. If the results are tools or category pages, an article will not win.
3. Note SERP features present (featured snippet, People Also Ask, video, images, AI overview)
   and which could be targeted.
4. Take the top 5 organic competitors. Skip non-comparable results: encyclopedias, forums and
   social sites, marketplaces, video platforms, government pages, job boards, directories and
   aggregators. Note them as "SERP noise" if they dominate.
5. For each competitor note: angle, heading structure, approximate length, media, data used,
   freshness, author signals. Score Depth, Formatting, SEO and UX 1-10 each, labeled as your
   judgment.

## 3. Gaps and information gain

Find three gap types:
- Topic gaps: subtopics or questions competitors skip (from People Also Ask, related searches,
  forums, support tickets, sales calls).
- Depth gaps: covered, but shallow, outdated or without examples.
- Quality gaps: no original data, no expert, no visuals, poor structure, stale dates.

Prioritize gaps by Impact × Advantage (can this site do it better) / Effort.

Information gain is mandatory: state specifically what this page adds that the top results do
not (original data, a tested method, a worked example, an expert's judgment, a tool, a decision
framework). "More comprehensive" is not an answer.

## 4. Brief and outline

Brief template:
```
Target query | Intent | SERP format rewarded | Market
Competitor table: URL | Angle | Depth | Formatting | SEO | UX | Notes
Gaps: topic / depth / quality, prioritized
Information gain: <specific>
Title (50-60 chars) | Meta description (130-150 chars) | Slug | H1
Target length: range from competitors, labeled heuristic
Outline: H2/H3 with section goal, key points, word range, format (list, table, steps)
Featured-snippet targets: question + 40-60 word answer slot, list or table
Keywords: primary; 5-8 secondary; 10-15 related terms and entities
E-E-A-T: author, evidence, sources to cite, experience to show
Internal links: 3-5 in (from) and out (to), with hub/spoke role and anchor
Schema: types matching the page
CTA
```

Outline rules:
- One H1. H2s are the reader's questions or steps in order; H3s nest under them; no skipped levels.
- Answer first: the opening paragraph answers the query; context follows.
- Hub pages cover every real category on the site and invent none.
- Long pieces (roughly 2,000+ words) get a jump-link table of contents.

## 5. On-page rules

- Primary keyword: in the title (near the front), H1, slug, meta description and first 100
  words. Not required in every H2. No density target; write naturally and spread related terms.
- Title: 50-60 characters, keyword first, brand last, specific promise; unique sitewide.
- Meta description: 130-150 characters, active voice, states the benefit, ends with a reason
  to click. It earns clicks, not rankings.
- Slug: short, lowercase, hyphenated, no dates unless the content is dated.
- Length: coverage floors, not ranking factors. Rough floors: homepage 500, service page 800,
  blog post 1,500, product page 300+, location page 500-600 words. Match what the intent
  needs; cut filler.
- Readability (a proxy, not a ranking factor): mostly 15-20 word sentences, 2-4 sentence
  paragraphs, descriptive subheads, lists and tables for scannable content.
- Internal links: roughly 3-5 per 1,000 words, descriptive anchors in body copy, to and from
  related pages; no orphan pages.
- External links: cite primary, authoritative sources for every statistic and claim.
- Images: descriptive file names, alt text that describes the image, compressed, sized.
- Structured data: Article/BlogPosting, Product, LocalBusiness etc. matching the page
  (`atrium:schema-markup`).

## 6. E-E-A-T and quality

Apply Google's Who/How/Why test: who wrote it (visible byline and bio), how it was made
(method, testing, sources, any AI assistance disclosed where readers would expect it), why it
exists (to help a reader, not to rank).

- Experience: first-hand use, photos, screenshots, results, specific details only a doer knows.
- Expertise: author credentials relevant to the topic; reviewer for health, finance, legal
  and safety topics.
- Authoritativeness: cited by others, consistent entity (`atrium:link-building`,
  `atrium:ai-visibility`).
- Trust (matters most): accurate, sourced, dated, contact and about pages, clear ownership,
  corrections. Google publishes no numeric weights for these.

AI-assisted content is judged on quality, not authorship. Flag low-quality markers: generic
phrasing, no original insight, repetitive section structure, no named author, unverified
facts, filler intros. Helpful-content signals are part of core ranking (since March 2024), so
weak pages can drag the site. For phrasing cleanup hand off to `forge:humanizer`; for
line-level edits `atrium:copy-editing`. Never claim to detect or remove watermarks, and never
strip provenance from content the user does not own.

## 7. AI citation readiness

Google's guidance: no special files or markup are needed for AI features; good SEO is the
basis. Make passages easy to lift and attribute:
- Answer-first paragraphs under question-style headings; self-contained 40-80 word answers.
- Quotable facts with a named source and date; first-party data with method.
- Tables for comparisons, numbered steps for processes, definitions stated plainly.
- Clear entities: consistent brand and author names, Organization and Person schema.
- Topical depth through clusters, so the site is the obvious source on the topic.
Measurement and prompt tracking: `atrium:ai-visibility`.

## 8. Topic clusters and keyword mapping

1. Expand the seed to 30-50 variants: related searches, People Also Ask, modifiers (best,
   vs, for <audience>, cost, how to), questions. Exclude navigational queries for other brands.
   Expansion depth: `atrium:keyword-research`.
2. Pre-group by intent, then compare top-10 results between pairs. Shared URLs (heuristic):
   7-10 = same page; 4-6 = same cluster; 2-3 = related, interlink; 0-1 = separate. SERP overlap
   beats lexical similarity. Under 10 terms, map by hand.
3. Structure: one pillar, 2-5 clusters, 2-4 spokes each. Assign a page type per intent (guide,
   comparison, how-to, landing page). Typical lengths, as heuristics only: pillar 2,500-4,000
   words, spokes 1,200-1,800.
4. Map each cluster to an existing URL, a new page (label "proposed"), or "do not target / later".
5. Cannibalization: two or more URLs ranking for or targeting the same query group. Confirm
   with Search Console query+page data, not guesses. Fix by merging (301), differentiating
   intent, or canonicalizing; pick the stronger URL as the keeper.
6. Link matrix: every spoke links to its pillar and the pillar to every spoke (mandatory);
   2-3 links between spokes in a cluster; 0-1 across clusters; each page gets at least 3
   internal links in; every page within 2 clicks of the pillar; descriptive anchors in body
   copy. Calendar and sequencing: `atrium:content-strategy`.

## 9. Refresh and decay

- Find decay: pages losing clicks or positions over 3-6 months (Search Console, compare
  periods), pages ranking 5-20 for valuable queries, and content older than about 12 months on
  fast-moving topics.
- Diagnose before editing: intent shift in the SERP, newer competitors, outdated facts, lost
  links, cannibalization, technical issue (`atrium:seo-audit`).
- Refresh: update facts and examples, add missing sections and new questions, improve the
  answer-first intro, add internal links from newer pages, update dateModified only for real
  changes, keep the URL.
- Show published and updated dates. A traffic change near an algorithm update is a hypothesis,
  not proof; check other causes first.

## Errors

- URL unreachable or blocked: say so; ask for the HTML or text.
- Paywalled or login-gated: analyze only what is visible and note the limit.
- Page looks empty or thin when fetched: it may be JavaScript-rendered; check the rendered
  view before calling it thin.

## Output

Match the request; no tool or framework names in the deliverable:
- Brief: the template in section 4, filled.
- Optimization: prioritized change list (critical, high, medium) with the exact rewrite for
  title, meta, intro and headings, and sections to add or cut.
- Audit: findings with evidence per section 5-7 area; unchecked areas "Not assessed".
- Cluster: map summary, cluster table (cluster, keywords, intent, target URL or "proposed",
  page type), per-page mini briefs, cannibalization list, link matrix, next steps. Spreadsheet
  via `atrium:xlsx`.
Drafting the copy itself: `atrium:copywriting`.

## Review checklist

- [ ] Intent and rewarded format match the planned page.
- [ ] Information gain stated specifically.
- [ ] Title, meta, H1, slug and first 100 words set; no stuffing.
- [ ] Every statistic and claim sourced; no invented data or quotes.
- [ ] Author, experience and trust signals present.
- [ ] Answer-first passages, tables or steps where they help.
- [ ] Internal links in and out with descriptive anchors; no orphans or cannibalization.
- [ ] Numbers labeled with source and date; heuristics labeled as heuristics.
