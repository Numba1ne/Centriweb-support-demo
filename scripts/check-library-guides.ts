/**
 * Check library_guides table
 * Quick script to verify the guides table exists and has data
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://msveowiujkbzsnavkfyz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmVvd2l1amtienNuYXZrZnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAzNDA4NCwiZXhwIjoyMDc5NjEwMDg0fQ.i6ZkZ5CWeS_jWE8qFVIhj0eAR1vljIhht1MjqEH_GfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLibraryGuides() {
  console.log('🔍 Checking library_guides table...\n');

  try {
    // Check if table exists and get count
    const { data, error, count } = await supabase
      .from('library_guides')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', error.details);
      return;
    }

    console.log(`✅ library_guides table exists!`);
    console.log(`   Total rows: ${count}`);
    
    if (data && data.length > 0) {
      console.log(`\n📋 Sample data (first ${data.length} rows):`);
      data.forEach((guide, idx) => {
        console.log(`\n   ${idx + 1}. ${guide.title}`);
        console.log(`      ID: ${guide.id}`);
        console.log(`      Folder: ${guide.folder_label} (${guide.folder_slug})`);
        console.log(`      Status: ${guide.status}`);
        console.log(`      Subcategory: ${guide.subcategory_label || 'None'}`);
      });
    } else {
      console.log('\n⚠️  Table exists but has no data');
    }

    // Check RLS policies
    console.log('\n🔒 Checking if RLS allows anonymous access...');
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmVvd2l1amtienNuYXZrZnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzQwODQsImV4cCI6MjA3OTYxMDA4NH0.placeholder');
    
    const { data: anonData, error: anonError } = await anonClient
      .from('library_guides')
      .select('id, title')
      .limit(1);

    if (anonError) {
      console.log('❌ Anonymous access blocked:', anonError.message);
      console.log('   This means you need to add RLS policies or use authenticated access');
    } else {
      console.log('✅ Anonymous access works!');
    }

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkLibraryGuides();
