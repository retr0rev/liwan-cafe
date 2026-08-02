-- Liwan database schema

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
SELECT 'admin', '$2a$10$Gu8MkkqCjMBmEHKpfwJbAeeLfqcTvkvVRu/Uh38ixME8JsShNeWke'
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
