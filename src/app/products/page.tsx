"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategorySidebar from '@/components/CategorySidebar';
import ProductsList from '@/components/ProductsList';

const streamlinedCategories = [
  { id: 'Street Lamps', name: 'Street Lighting' },
  { id: 'Landscape Lamps', name: 'Landscape Lighting' },
  { id: 'Industrial Lighting', name: 'Industrial Lighting' },
  { id: 'Ceiling Lights', name: 'Ceiling Lights' },
  { id: 'Wall Sconces', name: 'Wall Sconces' },
  { id: 'Pendant Lamps', name: 'Pendant Lamps' }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Smooth scroll to product list on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('product-list-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Product Portfolio
            </h1>
            <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-2xl">
              Browse our focused range of high-performance municipal and commercial lighting solutions, engineered for precision, durability, and contemporary aesthetics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content: Layout with Sidebar and List */}
      <section className="flex-grow py-16 lg:py-24">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Sidebar */}
            <CategorySidebar 
              categories={streamlinedCategories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            {/* Product List */}
            <div className="flex-1 min-w-0" id="product-list-view">
              <ProductsList selectedCategory={selectedCategory} />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
