/**
 * Check agencies table structure
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://msveowiujkbzsnavkfyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmVvd2l1amtienNuYXZrZnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAzNDA4NCwiZXhwIjoyMDc5NjEwMDg0fQ.i6ZkZ5CWeS_jWE8qFVIhj0eAR1vljIhht1MjqEH_GfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgencies() {
  console.log('🔍 Checking agencies table structure...\n');

  try {
    // Get sample data to see structure
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .limit(3);

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No data found in agencies table');
      console.log('   The table exists but is empty');
      return;
    }

    console.log(`✅ Found ${data.length} row(s) in agencies table\n`);
    console.log('📋 Table Structure (from sample data):');
    console.log('Columns:', Object.keys(data[0]));
    console.log('\n📊 Sample Data:');
    console.log(JSON.stringify(data[0], null, 2));

    // Check for other tables
    console.log('\n\n🔍 Checking for other tables...');
    
    const tablesToCheck = [
      'guides',
      'content',
      'articles',
      'knowledge_base',
      'kb_items',
      'help_articles',
      'support_articles'
    ];

    for (const table of tablesToCheck) {
      const { data: testData, error: testError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!testError && testData !== null) {
        console.log(`✅ Found table: ${table}`);
        if (testData.length > 0) {
          console.log(`   Columns: ${Object.keys(testData[0]).join(', ')}`);
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkAgencies();

