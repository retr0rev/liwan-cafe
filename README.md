# Liwan — Restaurant Digital Menu System

A production-ready, multilingual (Arabic/English) restaurant digital menu system. Mobile-first public menu + desktop-first admin dashboard.

## Tech Stack

- **Frontend**: React, Vite, TanStack Router, TypeScript, TailwindCSS, Anime.js, Three.js
- **Admin**: React, Vite, TypeScript, TailwindCSS
- **Backend**: Express.js, TypeScript, Supabase (PostgreSQL + Storage), JWT, bcrypt
- **Deployment**: Vercel (all three apps), Supabase

## Project Structure

```
liwan/
├── backend/    # Express API → Vercel Serverless
│   ├── api/    # Vercel entry
│   ├── src/    # routes, middleware, db client
│   └── supabase/migrations/  # SQL schema
├── frontend/   # Public menu (mobile-first)
├── admin/      # Admin dashboard (desktop-first)
└── shared/     # Shared TypeScript types
```

## Prerequisites

- Node.js 18+
- npm
- A Supabase project (database + storage)
- A Vercel account

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables. Copy each `.env.example` to `.env` and fill in values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp admin/.env.example admin/.env.local
```

3. Run the database migration (`backend/supabase/migrations/0001_init.sql`) in the Supabase SQL Editor. This creates the tables, seeds empty settings, and creates the default admin account:

   - **Username**: `admin`
   - **Password**: `admin123` — **CHANGE THIS AFTER FIRST LOGIN**

4. Create a public storage bucket in Supabase named `menu-images` (or update `SUPABASE_BUCKET`).

5. Start the apps:

```bash
npm run dev:backend   # API on :3001
npm run dev:frontend  # Menu on :5173
npm run dev:admin     # Admin on :5174
```

## Environment Variables

### backend/.env

```
SUPABASE_URL=            # your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=  # service_role key (server-side, never in frontend)
SUPABASE_ANON_KEY=       # anon key
JWT_SECRET=change-me     # long random string
SUPABASE_BUCKET=menu-images
```

### frontend/.env.local

```
VITE_API_URL=/api        # use full backend URL in production
```

### admin/.env.local

```
VITE_API_URL=https://your-backend.vercel.app
```

## Deployment (Vercel + Supabase)

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `backend/supabase/migrations/0001_init.sql` in the SQL Editor
3. Create a public bucket: Storage → New bucket → name `menu-images` → **Public**
4. Copy the Project URL and API keys (Settings → API)

### 2. Backend → Vercel

1. Import the repo into Vercel
2. Set the **Root Directory** to `backend`
3. Build command: `npm run build` (or leave default), Output: `api/index.ts` (Framework Preset: **Other**)
4. Add environment variables from `backend/.env`

### 3. Frontend → Vercel

1. Import the repo, set **Root Directory** to `frontend`
2. Framework Preset: **Vite**
3. Add env var `VITE_API_URL` = your backend's Vercel URL

### 4. Admin → Vercel

1. Import the repo, set **Root Directory** to `admin`
2. Framework Preset: **Vite**
3. Add env var `VITE_API_URL` = your backend's Vercel URL

### 5. Post-deploy

1. Open the admin dashboard, sign in with `admin` / `admin123`
2. **Change the password immediately** (Security tab)
3. Fill in restaurant settings, add categories and menu items

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns JWT |
| PUT | `/api/auth/password` | ✓ | Change password |
| GET | `/api/categories` | — | List categories |
| POST | `/api/categories` | ✓ | Create category |
| PUT | `/api/categories/:id` | ✓ | Update category |
| DELETE | `/api/categories/:id` | ✓ | Delete category |
| GET | `/api/items` | — | List available items |
| POST | `/api/items` | ✓ | Create item |
| PUT | `/api/items/:id` | ✓ | Update item |
| DELETE | `/api/items/:id` | ✓ | Delete item |
| POST | `/api/items/:id/image` | ✓ | Upload item image |
| GET | `/api/settings` | — | Get settings |
| PUT | `/api/settings` | ✓ | Update settings |
| POST | `/api/settings/logo` | ✓ | Upload logo |
| POST | `/api/settings/favicon` | ✓ | Upload favicon |
| GET | `/api/stats` | ✓ | Dashboard stats |
| GET | `/api/stats/recent` | ✓ | Recent edits |

## Design

- **Primary**: Deep Green `#1a3c34`
- **Secondary**: Dark Chocolate Brown `#3d2b1f`
- **Accent**: Vanilla/Cream `#f5e6d3`

Mobile-first, thumb-friendly buttons, smooth Anime.js animations, and a low-GPU Three.js ambient background that auto-disables on low-end devices.
