"use client";

import React, { useState } from 'react';
import { Layers, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selectedCategory, onCategorySelect }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const allCategories = [{ id: 'all', name: 'All Products' }, ...categories];
  const selected = allCategories.find(c => c.id === selectedCategory) || allCategories[0];

  return (
    <>
      {/* ── Mobile: compact dropdown + pill strip ── */}
      <div className="lg:hidden w-full mb-2">
        {/* Scrollable pill row */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          {allCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col gap-2">
        <div className="mb-4 pb-4 border-b border-border">
          <button
            onClick={() => onCategorySelect('all')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground font-medium shadow-md'
                : 'text-foreground hover:bg-muted font-medium'
            }`}
          >
            <span className="flex items-center gap-3">
              <Layers className="w-5 h-5" />
              All Products
            </span>
          </button>
        </div>

        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                selectedCategory === category.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;
