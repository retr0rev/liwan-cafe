# Liwan — Restaurant Digital Menu System

A production-ready, multilingual (Arabic/English) restaurant digital menu system. Mobile-first public menu + desktop-first admin dashboard — served from a **single URL** (`/` for the menu, `/admin` for the dashboard).

## Tech Stack

- **Frontend**: React, Vite, TanStack Router, TypeScript, TailwindCSS, Anime.js, Three.js
- **Admin**: Same app, routed at `/admin` (React, TypeScript, TailwindCSS)
- **Backend**: Express.js, TypeScript, Supabase (PostgreSQL + Storage), JWT, bcrypt
- **Security**: Helmet, express-rate-limit, CORS allowlist, input validation
- **Deployment**: Vercel (frontend + backend), Supabase

## Project Structure

```
liwan/
├── backend/    # Express API → Vercel Serverless
│   ├── api/    # Vercel entry
│   ├── src/    # routes, middleware, db client
│   └── supabase/migrations/  # SQL schema
├── frontend/   # Single app: public menu (/) + admin (/admin)
│   └── src/
│       ├── components/  # Public menu components
│       ├── admin/       # Admin dashboard (pages, auth, ui)
│       ├── routes/      # TanStack Router routes
│       └── i18n/        # Arabic/English
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
```

3. Run the database migration (`backend/supabase/migrations/0001_init.sql`) in the Supabase SQL Editor. This creates the tables, seeds empty settings, and creates the default admin account:

   - **Username**: `admin`
   - **Password**: `admin123` — **CHANGE THIS AFTER FIRST LOGIN**

4. Create a public storage bucket in Supabase named `menu-images` (or update `SUPABASE_BUCKET`).

5. Start the apps:

```bash
npm run dev:backend   # API on :3001
npm run dev:frontend  # Menu + Admin on :5173 (proxies /api → :3001)
```

Open:
- Public menu: **http://localhost:5173/**
- Admin dashboard: **http://localhost:5173/admin**
```

## Environment Variables

### backend/.env

```
SUPABASE_URL=            # your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=  # service_role key (server-side, never in frontend)
SUPABASE_ANON_KEY=       # anon key
JWT_SECRET=change-me     # long random string
SUPABASE_BUCKET=menu-images
ALLOWED_ORIGINS=http://localhost:5173  # comma-separated frontend origins
```

### frontend/.env.local

```
VITE_API_URL=/api        # use full backend URL in production
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
3. Framework Preset: **Other**, Output: `api/index.ts`
4. Add environment variables from `backend/.env`

### 3. Frontend → Vercel (single app: menu + admin)

1. Import the repo, set **Root Directory** to `frontend`
2. Framework Preset: **Vite**
3. Add env var `VITE_API_URL` = your backend's Vercel URL
4. Ensure a rewrite serves `index.html` for `/admin*` (Vite preset handles SPA fallback)

### 4. Post-deploy

1. Open **`/admin`**, sign in with `admin` / `admin123`
2. **Change the password immediately** (Security tab)
3. Fill in restaurant settings, add categories and menu items

## Security

- **Helmet** security headers on all responses
- **Rate limiting**: 100 req/15min globally, 10 req/15min on auth endpoints (per IP)
- **CORS allowlist** via `ALLOWED_ORIGINS` (empty = same-origin/localhost only)
- **10kb JSON body limit**
- **bcrypt** password hashing, **JWT** with 7-day expiry
- **Input validation** on auth endpoints (type + length checks)

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
