-- ============================================================================
-- Abdulkareem Auto — Add pricing_mode column
-- ============================================================================
-- Distinguishes ready products (fixed price, can be added to cart) from
-- services and retrofits where the cost depends on the customer's car model
-- and condition — those require an inspection and quote via WhatsApp.

alter table products
  add column if not exists pricing_mode text not null default 'fixed'
    check (pricing_mode in ('fixed', 'quote'));

-- Quote items have no price — allow null
alter table products
  alter column price_aed drop not null;

-- Replace the price check so that fixed-price items still require a value
-- and quote items can have null
alter table products
  drop constraint if exists products_price_aed_check;
alter table products
  add constraint products_price_aed_check
    check (
      (pricing_mode = 'quote') or
      (pricing_mode = 'fixed' and price_aed is not null and price_aed >= 0)
    );
