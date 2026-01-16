# Database Schema Information Needed

## ✅ What We Know
- ✅ Supabase connection works
- ✅ `agencies` table exists (but is empty)
- ❌ `content_items` table doesn't exist
- ❌ `sub_accounts` table doesn't exist
- ❌ `analytics_events` table doesn't exist

## 📋 Please Run This SQL Query

Go to **Supabase Dashboard → SQL Editor** and run this:

```sql
-- 1. List ALL tables in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Check agencies table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'agencies'
ORDER BY ordinal_position;

-- 3. Check for any content/knowledge base tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (
    table_name LIKE '%content%' OR
    table_name LIKE '%guide%' OR
    table_name LIKE '%article%' OR
    table_name LIKE '%knowledge%' OR
    table_name LIKE '%kb%' OR
    table_name LIKE '%help%'
  )
ORDER BY table_name;

-- 4. If you have content tables, show their structure
-- (Replace 'your_content_table' with actual table name)
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'your_content_table'  -- Replace this!
ORDER BY ordinal_position;
```

## 📤 Share the Results

Please share:
1. **List of all tables** (from query #1)
2. **Agencies table columns** (from query #2)
3. **Any content tables found** (from query #3)
4. **Content table structure** (from query #4, if applicable)

## 🎯 What I'll Do Next

Once I know your schema:
1. ✅ Adapt `services/agency.ts` to match your `agencies` table structure
2. ✅ Create/adapt content tables if needed
3. ✅ Set up API endpoints to work with your structure
4. ✅ Update TenantContext to use your data format
5. ✅ Connect all components to your database

## 💡 Quick Alternative

If you prefer, you can also:
- Take a screenshot of your Supabase **Table Editor** showing all tables
- Or tell me what tables you have and I'll query them directly

