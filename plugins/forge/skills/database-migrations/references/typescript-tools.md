# TypeScript migration tools

The rules in the main skill apply unchanged; these are only the workflows.

## Prisma

```bash
npx prisma migrate dev --name add_user_avatar     # create + apply in dev
npx prisma migrate dev --create-only --name x     # create empty/editable SQL, don't apply
npx prisma migrate deploy                         # apply pending in production
npx prisma generate                               # regenerate client after schema changes
npx prisma migrate reset                          # dev only: drops the database
```

Prisma cannot generate `CREATE INDEX CONCURRENTLY` or batched backfills: use `--create-only` and
write the SQL by hand in the generated `migration.sql`.

## Drizzle

```bash
npx drizzle-kit generate    # SQL migration from schema diff
npx drizzle-kit migrate     # apply
npx drizzle-kit push        # dev only: sync schema without a migration file
```

Never use `push` against a shared or production database.

## Kysely (kysely-ctl)

```bash
kysely migrate make add_user_avatar
kysely migrate latest
kysely migrate down
kysely migrate list
```

- Type migration functions as `Kysely<any>`, not the app's typed DB interface: migrations are
  frozen in time and must not depend on today's schema types.
- Keep `allowUnorderedMigrations` off outside development; it disables ordering validation and
  lets environments drift.
