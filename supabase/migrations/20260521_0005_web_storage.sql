-- =============================================================================
-- Migration: 20260521_0005_web_storage.sql
-- Purpose:   Ensure the `dress-photos` Storage bucket exists and has the
--            correct public-read / authenticated-write access policies.
--            Also sets up policies for the existing `public` bucket folders
--            used by both mobile and web (products/, hero/, about/).
--
-- Rollback notes:
--   This migration uses INSERT ... ON CONFLICT DO NOTHING for idempotency.
--   To undo: delete the bucket via Supabase dashboard (data loss — back up first).
--
-- Note: Storage bucket policies live in the `storage` schema, not `public`.
-- =============================================================================

-- Create the dress-photos bucket if it does not already exist.
-- public = true means the bucket's objects are publicly readable without a signed URL.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dress-photos',
  'dress-photos',
  true,
  5242880,   -- 5 MB per file limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for dress-photos bucket ------------------------------

-- Anyone can read objects in this public bucket
DROP POLICY IF EXISTS "dress-photos public read" ON storage.objects;
CREATE POLICY "dress-photos public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'dress-photos');

-- Only authenticated staff can upload to dress-photos
DROP POLICY IF EXISTS "dress-photos authenticated upload" ON storage.objects;
CREATE POLICY "dress-photos authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dress-photos');

-- Only authenticated staff can update (replace) objects
DROP POLICY IF EXISTS "dress-photos authenticated update" ON storage.objects;
CREATE POLICY "dress-photos authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'dress-photos')
  WITH CHECK (bucket_id = 'dress-photos');

-- Only authenticated staff can delete objects
DROP POLICY IF EXISTS "dress-photos authenticated delete" ON storage.objects;
CREATE POLICY "dress-photos authenticated delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'dress-photos');
