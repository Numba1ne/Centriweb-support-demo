/**
 * API Endpoint: Authenticate GHL Session and Return Supabase JWT
 * 
 * Route: /api/auth/session?sessionKey=xxx or ?session_key=xxx
 * Method: GET
 * 
 * Flow:
 * 1. Extract and normalize sessionKey from query params
 * 2. Validate GHL session via API (or mock mode)
 * 3. JIT provision agency, location, and user in Supabase
 * 4. Mint Supabase-compatible JWT
 * 5. Return fat payload with token, user, agency, and location data
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { validateGhlSession } from '../../lib/ghl';
import { signSupabaseToken } from '../../lib/token';
import type { AuthSessionResponse, BrandingConfig, DashboardButton } from '../../types/auth';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Extract and normalize sessionKey
  const sessionKey = (req.query.sessionKey || req.query.session_key) as string;

  if (!sessionKey) {
    return res.status(401).json({ error: 'Invalid or missing sessionKey' });
  }

  // 2. Validate GHL session
  let ghlData;
  try {
    ghlData = await validateGhlSession(sessionKey);
  } catch (error: any) {
    console.error('[Auth] GHL validation failed:', error);
    return res.status(401).json({ error: 'GHL session invalid' });
  }

  // 3. Initialize Supabase client with service key for JIT provisioning
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Auth] Missing Supabase credentials');
    return res.status(500).json({ error: 'Internal error' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 4. JIT Provision Agency (upsert)
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', ghlData.companyId)
      .single();

    if (agencyError && agencyError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('[Auth] Agency lookup error:', agencyError);
      throw new Error('Failed to lookup agency');
    }

    if (!agency) {
      // Upsert agency (insert or update on conflict)
      const { error: upsertAgencyError } = await supabase
        .from('agencies')
        .upsert({
          id: ghlData.companyId,
          billing_status: 'active',
          branding_config: {},
          dashboard_buttons: [],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (upsertAgencyError) {
        console.error('[Auth] Agency upsert error:', upsertAgencyError);
        throw new Error('Failed to create/update agency');
      }
    }

    // Retrieve agency (after potential insert)
    const { data: finalAgency } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', ghlData.companyId)
      .single();

    if (!finalAgency) {
      throw new Error('Failed to retrieve agency data');
    }

    // 5. JIT Provision Location (if activeLocation is not null)
    let locationData = null;
    if (ghlData.activeLocation) {
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .eq('id', ghlData.activeLocation)
        .single();

      if (locationError && locationError.code !== 'PGRST116') {
        console.error('[Auth] Location lookup error:', locationError);
        throw new Error('Failed to lookup location');
      }

      if (!location) {
        // Upsert location (insert or update on conflict)
        const { error: upsertLocationError } = await supabase
          .from('locations')
          .upsert({
            id: ghlData.activeLocation,
            agency_id: ghlData.companyId,
            name: null,
            is_active: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
          });

        if (upsertLocationError) {
          console.error('[Auth] Location upsert error:', upsertLocationError);
          throw new Error('Failed to create/update location');
        }
      }

      // Retrieve location (after potential insert)
      const { data: finalLocation } = await supabase
        .from('locations')
        .select('*')
        .eq('id', ghlData.activeLocation)
        .single();

      locationData = finalLocation;
    }

    // 6. JIT Provision User (only if activeLocation is not null)
    // Note: users.location_id is NOT NULL, so skip if no activeLocation
    if (ghlData.activeLocation) {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', ghlData.userId)
        .single();

      if (!user) {
        // Insert new user
        const { error: insertUserError } = await supabase
          .from('users')
          .insert({
            id: ghlData.userId,
            agency_id: ghlData.companyId,
            location_id: ghlData.activeLocation,
            name: ghlData.name || null,
            email: ghlData.email || null,
            role: ghlData.role,
          });

        if (insertUserError) {
          console.error('[Auth] User insert error:', insertUserError);
          // Don't throw - user creation is not critical for session
        }
      } else {
        // Update user if exists
        const { error: updateUserError } = await supabase
          .from('users')
          .update({
            name: ghlData.name || null,
            email: ghlData.email || null,
            role: ghlData.role,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ghlData.userId);

        if (updateUserError) {
          console.error('[Auth] User update error:', updateUserError);
          // Don't throw - update is not critical
        }
      }
    }

    // 7. Mint JWT
    const token = signSupabaseToken({
      sub: ghlData.userId,
      agency_id: ghlData.companyId,
      location_id: ghlData.activeLocation,
      role: 'authenticated',
      app_role: ghlData.role,
      email: ghlData.email,
      name: ghlData.name,
    });

    // 8. Build and return response
    const response: AuthSessionResponse = {
      supabaseAccessToken: token,
      user: {
        id: ghlData.userId,
        name: ghlData.name || null,
        email: ghlData.email || null,
        app_role: ghlData.role,
      },
      agency: {
        id: finalAgency.id,
        name: finalAgency.name || null,
        branding_config: (finalAgency.branding_config as BrandingConfig) || {},
        dashboard_buttons: (finalAgency.dashboard_buttons as DashboardButton[]) || [],
        billing_status: finalAgency.billing_status || 'active',
      },
      location: locationData ? {
        id: locationData.id,
        name: locationData.name || null,
      } : null,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('[Auth] Internal error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}

