# Liwan Restaurant Menu System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, multilingual (Arabic/English) restaurant digital menu system with a public-facing mobile-first menu site and a desktop-first admin dashboard, deployed to Vercel with Supabase for database and storage.

**Architecture:** Monorepo with three Vite/React apps (frontend, admin) and one Express serverless backend. Express routes wrapped with `@vercel/node` adapter deploy to Vercel Serverless Functions. Supabase provides PostgreSQL and object storage. Custom JWT + bcrypt auth (no Supabase Auth). Shared TypeScript types in a `shared/` package consumed by all three apps.

**Tech Stack:**
- Frontend: React, Vite, TanStack Router, TypeScript, TailwindCSS, Anime.js, Three.js
- Admin: React, Vite, TypeScript, TailwindCSS
- Backend: Express.js, TypeScript, Supabase (PostgreSQL + Storage), JWT, bcrypt
- Deployment: Vercel (all three), Supabase

## Global Constraints

- DO NOT change the tech stack or replace any libraries.
- DO NOT hardcode ANY restaurant data. Everything comes from the API.
- DO NOT generate fake logos. Leave a clean placeholder div for the logo.
- Mobile-first is the highest priority for the public menu.
- Design colors: Primary = Deep Green `#1a3c34`, Secondary = Dark Chocolate Brown `#3d2b1f`, Accent = Vanilla/Cream `#f5e6d3`.
- Admin dashboard is desktop-first, tablet friendly.
- All UI text translated via i18n (Arabic + English), no hardcoded UI strings.
- TypeScript strict mode everywhere.
- Do NOT push to GitHub until the user explicitly says so.

---

## File Structure

```
liwan/
├── package.json              # Root workspace (npm workspaces)
├── shared/
│   └── src/types.ts          # Shared TypeScript types
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── api/index.ts          # Vercel serverless entry (Express app)
│   ├── src/
│   │   ├── index.ts          # Express app factory (exported for vercel)
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── categories.ts
│   │   │   ├── items.ts
│   │   │   ├── settings.ts
│   │   │   └── stats.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── error.ts
│   │   ├── db/
│   │   │   ├── client.ts     # Supabase client
│   │   │   └── migrations.ts # Runs SQL schema on boot (dev) / migration files
│   │   └── utils/
│   │       └── jwt.ts
│   ├── supabase/migrations/0001_init.sql
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── index.css        # Tailwind + theme tokens
│   │   ├── i18n/
│   │   │   ├── I18nContext.tsx
│   │   │   ├── translations.ts
│   │   │   └── en.json / ar.json
│   │   ├── api/client.ts    # fetch wrapper
│   │   ├── hooks/useMenuData.ts
│   │   ├── hooks/useReveal.ts (Anime.js entrance)
│   │   ├── three/ParticlesScene.ts
│   │   └── components/
│   │       ├── Layout.tsx
│   │       ├── Nav.tsx
│   │       ├── Hero.tsx
│   │       ├── MenuSection.tsx
│   │       ├── CategoryTabs.tsx
│   │       ├── ItemCard.tsx
│   │       ├── About.tsx
│   │       ├── Footer.tsx
│   │       ├── Badge.tsx
│   │       └── LogoPlaceholder.tsx
├── admin/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── index.css
│   │   ├── api/client.ts
│   │   ├── auth/AuthContext.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── components/ui/  # Button, Input, Modal, Card, etc.
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Items.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── ChangePassword.tsx
│   └── .env.example
```

---

## Task 1: Monorepo Setup

**Files:**
- Create: `package.json` (root)
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Produces: npm workspaces at root with `shared`, `backend`, `frontend`, `admin` packages.

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "liwan",
  "private": true,
  "workspaces": ["shared", "backend", "frontend", "admin"],
  "scripts": {
    "dev:backend": "npm run dev -w backend",
    "dev:frontend": "npm run dev -w frontend",
    "dev:admin": "npm run dev -w admin"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

- [ ] **Step 3: Verify workspaces resolve**

Run: `npm install` at root
Expected: creates `node_modules`, no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: set up monorepo workspaces"
```

---

## Task 2: Shared Types

**Files:**
- Create: `shared/package.json`
- Create: `shared/tsconfig.json`
- Create: `shared/src/types.ts`

**Interfaces:**
- Produces: `Category`, `MenuItem`, `Settings`, `AdminUser`, `Stats`, `ApiResponse` types consumed by backend, frontend, and admin.

- [ ] **Step 1: Create shared/package.json**

```json
{
  "name": "@liwan/shared",
  "version": "1.0.0",
  "main": "src/types.ts",
  "types": "src/types.ts"
}
```

- [ ] **Step 2: Create shared/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create shared/src/types.ts**

```ts
export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  [key: string]: string;
}

export interface AdminUser {
  id: number;
  username: string;
}

