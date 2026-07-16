import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  
  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/distributor',
    '/contact',
    '/request-quote',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch dynamic product URLs from Supabase
  let productRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      // Products
      const { data: products } = await client
        .from('products')
        .select('id, updated_at')
        .order('created_at', { ascending: false });

      if (products) {
        productRoutes = products.map((product) => ({
          url: `${baseUrl}/products/${product.id}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }

      // Blog posts
      const { data: posts } = await client
        .from('blog_posts')
        .select('slug, updated_at')
        .order('created_at', { ascending: false });

      if (posts) {
        blogRoutes = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    } catch (e) {
      console.error('Error generating sitemap dynamic routes:', e);
    }
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
