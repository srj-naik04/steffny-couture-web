/**
 * Hand-written Database type for Steffny Couture Web — Phase 2 (updated Phase 6).
 *
 * This file mirrors the schema defined in supabase/migrations/:
 *   20260521_0001_web_products.sql
 *   20260521_0002_web_inquiries.sql
 *   20260521_0003_web_reviews.sql
 *   20260521_0004_web_journal_views.sql
 *   20260523_0006_web_bookings_rls.sql  (Phase 6 — allows anon inserts to bookings)
 *
 * The `bookings` table is owned by the mobile app. The web project only inserts
 * rows (source='web'). Its full schema is reproduced here for type safety.
 *
 * Replace this file with `npx supabase gen types typescript --linked` output
 * once the Supabase project is linked and the migrations are applied.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Image variant shape stored in product_images.variants jsonb column
// ---------------------------------------------------------------------------
export interface ImageVariant {
  width: number;
  format: string;
  storage_path: string;
}

// ---------------------------------------------------------------------------
// Order item shape stored in inquiries.items jsonb column
// ---------------------------------------------------------------------------
export interface InquiryItem {
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  qty: number;
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      // -----------------------------------------------------------------------
      // products
      // -----------------------------------------------------------------------
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_description: string | null;
          description: string;
          story: string | null;
          category: string;
          price: number;
          currency: string;
          primary_colour: string | null;
          available_sizes: string[];
          available_colours: string[];
          length: string | null;
          occasion: string[];
          active: boolean;
          featured: boolean;
          display_order: number;
          stock: number | null;
          blur_data_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          short_description?: string | null;
          description: string;
          story?: string | null;
          category: string;
          price: number;
          currency?: string;
          primary_colour?: string | null;
          available_sizes?: string[];
          available_colours?: string[];
          length?: string | null;
          occasion?: string[];
          active?: boolean;
          featured?: boolean;
          display_order?: number;
          stock?: number | null;
          blur_data_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          short_description?: string | null;
          description?: string;
          story?: string | null;
          category?: string;
          price?: number;
          currency?: string;
          primary_colour?: string | null;
          available_sizes?: string[];
          available_colours?: string[];
          length?: string | null;
          occasion?: string[];
          active?: boolean;
          featured?: boolean;
          display_order?: number;
          stock?: number | null;
          blur_data_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // -----------------------------------------------------------------------
      // product_images
      // -----------------------------------------------------------------------
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          blur_data_url: string | null;
          aspect_ratio: number | null;
          variants: ImageVariant[] | null;
          width: number | null;
          height: number | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          blur_data_url?: string | null;
          aspect_ratio?: number | null;
          variants?: ImageVariant[] | null;
          width?: number | null;
          height?: number | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt_text?: string;
          blur_data_url?: string | null;
          aspect_ratio?: number | null;
          variants?: ImageVariant[] | null;
          width?: number | null;
          height?: number | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };

      // -----------------------------------------------------------------------
      // inquiries
      // -----------------------------------------------------------------------
      inquiries: {
        Row: {
          id: string;
          reference: string;
          type: 'product_inquiry' | 'product_order' | 'general';
          product_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string | null;
          items: InquiryItem[] | null;
          total: number | null;
          message: string | null;
          status: 'new' | 'contacted' | 'closed';
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          type: 'product_inquiry' | 'product_order' | 'general';
          product_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address?: string | null;
          items?: InquiryItem[] | null;
          total?: number | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'closed';
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference?: string;
          type?: 'product_inquiry' | 'product_order' | 'general';
          product_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          delivery_address?: string | null;
          items?: InquiryItem[] | null;
          total?: number | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'closed';
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inquiries_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };

      // -----------------------------------------------------------------------
      // reviews
      // -----------------------------------------------------------------------
      reviews: {
        Row: {
          id: string;
          author_name: string;
          author_location: string | null;
          rating: number;
          title: string | null;
          body: string;
          occasion: string | null;
          published: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_location?: string | null;
          rating: number;
          title?: string | null;
          body: string;
          occasion?: string | null;
          published?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_location?: string | null;
          rating?: number;
          title?: string | null;
          body?: string;
          occasion?: string | null;
          published?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // -----------------------------------------------------------------------
      // bookings (shared table — owned by mobile app; web inserts only)
      // -----------------------------------------------------------------------
      bookings: {
        Row: {
          id: string;
          reference: string;
          type: 'alteration' | 'custom' | 'consultation';
          alteration_type_id: string | null;
          garment_type: string;
          description: string;
          appointment_date: string;
          appointment_time: string;
          photo_paths: string[];
          status: string;
          guest_name: string;
          guest_phone: string;
          guest_email: string;
          user_id: string | null;
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          type: 'alteration' | 'custom' | 'consultation';
          alteration_type_id?: string | null;
          garment_type: string;
          description: string;
          appointment_date: string;
          appointment_time: string;
          photo_paths?: string[];
          status?: string;
          guest_name: string;
          guest_phone: string;
          guest_email: string;
          user_id?: string | null;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference?: string;
          type?: 'alteration' | 'custom' | 'consultation';
          alteration_type_id?: string | null;
          garment_type?: string;
          description?: string;
          appointment_date?: string;
          appointment_time?: string;
          photo_paths?: string[];
          status?: string;
          guest_name?: string;
          guest_phone?: string;
          guest_email?: string;
          user_id?: string | null;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // -----------------------------------------------------------------------
      // journal_views
      // -----------------------------------------------------------------------
      journal_views: {
        Row: {
          slug: string;
          views: number;
          last_viewed_at: string | null;
        };
        Insert: {
          slug: string;
          views?: number;
          last_viewed_at?: string | null;
        };
        Update: {
          slug?: string;
          views?: number;
          last_viewed_at?: string | null;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      increment_view: {
        Args: { p_slug: string };
        Returns: undefined;
      };
    };

    Enums: Record<string, never>;

    CompositeTypes: Record<string, never>;
  };
}