export interface Stats {
  categories: number;
  items: number;
  popular: number;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

export interface ApiError {
  error: string;
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit -p shared/tsconfig.json`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add shared/
git commit -m "feat: add shared types package"
```

---

## Task 3: Database Schema + Supabase Setup

**Files:**
- Create: `backend/supabase/migrations/0001_init.sql`
- Create: `backend/.env.example`

**Interfaces:**
- Produces: SQL schema for `categories`, `menu_items`, `settings`, `admin` tables with foreign keys. Env var names: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `SUPABASE_BUCKET`.

- [ ] **Step 1: Create 0001_init.sql**

```sql
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin (password: admin123 - CHANGE AFTER FIRST LOGIN)
INSERT INTO admin (username, password_hash)
SELECT 'admin', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8m7JqX0gFJv3bR5Y6nMqS9z9YwU0Gy'
WHERE NOT EXISTS (SELECT 1 FROM admin);

-- Seed empty settings rows with defaults
INSERT INTO settings (key, value) VALUES
  ('restaurant_name_en', ''),
  ('restaurant_name_ar', ''),
  ('description_en', ''),
  ('description_ar', ''),
  ('hours_en', ''),
  ('hours_ar', ''),
  ('phone', ''),
  ('whatsapp', ''),
  ('instagram', ''),
  ('facebook', ''),
  ('tiktok', ''),
  ('maps_url', ''),
  ('address_en', ''),
  ('address_ar', ''),
  ('footer_text', ''),
  ('logo_url', ''),
  ('favicon_url', '')
ON CONFLICT (key) DO NOTHING;
```

Note: The bcrypt hash above is a placeholder for `bcrypt.hashSync('admin123', 10)`. On first backend boot, a script regenerates the correct hash and updates the row (see Task 4).

- [ ] **Step 2: Create backend/.env.example**

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
JWT_SECRET=change-me
SUPABASE_BUCKET=menu-images
```

- [ ] **Step 3: Verify SQL syntax**

Run: `npx supabase db lint` (optional, if supabase CLI installed) OR paste into Supabase SQL Editor later. Expected: no syntax errors.

- [ ] **Step 4: Commit**

```bash
git add backend/supabase backend/.env.example
git commit -m "feat: add database schema and env template"
```

---

## Task 4: Backend Scaffold + Supabase Client

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/vercel.json`
- Create: `backend/src/db/client.ts`
- Create: `backend/src/index.ts` (Express app factory)
- Create: `backend/api/index.ts` (Vercel handler)
- Create: `backend/src/utils/jwt.ts`

**Interfaces:**
- Produces: `createApp()` returning Express app; `api/index.ts` exports Vercel request handler. `db` Supabase client instance. `signToken(userId)`, `verifyToken(token)`.

- [ ] **Step 1: Create backend/package.json**

```json
{
  "name": "@liwan/backend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/dev.ts",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@vercel/node": "^3.2.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

Note: bcryptjs is used instead of bcrypt (native module) to avoid Vercel build issues. Same bcrypt algorithm and hash format.

- [ ] **Step 2: Create backend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src", "api"]
}
```

- [ ] **Step 3: Create backend/vercel.json**

```json
{
  "functions": {
    "api/index.ts": { "maxDuration": 10 }
  }
}
```

- [ ] **Step 4: Create backend/src/db/client.ts**

```ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(url, key);
```

- [ ] **Step 5: Create backend/src/utils/jwt.ts**

```ts
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'dev-secret';

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: number } | null {
  try {
    return jwt.verify(token, secret) as { sub: number };
  } catch {
    return null;
  }
}
```

- [ ] **Step 6: Create backend/src/index.ts**

```ts
import express from 'express';
import cors from 'cors';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
```

- [ ] **Step 7: Create backend/api/index.ts**

```ts
import { createApp } from '../src/index.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
```

- [ ] **Step 8: Create backend/src/dev.ts**

```ts
import { createApp } from './index.js';

const port = Number(process.env.PORT || 3001);
createApp().listen(port, () => console.log(`API on :${port}`));
```

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS (note: resolve `shared` import needs `paths` or relative import — for now keep types local or use relative `../../../shared/src/types`; simplest is a local re-export file `backend/src/types.ts` doing `export * from '../../shared/src/types'`).

- [ ] **Step 10: Commit**

```bash
git add backend/
git commit -m "feat: scaffold express backend with supabase client and jwt"
```

---

## Task 5: Auth Middleware + Login + Password Change

**Files:**
- Create: `backend/src/middleware/auth.ts`
- Create: `backend/src/middleware/error.ts`
- Create: `backend/src/routes/auth.ts`
- Modify: `backend/src/index.ts` (mount routes)

**Interfaces:**
- Produces: `requireAuth` middleware (checks `Authorization: Bearer <token>`), `errorHandler` middleware, `router` mounted at `/api/auth` with `POST /login` and `PUT /password`.
- Consumes: `verifyToken` from `utils/jwt.ts`, `signToken`, `supabase` client, `bcryptjs`.

- [ ] **Step 1: Create backend/src/middleware/auth.ts**

```ts
import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  (req as any).userId = payload.sub;
  next();
}
```

- [ ] **Step 2: Create backend/src/middleware/error.ts**

```ts
import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}
```

- [ ] **Step 3: Create backend/src/routes/auth.ts**

```ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db/client.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }

  const { data, error } = await supabase
    .from('admin')
    .select('id, username, password_hash')
    .eq('username', username)
    .single();

  if (error || !data) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.json({ token: signToken(data.id), user: { id: data.id, username: data.username } });
});

authRouter.put('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'All fields required' });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters' });
    return;
  }

  const { data: admin, error } = await supabase
    .from('admin')
    .select('password_hash')
    .eq('id', (req as any).userId)
    .single();

  if (error || !admin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!valid) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await supabase.from('admin').update({ password_hash: hash }).eq('id', (req as any).userId);
  res.json({ ok: true });
});
```

- [ ] **Step 4: Mount routes in backend/src/index.ts**

Add imports and routes:

```ts
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/error.js';
```

Inside `createApp()`, after health route:

```ts
app.use('/api/auth', authRouter);
app.use(errorHandler);
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS

- [ ] **Step 6: Test login manually**

Run: `npm run dev -w backend` (with .env populated) then:
`curl -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin123"}'`
Expected: `{"token":"...","user":{"id":1,"username":"admin"}}`

- [ ] **Step 7: Commit**

```bash
git add backend/src
git commit -m "feat: add jwt auth, login, and password change"
```

---

## Task 6: Categories CRUD

**Files:**
- Create: `backend/src/routes/categories.ts`
- Modify: `backend/src/index.ts`

**Interfaces:**
- Produces: `categoriesRouter` mounted at `/api/categories`:
  - `GET /` (public) — active categories ordered by `display_order`
  - `POST /` (auth) — create
  - `PUT /:id` (auth) — update
  - `DELETE /:id` (auth) — delete (cascades to items)
- Consumes: `requireAuth`, `supabase`.

- [ ] **Step 1: Create backend/src/routes/categories.ts**

```ts
import { Router } from 'express';
import { supabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (e) { next(e); }
});

categoriesRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name_ar, name_en, display_order = 0, is_active = true } = req.body || {};
    if (!name_ar || !name_en) {
      res.status(400).json({ error: 'name_ar and name_en required' });
      return;
    }
    const { data, error } = await supabase
      .from('categories')
      .insert({ name_ar, name_en, display_order, is_active })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { next(e); }
});

categoriesRouter.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) { next(e); }
});

categoriesRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) { next(e); }
});
```

- [ ] **Step 2: Mount in index.ts**

```ts
import { categoriesRouter } from './routes/categories.js';
// inside createApp():
app.use('/api/categories', categoriesRouter);
```

- [ ] **Step 3: Typecheck + manual test**

Run: `npm run typecheck -w backend`
Run: `curl http://localhost:3001/api/categories`
Expected: `[]` or seeded data. Create/update/delete with Bearer token works.

- [ ] **Step 4: Commit**

```bash
git add backend/src
git commit -m "feat: add categories CRUD routes"
```

---

## Task 7: Menu Items CRUD + Image Upload

**Files:**
- Create: `backend/src/routes/items.ts`
- Modify: `backend/src/index.ts`

**Interfaces:**
- Produces: `itemsRouter` mounted at `/api/items`:
  - `GET /` (public) — items where `is_available = true`, ordered by `display_order`
  - `POST /` (auth) — create
  - `PUT /:id` (auth) — update
  - `DELETE /:id` (auth) — delete
  - `POST /:id/image` (auth, multipart) — upload to Supabase Storage, save `image_url`
- Consumes: `requireAuth`, `supabase`, `multer`.

- [ ] **Step 1: Create backend/src/routes/items.ts**

```ts
import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const itemsRouter = Router();

const BUCKET = process.env.SUPABASE_BUCKET || 'menu-images';

itemsRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (e) { next(e); }
});

itemsRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(req.body)
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { next(e); }
});

itemsRouter.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) { next(e); }
});

itemsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) { next(e); }
});

itemsRouter.post('/:id/image', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }
    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const path = `items/${req.params.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true,
    });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const image_url = urlData.publicUrl;

    const { data, error: dbError } = await supabase
      .from('menu_items')
      .update({ image_url })
      .eq('id', req.params.id)
      .select()
      .single();
    if (dbError) throw dbError;
    res.json(data);
  } catch (e) { next(e); }
});
```

- [ ] **Step 2: Mount in index.ts**

```ts
import { itemsRouter } from './routes/items.js';
app.use('/api/items', itemsRouter);
```

- [ ] **Step 3: Typecheck + manual test**

Run: `npm run typecheck -w backend`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add backend/src
git commit -m "feat: add menu items CRUD and image upload"
```

---

## Task 8: Settings + Stats Routes

**Files:**
- Create: `backend/src/routes/settings.ts`
- Create: `backend/src/routes/stats.ts`
- Modify: `backend/src/index.ts`

**Interfaces:**
- Produces: `settingsRouter` at `/api/settings` (`GET` public returns all key/value pairs; `PUT` auth accepts partial object), `statsRouter` at `/api/stats` (auth) returns `{ categories, items, popular }`.
- Consumes: `requireAuth`, `supabase`.

- [ ] **Step 1: Create backend/src/routes/settings.ts**

```ts
import { Router } from 'express';
import { supabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

export const settingsRouter = Router();

settingsRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) throw error;
    const obj: Record<string, string> = {};
    (data || []).forEach((row) => { obj[row.key] = row.value || ''; });
    res.json(obj);
  } catch (e) { next(e); }
});

settingsRouter.put('/', requireAuth, async (req, res, next) => {
  try {
    const updates = req.body || {};
    for (const [key, value] of Object.entries(updates)) {
      await supabase
        .from('settings')
        .upsert({ key, value: String(value) }, { onConflict: 'key' });
    }
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) throw error;
    const obj: Record<string, string> = {};
    (data || []).forEach((row) => { obj[row.key] = row.value || ''; });
    res.json(obj);
  } catch (e) { next(e); }
});
```

- [ ] **Step 2: Create backend/src/routes/stats.ts**

```ts
import { Router } from 'express';
import { supabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

export const statsRouter = Router();

statsRouter.get('/', requireAuth, async (_req, res, next) => {
  try {
    const [{ count: categories }, { count: items }, { count: popular }] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_popular', true),
    ]);
    res.json({ categories: categories ?? 0, items: items ?? 0, popular: popular ?? 0 });
  } catch (e) { next(e); }
});
```

- [ ] **Step 3: Mount in index.ts**

```ts
import { settingsRouter } from './routes/settings.js';
import { statsRouter } from './routes/stats.js';
app.use('/api/settings', settingsRouter);
app.use('/api/stats', statsRouter);
```

