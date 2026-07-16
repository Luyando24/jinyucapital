-- ============================================================
-- Jinyu Capital – Optimized Supabase Database Schema
-- Matches the modern frontend design and structure
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. Products Table ───────────────────────────────────────
-- Stores our catalog of industrial and landscape lighting
CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT 'Street Lamps',
  price            NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  stock_quantity   INTEGER NOT NULL DEFAULT 0,
  image            TEXT,                -- Primary product image
  images           TEXT[] DEFAULT '{}', -- Gallery images
  description      TEXT,
  is_wholesale     BOOLEAN DEFAULT FALSE,
  moq_price        NUMERIC(12, 2),      -- Minimum order quantity price
  moq_quantity     INTEGER DEFAULT 10,   -- Minimum order quantity
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Orders Table ──────────────────────────────────────────
-- Stores customer orders for storefront products
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status           TEXT NOT NULL DEFAULT 'Pending', -- Pending, Processing, Shipped, Cancelled
  total_amount     NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency         TEXT DEFAULT 'USD',
  email            TEXT NOT NULL,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  phone            TEXT,
  address          TEXT NOT NULL,
  city             TEXT NOT NULL,
  postal_code      TEXT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Order Items Table ─────────────────────────────────────
-- Line items for each order
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL DEFAULT 1,
  price       NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- Price at time of purchase
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Store Settings Table ──────────────────────────────────
-- Singleton table for administrative site settings
CREATE TABLE IF NOT EXISTS store_settings (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  store_name   TEXT DEFAULT 'Jinyu Capital',
  logo_url     TEXT,
  email        TEXT DEFAULT 'sales@jinyucapital.com',
  phone        TEXT DEFAULT '+86-139-2243-0321',
  address      TEXT DEFAULT 'Unit 119, Building 19, Changfeng International, No. 96 Lixin 12th Road, Xintang Town, Zengcheng District, Guangzhou City',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure default settings exist
INSERT INTO store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ── 5. Newsletter Subscribers ────────────────────────────────
-- Stores emails for marketing outreach
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. Quote Requests Table ──────────────────────────────────
-- Lead generation for high-volume or custom project quotes
CREATE TABLE IF NOT EXISTS quote_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  company_name     TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  product_interest TEXT, -- Reference to product name
  quantity         INTEGER DEFAULT 1,
  message          TEXT,
  status           TEXT DEFAULT 'new', -- new, quoted, closed
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. Distributor Applications Table ────────────────────────
-- Applications for global partnership program
CREATE TABLE IF NOT EXISTS distributor_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name  TEXT NOT NULL,
  country       TEXT NOT NULL,
  business_type TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  experience    TEXT,
  products      TEXT, -- Categories of interest
  message       TEXT,
  status        TEXT DEFAULT 'new', -- new, approved, rejected
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. Contact Messages Table ────────────────────────────────
-- General inquiries from the contact page
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'unread', -- unread, read
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. Blog Posts Table ───────────────────────────────────────
-- Stores articles, news, and insights
CREATE TABLE IF NOT EXISTS blog_posts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  slug               TEXT UNIQUE NOT NULL,
  excerpt            TEXT NOT NULL,
  content            TEXT NOT NULL,
  category           TEXT NOT NULL,
  author             TEXT NOT NULL DEFAULT 'Admin',
  featured_image_url TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) Configuration
-- ============================================================

-- 1. Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies (Public access for storefront)
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);

-- 3. Public Insert Policies (Lead generation & checkout)
CREATE POLICY "Public submit orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public subscribe newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit quote" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit distributor" ON distributor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- 4. Admin Full Access Policies (Authenticated users only)
CREATE POLICY "Admin manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage settings" ON store_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage subscribers" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage quotes" ON quote_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage distributors" ON distributor_applications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage contacts" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Indexes for Performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_distributor_applications_status ON distributor_applications(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
