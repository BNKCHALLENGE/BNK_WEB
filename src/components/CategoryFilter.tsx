'use client';

import { Category, CategoryType, CategoryLabels } from '@/types/mission';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

// 카테고리 이름을 소문자로 변환
const normalizeCategoryName = (name: string): CategoryType => {
  return name.toLowerCase() as CategoryType;
};

// 카테고리 한글 레이블 가져오기
const getCategoryLabel = (name: string): string => {
  const normalized = normalizeCategoryName(name);
  return CategoryLabels[normalized] || name;
};

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="bg-white px-4 py-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">전체 챌린지</h2>
      
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
        {categories.map((category) => {
          const normalizedName = normalizeCategoryName(category.name);
          const isSelected = normalizeCategoryName(selectedCategory) === normalizedName;
          const label = getCategoryLabel(category.name);
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(normalizedName)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95
                ${isSelected 
                  ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
