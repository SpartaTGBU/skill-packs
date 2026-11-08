---
disable-model-invocation: true  # skl: on-demand pack skill
name: local-seo
description: >
  Audit and improve local search visibility: Google Business Profile, map pack factors, NAP
  consistency and citations, policy-compliant reviews, local landing pages, service-area and
  multi-location setups, with a prioritized fix list. Use when a business depends on customers
  near a location or service area, when the user asks about Google Maps, the local pack, "near
  me" rankings, GBP, citations, reviews, location pages, or why a competitor outranks them locally.
---

# Local SEO

Work out why a business does or does not show up in the map pack and local organic results near
its customers, and what to fix first. Applies to storefronts, service-area businesses (SABs) and
hybrids, single or multi-location. For national organic work use atrium:seo-audit and
atrium:keyword-research; for AI assistant answers use atrium:ai-visibility.

## 1. Gather context first

Ask for what's missing; confirm inferences in one question rather than a long interview.

- **Business type**: storefront (customers visit; street address shown), SAB (goes to customers;
  address hidden, "serving X"), or hybrid. Detect from the site: visible address and map embed vs
  service-area language only.
- **Vertical**: restaurant, healthcare, legal, home services, real estate, automotive, retail,
  other. Verticals change categories, citation sites and review rules (section 5).
