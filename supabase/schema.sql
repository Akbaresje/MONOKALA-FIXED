-- =====================================================================
-- MONOKALA · Supabase schema
-- Copy-paste seluruh file ini ke SQL Editor di dashboard Supabase, lalu Run.
-- =====================================================================

-- 1. MENU ITEMS ----------------------------------------------------------
create table if not exists public.menu_items (
  id            text primary key,
  name          text not null,
  origin        text default '',
  description   text default '',
  price         integer not null default 0,
  category      text not null,
  image         text default '',
  tag           text,
  sold_out      boolean default false,
  options       jsonb default '[]'::jsonb,
  addons        jsonb default '[]'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. ORDERS --------------------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  code          text not null,
  name          text not null,
  "table"       text not null,
  method        text not null,
  lines         jsonb not null,
  subtotal      integer not null,
  service       integer not null,
  tax           integer not null,
  total         integer not null,
  status        text not null default 'new'
                check (status in ('new','preparing','ready','done','cancelled')),
  paid          boolean not null default false,
  placed_at     timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists orders_status_idx  on public.orders(status);
create index if not exists orders_placed_idx  on public.orders(placed_at desc);

-- 3. SETTINGS (single-row table) -----------------------------------------
create table if not exists public.settings (
  id                 int primary key default 1,
  cafe_name          text default 'MONOKALA',
  service_rate       numeric default 0.05,
  tax_rate           numeric default 0.11,
  tables             int default 24,
  accepting_orders   boolean default true,
  prep_minutes       int default 12,
  payments           jsonb default '[
    {"id":"qris","label":"QRIS","note":"Semua e-wallet & bank","enabled":true,"prepaid":true},
    {"id":"card","label":"Kartu Debit / Kredit","note":"Visa · Mastercard","enabled":true,"prepaid":true},
    {"id":"cash","label":"Bayar di Kasir","note":"Tunai saat pengambilan","enabled":true,"prepaid":false}
  ]'::jsonb,
  staff_password     text default 'monokala2024',
  updated_at         timestamptz default now(),
  constraint one_row check (id = 1)
);

insert into public.settings (id) values (1)
on conflict (id) do nothing;

-- 4. AUTO-UPDATE `updated_at` -------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_menu_upd  on public.menu_items;
drop trigger if exists trg_ord_upd   on public.orders;
drop trigger if exists trg_set_upd   on public.settings;

create trigger trg_menu_upd before update on public.menu_items
  for each row execute function public.touch_updated_at();
create trigger trg_ord_upd  before update on public.orders
  for each row execute function public.touch_updated_at();
create trigger trg_set_upd  before update on public.settings
  for each row execute function public.touch_updated_at();

-- 5. REALTIME ------------------------------------------------------------
-- Aktifkan supaya Kitchen Display & antrean tamu update otomatis
-- ketika status pesanan berubah.
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.menu_items;
alter publication supabase_realtime add table public.settings;

-- 6. ROW LEVEL SECURITY --------------------------------------------------
-- Setup permissive dulu (semua orang bisa baca/tulis).
-- COCOK UNTUK DEMO / MVP. Untuk produksi, ganti dengan policy yang lebih
-- ketat (mis. staf harus login untuk edit menu/settings).
alter table public.menu_items enable row level security;
alter table public.orders     enable row level security;
alter table public.settings   enable row level security;

drop policy if exists "public read menu"      on public.menu_items;
drop policy if exists "public write menu"     on public.menu_items;
drop policy if exists "public read orders"    on public.orders;
drop policy if exists "public write orders"   on public.orders;
drop policy if exists "public read settings"  on public.settings;
drop policy if exists "public write settings" on public.settings;

create policy "public read menu"      on public.menu_items for select using (true);
create policy "public write menu"     on public.menu_items for all    using (true) with check (true);
create policy "public read orders"    on public.orders     for select using (true);
create policy "public write orders"   on public.orders     for all    using (true) with check (true);
create policy "public read settings"  on public.settings   for select using (true);
create policy "public write settings" on public.settings   for all    using (true) with check (true);

-- =====================================================================
-- SELESAI. Silakan Run.
-- =====================================================================
