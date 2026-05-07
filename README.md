-- ==========================================
-- ORDERS
-- ==========================================

create table public.orders (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone null default now(),
  customer_name text not null,
  phone text not null,
  lat double precision null,
  lng double precision null,
  status text null default 'pending'::text,
  notes text null,
  items jsonb null,
  constraint orders_pkey primary key (id)
) TABLESPACE pg_default;

alter table public.orders enable row level security;

create policy "customers can insert orders" on public.orders
  for insert with check (true);

create policy "workers can read orders" on public.orders
  for select using (auth.role() = 'authenticated');

create policy "workers can update orders" on public.orders
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "workers can delete orders" on public.orders
  for delete using (auth.role() = 'authenticated');

-- ==========================================
-- RESERVATIONS
-- ==========================================

create table public.reservations (
  id uuid not null default gen_random_uuid(),
  reservation_date date not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  party_size smallint not null,
  guest_name text not null,
  guest_phone text not null,
  status text not null default 'confirmed'::text,
  created_at timestamp with time zone null default now(),
  constraint reservations_pkey primary key (id),
  constraint reservations_status_check check (
    status = any(array['confirmed'::text, 'cancelled'::text, 'no_show'::text, 'completed'::text])
  )
) TABLESPACE pg_default;

create index if not exists idx_reservations_date_status
  on public.reservations using btree (reservation_date, status) TABLESPACE pg_default;

alter table public.reservations enable row level security;

create policy "customers can insert reservations" on public.reservations
  for insert with check (true);

create policy "workers can read reservations" on public.reservations
  for select using (auth.role() = 'authenticated');

create policy "workers can update reservations" on public.reservations
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "workers can delete reservations" on public.reservations
  for delete using (auth.role() = 'authenticated');

-- ==========================================
-- RESTAURANT SETTINGS
-- ==========================================

create table public.restaurant_settings (
  id serial not null,
  open_time time without time zone not null,
  close_time time without time zone not null,
  slot_interval integer not null,
  total_capacity integer not null,
  session_duration smallint null,
  cleaning_buffer integer null,
  max_party_size smallint null,
  constraint restaurant_settings_pkey primary key (id)
) TABLESPACE pg_default;

alter table public.restaurant_settings enable row level security;

create policy "workers can read settings" on public.restaurant_settings
  for select using (auth.role() = 'authenticated');

create policy "workers can update settings" on public.restaurant_settings
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ==========================================
-- AUTH / PROFILES
-- ==========================================

create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'worker',
  created_at timestamp with time zone default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_role_check check (role = any(array['worker'::text, 'admin'::text]))
);

alter table public.profiles enable row level security;

create policy "workers can read own profile" on public.profiles
  for select using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==========================================
-- CATEGORIES
-- ==========================================

create table public.categories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text null,
  display_order smallint not null default 0,
  created_at timestamp with time zone default now(),
  constraint categories_pkey primary key (id)
);

alter table public.categories enable row level security;

create policy "public can read categories" on public.categories
  for select using (true);

create policy "workers can manage categories" on public.categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ==========================================
-- MENU ITEMS
-- ==========================================

create table public.menu_items (
  id uuid not null default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text null,
  price numeric(10,2) not null,
  image_url text null,
  is_available boolean not null default true,
  display_order smallint not null default 0,
  created_at timestamp with time zone default now(),
  constraint menu_items_pkey primary key (id)
);

create index idx_menu_items_category on public.menu_items(category_id);
create index idx_menu_items_available on public.menu_items(is_available);

alter table public.menu_items enable row level security;

create policy "public can read menu items" on public.menu_items
  for select using (true);

create policy "workers can manage menu items" on public.menu_items
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');