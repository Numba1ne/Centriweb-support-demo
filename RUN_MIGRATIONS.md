# Running Database Migrations

## Step 1: Run Initial Schema Migration

1. **Go to Supabase SQL Editor**
   - Visit: https://app.supabase.com/project/msveowiujkbzsnavkfyz/sql
   - Or: Dashboard → SQL Editor

2. **Open Migration File**
   - Open: `supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents

3. **Paste and Run**
   - Paste into SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - Wait for success message

4. **Verify Tables Created**
   - Go to **Table Editor**
   - You should see:
     - ✅ `tenants`
     - ✅ `sub_accounts`
     - ✅ `content_items`
     - ✅ `analytics_events`
     - ✅ `health_scores`

## Step 2: Run Content Seed Data Migration

1. **Go back to SQL Editor**

2. **Open Second Migration File**
   - Open: `supabase/migrations/002_content_seed_data.sql`
   - Copy the entire contents

3. **Paste and Run**
   - Paste into SQL Editor
   - Click **Run**
   - Wait for success message

4. **Verify Seed Data**
   - Go to **Table Editor → tenants**
   - You should see:
     - ✅ `centriweb` (default tenant)
     - ✅ `demo-agency` (demo tenant)
   - Go to **Table Editor → content_items**
   - You should see 6 base guides

## Step 3: Verify Everything Works

Run the schema check script:

```bash
npx tsx scripts/check-schema.ts
```

You should see:
- ✅ tenants table exists
- ✅ content_items table exists
- ✅ sub_accounts table exists
- ✅ analytics_events table exists

## Troubleshooting

### Error: "relation already exists"
- Some tables might already exist
- The migration uses `CREATE TABLE IF NOT EXISTS` so it's safe to run again
- If you get errors, you can drop tables first (be careful!)

### Error: "permission denied"
- Make sure you're using the service_role key
- Check that RLS policies are set correctly

### Error: "syntax error"
- Check that you copied the entire SQL file
- Make sure there are no extra characters
- Try running statements one at a time

## Next Steps

Once migrations are complete:
1. ✅ Database schema is ready
2. ✅ Seed data is loaded
3. ✅ Ready to build API endpoints
4. ✅ Ready to integrate components

