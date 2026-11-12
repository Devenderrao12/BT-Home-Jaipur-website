-- =====================================================================
-- 002 — Authentication, roles & customer accounts
-- Safe to run on an EXISTING database (idempotent). Run in Supabase SQL Editor.
--
-- BEFORE RUNNING: change YOUR_ADMIN_EMAIL below to the email of the admin
-- user you created in Authentication → Users.
-- =====================================================================

-- 1) PROFILES: one row per user, with a role ('customer' | 'admin') ----
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Every new signup becomes a CUSTOMER. The role is NEVER read from user-supplied
-- metadata (users control that field), so nobody can sign up as admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          nullif(left(new.raw_user_meta_data->>'full_name', 80), ''),
          nullif(left(new.raw_user_meta_data->>'phone', 20), ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist (as customers — default deny)
insert into public.profiles (id, full_name)
select u.id, nullif(left(u.raw_user_meta_data->>'full_name', 80), '')
from auth.users u on conflict (id) do nothing;

-- 2) is_admin(): the single source of truth used by every policy -------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3) Users may read/edit ONLY their own name & phone — never their role --
drop policy if exists "read own profile or admin" on public.profiles;
create policy "read own profile or admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;   -- column-level: role is NOT updatable

-- 4) Customer wishlist (synced across devices when logged in) ----------
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, property_id)
);
alter table public.favorites enable row level security;
drop policy if exists "own favorites select" on public.favorites;
drop policy if exists "own favorites insert" on public.favorites;
drop policy if exists "own favorites delete" on public.favorites;
create policy "own favorites select" on public.favorites for select using (user_id = auth.uid());
create policy "own favorites insert" on public.favorites for insert with check (user_id = auth.uid());
create policy "own favorites delete" on public.favorites for delete using (user_id = auth.uid());

-- 5) Leads: link to the customer (if logged in); only the website API inserts --
alter table public.leads add column if not exists user_id uuid references auth.users(id) on delete set null;
drop policy if exists "public insert leads" on public.leads;   -- no more direct anonymous inserts (spam); API uses service role
drop policy if exists "admin all leads" on public.leads;
drop policy if exists "admin update leads" on public.leads;
drop policy if exists "admin delete leads" on public.leads;
drop policy if exists "read own leads or admin" on public.leads;
create policy "read own leads or admin" on public.leads for select using (public.is_admin() or user_id = auth.uid());
create policy "admin update leads" on public.leads for update using (public.is_admin());
create policy "admin delete leads" on public.leads for delete using (public.is_admin());

-- 6) Replace the old "any logged-in user = admin" policies with is_admin() --
do $$
declare t text;
begin
  foreach t in array array['properties','property_images','property_tags','categories','tags','locations','testimonials','blog_posts','gallery_items']
  loop
    execute format('drop policy if exists "admin all %s" on public.%I', t, t);
    execute format('drop policy if exists "admin all gallery" on public.%I', t);   -- legacy name for gallery_items
    execute format('create policy "admin all %s" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- 7) Storage: only admins may upload/modify media (public can still read) --
drop policy if exists "admin upload property-media" on storage.objects;
drop policy if exists "admin update property-media" on storage.objects;
drop policy if exists "admin delete property-media" on storage.objects;
create policy "admin upload property-media" on storage.objects for insert with check (bucket_id = 'property-media' and public.is_admin());
create policy "admin update property-media" on storage.objects for update using (bucket_id = 'property-media' and public.is_admin());
create policy "admin delete property-media" on storage.objects for delete using (bucket_id = 'property-media' and public.is_admin());

-- 8) Make YOUR account the admin ---------------------------------------
update public.profiles set role = 'admin'
where id = (select id from auth.users where lower(email) = lower('YOUR_ADMIN_EMAIL'));
-- Verify:  select u.email, p.role from public.profiles p join auth.users u on u.id = p.id;
