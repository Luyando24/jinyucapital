"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = [
  'All',
  'Explosion-Proof Lighting',
  'Industrial Equipment',
  'Industry News & Insights',
  'OEM/ODM Solutions',
  'Product Updates'
];

const MOCK_POSTS = [
  {
    id: '1',
    title: 'Advancements in Explosion-Proof LED Technology',
    slug: 'advancements-explosion-proof-led',
    excerpt: 'Discover how new LED technologies are improving safety and efficiency in hazardous industrial environments.',
    category: 'Explosion-Proof Lighting',
    author: 'Admin',
    publish_date: '2026-06-15',
    featured_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'Optimizing Industrial Lighting for Maximum Productivity',
    slug: 'optimizing-industrial-lighting',
    excerpt: 'Proper lighting design can significantly impact worker performance and safety. Learn the key factors for success.',
    category: 'Industrial Equipment',
    author: 'Admin',
    publish_date: '2026-05-20',
    featured_image_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'The Future of Smart Street Lighting in Modern Cities',
    slug: 'future-smart-street-lighting',
    excerpt: 'Smart cities require smart lighting. Explore how IoT-enabled street lamps are transforming urban infrastructure.',
    category: 'Industry News & Insights',
    author: 'Admin',
    publish_date: '2026-04-10',
    featured_image_url: 'https://images.unsplash.com/photo-1474112704763-f1119d8a6b3d?auto=format&fit=crop&q=80'
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Industry Insights & News
            </h1>
            <p className="text-lg leading-relaxed opacity-90 max-w-2xl">
              Stay informed with the latest trends in industrial manufacturing, explosion-proof technology, and robust engineering solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 flex-grow bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar flex-grow">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 border ${
                      isActive 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="relative max-w-sm w-full md:w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 rounded-full bg-muted/30 border-transparent focus-visible:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-full bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  <Skeleton className="h-56 w-full rounded-none" />
                  <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-16 w-full flex-grow mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-muted/30 rounded-2xl border border-dashed">
              <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground max-w-md">
                No articles match your current filters.
              </p>
              <Button 
                className="mt-6" 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                        <span>{post.publish_date}</span>
                        <span className="font-bold text-primary">Read More →</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
        </div>
      </section>
    </div>
  );
}
