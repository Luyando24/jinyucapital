import { createClient } from "@supabase/supabase-js";
import { SITE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/site";
import { DEFAULT_HERO_IMAGES, DEFAULT_SHOWCASE, resolveImageUrl } from "@/lib/default-images";
import type { ShowcaseProduct } from "@/components/StoreSettingsContext";
import HomeHeroCarousel from "@/components/HomeHeroCarousel";
import {
  HomeStatsSection,
  HomeManufacturingSection,
  HomeProductsSection,
  HomeBlogSection,
  HomeCtaSection,
} from "@/components/HomeSections";
import type { Metadata } from "next";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Jinyu Capital | Premium Industrial & Landscape Lighting",
  description:
    "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions from Guangzhou. Certified to ISO 9001 and ATEX/EX standards.",
  alternates: {
    canonical: SITE_URL,
  },
};

// ─── Static fallbacks ─────────────────────────────────────────────────────────

const DEFAULT_STATS = [
  { value: "150+", label: "Product lines" },
  { value: "10k", label: "Sq.m facility" },
  { value: "50+", label: "Countries exported" },
  { value: "ISO", label: "9001 Certified" },
];

// ─── Server-side data fetching ────────────────────────────────────────────────

async function getPageData() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { settings: null, recentPosts: [] };
  }

  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const [{ data: settings }, { data: posts }] = await Promise.all([
      client.from("store_settings").select("*").eq("id", 1).single(),
      client
        .from("blog_posts")
        .select("id, slug, title, excerpt, category, featured_image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    return {
      settings: settings ?? null,
      recentPosts: posts ?? [],
    };
  } catch (err) {
    console.error("Error fetching homepage data:", err);
    return { settings: null, recentPosts: [] };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const { settings, recentPosts } = await getPageData();
  const content = settings?.homepage_content;

  // Hero images
  const heroImage = resolveImageUrl(settings?.hero_image_url, "");
  const configuredHeroImages = (content?.hero_images || [])
    .map((image: string) => resolveImageUrl(image, ""))
    .filter(Boolean);
  const heroImages = Array.from(
    new Set(
      configuredHeroImages.length >= 2
        ? configuredHeroImages
        : [...configuredHeroImages, heroImage, ...DEFAULT_HERO_IMAGES]
    )
  )
    .filter(Boolean)
    .slice(0, 8) as string[];

  // Text content
  const heroHeadline =
    content?.hero_headline ||
    "Manufacturing Excellence From China To The World";
  const heroSubheadline =
    content?.hero_subheadline ||
    "Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.";
  const stats = content?.stats?.length ? content.stats : DEFAULT_STATS;
  const manufacturingHeadline =
    content?.manufacturing_headline || "Manufacturing excellence";
  const manufacturingBody =
    content?.manufacturing_body ||
    "Built on a foundation of engineering expertise, we deliver reliable products that meet the demands of global markets. Our Guangzhou facility represents the pinnacle of modern production capabilities.";
  const manufacturingImage = resolveImageUrl(
    settings?.manufacturing_image_url,
    ""
  );

  // Showcase products
  const showcaseProducts: { title: string; description: string; image: string }[] =
    content?.showcase_products?.length
      ? content.showcase_products.map((product: ShowcaseProduct) => ({
          title: product.title,
          description: product.description,
          image: resolveImageUrl(product.image, ""),
        }))
      : DEFAULT_SHOWCASE.map((p) => ({ title: p.title, description: p.description, image: p.image }));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero — interactive carousel (client) */}
      <HomeHeroCarousel
        heroImages={heroImages}
        heroHeadline={heroHeadline}
        heroSubheadline={heroSubheadline}
      />

      {/* Stats bar */}
      <HomeStatsSection stats={stats} />

      {/* Manufacturing section */}
      <HomeManufacturingSection
        headline={manufacturingHeadline}
        body={manufacturingBody}
        image={manufacturingImage}
      />

      {/* Product showcase */}
      <HomeProductsSection products={showcaseProducts} />

      {/* Recent blog posts (server-fetched) */}
      <HomeBlogSection posts={recentPosts} />

      {/* CTA */}
      <HomeCtaSection />
    </div>
  );
}
