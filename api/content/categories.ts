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
// Use service role key for server-side operations to bypass RLS when needed
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API/categories] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Extract Authorization header from request
    const authHeader = req.headers.authorization || '';

    console.log('[API/categories] Request received');
    console.log('[API/categories] Auth header present:', !!authHeader);

    // If we have a service role key, use it to bypass RLS for public content
    const useServiceRole = !!supabaseServiceKey;

    let supabase;
    if (useServiceRole) {
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      console.log('[API/categories] Using service role key (bypassing RLS)');
    } else {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      });
      console.log('[API/categories] Using anon key with auth header');
    }

    // Fetch distinct categories from live guides
    const { data, error } = await supabase
      .from('library_guides')
      .select('folder_slug, folder_label')
      .eq('status', 'live')
      .order('folder_label', { ascending: true });

    if (error) {
      console.error('[API/categories] Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    console.log('[API/categories] Query returned', data?.length || 0, 'rows');

    // Get distinct categories
    const categoryMap = new Map<string, { folder_slug: string; folder_label: string }>();
    (data || []).forEach(guide => {
      if (!categoryMap.has(guide.folder_slug)) {
        categoryMap.set(guide.folder_slug, {
          folder_slug: guide.folder_slug,
          folder_label: guide.folder_label,
        });
      }
    });

    const categories = Array.from(categoryMap.values());
    console.log('[API/categories] Returning', categories.length, 'unique categories');

    return res.status(200).json(categories);
  } catch (error: any) {
    console.error('[API/categories] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
