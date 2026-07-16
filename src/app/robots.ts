import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/checkout/', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
