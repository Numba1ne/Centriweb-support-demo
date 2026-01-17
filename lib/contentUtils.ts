/**
 * Content Utilities
 * Helper functions for working with guide content
 */

import type { ContentBlock } from '../types/guides';

/**
 * Convert content_json blocks to markdown string
 */
export function blocksToMarkdown(blocks: ContentBlock[] | null | undefined): string {
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
 * Group guides by subcategory
 */
export function groupGuidesBySubcategory<T extends { subcategory_label: string | null }>(
  guides: T[]
): Map<string | null, T[]> {
  const grouped = new Map<string | null, T[]>();
  
  guides.forEach(guide => {
    const subcat = guide.subcategory_label || null;
    if (!grouped.has(subcat)) {
      grouped.set(subcat, []);
    }
    grouped.get(subcat)!.push(guide);
  });
  
  return grouped;
}

