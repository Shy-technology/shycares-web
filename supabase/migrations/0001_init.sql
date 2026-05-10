-- =====================================================================
-- Shycares — initial schema
-- Run this once in your Supabase project SQL editor.
-- Each groomer signs up via Google OAuth → a profile row + a business row
-- are created. RLS ensures groomer A cannot read/write groomer B's data.
-- =====================================================================

-- Enable required extensions ------------------------------------------------
create extension if not exists "uuid-ossp";

-- =====================================================================
-- profiles: 1 row per authenticated user (groomer)
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profile_select_self" on public.profiles;
create policy "profile_select_self"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profile_upsert_self" on public.profiles;
create policy "profile_upsert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profile_update_self" on public.profiles;
create policy "profile_update_self"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- businesses: 1 row per pet care business
-- (we allow 1 business per owner for the MVP)
-- =====================================================================
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  phone text not null,
  whatsapp_number text not null,
  address text,
  city text,
  logo_url text,
  cover_image_url text,
  photos text[] default '{}',
  business_hours jsonb not null default '{
    "mon": {"open": "09:00", "close": "19:00", "closed": false},
    "tue": {"open": "09:00", "close": "19:00", "closed": false},
    "wed": {"open": "09:00", "close": "19:00", "closed": false},
    "thu": {"open": "09:00", "close": "19:00", "closed": false},
    "fri": {"open": "09:00", "close": "19:00", "closed": false},
    "sat": {"open": "09:00", "close": "19:00", "closed": false},
    "sun": {"open": "10:00", "close": "16:00", "closed": true}
  }'::jsonb,
  currency text not null default 'INR',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_owner_id_idx on public.businesses(owner_id);
create index if not exists businesses_slug_idx on public.businesses(slug);

alter table public.businesses enable row level security;

-- Public can read published businesses (for the microsite)
drop policy if exists "businesses_public_read" on public.businesses;
create policy "businesses_public_read"
  on public.businesses for select
  using (is_published = true);

-- Owners can do anything to their own row
drop policy if exists "businesses_owner_all" on public.businesses;
create policy "businesses_owner_all"
  on public.businesses for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- =====================================================================
-- services: services offered by a business
-- =====================================================================
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  duration_min integer not null check (duration_min > 0),
  price numeric(10, 2) not null check (price >= 0),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists services_business_id_idx on public.services(business_id);

alter table public.services enable row level security;

-- Public can read active services of published businesses
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read"
  on public.services for select
  using (
    is_active = true and exists (
      select 1 from public.businesses b
      where b.id = services.business_id and b.is_published = true
    )
  );

-- Owner of the business can do anything
drop policy if exists "services_owner_all" on public.services;
create policy "services_owner_all"
  on public.services for all
  using (
    exists (select 1 from public.businesses b where b.id = services.business_id and b.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.businesses b where b.id = services.business_id and b.owner_id = auth.uid())
  );

-- =====================================================================
-- customers: pet parents (created when they book)
-- =====================================================================
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  unique (business_id, phone)
);

create index if not exists customers_business_id_idx on public.customers(business_id);

alter table public.customers enable row level security;

-- Public CAN insert (unauthenticated booking flow inserts a customer row).
-- Reads/updates restricted to business owner.
drop policy if exists "customers_public_insert" on public.customers;
create policy "customers_public_insert"
  on public.customers for insert
  with check (
    exists (select 1 from public.businesses b where b.id = customers.business_id and b.is_published = true)
  );

drop policy if exists "customers_owner_read" on public.customers;
create policy "customers_owner_read"
  on public.customers for select
  using (
    exists (select 1 from public.businesses b where b.id = customers.business_id and b.owner_id = auth.uid())
  );

drop policy if exists "customers_owner_modify" on public.customers;
create policy "customers_owner_modify"
  on public.customers for update
  using (
    exists (select 1 from public.businesses b where b.id = customers.business_id and b.owner_id = auth.uid())
  );

