-- =============================================================================
-- Migration: 20260524_0008_revoke_increment_view_public.sql
-- Purpose:   Revoke EXECUTE on public.increment_view from PUBLIC so the anon
--            role cannot call the SECURITY DEFINER RPC directly via PostgREST.
--            The authenticated GRANT from migration 0004 remains in place; the
--            admin client (service_role) bypasses RLS so server-side view
--            tracking still works.
--
-- Rollback notes:
--   GRANT EXECUTE ON FUNCTION public.increment_view(text) TO PUBLIC;
--
-- Dependencies: 20260521_0004_web_journal_views.sql
-- Convention:   YYYYMMDD_NNNN_<description>.sql (D-016)
-- =============================================================================

REVOKE EXECUTE ON FUNCTION public.increment_view(text) FROM PUBLIC;
-- Authenticated GRANT is preserved by not touching it.
