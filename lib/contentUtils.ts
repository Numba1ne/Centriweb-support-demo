/**
 * Content Utilities
 * Helper functions for working with guide content
 */

import type { ContentBlock } from '../types/guides';

/**
 * Convert content_json blocks to markdown string
 */
export function blocksToMarkdown(blocks: ContentBlock[]): string {
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

