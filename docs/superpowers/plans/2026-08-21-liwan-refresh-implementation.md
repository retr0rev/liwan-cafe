# Liwan Refresh (Heritage Luxury + WhatsApp Cart) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh existing Liwan app with heritage-luxury theme, real logo asset, and WhatsApp cart drawer with notes; seed admin Admin123## and expose whatsapp_number in settings.

**Architecture:** Incremental edits to restored monorepo. Copy `liwan_logo.jpg` to public. Update Tailwind tokens + index.css + fonts. Patch migration hash + settings seed. Add CartContext/Drawer hook, MostPopular component, and WhatsApp number field in admin Settings + backend validation. No new services.

**Tech Stack:** React+Vite+TanStack Router+TS+Tailwind+Anime.js+Three.js (frontend), Express+Supabase+JWT+bcrypt (backend), shared types.

## Global Constraints
- Arabic default (RTL), bilingual fields (ar/en) for categories/items/settings.
- Nothing hardcoded in menu; all from API. Price in S.P ل.س handled in frontend.
- Single app serving `/` + `/admin`, Vercel + Supabase.
- Fonts: Cormorant Garamond EN headlines + Inter body, Amiri/Tajawal AR via Google Fonts display=swap.
- Palette: emerald #0f2e26, gold #c9a86a, cream #fdf8ef, cream-dark #f5ecd7, ink #2b1e14.
- Admin seed: admin / Admin123## bcrypt 10. Rate-limit, Helmet, CORS, 10kb limit remain.
- TypeScript strict, `npm run build` must pass.

---

### Task 1: Logo asset integration

**Files:**
- Create: `frontend/public/logo.jpg` (copy from `liwan_logo.jpg`)
- Create: `frontend/public/favicon.jpg` (copy same or optimized)
- Modify: `frontend/src/components/LogoPlaceholder.tsx` — render `<img src="/logo.jpg">` fallback
- Modify: `frontend/src/components/Nav.tsx` — use settings logo_url else /logo.jpg
- Modify: `frontend/src/components/Hero.tsx` — same fallback
- Modify: `frontend/index.html` — link favicon to /favicon.jpg + /logo.jpg

**Interfaces:**
- Consumes: `GET /api/settings` provides `logo_url` (may be empty)
- Produces: `logoSrc = settings.logo_url || "/logo.jpg"` pattern used by Nav/Hero/Footer

- [ ] **Step 1: Copy logo to public**
```bash
cp liwan_logo.jpg frontend/public/logo.jpg
cp liwan_logo.jpg frontend/public/favicon.jpg
ls -lh frontend/public/logo.jpg
```
Expected: files exist, ~10-50KB.

- [ ] **Step 2: Update LogoPlaceholder to use image**
```tsx
// frontend/src/components/LogoPlaceholder.tsx
export function LogoPlaceholder({ size=40 }: {size?: number}) {
  return <img src="/logo.jpg" alt="Liwan" width={size} height={size} className="rounded-full object-cover" />
}
```

- [ ] **Step 3: Patch Nav/Hero to fallback**
```tsx
const logoSrc = settings?.logo_url || "/logo.jpg";
<img src={logoSrc} alt="Liwan" className="h-9 w-9 rounded-full object-cover" />
```

- [ ] **Step 4: Verify visually**
Run: `npm run dev:frontend` then open localhost:5173, check logo in nav/hero.

- [ ] **Step 5: Commit**
```bash
git add frontend/public/logo.jpg frontend/public/favicon.jpg frontend/src/components/LogoPlaceholder.tsx frontend/src/components/Nav.tsx frontend/src/components/Hero.tsx frontend/index.html
git commit -m "feat: use liwan_logo.jpg as canonical logo asset"
```

---

### Task 2: Heritage luxury theme tokens

**Files:**
- Modify: `frontend/tailwind.config.ts` — extend colors emerald/gold/cream/ink, fontFamily
- Modify: `frontend/src/index.css` — Google Fonts import, CSS vars, [dir='rtl'] stacks
- Modify: `frontend/index.html` — preconnect fonts link

