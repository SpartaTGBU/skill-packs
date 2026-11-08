# JSON-LD examples

Templates only. Replace every `<REPLACE: ...>` with real page data or delete the property. Use
absolute URLs and ISO 8601 dates. Validate before shipping (SKILL.md section 9).

## Article page with sitewide entity graph

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "<REPLACE: legal or brand name>",
      "url": "https://example.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/assets/logo-512.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "<REPLACE: https://www.linkedin.com/company/...>",
        "<REPLACE: https://www.wikidata.org/wiki/Q...>"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "name": "<REPLACE: site name>",
      "publisher": { "@id": "https://example.com/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/blog/post-slug/#webpage",
      "url": "https://example.com/blog/post-slug/",
      "name": "<REPLACE: page title>",
      "isPartOf": { "@id": "https://example.com/#website" },
      "breadcrumb": { "@id": "https://example.com/blog/post-slug/#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://example.com/blog/post-slug/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog/" },
        { "@type": "ListItem", "position": 3, "name": "<REPLACE: post title>" }
      ]
    },
    {
      "@type": "Person",
      "@id": "https://example.com/authors/jane-doe/#person",
      "name": "<REPLACE: author name>",
      "url": "https://example.com/authors/jane-doe/",
      "jobTitle": "<REPLACE: role>",
      "sameAs": ["<REPLACE: author's real profile URL>"]
    },
    {
      "@type": "BlogPosting",
      "@id": "https://example.com/blog/post-slug/#article",
      "mainEntityOfPage": { "@id": "https://example.com/blog/post-slug/#webpage" },
      "headline": "<REPLACE: headline exactly as shown in H1>",
      "description": "<REPLACE: summary>",
      "image": ["https://example.com/images/post-slug-1200x675.jpg"],
      "datePublished": "2026-03-14T09:30:00+00:00",
      "dateModified": "2026-04-02T11:00:00+00:00",
      "author": { "@id": "https://example.com/authors/jane-doe/#person" },
      "publisher": { "@id": "https://example.com/#organization" }
    }
  ]
}
```

The last breadcrumb item may omit `item` (it is the current page). Organization and WebSite are
identical on every page; only page-level nodes change.

## Product with offer and rating

Only include `aggregateRating` and `review` when real reviews are shown on the page.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://example.com/products/widget-pro/#product",
  "name": "<REPLACE: product name>",
  "description": "<REPLACE: description as on page>",
  "image": [
    "https://example.com/images/widget-pro-1x1.jpg",
    "https://example.com/images/widget-pro-4x3.jpg"
  ],
  "sku": "<REPLACE: SKU>",
  "gtin13": "<REPLACE: GTIN if one exists, else delete>",
  "brand": { "@type": "Brand", "name": "<REPLACE: brand>" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/widget-pro/",
    "price": "<REPLACE: 49.00>",
    "priceCurrency": "<REPLACE: USD>",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "priceValidUntil": "<REPLACE: 2026-12-31>"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "<REPLACE: real average>",
    "reviewCount": "<REPLACE: real count>",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

Variants (sizes, colors): use ProductGroup with `hasVariant` and `variesBy`, one Product per
variant with its own sku and offer.

## Local business

Use the most specific subtype (Dentist, Plumber, Restaurant...) over plain LocalBusiness. One
block per location page; NAP must match the page and the business profile exactly.

```json
{
  "@context": "https://schema.org",
  "@type": "<REPLACE: e.g. Dentist>",
  "@id": "https://example.com/locations/springfield/#localbusiness",
  "name": "<REPLACE: business name as on signage>",
  "url": "https://example.com/locations/springfield/",
  "image": "https://example.com/images/springfield-storefront.jpg",
  "telephone": "<REPLACE: +1-555-010-0000>",
  "priceRange": "<REPLACE: $$>",
  "parentOrganization": { "@id": "https://example.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<REPLACE: 123 Main St, Suite 4>",
    "addressLocality": "<REPLACE: Springfield>",
    "addressRegion": "<REPLACE: IL>",
    "postalCode": "<REPLACE: 62701>",
    "addressCountry": "<REPLACE: US>"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "<REPLACE: 39.7990>",
    "longitude": "<REPLACE: -89.6440>"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "13:00"
    }
  ]
}
```

Closed days: omit them. Holiday hours: add a specification with `validFrom`/`validThrough`.
Geo coordinates: at least 5 decimal places, taken from the real address, never estimated.
