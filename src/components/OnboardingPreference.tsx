'use client';

import { useState } from 'react';
import { OnboardingCategories, CategoryType } from '@/types/mission';

interface OnboardingPreferenceProps {
  onComplete: (selectedCategories: CategoryType[]) => void;
  onSkip: () => void;
}

const MIN_SELECTION = 3;

export default function OnboardingPreference({ onComplete, onSkip }: OnboardingPreferenceProps) {
  const [selectedIds, setSelectedIds] = useState<CategoryType[]>([]);

  const toggleCategory = (id: CategoryType) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const remainingCount = MIN_SELECTION - selectedIds.length;
  const isComplete = remainingCount <= 0;

  const handleSubmit = () => {
    if (isComplete) {
      onComplete(selectedIds);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 pt-12 pb-32">
        {/* 과녁 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                </div>
              </div>
            </div>
            {/* 화살 */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -rotate-45">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 텍스트 */}
        <div className="text-center mb-10">
          <p className="text-gray-400 text-sm mb-3">챌린지가 처음이시군요!</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            어떤 주제에 관심 있으신가요?
          </h1>
          <p className="text-gray-500 text-sm">
            취향에 딱 맞는 챌린지를 추천해드릴게요
          </p>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {OnboardingCategories.map((category) => {
            const isSelected = selectedIds.includes(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`
                  relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2
                  transition-all duration-200 active:scale-95
                  ${isSelected 
                    ? 'bg-white border-2 border-coral-500 shadow-lg shadow-coral-500/20' 
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }
                `}
              >
                {/* 선택 체크 표시 */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-coral-500 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
                
                <span className="text-3xl">{category.emoji}</span>
                <span className={`text-sm font-semibold ${isSelected ? 'text-coral-600' : 'text-gray-700'}`}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 바로 둘러보기 링크 */}
        <div className="text-center">
          <button 
            onClick={onSkip}
            className="text-gray-400 text-sm underline underline-offset-4 hover:text-gray-600 transition-colors"
          >
            바로 챌린지 둘러보기
          </button>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              w-full py-5 font-semibold text-base transition-all
              ${isComplete 
                ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white' 
                : 'bg-coral-500 text-white/90'
              }
            `}
          >
            {isComplete 
              ? `좋아요! ${selectedIds.length}개 선택 완료` 
              : `좋아요! ${remainingCount}개 이상 더 선택해주세요!`
            }
          </button>
        </div>
      </div>
    </div>
  );
}
