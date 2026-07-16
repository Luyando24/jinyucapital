import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { title: 'Product Details' };
  }
  
  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: product } = await client
      .from('products')
      .select('name, description, image')
      .eq('id', id)
      .single();
      
    if (product) {
      return {
        title: product.name,
        description: product.description || `Learn more about the high-performance ${product.name} industrial and landscape lighting solution from Jinyu Capital.`,
        alternates: { canonical: `/products/${id}` },
        openGraph: {
          title: product.name,
          description: product.description || `Industrial lighting solution from Jinyu Capital.`,
          url: `${SITE_URL}/products/${id}`,
          images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
        },
      };
    }
  } catch (e) {
    console.error('Error generating product metadata:', e);
  }
  
  return { title: 'Product Details' };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
