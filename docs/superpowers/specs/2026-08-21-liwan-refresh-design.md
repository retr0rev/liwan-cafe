# Liwan ليوان — Cafe & Bakery Refresh (Heritage Luxury + WhatsApp Cart)

## Overview
Refresh of the existing Liwan digital menu system. Keeps the proven stack (single Vite app serving `/` and `/admin`, Express on Vercel Serverless, Supabase PG + Storage). Adds heritage-luxury visual redesign, WhatsApp cart checkout with customer notes, and seeds admin as `admin / Admin123##`. Nothing in the menu is hardcoded; all sections read from API. Arabic is default (RTL).

## Goals
- Best-in-class menu aesthetics for a cafe/bakery: heritage luxury feel, not generic.
- Public site order: Hero → Most Popular → Menu (categories + items) → About → Location → Social/Connect.
- Admin can fully manage categories/items/settings without code changes.
- Cart drawer with qty + notes, checkout via WhatsApp to number configured in Settings.

## Non-Goals
- Online payment, delivery tracking, user accounts, inventory.

## Tech Stack (unchanged)
- Frontend: React + Vite, TanStack Router, TypeScript, TailwindCSS, Anime.js, Three.js (decorative, lazy-loaded, auto-disable on low-end)
- Backend: Express.js + TypeScript on Vercel Serverless (`backend/api/index.ts`), Supabase PG + Storage, JWT + bcrypt
- Shared types in `shared/`
- Deployment: Vercel (frontend + backend), Supabase

## Project Structure (single-app)
```
liwan/
├── backend/  # Express API → Vercel
│   ├── api/index.ts
│   ├── src/{routes,middleware,db,utils}
│   └── supabase/migrations/0001_init.sql
├── frontend/ # Public menu (/) + admin (/admin) — one Vite app
│   └── src/{components,admin,i18n,hooks,three,routes}
└── shared/src/types.ts
```

