/**
 * Supabase Client Configuration
 * Supports both anonymous access and authenticated access with custom JWT
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Default client (anonymous access)
let defaultClient: SupabaseClient | null = null;

/**
 * Get or create the default Supabase client (anonymous access)
 */
export function getSupabaseClient(): SupabaseClient {
  if (!defaultClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    defaultClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return defaultClient;
}

/**
 * Create an authenticated Supabase client with a custom access token
 * 
 * @param accessToken - The JWT token from /api/auth/session
 * @returns Authenticated Supabase client
 */
export function createAuthenticatedClient(accessToken: string): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * Update the default client with a new access token
 * This allows switching from anonymous to authenticated mode
 * 
 * @param accessToken - The JWT token from /api/auth/session
 */
export function setSupabaseAccessToken(accessToken: string): void {
  defaultClient = createAuthenticatedClient(accessToken);
}

