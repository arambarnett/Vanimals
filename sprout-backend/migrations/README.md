# Database Migrations

## Current Schema

**Active Migration:** `001_initial_schema.sql`

This is the production schema for the Sprouts category-based system.

---

## Running Migrations

### Fresh Database Setup

```bash
# From sprout-backend directory
PGPASSWORD="KEWKdPGAX3YDRf6N" psql \
  -h aws-0-us-east-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.fuznyncrufagipokvrub \
  -d postgres \
  -f migrations/001_initial_schema.sql
```

### Or via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/fuznyncrufagipokvrub/sql/new
2. Copy contents of `migrations/001_initial_schema.sql`
3. Paste and run

---

## Migration History

### 001_initial_schema.sql (Current - Oct 3, 2024)

**Purpose:** Fresh start with category-based Sprouts system

**Changes:**
- Dropped all old Privy-based tables
- Created 8 new tables:
  - `users` - Aptos wallet authentication
  - `sprouts` - One per goal category
  - `goals` - Multiple per sprout
  - `integrations` - Connected platforms
  - `activities` - User actions
  - `achievements` - Badges
  - `accessories` - Unlockable items
  - `user_accessories` - Earned items
- Seeded 24 initial accessories (4 per category)

**Key Features:**
- One Sprout per goal category (max 6 per user)
- Category constraint: `UNIQUE (userId, category)`
- All IDs use TEXT/cuid (not UUID)
- Accessories reward system

---

## Archived Migrations

Old migration attempts are in `archive/`:
- `migration.sql` - Initial attempt
- `migration_category_based.sql` - First category-based design
- `migration_alter_existing.sql` - Tried to alter existing tables
- `migration_create_missing_tables.sql` - Tried to create missing only

These are kept for reference but should not be run.

---

## Schema Versioning

We're not using Prisma Migrate yet to avoid conflicts with direct SQL migrations.

Current workflow:
1. Update `prisma/schema.prisma`
2. Generate SQL from schema changes
3. Create numbered migration file
4. Run manually on Supabase
5. Run `npx prisma generate` to update client

---

## Testing Migrations Locally

### Option 1: Docker PostgreSQL

```bash
# Start local Postgres
docker run --name sprouts-db \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Run migration
psql -h localhost -U postgres -d postgres -f migrations/001_initial_schema.sql

# Update .env for local testing
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
```

### Option 2: Supabase Local Dev

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

---

## Creating New Migrations

### 1. Update Schema
Edit `prisma/schema.prisma` with your changes

### 2. Generate SQL
```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migrations/002_your_change.sql
```

### 3. Review & Edit
- Add `IF NOT EXISTS` clauses where appropriate
- Add comments explaining changes
- Test locally first

### 4. Apply to Supabase
Run via psql or Supabase dashboard

### 5. Update Prisma Client
```bash
npx prisma generate
```

---

## Rollback Strategy

Currently no automated rollback. To revert:

1. **Restore from Supabase Backup**
   - Dashboard → Settings → Backups
   - Restore to point before migration

2. **Manual Rollback**
   - Write reverse migration SQL
   - Test in staging first

3. **Nuclear Option**
   - Re-run `001_initial_schema.sql`
   - **WARNING: Deletes all data**

---

## Migration Best Practices

### ✅ DO
- Test migrations locally first
- Backup database before running
- Use `IF NOT EXISTS` for safety
- Document what each migration does
- Keep migrations small and focused
- Version control all migrations

### ❌ DON'T
- Run migrations directly in production without testing
- Modify existing migration files (create new ones)
- Delete old migrations
- Mix schema changes with data changes
- Use `DROP TABLE` without `IF EXISTS`

---

## Schema Diff Tool

Check what's different between Prisma schema and database:

```bash
npx prisma migrate diff \
  --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma
```

---

## Troubleshooting

### "relation already exists"
Use `CREATE TABLE IF NOT EXISTS` or drop table first

### "column does not exist"
Check if column name uses quotes for camelCase: `"userId"` not `userId`

### Type mismatch errors
Ensure Prisma types match SQL:
- `String` → `TEXT`
- `Int` → `INTEGER`
- `Float` → `DOUBLE PRECISION`
- `DateTime` → `TIMESTAMP(3)`
- `Boolean` → `BOOLEAN`
- `Json` → `JSONB`

### Foreign key constraint fails
Ensure referenced table exists first, run migrations in order

---

## Production Checklist

Before running migration in production:

- [ ] Tested in local database
- [ ] Reviewed SQL for safety
- [ ] Backed up database
- [ ] Notified team of maintenance
- [ ] Prepared rollback plan
- [ ] Updated API code if needed
- [ ] Updated frontend if needed
- [ ] Ran `npx prisma generate`
- [ ] Restarted backend server

---

## Future Improvements

1. Set up automated migration system (Prisma Migrate or Flyway)
2. Add migration testing in CI/CD
3. Create staging environment for testing
4. Implement blue/green deployment for zero downtime
5. Add migration versioning table

---

For questions about migrations, check:
- `docs/DATABASE_SCHEMA.md` - Full schema documentation
- `prisma/schema.prisma` - Current schema definition
