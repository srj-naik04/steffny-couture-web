-- =============================================================================
-- Migration: 20260521_0003_web_reviews.sql
-- Purpose:   Create the `reviews` table — customer testimonials submitted via
--            the website. All submissions land as unpublished; Steffi moderates
--            via the mobile app before they appear publicly.
--
-- Rollback notes:
--   DROP TABLE IF EXISTS public.reviews CASCADE;
--
-- Dependencies: none (standalone table)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name     text        NOT NULL,
  author_location text,                          -- e.g. 'Hounslow, London'
  rating          int         NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title           text,
  body            text        NOT NULL,
  occasion        text,                          -- e.g. 'wedding alterations'
  published       boolean     NOT NULL DEFAULT false,
  featured        boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_published_idx ON public.reviews(published, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_featured_idx  ON public.reviews(featured)  WHERE featured = true;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS reviews_updated_at ON public.reviews;
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS policies -----------------------------------------------------------------

-- Anon/guest: read only published reviews
CREATE POLICY "anon read published reviews"
  ON public.reviews FOR SELECT
  TO anon
  USING (published = true);

-- Anon/guest: submit a review (always lands as unpublished = false, enforced by CHECK)
CREATE POLICY "anon insert unpublished review"
  ON public.reviews FOR INSERT
  TO anon
  WITH CHECK (published = false AND featured = false);

-- Authenticated staff: read all (including unpublished)
CREATE POLICY "staff read all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated staff: update (publish, feature, edit)
CREATE POLICY "staff update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated staff: delete spam / inappropriate reviews
CREATE POLICY "staff delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (true);