**Interfaces:**
- Consumes: Tailwind classes used by ItemCard, MenuSection, About, Footer, admin UI
- Produces: New tokens `bg-cream`, `text-ink`, `text-emerald`, `bg-emerald`, `text-gold`, `border-gold/20`, `font-display`

- [ ] **Step 1: Update tailwind.config.ts**
```ts
colors: {
  emerald: { DEFAULT: '#0f2e26', light: '#1a4338', muted: '#143a2f' },
  gold: { DEFAULT: '#c9a86a', light: '#ddc08a', muted: '#b89a5a' },
  cream: { DEFAULT: '#fdf8ef', dark: '#f5ecd7', muted: '#faf3e9' },
  ink: { DEFAULT: '#2b1e14', light: '#6b5a45' },
},
fontFamily: {
  display: ['Cormorant Garamond','Amiri','serif'],
  sans: ['Inter','Tajawal','system-ui','sans-serif'],
}
```

- [ ] **Step 2: Update index.css**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;600&family=Amiri:wght@400;700&family=Tajawal:wght@400;700&display=swap');
body { @apply bg-cream text-ink antialiased; }
h1,h2,h3 { @apply font-display; }
[dir='rtl'] { font-family: 'Amiri','Tajawal',system-ui,sans-serif; }
[dir='rtl'] h1,[dir='rtl'] h2,[dir='rtl'] h3 { font-family: 'Amiri',serif; }
```

- [ ] **Step 3: Patch components from green/chocolate to emerald/ink/gold**
Replace in ItemCard, MenuSection, About, Footer, Nav, Hero: `text-chocolate`→`text-ink`, `text-green`→`text-emerald`, `bg-green`→`bg-emerald`, badges gold border.

- [ ] **Step 4: Run build check**
Run: `npm run build --workspace=frontend` (or `npx tsc --noEmit`)
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add frontend/tailwind.config.ts frontend/src/index.css frontend/index.html frontend/src/components/*.tsx
git commit -m "style: heritage luxury palette and bilingual fonts"
```

---

### Task 3: Migration — admin password + whatsapp_number seed

**Files:**
- Modify: `backend/supabase/migrations/0001_init.sql` — update admin hash for Admin123## and seed settings key `whatsapp_number`
- Modify: `backend/src/routes/settings.ts` — allow/validate whatsapp_number on PUT
- Test: `backend/supabase/migrations/0001_init.sql` contains Admin123## hash and whatsapp_number insert

**Interfaces:**
- Consumes: bcrypt hash for "Admin123##" (generate via `node -e "console.log(require('bcryptjs').hashSync('Admin123##',10))"`)
- Produces: `GET /api/settings` includes `whatsapp_number`, `PUT /api/settings` validates it

- [ ] **Step 1: Generate hash**
Run: `node -e "console.log(require('bcryptjs').hashSync('Admin123##',10))"` or `npx bcryptjs` → capture hash `$2b$...`

- [ ] **Step 2: Patch migration**
```sql
-- replace admin insert
INSERT INTO admin (username, password_hash) VALUES ('admin', '<hash_for_Admin123##>') ON CONFLICT (username) DO UPDATE SET password_hash=EXCLUDED.password_hash;
INSERT INTO settings (key, value) VALUES ('whatsapp_number', '') ON CONFLICT (key) DO NOTHING;
```

- [ ] **Step 3: Update settings route validation**
```ts
// allowedKeys add 'whatsapp_number'
if (key === 'whatsapp_number' && value) {
  const digits = value.replace(/[^\d]/g,'');
  if (digits.length < 8 || digits.length > 15) throw new Error('Invalid whatsapp_number');
}
```

- [ ] **Step 4: Verify migration syntax**
Run: `cat backend/supabase/migrations/0001_init.sql | head -80`

