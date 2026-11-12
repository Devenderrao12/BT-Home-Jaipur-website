-- =====================================================================
-- !! IMPORTANT !!  After running this file, ALSO run
--     supabase/migrations/002_auth_roles.sql
-- It replaces the basic policies below with role-based security
-- (admin vs customer), adds customer accounts, and makes you the admin.
-- =====================================================================
-- =====================================================================
-- BT_Jaipur_Homes — Supabase / PostgreSQL Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- LOCATIONS (future-proofed for multiple cities/areas)
-- ---------------------------------------------------------------------
create table if not exists locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,                -- e.g. "Kalwar Road"
  city text not null default 'Jaipur',
  state text not null default 'Rajasthan',
  is_primary boolean default false,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

insert into locations (name, city, state, is_primary, latitude, longitude)
values ('Kalwar Road', 'Jaipur', 'Rajasthan', true, 26.9971, 75.6570)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- CATEGORIES (Flats, Villas, Plots, Commercial(future), Rental(future) ...)
-- Admin can add new categories without code changes.
-- ---------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,          -- "Flats"
  slug text not null unique,          -- "flats"
  description text,
  icon text,                          -- lucide icon name, optional
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into categories (name, slug, description, sort_order) values
  ('Flats', 'flats', 'Apartments & flats', 1),
  ('Villas', 'villas', 'Independent villas & bungalows', 2),
  ('Plots', 'plots', 'Residential & investment plots', 3),
  ('Commercial', 'commercial', 'Commercial spaces (coming soon)', 4),
  ('Rental', 'rental', 'Rental properties (coming soon)', 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- TAGS (Resale, New Launch, Ready to Move, Under Construction)
-- Stored as a flexible tag table so admin can add more later.
-- ---------------------------------------------------------------------
create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique
);

insert into tags (name, slug) values
  ('Resale', 'resale'),
  ('New Launch', 'new-launch'),
  ('Ready to Move', 'ready-to-move'),
  ('Under Construction', 'under-construction')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- PROPERTIES
-- ---------------------------------------------------------------------
create type property_status as enum ('available', 'sold', 'featured', 'on_hold');
create type listing_type as enum ('sale', 'rent');  -- future rental support

create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  address text,
  city text default 'Jaipur',
  latitude numeric,
  longitude numeric,

  price numeric not null default 0,
  price_per_sqft numeric,
  is_price_negotiable boolean default false,

  area_sqft numeric,
  bedrooms int,
  bathrooms int,
  balconies int,
  floor_number int,
  total_floors int,
  facing text,                        -- East, West, North, South...
  furnishing text,                    -- Unfurnished / Semi / Fully

  listing_type listing_type default 'sale',   -- future: rent
  monthly_rent numeric,                       -- future: rent

  status property_status default 'available',
  is_featured boolean default false,
  amenities text[] default '{}',

  video_url text,                     -- youtube / vimeo / mp4 link
  views_count int default 0,

  meta_title text,
  meta_description text,

  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_properties_category on properties(category_id);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_featured on properties(is_featured);
create index if not exists idx_properties_slug on properties(slug);

-- many-to-many: property <-> tags
create table if not exists property_tags (
  property_id uuid references properties(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (property_id, tag_id)
);

-- unlimited images per property
create table if not exists property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int default 0,
  is_cover boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_property_images_property on property_images(property_id);

-- ---------------------------------------------------------------------
-- LEADS (Schedule Visit / Contact / Enquiry forms)
-- ---------------------------------------------------------------------
create type lead_status as enum ('new', 'contacted', 'visit_scheduled', 'converted', 'closed');

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  message text,
  preferred_date date,
  preferred_time text,
  source text default 'website',      -- website / whatsapp / call
  status lead_status default 'new',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_photo_url text,
  rating int check (rating between 1 and 5) default 5,
  message text not null,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- BLOG
-- ---------------------------------------------------------------------
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  author text default 'BT_Jaipur_Homes',
  is_published boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- GALLERY (independent of properties, e.g. site visits, events)
-- ---------------------------------------------------------------------
create table if not exists gallery_items (
  id uuid primary key default uuid_generate_v4(),
  title text,
  media_url text not null,
  media_type text default 'image',   -- image | video
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- ADMIN PROFILES (extends Supabase auth.users)
-- ---------------------------------------------------------------------
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- updated_at trigger for properties
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on properties;
create trigger trg_properties_updated_at
before update on properties
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public can READ published/available content.
-- Only authenticated admin users can WRITE.
-- ---------------------------------------------------------------------
alter table properties enable row level security;
alter table property_images enable row level security;
alter table property_tags enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table locations enable row level security;
alter table leads enable row level security;
alter table testimonials enable row level security;
alter table blog_posts enable row level security;
alter table gallery_items enable row level security;
alter table admin_profiles enable row level security;

-- Public read policies
create policy "public read properties" on properties for select using (true);
create policy "public read property_images" on property_images for select using (true);
create policy "public read property_tags" on property_tags for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read tags" on tags for select using (true);
create policy "public read locations" on locations for select using (true);
create policy "public read testimonials" on testimonials for select using (is_published = true);
create policy "public read blog_posts" on blog_posts for select using (is_published = true);
create policy "public read gallery" on gallery_items for select using (true);

-- Public can INSERT leads (contact / schedule visit forms), but not read others' leads
create policy "public insert leads" on leads for insert with check (true);

-- Authenticated (admin) full access
create policy "admin all properties" on properties for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all property_images" on property_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all property_tags" on property_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all tags" on tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all locations" on locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all leads" on leads for select using (auth.role() = 'authenticated');
create policy "admin update leads" on leads for update using (auth.role() = 'authenticated');
create policy "admin delete leads" on leads for delete using (auth.role() = 'authenticated');
create policy "admin all testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all blog_posts" on blog_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all gallery" on gallery_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin read own profile" on admin_profiles for select using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- STORAGE BUCKETS (run once) — for unlimited images & videos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('property-media', 'property-media', true)
on conflict (id) do nothing;

create policy "public read property-media" on storage.objects for select using (bucket_id = 'property-media');
create policy "admin upload property-media" on storage.objects for insert with check (bucket_id = 'property-media' and auth.role() = 'authenticated');
create policy "admin update property-media" on storage.objects for update using (bucket_id = 'property-media' and auth.role() = 'authenticated');
create policy "admin delete property-media" on storage.objects for delete using (bucket_id = 'property-media' and auth.role() = 'authenticated');
