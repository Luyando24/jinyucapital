"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { products as allProducts } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductsListProps {
  selectedCategory: string;
}

const ProductsList: React.FC<ProductsListProps> = ({ selectedCategory }) => {
  const [products, setProducts] = useState(allProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      let filtered = allProducts;
      if (selectedCategory !== 'all') {
        filtered = allProducts.filter(p => p.category === selectedCategory);
      }
      setProducts(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm h-full flex flex-col">
                  <Skeleton className="w-full aspect-[4/3] rounded-none" />
                  <div className="p-6 space-y-4 flex flex-col flex-grow">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-32 px-4 text-center bg-muted/30 rounded-3xl border border-dashed border-border"
            >
              <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-sm border">
                <PackageSearch className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">No products found</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed text-lg">
                We couldn&apos;t find any products in this category. Please try another category.
              </p>
            </motion.div>
          ) : (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(ProductsList);
