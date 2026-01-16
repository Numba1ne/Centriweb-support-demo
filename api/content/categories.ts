/**
* API Endpoint: Get Content Categories
 * 
 * Route: /api/content/categories
 * Method: GET
 * 
 * Returns distinct categories (folder_slug, folder_label) from library_guides
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Extract Authorization header from request to forward to Supabase (for RLS)
    const authHeader = req.headers.authorization || '';
    
    // Debug: Log auth header
    console.log('[API/categories] Auth header present:', !!authHeader);
    if (!authHeader) {
      console.warn('[API/categories] ⚠️ NO AUTH HEADER - Request may fail RLS');
    }
    
    // Create client with user's token so RLS policies work
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Fetch distinct categories from live guides
    const { data, error } = await supabase
      .from('library_guides')
      .select('folder_slug, folder_label')
      .eq('status', 'live')
      .order('folder_label', { ascending: true });

    if (error) {
      console.error('[API] Error fetching categories:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    // Get distinct categories
    const categoryMap = new Map<string, { folder_slug: string; folder_label: string }>();
    data.forEach(guide => {
      if (!categoryMap.has(guide.folder_slug)) {
        categoryMap.set(guide.folder_slug, {
          folder_slug: guide.folder_slug,
          folder_label: guide.folder_label,
        });
      }
    });

    const categories = Array.from(categoryMap.values());

    return res.status(200).json(categories);
  } catch (error: any) {
    console.error('[API] Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
