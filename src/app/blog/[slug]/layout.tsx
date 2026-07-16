import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return { title: 'Blog Post' };
  }
  
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data: post } = await client
      .from('blog_posts')
      .select('title, excerpt')
      .eq('slug', slug)
      .single();
      
    if (post) {
      return {
        title: post.title,
        description: post.excerpt || `Read the latest article: ${post.title} on the Jinyu Capital blog.`,
      };
    }
  } catch (e) {
    console.error('Error generating blog post metadata:', e);
  }
  
  return { title: 'Blog Post' };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
