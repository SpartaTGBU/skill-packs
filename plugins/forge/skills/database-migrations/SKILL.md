---
disable-model-invocation: true  # skl: on-demand pack skill
name: database-migrations
description: Safe database schema and data migration patterns for PostgreSQL - forward-only production changes, expand-contract renames, lock-safe columns, constraints and indexes, batched backfills, and tool workflows for sqlx, golang-migrate, Alembic and Django. Use when writing a schema or data migration, adding a column, constraint or index to a large table, planning a rollback, or preparing a zero-downtime deploy.
---

# Database migrations

Schema changes that don't take production down. Postgres specifics are in forge:postgres. Scale
the ceremony to the table: a fresh project or a 1,000-row table can take a plain `ALTER`; the
lock-safe patterns below matter for large or hot tables and for rolling deploys (forge:ponytail -
don't run a three-phase expand-contract on a table nobody else reads yet).

## Rules

1. Every change is a migration file in the repo. Never alter shared databases by hand.
2. Migrations are immutable once applied anywhere shared. Fix forward with a new migration.
3. Production is forward-only; a "rollback" is a new migration (or a restored backup for data loss).
   Down migrations are still useful in development.
4. Keep schema (DDL) and data backfills in separate migrations.
5. During a rolling deploy old and new code run together - each migration must be compatible with
   the code version before it and after it.
6. Test against production-like volume: what is instant on 100 rows can lock 10M rows for minutes.

## Before writing

- Find the migration tool and directory the project already uses and follow its naming and
  transaction conventions.
- Check the table size (`SELECT pg_size_pretty(pg_total_relation_size('t'));`, row estimate in
  `pg_class.reltuples`) and how hot it is. That decides plain vs lock-safe.
- Set a `lock_timeout` (e.g. `SET lock_timeout = '5s';`) in migrations touching busy tables, so a
  migration waiting for a lock fails fast instead of queueing every other query behind it.

## Lock-safe operations (Postgres)

| Change | Unsafe on a big/hot table | Safe approach |
|---|---|---|
| Add nullable column | - | `ADD COLUMN x text` (metadata only) |
| Add column with default | volatile default (`clock_timestamp()`, `gen_random_uuid()`) rewrites the table | constant or stable default is metadata-only since PG11; otherwise add nullable, backfill, then set default |
| Add `NOT NULL` column | `ADD COLUMN x text NOT NULL` fails on a non-empty table | add with a default, or nullable + backfill + constraint |
| Make column `NOT NULL` | `SET NOT NULL` scans under an exclusive lock | `ADD CONSTRAINT c CHECK (x IS NOT NULL) NOT VALID;` then `VALIDATE CONSTRAINT c;` then `SET NOT NULL` (PG12+ uses the validated check, no scan), then drop the check |
| Add foreign key / check | validates while holding a lock | `ADD CONSTRAINT ... NOT VALID`, then `VALIDATE CONSTRAINT` in a later step |
| Create index | `CREATE INDEX` blocks writes | `CREATE INDEX CONCURRENTLY` - cannot run in a transaction, one statement per migration; on failure drop the leftover `INVALID` index and retry |
| Unique constraint | `ADD CONSTRAINT UNIQUE` builds the index under lock | `CREATE UNIQUE INDEX CONCURRENTLY`, then `ADD CONSTRAINT ... UNIQUE USING INDEX` |
| Change column type | most type changes rewrite the table | new column + backfill + switch (expand-contract) |
| Rename column/table | breaks running old code | expand-contract, or a view/alias during the transition |
| Drop column | breaks running old code | remove all code references, deploy, then drop |

## Expand-contract (zero-downtime rename or type change)

```
1. EXPAND    migration: add the new column (nullable)
             deploy: app writes BOTH old and new, reads old
2. BACKFILL  data migration: copy old -> new in batches
3. SWITCH    deploy: app reads new, still writes both; verify counts match
4. CONTRACT  deploy: app uses only new
             migration (a later release): drop the old column
```

Each step ships and is verified before the next. Skip it when no old code can be running against
the table (single binary deployed with downtime, brand-new table).

## Batched backfills

One `UPDATE` over millions of rows holds locks and bloats WAL in one transaction. Batch by key
range or a limited subquery, committing each batch:

```sql
-- run repeatedly (from a script or job) until it updates 0 rows
UPDATE users SET email_norm = lower(email)
WHERE id IN (
  SELECT id FROM users WHERE email_norm IS NULL
  ORDER BY id LIMIT 5000
  FOR UPDATE SKIP LOCKED
);
```

- A `DO` block with `COMMIT` inside only works outside an explicit transaction, and most migration
  tools wrap each file in one - drive the loop from application code or a non-transactional
  migration instead.
- Make backfills idempotent (`WHERE new IS NULL`) so a rerun after failure is safe.
- Pause between batches on busy systems; watch replication lag.

## Tool workflows

### sqlx (Rust)

```bash
sqlx migrate add -r add_user_avatar   # creates <ts>_add_user_avatar.up.sql / .down.sql
sqlx migrate run                      # apply pending (uses DATABASE_URL)
sqlx migrate revert                   # undo last (dev)
sqlx migrate info
```

- Embed with `sqlx::migrate!("./migrations").run(&pool).await?` to apply on startup.
- sqlx records a checksum per migration and refuses to run if an applied file was edited.
- Each migration runs in a transaction; put `-- no-transaction` on the first line of a file that
  contains `CREATE INDEX CONCURRENTLY`.
- With compile-time checked queries (`query!`), update the offline data (`cargo sqlx prepare`) if
  the project uses `SQLX_OFFLINE`.

### golang-migrate (Go)

```bash
migrate create -ext sql -dir migrations -seq add_user_avatar   # NNNNNN_name.up.sql / .down.sql
migrate -path migrations -database "$DATABASE_URL" up
migrate -path migrations -database "$DATABASE_URL" down 1
migrate -path migrations -database "$DATABASE_URL" force VERSION   # clear a dirty state after fixing by hand
```

- A failed migration leaves the version marked dirty; inspect what partially applied before `force`.
- Keep `CREATE INDEX CONCURRENTLY` alone in its own file: Postgres runs a multi-statement string in
  an implicit transaction, where `CONCURRENTLY` is not allowed.

### Alembic (Python / SQLAlchemy)

```bash
alembic revision --autogenerate -m "add user avatar"   # review the generated file - autogenerate misses things
alembic upgrade head
alembic downgrade -1
```

Concurrent index: `with op.get_context().autocommit_block(): op.create_index(..., postgresql_concurrently=True)`.

### Django

```bash
python manage.py makemigrations && python manage.py sqlmigrate app 0016   # inspect SQL
python manage.py migrate
python manage.py makemigrations --empty app -n backfill_display_name
```

- Data migrations: `migrations.RunPython(forward, reverse)` using `apps.get_model(...)`, never
  importing models directly; batch with `bulk_update`.
- Concurrent index: `AddIndexConcurrently` from `django.contrib.postgres.operations` in a migration
  with `atomic = False`.
- Drop a field in two steps: `SeparateDatabaseAndState` removes it from the model state, a later
  migration drops the column.

TypeScript tools (Prisma, Drizzle, Kysely): see `references/typescript-tools.md`.

## Pre-merge checklist

- [ ] Applies cleanly on a copy of current schema; down migration works in dev (or marked irreversible)
- [ ] Compatible with both the previous and the next app version
- [ ] No table rewrite or long exclusive lock on large tables; `lock_timeout` set for hot tables
- [ ] Indexes created concurrently; constraints added `NOT VALID` then validated
- [ ] Backfill separate, batched, idempotent
- [ ] Generated migrations reviewed by hand (autogenerate drops/renames are often wrong)
- [ ] Rollback plan stated for anything destructive; backup taken before dropping data

## Anti-patterns

| Anti-pattern | Why it fails | Instead |
|---|---|---|
| Manual SQL on production | no audit trail, environments drift | migration file |
| Editing an applied migration | checksum errors or silent drift | new migration |
| Schema + backfill in one migration | long transaction, hard to retry | separate migrations |
| Dropping a column before removing code | running app errors | code first, drop next release |
| Typed ORM models imported in migrations | old migrations break when models change | migration-local or untyped access |
