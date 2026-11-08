# API design and ports & adapters reference

## HTTP API shape

**Resources**: plural, lowercase, kebab-case nouns (`/api/v1/order-items`); sub-resources for
ownership (`/users/{id}/orders`); verbs only for actions that aren't CRUD
(`POST /orders/{id}/cancel`). Match the naming already used by existing endpoints.

| Method | Idempotent | Safe | Use for |
|--------|-----------|------|---------|
| GET | yes | yes | read |
| POST | no | no | create, trigger action |
| PUT | yes | no | full replace |
| PATCH | no* | no | partial update |
| DELETE | yes | no | remove |

**Status codes**: 200 read/update, 201 created (+ `Location`), 204 no body, 400 malformed,
401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 422 validation, 429 rate limited,
500 unexpected, 503 unavailable. Never 200 for errors; never 500 for validation.

**Error body** (one format everywhere, no stack traces or SQL):

```json
{ "error": { "code": "validation_error", "message": "Request validation failed",
  "details": [{ "field": "email", "code": "invalid_format", "message": "Must be a valid email" }] } }
```

**Pagination**: offset (`?page=2&per_page=20`) for small admin datasets and numbered search pages;
cursor (`?cursor=...&limit=20`, returns `next_cursor`, `has_more`) for feeds, large or public
collections. **Filtering/sorting**: `?status=active`, `?price[gte]=10`, `?sort=-created_at,name`,
`?fields=id,name` for sparse fieldsets.

**Versioning**: start at `/api/v1/`, don't add v2 until a breaking change forces it; keep at most
current + previous. Non-breaking (no new version): new response fields, new optional params, new
endpoints. Breaking: removing/renaming fields, changing types, URL structure or auth. Deprecate with
notice and a `Sunset` header, then 410.

**Checklist**
- [ ] Naming and casing consistent with existing endpoints
- [ ] Correct method and status codes
- [ ] Input validated at the edge with a schema (the stack's existing validator)
- [ ] Standard error format; no internal details leaked
- [ ] List endpoints paginated
- [ ] Authentication required or explicitly public; authorization checks ownership
- [ ] Rate limiting where exposed publicly
- [ ] Contract artifact (OpenAPI etc.) updated in the same change

## Ports & adapters (only when the seam is earned)

Use when the same use case has several entry points (HTTP, CLI, worker), when real infrastructure
must be swappable, or when domain logic is tangled with I/O that has two real adapters.

- **Domain**: entities, value objects, rules. No framework, ORM or SDK imports.
- **Use case**: orchestrates domain + ports; explicit input/output types; returns plain data.
- **Inbound adapter**: protocol -> use-case input, and result/error -> protocol.
- **Outbound port**: a capability the use case needs (`OrderRepository`, `PaymentGateway`,
  `Clock`), owned by the consuming side. Outbound adapter implements it for a technology.
- **Composition root**: one explicit place that builds adapters and injects them. No service
  locators or hidden global singletons.

Feature-first layout when the codebase has nothing better:

```text
src/features/orders/
  domain/         Order, OrderPolicy
  application/    CreateOrder use case, ports
  adapters/       http route, postgres repository, stripe gateway
  composition     wiring
```

Go: small interfaces owned by the consuming package, explicit `New...` constructors, wiring in
`cmd/<app>/main.go`. Java/Kotlin: `domain`, `application.port`, `application.usecase`, `adapter`
packages; framework annotations optional.

**Anti-patterns**: domain importing ORM/web types; use cases reading `req`/`res` or queue metadata;
returning DB rows from use cases; adapters calling each other directly; wiring scattered across files.

**Testing per seam**: domain - pure tests, no mocks. Use case - fake ports, assert outcomes.
Outbound adapters - one shared contract suite per port run against every adapter, plus integration
against real infra. Inbound adapters - protocol mapping. A few end-to-end tests for critical journeys.

**Migration**: pick one high-churn, low-blast-radius slice; add characterization tests; extract the
use case; wrap existing infra calls behind ports (facade first); make old entry points delegate to
the new use case; keep a reversible switch until verified in production; repeat slice by slice.