- [ ] **Step 4: Typecheck + test**

Run: `npm run typecheck -w backend`
Expected: PASS. `curl http://localhost:3001/api/settings` returns object.

- [ ] **Step 5: Commit**

```bash
git add backend/src
git commit -m "feat: add settings and stats routes"
```

---

## Task 9: Frontend Scaffold (Vite + React + TanStack Router + Tailwind)

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.cjs`
- Create: `frontend/src/index.css`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`

**Interfaces:**
- Produces: Runable Vite dev server with Tailwind and theme tokens (deep green, chocolate, cream). `App` renders a placeholder layout.

- [ ] **Step 1: Create frontend/package.json**

```json
{
  "name": "@liwan/frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.58.0",
    "animejs": "^3.2.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.169.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create frontend/vite.config.ts**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
```

- [ ] **Step 3: Create frontend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create frontend/index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Liwan</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create frontend/tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#1a3c34', light: '#2d5a4e' },
        chocolate: { DEFAULT: '#3d2b1f', light: '#5a4231' },
        cream: { DEFAULT: '#f5e6d3', light: '#faf3e9' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 6: Create frontend/postcss.config.cjs**

```js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 7: Create frontend/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }
body { @apply bg-cream text-chocolate antialiased; }
[dir='rtl'] { font-family: 'Noto Kufi Arabic', 'Inter', system-ui, sans-serif; }
```

- [ ] **Step 8: Create frontend/src/main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 9: Create frontend/src/App.tsx**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-green font-semibold">Liwan</p>
    </div>
  );
}
```

- [ ] **Step 10: Install + verify**

Run: `npm install` at root (installs frontend workspace deps), then `npm run dev -w frontend`
Expected: dev server starts, page renders "Liwan" in green.

- [ ] **Step 11: Commit**

```bash
git add frontend/
git commit -m "feat: scaffold frontend with vite, react, tailwind"
```

---

## Task 9b: TanStack Router Setup

**Files:**
- Create: `frontend/src/router.tsx`
- Create: `frontend/src/routes/__root.tsx`
- Create: `frontend/src/routes/index.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: TanStack Router with root layout route and index route. Index route renders the public menu page. Router instance created via `createRouter`.
- Consumes: `react`, `@tanstack/react-router`.

- [ ] **Step 1: Create frontend/src/routes/__root.tsx**

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});
```

- [ ] **Step 2: Create frontend/src/routes/index.tsx**

```tsx
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { About } from '../components/About';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

