const { createClient } = require('@supabase/supabase-js');

// Direct credentials for migration
const supabaseUrl = 'https://mbntpoimbzrczsqfsgvg.supabase.co';
const supabaseKey = 'sb_publishable_KXBk6Qwf68Lbm9R_wHVesQ_zGKR2Jlf';

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: 'Jinyu Skyline Boulevard LED Street Lamp',
    price: 149.99,
    image: '/products/O1CN01Da2lyL2G0zUST1Ofs_!!2221348218954-0-cib.jpg',
    description: '100W-250W high-output street lamp engineered with a die-cast aluminum housing and IP66 waterproof rating for high-performance municipal, highway, and parking lot illumination.',
    category: 'Street Lamps',
    stock_quantity: 100,
    is_wholesale: true,
    moq_price: 119.99,
    moq_quantity: 10,
  },
  {
    name: 'Jinyu Metro Avenue LED Street Lamp',
    price: 199.99,
    image: '/products/O1CN01N23WUW1XNkQ0pBnuk_!!2216802942912-0-cib.jpg',
    description: '80W-200W premium street luminaire designed for highways and urban avenues. Heavy-duty aluminum alloy housing with advanced thermal management.',
    category: 'Street Lamps',
    stock_quantity: 80,
    is_wholesale: false,
  },
  {
    name: 'Jinyu Fortune Tree Landscape Lamp',
    price: 899.99,
    image: '/products/O1CN01RYnR551fsuHOJPb5X_!!2219827714063-0-cib.jpg',
    description: '4.0m-6.0m elegant outdoor tree luminaire constructed from galvanized steel and aluminum. Perfect for parks, public plazas, and luxury commercial walkways.',
    category: 'Landscape Lamps',
    stock_quantity: 50,
    is_wholesale: false,
  },
  {
    name: 'Jinyu Van Gogh Trees Landscape Lamp',
    price: 1199.99,
    image: '/products/O1CN01TQaAhk1XNkQ1q9LBU_!!2216802942912-0-cib.jpg',
    description: '3.5m-5.5m artistic tree structure featuring die-cast aluminum alloy canopy and leaves. Integrates RGB ambient lighting for premium nightscape designs.',
    category: 'Landscape Lamps',
    stock_quantity: 40,
    is_wholesale: true,
    moq_price: 899.99,
    moq_quantity: 3,
  },
  {
    name: 'Jinyu Angel\'s Wings Landscape Light',
    price: 749.99,
    image: '/products/O1CN01hwVOPJ1YvvXdgVilS_!!2213303343122-0-cib.jpg',
    description: '4.5m tall modern landscape sculpture made of premium grade 304 stainless steel. Features a swept-back illuminated form silhouette providing ambient night glow.',
    category: 'Landscape Lamps',
    stock_quantity: 35,
    is_wholesale: false,
  },
  {
    name: 'Jinyu Smart Ceiling Light',
    price: 49.99,
    image: '/products/O1CN01i167Jl23vhT7G9Jqa_!!2219775137318-0-cib.jpg',
    description: 'Sleek, low-profile intelligent ceiling lamp. Features customizable color temperatures (3000K-6000K), voice assistant compatibility, and high energy efficiency.',
    category: 'Ceiling Lights',
    stock_quantity: 200,
    is_wholesale: false,
  },
  {
    name: 'Jinyu Luxury Acrylic Panel Light',
    price: 79.99,
    image: '/products/O1CN01kfCamW1tqWrE8wdWU_!!2220042935953-0-cib.jpg',
    description: 'Contemporary square ceiling panel light with a high-transmittance luxury acrylic diffuser. Provides glare-free, uniform light for modern office and residential spaces.',
    category: 'Ceiling Lights',
    stock_quantity: 150,
    is_wholesale: false,
  },
  {
    name: 'Jinyu Electroplated Wall Lamp',
    price: 59.99,
    image: '/products/O1CN01mLs8y52G0zURiCd4z_!!2221348218954-0-cib.jpg',
    description: 'Elegant modern wall sconce with a hand-polished electroplated finish. Delivers a soft warm white glow ideal for luxury hallways and dining spaces.',
    category: 'Wall Sconces',
    stock_quantity: 120,
    is_wholesale: true,
    moq_price: 44.99,
    moq_quantity: 12,
  },
  {
    name: 'Jinyu Walnut Finish Tri-Color LED Pendant',
    price: 129.99,
    image: '/products/O1CN01p4jgJX23vhT7G7J0k_!!2219775137318-0-cib.jpg',
    description: 'Minimalistic linear pendant lamp in solid walnut wood finish. Features tri-color LED switching (warm, neutral, cool white) for customizable dining experiences.',
    category: 'Pendant Lamps',
    stock_quantity: 60,
    is_wholesale: true,
    moq_price: 99.99,
    moq_quantity: 5,
  },
  {
    name: 'Jinyu Heavy Duty Industrial Floodlight',
    price: 249.99,
    image: '/products/O1CN01pRzXew1ljdw6TDQdt_!!3975124855-0-cib.jpg',
    description: 'High-output industrial LED floodlight built for sports arenas, ports, and construction sites. Features robust IP66 weatherproofing and die-cast aluminum heat sink.',
    category: 'Industrial Lighting',
    stock_quantity: 45,
    is_wholesale: false,
  },
];

async function migrateProducts() {
  console.log('Starting product migration...');
  
  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing products:', checkError);
      process.exit(1);
    }
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('Products already exist in the database. Skipping migration.');
      console.log('To re-migrate, delete existing products first.');
      return;
    }
    
    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();
    
    if (error) {
      console.error('Error inserting products:', error);
      process.exit(1);
    }
    
    console.log(`Successfully migrated ${data.length} products to Supabase`);
    console.log('Product IDs:', data.map(p => p.id));
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProducts();
