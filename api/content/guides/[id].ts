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
// Use service role key for server-side operations to bypass RLS when needed
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Guide ID is required' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API/guides/[id]] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Extract Authorization header from request
    const authHeader = req.headers.authorization || '';

    console.log('[API/guides/[id]] Request for guide:', id);
    console.log('[API/guides/[id]] Auth header present:', !!authHeader);

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
      console.log('[API/guides/[id]] Using service role key (bypassing RLS)');
    } else {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      });
      console.log('[API/guides/[id]] Using anon key with auth header');
    }

    // Explicitly select all columns including content_json for single guide view
    const { data, error } = await supabase
      .from('library_guides')
      .select('*, content_json')
      .eq('id', id)
      .eq('status', 'live')
      .single();

    if (error) {
      console.error('[API/guides/[id]] Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Guide not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch guide' });
    }

    if (!data) {
      console.log('[API/guides/[id]] No data found for id:', id);
      return res.status(404).json({ error: 'Guide not found' });
    }

    console.log('[API/guides/[id]] Found guide:', data.title);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('[API/guides/[id]] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

