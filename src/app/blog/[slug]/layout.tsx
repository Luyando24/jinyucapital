import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { title: 'Blog Post' };
  }
  
  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: post } = await client
      .from('blog_posts')
      .select('title, excerpt, featured_image_url')
      .eq('slug', slug)
      .single();
      
    if (post) {
      return {
        title: post.title,
        description: post.excerpt || `Read the latest article: ${post.title} on the Jinyu Capital blog.`,
        alternates: { canonical: `/blog/${slug}` },
        openGraph: {
          title: post.title,
          description: post.excerpt || `Read the latest article from Jinyu Capital.`,
          url: `${SITE_URL}/blog/${slug}`,
          type: "article",
          images: post.featured_image_url ? [{ url: post.featured_image_url, alt: post.title }] : undefined,
        },
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
