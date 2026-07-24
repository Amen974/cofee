create table public.menu_items (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text null default ''::text,
  price numeric(10, 2) not null,
  image_url text null,
  is_available boolean not null default true,
  created_at timestamp with time zone null default now(),
  quantity smallint not null default '1'::smallint,
  constraint menu_items_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_menu_items_available on public.menu_items using btree (is_available) TABLESPACE pg_default;

create table public.orders (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone null default now(),
  customer_name text not null,
  phone text not null,
  lat double precision null,
  lng double precision null,
  status text not null default 'pending'::text,
  notes text null,
  items jsonb not null,
  total_price numeric(10, 2) not null default 0,
  address text null default ''::text,
  constraint orders_pkey primary key (id)
) TABLESPACE pg_default;

create table public.profiles (
  id uuid not null,
  email text not null,
  password text not null default ''::text,
  constraint profiles_pkey primary key (id, password),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.reservations (
  id uuid not null default gen_random_uuid (),
  reservation_date date not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  party_size smallint not null,
  guest_name text not null,
  guest_phone text not null,
  status text not null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  constraint reservations_pkey primary key (id),
  constraint reservations_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'confirmed'::text,
          'cancelled'::text,
          'no_show'::text,
          'completed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_reservations_date_status on public.reservations using btree (reservation_date, status) TABLESPACE pg_default;

create table public.restaurant_settings (
  open_time time without time zone not null,
  close_time time without time zone not null,
  slot_interval integer not null,
  total_capacity integer not null,
  session_duration_min smallint null,
  cleaning_buffer_min integer null,
  max_party_size smallint not null default '10'::smallint,
  isopen boolean not null default true,
  tax_rate numeric(5, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  min_party_size smallint not null default '2'::smallint,
  max_booking_days smallint not null default '30'::smallint,
  id uuid not null default gen_random_uuid (),
  lead_time_min smallint not null default 15,
  timezone text not null default 'America/New_York'::text,
  constraint restaurant_settings_pkey primary key (id)
) TABLESPACE pg_default;

📦app
 ┣ 📂(public)
 ┃ ┣ 📂(home)
 ┃ ┃ ┣ 📂cart
 ┃ ┃ ┃ ┣ 📂checkout
 ┃ ┃ ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📜useCheckout.ts
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂contact
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂menu
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┣ 📜BestSellers.tsx
 ┃ ┃ ┃ ┣ 📜CartItem.tsx
 ┃ ┃ ┃ ┣ 📜Footer.tsx
 ┃ ┃ ┃ ┣ 📜Hero.tsx
 ┃ ┃ ┃ ┣ 📜MenuClient.tsx
 ┃ ┃ ┃ ┣ 📜MenuItemCard.tsx
 ┃ ┃ ┃ ┗ 📜Reviewstack.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┗ 📜layout.tsx
 ┣ 📂api
 ┃ ┣ 📂availability
 ┃ ┃ ┗ 📜route.ts
 ┃ ┗ 📂reservations
 ┃ ┃ ┗ 📜route.ts
 ┣ 📂components
 ┃ ┣ 📜BookingClient.tsx
 ┃ ┣ 📜cart-button-logic.ts
 ┃ ┣ 📜CartButton.tsx
 ┃ ┣ 📜CustomCursor.tsx
 ┃ ┣ 📜IsOpen.tsx
 ┃ ┣ 📜Navbar.tsx
 ┃ ┣ 📜NavigationObserver.tsx
 ┃ ┣ 📜NavLink.tsx
 ┃ ┣ 📜ReservationPanel.tsx
 ┃ ┗ 📜useBooking.ts
 ┣ 📂dashboard
 ┃ ┣ 📂live-orders
 ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┗ 📜useOrders.ts
 ┃ ┣ 📂live-reservations
 ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┗ 📜useReservations.ts
 ┃ ┣ 📂menu
 ┃ ┃ ┣ 📜actions.ts
 ┃ ┃ ┣ 📜AddMenuItem.tsx
 ┃ ┃ ┣ 📜MenuDashboardClient.tsx
 ┃ ┃ ┣ 📜MenuDashboardItemCard.tsx
 ┃ ┃ ┣ 📜MenuItemForm.tsx
 ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┗ 📜useMenuItemForm.ts
 ┃ ┣ 📂restaurant_settings
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂_components
 ┃ ┃ ┗ 📜SideBar.tsx
 ┃ ┗ 📜layout.tsx
 ┣ 📂login
 ┃ ┣ 📜actions.ts
 ┃ ┗ 📜page.tsx
 ┣ 📜globals.css
 ┗ 📜layout.tsx