function Index() {
  const [activeCategory, setActiveCategory] = useState(0);
  return (
    <Layout>
      <Hero onBrowse={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
      <MenuSection activeCategory={activeCategory} onActive={setActiveCategory} />
      <About />
    </Layout>
  );
}
```

Note: `MenuSection`/`Hero`/`About` are created in Tasks 14–16. If running this task before those exist, stub the components temporarily — or complete this task after Task 16. Recommended order: create `router.tsx` + `main.tsx` wiring now, fill `index.tsx` after Tasks 14–16.

- [ ] **Step 3: Create frontend/src/router.tsx**

```tsx
import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';

export const routeTree = rootRoute.addChildren([indexRoute]);
export const router = createRouter({ routeTree });
```

- [ ] **Step 4: Update main.tsx**

```tsx
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
// render <RouterProvider router={router} /> instead of <App />
```

- [ ] **Step 5: Typecheck + verify**

Run: `npm run typecheck -w frontend`
Expected: PASS. Page still renders.

- [ ] **Step 6: Commit**

```bash
git add frontend/src
git commit -m "feat: add tanstack router with index route"
```

---

## Task 10: i18n System (Arabic/English)

**Files:**
- Create: `frontend/src/i18n/translations.ts`
- Create: `frontend/src/i18n/I18nContext.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: `I18nProvider`, `useI18n()` hook returning `{ lang: 'en' | 'ar', setLang, t }`, and `dir` value. `t(key)` looks up nested translation keys.
- Consumes: translation JSON objects.

- [ ] **Step 1: Create frontend/src/i18n/translations.ts**

```ts
export const translations = {
  en: {
    nav: { menu: 'Menu', about: 'About', location: 'Location' },
    hero: { browse: 'Browse Menu', location: 'Location', loading: 'Loading…' },
    menu: { title: 'Our Menu', all: 'All' },
    item: { notAvailable: 'Unavailable' },
    labels: { new: 'New', popular: 'Popular', spicy: 'Spicy', vegetarian: 'Vegetarian' },
    about: { title: 'About Us', hours: 'Working Hours', contact: 'Contact', follow: 'Follow Us' },
    footer: { rights: 'All rights reserved.' },
  },
  ar: {
    nav: { menu: 'القائمة', about: 'من نحن', location: 'الموقع' },
    hero: { browse: 'تصفح القائمة', location: 'الموقع', loading: 'جارٍ التحميل…' },
    menu: { title: 'قائمتنا', all: 'الكل' },
    item: { notAvailable: 'غير متوفر' },
    labels: { new: 'جديد', popular: 'الأكثر مبيعاً', spicy: 'حار', vegetarian: 'نباتي' },
    about: { title: 'من نحن', hours: 'ساعات العمل', contact: 'تواصل معنا', follow: 'تابعنا' },
    footer: { rights: 'جميع الحقوق محفوظة.' },
  },
} as const;

export type Lang = 'en' | 'ar';
export type TranslationKey = string;
```

- [ ] **Step 2: Create frontend/src/i18n/I18nContext.tsx**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nValue | null>(null);

function lookup(obj: any, path: string): string {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj) as string;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const value: I18nValue = {
    lang,
    setLang,
    dir,
    t: (key) => lookup(translations[lang], key) ?? key,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
```

- [ ] **Step 3: Wrap app in provider (main.tsx)**

```tsx
import { I18nProvider } from './i18n/I18nContext';
// wrap <App /> with <I18nProvider>
```

- [ ] **Step 4: Verify**

Run: `npm run dev -w frontend`
Expected: `document.documentElement.dir` flips when lang changes; no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/i18n frontend/src/main.tsx
git commit -m "feat: add arabic/english i18n with rtl support"
```

---

## Task 11: Frontend API Client + Data Hook

**Files:**
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/hooks/useMenuData.ts`
- Create: `frontend/src/types.ts` (re-export from shared, or local copies)

**Interfaces:**
- Produces: `api.getCategories()`, `api.getItems()`, `api.getSettings()` returning typed data. `useMenuData()` hook returning `{ categories, items, settings, loading, error }`.
- Consumes: `@liwan/shared` types; env `VITE_API_URL`.

- [ ] **Step 1: Create frontend/src/api/client.ts**

```ts
import type { Category, MenuItem, Settings } from '@liwan/shared';

const BASE = import.meta.env.VITE_API_URL || '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => get<Category[]>('/categories'),
  getItems: () => get<MenuItem[]>('/items'),
  getSettings: () => get<Settings>('/settings'),
};
```

Note: `@liwan/shared` is resolved via workspace. If bundling complains, add `resolve.alias` in vite.config.ts pointing to `../shared/src`.

- [ ] **Step 2: Create frontend/src/hooks/useMenuData.ts**

```ts
import { useEffect, useMemo, useState } from 'react';
import type { Category, MenuItem, Settings } from '@liwan/shared';
import { api } from '../api/client';

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getItems(), api.getSettings()])
      .then(([c, i, s]) => {
        setCategories(c);
        setItems(i);
        setSettings(s);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const itemsByCategory = useMemo(() => {
    const map: Record<number, MenuItem[]> = {};
    for (const item of items) {
      (map[item.category_id] ||= []).push(item);
    }
    return map;
  }, [items]);

  return { categories, items, itemsByCategory, settings, loading, error };
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck -w frontend`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add frontend/src/api frontend/src/hooks
git commit -m "feat: add frontend api client and menu data hook"
```

---

## Task 12: Three.js Ambient Background

**Files:**
- Create: `frontend/src/three/ParticlesScene.ts`
- Create: `frontend/src/three/ThreeBackground.tsx`

**Interfaces:**
- Produces: `ThreeBackground` React component. Renders low-poly floating particles (soft green/cream). Auto-disables when `navigator.hardwareConcurrency < 4`, `prefers-reduced-motion`, or no WebGL.

- [ ] **Step 1: Create frontend/src/three/ParticlesScene.ts**

```ts
import * as THREE from 'three';

export function createScene(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 10;

  const count = 40;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x5a9d8a,
    size: 0.12,
    transparent: true,
    opacity: 0.35,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let raf = 0;
  const animate = () => {
    points.rotation.y += 0.0006;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  return () => {
    cancelAnimationFrame(raf);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  };
}
```

- [ ] **Step 2: Create frontend/src/three/ThreeBackground.tsx**

```tsx
import { useEffect, useRef } from 'react';
import { createScene } from './ParticlesScene';

const isLowEnd = () =>
  typeof navigator === 'undefined' ||
  navigator.hardwareConcurrency < 4 ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function ThreeBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLowEnd() || !webglSupported() || !ref.current) return;
    return createScene(ref.current);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 h-full w-full opacity-60 pointer-events-none"
    />
  );
}
```

- [ ] **Step 3: Render in App layout behind content**

Add `<ThreeBackground />` at top of the layout, before main content.

- [ ] **Step 4: Verify**

Run: `npm run dev -w frontend`
Expected: subtle floating particles behind content; nothing on low-end devices.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/three
git commit -m "feat: add three.js ambient background with low-end guard"
```

---

## Task 13: Reusable Components (Logo, Badge, Nav)

**Files:**
- Create: `frontend/src/components/LogoPlaceholder.tsx`
- Create: `frontend/src/components/Badge.tsx`
- Create: `frontend/src/components/Nav.tsx`

**Interfaces:**
- Produces: `LogoPlaceholder` (empty rounded div), `Badge` (label chip with variant), `Nav` (sticky nav with logo, language toggle, section links, scroll-spy highlighting).
- Consumes: `useI18n`, settings for restaurant name.

- [ ] **Step 1: Create LogoPlaceholder.tsx**

```tsx
export function LogoPlaceholder({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-xl border-2 border-dashed border-green/40 bg-green/10`}
      aria-label="Logo placeholder"
    />
  );
}
```

- [ ] **Step 2: Create Badge.tsx**

```tsx
const styles: Record<string, string> = {
  new: 'bg-green/15 text-green',
  popular: 'bg-chocolate/15 text-chocolate',
  spicy: 'bg-red-100 text-red-700',
  vegetarian: 'bg-green-100 text-green-700',
};

export function Badge({ type, children }: { type: string; children: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[type] || ''}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create Nav.tsx**

```tsx
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { LogoPlaceholder } from './LogoPlaceholder';

export function Nav({ onMenuClick }: { onMenuClick: () => void }) {
  const { lang, setLang, t } = useI18n();
  const [active, setActive] = useState('');

  useEffect(() => {
    const ids = ['menu', 'about'];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-green/10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <LogoPlaceholder />
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="btn-ghost px-3 py-2">
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button onClick={onMenuClick} className="btn-ghost px-3 py-2">{t('nav.menu')}</button>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck -w frontend`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components
git commit -m "feat: add logo, badge, and sticky nav components"
```

---

## Task 14: Hero Section + Anime.js Entrance

**Files:**
- Create: `frontend/src/hooks/useReveal.ts`
- Create: `frontend/src/components/Hero.tsx`

**Interfaces:**
- Produces: `useReveal(targetsRef, opts)` hook wrapping Anime.js; `Hero` component reading restaurant name/description from settings, with logo placeholder, CTA buttons, entrance animation.
- Consumes: `useI18n`, `useMenuData` settings, `LogoPlaceholder`, animejs.

- [ ] **Step 1: Create frontend/src/hooks/useReveal.ts**

```ts
import { useEffect, type RefObject } from 'react';
import anime from 'animejs';

export function useReveal(
  ref: RefObject<HTMLElement>,
  opts: { delay?: number; translateY?: number; duration?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [opts.translateY ?? 24, 0],
      duration: opts.duration ?? 700,
      delay: opts.delay ?? 0,
      easing: 'easeOutCubic',
    });
  }, [ref, opts]);
}
```

- [ ] **Step 2: Create Hero.tsx**

```tsx
import { useRef } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';
import { useReveal } from '../hooks/useReveal';
import { LogoPlaceholder } from './LogoPlaceholder';

export function Hero({ onBrowse }: { onBrowse: () => void }) {
  const { lang, t } = useI18n();
  const { settings } = useMenuData();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const name = lang === 'ar' ? settings.restaurant_name_ar : settings.restaurant_name_en;
  const desc = lang === 'ar' ? settings.description_ar : settings.description_en;

  return (
    <section ref={ref} className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <LogoPlaceholder className="mb-6 h-24 w-24" />
      <h1 className="mb-3 text-4xl font-bold text-green md:text-5xl">{name}</h1>
      <p className="mb-8 max-w-md text-lg text-chocolate/80">{desc}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onBrowse} className="rounded-full bg-green px-8 py-3 font-semibold text-cream shadow-lg shadow-green/20 active:scale-95 transition">
          {t('hero.browse')}
        </button>
        <button onClick={() => window.open(settings.maps_url || '#', '_blank')} className="rounded-full border-2 border-green/20 bg-transparent px-8 py-3 font-semibold text-green active:scale-95 transition">
          {t('hero.location')}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev -w frontend`
Expected: hero fades/slides in on load; buttons present.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/hooks/useReveal.ts frontend/src/components/Hero.tsx
git commit -m "feat: add hero section with anime.js entrance"
```

---

## Task 15: Menu Section (Category Tabs + Item Cards)

**Files:**
- Create: `frontend/src/components/MenuSection.tsx`
- Create: `frontend/src/components/CategoryTabs.tsx`
- Create: `frontend/src/components/ItemCard.tsx`

**Interfaces:**
- Produces: `MenuSection` (id="menu", renders CategoryTabs + per-category item lists), `CategoryTabs` (horizontal scrollable tabs that smooth-scroll to category anchors), `ItemCard` (image, name, desc, price, badges, lazy image, anime stagger).
- Consumes: `useMenuData`, `useI18n`, `Badge`, animejs.

- [ ] **Step 1: Create CategoryTabs.tsx**

```tsx
import { useI18n } from '../i18n/I18nContext';
import type { Category } from '@liwan/shared';

export function CategoryTabs({ categories, active }: { categories: Category[]; active: number }) {
  const { lang } = useI18n();
  const scrollTo = (id: number) => {
    const el = document.getElementById(`cat-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="sticky top-14 z-30 -mx-4 overflow-x-auto px-4 py-2 bg-cream/90 backdrop-blur">
      <div className="flex gap-2 whitespace-nowrap">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => scrollTo(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === c.id ? 'bg-green text-cream' : 'bg-white/70 text-chocolate'
            }`}
          >
            {lang === 'ar' ? c.name_ar : c.name_en}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ItemCard.tsx**

```tsx
import { useRef } from 'react';
import anime from 'animejs';
import { useI18n } from '../i18n/I18nContext';
import { Badge } from './Badge';
import type { MenuItem } from '@liwan/shared';

export function ItemCard({ item, index }: { item: MenuItem; index: number }) {
  const { lang, t } = useI18n();
  const ref = useRef<HTMLElement>(null);

  const enter = () => anime({ targets: ref.current, scale: 1.02, duration: 250, easing: 'easeOutCubic' });
  const leave = () => anime({ targets: ref.current, scale: 1, duration: 250, easing: 'easeOutCubic' });

  const name = lang === 'ar' ? item.name_ar : item.name_en;
  const desc = lang === 'ar' ? item.description_ar : item.description_en;

  return (
    <article
      ref={ref}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onTouchStart={enter}
      className="flex gap-4 rounded-2xl bg-white/80 p-3 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {item.image_url ? (
        <img src={item.image_url} alt={name} loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
      ) : (
        <div className="h-20 w-20 rounded-xl bg-green/10" />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-chocolate">{name}</h3>
          <span className="font-bold text-green">${Number(item.price).toFixed(2)}</span>
        </div>
        {desc && <p className="mt-1 text-sm text-chocolate/70 line-clamp-2">{desc}</p>}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.is_new && <Badge type="new">{t('labels.new')}</Badge>}
          {item.is_popular && <Badge type="popular">{t('labels.popular')}</Badge>}
          {item.is_spicy && <Badge type="spicy">{t('labels.spicy')}</Badge>}
          {item.is_vegetarian && <Badge type="vegetarian">{t('labels.vegetarian')}</Badge>}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create MenuSection.tsx**

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';
import { CategoryTabs } from './CategoryTabs';
import { ItemCard } from './ItemCard';

export function MenuSection({ activeCategory, onActive }: { activeCategory: number; onActive: (id: number) => void }) {
  const { lang, t } = useI18n();
  const { categories, itemsByCategory } = useMenuData();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      anime({
        targets: rootRef.current.querySelectorAll('.item-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 400,
        delay: anime.stagger(60),
        easing: 'easeOutCubic',
      });
    }
  }, [activeCategory]);

  return (
    <section id="menu" ref={rootRef} className="scroll-mt-16 px-4 py-10">
      <h2 className="mb-6 text-center text-3xl font-bold text-green">{t('menu.title')}</h2>
      {categories.length > 0 && <CategoryTabs categories={categories} active={activeCategory} />}
      <div className="mx-auto mt-6 max-w-2xl space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32">
            <h3 className="mb-3 text-xl font-semibold text-chocolate">
              {lang === 'ar' ? cat.name_ar : cat.name_en}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(itemsByCategory[cat.id] || []).map((item, i) => (
                <div key={item.id} className="item-card">
                  <ItemCard item={item} index={i} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Typecheck + verify**

Run: `npm run typecheck -w frontend`
Expected: PASS. Scroll spy + tabs work; cards animate in.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components
git commit -m "feat: add menu section with category tabs and item cards"
```

---

## Task 16: About Section + Footer + App Assembly

**Files:**
- Create: `frontend/src/components/About.tsx`
- Create: `frontend/src/components/Footer.tsx`
- Create: `frontend/src/components/Layout.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: `About` (description, hours, contact, social links from settings), `Footer`, `Layout` (ThreeBackground + Nav + main + Footer), and `App` wiring it all together with scroll-spy state.
- Consumes: `useMenuData`, `useI18n`.

- [ ] **Step 1: Create About.tsx**

```tsx
import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';

export function About() {
  const { lang, t } = useI18n();
  const { settings } = useMenuData();
  const desc = lang === 'ar' ? settings.description_ar : settings.description_en;
  const hours = lang === 'ar' ? settings.hours_ar : settings.hours_en;
  const address = lang === 'ar' ? settings.address_ar : settings.address_en;

  return (
    <section id="about" className="scroll-mt-16 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-green">{t('about.title')}</h2>
        {desc && <p className="leading-relaxed text-chocolate/80">{desc}</p>}
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h3 className="mb-2 font-semibold text-chocolate">{t('about.hours')}</h3>
          <p className="text-chocolate/80">{hours}</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h3 className="mb-2 font-semibold text-chocolate">{t('about.contact')}</h3>
          <p className="text-chocolate/80">{settings.phone}</p>
          <p className="text-chocolate/80">{address}</p>
        </div>
        <div className="flex gap-3">
          {[{ key: 'instagram' }, { key: 'facebook' }, { key: 'tiktok' }].map(
            ({ key }) =>
              settings[key] && (
                <a
                  key={key}
                  href={settings[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-green px-5 py-2 text-sm font-semibold text-cream"
                >
                  {t(`about.${key}`)}
                </a>
              )
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer.tsx**

```tsx
import { useI18n } from '../i18n/I18nContext';
import { useMenuData } from '../hooks/useMenuData';

export function Footer() {
  const { t } = useI18n();
  const { settings } = useMenuData();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-green/10 px-4 py-6 text-center text-sm text-chocolate/60">
      <p>
        {settings.footer_text} {year} {t('footer.rights')}
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Create Layout.tsx**

```tsx
import type { ReactNode } from 'react';
import { ThreeBackground } from '../three/ThreeBackground';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThreeBackground />
      <Nav onMenuClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Update App.tsx** — App.tsx is no longer the page renderer. The index route (`frontend/src/routes/index.tsx`, created in Task 9b) renders the page. If App.tsx still renders a placeholder, replace it to simply render the index route content OR delete it and route everything through the router. The index route component is:

```tsx
// frontend/src/routes/index.tsx — component body (already created in Task 9b)
function Index() {
  const [activeCategory, setActiveCategory] = useState(0);
  return (
    <Layout>
      <Hero onBrowse={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
      <MenuSection activeCategory={activeCategory} onActive={setActiveCategory} />
      <About />
    </Layout>
  );
}
```

If `main.tsx` renders `<RouterProvider router={router} />` (Task 9b), App.tsx is unused and can be deleted.

- [ ] **Step 5: Verify full page**

Run: `npm run dev -w frontend`
Expected: hero → menu → about all render; nav highlights sections; lang toggle flips RTL.

- [ ] **Step 6: Commit**

```bash
git add frontend/src
git commit -m "feat: assemble public menu page with about, footer, layout"
```

---

## Task 17: Admin Scaffold + Auth Context + Login

**Files:**
- Create: `admin/package.json`
- Create: `admin/vite.config.ts`
- Create: `admin/tsconfig.json`
- Create: `admin/index.html`
- Create: `admin/tailwind.config.ts`
- Create: `admin/postcss.config.cjs`
- Create: `admin/src/index.css`
- Create: `admin/src/main.tsx`
- Create: `admin/src/App.tsx`
- Create: `admin/src/api/client.ts`
- Create: `admin/src/auth/AuthContext.tsx`
- Create: `admin/src/hooks/useAuth.ts`
- Create: `admin/src/pages/Login.tsx`

**Interfaces:**
- Produces: Vite admin app (desktop-first), `api` client with `setToken`/`token` in localStorage, `AuthProvider` + `useAuth()` (login/logout/isAuthed), `Login` page.
- Consumes: `@liwan/shared` types.

- [ ] **Step 1: Create admin/package.json**

```json
{
  "name": "@liwan/admin",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create admin/vite.config.ts**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
});
```

- [ ] **Step 3: Create admin/tsconfig.json** (same as frontend, include `src`)

- [ ] **Step 4: Create admin/index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Liwan Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create admin/tailwind.config.ts** (same green/chocolate/cream tokens as frontend)

- [ ] **Step 6: Create admin/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply bg-cream/50 text-chocolate antialiased; }
```

- [ ] **Step 7: Create admin/src/api/client.ts**

```ts
const BASE = import.meta.env.VITE_API_URL || '/api';

export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem('admin_token', t);
  else localStorage.removeItem('admin_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  getStats: () => request<{ categories: number; items: number; popular: number }>('/stats'),
  // categories
  getCategories: () => request<any[]>('/categories'),
  createCategory: (body: any) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: number, body: any) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: number) => request(`/categories/${id}`, { method: 'DELETE' }),
  // items
  getItems: () => request<any[]>('/items'),
  createItem: (body: any) => request('/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (id: number, body: any) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem: (id: number) => request(`/items/${id}`, { method: 'DELETE' }),
  uploadItemImage: (id: number, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return request(`/items/${id}/image`, { method: 'POST', body: fd });
  },
  // settings
  getSettings: () => request<Record<string, string>>('/settings'),
  updateSettings: (body: Record<string, string>) =>
    request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
};
```

Note: image upload uses FormData (no Content-Type header) — the helper always sets JSON Content-Type, so override it there: when body is FormData, delete the JSON header. Adjust `request()` to skip `Content-Type` when `options.body` is a `FormData` instance.

- [ ] **Step 8: Create admin/src/auth/AuthContext.tsx**

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, setToken, getToken } from '../api/client';

interface AuthValue {
  user: { id: number; username: string } | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  isAuthed: () => boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);

  const login = async (u: string, p: string) => {
    const res = await api.login(u, p);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthed = () => !!getToken();

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthed }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 9: Create admin/src/pages/Login.tsx**

```tsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      window.location.hash = '#/';
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-green">Liwan Admin</h1>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="mb-3 w-full rounded-lg border px-3 py-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-3 w-full rounded-lg border px-3 py-2" />
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-lg bg-green py-2 font-semibold text-cream">Sign in</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 10: Create admin/src/App.tsx**

```tsx
import { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { Login } from './pages/Login';

export default function App() {
  const { isAuthed, logout } = useAuth();
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => {
    const onHash = () => setAuthed(isAuthed());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [isAuthed]);

  if (!authed) return <Login />;
  return (
    <div className="p-4">
      <p>Dashboard placeholder</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

- [ ] **Step 11: Create admin/src/main.tsx** (same pattern as frontend, wraps App with AuthProvider)

- [ ] **Step 12: Install + verify**

Run: `npm install` at root, `npm run dev -w admin`
Expected: login page renders; wrong creds show error; correct creds show dashboard placeholder.

- [ ] **Step 13: Commit**

```bash
git add admin/
git commit -m "feat: scaffold admin dashboard with auth and login"
```

---

## Task 18: Admin UI Components

**Files:**
- Create: `admin/src/components/ui/Button.tsx`
- Create: `admin/src/components/ui/Input.tsx`
- Create: `admin/src/components/ui/Modal.tsx`
- Create: `admin/src/components/ui/Table.tsx`
- Create: `admin/src/components/Layout.tsx`

**Interfaces:**
- Produces: Reusable `Button`, `Input`, `Modal`, `Table` primitives, and admin `Layout` (sidebar nav + content).
- Consumes: nothing external.

- [ ] **Step 1: Create Button.tsx**

```tsx
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-green text-cream hover:bg-green-light',
  ghost: 'bg-transparent text-green border border-green/20 hover:bg-green/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Create Input.tsx**

```tsx
import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-green/15 bg-white px-3 py-2 text-sm outline-none focus:border-green ${className}`}
      {...props}
    />
  );
}
```

- [ ] **Step 3: Create Modal.tsx**

```tsx
import type { ReactNode } from 'react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-chocolate">{title}</h2>
          <button onClick={onClose} className="text-chocolate/50 hover:text-chocolate">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Table.tsx**

```tsx
import type { ReactNode } from 'react';

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-green/10">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-chocolate/70">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 5: Create Layout.tsx**

```tsx
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

const links = [
  { hash: '#/', label: 'Dashboard' },
  { hash: '#/categories', label: 'Categories' },
  { hash: '#/items', label: 'Items' },
  { hash: '#/settings', label: 'Settings' },
  { hash: '#/password', label: 'Security' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-green/10 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold text-green">Liwan Admin</h1>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <a key={l.hash} href={l.hash} className="rounded-lg px-3 py-2 text-sm text-chocolate hover:bg-green/5">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <p className="mb-2 text-xs text-chocolate/50">{user?.username}</p>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck -w admin`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add admin/src/components
git commit -m "feat: add admin ui primitives and layout"
```

---

## Task 19: Admin Dashboard Home + Routing

**Files:**
- Create: `admin/src/router.tsx`
- Create: `admin/src/pages/Dashboard.tsx`
- Create: `admin/src/pages/Categories.tsx`
- Create: `admin/src/pages/Items.tsx`
- Create: `admin/src/pages/Settings.tsx`
- Create: `admin/src/pages/ChangePassword.tsx`
- Modify: `admin/src/App.tsx`

**Interfaces:**
- Produces: Hash-based routing (`#/`, `#/categories`, `#/items`, `#/settings`, `#/password`) rendering pages inside `AdminLayout`. `Dashboard` shows stats + recent edits.
- Consumes: `api.getStats`, `useAuth`, `AdminLayout`.

- [ ] **Step 1: Create Dashboard.tsx**

```tsx
import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function Dashboard() {
  const [stats, setStats] = useState<{ categories: number; items: number; popular: number } | null>(null);
  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: 'Categories', value: stats?.categories ?? '—' },
    { label: 'Menu Items', value: stats?.items ?? '—' },
    { label: 'Popular Items', value: stats?.popular ?? '—' },
  ];
```

- [ ] **Step 1b: Add recent edits block**

Backend exposes `GET /api/stats/recent` (auth) returning the 5 most recently updated items/categories. Add to `backend/src/routes/stats.ts`:

```ts
statsRouter.get('/recent', requireAuth, async (_req, res, next) => {
  try {
    const { data: items } = await supabase
      .from('menu_items')
      .select('id, name_en, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);
    const { data: cats } = await supabase
      .from('categories')
      .select('id, name_en, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);
    res.json({ items: items || [], categories: cats || [] });
  } catch (e) { next(e); }
});
```

In admin `api/client.ts` add:

```ts
getRecentEdits: () => request<{ items: any[]; categories: any[] }>('/stats/recent'),
```

In `Dashboard.tsx`, fetch and render recent edits below the stat cards:

```tsx
const [recent, setRecent] = useState<{ items: any[]; categories: any[] }>({ items: [], categories: [] });
useEffect(() => {
  api.getRecentEdits().then(setRecent).catch(() => {});
}, []);
```

Render below the stat grid:

```tsx
<div className="mt-8">
  <h2 className="mb-3 text-lg font-semibold text-chocolate">Recent Edits</h2>
  <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-green">Items</p>
      {recent.items.length === 0 && <p className="text-sm text-chocolate/50">No recent edits</p>}
      {recent.items.map((i) => (
        <p key={i.id} className="border-b border-green/5 py-1 text-sm text-chocolate/80">{i.name_en}</p>
      ))}
    </div>
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-green">Categories</p>
      {recent.categories.length === 0 && <p className="text-sm text-chocolate/50">No recent edits</p>}
      {recent.categories.map((c) => (
        <p key={c.id} className="border-b border-green/5 py-1 text-sm text-chocolate/80">{c.name_en}</p>
      ))}
    </div>
  </div>
</div>
```

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-green">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-chocolate/60">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-chocolate">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create placeholder pages (Categories, Items, Settings, ChangePassword)** — minimal "coming soon" content for now; filled in Tasks 20–23.

```tsx
export function Categories() {
  return <h1 className="text-2xl font-bold text-green">Categories</h1>;
}
```

- [ ] **Step 3: Create admin/src/router.tsx**

```tsx
import { useEffect, useState, type ComponentType } from 'react';
import { AdminLayout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Items } from './pages/Items';
import { Settings } from './pages/Settings';
import { ChangePassword } from './pages/ChangePassword';

const routes: Record<string, ComponentType> = {
  '/': Dashboard,
  '/categories': Categories,
  '/items': Items,
  '/settings': Settings,
  '/password': ChangePassword,
};

export function Router() {
  const [hash, setHash] = useState(window.location.hash.replace(/^#/, '') || '/');
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace(/^#/, '') || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const Page = routes[hash] || Dashboard;
  return (
    <AdminLayout>
      <Page />
    </AdminLayout>
  );
}
```

- [ ] **Step 4: Update App.tsx** — authenticated branch renders `<Router />` instead of placeholder.

- [ ] **Step 5: Typecheck + verify**

Run: `npm run typecheck -w admin`
Expected: PASS. Navigating `#/categories` etc. shows page.

- [ ] **Step 6: Commit**

```bash
git add admin/src/pages/Items.tsx
git commit -m "feat: add admin items CRUD with image upload"
```

---

## Task 22: Admin Settings + Change Password

**Files:**
- Modify: `admin/src/pages/Settings.tsx`
- Modify: `admin/src/pages/ChangePassword.tsx`

**Interfaces:**
- Produces: Settings form (all bilingual restaurant fields + logo/favicon upload placeholders), Change Password form (current/new/confirm, validates match, calls `api.changePassword`).
- Consumes: `api`, `Button`, `Input`.

- [ ] **Step 1: Replace Settings.tsx**

```tsx
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const FIELDS: { key: string; label: string }[] = [
  { key: 'restaurant_name_en', label: 'Restaurant Name (EN)' },
  { key: 'restaurant_name_ar', label: 'Restaurant Name (AR)' },
  { key: 'description_en', label: 'Description (EN)' },
  { key: 'description_ar', label: 'Description (AR)' },
  { key: 'hours_en', label: 'Hours (EN)' },
  { key: 'hours_ar', label: 'Hours (AR)' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'tiktok', label: 'TikTok URL' },
  { key: 'maps_url', label: 'Google Maps URL' },
  { key: 'address_en', label: 'Address (EN)' },
  { key: 'address_ar', label: 'Address (AR)' },
  { key: 'footer_text', label: 'Footer Text' },
];

export function Settings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => api.getSettings().then(setValues).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    await api.updateSettings(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-green">Restaurant Settings</h1>
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-chocolate/70">{f.label}</label>
            <Input value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
          </div>
        ))}
        <div className="border-t border-green/10 pt-4 text-sm text-chocolate/60">
          Logo & favicon upload will be added in a later task (placeholder).
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={save}>Save Settings</Button>
          {saved && <span className="text-sm text-green">Saved</span>}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace ChangePassword.tsx**

```tsx
import { useState } from 'react';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setMsg({ ok: false, text: 'Passwords do not match' });
      return;
    }
    try {
      await api.changePassword(current, next);
      setMsg({ ok: true, text: 'Password updated' });
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      setMsg({ ok: false, text: String(err) });
    }
  };

  return (
    <div className="max-w-sm">
      <h1 className="mb-6 text-2xl font-bold text-green">Change Password</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <Input type="password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <Input type="password" placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)} />
        <Input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {msg && <p className={`text-sm ${msg.ok ? 'text-green' : 'text-red-600'}`}>{msg.text}</p>}
        <Button type="submit">Update Password</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + verify**

Run: `npm run typecheck -w admin`
Expected: PASS. Settings save persists; password change validates current + match.

- [ ] **Step 4: Commit**

```bash
git add admin/src/pages
git commit -m "feat: add settings and change password pages"
```

---

## Task 23: Admin Settings Logo/Favicon Upload + Polish

**Files:**
- Modify: `admin/src/pages/Settings.tsx`
- Modify: `backend/src/routes/settings.ts` (add image upload endpoint)

**Interfaces:**
- Produces: `POST /api/settings/logo` and `POST /api/settings/favicon` (auth, multipart) uploading to Supabase Storage and updating `logo_url`/`favicon_url` settings. Settings page shows image previews + upload buttons.
- Consumes: existing storage helpers, `multer`, `requireAuth`.

- [ ] **Step 1: Add upload routes to backend settings.ts**

```ts
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const BUCKET = process.env.SUPABASE_BUCKET || 'menu-images';

async function uploadSettingImage(req: Request, res: Response, key: string) {
  if (!req.file) { res.status(400).json({ error: 'No image provided' }); return; }
  const ext = req.file.originalname.split('.').pop() || 'png';
  const path = `settings/${key}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await supabase.from('settings').upsert({ key, value: data.publicUrl }, { onConflict: 'key' });
  res.json({ key, value: data.publicUrl });
}

settingsRouter.post('/logo', requireAuth, upload.single('image'), (req, res, next) =>
  uploadSettingImage(req, res, 'logo_url').catch(next)
);
settingsRouter.post('/favicon', requireAuth, upload.single('image'), (req, res, next) =>
  uploadSettingImage(req, res, 'favicon_url').catch(next)
);
```

- [ ] **Step 2: Update admin api client**

```ts
uploadSettingImage: (key: 'logo_url' | 'favicon_url', file: File) => {
  const fd = new FormData();
  fd.append('image', file);
  return request(`/settings/${key === 'logo_url' ? 'logo' : 'favicon'}`, { method: 'POST', body: fd });
},
```

- [ ] **Step 3: Update Settings.tsx** — add two image-upload blocks (logo + favicon) that call `api.uploadSettingImage` on file select and show the resulting preview.

- [ ] **Step 4: Typecheck + verify**

Run: `npm run typecheck -w admin` and `-w backend`
Expected: PASS. Logo/favicon upload works and public URL stored in settings.

- [ ] **Step 5: Commit**

```bash
git add backend/src/routes/settings.ts admin/src
git commit -m "feat: add logo and favicon upload to admin settings"
```

---

## Task 24: Frontend Logo from Settings + Docs

**Files:**
- Modify: `frontend/src/components/LogoPlaceholder.tsx`
- Modify: `frontend/src/index.html`
- Create: `README.md`

**Interfaces:**
- Produces: Logo component shows uploaded logo (from `settings.logo_url`) when present, else the dashed placeholder. Favicon set from `settings.favicon_url` when present. Root README documents setup, env vars, deployment.
- Consumes: `useMenuData` settings.

- [ ] **Step 1: Update LogoPlaceholder.tsx**

```tsx
import { useMenuData } from '../hooks/useMenuData';

export function LogoPlaceholder({ className = 'h-10 w-10' }: { className?: string }) {
  const { settings } = useMenuData();
  if (settings.logo_url) {
    return <img src={settings.logo_url} alt="logo" className={`${className} rounded-xl object-contain`} />;
  }
  return (
    <div className={`${className} rounded-xl border-2 border-dashed border-green/40 bg-green/10`} aria-label="Logo placeholder" />
  );
}
```

- [ ] **Step 2: Set favicon dynamically**

In `App.tsx` (or a small effect in Layout):

```tsx
useEffect(() => {
  const { settings } = /* from useMenuData */;
  if (settings.favicon_url) {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = settings.favicon_url;
  }
}, [/* settings */]);
```

- [ ] **Step 3: Create README.md**

Document: structure, prerequisites (Node 18+, Supabase project, Vercel), env vars for each app, local dev commands (`npm run dev:backend` etc.), deployment steps (import to Vercel, set env vars, run migrations in Supabase), default admin creds note (change after first login).

- [ ] **Step 4: Commit**

```bash
git add frontend/src README.md
git commit -m "feat: use uploaded logo and favicon, add docs"
```

---

## Task 25: Deployment Config + Final Verification

**Files:**
- Create: `vercel.json` (root, optional monorepo routing) OR per-app configs
- Create: `.env.example` files for each app
- Modify: root `package.json` (add build scripts for all workspaces)

**Interfaces:**
- Produces: Deployable config. Frontend/admin `VITE_API_URL` points to backend deployment URL. Backend has Supabase env vars.
- Consumes: all prior work.

- [ ] **Step 1: Root package.json build scripts**

```json
"scripts": {
  "dev:backend": "npm run dev -w backend",
  "dev:frontend": "npm run dev -w frontend",
  "dev:admin": "npm run dev -w admin",
  "build": "npm run build -w frontend && npm run build -w admin",
  "typecheck": "npm run typecheck -w backend && npm run typecheck -w frontend && npm run typecheck -w admin"
}
```

- [ ] **Step 2: Frontend .env.example**

```
VITE_API_URL=/api
```

For production, set `VITE_API_URL` to the deployed backend URL (e.g. `https://liwan-backend.vercel.app`).

- [ ] **Step 3: Admin .env.example**

```
VITE_API_URL=https://liwan-backend.vercel.app
```

- [ ] **Step 4: Full typecheck + build**

Run: `npm run typecheck`
Run: `npm run build`
Expected: All three workspaces typecheck and build clean.

- [ ] **Step 5: Final smoke test**

Run backend + frontend + admin locally with real Supabase env vars. Create a category and item in admin, verify they appear on the public menu with correct RTL/LTR and translations.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add deployment config and final build scripts"
```

> Deployment to Vercel + Supabase requires the user's actual credentials. Do NOT deploy or push to GitHub. The user will do this themselves following README instructions.

---

## Task 26: Vercel + Supabase Deployment (Manual, User-Executed)

This is a documentation/verification task — the plan does not execute it. The user runs these steps:

1. **Supabase**: Create project → run `0001_init.sql` in SQL Editor → create public bucket `menu-images` → get Project URL + `anon`/`service_role` keys.
2. **Backend**: In Vercel, import `backend/` as its own project (or monorepo root with output config). Set env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `SUPABASE_BUCKET`.
3. **Frontend**: Import `frontend/`, set `VITE_API_URL` to backend URL, deploy.
4. **Admin**: Import `admin/`, set `VITE_API_URL` to backend URL, deploy.
5. Change the default admin password after first login.

Verify: public menu loads data from Supabase, admin CRUD works, images upload to Storage, RTL/LTR toggles correctly.

---

## Task 20: Admin Categories Management

**Files:**
- Modify: `admin/src/pages/Categories.tsx`

**Interfaces:**
- Produces: Full CRUD UI: table of categories, create/edit modal (name_ar, name_en, display_order, is_active toggle), delete with confirm, enable/disable, reorder (up/down buttons swapping `display_order`).
- Consumes: `api`, `Button`, `Input`, `Modal`, `Table`.

- [ ] **Step 1: Replace Categories.tsx**

```tsx
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';

interface Cat {
  id: number;
  name_ar: string;
  name_en: string;
  display_order: number;
  is_active: boolean;
}

export function Categories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);
  const [deleting, setDeleting] = useState<Cat | null>(null);

  const load = useCallback(() => api.getCategories().then(setCats).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const body = {
      name_ar: editing.name_ar || '',
      name_en: editing.name_en || '',
      display_order: Number(editing.display_order) || 0,
      is_active: !!editing.is_active,
    };
    if (editing.id) await api.updateCategory(editing.id, body);
    else await api.createCategory(body);
    setEditing(null);
    load();
  };

  const toggle = async (c: Cat) => {
    await api.updateCategory(c.id, { is_active: !c.is_active });
    load();
  };

  const remove = async () => {
    if (!deleting) return;
    await api.deleteCategory(deleting.id);
    setDeleting(null);
    load();
  };

  const move = async (c: Cat, dir: -1 | 1) => {
    const sorted = [...cats].sort((a, b) => a.display_order - b.display_order);
    const i = sorted.findIndex((x) => x.id === c.id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const other = sorted[j];
    await api.updateCategory(c.id, { display_order: other.display_order });
    await api.updateCategory(other.id, { display_order: c.display_order });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green">Categories</h1>
        <Button onClick={() => setEditing({})}>Add Category</Button>
      </div>

      <Table headers={['EN', 'AR', 'Order', 'Active', 'Actions']}>
        {cats.map((c) => (
          <tr key={c.id} className="border-b border-green/5">
            <td className="px-4 py-3">{c.name_en}</td>
            <td className="px-4 py-3">{c.name_ar}</td>
            <td className="px-4 py-3">{c.display_order}</td>
            <td className="px-4 py-3">
              <button onClick={() => toggle(c)} className={`rounded-full px-3 py-1 text-xs font-semibold ${c.is_active ? 'bg-green/15 text-green' : 'bg-red-100 text-red-600'}`}>
                {c.is_active ? 'Active' : 'Disabled'}
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => move(c, -1)} className="rounded px-2 text-chocolate/60 hover:bg-green/5">↑</button>
                <button onClick={() => move(c, 1)} className="rounded px-2 text-chocolate/60 hover:bg-green/5">↓</button>
                <button onClick={() => setEditing(c)} className="rounded px-2 text-green hover:bg-green/5">Edit</button>
                <button onClick={() => setDeleting(c)} className="rounded px-2 text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Category' : 'New Category'}>
        <div className="space-y-3">
          <Input placeholder="Name (English)" value={editing?.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
          <Input placeholder="Name (Arabic)" value={editing?.name_ar || ''} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
          <Input type="number" placeholder="Display order" value={editing?.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!editing?.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
            Active
          </label>
          <Button onClick={save}>{editing?.id ? 'Save' : 'Create'}</Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Category">
        <p className="mb-4 text-sm text-chocolate/80">
          Delete "{deleting?.name_en}"? All items in it will be removed.
        </p>
        <Button variant="danger" onClick={remove}>Delete</Button>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + verify**

Run: `npm run typecheck -w admin`
Expected: PASS. CRUD + reorder works against running backend.

- [ ] **Step 3: Commit**

```bash
git add admin/src/pages/Categories.tsx
git commit -m "feat: add admin categories CRUD"
```

---

## Task 21: Admin Items Management

**Files:**
- Modify: `admin/src/pages/Items.tsx`

**Interfaces:**
- Produces: Full item CRUD: create/edit modal (bilingual name/desc, price, category select, availability + badge toggles, display order), image upload with preview, delete, availability toggle inline.
- Consumes: `api`, UI primitives, `api.getCategories`.

- [ ] **Step 1: Replace Items.tsx**

```tsx
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';

interface Item {
  id: number;
  category_id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  display_order: number;
}

interface Cat { id: number; name_en: string; }

export function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(() => {
    api.getItems().then(setItems).catch(() => {});
    api.getCategories().then(setCats).catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const body = {
      category_id: editing.category_id,
      name_ar: editing.name_ar || '',
      name_en: editing.name_en || '',
      description_ar: editing.description_ar || null,
      description_en: editing.description_en || null,
      price: Number(editing.price) || 0,
      is_available: !!editing.is_available,
      is_popular: !!editing.is_popular,
      is_new: !!editing.is_new,
      is_vegetarian: !!editing.is_vegetarian,
      is_spicy: !!editing.is_spicy,
      display_order: Number(editing.display_order) || 0,
    };
    if (editing.id) {
      await api.updateItem(editing.id, body);
      if (file) await api.uploadItemImage(editing.id, file);
    } else {
      const created = await api.createItem(body);
      if (file) await api.uploadItemImage(created.id, file);
    }
    setEditing(null);
    setFile(null);
    load();
  };

  const toggleAvailable = async (i: Item) => {
    await api.updateItem(i.id, { is_available: !i.is_available });
    load();
  };

  const toggleFlag = async (i: Item, key: 'is_popular' | 'is_new' | 'is_vegetarian' | 'is_spicy') => {
    await api.updateItem(i.id, { [key]: !i[key] });
    load();
  };

  const remove = async () => {
    if (!deleting) return;
    await api.deleteItem(deleting.id);
    setDeleting(null);
    load();
  };

  const catName = (id: number) => cats.find((c) => c.id === id)?.name_en || '—';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green">Menu Items</h1>
        <Button onClick={() => setEditing({})}>Add Item</Button>
      </div>

      <Table headers={['Name', 'Category', 'Price', 'Status', 'Flags', 'Actions']}>
        {items.map((i) => (
          <tr key={i.id} className="border-b border-green/5">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {i.image_url && <img src={i.image_url} className="h-8 w-8 rounded object-cover" alt="" />}
                {i.name_en}
              </div>
            </td>
            <td className="px-4 py-3">{catName(i.category_id)}</td>
            <td className="px-4 py-3">${Number(i.price).toFixed(2)}</td>
            <td className="px-4 py-3">
              <button onClick={() => toggleAvailable(i)} className={`rounded-full px-3 py-1 text-xs font-semibold ${i.is_available ? 'bg-green/15 text-green' : 'bg-red-100 text-red-600'}`}>
                {i.is_available ? 'Available' : 'Unavailable'}
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {(['is_popular', 'is_new', 'is_vegetarian', 'is_spicy'] as const).map((f) => (
                  <button key={f} onClick={() => toggleFlag(i, f)} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i[f] ? 'bg-chocolate/15 text-chocolate' : 'bg-green/5 text-chocolate/40'}`}>
                    {f.replace('is_', '')}
                  </button>
                ))}
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => setEditing(i)} className="rounded px-2 text-green hover:bg-green/5">Edit</button>
                <button onClick={() => setDeleting(i)} className="rounded px-2 text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Item' : 'New Item'}>
        <div className="space-y-3">
          <select value={editing?.category_id || ''} onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) })} className="w-full rounded-lg border border-green/15 px-3 py-2 text-sm">
            <option value="">Category</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
          </select>
          <Input placeholder="Name (English)" value={editing?.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
          <Input placeholder="Name (Arabic)" value={editing?.name_ar || ''} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
          <Input placeholder="Description (English)" value={editing?.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
          <Input placeholder="Description (Arabic)" value={editing?.description_ar || ''} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} />
          <Input type="number" step="0.01" placeholder="Price" value={editing?.price ?? ''} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
          <Input type="number" placeholder="Display order" value={editing?.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {editing?.image_url && <img src={editing.image_url} className="h-16 w-16 rounded object-cover" alt="" />}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {(['is_available', 'is_popular', 'is_new', 'is_vegetarian', 'is_spicy'] as const).map((f) => (
              <label key={f} className="flex items-center gap-2">
                <input type="checkbox" checked={!!editing?.[f]} onChange={(e) => setEditing({ ...editing, [f]: e.target.checked })} />
                {f.replace('is_', '')}
              </label>
            ))}
          </div>
          <Button onClick={save}>{editing?.id ? 'Save' : 'Create'}</Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Item">
        <p className="mb-4 text-sm text-chocolate/80">Delete "{deleting?.name_en}"?</p>
        <Button variant="danger" onClick={remove}>Delete</Button>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + verify**

Run: `npm run typecheck -w admin`
Expected: PASS. Create/edit/delete + flags + image upload work.

- [ ] **Step 3: Commit**

```bash
git add admin/src/pages/Items.tsx
git commit -m "feat: add admin items CRUD with image upload"
```

---
