/**
 * JWT Token Signing Utility
 * Creates Supabase-compatible JWTs for authentication
 */

import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string; // user id (used by RLS for user-scoped tables)
  agency_id: string; // used by RLS for agency-scoped data
  location_id: string | null; // may be null when in agency-level view
  role: 'authenticated'; // REQUIRED by Supabase
  app_role: 'admin' | 'user'; // "admin" | "user"
  email?: string;
  name?: string;
}

/**
 * Sign a JWT token compatible with Supabase
 * 
 * @param payload - The JWT payload claims
 * @returns Signed JWT token
 */
export function signSupabaseToken(payload: JwtPayload): string {
  const secret = process.env.SUPABASE_JWT_SECRET;
  
  if (!secret) {
    throw new Error('SUPABASE_JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '24h',
  });
}

