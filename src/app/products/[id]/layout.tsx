import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return { title: 'Product Details' };
  }
  
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data: product } = await client
      .from('products')
      .select('name, description')
      .eq('id', id)
      .single();
      
    if (product) {
      return {
        title: product.name,
        description: product.description || `Learn more about the high-performance ${product.name} industrial and landscape lighting solution from Jinyu Capital.`,
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
