-- =============================================================================
-- Migration: 20260523_0006_web_bookings_rls.sql
-- Purpose:   Allow anonymous web visitors to insert booking rows into the
--            shared `bookings` table (owned by the mobile app).
--
--            The `bookings` table and its RLS policy skeleton were created by
--            the mobile app migrations. This migration adds the policy that
--            permits the web's anon key to insert rows where source = 'web'
--            and status = 'new'.
--
--            If the mobile app's 007_guest_access.sql already added this policy,
--            this migration is a no-op (DROP IF EXISTS + re-CREATE is safe).
--
-- Coordinate: do NOT run before the mobile app's initial migration creates
--             the bookings table.
-- =============================================================================

-- Allow web visitors (anon role) to create booking requests.
-- Constraints ensure only safe defaults are accepted.
DROP POLICY IF EXISTS "anon can insert web bookings" ON public.bookings;
CREATE POLICY "anon can insert web bookings"
  ON public.bookings FOR INSERT
  TO anon
  WITH CHECK (
    source = 'web'
    AND status = 'new'
    AND user_id IS NULL
  );
