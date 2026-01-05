import React from 'react';
import { CATEGORIES } from '../constants';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-[60px] md:top-[72px] bg-white z-30 py-4 border-b border-gray-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-300 rounded-sm ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-500 hover:text-black bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;