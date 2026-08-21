-- COMPLETE SCHEMA FIX - Run once, fixes everything

-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Categories: recreate correctly if missing columns
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Menu items
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
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_spicy BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

-- Admin
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS (service_role handles auth)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;

-- Seed admin and settings (idempotent)
INSERT INTO admin (username, password_hash)
SELECT 'admin', '$2b$10$YqWUv4wXW5pmRKoPlETxhusgHLgIWDz1d/lYq26KAKZvdxSGN22IO'
WHERE NOT EXISTS (SELECT 1 FROM admin WHERE username='admin');
UPDATE admin SET password_hash='$2b$10$YqWUv4wXW5pmRKoPlETxhusgHLgIWDz1d/lYq26KAKZvdxSGN22IO' WHERE username='admin';

INSERT INTO settings (key, value) VALUES
  ('restaurant_name_ar', 'ليوان'),
  ('restaurant_name_en', 'Liwan Cafe'),
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
  ('favicon_url', ''),
  ('whatsapp_number', '')
ON CONFLICT (key) DO NOTHING;
