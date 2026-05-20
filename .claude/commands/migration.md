---
description: Create a Supabase migration. Picks the next number, sets up the SQL file with header comment, and reminds about the shared-app contract.
---

# /migration <name>

Create a new Supabase migration.

## Inputs

- `<name>` — snake_case description, e.g. `add_reviews_featured_flag`, `web_products`

## Steps

1. **Read** `supabase-web` skill for current patterns.

2. **Check the highest existing migration number** in BOTH this project AND the mobile app at `E:\steffny-couture\supabase\migrations\`. The web project's first migration is `008` because the mobile app uses `001-007`. Pick the next available number that doesn't clash with the mobile app.

3. **Determine if this affects shared tables**:
   - Modifying `bookings`, `profiles`, `alteration_types`, `shop_settings`, `booking_status_history` → **STOP**. These are owned by the mobile app. Coordinate the change there first, regenerate types in both projects.
   - Adding new tables (`products`, `reviews`, `inquiries`, etc.) → safe, proceed.
   - Adding RLS policies that grant `anon` more access on shared tables → review carefully, never tighten existing mobile-app policies.

4. **Create the file**:

   ```sql
   -- supabase/migrations/<NNN>_<name>.sql
   --
   -- <one-line description>
   -- Web project migration. Does not modify mobile-app-owned tables.
   --

   -- BEGIN

   <SQL here>

   -- END
   ```

   Conventions:
   - `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
   - `created_at timestamptz DEFAULT now() NOT NULL`
   - `updated_at timestamptz` with a trigger to auto-update if needed
   - Enums via `CREATE TYPE` only if reused; otherwise `CHECK (col IN (...))`
   - `ON DELETE CASCADE` on dependent FKs only when truly cascading is correct
   - Always `ENABLE ROW LEVEL SECURITY` on user-facing tables
   - Always write the RLS policy in the same migration as the table

5. **Apply locally**:
   ```bash
   npx supabase db push      # if using Supabase CLI
   ```
   Or apply manually via the Supabase Studio SQL editor.

6. **Regenerate types**:
   ```bash
   npx supabase gen types typescript --linked > src/types/database.ts
   ```
   Commit the generated file.

7. **Verify**:
   - The migration applies cleanly
   - `src/types/database.ts` has the new types
   - No breaking changes to existing app-owned types (diff against the mobile app's `database.ts`)
   - The mobile app's TypeScript still compiles if you regenerate its types too

8. **Commit**:
   ```
   db: <one-line description>

   - <main change 1>
   - <RLS policy summary>
   - <indexes added>
   ```

## Hard rules

- Never modify schemas of mobile-app-owned tables without coordination
- Always include RLS policies in the same migration
- Always regenerate types and commit them
- Never use `DROP TABLE` or `DROP COLUMN` without explicit confirmation
- Never write a migration that depends on data — migrations should be data-agnostic
- Always test the migration on a non-prod Supabase first if available
