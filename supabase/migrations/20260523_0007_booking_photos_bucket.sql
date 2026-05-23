-- =============================================================================
-- Migration: 20260523_0007_booking_photos_bucket.sql
-- Purpose:   Create a `booking-photos` Storage bucket that allows anonymous
--            web visitors to upload garment photos when making a booking.
--
--            This is separate from `dress-photos` (staff-only writes) because
--            booking photos are customer-provided, low-trust content.
--
-- Security notes:
--   - Files are limited to 8 MB and image MIME types only
--   - Anonymous uploads go into `web-drafts/` prefix
--   - Authenticated staff can read all files for booking review
--   - A cleanup cron job (future Phase 7) will purge stale `web-drafts/` files
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-photos',
  'booking-photos',
  false,            -- private bucket: objects only readable via signed URLs
  8388608,          -- 8 MB per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- Authenticated staff can read any booking photo
DROP POLICY IF EXISTS "booking-photos staff read" ON storage.objects;
CREATE POLICY "booking-photos staff read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'booking-photos');

-- Anonymous web visitors may upload to the `web-drafts/` prefix only
DROP POLICY IF EXISTS "booking-photos anon upload" ON storage.objects;
CREATE POLICY "booking-photos anon upload"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'booking-photos'
    AND (storage.filename(name) IS NOT NULL)
    AND name LIKE 'web-drafts/%'
  );

-- Authenticated staff can manage all files
DROP POLICY IF EXISTS "booking-photos staff manage" ON storage.objects;
CREATE POLICY "booking-photos staff manage"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'booking-photos')
  WITH CHECK (bucket_id = 'booking-photos');
