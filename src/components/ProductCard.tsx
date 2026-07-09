"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  index: number;
}

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col cursor-pointer"
      >
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={product.image || placeholderImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300" />
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border">
            {product.category}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground flex-grow line-clamp-3 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-bold text-lg">${product.price}</span>
            <span className="text-sm text-primary font-medium">View Details →</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default React.memo(ProductCard);
