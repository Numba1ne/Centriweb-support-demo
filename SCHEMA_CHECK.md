# Database Schema Check

## Your Supabase Credentials

I've set up your credentials. However, I need to understand your current database structure to adapt the code properly.

## Please Run This SQL Query

Go to your Supabase Dashboard → SQL Editor and run this query:

```sql
-- 1. List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check tenants/agencies table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'tenants'
ORDER BY ordinal_position;

-- If tenants doesn't exist, check for agencies:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'agencies'
ORDER BY ordinal_position;

-- 3. Check content_items table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_items'
ORDER BY ordinal_position;

-- 4. Check sub_accounts table (if exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'sub_accounts'
ORDER BY ordinal_position;

-- 5. Check analytics_events table (if exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'analytics_events'
ORDER BY ordinal_position;

-- 6. Sample data from tenants/agencies
SELECT * FROM tenants LIMIT 1;
-- OR
SELECT * FROM agencies LIMIT 1;

-- 7. Sample data from content_items
SELECT id, tenant_id, type, category, title, slug, is_override 
FROM content_items 
LIMIT 5;
```

## Share the Results

Please share:
1. **List of tables** you have
2. **Structure of your tenants/agencies table** (column names and types)
3. **Structure of your content_items table** (if you have one)
4. **Sample row** from tenants/agencies (so I can see the data format)

## What I'll Do Next

Once I know your schema:
1. ✅ Adapt the API endpoints to match your table structure
2. ✅ Update TenantContext to work with your data format
3. ✅ Ensure content inheritance works with your setup
4. ✅ Connect all components to your existing data

## Alternative: Quick Check Script

If you prefer, I can create a Node.js script that will check your schema automatically. Just let me know!

