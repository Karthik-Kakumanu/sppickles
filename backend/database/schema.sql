create extension if not exists pgcrypto;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists stock_status (
  product_id text primary key,
  is_available boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null default '',
  customer_state text not null default '',
  customer_country text not null default 'IN',
  customer_pincode text not null default '',
  shipping integer not null default 0,
  subtotal integer not null,
  total integer not null,
  payment_method text not null default 'cod',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  weight text not null,
  quantity integer not null,
  unit_price integer not null,
  total_price integer not null
);

create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_orders_created_at on orders(created_at desc);
