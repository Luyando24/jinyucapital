"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  gallery_images?: string[];
  stock_quantity?: number;
  specifications?: Record<string, string>;
}

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } else {
        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.image || '',
          description: data.description || '',
          category: data.category || '',
          gallery_images: data.gallery_images || [],
          stock_quantity: data.stock_quantity,
          specifications: data.specifications,
        });
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = useCallback((amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 pt-24 min-h-screen">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full mt-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-8 pt-24 min-h-screen">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} />
          Go back
        </Link>
        <div className="text-center bg-destructive/10 text-destructive p-8 rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-6 font-medium">Product not found</p>
        </div>
      </div>
    );
  }

  // Build images array: main image + gallery images
  const images = [
    product.image,
    ...(product.gallery_images || []),
  ].filter(Boolean);

  const currentImage = images[currentImageIndex] || placeholderImage;
  const hasMultipleImages = images.length > 1;
  const inStock = product.stock_quantity === undefined || product.stock_quantity > 0;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 pt-24 min-h-screen bg-background">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-muted h-[400px] md:h-[500px] flex items-center justify-center p-8">
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            {hasMultipleImages && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur text-foreground p-3 rounded-full transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur text-foreground p-3 rounded-full transition-colors shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultipleImages && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col">
          <span className="text-primary font-bold text-sm mb-2">{product.category}</span>
          <h1 className="text-4xl font-bold text-foreground mb-4" style={{ textWrap: 'balance' as any }}>{product.name}</h1>

          <div className="prose prose-sm md:prose-base dark:prose-invert text-muted-foreground mb-8">
            <p>{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-8 border rounded-xl overflow-hidden">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider px-4 py-3 bg-muted/50 border-b">Specifications</h3>
              <div className="divide-y">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 mb-8">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quantity</h3>
            <div className="flex items-center border rounded-full p-1 bg-background shadow-sm">
              <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="rounded-full h-10 w-10"><Minus size={16} /></Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="rounded-full h-10 w-10"><Plus size={16} /></Button>
            </div>
          </div>

          <div className="mt-auto pt-6 space-y-4">
            <Button
              asChild
              size="lg"
              className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <Link href={`/request-quote?product=${encodeURIComponent(product.name)}&quantity=${quantity}`}>
                <Mail className="mr-3 h-5 w-5" /> Request a Quote
              </Link>
            </Button>

            <div className={`flex items-center justify-center gap-2 text-sm font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}>
              <CheckCircle size={16} />
              {inStock ? "In stock and ready to ship worldwide" : "Out of stock"}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