drop policy if exists "customers_owner_delete" on public.customers;
create policy "customers_owner_delete"
  on public.customers for delete
  using (
    exists (select 1 from public.businesses b where b.id = customers.business_id and b.owner_id = auth.uid())
  );

-- =====================================================================
-- pets: each pet belongs to a customer
-- =====================================================================
create table if not exists public.pets (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  species text not null default 'dog',
  breed text,
  age_years numeric(4, 1),
  weight_kg numeric(5, 2),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists pets_customer_id_idx on public.pets(customer_id);

alter table public.pets enable row level security;

drop policy if exists "pets_public_insert" on public.pets;
create policy "pets_public_insert"
  on public.pets for insert
  with check (
    exists (
      select 1 from public.customers c
      join public.businesses b on b.id = c.business_id
      where c.id = pets.customer_id and b.is_published = true
    )
  );

drop policy if exists "pets_owner_all" on public.pets;
create policy "pets_owner_all"
  on public.pets for all
  using (
    exists (
      select 1 from public.customers c
      join public.businesses b on b.id = c.business_id
      where c.id = pets.customer_id and b.owner_id = auth.uid()
    )
  );

-- =====================================================================
-- bookings: appointment requests
-- =====================================================================
do $$ begin
  create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
exception when duplicate_object then null; end $$;

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  service_id uuid not null references public.services(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.booking_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_business_id_starts_idx on public.bookings(business_id, starts_at);
create index if not exists bookings_status_idx on public.bookings(status);

alter table public.bookings enable row level security;

-- Public can insert pending bookings (customer making a request)
drop policy if exists "bookings_public_insert" on public.bookings;
create policy "bookings_public_insert"
  on public.bookings for insert
  with check (
    exists (select 1 from public.businesses b where b.id = bookings.business_id and b.is_published = true)
    and bookings.status = 'pending'
  );

-- Business owner can read/update/delete their bookings
drop policy if exists "bookings_owner_select" on public.bookings;
create policy "bookings_owner_select"
  on public.bookings for select
  using (
    exists (select 1 from public.businesses b where b.id = bookings.business_id and b.owner_id = auth.uid())
  );

drop policy if exists "bookings_owner_update" on public.bookings;
create policy "bookings_owner_update"
  on public.bookings for update
  using (
    exists (select 1 from public.businesses b where b.id = bookings.business_id and b.owner_id = auth.uid())
  );

drop policy if exists "bookings_owner_delete" on public.bookings;
create policy "bookings_owner_delete"
  on public.bookings for delete
  using (
    exists (select 1 from public.businesses b where b.id = bookings.business_id and b.owner_id = auth.uid())
  );

-- updated_at auto-touch
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_touch on public.businesses;
create trigger businesses_touch before update on public.businesses
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Storage buckets (run AFTER schema, in Storage UI or via SQL):
--   - logos      (public)
--   - covers     (public)
--   - gallery    (public)
-- Each authenticated user can upload to their own folder: <auth.uid()>/...
-- =====================================================================
insert into storage.buckets (id, name, public)
values
  ('logos', 'logos', true),
  ('covers', 'covers', true),
  ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload into their own folder
drop policy if exists "auth_upload_own_folder_logos" on storage.objects;
create policy "auth_upload_own_folder_logos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "auth_upload_own_folder_covers" on storage.objects;
create policy "auth_upload_own_folder_covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "auth_upload_own_folder_gallery" on storage.objects;
create policy "auth_upload_own_folder_gallery"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and (storage.foldername(name))[1] = auth.uid()::text);

-- Public read (so microsites can render images without auth)
drop policy if exists "public_read_logos" on storage.objects;
create policy "public_read_logos"
  on storage.objects for select using (bucket_id = 'logos');
drop policy if exists "public_read_covers" on storage.objects;
create policy "public_read_covers"
  on storage.objects for select using (bucket_id = 'covers');
drop policy if exists "public_read_gallery" on storage.objects;
create policy "public_read_gallery"
  on storage.objects for select using (bucket_id = 'gallery');
