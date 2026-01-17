/**
 * Content Service
 * Fetches guides and categories from Supabase library_guides table
 */

import { getSupabaseClient } from '../lib/supabaseClient';
import type { LibraryGuide, GuideCategory, GuideDisplay, ContentBlock } from '../types/guides';

/**
 * Convert content_json blocks to markdown string
 */
function blocksToMarkdown(blocks: ContentBlock[] | null | undefined): string {
  // Validate that blocks is an array
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return '';
  }
  
  return blocks.map(block => {
    // Handle HTML format from Supabase (type: 'text' with content_html)
    if (block.type === 'text' && block.content_html) {
      // Convert HTML to markdown-like format for ReactMarkdown
      // Simple HTML to markdown conversion
      let html = block.content_html;
      
      // Convert headings
      html = html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
      html = html.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
      html = html.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
      html = html.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
      html = html.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
      html = html.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');
      
      // Convert paragraphs
      html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n');
      
      // Convert lists
      html = html.replace(/<ul[^>]*>/gi, '');
      html = html.replace(/<\/ul>/gi, '\n');
      html = html.replace(/<ol[^>]*>/gi, '');
      html = html.replace(/<\/ol>/gi, '\n');
      html = html.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
      
      // Convert strong/bold
      html = html.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
      html = html.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
      
      // Convert emphasis/italic
      html = html.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
      html = html.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
      
      // Convert links
      html = html.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
      
      // Convert images
      html = html.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi, '![$1]($2)');
      html = html.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)');
      
      // Convert line breaks
      html = html.replace(/<br[^>]*\/?>/gi, '\n');
      
      // Remove remaining HTML tags
      html = html.replace(/<[^>]+>/g, '');
      
      // Decode HTML entities
      html = html
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      return html.trim();
    }
    
    // Handle standard format
    switch (block.type) {
      case 'heading':
        const level = block.level || 1;
        return `${'#'.repeat(level)} ${block.content || ''}`;
      case 'paragraph':
        return block.content || '';
      case 'list':
        return block.items?.map(item => `- ${item}`).join('\n') || '';
      case 'code':
        return `\`\`\`\n${block.content || ''}\n\`\`\``;
      case 'quote':
        return `> ${block.content || ''}`;
      case 'image':
        return `![${block.alt || ''}](${block.src || ''})`;
      case 'table':
        // Tables should be stored as markdown table syntax in content
        return block.content || '';
      default:
        return block.content || '';
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
  return sorted.map(guide => {
    // Handle content_json - it might be an object with guide_blocks key, or a direct array
    let contentBlocks: ContentBlock[] | null = null;
    
    if (guide.content_json) {
      if (Array.isArray(guide.content_json)) {
        // Direct array format
        contentBlocks = guide.content_json as ContentBlock[];
      } else if (typeof guide.content_json === 'object' && 'guide_blocks' in guide.content_json) {
        // Object with guide_blocks key
        const blocks = (guide.content_json as any).guide_blocks;
        if (Array.isArray(blocks)) {
          contentBlocks = blocks as ContentBlock[];
        }
      } else if (typeof guide.content_json === 'string') {
        // String format - try to parse
        try {
          const parsed = JSON.parse(guide.content_json);
          if (Array.isArray(parsed)) {
            contentBlocks = parsed as ContentBlock[];
          } else if (parsed && typeof parsed === 'object' && 'guide_blocks' in parsed) {
            contentBlocks = Array.isArray(parsed.guide_blocks) ? parsed.guide_blocks as ContentBlock[] : null;
          }
        } catch (e) {
          console.warn('[ContentService] Failed to parse content_json string:', e);
        }
      }
    }
    
    // Extract summary from first block
    let summary: string | undefined = undefined;
    if (contentBlocks && contentBlocks.length > 0) {
      const firstBlock = contentBlocks[0];
      if (firstBlock.content_html) {
        // Extract text from HTML for summary
        const text = firstBlock.content_html.replace(/<[^>]+>/g, '').trim();
        summary = text.substring(0, 150) + (text.length > 150 ? '...' : '');
      } else if (firstBlock.content) {
        summary = firstBlock.content.substring(0, 150) + (firstBlock.content.length > 150 ? '...' : '');
      }
    }
    
    return {
      ...guide,
      content: blocksToMarkdown(contentBlocks),
      summary,
    };
  });
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

  // Handle content_json - it might be an object with guide_blocks key, or a direct array
  let contentBlocks: ContentBlock[] | null = null;
  
  if (data.content_json) {
    if (Array.isArray(data.content_json)) {
      // Direct array format
      contentBlocks = data.content_json as ContentBlock[];
    } else if (typeof data.content_json === 'object' && 'guide_blocks' in data.content_json) {
      // Object with guide_blocks key
      const blocks = (data.content_json as any).guide_blocks;
      if (Array.isArray(blocks)) {
        contentBlocks = blocks as ContentBlock[];
      }
    } else if (typeof data.content_json === 'string') {
      // String format - try to parse
      try {
        const parsed = JSON.parse(data.content_json);
        if (Array.isArray(parsed)) {
          contentBlocks = parsed as ContentBlock[];
        } else if (parsed && typeof parsed === 'object' && 'guide_blocks' in parsed) {
          contentBlocks = Array.isArray(parsed.guide_blocks) ? parsed.guide_blocks as ContentBlock[] : null;
        }
      } catch (e) {
        console.warn('[ContentService] Failed to parse content_json string:', e);
      }
    }
  }

  // Extract summary from first block
  let summary: string | undefined = undefined;
  if (contentBlocks && contentBlocks.length > 0) {
    const firstBlock = contentBlocks[0];
    if (firstBlock.content_html) {
      // Extract text from HTML for summary
      const text = firstBlock.content_html.replace(/<[^>]+>/g, '').trim();
      summary = text.substring(0, 150) + (text.length > 150 ? '...' : '');
    } else if (firstBlock.content) {
      summary = firstBlock.content.substring(0, 150) + (firstBlock.content.length > 150 ? '...' : '');
    }
  }

  return {
    ...data,
    content: blocksToMarkdown(contentBlocks),
    summary,
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

