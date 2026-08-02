# Liwan - Restaurant Digital Menu System

## Overview

A production-ready, multilingual (Arabic/English) restaurant digital menu system with public-facing menu site and admin dashboard. Premium, mobile-first design with smooth animations.

## Tech Stack

### Frontend (Public Menu)
- React + Vite
- TanStack Router
- TypeScript
- TailwindCSS
- Anime.js (animations)
- Three.js (decorative background)

### Frontend (Admin Dashboard)
- React + Vite
- TypeScript
- TailwindCSS (desktop-first)

### Backend
- Express.js (Vercel Serverless)
- TypeScript
- Supabase PostgreSQL
- JWT authentication
- bcrypt password hashing

### Deployment
- Frontend: Vercel
- Admin: Vercel
- Backend: Vercel Serverless
- Database: Supabase
- Storage: Supabase Storage (public bucket)

## Project Structure

```
liwan/
├── backend/
│   ├── api/
│   │   └── [...].ts         # Vercel catch-all route
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/       # Auth, error handling
│   │   ├── db/              # Supabase client, queries
│   │   └── utils/
│   ├── supabase/
│   │   └── migrations/      # SQL migrations
│   ├── uploads/             # Local dev only
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── i18n/            # Context + translation files
│   │   ├── api/             # Backend API calls
│   │   ├── three/           # Three.js scene
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
├── admin/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── shared/
│   └── types.ts             # Shared TypeScript types
└── package.json             # Root workspace
```

## Database Schema

### Categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Menu Items
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Settings
```sql
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);
```

### Admin
```sql
CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Auth
- `POST /api/auth/login` - JWT login
- `PUT /api/auth/password` - Change password (authenticated)

### Categories
- `GET /api/categories` - Public, active categories
- `POST /api/categories` - Admin, create
- `PUT /api/categories/:id` - Admin, update
- `DELETE /api/categories/:id` - Admin, delete

### Menu Items
- `GET /api/items` - Public, available items
- `POST /api/items` - Admin, create
- `PUT /api/items/:id` - Admin, update
- `DELETE /api/items/:id` - Admin, delete
- `POST /api/items/:id/image` - Admin, upload image

### Settings
- `GET /api/settings` - Public, all settings
- `PUT /api/settings` - Admin, update settings

### Dashboard
- `GET /api/stats` - Admin, statistics

## i18n

- React context for language state (`en` | `ar`)
- JSON files for UI labels: `src/i18n/en.json`, `src/i18n/ar.json`
- Menu content from DB (both languages in each row)
- `dir="rtl"` on `<html>` when Arabic active
- `useTranslation()` hook with `t('key')` function
- Language persisted in localStorage

## Public Menu (Mobile-First)

### Design Language
- Primary: Deep Green (#1a3c34)
- Secondary: Dark Chocolate Brown (#3d2b1f)
- Accent: Vanilla/Cream (#f5e6d3)
- Premium, cozy, modern, elegant
- Rounded corners, soft shadows
- Minimal, clean, no clutter

### Hero Section
- Restaurant logo placeholder (div with border)
- Restaurant name from settings
- Short description from settings
- Primary CTA: "Browse Menu"
- Secondary CTA: "Location" (Google Maps link)
- Anime.js entrance animations

### Menu Section
- Horizontal category tabs (scrollable)
- Click category → smooth scroll to section
- Item cards: image, name, description, price
- Optional badges: New, Popular, Spicy, Vegetarian
- Anime.js stagger animation on cards
- All data from API, no hardcoded content

### About Section
- Restaurant description
- Working hours
- Contact info (phone, WhatsApp)
- Social links (Instagram, Facebook, TikTok)
- Google Maps embed/link
- All from settings API

### Navigation
- Sticky top
- Logo placeholder
- Language toggle
- Menu button
- Section highlighting via IntersectionObserver

### Three.js Background
- Floating particles (coffee beans, leaves)
- Minimal GPU usage
- Auto-disable on low-end devices (`navigator.hardwareConcurrency < 4`)
- Decorative only, not main experience

### Animations (Anime.js)
- Hero entrance (fade + slide)
- Card stagger on scroll
- Category tab switch
- Button hover/tap
- Subtle, performance-first

## Admin Dashboard (Desktop-First)

### Auth
- Login page with username/password
- JWT stored in memory
- Protected routes

### Dashboard Home
- Stats cards: categories count, items count, popular items
- Recent edits list

### Categories Management
- Table with all categories
- Create/edit modal
- Delete confirmation
- Enable/disable toggle
- Drag to reorder

### Items Management
- Table with filters (category, availability)
- Create/edit form
- Image upload with preview
- All bilingual fields
- Availability toggle
- Badge toggles (popular, new, vegetarian, spicy)

### Settings
- Restaurant info form
- Logo upload placeholder
- Favicon upload placeholder
- Theme colors (optional)
- All fields from spec

### Security
- Change password page
- Current password verification
- New password + confirm
- bcrypt hashing

## Vercel + Supabase Integration

### Supabase Setup
1. Create Supabase project
2. Run migrations
3. Create storage bucket: `menu-images` (public)
4. Get connection string and API keys

### Vercel Setup
1. Import Git repo
2. Set root directory per app (or monorepo config)
3. Environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (backend only)
   - `JWT_SECRET`

### Backend on Vercel
- Express wrapped with `@vercel/node` adapter
- Single entry point `api/index.ts` handles all routes
- Static files served from Supabase Storage

## Design Decisions

1. **Monorepo**: Single repo, three apps, shared types
2. **TypeScript everywhere**: Consistent stack, shared types
3. **better-sqlite3 → Supabase PostgreSQL**: Changed for Vercel deployment
4. **Local uploads → Supabase Storage**: Changed for Vercel deployment
5. **JWT + bcrypt**: Custom auth, not Supabase Auth (per spec)
6. **TanStack Router**: File-based routing, type-safe
7. **Three.js**: Minimal decorative background, auto-disable
