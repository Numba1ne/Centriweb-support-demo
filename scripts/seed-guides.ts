/**
 * Seed Guides Script
 * Migrates static GUIDE_DATA from data/guides.ts to Supabase library_guides table
 * 
 * Usage: 
 *   npx tsx scripts/seed-guides.ts
 * 
 * Requires environment variables:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { GUIDE_DATA } from '../data/guides';
import type { GuideArea, Guide } from '../types';
import type { ContentBlock } from '../types/guides';

// Parse markdown content into content_json blocks
function markdownToBlocks(markdown: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = markdown.split('\n');
  let currentParagraph: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Empty line - flush current paragraph
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        blocks.push({
          type: 'paragraph',
          content: currentParagraph.join('\n'),
        });
        currentParagraph = [];
      }
      continue;
    }
    
    // Heading
    if (trimmed.startsWith('#')) {
      // Flush current paragraph first
      if (currentParagraph.length > 0) {
        blocks.push({
          type: 'paragraph',
          content: currentParagraph.join('\n'),
        });
        currentParagraph = [];
      }
      
      const match = trimmed.match(/^(#+)\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const content = match[2];
        blocks.push({
          type: 'heading',
          content,
          level: Math.min(level, 6),
        });
      }
      continue;
    }
    
    // List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Flush current paragraph first
      if (currentParagraph.length > 0) {
        blocks.push({
          type: 'paragraph',
          content: currentParagraph.join('\n'),
        });
        currentParagraph = [];
      }
      
      // Collect consecutive list items
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().substring(2));
        i++;
      }
      i--; // Back up one line
      
      blocks.push({
        type: 'list',
        items: listItems,
      });
      continue;
    }
    
    // Code block
    if (trimmed.startsWith('```')) {
      // Flush current paragraph first
      if (currentParagraph.length > 0) {
        blocks.push({
          type: 'paragraph',
          content: currentParagraph.join('\n'),
        });
        currentParagraph = [];
      }
      
      // Collect code block
      const codeLines: string[] = [];
      i++; // Skip opening ```
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      blocks.push({
        type: 'code',
        content: codeLines.join('\n'),
      });
      continue;
    }
    
    // Blockquote
    if (trimmed.startsWith('> ')) {
      // Flush current paragraph first
      if (currentParagraph.length > 0) {
        blocks.push({
          type: 'paragraph',
          content: currentParagraph.join('\n'),
        });
        currentParagraph = [];
      }
      
      blocks.push({
        type: 'quote',
        content: trimmed.substring(2),
      });
      continue;
    }
    
    // Regular paragraph line
    currentParagraph.push(line);
  }
  
  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    blocks.push({
      type: 'paragraph',
      content: currentParagraph.join('\n'),
    });
  }
  
  return blocks.length > 0 ? blocks : [{ type: 'paragraph', content: markdown }];
}

async function seedGuides() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('🌱 Starting guide seed...\n');
  
  const guidesToInsert: any[] = [];
  
  // Process each GuideArea
  GUIDE_DATA.forEach((area: GuideArea, areaIndex: number) => {
    console.log(`📁 Processing category: ${area.title} (${area.guides.length} guides)`);
    
    area.guides.forEach((guide: Guide, guideIndex: number) => {
      // Convert markdown content to blocks
      const contentBlocks = markdownToBlocks(guide.content);
      
      // Create guide record
      const guideRecord = {
        id: randomUUID(),
        notion_page_id: null,
        title: guide.title,
        folder_slug: area.id,
        folder_label: area.title,
        subcategory_label: null, // No subcategories in current structure
        order_index: guideIndex,
        content_json: contentBlocks,
        status: 'live' as const,
        is_global: true,
        owner_agency_id: null,
      };
      
      guidesToInsert.push(guideRecord);
      console.log(`  ✓ ${guide.title}`);
    });
  });
  
  console.log(`\n📊 Total guides to insert: ${guidesToInsert.length}\n`);
  
  // Insert guides in batches (Supabase has a limit)
  const batchSize = 50;
  let inserted = 0;
  let errors = 0;
  
  for (let i = 0; i < guidesToInsert.length; i += batchSize) {
    const batch = guidesToInsert.slice(i, i + batchSize);
    
    console.log(`📦 Inserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} guides)...`);
    
    const { data, error } = await supabase
      .from('library_guides')
      .insert(batch)
      .select('id');
    
    if (error) {
      console.error(`❌ Error inserting batch:`, error);
      errors += batch.length;
    } else {
      inserted += data?.length || 0;
      console.log(`  ✓ Inserted ${data?.length || 0} guides`);
    }
  }
  
  console.log(`\n✅ Seed complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Errors: ${errors}`);
  
  if (errors > 0) {
    console.log(`\n⚠️  Some guides failed to insert. Check the errors above.`);
    process.exit(1);
  }
}

// Run the seed
seedGuides().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

