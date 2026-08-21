INSERT INTO settings (key, value) VALUES
  ('hero_tagline_ar', ''),
  ('hero_tagline_en', ''),
  ('about_ar', ''),
  ('about_en', '')
ON CONFLICT (key) DO NOTHING;
