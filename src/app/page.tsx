"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Factory, ShieldCheck, Lightbulb, ArrowRight, ChevronLeft, ChevronRight, Globe, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/components/StoreSettingsContext';
import { DEFAULT_HERO_IMAGES, resolveImageUrl } from '@/lib/default-images';
import { supabase } from '@/lib/supabase';

// Static fallback content
const DEFAULT_STATS = [
  { value: '150+', label: 'Product lines' },
  { value: '10k', label: 'Sq.m facility' },
  { value: '50+', label: 'Countries exported' },
  { value: 'ISO', label: '9001 Certified' },
];

const DEFAULT_FEATURES = [
  {
    icon: Factory,
    title: 'Advanced manufacturing',
    description: 'State-of-the-art production facilities equipped with automated assembly lines for precision and scale.',
  },
  {
    icon: ShieldCheck,
    title: 'Rigorous quality control',
    description: 'Comprehensive testing protocols ensuring every appliance and lighting fixture meets international safety standards.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative engineering',
    description: 'Dedicated R&D team continuously developing energy-efficient and smart technology solutions.',
  },
];

export default function Home() {
  const { settings } = useStoreSettings();
  const content = settings?.homepage_content;

  const [recentPosts, setRecentPosts] = React.useState<any[]>([]);
  const [activeHeroSlide, setActiveHeroSlide] = React.useState(0);
  const [heroPaused, setHeroPaused] = React.useState(false);
  const [heroInteractionPaused, setHeroInteractionPaused] = React.useState(false);

  React.useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        if (!error && data) {
          setRecentPosts(data);
        }
      } catch (err) {
        console.error('Error fetching recent posts:', err);
      }
    }
    fetchRecentPosts();
  }, []);

  const heroImage = resolveImageUrl(settings?.hero_image_url, '');
  const configuredHeroImages = (content?.hero_images || [])
    .map((image) => resolveImageUrl(image, ''))
    .filter(Boolean);
  const heroImages = Array.from(new Set(
    configuredHeroImages.length >= 2
      ? configuredHeroImages
      : [...configuredHeroImages, heroImage, ...DEFAULT_HERO_IMAGES],
  )).filter(Boolean).slice(0, 8);
  const manufacturingImage = resolveImageUrl(
    settings?.manufacturing_image_url,
    '',
  );

  const heroHeadline = content?.hero_headline || 'Manufacturing Excellence From China To The World';
  const heroSubheadline = content?.hero_subheadline || 'Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.';
  const stats = content?.stats?.length ? content.stats : DEFAULT_STATS;
  const manufacturingHeadline = content?.manufacturing_headline || 'Manufacturing excellence';
  const manufacturingBody = content?.manufacturing_body || 'Built on a foundation of engineering expertise, we deliver reliable products that meet the demands of global markets. Our Guangzhou facility represents the pinnacle of modern production capabilities.';
  const showcaseProducts = content?.showcase_products?.length
    ? content.showcase_products.map((product) => ({
        ...product,
        image: resolveImageUrl(product.image, ''),
      }))
    : [];

  React.useEffect(() => {
    if (activeHeroSlide >= heroImages.length) setActiveHeroSlide(0);
  }, [activeHeroSlide, heroImages.length]);

  React.useEffect(() => {
    if (heroImages.length <= 1 || heroPaused || heroInteractionPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      setActiveHeroSlide((current) => (current + 1) % heroImages.length);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [activeHeroSlide, heroImages.length, heroPaused, heroInteractionPaused]);

  const changeHeroSlide = (direction: -1 | 1) => {
    setActiveHeroSlide((current) => (current + direction + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-zinc-950"
        role="region"
        aria-roledescription="carousel"
        aria-label="Jinyu Capital highlights"
        onMouseEnter={() => setHeroInteractionPaused(true)}
        onMouseLeave={() => setHeroInteractionPaused(false)}
        onFocus={() => setHeroInteractionPaused(true)}
        onBlur={() => setHeroInteractionPaused(false)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') changeHeroSlide(-1);
          if (event.key === 'ArrowRight') changeHeroSlide(1);
        }}
      >
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          {heroImages.length ? heroImages.map((image, index) => (
            <motion.div
              key={image}
              initial={false}
              animate={{ opacity: index === activeHeroSlide ? 1 : 0, scale: index === activeHeroSlide ? 1 : 1.025 }}
              transition={{ opacity: { duration: 1.1, ease: 'easeInOut' }, scale: { duration: 7, ease: 'linear' } }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          )) : <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900" />}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/75" aria-hidden="true" />

        <div className="section-container py-28 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-8" style={{
              letterSpacing: '-0.03em',
              textWrap: 'balance'
            }}>
              {heroHeadline}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 text-white/90">
              {heroSubheadline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
              <Button asChild size="lg" className="text-base px-8 h-12">
                <Link href="/products" className="flex items-center">
                  Explore our products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 h-12">
                <Link href="/request-quote">Request a quote</Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-white/20 max-w-md mx-auto">
              <p className="text-sm text-white/70 mb-3">Looking to expand your business?</p>
              <Link href="/distributor" className="inline-flex items-center text-white hover:text-primary transition-colors font-semibold text-lg">
                <Globe className="w-5 h-5 mr-2.5" />
                Become a Global Distributor
              </Link>
            </div>
          </motion.div>
        </div>

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-2 py-2 text-white shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => changeHeroSlide(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Show previous hero image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5" role="group" aria-label="Choose hero image">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-current={index === activeHeroSlide ? "true" : undefined}
                  aria-label={`Show hero image ${index + 1}`}
                  onClick={() => setActiveHeroSlide(index)}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    index === activeHeroSlide ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setHeroPaused((paused) => !paused)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={heroPaused ? "Resume automatic hero rotation" : "Pause automatic hero rotation"}
            >
              {heroPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => changeHeroSlide(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Show next hero image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="sr-only" aria-live="polite">Hero image {activeHeroSlide + 1} of {heroImages.length}</p>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence Section */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ textWrap: 'balance' }}>
                {manufacturingHeadline}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                {manufacturingBody}
              </p>
              
              <div className="space-y-8">
                {DEFAULT_FEATURES.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              {manufacturingImage ? (
                <img src={manufacturingImage} alt="Jinyu in-house production and assembly workshop" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
              ) : (
                <div className="rounded-2xl shadow-xl w-full aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-bold border border-zinc-800 p-6 text-center gap-2">
                  <Factory className="w-12 h-12 text-zinc-600 mb-2" />
                  <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">Guangzhou Production Facility</span>
                  <span className="text-xs font-normal text-zinc-500 max-w-xs">High-performance manufacturing, assembly, and testing workshop</span>
                </div>
              )}
              <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-lg border hidden md:block">
                <div className="text-4xl font-bold text-primary mb-1">10k+</div>
                <div className="text-sm font-medium text-muted-foreground">Sq.m Production Area</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
      {showcaseProducts.length > 0 && (
        <section className="py-24 bg-muted">
          <div className="section-container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ textWrap: 'balance' }}>
                  Featured product lines
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Explore our signature street lighting collections, engineered for superior outdoor performance, longevity, and aesthetic appeal.
                </p>
              </div>
              <Button asChild variant="outline" className="flex-shrink-0">
                <Link href="/products">View all products</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {showcaseProducts.map((product, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary/50 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500">
                        <Lightbulb className="w-8 h-8 text-zinc-700" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blog Posts Section */}
      {recentPosts.length > 0 && (
        <section className="py-24 bg-background border-t">
          <div className="section-container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ textWrap: 'balance' }}>
                  Latest news & insights
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Stay updated with our latest technology breakthroughs, lighting guides, and company announcements.
                </p>
              </div>
              <Button asChild variant="outline" className="flex-shrink-0">
                <Link href="/blog">Read all insights</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                    <div className="aspect-video overflow-hidden bg-muted flex items-center justify-center">
                      {post.featured_image_url ? (
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500">
                          <Factory className="w-8 h-8 text-zinc-700" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-3 block">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="font-bold text-primary group-hover:underline">Read More →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-background text-foreground border-t">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6" style={{ textWrap: 'balance' }}>
              Partner with a reliable manufacturer
            </h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-10 text-muted-foreground">
              Whether you need OEM services or bulk orders of our standard product lines, our team is ready to support your business.
            </p>
            <Button asChild size="lg" className="px-8 h-12 text-base">
              <Link href="/request-quote">Contact our sales team</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
