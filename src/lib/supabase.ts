import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key-replace-in-env-vars'
    ) as ReturnType<typeof createClient>);

export type ProductRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  pricing_mode: 'fixed' | 'quote';
  price_aed: number | null;
  stock: number;
  category_id: string | null;
  product_type: string | null;
  compatible_models: string | null;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  display_order: number;
  is_active: boolean;
};

export type OrderItem = {
  product_id: string;
  product_name_en: string;
  product_name_ar: string;
  qty: number;
  price_at_order: number;
};

export type OrderRow = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  items: OrderItem[];
  total_aed: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
};
