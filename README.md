# BT_Jaipur_Homes — Premium Real Estate Website

A full-stack, production-ready real estate platform for **BT_Jaipur_Homes** (Kalwar Road, Jaipur), built with:

- **Next.js 14** (App Router, Server Components, SEO metadata, sitemap)
- **Supabase** (PostgreSQL database, Auth, Storage for unlimited images/videos)
- **Tailwind CSS** (custom luxury gold/charcoal design system)

---

## ✅ What's included

- Modern luxury, fully responsive UI
- SEO: dynamic metadata, `sitemap.xml`, `robots.txt`, Open Graph tags
- Login-protected **Admin Dashboard** at `/admin`
- Add / Edit / Delete properties, unlimited images, video URL support
- Featured Properties, Flats, Villas, Plots, Resale, New Launch, Ready-to-Move, Under-Construction sections
- Property search + advanced filters (price, bedrooms, status, tags)
- Google Maps embed, Schedule Visit form, WhatsApp button, Call button
- Lead Management dashboard with status tracking
- Blog system, Testimonials, Gallery (photos + videos) — all manageable from the CMS
- EMI Calculator, Property Comparison, Favorites (saved locally per visitor)
- Property Status: Available / Sold / Featured / On Hold
- Clean CMS: add new **Categories** (e.g. Commercial, Rental) and **Tags** from the dashboard — no code required
- Schema future-proofed for multiple locations, rental listings, and commercial properties

---

## 🔄 Upgrade notes (premium redesign)

**No database changes or migrations are required.** The upgrade uses only columns already in `supabase/schema.sql`.

New / changed behaviour:

- **Buy / Rent / Commercial**: new pages `/buy`, `/rent`, `/commercial`. "Rent" shows properties whose *Listing type* is **For Rent** (set in Admin → Properties → Location & Pricing, with a monthly rent). "Commercial" shows anything in the `commercial` category. All existing URLs (`/flats`, `/villas`, `/plots`, `/properties/...`, etc.) are unchanged.
- **Search**: hero search has Buy / Rent / Commercial tabs, location, property type and budget. Location search matches title, address and city.
- **Performance**: public pages use a cookie-free Supabase client and are cached/revalidated every 60s (data changes appear within ~1 minute). Fonts are self-hosted. Images are served as AVIF/WebP.
- **SEO**: set `NEXT_PUBLIC_SITE_URL` to your real domain in Vercel so canonicals and the sitemap point to it. Optional `NEXT_PUBLIC_GSC_VERIFICATION` adds Search Console verification.
- **Contact email** is no longer hard-coded. Set `NEXT_PUBLIC_CONTACT_EMAIL` to show one.
- **Hero**: pure CSS/SVG (no image download). To use your own photography, replace the hero background in `src/components/Hero.tsx` with an optimized `next/image` (`priority`).

If the site shows "0 properties", check Vercel → Logs for `getProperties error:` — it prints the exact Supabase error (wrong env vars, missing schema, or RLS).

---

## 🔐 Authentication & security (admin + customer accounts)

The site has two kinds of accounts, enforced **on the server and in the database** (not just by hiding links):

| | Where | Can do |
|---|---|---|
| **Admin** | `/admin/login` | Everything in the dashboard |
| **Customer** | `/signup`, `/login`, `/account` | Save favourites across devices, see their visit requests, edit name/phone |

Customers can **never** reach the admin area or modify listings — even by calling Supabase directly. Roles live in the `profiles` table; only you can create an admin (via SQL).

### One-time setup (do these IN ORDER)

1. **Run the SQL first.** Supabase → SQL Editor → paste `supabase/migrations/002_auth_roles.sql`.
   Before running, replace `YOUR_ADMIN_EMAIL` with the email of your admin user (Authentication → Users).
   It is safe to run more than once. *(New project? run `schema.sql` first, then this file.)*
2. **Then deploy the new code** to Vercel. (If you deploy before step 1, admin login will say "no admin access" until the SQL is run.)
3. Supabase → **Authentication → URL Configuration**: set *Site URL* to your site (e.g. `https://btjaipurhomes.vercel.app`) and add `https://btjaipurhomes.vercel.app/**` (and `http://localhost:3000/**`) to *Redirect URLs*. Needed for the email confirmation and password-reset links.
4. **Authentication → Sign In / Providers → Email**: keep **Confirm email ON**, and set the minimum password length to **8**.
5. **Email delivery:** Supabase's built-in email sender allows only a handful of emails per hour. For real customers, add a custom SMTP provider (Authentication → SMTP Settings), e.g. Resend or Brevo.
6. **Sign-ups must stay ON** (customers need them). That is now safe — new users are always *customers*.

