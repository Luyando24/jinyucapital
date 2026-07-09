export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Jinyu Skyline Boulevard LED Street Lamp',
    price: 149.99,
    image: '/products/O1CN01Da2lyL2G0zUST1Ofs_!!2221348218954-0-cib.jpg',
    description: '100W-250W high-output street lamp engineered with a die-cast aluminum housing and IP66 waterproof rating for high-performance municipal, highway, and parking lot illumination.',
    category: 'Street Lamps',
    rating: 4.9,
    reviews: 142,
  },
  {
    id: '2',
    name: 'Jinyu Metro Avenue LED Street Lamp',
    price: 199.99,
    image: '/products/O1CN01N23WUW1XNkQ0pBnuk_!!2216802942912-0-cib.jpg',
    description: '80W-200W premium street luminaire designed for highways and urban avenues. Heavy-duty aluminum alloy housing with advanced thermal management.',
    category: 'Street Lamps',
    rating: 5.0,
    reviews: 64,
  },
  {
    id: '3',
    name: 'Jinyu Fortune Tree Landscape Lamp',
    price: 899.99,
    image: '/products/O1CN01RYnR551fsuHOJPb5X_!!2219827714063-0-cib.jpg',
    description: '4.0m-6.0m elegant outdoor tree luminaire constructed from galvanized steel and aluminum. Perfect for parks, public plazas, and luxury commercial walkways.',
    category: 'Landscape Lamps',
    rating: 4.8,
    reviews: 215,
  },
  {
    id: '4',
    name: 'Jinyu Van Gogh Trees Landscape Lamp',
    price: 1199.99,
    image: '/products/O1CN01TQaAhk1XNkQ1q9LBU_!!2216802942912-0-cib.jpg',
    description: '3.5m-5.5m artistic tree structure featuring die-cast aluminum alloy canopy and leaves. Integrates RGB ambient lighting for premium nightscape designs.',
    category: 'Landscape Lamps',
    rating: 4.7,
    reviews: 189,
  },
  {
    id: '5',
    name: "Jinyu Angel's Wings Landscape Light",
    price: 749.99,
    image: '/products/O1CN01hwVOPJ1YvvXdgVilS_!!2213303343122-0-cib.jpg',
    description: '4.5m tall modern landscape sculpture made of premium grade 304 stainless steel. Features a swept-back illuminated form silhouette providing ambient night glow.',
    category: 'Landscape Lamps',
    rating: 4.9,
    reviews: 98,
  },
  {
    id: '6',
    name: 'Jinyu Smart Ceiling Light',
    price: 49.99,
    image: '/products/O1CN01i167Jl23vhT7G9Jqa_!!2219775137318-0-cib.jpg',
    description: 'Sleek, low-profile intelligent ceiling lamp. Features customizable color temperatures (3000K-6000K), voice assistant compatibility, and high energy efficiency.',
    category: 'Ceiling Lights',
    rating: 4.6,
    reviews: 73,
  },
  {
    id: '7',
    name: 'Jinyu Luxury Acrylic Panel Light',
    price: 79.99,
    image: '/products/O1CN01kfCamW1tqWrE8wdWU_!!2220042935953-0-cib.jpg',
    description: 'Contemporary square ceiling panel light with a high-transmittance luxury acrylic diffuser. Provides glare-free, uniform light for modern office and residential spaces.',
    category: 'Ceiling Lights',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: '8',
    name: 'Jinyu Electroplated Wall Lamp',
    price: 59.99,
    image: '/products/O1CN01mLs8y52G0zURiCd4z_!!2221348218954-0-cib.jpg',
    description: 'Elegant modern wall sconce with a hand-polished electroplated finish. Delivers a soft warm white glow ideal for luxury hallways and dining spaces.',
    category: 'Wall Sconces',
    rating: 4.9,
    reviews: 82,
  },
  {
    id: '9',
    name: 'Jinyu Walnut Finish Tri-Color LED Pendant',
    price: 129.99,
    image: '/products/O1CN01p4jgJX23vhT7G7J0k_!!2219775137318-0-cib.jpg',
    description: 'Minimalistic linear pendant lamp in solid walnut wood finish. Features tri-color LED switching (warm, neutral, cool white) for customizable dining experiences.',
    category: 'Pendant Lamps',
    rating: 5.0,
    reviews: 41,
  },
  {
    id: '10',
    name: 'Jinyu Heavy Duty Industrial Floodlight',
    price: 249.99,
    image: '/products/O1CN01pRzXew1ljdw6TDQdt_!!3975124855-0-cib.jpg',
    description: 'High-output industrial LED floodlight built for sports arenas, ports, and construction sites. Features robust IP66 weatherproofing and die-cast aluminum heat sink.',
    category: 'Industrial Lighting',
    rating: 4.7,
    reviews: 32,
  },
];
