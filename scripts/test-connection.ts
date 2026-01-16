/**
 * Comprehensive Supabase Diagnostics
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://msveowiujkbzsnavkfyz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || '';

async function runDiagnostics() {
  const results: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    results.push(msg);
  };

  log('='.repeat(60));
  log('SUPABASE CONNECTION DIAGNOSTICS');
  log('='.repeat(60));
  log('');

  // Test 1: Service Role Connection
  log('TEST 1: Service Role Connection');
  log('-'.repeat(60));
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error, count } = await serviceClient
      .from('library_guides')
      .select('*', { count: 'exact', head: false })
      .limit(3);

    if (error) {
      log(`❌ ERROR: ${error.message}`);
      log(`   Code: ${error.code}`);
    } else {
      log(`✅ SUCCESS: Connected with service role`);
      log(`   Total guides in database: ${count}`);
      
      if (data && data.length > 0) {
        log(`\n   Sample guides:`);
        data.forEach((guide: any, idx: number) => {
          log(`   ${idx + 1}. "${guide.title}"`);
          log(`      - ID: ${guide.id}`);
          log(`      - Folder: ${guide.folder_label} (${guide.folder_slug})`);
          log(`      - Status: ${guide.status}`);
          log(`      - Subcategory: ${guide.subcategory_label || 'None'}`);
        });
      }
    }
  } catch (e: any) {
    log(`❌ EXCEPTION: ${e.message}`);
  }

  log('');
  log('TEST 2: Anonymous (Anon Key) Connection');
  log('-'.repeat(60));
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error, count } = await anonClient
      .from('library_guides')
      .select('*', { count: 'exact', head: false })
      .eq('status', 'live')
      .limit(3);

    if (error) {
      log(`❌ ERROR: ${error.message}`);
      log(`   Code: ${error.code}`);
      log(`   Details: ${JSON.stringify(error.details)}`);
      log(`\n   ⚠️  This means Row Level Security (RLS) is blocking anonymous access`);
      log(`   ⚠️  Your Vercel deployment will fail without proper RLS policies`);
    } else {
      log(`✅ SUCCESS: Anonymous access works!`);
      log(`   Total live guides accessible: ${count}`);
      
      if (data && data.length > 0) {
        log(`\n   Sample guides (anonymous can see):`);
        data.forEach((guide: any, idx: number) => {
          log(`   ${idx + 1}. "${guide.title}"`);
        });
      } else {
        log(`\n   ⚠️  No guides with status='live' found`);
      }
    }
  } catch (e: any) {
    log(`❌ EXCEPTION: ${e.message}`);
  }

  log('');
  log('TEST 3: Categories Fetch (Anonymous)');
  log('-'.repeat(60));
  
  try {
    const { data, error } = await anonClient
      .from('library_guides')
      .select('folder_slug, folder_label')
      .eq('status', 'live');

    if (error) {
      log(`❌ ERROR: ${error.message}`);
    } else {
      const categoryMap = new Map();
      data?.forEach((guide: any) => {
        if (!categoryMap.has(guide.folder_slug)) {
          categoryMap.set(guide.folder_slug, guide.folder_label);
        }
      });
      
      log(`✅ SUCCESS: Found ${categoryMap.size} categories`);
      categoryMap.forEach((label, slug) => {
        log(`   - ${label} (${slug})`);
      });
    }
  } catch (e: any) {
    log(`❌ EXCEPTION: ${e.message}`);
  }

  log('');
  log('='.repeat(60));
  log('SUMMARY');
  log('='.repeat(60));
  log(`Supabase URL: ${supabaseUrl}`);
  log(`Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);
  log('');

  // Save to file
  const reportPath = 'supabase-diagnostics.txt';
  writeFileSync(reportPath, results.join('\n'));
  log(`\n📄 Full report saved to: ${reportPath}`);
}

runDiagnostics().catch(console.error);
