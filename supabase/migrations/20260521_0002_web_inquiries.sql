-- =============================================================================
-- Migration: 20260521_0002_web_inquiries.sql
-- Purpose:   Create the `inquiries` table — captures "I'm interested in this
--            dress" form submissions, mock checkout orders, and general contact
--            messages from the website. Staff review and follow up via the
--            mobile app.
--
-- Rollback notes:
--   DROP TABLE IF EXISTS public.inquiries CASCADE;
--
-- Dependencies: public.products (FK, nullable)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.inquiries (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference        text        UNIQUE NOT NULL,  -- e.g. 'SC-20260521-A3F9'
  type             text        NOT NULL,          -- 'product_inquiry' | 'product_order' | 'general'
  product_id       uuid        REFERENCES public.products(id) ON DELETE SET NULL,
  customer_name    text        NOT NULL,
  customer_email   text        NOT NULL,
  customer_phone   text        NOT NULL,
  delivery_address text,
  items            jsonb,                         -- for orders: [{productId, variantId?, name, price, qty}, ...]
  total            numeric(10,2),
  message          text,
  status           text        NOT NULL DEFAULT 'new',  -- 'new' | 'contacted' | 'closed'
  source           text        NOT NULL DEFAULT 'web',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx    ON public.inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_email_idx     ON public.inquiries(customer_email);
CREATE INDEX IF NOT EXISTS inquiries_reference_idx ON public.inquiries(reference);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS inquiries_updated_at ON public.inquiries;
CREATE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS policies -----------------------------------------------------------------

-- Anon/guest: can submit an inquiry (insert only)
-- status must be 'new', source must be 'web', type restricted to known values
CREATE POLICY "anon insert inquiries"
  ON public.inquiries FOR INSERT
  TO anon
  WITH CHECK (status = 'new' AND source = 'web' AND type IN ('product_inquiry', 'product_order', 'general'));

-- Authenticated staff: read all inquiries
CREATE POLICY "staff read inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated staff: update status, mark as contacted / closed
CREATE POLICY "staff update inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated staff: delete spam / duplicate inquiries
CREATE POLICY "staff delete inquiries"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (true);