- [ ] **Step 5: Commit**
```bash
git add backend/supabase/migrations/0001_init.sql backend/src/routes/settings.ts
git commit -m "feat: seed admin Admin123## and whatsapp_number setting"
```

---

### Task 4: Cart context + WhatsApp drawer

**Files:**
- Create: `frontend/src/cart/CartContext.tsx` — context with items, add/remove/updateQty/clear, persisted localStorage, subtotal
- Create: `frontend/src/cart/CartDrawer.tsx` — slide drawer (RTL aware), qty +/- , notes textarea, WhatsApp checkout button
- Create: `frontend/src/cart/whatsapp.ts` — `buildWhatsAppMessage(lang, cartItems, notes)` + `waLink(number, msg)`
- Create: `frontend/src/cart/useCart.ts` — hook
- Modify: `frontend/src/routes/__root.tsx` or `frontend/src/main.tsx` — wrap with CartProvider
- Modify: `frontend/src/components/Nav.tsx` — cart button with badge count, opens drawer
- Modify: `frontend/src/i18n/translations.ts` — add cart keys (cart.title, cart.empty, cart.notesPlaceholder, cart.checkout, cart.missingNumber)

**Interfaces:**
- Consumes: `useMenuData`? No; `useI18n().lang`, `useSettings` for `whatsapp_number`
- Produces: `useCart(): { items: CartItem[], add(item), remove(id), setQty(id,n), clear(), count, subtotal }`, `CartDrawer` component, `buildWhatsAppMessage` function

