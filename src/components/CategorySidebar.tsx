import React from 'react';
import { Layers } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) => {
  return (
    <div className="w-full lg:w-64 flex-shrink-0 lg:pr-8 flex flex-col gap-2">
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

      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isSelected 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySidebar;