### Making another admin
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where lower(email) = lower('person@example.com'));
```
To remove admin access, set `role = 'customer'`. Roles cannot be changed from the website or API — only from the SQL editor.

### Forgot your admin password?
Use **/forgot-password** with the admin email, then sign in at `/admin/login`.

### What is protected
- `/admin/*`: middleware **and** the admin layout both verify a valid session + `admin` role on every request.
- Admin API routes (`/api/properties` POST, `/api/upload`): 401 if logged out, 403 if not admin. Uploads are limited to images/videos ≤ 50 MB.
- Database (RLS): customers can't write listings, categories, blog, testimonials, gallery or storage; can only read **their own** leads/favorites/profile; can't change their own role. Anonymous visitors can't insert leads directly (only the website's API can, which blocks bots with a honeypot).
- Login redirects (`?next=`) only accept same-site paths (no phishing redirects). Password-reset never reveals whether an email is registered.
- Admin login adds a 60-second cool-down after 5 wrong passwords (on top of Supabase's own rate limiting).
- Security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy) and `noindex` on all private pages.

### Not included (recommended next steps)
- **Two-factor authentication (MFA)** for the admin account.
- **CAPTCHA.** Do **not** enable Supabase's CAPTCHA protection yet — the forms don't send a CAPTCHA token, so logins/sign-ups would stop working.
- Social login (Google) and a strict Content-Security-Policy.

---

## 1. Prerequisites

- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account (recommended for deployment) or any Node host

---

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com/dashboard).
2. Go to **SQL Editor → New Query**, paste the entire contents of `supabase/schema.sql`, and run it.
   This creates all tables, row-level security policies, and a `property-media` storage bucket.
3. Go to **Authentication → Users → Add User** and create your admin login (email + password).
   This is the account you'll use to log into `/admin`.
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret — server-only)

---

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://btjaipurhomes.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919672439863
NEXT_PUBLIC_CALL_NUMBER=+919672439863
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps?q=Kalwar+Road,+Jaipur&output=embed
```

> Tip: to get a precise Google Maps embed URL — open Google Maps, search "Kalwar Road, Jaipur" (or your exact office location), click **Share → Embed a map**, and copy the `src` URL from the iframe code.

---

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the admin dashboard.

---

## 5. Deploy (Vercel — recommended)

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy. Vercel will give you a live URL; point your custom domain to it afterward.

The site is fully static-friendly where possible and uses server components for fast loading and good SEO out of the box.

---

## 6. Using the CMS (no coding required)

- **Add a property:** `/admin/properties → Add Property`. Upload as many images as you like, set a cover image, add a video URL, choose category + tags (Resale / New Launch / Ready to Move / Under Construction), and set status (Available / Sold / Featured / On Hold).
- **Add a new category** (e.g. "Commercial" or "Rental" when you're ready to launch them): `/admin/categories`. It instantly becomes available in the property form and can be wired to a new page later.
- **Manage leads:** every Contact form and Schedule Visit submission appears in `/admin/leads` with phone click-to-call and status tracking (New → Contacted → Visit Scheduled → Converted → Closed).
- **Blog:** `/admin/blog` to publish articles.
- **Testimonials & Gallery:** `/admin/testimonials` and `/admin/gallery`.

---

## 7. Future-proofing already built in

- `locations` table supports multiple offices/areas — Kalwar Road is seeded as the primary location; add more anytime.
- `listing_type` (`sale` / `rent`) and `monthly_rent` columns exist on `properties` so rentals can be enabled without a schema change — just add a "Rental" category and start listing.
- A "Commercial" category is pre-seeded (inactive by default) — flip `is_active` in `/admin/categories` when ready, or just start adding commercial properties under it.

---

## 8. Project structure

```
src/
  app/                → Pages (App Router) + API routes
    admin/             → Protected admin dashboard
    properties/[slug]  → Property detail pages
    flats, villas, plots, resale, new-launch, ready-to-move, under-construction
  components/          → Shared UI components
    admin/              → Admin-only components (forms, uploaders, managers)
  lib/
    supabase/           → Supabase client/server/admin/middleware helpers
    data/                → Server-side data-fetching functions
    hooks/                → useFavorites, useCompare (localStorage)
    types.ts, utils.ts
supabase/
  schema.sql            → Full DB schema, RLS policies, storage bucket
```

---

## 9. Notes on images

Replace the placeholder files in `/public` (`hero-jaipur.jpg`, `placeholder-property.jpg`, `placeholder-blog.jpg`, `icon.png`) with your own high-quality photography before going live — these are simple generated placeholders.

---

## 10. Support

Built for **BT_Jaipur_Homes** — Kalwar Road, Jaipur · +91 9672439863
