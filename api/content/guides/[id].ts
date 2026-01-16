/**
 * API Endpoint: Get Single Guide by ID
 * 
 * Route: /api/content/guides/[id]
 * Method: GET
 * 
 * Returns a single guide from library_guides by ID
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Guide ID is required' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Extract Authorization header from request to forward to Supabase (for RLS)
    const authHeader = req.headers.authorization || '';
    
    // Debug: Log auth header
    console.log('[API/guides/[id]] Auth header present:', !!authHeader);
    if (!authHeader) {
      console.warn('[API/guides/[id]] ⚠️ NO AUTH HEADER - Request may fail RLS');
    }
    
    // Create client with user's token so RLS policies work
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Explicitly select all columns including content_json for single guide view
    const { data, error } = await supabase
      .from('library_guides')
      .select('*, content_json')
      .eq('id', id)
      .eq('status', 'live')
      .single();

    if (error) {
      console.error('[API] Error fetching guide:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Guide not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch guide' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('[API] Error fetching guide:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

