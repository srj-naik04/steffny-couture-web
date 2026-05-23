-- =============================================================================
-- Migration: 20260521_0004_web_journal_views.sql
-- Purpose:   Create the `journal_views` table (anonymous view counter for blog
--            posts) and the `increment_view(slug)` RPC that clients call.
--            Direct table access is blocked for anon; only the RPC is callable.
--
-- Rollback notes:
--   DROP FUNCTION IF EXISTS public.increment_view(text) CASCADE;
--   DROP TABLE IF EXISTS public.journal_views CASCADE;
--
-- Dependencies: none (standalone table, no FK to shared tables)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.journal_views (
  slug           text        PRIMARY KEY,   -- matches MDX filename, e.g. 'bridal-alterations-timeline'
  views          int         NOT NULL DEFAULT 0,
  last_viewed_at timestamptz
);

ALTER TABLE public.journal_views ENABLE ROW LEVEL SECURITY;

-- RLS policies -----------------------------------------------------------------
-- No direct SELECT/INSERT/UPDATE for anon — access is exclusively via the RPC below.

-- Authenticated staff: read view counts
CREATE POLICY "staff read journal views"
  ON public.journal_views FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- RPC: increment_view(p_slug text)
-- Upserts the view counter atomically. Called from Next.js server actions or
-- route handlers (never directly from client-side code, to prevent manipulation).
-- SECURITY DEFINER so it can write to journal_views regardless of caller role.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_view(p_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF char_length(p_slug) < 1 OR char_length(p_slug) > 200 THEN
    RAISE EXCEPTION 'invalid slug';
  END IF;

  INSERT INTO public.journal_views (slug, views, last_viewed_at)
  VALUES (p_slug, 1, now())
  ON CONFLICT (slug)
  DO UPDATE SET
    views          = public.journal_views.views + 1,
    last_viewed_at = now();
END;
$$;

-- Only authenticated staff may call the RPC directly.
-- Web pages increment views via a server action using the admin client (Phase 7).
GRANT EXECUTE ON FUNCTION public.increment_view(text) TO authenticated;
