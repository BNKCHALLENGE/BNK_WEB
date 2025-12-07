'use client';

import { useState } from 'react';
import { Mission, SortType, SortLabels } from '@/types/mission';
import MissionCard from './MissionCard';

interface MissionListProps {
  missions: Mission[];
  onLikeClick?: (missionId: string) => void;
  onMissionClick?: (mission: Mission) => void;
  onSortChange?: (sort: SortType) => void;
}

// 드롭다운 화살표 아이콘
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function MissionList({ 
  missions, 
  onLikeClick,
  onMissionClick,
  onSortChange 
}: MissionListProps) {
  const [selectedSort, setSelectedSort] = useState<SortType>('distance');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const sortOptions: SortType[] = ['distance', 'popular', 'recent'];
  
  const handleSortChange = (sort: SortType) => {
    setSelectedSort(sort);
    setIsDropdownOpen(false);
    onSortChange?.(sort);
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-5 min-h-[300px]">
      {/* 정렬 드롭다운 */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            {SortLabels[selectedSort]}
            <ChevronDownIcon />
          </button>
          
          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 min-w-[110px] animate-fadeIn">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`
                      w-full px-4 py-3 text-sm text-left transition-colors
                      ${selectedSort === option 
                        ? 'bg-coral-50 text-coral-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {SortLabels[option]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 세로 스크롤 미션 리스트 */}
      <div className="space-y-4">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            variant="horizontal"
            onLikeClick={onLikeClick}
            onCardClick={() => onMissionClick?.(mission)}
            showParticipateButton
          />
        ))}
      </div>
      
      {/* 빈 상태 */}
      {missions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-gray-500 font-medium">해당 카테고리에 미션이 없습니다.</p>
        </div>
      )}
    </section>
  );
}
