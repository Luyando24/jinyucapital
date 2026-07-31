"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Factory, ShieldCheck, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteLanguage } from "@/components/WebsiteLanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomepageStat {
  value: string;
  label: string;
}

export interface ShowcaseProduct {
  title: string;
  description: string;
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image_url: string | null;
  created_at: string;
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

export function HomeStatsSection({ stats }: { stats: HomepageStat[] }) {
  const { t } = useWebsiteLanguage();
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {stat.value}
              </div>
              <div className="text-sm md:text-base opacity-90">{t(stat.label)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Manufacturing Section ────────────────────────────────────────────────────

const DEFAULT_FEATURES = [
  {
    icon: Factory,
    title: "Advanced manufacturing",
    description:
      "State-of-the-art production facilities equipped with automated assembly lines for precision and scale.",
  },
  {
    icon: ShieldCheck,
    title: "Rigorous quality control",
    description:
      "Comprehensive testing protocols ensuring every appliance and lighting fixture meets international safety standards.",
  },
  {
    icon: Lightbulb,
    title: "Innovative engineering",
    description:
      "Dedicated R&D team continuously developing energy-efficient and smart technology solutions.",
  },
];

export function HomeManufacturingSection({
  headline,
  body,
  image,
}: {
  headline: string;
  body: string;
  image: string;
}) {
  const { t } = useWebsiteLanguage();
  return (
    <section className="py-24 bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-4xl font-semibold mb-6"
              style={{ textWrap: "balance" }}
            >
              {t(headline)}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {t(body)}
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
                    <h3 className="text-xl font-semibold mb-2">{t(feature.title)}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(feature.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {image ? (
              <img
                src={image}
                alt="Jinyu in-house production and assembly workshop"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
              />
            ) : (
              <div className="rounded-2xl shadow-xl w-full aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-bold border border-zinc-800 p-6 text-center gap-2">
                <Factory className="w-12 h-12 text-zinc-600 mb-2" />
                <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">
                  Guangzhou Production Facility
                </span>
                <span className="text-xs font-normal text-zinc-500 max-w-xs">
                  High-performance manufacturing, assembly, and testing workshop
                </span>
              </div>
            )}
            <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-lg border hidden md:block">
              <div className="text-4xl font-bold text-primary mb-1">10k+</div>
              <div className="text-sm font-medium text-muted-foreground">
                Sq.m Production Area
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Product Showcase ─────────────────────────────────────────────────────────

export function HomeProductsSection({
  products,
}: {
  products: ShowcaseProduct[];
}) {
  const { t } = useWebsiteLanguage();
  if (products.length === 0) return null;
  return (
    <section className="py-24 bg-muted">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ textWrap: "balance" }}
            >
              {t("Featured Product Lines")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("Explore our signature street lighting collections, engineered for superior outdoor performance, longevity, and aesthetic appeal.")}
            </p>
          </div>
          <Button asChild variant="outline" className="flex-shrink-0">
            <Link href="/products">{t("View all products")}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary/50 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
  );
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export function HomeBlogSection({ posts }: { posts: BlogPost[] }) {
  const { t } = useWebsiteLanguage();
  if (posts.length === 0) return null;
  return (
    <section className="py-24 bg-background border-t">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ textWrap: "balance" }}
            >
              {t("Latest news & insights")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("Stay updated with our latest technology breakthroughs, lighting guides, and company announcements.")}
            </p>
          </div>
          <Button asChild variant="outline" className="flex-shrink-0">
            <Link href="/blog">{t("Read all insights")}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
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
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-primary group-hover:underline">
                      {t("Read More →")}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

export function HomeCtaSection() {
  const { t } = useWebsiteLanguage();
  return (
    <section className="py-24 bg-background text-foreground border-t">
      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-5xl font-extrabold mb-6"
            style={{ textWrap: "balance" }}
          >
            {t("Partner with a reliable manufacturer")}
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-10 text-muted-foreground">
            {t("Whether you need OEM services or bulk orders of our standard product lines, our team is ready to support your business.")}
          </p>
          <Button asChild size="lg" className="px-8 h-12 text-base">
            <Link href="/request-quote">{t("Contact sales")}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
