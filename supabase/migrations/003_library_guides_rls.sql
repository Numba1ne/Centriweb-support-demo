-- =====================================================================================
-- Migration: Add RLS Policies for library_guides table
--
-- This migration adds proper Row Level Security policies for the library_guides table
-- to allow authenticated users to read guides based on:
-- 1. Global guides (is_global = true) - visible to all authenticated users
-- 2. Agency-specific guides - visible only to users from that agency
-- =====================================================================================

-- Drop existing policies if any (to allow re-running this migration)
DROP POLICY IF EXISTS "Allow reading live guides" ON public.library_guides;
DROP POLICY IF EXISTS "Allow reading global guides" ON public.library_guides;
DROP POLICY IF EXISTS "Allow reading agency guides" ON public.library_guides;
DROP POLICY IF EXISTS "Guides visible to authenticated users" ON public.library_guides;

-- =====================================================================================
-- Option 1: Simple policy - Allow all authenticated users to read live guides
-- This is the recommended approach for public knowledge bases
-- =====================================================================================

CREATE POLICY "Allow reading live guides"
  ON public.library_guides
  FOR SELECT
  USING (status = 'live');

-- =====================================================================================
-- Option 2: Agency-based access control (comment out Option 1 and uncomment below)
-- This restricts guides to global OR agency-owned content
--
-- Requires JWT to contain 'agency_id' claim
-- =====================================================================================

-- CREATE POLICY "Guides visible to authenticated users"
--   ON public.library_guides
--   FOR SELECT
--   USING (
--     status = 'live'
--     AND (
--       is_global = true
--       OR owner_agency_id IS NULL
--       OR owner_agency_id = (
--         COALESCE(
--           current_setting('request.jwt.claims', true)::json ->> 'agency_id',
--           auth.jwt() ->> 'agency_id'
--         )
--       )
--     )
--   );

-- =====================================================================================
-- Grant necessary permissions to authenticated and anon roles
-- =====================================================================================

-- Ensure anon and authenticated roles can select from the table
GRANT SELECT ON public.library_guides TO anon;
GRANT SELECT ON public.library_guides TO authenticated;

-- =====================================================================================
-- Verification query (run this to check if policies are applied correctly)
-- =====================================================================================
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual
-- FROM pg_policies
-- WHERE tablename = 'library_guides';
