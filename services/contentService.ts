/**
 * Content Service
 * Fetches guides and categories from Supabase library_guides table
 */

import { getSupabaseClient } from '../lib/supabaseClient';
import type { LibraryGuide, GuideCategory, GuideDisplay, ContentBlock } from '../types/guides';

/**
 * Convert content_json blocks to markdown string
 */
function blocksToMarkdown(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return '';
  
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        const level = block.level || 1;
        return `${'#'.repeat(level)} ${block.content}`;
      case 'paragraph':
        return block.content;
      case 'list':
        return block.items?.map(item => `- ${item}`).join('\n') || '';
      case 'code':
        return `\`\`\`\n${block.content}\n\`\`\``;
      case 'quote':
        return `> ${block.content}`;
      case 'image':
        return `![${block.alt || ''}](${block.src || ''})`;
      default:
        return block.content;
    }
  }).join('\n\n');
}

/**
 * Fetch all distinct categories from live guides
 */
export async function fetchCategories(): Promise<GuideCategory[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('library_guides')
    .select('folder_slug, folder_label')
    .eq('status', 'live')
    .order('folder_label', { ascending: true });

  if (error) {
    console.error('[ContentService] Error fetching categories:', error);
    return [];
  }

  // Get distinct categories
  const categoryMap = new Map<string, GuideCategory>();
  data.forEach(guide => {
    if (!categoryMap.has(guide.folder_slug)) {
      categoryMap.set(guide.folder_slug, {
        folder_slug: guide.folder_slug,
        folder_label: guide.folder_label,
      });
    }
  });

  return Array.from(categoryMap.values());
}

/**
 * Fetch guides, optionally filtered by folder_slug
 * 
 * Sorting: folder_slug -> subcategory_label (Ascending, Nulls Last) -> order_index (Ascending)
 */
export async function fetchGuides(folderSlug?: string): Promise<GuideDisplay[]> {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('library_guides')
    .select('*')
    .eq('status', 'live')
    .order('folder_slug', { ascending: true })
    .order('order_index', { ascending: true });

  if (folderSlug) {
    query = query.eq('folder_slug', folderSlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[ContentService] Error fetching guides:', error);
    return [];
  }

  if (!data) return [];

  // Sort by subcategory_label (nulls last), then order_index
  const sorted = [...data].sort((a, b) => {
    // First by subcategory_label (nulls last)
    if (a.subcategory_label === null && b.subcategory_label !== null) return 1;
    if (a.subcategory_label !== null && b.subcategory_label === null) return -1;
    if (a.subcategory_label !== null && b.subcategory_label !== null) {
      const subcatCompare = a.subcategory_label.localeCompare(b.subcategory_label);
      if (subcatCompare !== 0) return subcatCompare;
    }
    // Then by order_index
    return a.order_index - b.order_index;
  });

  // Convert to GuideDisplay format
  return sorted.map(guide => ({
    ...guide,
    content: blocksToMarkdown(guide.content_json as ContentBlock[]),
    // Extract summary from first paragraph if available
    summary: guide.content_json && Array.isArray(guide.content_json) && guide.content_json.length > 0
      ? (guide.content_json[0] as ContentBlock).content.substring(0, 150) + '...'
      : undefined,
  }));
}

/**
 * Fetch a single guide by ID
 */
export async function fetchGuideById(id: string): Promise<GuideDisplay | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('library_guides')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .single();

  if (error || !data) {
    console.error('[ContentService] Error fetching guide:', error);
    return null;
  }

  return {
    ...data,
    content: blocksToMarkdown(data.content_json as ContentBlock[]),
    summary: data.content_json && Array.isArray(data.content_json) && data.content_json.length > 0
      ? (data.content_json[0] as ContentBlock).content.substring(0, 150) + '...'
      : undefined,
  };
}

/**
 * Fetch guides grouped by subcategory within a folder
 */
export async function fetchGuidesGroupedBySubcategory(folderSlug: string): Promise<Map<string | null, GuideDisplay[]>> {
  const guides = await fetchGuides(folderSlug);
  const grouped = new Map<string | null, GuideDisplay[]>();
  
  guides.forEach(guide => {
    const subcat = guide.subcategory_label || null;
    if (!grouped.has(subcat)) {
      grouped.set(subcat, []);
    }
    grouped.get(subcat)!.push(guide);
  });
  
  return grouped;
}

