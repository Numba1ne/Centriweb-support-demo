/**
 * API Endpoint: Get Content Guides
 * 
 * Route: /api/content/guides?folderSlug=xxx
 * Method: GET
 * 
 * Returns guides from library_guides, optionally filtered by folder_slug
 * Sorting: folder_slug -> subcategory_label (Ascending, Nulls Last) -> order_index (Ascending)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folderSlug } = req.query;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Extract Authorization header from request to forward to Supabase (for RLS)
    const authHeader = req.headers.authorization || '';
    
    // Create client with user's token so RLS policies work
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Select only lightweight columns - exclude content_json and embedding
    let query = supabase
      .from('library_guides')
      .select('id, title, folder_slug, folder_label, subcategory_label, order_index, status, is_global, owner_agency_id')
      .eq('status', 'live')
      .order('folder_slug', { ascending: true })
      .order('order_index', { ascending: true });

    if (folderSlug && typeof folderSlug === 'string') {
      query = query.eq('folder_slug', folderSlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API] Error fetching guides:', error);
      return res.status(500).json({ error: 'Failed to fetch guides' });
    }

    if (!data) {
      return res.status(200).json([]);
    }

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

    return res.status(200).json(sorted);
  } catch (error: any) {
    console.error('[API] Error fetching guides:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