- **Locations**: every address or service area, and whether each has its own GBP and page.
- **Keywords**: 1–3 terms customers actually search ("emergency plumber", "dentist open
  saturday"), not the brand name. See atrium:keyword-research for expansion.
- **Competitors**: who appears in the local pack for those terms near the business.
- **Current assets**: GBP claimed and verified? Location/service pages? Known directory listings?
  Review platforms in use? Any past name, address or phone changes?
- **Data available**: If OpenSEO MCP tools are connected, use them for keyword/SERP/backlink data;
  otherwise use web search, Search Console/GA exports or other data the user provides. Rank
  trackers (if you use BrightLocal, Local Falcon, Whitespark or similar) are optional inputs.

Never invent rankings, review counts, ratings or citation counts. If you could not observe a
value, write "not checked" and say how the user can get it. Label estimates as estimates.

## 2. Map pack factors and fix order

Local results weigh three things:

- **Relevance**: does the profile and site match the query? Primary category, services, site
  content.
- **Distance**: searcher to business. Fixed for storefronts; explains most drop-offs at the edge
  of a service area. Don't promise to "fix" distance.
- **Prominence**: reviews (volume, recency, rating, replies), citations, links, local mentions,
  overall site strength.

Fix in this order; earlier items beat later ones every time:

1. Profile exists, is claimed, verified, not suspended, no duplicates.
2. Primary category correct and as specific as possible (a wrong primary category is the most
   common high-impact error).
3. Name is the real-world business name (no keyword stuffing); address/area and phone accurate.
4. Profile completeness: secondary categories, hours, services, photos, website link.
5. Reviews: steady fresh reviews and owner replies.
6. Site: a strong, consistent location page the profile links to; NAP and schema match.
7. Citations and local links.
8. Posts, photo cadence and other engagement extras, only once 1–7 are competitive.

## 3. Google Business Profile

Score each item 2 = present and optimized, 1 = present but weak, 0 = missing or wrong.

- **Categories**: most specific accurate primary; secondary categories for real service lines
  only; none copied from competitors that don't apply.
- **Name**: matches signage and legal/trading name. Keyword-stuffed names violate guidelines and
  risk suspension; flag competitors doing it only as a possible spam report, never as a tactic.
- **Address / service area**: storefronts show the exact address (with suite); SABs hide the
  address and list real areas served.
- **Phone**: a local number that matches the site and directories; call-tracking numbers as the
  primary only if the main number is kept as an additional phone.
- **Website link**: deep-links to that location's page, not the homepage or a stale domain. UTM
  tags are fine for attribution (see atrium:marketing-analytics).
- **Hours**: regular, holiday and special hours current; attributes and accessibility filled.
- **Services/products**: each listed with a plain description; prices or ranges where honest.
- **Description**: what the business does, for whom, where; no URLs, no "best/#1" claims, not a
  copy of the meta description.
- **Photos**: logo, cover, exterior (helps people find the door), interior, team, real work.
  Real, current photos; add new ones over time.
- **Posts**: offers, events, updates with a clear action. A maintenance habit, not a ranking fix.
- **Q&A / FAQs**: Google has been reducing profile Q&A; put common questions and answers on the
  location page so they exist regardless.
- **Messaging/booking**: enabled only if someone actually responds.

## 4. NAP and citations

NAP = name, address, phone. Compare four sources first: the website (visible text), the site's
LocalBusiness schema, the GBP, and the top directories.

- Severity: name mismatch Critical, address High, phone Medium, minor formatting Low.
- Common errors: legal suffix on some listings (LLC), old business names, "St" vs "Street"
  variants plus a missing suite, old phone numbers live on legacy directories, duplicate listings
  from a past move.
- Core listings: Google, Bing Places, Apple Business Connect, Facebook, Yelp, BBB. Bing and Yelp
  matter beyond their own traffic because other search and AI assistants draw on them.
- Data aggregators and map data providers (e.g. Data Axle, Foursquare) feed many smaller sites;
  fix there to reduce whack-a-mole.
- Vertical directories: healthcare (Healthgrades, Zocdoc), legal (Avvo, Justia), home services
  (Angi, HomeAdvisor, Thumbtack, Nextdoor), restaurants (TripAdvisor, OpenTable), real estate
  and automotive portals. Pick what the user's customers actually use.
- After any change, verify the live listing shows the corrected data; submissions are not fixes.

Deliver a table: source, name, address, phone, URL, status (match / mismatch / missing /
duplicate), action. Only list sources you actually checked.

## 5. Reviews

**Compliance first (non-negotiable):**
- Ask every customer, or a consistent unbiased sample. Never gate (screen for happy customers
  before asking, or route unhappy ones away from the review site). Gating breaks Google's policy
  and US FTC rules on fake reviews and review suppression.
- No incentives for reviews (discounts, entries, gifts), no employee or family reviews, no buying
  reviews, no review swaps, no writing reviews on someone's behalf.
- Never suppress or pressure removal of honest negative reviews. Report only reviews that
  actually violate platform policy.
- Do not mark up your own first-party reviews to get stars for a LocalBusiness (self-serving
  review markup is ineligible); see atrium:schema-markup.
- Regulated verticals: healthcare replies must not confirm someone is a patient or discuss care
  (HIPAA in the US); legal replies must not reveal client information. Respond generically and
  move the conversation offline. Check local consumer law outside the US.

**Acquisition**: ask at the moment of value (job done, visit ended), with a direct review link,
by the channel the customer already uses. Build a repeatable process so reviews arrive steadily;
recency and velocity matter more than a one-off burst.

**Analysis** (only from data you have): count and average vs top competitors, reviews per month
over the last 6 months, gaps longer than a month, rating distribution, reply rate and speed,
recurring themes (praise and complaints) to feed operations and copy. Cover the other platforms
customers use, not only Google.

**Replies**: reply to all, reasonably fast. Positive: thank, mention the specific service, keep
it short and human. Negative: acknowledge, don't argue or disclose details, offer a named contact
offline, follow up. For support-heavy cases see atrium:customer-support; for wording,
atrium:copywriting and forge:humanizer.

**Suspicious reviews** (yours or a competitor's): flag only when two or more signals coincide:
bursts at uniform timing, reviewer accounts with no history, reviewers far from the service area,
a sudden 5-star spike with no matching marketing, near-identical text. Present as signals, not
proof; the remedy is a platform report, not public accusation.

## 6. Local landing pages

One page per location (storefronts) or per real service area (SABs), plus one page per core
service. The GBP links to its location page.

- **Title and H1**: service + place, e.g. "Water Heater Repair in Northside, Springfield".
- **NAP** in crawlable HTML matching the GBP; click-to-call `tel:` link; hours; map embed or
  directions for storefronts.
- **Unique local substance**: the swap test: if you can replace the city name and the page still
  reads true, it's a doorway page. Use real local details: neighborhoods and landmarks served,
  local projects or case notes, staff at that location, photos taken there, local testimonials
  (with permission), parking/access, local regulations or seasonal issues.
- **FAQ** with real customer questions (also covers reduced GBP Q&A).
- **Internal links**: hub (locations index or service page) to spokes and back; link nearby areas
  only where it helps the reader.
- **Schema**: LocalBusiness with the most specific subtype, matching NAP, `geo`,
  `openingHoursSpecification`, `url`, and `areaServed` for SABs. Schema supports understanding;
  it isn't a ranking lever on its own. Details in atrium:schema-markup.
- **Basics**: mobile-friendly, fast, indexable, self-canonical. Technical sweep: atrium:seo-audit.

Writing the page: atrium:seo-content. Generating many pages from data: atrium:programmatic-seo,
and apply the swap test to every page, not just the template.

## 7. Service-area businesses

- Hide the street address on the GBP if customers aren't served there; list real areas served
  (cities or postcodes), not an inflated radius.
- Site and schema: no street address presented as a storefront; use `areaServed`. Show a city or
  region and a phone.
- Rank strongest near the verification address; expect weaker map visibility at the edges. Win
  the outer areas mainly with service-area pages, organic content and reviews from those areas.
- Never create fake addresses, virtual offices or PO boxes to get a pin in another town. It
  violates guidelines and gets profiles suspended.
- Hybrid: show the address and also list served areas.

## 8. Multi-location

- Build a snapshot table for every location first: category, rating, review count, claimed
  status, website link target, NAP status. Deep-dive all if 5 or fewer; otherwise recommend 1–3
  (e.g. the weakest profile in the most competitive market) and ask the user to choose.
- One GBP per real, staffed location; manage centrally with consistent naming (brand + optional
  location descriptor only where real-world signage uses it).
- Site: crawlable `/locations/` index linking to each `/locations/<city>/` page; each page
  unique per section 6; each LocalBusiness with its own `@id`, tied to the parent Organization
  (e.g. `parentOrganization` / `branchOf`).
- Per-location phone numbers and hours; one review process applied the same everywhere.
- Watch for duplicate and orphaned listings after openings, closures and moves; mark closed
  locations closed rather than deleting history.

## 9. Measuring visibility

- Check rankings from the customer's location, not the office: the local pack changes over a
  few kilometres. A rank grid (3x3 by default; wider only for large service areas) separates
  "ranks at the storefront only" from "ranks across the service area", and shows who wins where.
- If you use a paid grid or SERP tool, state the cost before running and confirm the grid center
  matches the storefront; a mis-centered grid is worse than none.
- Read a missing rank against how many results that point returned: a full result set means
  outranked; a sparse one means a thin SERP, not proof of invisibility.
- Match businesses by place ID or listing ID where available; names collide in chains.
- Don't infer local-pack strength from national organic metrics or domain authority.
- Track over time: GBP calls, direction requests, website clicks (from the profile's own
  insights), plus Search Console for location pages. Competitor deep-dives: atrium:seo-competitors.
- Local links (chamber, sponsorships, local press, "best of" lists, suppliers, associations):
  atrium:link-building.

## 10. Deliverable and review checklist

Deliver, in this order, and only what the request needs:

1. **Snapshot**: business type, locations, keywords checked, data sources used.
2. **The one fix**: the single highest-impact finding (section 2 order).
3. **Head to head**: table of signal / this business / best competitor / gap.
4. **Findings by area**: GBP, NAP/citations, reviews, pages, schema, links. Evidence for each.
5. **Prioritized actions**: up to 10, each with owner, effort (low/med/high) and expected impact
   stated as a judgment, not a number.
6. **Limits**: what wasn't checked and how to check it.

Before sending, check:
- [ ] Every ranking, count and rating came from an observed source, or is marked unknown/estimate.
- [ ] No gating, incentives, fake reviews, keyword-stuffed names or fake addresses recommended.
- [ ] Regulated-vertical reply rules applied where relevant.
- [ ] Category and claim issues ranked above posting cadence.
- [ ] Location pages pass the swap test; NAP matches across site, schema and GBP.
- [ ] Recommendations fit the business type (storefront vs SAB vs multi-location).

**Never cut:** policy compliance on reviews and listings, evidence for every figure, the limits
section.

## Reply

End with one or two lines: what you could not verify (and how the user can), and any risk of
suspension or policy breach found in the current setup.

## Levels

| Level | Behaviour |
|-------|-----------|
| **quick** | GBP and NAP check for one location, the one fix, top 5 actions. |
| **full** | All sections for the business. Default. |
| **multi** | Chain snapshot plus deep-dives on chosen locations, a shared playbook and per-location action lists. |
