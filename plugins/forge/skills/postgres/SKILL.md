---
disable-model-invocation: true  # skl: on-demand pack skill
name: postgres
description: PostgreSQL reference - schema and data types, indexing (B-tree, composite, partial, covering, GIN, BRIN), query tuning with EXPLAIN, pagination, upserts, queues with SKIP LOCKED, row-level security, connection pooling, and diagnostic queries. Use when writing SQL for Postgres, designing tables or indexes, investigating a slow query, setting up RLS or pooling, or working with Postgres extensions such as pgvector.
---

# PostgreSQL

Reference patterns for Postgres schemas and queries. Schema changes on existing databases go
through forge:database-migrations. For a full review, the `database-reviewer` agent. Scale advice
to the data: a table with ten thousand rows does not need partitioning, BRIN or a queue table
redesign - follow forge:ponytail and measure first.

## Before writing

- Find the server version (`SELECT version();`) and existing schema/migrations. Features differ by
  version.
- Find how the app talks to Postgres (sqlx, pgx, psycopg, SQLAlchemy, an ORM) and follow its
  conventions for parameters and transactions.
- Always use bind parameters (`$1`, `%s`, `?` per driver); never format values into SQL strings.

## Data types

| Use case | Prefer | Avoid |
|---|---|---|
| Surrogate key | `bigint GENERATED ALWAYS AS IDENTITY` | `serial`, `int` (overflows) |
| Public/distributed IDs | UUID; time-ordered (v7) indexes better than random v4 | random UUID as clustered hot key on huge tables |
| Text | `text` (+ `CHECK (length(x) <= n)` if a limit is a real rule) | `varchar(255)` by habit |
| Timestamps | `timestamptz` | `timestamp` without time zone |
| Money / exact decimals | `numeric(p,s)` or integer minor units | `float`, `real`, `money` |
| Flags | `boolean` | `int`, `'Y'/'N'` |
| Enumerations | `text` + `CHECK`, or a lookup table | Postgres `ENUM` if values change often |
| Semi-structured | `jsonb` | `json` (no indexing), or jsonb for fields you always query |

- `NOT NULL` by default; nullable only when absence is meaningful.
- Foreign keys with explicit `ON DELETE` behaviour, and an index on the referencing column
  (Postgres does not create one automatically).
- Constraints (`UNIQUE`, `CHECK`, FK) enforce invariants the application can race on.

## Indexing

| Query pattern | Index |
|---|---|
| `WHERE col = x`, ranges, `ORDER BY col` | B-tree `(col)` |
| `WHERE a = x AND b > y` | composite `(a, b)` - equality columns first, then range |
| Same filter always applied (`deleted_at IS NULL`) | partial `... WHERE deleted_at IS NULL` |
| Index-only reads of extra columns | covering `(email) INCLUDE (name)` |
| `jsonb @>`, arrays, full-text `tsvector @@` | GIN |
| Huge append-only table filtered by time | BRIN `(created_at)` |
| Case-insensitive lookup | expression index `(lower(email))` and query `lower(email) = ...` |

- A composite index `(a, b)` serves `WHERE a = ...` but not `WHERE b = ...` alone.
- Every index slows writes and uses memory; drop unused ones (`pg_stat_user_indexes.idx_scan = 0`
  over a representative period).
- On a live table create indexes `CONCURRENTLY` (outside a transaction).

## Query tuning

- `EXPLAIN (ANALYZE, BUFFERS) <query>` on realistic data. Look for `Seq Scan` on large tables
  with selective filters, row estimates far from actual (run `ANALYZE`), nested loops over big row
  counts, and sorts spilling to disk.
- `EXPLAIN ANALYZE` executes the statement - wrap writes in `BEGIN; ... ROLLBACK;`.
- Fix N+1 patterns in the application: one query with `JOIN` or `WHERE id = ANY($1)`.
- Select only needed columns; avoid `SELECT *` in application code.
- Functions on an indexed column (`WHERE date(created_at) = ...`) prevent index use; rewrite as a
  range or add an expression index.

## Common patterns

```sql
-- Upsert
INSERT INTO settings (user_id, key, value) VALUES ($1, $2, $3)
ON CONFLICT (user_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Keyset pagination (stable, index-friendly; OFFSET cost grows with page number)
SELECT id, name FROM products
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC LIMIT 20;

-- Job queue: concurrent workers each claim a different row
UPDATE jobs SET status = 'running', started_at = now()
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1
  FOR UPDATE SKIP LOCKED
) RETURNING *;
```

- Keep transactions short; never hold one open across network calls or user input.
- Read-modify-write races: use `UPDATE ... SET n = n + 1`, `SELECT ... FOR UPDATE`, or a unique
  constraint with upsert - not "check then insert" in application code.
- Bulk loads: `COPY` (or the driver's copy API) instead of row-by-row inserts.

## Row-level security

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_owner ON orders
  USING (user_id = (SELECT current_setting('app.user_id')::bigint));
```

- Wrap function calls in the policy in `(SELECT ...)` so they are evaluated once per query instead
  of once per row (the same applies to helper functions such as Supabase's `auth.uid()`).
- Index the columns policies filter on.
- Table owners and superusers bypass RLS unless `FORCE ROW LEVEL SECURITY` is set; test policies
  as the application role.

## Connections and configuration

- Use a pool in the application (sqlx/pgx/psycopg pools) sized to the workload, not to
  `max_connections`. Many app instances may need an external pooler (PgBouncer); in transaction
  pooling mode, session state (`SET`, advisory locks, some prepared statement setups) does not
  persist across transactions.
- Set `statement_timeout` and `idle_in_transaction_session_timeout` (per role or per session) so
  runaway queries and abandoned transactions don't hold locks.
- `REVOKE CREATE ON SCHEMA public FROM PUBLIC` on older versions (default since PG15); give the
  app role only the privileges it needs.

## Diagnostics

```sql
-- Slowest queries (requires pg_stat_statements extension)
SELECT query, calls, mean_exec_time FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 20;

-- Foreign keys without an index on the referencing column
SELECT c.conrelid::regclass AS tbl, a.attname
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (SELECT 1 FROM pg_index i
                  WHERE i.indrelid = c.conrelid AND a.attnum = ANY (i.indkey));

-- Dead tuples / vacuum health
SELECT relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC LIMIT 20;

-- Who is blocking whom
SELECT pid, pg_blocking_pids(pid), state, query FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

## Extensions (pgvector and others)

- Check what is installed (`SELECT extname, extversion FROM pg_extension;`) and the extension's
  own documentation for that version before writing extension-specific SQL; operators, index
  types and tuning parameters vary across versions.
- Enable extensions in a migration (`CREATE EXTENSION IF NOT EXISTS ...`), not by hand.
- Treat vector or other extension indexes like any index: confirm with `EXPLAIN ANALYZE` that the
  query actually uses it, and measure recall/latency on realistic data before tuning.
- Postgres with pgvector keeps embeddings next to relational data with normal durability and
  transactions; a dedicated vector store is an extra moving part to justify, not a default.

## Review checklist

- [ ] Parameters bound, never interpolated
- [ ] Types: `timestamptz`, `bigint`/identity, `numeric` for money, `NOT NULL` default
- [ ] FKs indexed; new indexes match real query patterns
- [ ] Slow paths checked with `EXPLAIN (ANALYZE, BUFFERS)`
- [ ] Transactions short; races handled with constraints or row locks
- [ ] RLS policies tested as the app role
