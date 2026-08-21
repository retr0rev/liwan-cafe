DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
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
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;

INSERT INTO admin (username, password_hash) VALUES ('admin', '$2b$10$YqWUv4wXW5pmRKoPlETxhusgHLgIWDz1d/lYq26KAKZvdxSGN22IO');

INSERT INTO settings (key, value) VALUES
  ('restaurant_name_ar', 'ليوان'),
  ('restaurant_name_en', 'Liwan Cafe'),
  ('description_ar', ''),
  ('description_en', ''),
  ('hours_ar', ''),
  ('hours_en', ''),
  ('phone', ''),
  ('whatsapp', ''),
  ('instagram', ''),
  ('facebook', ''),
  ('tiktok', ''),
  ('maps_url', ''),
  ('address_ar', ''),
  ('address_en', ''),
  ('footer_text', ''),
  ('logo_url', ''),
  ('favicon_url', ''),
  ('whatsapp_number', '');