- [ ] **Step 1: Create whatsapp helper**
```ts
// frontend/src/cart/whatsapp.ts
export function buildWhatsAppMessage(lang:'ar'|'en', items:{name_ar:string,name_en:string,price:number,qty:number}[], notes:string, t:(k:string)=>string) { /* format lines, total */ }
export function waLink(number:string, msg:string){ const d=number.replace(/\D/g,''); return `https://wa.me/${d}?text=${encodeURIComponent(msg)}`; }
```

- [ ] **Step 2: Create CartContext**
```tsx
type CartItem = { id:number, name_ar:string, name_en:string, price:number, qty:number, image_url?:string };
const CartContext = createContext<...>(null);
export function CartProvider({children}) { const [items,setItems]=useState<CartItem[]>(()=>JSON.parse(localStorage.getItem('liwan_cart')||'[]')); /* persist effect */ }
```

- [ ] **Step 3: Create CartDrawer**
```tsx
export function CartDrawer({open,onClose}) { const {items,setQty,remove,subtotal}=useCart(); const {settings}=useMenuData(); const wa=settings?.whatsapp_number; /* render */ }
```
Include notes textarea, disabled checkout if !wa or items.length===0.

- [ ] **Step 4: Wire into Nav and root**
Wrap app with `<CartProvider>`, add cart button with count badge, state `drawerOpen`.

- [ ] **Step 5: Manual test**
Add item → badge increments → open drawer → +/- qty → total updates → checkout opens wa.me link with encoded message.

- [ ] **Step 6: Commit**
```bash
git add frontend/src/cart/ frontend/src/components/Nav.tsx frontend/src/main.tsx frontend/src/i18n/translations.ts
git commit -m "feat: cart drawer and WhatsApp checkout with notes"
```

---

### Task 5: Most Popular + Menu Add-to-Cart

**Files:**
- Create: `frontend/src/components/MostPopular.tsx`
- Modify: `frontend/src/components/ItemCard.tsx` — add Add to Cart button, price format S.P ل.س, gold accent
- Modify: `frontend/src/components/MenuSection.tsx` — pass cart add handler, ensure category anchoring
- Modify: `frontend/src/routes/index.tsx` — compose Hero → MostPopular → MenuSection → About → Location/Footer with data from useMenuData
- Modify: `frontend/src/i18n/translations.ts` — add mostPopular.title, addToCart

**Interfaces:**
- Consumes: `useMenuData().items`, `useCart().add`, `useI18n`
- Produces: `MostPopular` section filtered by `is_popular && is_available`

- [ ] **Step 1: Create MostPopular**
```tsx
export function MostPopular(){ const {items}=useMenuData(); const popular=items.filter(i=>i.is_popular && i.is_available); if(!popular.length) return null; /* grid */ }
```

- [ ] **Step 2: Update ItemCard**
```tsx
const {add}=useCart();
<button onClick={()=>add(item)} className="rounded-full bg-emerald px-4 py-1.5 text-sm text-cream hover:bg-emerald-light">{t('cart.add')}</button>
<span className="font-bold text-gold">{formatPrice(item.price, lang)}</span> // 12,000 S.P / ١٢٬٠٠٠ ل.س
```

- [ ] **Step 3: Add formatPrice helper**
```ts
function formatPrice(p:number, lang:string){ const n=Number(p).toLocaleString(lang==='ar'?'ar-EG':'en-US'); return lang==='ar' ? `${n} ل.س` : `${n} S.P`; }
```

- [ ] **Step 4: Update index route order**
Ensure order: `<Hero/><MostPopular/><MenuSection/><About/><Location/><Footer/>`

- [ ] **Step 5: Commit**
```bash
git add frontend/src/components/MostPopular.tsx frontend/src/components/ItemCard.tsx frontend/src/components/MenuSection.tsx frontend/src/routes/index.tsx
git commit -m "feat: most popular section and add-to-cart on menu items"
```

---

### Task 6: Admin settings — whatsapp_number field

**Files:**
- Modify: `frontend/src/admin/pages/Settings.tsx` — add WhatsApp number input, phone, social, hours, about fields already present
- Modify: `shared/src/types.ts` — add `whatsapp_number` to Settings type if typed
- Test: login as admin, update whatsapp_number, verify GET /api/settings reflects it, cart checkout enables

**Interfaces:**
- Consumes: `PUT /api/settings` with whatsapp_number
- Produces: Settings form now persists whatsapp_number

- [ ] **Step 1: Add input field**
```tsx
<label>{t('settings.whatsappNumber')}</label>
<Input value={form.whatsapp_number} onChange={e=>setForm({...form, whatsapp_number:e.target.value})} placeholder="+9639xxxxxxx" />
```

- [ ] **Step 2: Include in save payload**
```ts
await api.put('/settings', { whatsapp_number: form.whatsapp_number, ... })
```

- [ ] **Step 3: Patch types**
```ts
export type Settings = { restaurant_name_ar:string; restaurant_name_en:string; whatsapp_number:string; /* ... */ }
```

- [ ] **Step 4: Manual verification**
Login → Settings → set number → Save → Re-check public site cart checkout enabled.

- [ ] **Step 5: Commit**
```bash
git add frontend/src/admin/pages/Settings.tsx shared/src/types.ts
git commit -m "feat(admin): whatsapp_number in settings"
```

---

### Task 7: Polish, build & deploy check

**Files:**
- Verify all modified files compile, logos serve, i18n complete, no hardcoded menu data
- Run: `npm install && npm run build --workspace=frontend && npm run build --workspace=backend` (or `npm run build` at root)
- Check `frontend/vercel.json` rewrites for SPA /admin

**Interfaces:**
- Consumes: entire app
- Produces: verified production build

- [ ] **Step 1: Install and typecheck**
```bash
npm install
npx tsc --noEmit --project frontend/tsconfig.json
npx tsc --noEmit --project backend/tsconfig.json
```

- [ ] **Step 2: Build**
```bash
npm run build --workspace=frontend
npm run build --workspace=backend
```

- [ ] **Step 3: Quick smoke: check no hardcoded menu**
```bash
grep -R "hardcoded" frontend/src || echo "no hardcoded strings"
grep -R "liwan_logo" frontend/ --include="*.tsx" | head
```

- [ ] **Step 4: Commit docs if needed**
```bash
git status
```

