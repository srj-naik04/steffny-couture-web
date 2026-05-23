/**
 * Convenient row / insert / update aliases derived from the Database type.
 *
 * Import from here rather than from `@/types/database` directly so that
 * consuming code stays tidy. When the Database type is regenerated via
 * `npx supabase gen types typescript --linked`, only `@/types/database.ts`
 * needs updating — these aliases follow automatically.
 */

import type { Database } from '@/types/database';

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export type Product =
  Database['public']['Tables']['products']['Row'];
export type ProductInsert =
  Database['public']['Tables']['products']['Insert'];
export type ProductUpdate =
  Database['public']['Tables']['products']['Update'];

// ---------------------------------------------------------------------------
// Product images
// ---------------------------------------------------------------------------
export type ProductImage =
  Database['public']['Tables']['product_images']['Row'];
export type ProductImageInsert =
  Database['public']['Tables']['product_images']['Insert'];
export type ProductImageUpdate =
  Database['public']['Tables']['product_images']['Update'];

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------
export type Inquiry =
  Database['public']['Tables']['inquiries']['Row'];
export type InquiryInsert =
  Database['public']['Tables']['inquiries']['Insert'];
export type InquiryUpdate =
  Database['public']['Tables']['inquiries']['Update'];

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export type Review =
  Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert =
  Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate =
  Database['public']['Tables']['reviews']['Update'];

// ---------------------------------------------------------------------------
// Journal views
// ---------------------------------------------------------------------------
export type JournalView =
  Database['public']['Tables']['journal_views']['Row'];
export type JournalViewInsert =
  Database['public']['Tables']['journal_views']['Insert'];
export type JournalViewUpdate =
  Database['public']['Tables']['journal_views']['Update'];

// ---------------------------------------------------------------------------
// Convenience — product with its images pre-joined
// ---------------------------------------------------------------------------
export type ProductWithImages = Product & {
  images: ProductImage[];
};
