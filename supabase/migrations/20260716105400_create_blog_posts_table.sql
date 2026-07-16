-- ============================================================
-- Create blog_posts table
-- ============================================================

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

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Admin manage blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Seed Initial Posts
INSERT INTO blog_posts (id, title, slug, excerpt, content, category, author, featured_image_url)
VALUES 
  (
    '1a3e6205-d220-4100-84c1-3ee93c834a36',
    'Advancements in Explosion-Proof LED Technology',
    'advancements-explosion-proof-led',
    'Discover how new LED technologies are improving safety and efficiency in hazardous industrial environments.',
    '# Advancements in Explosion-Proof LED Technology

Industrial environments present unique challenges for lighting. Hazardous zones containing flammable gases, vapors, or combustible dust require robust illumination solutions that eliminate the risk of ignition. Over the past decade, light-emitting diode (LED) technology has seen massive advancements, becoming the standard for safety-critical lighting applications.

## The Anatomy of Explosion Protection
Contrary to popular belief, "explosion-proof" does not mean the fixture can survive an external explosion unscathed. Rather, it means that if an ignition occurs inside the fixture, the enclosure is robust enough to contain it without allowing sparks or hot gases to escape and ignite the surrounding hazardous atmosphere.

Modern LED fixtures excel at this due to:
1. **Heavy-Duty Enclosures:** Die-cast aluminum and copper-free alloys provide extreme mechanical strength.
2. **Tempered Glass Lenses:** Impact-resistant lenses prevent shattering in harsh operational environments.
3. **Precision Joints:** Flame paths are carefully engineered to cool hot exhaust gases before they reach the outside.

## Advantages of LED over Traditional HID
Older industrial facilities often rely on Metal Halide or High-Pressure Sodium lamps. Transitioning to LED offers major benefits:
* **Energy Efficiency:** Up to 70% reduction in electricity consumption.
* **Service Life:** LEDs last up to 100,000 hours, virtually eliminating maintenance down-time.
* **Instant Start:** No warm-up or restrike delays, enhancing safety during power interruptions.

Stay tuned as we continue to push the boundaries of industrial illumination.',
    'Explosion-Proof Lighting',
    'Admin',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
  ),
  (
    '2b3e6205-d220-4100-84c1-3ee93c834a37',
    'Optimizing Industrial Lighting for Maximum Productivity',
    'optimizing-industrial-lighting',
    'Proper lighting design can significantly impact worker performance and safety. Learn the key factors for success.',
    '# Optimizing Industrial Lighting for Maximum Productivity

Lighting is often an overlooked aspect of industrial productivity. In manufacturing plants, warehouses, and assembly facilities, the visual environment directly impacts worker fatigue, safety, precision, and overall operational efficiency.

## 1. Illuminance Levels (Lux)
Different tasks require different light intensities. While a general warehouse storage area may only require 100-150 Lux, precision assembly lines need at least 500-750 Lux. Meeting these targets reduces eye strain and helps technicians identify defects quickly.

## 2. Color Temperature (CCT)
Research shows that cooler white light (around 5000K-6500K) mimics daylight and promotes alertness, reducing errors during night shifts. Warm light (under 3000K) is generally avoided in manufacturing settings as it promotes relaxation and can increase sleepiness.

## 3. High Color Rendering Index (CRI)
A high CRI (80+) ensures that colors are rendered accurately. This is critical for reading wiring diagrams, identifying color-coded cables, and conducting quality control inspections on raw materials.

Investing in proper industrial lighting yields measurable returns in output quality and safety compliance.',
    'Industrial Equipment',
    'Admin',
    'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80'
  ),
  (
    '3c3e6205-d220-4100-84c1-3ee93c834a38',
    'The Future of Smart Street Lighting in Modern Cities',
    'future-smart-street-lighting',
    'Smart cities require smart lighting. Explore how IoT-enabled street lamps are transforming urban infrastructure.',
    '# The Future of Smart Street Lighting in Modern Cities

Streetlights are the silent sentinels of our roads. As cities expand and embrace the Internet of Things (IoT), the humble street lamp post is evolving into a key node of urban smart infrastructure.

## Beyond Illumination: The Multifunctional Light Pole
Modern smart streetlights do far more than emit light. By integrating sensors and wireless connectivity, they serve as hubs for:
* **Environmental Monitoring:** Measuring temperature, humidity, carbon dioxide, and particulate matter.
* **EV Charging Stations:** Providing accessible charging points for electric vehicles in dense urban neighborhoods.
* **Smart Traffic Management:** Using cameras to analyze traffic flow, detect congestion, and optimize traffic signal timing.
* **Public Wi-Fi & 5G Microcells:** Providing cellular density needed for high-speed next-generation connectivity.

## Dynamic Dimming & Smart Controls
Traditional streetlights operate on simple timers or photocells. Smart lighting systems allow central management software to dynamically dim lights when roads are empty, saving up to 40% more energy, and instantly brighten them if pedestrian or vehicle presence is detected.

Jinyu Capital is proud to manufacture high-performance fixtures compatible with modern smart city controllers.',
    'Industry News & Insights',
    'Admin',
    'https://images.unsplash.com/photo-1474112704763-f1119d8a6b3d?auto=format&fit=crop&q=80'
  )
ON CONFLICT (slug) DO NOTHING;
