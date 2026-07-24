# Obsidian Coffee Lounge

A full-stack coffee lounge platform: a public ordering/booking site for guests and a real-time operations dashboard for staff. Built to explore production patterns around role-based access, real-time data sync, and animation-heavy frontend work without sacrificing performance.

**Live demo:** https://cofee-cyan.vercel.app/

![alt text](<Screenshot 2026-07-24 140654.png>)
![alt text](<Screenshot 2026-07-24 140752.png>) 
![alt text](<Screenshot 2026-07-24 140807.png>)

## Overview

Guests can browse the menu, order, and reserve a table with zero friction — no account required. Staff log into a single shared operator account to manage live orders, reservations, and the menu in real time. The two surfaces share a database but are fully separated by auth middleware and Postgres row-level security.

| | |
|---|---|
| **Guest flow** | No login. Browse menu → cart → checkout (with GPS-based delivery location) → order confirmation. Same no-login model for table reservations. |
| **Staff flow** | Single shared operator account. Realtime order/reservation feed, menu CRUD, and restaurant settings (hours, capacity, open/closed toggle) behind authenticated, middleware-protected routes. |

## Why no per-worker accounts

This is a deliberate constraint, not a limitation: a small café floor doesn't need per-employee auth overhead, and a single shared operator account matched the actual staffing model. Route protection is still layered properly — Next.js middleware guards `/dashboard/*` at the edge, and Supabase RLS enforces the same boundary at the database level, so the access control isn't dependent on a single layer.

## Features

**Public site**
- Menu browsing with live search/filter
- Cart with persisted state across sessions (Zustand + `persist`)
- Checkout with GPS-based address capture
- Table reservation with real-time slot availability (respects restaurant hours, lead time, party size limits, and booking window from admin-configured settings)
- Scroll-driven animated storefront (hero, best sellers, testimonials) built with GSAP

**Staff dashboard**
- Live order feed via Supabase Realtime — no polling
- Order status management (accept, modify, remove line items)
- Reservation management
- Menu item CRUD with image upload to Supabase Storage
- Restaurant settings: hours, table capacity, open/closed status — reflected live on the public site
- Scheduled cleanup (`pg_cron`) auto-purges stale non-pending orders/reservations after 3 days

## Architecture notes

A few decisions worth calling out over "yet another CRUD app":

- **Defense in depth on auth.** Middleware (`proxy.ts`) blocks unauthenticated access to `/dashboard/*` at the routing layer; Postgres RLS policies enforce the same rule independently at the data layer. Either one failing doesn't expose the other.
- **Server-trusted business rules.** Reservation capacity and time-slot math (`lead_time_min`, `session_duration_min`, `cleaning_buffer_min`) are always fetched server-side at write time — never trusted from the client request body, since the client can lie about the current time or capacity.
- **Zustand scoped to client state only.** Cart contents and UI state live in Zustand; anything backed by the database (orders, reservations, menu) flows through Supabase directly. This keeps the store from becoming a second, stale source of truth.
- **Server component → client component → hook split.** Server components fetch and pass data down; client components own interaction; custom hooks own state logic. Keeps data-fetching out of `'use client'` boundaries.
- **Animation state stays out of React.** GSAP owns positional styles on any element it animates — React state doesn't write to the same CSS properties concurrently, which avoids the fight-over-the-DOM-node bugs common when animation libraries and React re-renders touch the same element.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP + `@gsap/react` (`useGSAP`, `ScrollTrigger`) |
| Client state | Zustand |
| Backend | Supabase (PostgreSQL, Storage, Realtime, Auth, `pg_cron`) |
| Forms | React Hook Form |
| Icons | Phosphor Icons |
| Deployment | Vercel |

## Data model

Five tables: `menu_items`, `orders`, `reservations`, `restaurant_settings`, and `profiles` (auth linkage for the single operator account). Reservations use a status check constraint (`confirmed` / `cancelled` / `no_show` / `completed`); capacity checks filter on `status IN ('pending', 'confirmed')` to prevent double-booking. All time-based settings (`lead_time_min`, `session_duration_min`, `cleaning_buffer_min`) are stored in minutes for consistent arithmetic.

Full schema: [`supabase/schema.sql`](./supabase/schema.sql)

## Project structure

```
app/
├─ (public)/
│  ├─ (home)/
│  │  ├─ cart/checkout/       # checkout flow + hook
│  │  ├─ menu/                # menu page
│  │  ├─ reservation/         # booking UI + hook
│  │  └─ _components/         # Hero, BestSellers, MenuClient, etc.
│  └─ layout.tsx
├─ api/
│  ├─ availability/           # reservation slot availability
│  └─ reservations/
├─ components/                # Navbar, CartButton, CustomCursor, etc.
├─ dashboard/
│  ├─ live-orders/
│  ├─ live-reservations/
│  ├─ menu/                   # CRUD + image upload
│  ├─ restaurant_settings/
│  └─ _components/
└─ login/
```

## Running locally

```bash
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
email=                # operator login email
```

Run the schema in `supabase/schema.sql` against a fresh Supabase project, then:

```bash
npm run dev
```

## What I'd do differently

- Move the operator email out of a raw env var lookup and into Supabase's own user metadata, to remove one manual config step.
- Add optimistic UI updates on the dashboard order list ahead of the Realtime event arriving, to hide network latency on slower connections.