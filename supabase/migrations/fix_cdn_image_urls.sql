-- Replace broken Hostinger Horizons CDN URLs (403 Forbidden) with working defaults.

UPDATE store_settings
SET
  hero_image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920'
WHERE hero_image_url LIKE '%horizons-cdn.hostinger.com%';

UPDATE store_settings
SET
  manufacturing_image_url = 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=1920'
WHERE manufacturing_image_url LIKE '%horizons-cdn.hostinger.com%';

UPDATE store_settings
SET logo_url = NULL
WHERE logo_url LIKE '%horizons-cdn.hostinger.com%';

-- Rewrite showcase product images inside homepage_content JSON
UPDATE store_settings
SET homepage_content = jsonb_set(
  homepage_content,
  '{showcase_products}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN elem->>'image' LIKE '%horizons-cdn.hostinger.com%' THEN
          jsonb_set(
            elem,
            '{image}',
            to_jsonb(
              CASE (ordinality - 1) % 3
                WHEN 0 THEN 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800'
                WHEN 1 THEN 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'
                ELSE 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=800'
              END
            )
          )
        ELSE elem
      END
    )
    FROM jsonb_array_elements(homepage_content->'showcase_products') WITH ORDINALITY AS t(elem, ordinality)
  )
)
WHERE homepage_content->'showcase_products' IS NOT NULL
  AND homepage_content::text LIKE '%horizons-cdn.hostinger.com%';
