-- ============================================================
-- Jinyu Capital – Supabase Database Migration
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT 'Street Lamps',
  price            NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  stock_quantity   INTEGER NOT NULL DEFAULT 0,
  image            TEXT,
  images           TEXT[] DEFAULT '{}',
  description      TEXT,
  rating           NUMERIC(3, 1) DEFAULT 5.0,
  reviews_count    INTEGER DEFAULT 0,
  is_wholesale     BOOLEAN DEFAULT FALSE,
  moq_price        NUMERIC(12, 2),
  moq_quantity     INTEGER DEFAULT 10,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Orders ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status           TEXT NOT NULL DEFAULT 'pending',
  total            NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency         TEXT DEFAULT 'USD',
  customer_email   TEXT,
  customer_name    TEXT,
  shipping_address JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Order Items ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL DEFAULT 1,
  unit_price  NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Product Reviews ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Store Settings (singleton row, id=1) ──────────────────
CREATE TABLE IF NOT EXISTS store_settings (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  store_name   TEXT DEFAULT 'Jinyu Capital',
  logo_url     TEXT,
  currency     TEXT DEFAULT 'USD',
  tagline      TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row (only once)
INSERT INTO store_settings (id, store_name, currency, tagline)
VALUES (1, 'Jinyu Capital', 'USD', 'Precision Lighting for a Brighter World')
ON CONFLICT (id) DO NOTHING;

-- ── 6. Newsletter Subscribers ────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. Marquee Items (scrolling banner text) ─────────────────
CREATE TABLE IF NOT EXISTS marquee_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default marquee items
INSERT INTO marquee_items (text) VALUES
  ('✦ ISO 9001 CERTIFIED MANUFACTURER'),
  ('✦ ATEX / EX EXPLOSION-PROOF LIGHTING'),
  ('✦ 80+ DESIGN PATENTS'),
  ('✦ 30+ COUNTRIES SERVED'),
  ('✦ CUSTOM OEM / ODM AVAILABLE'),
  ('✦ 5-YEAR COMMERCIAL WARRANTY')
ON CONFLICT DO NOTHING;

-- ── 8. Quote Requests ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  company_name     TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  project_type     TEXT,
  product_interest TEXT,
  quantity         INTEGER,
  message          TEXT,
  status           TEXT DEFAULT 'new',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. Distributor Applications ─────────────────────────────
CREATE TABLE IF NOT EXISTS distributor_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name  TEXT NOT NULL,
  country       TEXT,
  business_type TEXT,
  contact_name  TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  experience    TEXT,
  products      TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'new',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. Contact Messages ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Storage: product-images bucket (run in Supabase Dashboard)
-- ============================================================
-- 1. Go to Storage > New bucket > name: product-images > Public: ON
-- OR use this if using supabase CLI:
-- supabase storage create product-images --public

-- ============================================================
-- Row Level Security (RLS) – public read, admin write
-- ============================================================

-- Products: anyone can read; only authenticated users can write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Auth write products"  ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: only authenticated users
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Order Items: only authenticated users
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Reviews: public read, authenticated write
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Auth write reviews"  ON product_reviews FOR ALL USING (auth.role() = 'authenticated');

-- Store Settings: public read, authenticated write
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Auth write settings"  ON store_settings FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter: insert from anyone, read/delete authenticated
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth manage subscribers" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');

-- Marquee: public read, authenticated write
ALTER TABLE marquee_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read marquee" ON marquee_items FOR SELECT USING (true);
CREATE POLICY "Auth write marquee"  ON marquee_items FOR ALL USING (auth.role() = 'authenticated');

-- Quote Requests: anyone can insert, authenticated can read
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public submit quote" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read quotes"    ON quote_requests FOR ALL USING (auth.role() = 'authenticated');

-- Distributor Applications: anyone can insert, authenticated can read
ALTER TABLE distributor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public submit distributor" ON distributor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read distributors"    ON distributor_applications FOR ALL USING (auth.role() = 'authenticated');

-- Contact Messages: anyone can insert, authenticated can read
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public submit contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read contacts"    ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
