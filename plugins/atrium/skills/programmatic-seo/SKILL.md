---
disable-model-invocation: true  # skl: on-demand pack skill
name: programmatic-seo
description: >
  Plans, builds and audits SEO pages generated at scale from templates and data: validates the
  keyword pattern and demand, picks a playbook, specifies data, template, URLs, internal links
  and indexation, and enforces quality gates against thin or scaled-content abuse. Use when the
  user mentions programmatic SEO, pSEO, pages at scale, template or data-driven pages, location
  pages, "[service] in [city]", comparison/alternatives, integration, glossary or directory page
  sets, or auditing an existing generated page set.
---

# Programmatic SEO

Build page sets where every page would be worth publishing even if no sibling page existed. If
the data cannot make each page distinct and useful, build fewer pages, not thinner ones.

## Data

If OpenSEO MCP tools are connected, use them for keyword/SERP/backlink data; otherwise use web
search, Search Console/GA exports or other data the user provides. Label every volume, difficulty
and ranking with its source and date; mark modeled numbers as estimates. Never invent search
volumes, page counts or competitor rankings.

## 1. Discovery

Get answers before designing anything:
- Product, audience, conversion goal for these pages (signup, lead, download, booking).
- Candidate keyword pattern(s) and the variables in them.
- Data the user has or can get: what it is, where it lives, row count, update cadence, license.
- Site: domain strength (referring domains, existing rankings), CMS/stack, current page count.
- Who ranks for sample queries now and what those pages contain (see `atrium:seo-competitors`).
- Existing pages that already target these queries (cannibalization risk).
- Capacity: who reviews pages, who maintains data.

## 2. Validate the pattern

1. Write the pattern with variables: `<tool> vs <competitor>`, `<service> in <city>`.
2. List variable values and count combinations.
3. Sample 10-20 real combinations across head, mid and tail. Check demand per sample (source-
   labeled) and the aggregate. Many combinations will have zero demand; drop them.
4. Check SERP intent for samples: if results are tools, maps or forums and the plan is an article
   template, the template is wrong.
5. Assess winnability: if the top results are strong brands with unique data and the site has
   neither, say so.
Keyword expansion and grouping: `atrium:keyword-research`.

## 3. Choose the playbook

| Playbook | Pattern | Needs per page |
|---|---|---|
| Templates | "<type> template" | A usable template, variations, easy download |
| Curation | "best <category>" | Real evaluation criteria, testing or expertise, visible update date |
| Conversions | "<x> to <y>" | A working, accurate tool; related conversions |
| Comparisons | "<x> vs <y>", "<x> alternatives" | Honest feature data, recommendation by use case, kept current |
| Examples | "<type> examples" | Real examples, screenshots, analysis of why they work |
| Locations | "<service> in <place>" | Real local data: providers, prices, rules, map; not a swapped city name |
| Personas | "<product> for <audience>" | Segment-specific use cases, features, proof from that segment |
| Integrations | "<product> <other> integration" | A working integration, setup steps, use cases |
| Glossary | "what is <term>" | Accurate definition, examples, related terms linked |
| Translations | same content, other language | Real localization, native review, hreflang |
| Directory | "<category> tools" | Coverage, filters, details per listing, regular updates |
| Profiles | "<entity>" | Sourced facts, unique aggregation, updates |

Match to assets: proprietary data → directory, profiles, curation; integrations → integrations;
creative product → templates, examples; segmented audience → personas; local presence →
locations (also `atrium:local-seo`); utility → conversions; expertise → glossary; crowded market
→ comparisons. Layering is fine ("best coworking spaces in <city>") if each layer adds data.

## 4. Data requirements

Data defensibility, strongest first: proprietary, product-derived, user-generated, licensed,
public. Public or scraped data alone produces pages anyone can copy; call that risk out.

Check the dataset before templating:
- Each record has enough distinct attributes to fill the dynamic sections (list the fields).
- Missing values per field; records below the minimum get merged or excluded.
- Near-duplicate records (most fields identical): merge into one page.
- Freshness: source, update method (import, API, sync), and who owns it. Stale data makes wrong pages.
- Rights: license or terms allow republishing; scraping respects site terms and robots.

## 5. Template design

Per template, specify:
- Title, H1 and meta description patterns, with at least 2-3 variants selected by data so the
  set does not share one shape.
- Static blocks (shared) versus dynamic blocks (per record). Dynamic blocks carry real data:
  numbers, lists, comparisons, local facts, computed insights.
- Conditional sections: show, hide or rewrite blocks based on field values; never print empty
  or placeholder text.
- A unique intro or summary computed from the record (e.g. what is notable about this one versus
  the set average), not a sentence with the variable swapped.
- Supplementary value: related items, tips, FAQs drawn from real questions, user content.
- CTA matched to intent.
- Schema: types that match the visible content (`atrium:schema-markup`), plus BreadcrumbList.
- Content is in the server-rendered or prebuilt HTML, not only client-side JavaScript.

