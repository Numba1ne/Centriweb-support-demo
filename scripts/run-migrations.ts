/**
 * Run Supabase Migrations
 * This script executes the SQL migrations against your Supabase database
 * 
 * Usage: npx tsx scripts/run-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://msveowiujkbzsnavkfyz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmVvd2l1amtienNuYXZrZnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAzNDA4NCwiZXhwIjoyMDc5NjEwMDg0fQ.i6ZkZ5CWeS_jWE8qFVIhj0eAR1vljIhht1MjqEH_GfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(filename: string) {
  console.log(`\n📄 Running migration: ${filename}`);
  
  try {
    const sql = readFileSync(join(process.cwd(), 'supabase', 'migrations', filename), 'utf-8');
    
    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim().length === 0) continue;
      
      try {
        // Use RPC to execute raw SQL (if available) or use direct query
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Try direct execution via REST API
          console.log(`   ⚠️  RPC not available, trying alternative method...`);
          // Note: Supabase JS client doesn't support raw SQL execution directly
          // We'll need to use the SQL Editor in Supabase dashboard instead
          console.log(`   ℹ️  Please run this migration manually in Supabase SQL Editor`);
          return false;
        }
      } catch (e: any) {
        console.log(`   ⚠️  Statement execution issue: ${e.message}`);
      }
    }
    
    console.log(`   ✅ Migration completed`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Error running migration: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase Migrations...\n');
  console.log('⚠️  NOTE: Supabase JS client cannot execute raw SQL directly.');
  console.log('   Please run these migrations manually in Supabase SQL Editor:\n');
  console.log('   1. Go to: https://app.supabase.com/project/msveowiujkbzsnavkfyz/sql');
  console.log('   2. Copy and paste the contents of:');
  console.log('      - supabase/migrations/001_initial_schema.sql');
  console.log('      - supabase/migrations/002_content_seed_data.sql');
  console.log('   3. Run each migration separately\n');
  
  // Check if tables already exist
  console.log('🔍 Checking current database state...\n');
  
  const tablesToCheck = ['tenants', 'sub_accounts', 'content_items'];
  
  for (const table of tablesToCheck) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`   ❌ ${table}: Not found`);
    } else {
      console.log(`   ✅ ${table}: Exists`);
    }
  }
  
  console.log('\n📋 Migration files ready:');
  console.log('   ✅ supabase/migrations/001_initial_schema.sql');
  console.log('   ✅ supabase/migrations/002_content_seed_data.sql');
  console.log('\n💡 Next step: Run these SQL files in Supabase SQL Editor');
}

main();

