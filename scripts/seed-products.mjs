// ============================================================
// seed-products.mjs
// Seeds the 10 frontend products into the Supabase products table.
// Run: node scripts/seed-products.mjs
// ============================================================

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local manually (UTF-8)
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      process.env[key] = val;
    }
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// The SITE_URL is used to build absolute image URLs that Supabase can store.
// In dev this is localhost:3000; on production this is https://jinyucapital.com
// The image column stores the public path — the app renders it via <img src={product.image} />
// so relative /products/... paths work fine when served from the Next.js public folder.

const products = [
  {
    name: 'Jinyu Skyline Boulevard LED Street Lamp',
    price: 149.99,
    stock_quantity: 50,
    image: '/products/O1CN01Da2lyL2G0zUST1Ofs_!!2221348218954-0-cib.jpg',
    images: [],
    description: '100W-250W high-output street lamp engineered with a die-cast aluminum housing and IP66 waterproof rating for high-performance municipal, highway, and parking lot illumination.',
    category: 'Street Lamps',
    is_wholesale: true,
    moq_price: 119.99,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Metro Avenue LED Street Lamp',
    price: 199.99,
    stock_quantity: 35,
    image: '/products/O1CN01N23WUW1XNkQ0pBnuk_!!2216802942912-0-cib.jpg',
    images: [],
    description: '80W-200W premium street luminaire designed for highways and urban avenues. Heavy-duty aluminum alloy housing with advanced thermal management.',
    category: 'Street Lamps',
    is_wholesale: false,
    moq_price: null,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Fortune Tree Landscape Lamp',
    price: 899.99,
    stock_quantity: 20,
    image: '/products/O1CN01RYnR551fsuHOJPb5X_!!2219827714063-0-cib.jpg',
    images: [],
    description: '4.0m-6.0m elegant outdoor tree luminaire constructed from galvanized steel and aluminum. Perfect for parks, public plazas, and luxury commercial walkways.',
    category: 'Landscape Lamps',
    is_wholesale: false,
    moq_price: null,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Van Gogh Trees Landscape Lamp',
    price: 1199.99,
    stock_quantity: 15,
    image: '/products/O1CN01TQaAhk1XNkQ1q9LBU_!!2216802942912-0-cib.jpg',
    images: [],
    description: '3.5m-5.5m artistic tree structure featuring die-cast aluminum alloy canopy and leaves. Integrates RGB ambient lighting for premium nightscape designs.',
    category: 'Landscape Lamps',
    is_wholesale: true,
    moq_price: 899.99,
    moq_quantity: 3,
  },
  {
    name: "Jinyu Angel's Wings Landscape Light",
    price: 749.99,
    stock_quantity: 25,
    image: '/products/O1CN01hwVOPJ1YvvXdgVilS_!!2213303343122-0-cib.jpg',
    images: [],
    description: '4.5m tall modern landscape sculpture made of premium grade 304 stainless steel. Features a swept-back illuminated form silhouette providing ambient night glow.',
    category: 'Landscape Lamps',
    is_wholesale: false,
    moq_price: null,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Smart Ceiling Light',
    price: 49.99,
    stock_quantity: 100,
    image: '/products/O1CN01i167Jl23vhT7G9Jqa_!!2219775137318-0-cib.jpg',
    images: [],
    description: 'Sleek, low-profile intelligent ceiling lamp. Features customizable color temperatures (3000K-6000K), voice assistant compatibility, and high energy efficiency.',
    category: 'Ceiling Lights',
    is_wholesale: false,
    moq_price: null,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Luxury Acrylic Panel Light',
    price: 79.99,
    stock_quantity: 80,
    image: '/products/O1CN01kfCamW1tqWrE8wdWU_!!2220042935953-0-cib.jpg',
    images: [],
    description: 'Contemporary square ceiling panel light with a high-transmittance luxury acrylic diffuser. Provides glare-free, uniform light for modern office and residential spaces.',
    category: 'Ceiling Lights',
    is_wholesale: false,
    moq_price: null,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Electroplated Wall Lamp',
    price: 59.99,
    stock_quantity: 60,
    image: '/products/O1CN01mLs8y52G0zURiCd4z_!!2221348218954-0-cib.jpg',
    images: [],
    description: 'Elegant modern wall sconce with a hand-polished electroplated finish. Delivers a soft warm white glow ideal for luxury hallways and dining spaces.',
    category: 'Wall Sconces',
    is_wholesale: true,
    moq_price: 44.99,
    moq_quantity: 12,
  },
  {
    name: 'Jinyu Walnut Finish Tri-Color LED Pendant',
    price: 129.99,
    stock_quantity: 40,
    image: '/products/O1CN01p4jgJX23vhT7G7J0k_!!2219775137318-0-cib.jpg',
    images: [],
    description: 'Minimalistic linear pendant lamp in solid walnut wood finish. Features tri-color LED switching (warm, neutral, cool white) for customizable dining experiences.',
    category: 'Pendant Lamps',
    is_wholesale: true,
    moq_price: 99.99,
    moq_quantity: 5,
  },
  {
    name: 'Jinyu Heavy Duty Industrial Floodlight',
    price: 249.99,
    stock_quantity: 30,
    image: '/products/O1CN01pRzXew1ljdw6TDQdt_!!3975124855-0-cib.jpg',
    images: [],
    description: 'High-output industrial LED floodlight built for sports arenas, ports, and construction sites. Features robust IP66 weatherproofing and die-cast aluminum heat sink.',
    category: 'Industrial Lighting',
    is_wholesale: false,
    moq_price: null,
    moq_quantity: 10,
  },
];

async function seed() {
  console.log(`\n🌱  Seeding ${products.length} products into Supabase...\n`);

  // Check for existing products to avoid duplicates
  const { data: existing } = await supabase.from('products').select('name');
  const existingNames = new Set((existing || []).map(p => p.name));

  const toInsert = products.filter(p => !existingNames.has(p.name));
  const skipped = products.length - toInsert.length;

  if (skipped > 0) {
    console.log(`⚠️   Skipping ${skipped} already-existing product(s).`);
  }

  if (toInsert.length === 0) {
    console.log('✅  All products already exist — nothing to insert.\n');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .insert(toInsert)
    .select('id, name');

  if (error) {
    console.error('❌  Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`✅  Inserted ${data.length} products:\n`);
  data.forEach(p => console.log(`   • ${p.name}  (${p.id})`));
  console.log('\n🎉  Done!\n');
}

seed().catch(err => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
