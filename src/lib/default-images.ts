/** Working fallback images — Hostinger Horizons CDN returns 403. */
export const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920';

export const DEFAULT_MANUFACTURING_IMAGE =
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=1920';

export const DEFAULT_SHOWCASE = [
  {
    title: 'Skyline Boulevard Series',
    description:
      'Designed for modern cities, business districts, residential communities, and municipal infrastructure projects, the Skyline Boulevard Series combines contemporary aesthetics with exceptional lighting performance. Its durable construction, energy-efficient LED technology, and weather-resistant design ensure reliable illumination while enhancing the appearance of any roadway.',
    image:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Urban Road Lighting Series',
    description:
      'Reliable LED street lighting for urban roads, parks, estates, and commercial projects. Designed for strong illumination, energy efficiency, and long service life.',
    image:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Metro Avenue Series',
    description:
      'Modern LED street lighting for highways, city roads, business parks, and residential developments. Built for efficient illumination, durability, and long-lasting outdoor performance.',
    image:
      'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=800',
  },
] as const;

const DEAD_CDN_HOST = 'horizons-cdn.hostinger.com';

/** Replace broken Hostinger CDN URLs (403) with a working fallback. */
export function resolveImageUrl(
  url: string | undefined | null,
  fallback: string,
): string {
  if (!url) return fallback;
  if (url.includes(DEAD_CDN_HOST)) return fallback;
  return url;
}
