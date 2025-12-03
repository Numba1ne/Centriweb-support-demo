/**
 * Guide Content Types
 * Matching the Supabase library_guides table schema
 */

export type GuideStatus = 'live' | 'draft' | 'archived';

/**
 * Content block structure for content_json
 * Represents a block of content (text, heading, image, etc.)
 */
export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'list' | 'code' | 'quote';
  content: string;
  level?: number; // For headings (1-6)
  items?: string[]; // For lists
  alt?: string; // For images
  src?: string; // For images
}

/**
 * Guide from library_guides table
 */
export interface LibraryGuide {
  id: string; // uuid
  notion_page_id: string | null;
  title: string;
  folder_slug: string; // Category ID
  folder_label: string; // Category display name
  subcategory_label: string | null;
  order_index: number;
  content_json: ContentBlock[]; // JSONB array of blocks
  status: GuideStatus;
  is_global: boolean;
  owner_agency_id: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Category (derived from distinct folder_slug/folder_label)
 */
export interface GuideCategory {
  folder_slug: string;
  folder_label: string;
  iconName?: string; // Optional, for UI
  description?: string; // Optional, for UI
}

/**
 * Guide with parsed content for frontend display
 */
export interface GuideDisplay extends Omit<LibraryGuide, 'content_json'> {
  // Flatten content_json to markdown string for compatibility
  content: string;
  // Additional frontend fields
  summary?: string;
  tags?: string[];
  timeToRead?: string;
  videoUrl?: string;
}

