---
disable-model-invocation: true  # skl: on-demand pack skill
name: link-building
description: >
  Plans and runs white-hat link acquisition: finds where links are the real ranking gap, builds
  linkable assets, finds and qualifies prospects, drafts compliant outreach for approval, audits
  an existing backlink profile and tracks results. Use when the user asks for backlinks, link
  building, digital PR, link prospecting, unlinked mentions, broken-link outreach, guest posts,
  a backlink audit or toxic-link review, disavow questions, or why competitors outrank them on
  authority.
---

# Link building

Earn links that a page would deserve even if search engines did not exist. Every tactic here
passes that test; anything that fails it is out of scope regardless of what the user asks.

## Data

If OpenSEO MCP tools are connected, use them for keyword/SERP/backlink data; otherwise use web
search, Search Console/GA exports or other data the user provides (Search Console "Links" report,
exports from any backlink tool they already use). Label every number with its source and date.
Never invent domains, metrics, contacts or link counts. If a factor was not measured, write
"Not assessed", never a guessed score.

## 1. Gather context

Ask for what is missing before planning:
- Business, audience, and the 3-10 target pages that need to rank (URL, query, current position).
- Assets: original data, tools, templates, research, partners, integrations, founders/experts
  available for quotes, existing press.
- Resources: hours per week, budget, who sends outreach, from which domain/mailbox.
- History: past link campaigns, paid placements, manual actions, guest-post networks used.
- Competitors that outrank them (or hand off to `atrium:seo-competitors`).

## 2. Confirm links are the bottleneck

Diagnose per target page before acquiring anything:

| Gap | Signal | Fix first |
|---|---|---|
| Content/intent | Ranking pages answer a different intent or go deeper | `atrium:seo-content` |
| Technical/indexing | Page not indexed, slow, canonical issues | `atrium:seo-audit` |
| Internal links | Few internal links from strong pages, orphaned page | Add contextual internal links |
| Foundation | Brand has almost no referring domains anywhere | Directories, partners, profiles |
| Authority | Content matches or beats competitors, they have many more relevant referring domains | Link building (this skill) |
| Low competition | Weak SERP, page should rank already | Re-check content and internal links |

Only the authority and foundation gaps justify outreach. Say so when links are not the problem.

## 3. Linkable assets

A link needs a reason. Build or identify one per campaign:
- Original data: surveys, benchmarks, anonymized product data, annual reports. Publish method.
- Free tools and calculators that solve one job.
- Templates, checklists, glossaries, definitive reference pages.
- Integration, partner, customer and case-study pages (natural reciprocal context).
- Expert commentary from real people with real credentials.

Assets pointing at money pages: link internally from the asset to the commercial target page.

## 4. Tactics, highest yield first

| Tactic | Effort | How |
|---|---|---|
| Unlinked brand mentions | Low | Search brand/product/founder names; ask to add a link to the existing mention |
| Partners, integrations, customers, suppliers | Low | Ask for listing on their partner/integration/customer pages |
| Reclaim lost links | Low | Find 404s and moved pages that have links; 301 to the best equivalent |
| "Best X" / comparison lists | Med | Ask authors to evaluate the product; offer access, not payment |
| Resource pages | Med | Pages that curate links on the topic; pitch the matching asset |
| Broken-link replacement | Med | Dead link on a relevant page; offer the equivalent live resource |
| Expert contributions / journalist requests | Med | Answer real queries with real expertise; quotes earn citations |
| Podcasts, webinars, events | Med | Guest appearances; show notes link back |
| Digital PR on data assets | High | Pitch a newsworthy finding to relevant reporters |
| Directories and review platforms | Low | Only curated, niche-relevant, human-reviewed ones |
| Communities | Low | Participate genuinely; links there are nofollow/ugc and that is fine |
| Local (if relevant) | Low | Chambers, associations, sponsors, local press: see `atrium:local-seo` |

Pick 2-3 tactics matched to assets and resources. Do not run all of them.

## 5. Find prospects

Search query patterns (replace placeholders):
- `<topic> resources`, `<topic> useful links`, `intitle:resources <topic>`
- `best <category> tools`, `<competitor> alternatives`, `<category> software for <audience>`
- `<topic> statistics`, `<topic> guide`, `<topic> examples`, `<topic> templates`
- `"<brand>" -site:<own-domain>` for unlinked mentions
- Competitor gap: domains linking to 2+ competitors but not to the user (from backlink data).

