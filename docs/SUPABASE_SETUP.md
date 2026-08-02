# Supabase Setup for Liwan Cafe

Step-by-step guide to configure Supabase for the Liwan Cafe backend.

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New project**.
3. Name: `liwan-cafe`
4. Database password: generate and save a strong one.
5. Region: closest to your customers.
6. Click **Create project** (takes ~1-2 min).

## 2. Run the migration

1. In the Supabase dashboard, open **SQL Editor**.
2. Create a new query.
3. Copy the entire contents of `backend/supabase/migrations/0001_init.sql`.
4. Click **Run**.

This creates 4 tables (`categories`, `menu_items`, `settings`, `admin`), indexes, and seeds:
- Default admin: **admin / admin123** (change after first login)
- Restaurant name: ليوان (AR) / Liwan Cafe (EN)

## 3. Create the storage bucket

1. Open **Storage** → **New bucket**.
2. Name: `menu-images`
3. Check **Public bucket** (enables public image URLs).
4. Click **Create bucket**.

## 4. Get the API keys

1. Open **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **`anon` public key** → `SUPABASE_ANON_KEY`
   - **`service_role` secret key** → `SUPABASE_SERVICE_ROLE_KEY`
     (keep this server-side only — never in frontend code!)

## 5. Store keys for Vercel

The keys go into Vercel's environment variables for the **backend** project:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | your-project.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `SUPABASE_ANON_KEY` | anon key |
| `JWT_SECRET` | a long random string (see below) |
| `SUPABASE_BUCKET` | menu-images |
| `ALLOWED_ORIGINS` | your frontend Vercel URL(s), comma-separated |

Generate a JWT secret:

```bash
openssl rand -hex 32
```

## 6. Verify

After deploying, hit the health endpoint:

```bash
curl https://your-backend.vercel.app/api/health
# {"ok":true}
```

Then log into the admin dashboard at `https://your-frontend.vercel.app/admin` with `admin` / `admin123` and change the password.
