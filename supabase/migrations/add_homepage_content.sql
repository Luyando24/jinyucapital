-- ============================================================
-- Jinyu Capital – Add homepage content & extended store settings
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Add extended store settings columns (safe - uses IF NOT EXISTS logic)
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS store_name         TEXT DEFAULT 'Jinyu Capital',
  ADD COLUMN IF NOT EXISTS tiktok             TEXT,
  ADD COLUMN IF NOT EXISTS facebook           TEXT DEFAULT 'https://www.facebook.com/profile.php?id=61590193816131',
  ADD COLUMN IF NOT EXISTS instagram          TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url     TEXT DEFAULT 'https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/88fc8296ed52347192f2faf67093b795.png',
  ADD COLUMN IF NOT EXISTS manufacturing_image_url TEXT DEFAULT 'https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/3ec89bf6e24c3c85836ead9b9a89aa7e.png',
  ADD COLUMN IF NOT EXISTS homepage_content   JSONB DEFAULT '{}'::jsonb;

-- Seed default homepage_content for the singleton row
UPDATE store_settings
SET
  store_name = COALESCE(store_name, 'Jinyu Capital'),
  hero_image_url = COALESCE(hero_image_url, 'https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/88fc8296ed52347192f2faf67093b795.png'),
  manufacturing_image_url = COALESCE(manufacturing_image_url, 'https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/3ec89bf6e24c3c85836ead9b9a89aa7e.png'),
  homepage_content = CASE
    WHEN homepage_content IS NULL OR homepage_content = '{}'::jsonb THEN
      '{
        "hero_headline": "Manufacturing Excellence From China To The World",
        "hero_subheadline": "Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.",
        "stats": [
          {"value": "150+", "label": "Product lines"},
          {"value": "10k", "label": "Sq.m facility"},
          {"value": "50+", "label": "Countries exported"},
          {"value": "ISO", "label": "9001 Certified"}
        ],
        "manufacturing_headline": "Manufacturing excellence",
        "manufacturing_body": "Built on a foundation of engineering expertise, we deliver reliable products that meet the demands of global markets. Our Guangzhou facility represents the pinnacle of modern production capabilities.",
        "showcase_products": [
          {
            "title": "Skyline Boulevard Series",
            "description": "Designed for modern cities, business districts, residential communities, and municipal infrastructure projects, the Skyline Boulevard Series combines contemporary aesthetics with exceptional lighting performance.",
            "image": "https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/2d2f38454b0a51de12a8d25ef8865e29.png"
          },
          {
            "title": "Urban Road Lighting Series",
            "description": "Reliable LED street lighting for urban roads, parks, estates, and commercial projects. Designed for strong illumination, energy efficiency, and long service life.",
            "image": "https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/202c6c4ad9decc793555fc90c89a010b.png"
          },
          {
            "title": "Metro Avenue Series",
            "description": "Modern LED street lighting for highways, city roads, business parks, and residential developments. Built for efficient illumination, durability, and long-lasting outdoor performance.",
            "image": "https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/37662bcfd9d866fc2b36dd3037f09255.png"
          }
        ]
      }'::jsonb
    ELSE homepage_content
  END
WHERE id = 1;