AI-visibility angle: prefer pages that AI answer engines already cite for target prompts; those
links also feed citations (see `atrium:ai-visibility`).

## 6. Qualify every prospect

Keep a prospect only if all hold:
1. Relevant: same topic or audience as the target page.
2. Legitimate: real editorial site, real traffic signals, not a link seller or content farm.
3. Valuable: a link here helps the specific target page (and readers would click it).
4. Reachable: a named person or published contact route exists.
5. Clean: no "write for us + price list", no sitewide footer links, no outbound-link spam.

Authority metrics (DR/DA/AS) sort the list; they never qualify a site on their own. Flag
competitors and anything that looks like a paid placement.

Contacts: take them only from the byline, author page, contact/about/masthead page or public
professional profile, and record the source URL. Never guess email formats or invent names.

## 7. Outreach

Draft only; the user approves and sends. Hand off sequencing to `atrium:cold-outreach`.
- Under 100 words, personal, one specific ask, value to their readers stated plainly.
- Reference the exact page and spot; make adding the link easy (URL + suggested sentence).
- One follow-up at most, 5-7 days later. Stop on any no or no reply.
- Never offer payment, gifts or link swaps in exchange for a followed link.
- Compliance: real sender identity, physical address and opt-out where CAN-SPAM applies;
  legitimate-interest basis and easy objection for EU/UK contacts (GDPR/PECR); honor removals.

Templates for unlinked mention, broken link, list inclusion and resource page:
`references/outreach-templates.md`.

## 8. White-hat policy (non-negotiable)

Google treats links made "primarily to manipulate rankings" as spam. Refuse and explain:
- PBNs, link farms, automated/programmatic links, link exchanges at scale.
- Buying or selling followed links, "niche edits" into existing posts, paid guest posts.
- Keyword-rich exact-match anchors in guest posts or widgets.
- Site reputation abuse (third-party pages hosted on a strong domain to rank).

Allowed paid exposure: sponsorships, ads, paid reviews and advertorials, only with
`rel="sponsored"` (or `nofollow`) and visible disclosure. User-generated links use `rel="ugc"`.

Vendor vetting if they hire an agency: ask for sample placements, check that sites are real
editorial sites, that links are disclosed when paid, that no "guaranteed DR" packages are sold,
and that no private network is used. Walk away on any fail.

Anchors: let publishers choose. Expect mostly branded, URL and generic anchors. Never plan a
"link velocity".

## 9. Backlink profile audit

Run when asked for an audit, after a ranking drop, or before outreach on an older domain.
1. Overview: referring domains, total links, follow/nofollow split, trend (source + date).
2. Anchor distribution versus rough healthy ranges (heuristics, not rules): branded 30-50%,
   URL 15-25%, generic 10-20%, partial-match 5-15%, exact-match 3-10%. Flag exact-match above
   ~15% on commercial terms.
3. Referring-domain quality: topical relevance, real traffic, geography/language fit.
4. Toxic signals: obvious PBN footprints, link farms, sitewide footer/sidebar paid links,
   hacked-page links, foreign-language spam, near-100% exact-match from one source.
5. Top linked pages, including 404s with links (redirect them).
6. Competitor gap: domains linking to competitors and not the user (feeds step 5).
7. New and lost links in the period.

If fewer than 4 of 7 sections have data, label the audit "Insufficient data" and list what is
needed. Disavow only for a manual action or clear evidence of a paid/PBN scheme the user built;
random spam links are normally ignored by Google. For a manual action: remove what can be removed,
disavow the rest at domain level, document every step, then file reconsideration.

## 10. Measure and track

Tracker columns (CSV or sheet via `atrium:xlsx`): prospect page, domain, tactic, target page,
AI-cited (y/n), contact + source URL, status (found, qualified, drafted, sent, followed up,
won, lost), dates, live link URL, rel attribute, notes.

Report monthly: new relevant referring domains to target pages, target-query rankings, AI
mentions/citations, referral traffic, outreach funnel (sent, reply rate, won). Link-building
takes months; judge tactics on reply and win rates first, rankings later.

## Review checklist

- [ ] Links confirmed as the bottleneck for each target page.
- [ ] Every prospect qualified on all five checks; contacts sourced.
- [ ] No tactic in the refused list; paid exposure marked sponsored.
- [ ] Outreach drafts short, single-ask, compliant, awaiting user approval.
- [ ] Every metric labeled with source and date; unmeasured items say "Not assessed".
