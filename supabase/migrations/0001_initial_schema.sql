-- ============================================================================
-- Abdulkareem Auto — Initial database schema
-- Run this in Supabase SQL editor: https://app.supabase.com/project/_/sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Categories (car brands: Mercedes, BMW, Bugatti, Range Rover, etc.)
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name_en       text not null,
  name_ar       text not null,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists categories_active_order_idx
  on categories(is_active, display_order);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id                uuid primary key default uuid_generate_v4(),
  slug              text not null unique,
  name_en           text not null,
  name_ar           text not null,
  description_en    text,
  description_ar    text,
  price_aed         numeric(10,2) not null check (price_aed >= 0),
  stock             integer not null default 0 check (stock >= 0),
  category_id       uuid references categories(id) on delete set null,
  product_type      text, -- DRL | Headlights | Taillights | Interior | Accessories
  compatible_models text, -- e.g., "S-Class 2018-2024, E-Class 2020+"
  images            jsonb not null default '[]'::jsonb,
  is_featured       boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_active_idx on products(is_active);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_featured_idx on products(is_featured) where is_featured;

-- Auto-update updated_at on every row update
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create sequence if not exists order_number_seq start 1000;

create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  order_number     integer not null default nextval('order_number_seq') unique,
  customer_name    text not null,
  customer_phone   text not null,
  customer_address text,
  items            jsonb not null, -- [{product_id, product_name_en, product_name_ar, qty, price_at_order}]
  total_aed        numeric(10,2) not null check (total_aed >= 0),
  status           text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'shipped', 'completed', 'cancelled')),
  notes            text,
  created_at       timestamptz not null default now()
);

create index if not exists orders_status_idx on orders(status, created_at desc);

-- ---------------------------------------------------------------------------
-- Atomic stock decrement when an order is confirmed
-- ---------------------------------------------------------------------------
create or replace function confirm_order(p_order_id uuid)
returns void as $$
declare
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
  v_status text;
begin
  select status into v_status from orders where id = p_order_id for update;
  if v_status is null then
    raise exception 'Order not found: %', p_order_id;
  end if;
  if v_status <> 'pending' then
    raise exception 'Order already processed (status: %)', v_status;
  end if;

  for v_item in select * from jsonb_array_elements((select items from orders where id = p_order_id))
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'qty')::integer;

    update products
       set stock = stock - v_qty
     where id = v_product_id;

    if not found then
      raise exception 'Product not found: %', v_product_id;
    end if;
  end loop;

  update orders set status = 'confirmed' where id = p_order_id;
end;
$$ language plpgsql security definer;

-- Restore stock when a confirmed order is cancelled
create or replace function cancel_confirmed_order(p_order_id uuid)
returns void as $$
declare
  v_item jsonb;
  v_status text;
begin
  select status into v_status from orders where id = p_order_id for update;
  if v_status <> 'confirmed' then
    raise exception 'Can only cancel confirmed orders (status: %)', v_status;
  end if;

  for v_item in select * from jsonb_array_elements((select items from orders where id = p_order_id))
  loop
    update products
       set stock = stock + (v_item->>'qty')::integer
     where id = (v_item->>'product_id')::uuid;
  end loop;

  update orders set status = 'cancelled' where id = p_order_id;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Categories: public read of active, authenticated full access
drop policy if exists categories_public_read on categories;
create policy categories_public_read on categories
  for select using (is_active = true);

drop policy if exists categories_admin_all on categories;
create policy categories_admin_all on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Products: public read of active, authenticated full access
drop policy if exists products_public_read on products;
create policy products_public_read on products
  for select using (is_active = true);

drop policy if exists products_admin_all on products;
create policy products_admin_all on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders: public can INSERT only, authenticated can do everything
drop policy if exists orders_public_insert on orders;
create policy orders_public_insert on orders
  for insert with check (true);

drop policy if exists orders_admin_all on orders;
create policy orders_admin_all on orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage bucket for product images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images auth write" on storage.objects;
create policy "product images auth write" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "product images auth update" on storage.objects;
create policy "product images auth update" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "product images auth delete" on storage.objects;
create policy "product images auth delete" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seed car brands as categories
-- ---------------------------------------------------------------------------
insert into categories (slug, name_en, name_ar, display_order) values
  ('mercedes-benz', 'Mercedes-Benz', 'مرسيدس-بنز', 10),
  ('bmw', 'BMW', 'بي إم دبليو', 20),
  ('audi', 'Audi', 'أودي', 30),
  ('porsche', 'Porsche', 'بورش', 40),
  ('range-rover', 'Range Rover', 'رنج روفر', 50),
  ('bentley', 'Bentley', 'بنتلي', 60),
  ('rolls-royce', 'Rolls-Royce', 'رولز رويس', 70),
  ('lamborghini', 'Lamborghini', 'لامبورغيني', 80),
  ('ferrari', 'Ferrari', 'فيراري', 90),
  ('bugatti', 'Bugatti', 'بوغاتي', 100),
  ('mclaren', 'McLaren', 'مكلارين', 110),
  ('aston-martin', 'Aston Martin', 'أستون مارتن', 120),
  ('maserati', 'Maserati', 'مازيراتي', 130),
  ('lexus', 'Lexus', 'لكزس', 140),
  ('toyota', 'Toyota', 'تويوتا', 150),
  ('nissan', 'Nissan', 'نيسان', 160),
  ('universal', 'Universal Fit', 'متعدد الاستخدامات', 999)
on conflict (slug) do nothing;
