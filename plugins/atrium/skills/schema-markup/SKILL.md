---
disable-model-invocation: true  # skl: on-demand pack skill
name: schema-markup
description: >
  Audits, writes, fixes and validates structured data as JSON-LD: detects existing markup,
  picks schema.org types per page, fills required and recommended properties from real page
  content, links entities with @graph/@id, checks current Google rich-result support and
  validates before shipping. Use when the user mentions schema markup, structured data,
  JSON-LD, schema.org, rich results or snippets, Product/Article/LocalBusiness/Breadcrumb
  schema, Search Console structured-data errors, or why rich results are not showing.
---

# Schema markup

Structured data describes what is visibly on the page. It never adds claims the page does not
make, and it is not a ranking hack. Valid schema.org is not the same as Google eligibility.

## Data

If OpenSEO MCP tools are connected, use them for keyword/SERP/backlink data; otherwise use web
search, Search Console/GA exports or other data the user provides. For schema work the main
inputs are page HTML, the Search Console enhancement reports and the user's CMS fields. Never
invent ratings, review counts, prices, addresses or dates; missing values become clearly marked
placeholders (`"<REPLACE: price>"`) and are listed for the user.

## 1. Discovery

- Pages in scope: URLs or templates, and the page type of each.
- Target outcome per page: a specific rich result, entity/brand clarity (logo, site name,
  knowledge panel), AI answer-engine legibility, or fixing reported errors.
- Data available: product feed, reviews system, author profiles, address/hours, event data.
- Existing markup and current Search Console errors/warnings.
- Stack: static HTML, server-rendered framework, SPA, CMS (and whether it already emits schema),
  tag manager. Who can edit templates.

## 2. Detect existing markup

Read the raw HTML (view-source or fetched response), not only the rendered DOM:
- JSON-LD: `<script type="application/ld+json">` blocks; parse each as JSON.
- Microdata: `itemscope`, `itemtype`, `itemprop`. RDFa: `vocab`, `typeof`, `property`.
- Note blocks with no `@context` or `@type`, duplicate entities (two Organizations for the same
  company, a plugin and a theme both emitting Article), and markup injected only by client-side
  JavaScript or a tag manager.
Recommend consolidating to JSON-LD. Keep other syntaxes only if migrating is not worth the risk.

## 3. Choose types by page

| Page | Primary | Supporting |
|---|---|---|
| Home | Organization (or LocalBusiness subtype) | WebSite, WebPage |
| Article / blog / news | Article, BlogPosting, NewsArticle | Person (author), BreadcrumbList |
| Product | Product (ProductGroup for variants) | Offer, AggregateRating, Review, BreadcrumbList |
| SaaS / app | SoftwareApplication or WebApplication | Offer, AggregateRating, Organization |
| Service page | Service | Organization/LocalBusiness as provider, BreadcrumbList |
| Location | LocalBusiness (most specific subtype) | PostalAddress, GeoCoordinates, OpeningHoursSpecification |
| Category / hub | CollectionPage | ItemList, BreadcrumbList |
| Video | VideoObject (Clip, SeekToAction for key moments) | Article if embedded in one |
| Event | Event | Place, Organization, Offer |
| Job | JobPosting (salary in `baseSalary`) | Organization |
| Course list | Course + ItemList | Organization |
| Forum / Q&A | DiscussionForumPosting, QAPage | Person |
| Author / profile | ProfilePage + Person | sameAs links |
| Contact / about | ContactPage, AboutPage | Organization |

Never mark up a type the page is not: no Product on a page that sells nothing, no Review on
content the business wrote about itself, no Event for an evergreen offer.

## 4. Properties

Google-required properties (minimum for the rich result; add recommended ones when the data is
real):

| Type | Required | Recommended |
|---|---|---|
| Organization | name, url | logo, sameAs, contactPoint, legalName, address |
| WebSite | name, url | alternateName (feeds the site name) |
| Article | headline, image, datePublished, author | dateModified, publisher (+logo), description |
| Product | name, image, and offers or review or aggregateRating | sku, gtin, brand, description |
| Offer | price, priceCurrency (ISO 4217) | availability, url, priceValidUntil, shipping/returns |
| AggregateRating | ratingValue, reviewCount or ratingCount | bestRating, worstRating |
| SoftwareApplication | name, offers (or rating) | applicationCategory, operatingSystem |
| BreadcrumbList | itemListElement (position, name, item) | - |
| LocalBusiness | name, address | telephone, openingHoursSpecification, geo, url, priceRange |
| Event | name, startDate, location | endDate, eventStatus, offers, organizer, image |
| VideoObject | name, thumbnailUrl, uploadDate | description, duration, contentUrl or embedUrl |

Value rules:
- URLs absolute (`https://...`), never relative.
- Dates ISO 8601 (`2026-03-14`, `2026-03-14T09:30:00+01:00`); `dateModified` not before
  `datePublished`; durations ISO 8601 (`PT12M`).
- Prices numeric without symbols (`29.99`); currency separate.
- Enumerations as full URLs (`https://schema.org/InStock`).
- `headline`, prices, ratings, addresses and hours match what the page visibly shows.
- Images crawlable, representative, of reasonable resolution.

