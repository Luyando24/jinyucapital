"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Factory, ShieldCheck, Lightbulb, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/components/StoreSettingsContext';
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_MANUFACTURING_IMAGE,
  DEFAULT_SHOWCASE,
  resolveImageUrl,
} from '@/lib/default-images';

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

  const heroImage = resolveImageUrl(settings?.hero_image_url, DEFAULT_HERO_IMAGE);
  const manufacturingImage = resolveImageUrl(
    settings?.manufacturing_image_url,
    DEFAULT_MANUFACTURING_IMAGE,
  );
  const heroHeadline = content?.hero_headline || 'Manufacturing Excellence From China To The World';
  const heroSubheadline = content?.hero_subheadline || 'Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.';
  const stats = content?.stats?.length ? content.stats : DEFAULT_STATS;
  const manufacturingHeadline = content?.manufacturing_headline || 'Manufacturing excellence';
  const manufacturingBody = content?.manufacturing_body || 'Built on a foundation of engineering expertise, we deliver reliable products that meet the demands of global markets. Our Guangzhou facility represents the pinnacle of modern production capabilities.';
  const showcaseProducts = content?.showcase_products?.length
    ? content.showcase_products.map((product, index) => ({
        ...product,
        image: resolveImageUrl(
          product.image,
          DEFAULT_SHOWCASE[index]?.image ?? DEFAULT_SHOWCASE[0].image,
        ),
      }))
    : DEFAULT_SHOWCASE;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center bg-cover bg-center" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.55)), url(${heroImage})`
      }}>
        <div className="section-container py-20 text-center text-white">
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
              <img src={manufacturingImage} alt="Jinyu in-house production and assembly workshop" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
              <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-lg border hidden md:block">
                <div className="text-4xl font-bold text-primary mb-1">10k+</div>
                <div className="text-sm font-medium text-muted-foreground">Sq.m Production Area</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
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
                <div className="aspect-[4/3] overflow-hidden bg-secondary/50">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
