-- ============================================================
-- Jinyu Capital – Product Seed Data
-- Run this in Supabase Dashboard > SQL Editor
-- This bypasses RLS and inserts all 10 frontend products.
-- ============================================================

INSERT INTO products (name, category, price, stock_quantity, image, images, description, is_wholesale, moq_price, moq_quantity)
VALUES
  (
    'Jinyu Skyline Boulevard LED Street Lamp',
    'Street Lamps',
    149.99,
    50,
    '/products/O1CN01Da2lyL2G0zUST1Ofs_!!2221348218954-0-cib.jpg',
    '{}',
    '100W-250W high-output street lamp engineered with a die-cast aluminum housing and IP66 waterproof rating for high-performance municipal, highway, and parking lot illumination.',
    TRUE,
    119.99,
    10
  ),
  (
    'Jinyu Metro Avenue LED Street Lamp',
    'Street Lamps',
    199.99,
    35,
    '/products/O1CN01N23WUW1XNkQ0pBnuk_!!2216802942912-0-cib.jpg',
    '{}',
    '80W-200W premium street luminaire designed for highways and urban avenues. Heavy-duty aluminum alloy housing with advanced thermal management.',
    FALSE,
    NULL,
    10
  ),
  (
    'Jinyu Fortune Tree Landscape Lamp',
    'Landscape Lamps',
    899.99,
    20,
    '/products/O1CN01RYnR551fsuHOJPb5X_!!2219827714063-0-cib.jpg',
    '{}',
    '4.0m-6.0m elegant outdoor tree luminaire constructed from galvanized steel and aluminum. Perfect for parks, public plazas, and luxury commercial walkways.',
    FALSE,
    NULL,
    10
  ),
  (
    'Jinyu Van Gogh Trees Landscape Lamp',
    'Landscape Lamps',
    1199.99,
    15,
    '/products/O1CN01TQaAhk1XNkQ1q9LBU_!!2216802942912-0-cib.jpg',
    '{}',
    '3.5m-5.5m artistic tree structure featuring die-cast aluminum alloy canopy and leaves. Integrates RGB ambient lighting for premium nightscape designs.',
    TRUE,
    899.99,
    3
  ),
  (
    'Jinyu Angel''s Wings Landscape Light',
    'Landscape Lamps',
    749.99,
    25,
    '/products/O1CN01hwVOPJ1YvvXdgVilS_!!2213303343122-0-cib.jpg',
    '{}',
    '4.5m tall modern landscape sculpture made of premium grade 304 stainless steel. Features a swept-back illuminated form silhouette providing ambient night glow.',
    FALSE,
    NULL,
    10
  ),
  (
    'Jinyu Smart Ceiling Light',
    'Ceiling Lights',
    49.99,
    100,
    '/products/O1CN01i167Jl23vhT7G9Jqa_!!2219775137318-0-cib.jpg',
    '{}',
    'Sleek, low-profile intelligent ceiling lamp. Features customizable color temperatures (3000K-6000K), voice assistant compatibility, and high energy efficiency.',
    FALSE,
    NULL,
    10
  ),
  (
    'Jinyu Luxury Acrylic Panel Light',
    'Ceiling Lights',
    79.99,
    80,
    '/products/O1CN01kfCamW1tqWrE8wdWU_!!2220042935953-0-cib.jpg',
    '{}',
    'Contemporary square ceiling panel light with a high-transmittance luxury acrylic diffuser. Provides glare-free, uniform light for modern office and residential spaces.',
    FALSE,
    NULL,
    10
  ),
  (
    'Jinyu Electroplated Wall Lamp',
    'Wall Sconces',
    59.99,
    60,
    '/products/O1CN01mLs8y52G0zURiCd4z_!!2221348218954-0-cib.jpg',
    '{}',
    'Elegant modern wall sconce with a hand-polished electroplated finish. Delivers a soft warm white glow ideal for luxury hallways and dining spaces.',
    TRUE,
    44.99,
    12
  ),
  (
    'Jinyu Walnut Finish Tri-Color LED Pendant',
    'Pendant Lamps',
    129.99,
    40,
    '/products/O1CN01p4jgJX23vhT7G7J0k_!!2219775137318-0-cib.jpg',
    '{}',
    'Minimalistic linear pendant lamp in solid walnut wood finish. Features tri-color LED switching (warm, neutral, cool white) for customizable dining experiences.',
    TRUE,
    99.99,
    5
  ),
  (
    'Jinyu Heavy Duty Industrial Floodlight',
    'Industrial Lighting',
    249.99,
    30,
    '/products/O1CN01pRzXew1ljdw6TDQdt_!!3975124855-0-cib.jpg',
    '{}',
    'High-output industrial LED floodlight built for sports arenas, ports, and construction sites. Features robust IP66 weatherproofing and die-cast aluminum heat sink.',
    FALSE,
    NULL,
    10
  )
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT id, name, category, price, stock_quantity, is_wholesale
FROM products
ORDER BY category, name;