## 5. Google support status

Rich-result support changes often. Before promising an outcome, check the current Google Search
Gallery and structured-data docs and state the check date. As known at writing:
- FAQPage: rich results restricted to authoritative government/health sites since 2023, and
  reported fully retired in 2026. Existing FAQPage markup is harmless: report it as info, not an
  error. Use QAPage only for genuine user-submitted Q&A.
- HowTo: rich results retired (2023). Use clear step headings in the content instead.
- Sitelinks search box (WebSite + SearchAction): retired late 2024; WebSite still matters for
  site names.
- Retired or deprecated in 2025: SpecialAnnouncement (use Event or Article), Course Info (use
  Course + ItemList), EstimatedSalary (use JobPosting.baseSalary), LearningVideo (use
  VideoObject), VehicleListing (use Product), ClaimReview rich results (still read by fact-check
  tools).
- Dataset markup serves dataset search, not web rich results.
A missing Search Console report for a retired feature is not broken markup. Retired types may
still help other consumers (schema.org parsers, AI systems); do not rip them out unprompted.

## 6. Reviews and ratings policy

- Ratings only from real, verifiable reviews visible on the page (or clearly linked).
- No self-serving review markup for a LocalBusiness or Organization about itself.
- No fabricated, aggregated-from-elsewhere or undisclosed incentivized reviews.
- If there is no review system, omit AggregateRating; do not ship placeholders to production.

## 7. Entity graph

Use one JSON-LD block with `@graph` per page and stable `@id` values so entities link instead
of repeating:
- `https://example.com/#organization` (sitewide; same everywhere), `#website`, page-level
  `<page-url>#webpage`, `#breadcrumb`, `#article`, `#product`, `<author-url>#person`.
- Article `publisher` → `{"@id": ".../#organization"}`; WebPage `isPartOf` → `#website`;
  `breadcrumb` → `#breadcrumb`; Product `brand` → Organization or Brand.
- Organization `sameAs`: official profiles only (LinkedIn, X, YouTube, Wikidata, Wikipedia,
  Crunchbase) that exist and belong to the entity. Person `sameAs`: the author's real profiles.
Entity consistency (same name, logo, address everywhere) also feeds `atrium:ai-visibility` and
`atrium:local-seo`.

Worked examples: `references/examples.md`.

## 8. Implementation

- Put JSON-LD in the server-rendered or prebuilt HTML (head or body both work). Client-side or
  tag-manager injection is processed less reliably and delays Product/Shopping updates.
- Static sites: a partial per page type filled from front matter.
- Server-rendered frameworks: a component that serializes a typed object with `JSON.stringify`
  (escape `</` to avoid breaking out of the script tag) from the same data that renders the page.
- CMS: use the CMS or its SEO plugin for base types; add custom types via custom fields or
  template code; turn off duplicates when two sources emit the same entity.
- Programmatic page sets: generate from the record data and test a sample of every template
  (`atrium:programmatic-seo`).
- Keep markup in sync: whatever updates the visible price, stock or date updates the schema.

## 9. Validate

1. Parse: every block is valid JSON (no trailing commas, unescaped quotes, comments).
2. Schema Markup Validator (validator.schema.org): vocabulary and nesting.
3. Google Rich Results Test: eligibility for Google features only; errors block the rich result,
   warnings mean optional fields missing.
4. Content match: compare each value with the visible page.
5. After deployment: Search Console enhancement reports and URL Inspection; reports lag days to
   weeks. Recheck after template or CMS changes.
When run with no browser access, do steps 1 and 4 yourself and give the user the step 2/3/5
checks to run.

## Common errors

| Error | Fix |
|---|---|
| Missing `@context` / `@type` | `"@context": "https://schema.org"` and a valid type |
| Missing required property | Add from real data or drop the type for that page |
| Relative URL, bad date, price with symbol | Absolute URL, ISO 8601, numeric price |
| Markup not on page / mismatched values | Change markup to match the page, or show the content |
| Duplicate or conflicting entities | One emitter, one `@id` per entity |
| Product without offers/review/rating | Add Offer with real price and availability |
| Placeholder text shipped | Remove or fill before publish |
| JS-only injection | Move to server-rendered HTML |

## Output

Lean, matched to the request:
- Audit: table `Page | Type | Status (valid / errors / warnings / missing) | Issues | Fix`,
  prioritized (errors on revenue pages first). Unchecked pages say "Not assessed".
- Implementation: copy-paste JSON-LD per page type with placeholders marked and a list of fields
  the user must fill, plus where to put it in their stack.
- Fix: corrected JSON-LD with a one-line change note per fix.
Broader technical issues go to `atrium:seo-audit`.

## Review checklist

- [ ] JSON parses; `@context` and `@type` on every entity.
- [ ] Types match the page; nothing marked up that is not visible.
- [ ] Required properties present; values absolute, ISO-formatted, numeric where needed.
- [ ] No fabricated ratings, reviews, prices or contacts; placeholders listed, none shipped.
- [ ] Entities linked by `@id`; no duplicates from multiple emitters.
- [ ] Google support status checked and dated; retired types not promised as rich results.
- [ ] Server-rendered; validator and Rich Results Test steps run or handed to the user.
