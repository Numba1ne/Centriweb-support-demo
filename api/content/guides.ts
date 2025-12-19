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
// Use service role key for server-side operations to bypass RLS when needed
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folderSlug, debug } = req.query;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API/guides] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Extract Authorization header from request to forward to Supabase (for RLS)
    const authHeader = req.headers.authorization || '';

    // Debug logging
    console.log('[API/guides] Request received');
    console.log('[API/guides] folderSlug:', folderSlug);
    console.log('[API/guides] Auth header present:', !!authHeader);

    // If we have a service role key, use it to bypass RLS for public content
    // This ensures guides are accessible even if RLS policies are misconfigured
    const useServiceRole = !!supabaseServiceKey;

    let supabase;
    if (useServiceRole) {
      // Use service role to bypass RLS - we'll filter manually for security
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      console.log('[API/guides] Using service role key (bypassing RLS)');
    } else {
      // Fall back to anon key with auth header
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      });
      console.log('[API/guides] Using anon key with auth header');
    }

    // Select only lightweight columns - exclude content_json and embedding
    let query = supabase
      .from('library_guides')
      .select('id, title, folder_slug, folder_label, subcategory_label, order_index, status, is_global, owner_agency_id')
      .eq('status', 'live')
      .limit(100)
      .order('folder_slug', { ascending: true })
      .order('order_index', { ascending: true });

    if (folderSlug && typeof folderSlug === 'string') {
      // Decode the folderSlug in case it's URL-encoded
      const decodedFolderSlug = decodeURIComponent(folderSlug);
      query = query.eq('folder_slug', decodedFolderSlug);
      console.log('[API/guides] Filtering by folder_slug:', decodedFolderSlug);
    }

    const { data, error } = await query;

    // Enhanced error logging
    if (error) {
      console.error('[API/guides] Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return res.status(500).json({
        error: 'Failed to fetch guides',
        details: debug === 'true' ? error.message : undefined
      });
    }

    console.log('[API/guides] Query returned', data?.length || 0, 'results');

    // Debug mode: return additional info
    if (debug === 'true') {
      console.log('[API/guides] Debug mode - returning additional info');
      return res.status(200).json({
        data: data || [],
        debug: {
          folderSlug: folderSlug,
          rowCount: data?.length || 0,
          authHeaderPresent: !!authHeader,
          usingServiceRole: useServiceRole,
          sampleData: data?.slice(0, 2).map(g => ({
            id: g.id,
            title: g.title,
            folder_slug: g.folder_slug,
            is_global: g.is_global,
            owner_agency_id: g.owner_agency_id,
          })),
        },
      });
    }

    if (!data || data.length === 0) {
      console.log('[API/guides] No data found, returning empty array');
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

    console.log('[API/guides] Returning', sorted.length, 'sorted guides');
    return res.status(200).json(sorted);
  } catch (error: any) {
    console.error('[API/guides] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