AI-written sections are allowed only when grounded in the record's data and sampled by a human;
unreviewed generated text at scale is the definition of scaled content abuse.

## 6. URL patterns

- Subfolder on the main domain (`/integrations/<slug>/`) by default; a subdomain needs its own
  internal links and sitemap. Both can rank; choose on effort and linking.
- Lowercase, hyphenated slugs from data; uniqueness enforced at generation; under ~100 chars.
- No query parameters for primary content; trailing-slash style consistent with the site.
- Hierarchy mirrors the hub structure: `/<hub>/<item>/` or `/<hub>/<parent>/<item>/`.

## 7. Internal linking

- Hub pages per category list and summarize their spokes; hubs link from main navigation or
  relevant existing pages.
- Each spoke links to its hub, 3-5 related spokes by shared attributes (same category, nearby
  place), and relevant editorial pages.
- Descriptive, varied anchors; no repeated exact-match anchors.
- Breadcrumbs on every page. No orphans: every page reachable by links, not only via sitemap.

## 8. Indexation

- Self-referencing canonical on each page. Where a programmatic page overlaps a hand-written
  page, the hand-written page is canonical (or merge them).
- Sort/filter parameter variants canonical to the base when duplicate or low value.
- `noindex` pages that fail the quality gates, and drop them from sitemaps; better still,
  consolidate thin records into aggregate pages.
- Sitemaps split by page type; each file up to 50,000 URLs or 50 MB uncompressed; use a sitemap
  index; `<lastmod>` is the data's real update time; reference the index in robots.txt.
- Large sets (roughly 10k+ pages): watch crawl stats and indexed versus submitted counts monthly.

## 9. Quality gates (before any batch goes live)

| Check | Gate |
|---|---|
| Standalone value | Each sampled page answers "worth publishing if it were the only one?" with yes |
| Uniqueness | Body copy unique to the page roughly 40%+ versus siblings (heuristic; under ~30% is a stop). Count template boilerplate; exclude nav/footer |
| Metadata | Titles and descriptions vary in structure, not only the swapped variable |
| Thin pages | Pages under ~300 words of substance or with mostly empty dynamic blocks are reviewed, merged or noindexed |
| Human review | 5-10% random sample read in full, plus every page in the top demand tier |
| Data accuracy | Spot-check facts against the source on the sample |
| Intent | Sample pages match what the SERP shows for their query |
| Technical | Unique titles, one H1, valid schema, fast enough, server-rendered, canonical correct |

Measure uniqueness by comparing body text across the set (shingle or word-set overlap in a small
script); label results as heuristics. Large unreviewed batches (hundreds of pages) need explicit
user sign-off after a quality audit.

Avoid at scale: city-name swaps in identical text; "best X for <industry>" with no industry
data; "<competitor> alternative" without real comparison data; pages that exist only for the
search engine (doorways); hosting third-party content on a strong domain to rank (site
reputation abuse).

## 10. Platform

The platform must hold the item count you expect in a year, refresh data without full manual
rebuilds, render HTML server-side or at build time, branch on data in templates, query related
items for links, and control noindex/canonical per page and split sitemaps. Prefer the existing
CMS if it qualifies; otherwise a static/hybrid framework reading from a data file or database,
or a headless CMS. Confirm current item limits on the vendor's plan page.

## 11. Rollout and monitoring

1. Pilot: publish the 20-50 strongest pages (highest demand, richest data).
2. Wait 2-4 weeks. Check indexation rate, impressions, rankings, engagement, conversions.
3. Fix the template from pilot evidence, then release in batches of 50-100.
4. Monthly: indexed versus intended count, pages with zero impressions after 90 days (improve,
   merge or noindex), data freshness, cannibalization with editorial pages, manual actions and
   crawl errors in Search Console.
Analytics setup: `atrium:marketing-analytics`. Post-launch audits: `atrium:seo-audit`.

## Auditing an existing set

Sample pages across tiers and score each area pass / needs work / fail with evidence: data
quality, template uniqueness, metadata variety, URL structure, internal linking, thin-content
risk, index management (indexed vs submitted, noindex and canonical use). Unchecked areas say
"Not assessed". Prioritize: critical (penalty or deindexing risk), high, medium, backlog.

## Deliverables

Keep it to what the user needs, usually:
1. Opportunity sheet: pattern, sample keywords with sourced demand, combination count, data
   source, playbook, difficulty notes (`atrium:xlsx` if a spreadsheet).
2. Page template spec: URL pattern, title/meta variants, block list (static/dynamic/conditional
   with field mappings), schema, internal-link rules, indexation rules.
3. Pre-launch checklist (section 9) and monitoring plan (section 11).

## Review checklist

- [ ] Demand validated on real samples; numbers sourced and dated.
- [ ] Each record has enough data for a distinct, useful page; thin records merged or excluded.
- [ ] Template has conditional logic and varied metadata, not mad-libs.
- [ ] Hubs, related links and breadcrumbs: no orphans.
- [ ] Canonical, noindex and sitemap rules defined.
- [ ] Pilot batch and human sample review planned before scaling.