## Database Schema (delta)
- No schema migration needed beyond seed update. Adds a settings key `whatsapp_number` (string, E.164 without + is ok). If missing, checkout button disabled with hint.
- Categories: id, name_ar, name_en, display_order, is_active
- Items: id, category_id FK cascade, name_ar/en, description_ar/en, price DECIMAL, image_url, is_available, is_popular, display_order, timestamps
- Settings: key TEXT UNIQUE, value TEXT (keys: restaurant_name_ar/en, about_ar/en, location_url, location_text_ar/en, phone, whatsapp_number, instagram, facebook, tiktok, hours_ar/en, logo_url, favicon_url)
- Admin: id, username UNIQUE, password_hash (seed: admin / Admin123## bcrypt 10)

## API (no breaking change, one key added)
- POST /api/auth/login, PUT /api/auth/password (auth)
- GET/POST/PUT/DELETE /api/categories (GET public, rest auth)
- GET/POST/PUT/DELETE /api/items + POST /api/items/:id/image (GET public, rest auth)
- GET /api/settings (public), PUT /api/settings + POST /api/settings/logo + POST /api/settings/favicon (auth)
- GET /api/stats, GET /api/stats/recent (auth)
- Settings PUT now validates whatsapp_number (digits, 8-15 chars, optional leading +) alongside existing keys.

## i18n
- Context `lang: 'ar'|'en'`, default `ar`, persisted in localStorage, html `lang`/`dir` synced.
- UI strings in `src/i18n/translations.ts`, menu content from DB (both langs per row).
- Price formatted as `١٢٬٠٠٠ ل.س` / `12,000 S.P` via helper.

## Design System — Heritage Luxury
- Palette: emerald `#0f2e26` (primary), gold `#c9a86a` (accent), cream `#fdf8ef` (bg), cream-dark `#f5ecd7`, chocolate `#2b1e14` (text), muted `#6b5a45`. Tailwind tokens `emerald`, `gold`, `cream`, `ink`.
- Typography: Headlines Cormorant Garamond (EN) + Amiri (AR), Body Inter (EN) + Tajawal (AR). Loaded via Google Fonts with `display=swap`. RTL font stack switched via `[dir='rtl']`.
- Shape: `rounded-2xl` cards, `rounded-full` pills, soft shadows `shadow-[0_8px_30px_rgba(15,46,38,0.08)]`, gold hairline borders.
- Hero: logo, name from settings, tagline, CTAs (Browse Menu scroll, WhatsApp Location link), subtle Three.js particles (gold/emerald, very low density).
- No hardcoding: hero text, popular items, menu, about, location, social all from API.

## Public Site (mobile-first) — Section Spec
1. **Nav** — sticky, blurred cream, logo, lang toggle, cart button with badge count, section anchors. Active section via IntersectionObserver.
2. **Hero** — full-width, cream bg, emerald headline, gold divider, Anime.js entrance (stagger). CTA: Browse Menu → scroll to menu. Secondary: Location.
3. **Most Popular** — horizontal scroll or grid (3 cols desktop), filtered `is_popular && is_available`. Empty → hidden. Each card: image, name, description, price (gold), Add to Cart.
4. **Menu** — sticky category tabs (gold underline active), per-category sections with anchor ids, ItemCards (image 4:3, name, desc, price, Add to Cart). Empty category → "No items yet" in current lang.
5. **About** — emerald band or cream with gold rule, text from `about_ar/en`, hours.
6. **Location** — text + embedded map link/button (location_url), address from settings.
7. **Social & Connect** — icons for instagram/facebook/tiktok (only if URL present), phone/WhatsApp links.
8. **Footer** — name, year, minimal.

## Cart & WhatsApp Checkout
- State: React context `CartContext` — items: `{id, name_ar/en, price, qty, image_url}`, persisted in localStorage. Drawer slides from end (RTL aware).
- Drawer UI: item rows with +/- qty, remove, line total, subtotal, notes textarea (customer name/address/note), Checkout via WhatsApp button.
- WhatsApp message format (EN/AR based on lang):
  ```
  مرحبا ليوان! طلب جديد:
  - 2x كابتشينو — 16,000 ل.س
  - 1x كرواسون — 8,000 ل.س
  المجموع: 24,000 ل.س
  ملاحظات: ...
  ```
  Encoded via `https://wa.me/<number>?text=<encodeURIComponent(msg)>`. Number from settings `whatsapp_number`; stripped of non-digits, leading `+` removed for wa.me.
- Validation: empty cart → disabled, missing whatsapp_number → button disabled + tooltip "WhatsApp not configured".

## Admin Dashboard (desktop-first, at /admin)
- Auth: Login page, JWT in memory + localStorage, protected routes, rate-limited (30/15m).
- Seed: username `admin`, password `Admin123##` (bcrypt). Migration seeds with hash; document must be re-run or updated.
- Pages:
  - Dashboard: stats (categories/items/popular), recent edits.
  - Categories: table, create/edit modal (name_ar/en), delete confirm, active toggle, reorder via display_order.
  - Items: table with category filter, CRUD modal (name_ar/en, desc_ar/en, price, category, is_available, is_popular, image upload with preview).
  - Settings: form for about_ar/en, location_url/text, phone, whatsapp_number, social URLs, hours, logo/favicon upload, save via PUT /api/settings.
  - Change Password: current + new + confirm.
- UI primitives: Button, Input, Modal, Table (already present) — restyled to heritage tokens.

## Security & Validation
- Helmet, CORS allowlist (ALLOWED_ORIGINS), rate-limit (100/15m global, 30/15m auth), 10kb JSON limit, bcrypt 10, JWT 7d, input length/type checks, Supabase RLS via service_role on server only.

## Animations & Perf
- Anime.js: hero entrance, card stagger on scroll (useReveal), tab switch, drawer slide. Three.js particles lazy-loaded, disabled if `hardwareConcurrency < 4` or `saveData`.
- Images via Supabase Storage public bucket `menu-images`, lazy loading, 4:3.

## Testing Strategy
- Manual: seed admin login, create category → item → appears in menu & popular, cart add/remove/qty, WhatsApp link encodes correctly, RTL toggle, empty states.
- API: curl for auth, categories, items, settings, image upload.
- Build: `npm run build` for frontend+backend must pass; `tsc --noEmit`.

## Deployment
- Supabase: run migration, create public bucket `menu-images`, set envs.
- Vercel: backend root `backend`, frontend root `frontend`, envs SUPABASE_URL/SERVICE_ROLE/ANON/JWT_SECRET/ALLOWED_ORIGINS, VITE_API_URL.

## Decisions
- Keep single-app routing (no separate admin deploy) — simpler, matches current.
- WhatsApp over custom checkout — zero backend, fits cafe/bakery.
- Heritage palette over previous green/brown — more premium, gold accent for bakery warmth.
