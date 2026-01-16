/**
 * Schema Inspection Script
 * Run this to check your current Supabase database structure
 * 
 * Usage: npx tsx scripts/check-schema.ts
 */

import { createClient } from '@supabase/supabase-js';

// Use environment variables or direct keys
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://msveowiujkbzsnavkfyz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY 
  || process.env.VITE_SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmVvd2l1amtienNuYXZrZnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAzNDA4NCwiZXhwIjoyMDc5NjEwMDg0fQ.i6ZkZ5CWeS_jWE8qFVIhj0eAR1vljIhht1MjqEH_GfQ';

if (!supabaseKey) {
  console.error('❌ Missing Supabase key. Set VITE_SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking Supabase Database Schema...\n');

  try {
    // Check what tables exist
    console.log('📊 Checking Tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      // Try direct query instead
      console.log('⚠️  Could not query information_schema directly');
      console.log('📋 Please run this query in Supabase SQL Editor:\n');
      console.log(`
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
      `);
    }

    // Check for tenants table
    console.log('\n🏢 Checking tenants table...');
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('*')
      .limit(1);

    if (tenantsError) {
      console.log('❌ tenants table not found or error:', tenantsError.message);
      console.log('   This might be named "agencies" instead\n');
    } else {
      console.log('✅ tenants table exists');
      if (tenants && tenants.length > 0) {
        console.log('   Sample row:', Object.keys(tenants[0]));
      }
    }

    // Check for agencies table (simpler structure)
    console.log('\n🏢 Checking agencies table...');
    const { data: agencies, error: agenciesError } = await supabase
      .from('agencies')
      .select('*')
      .limit(1);

    if (agenciesError) {
      console.log('❌ agencies table not found or error:', agenciesError.message);
    } else {
      console.log('✅ agencies table exists');
      if (agencies && agencies.length > 0) {
        console.log('   Sample row:', Object.keys(agencies[0]));
      }
    }

    // Check for content_items table
    console.log('\n📚 Checking content_items table...');
    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .select('*')
      .limit(1);

    if (contentError) {
      console.log('❌ content_items table not found or error:', contentError.message);
    } else {
      console.log('✅ content_items table exists');
      if (content && content.length > 0) {
        console.log('   Sample row:', Object.keys(content[0]));
      }
    }

    // Check for sub_accounts table
    console.log('\n👥 Checking sub_accounts table...');
    const { data: subAccounts, error: subAccountsError } = await supabase
      .from('sub_accounts')
      .select('*')
      .limit(1);

    if (subAccountsError) {
      console.log('❌ sub_accounts table not found or error:', subAccountsError.message);
    } else {
      console.log('✅ sub_accounts table exists');
    }

    // Analytics table removed per user requirements
    console.log('\n📊 Checking analytics_events table...');
    console.log('   ℹ️  Analytics table not needed - skipped');

    console.log('\n✅ Schema check complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the results above');
    console.log('   2. Share the table structures with me');
    console.log('   3. I\'ll adapt the code to match your schema');

  } catch (error: any) {
    console.error('❌ Error checking schema:', error.message);
    console.log('\n💡 Alternative: Run this SQL in Supabase SQL Editor:');
    console.log(`
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check tenants structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tenants';

-- Check content_items structure  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content_items';
    `);
  }
}

checkSchema();

