'use client';

import { TabItem } from '@/types/mission';

interface TabNavigationProps {
  tabs: TabItem[];
  onTabClick?: (tabId: string) => void;
}

export default function TabNavigation({ tabs, onTabClick }: TabNavigationProps) {
  const handleTabClick = (tab: TabItem) => {
    // 챌린지 탭만 활성화, 나머지는 비활성화 상태로 유지
    if (tab.name === '챌린지') {
      onTabClick?.(tab.id);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-[68px] z-40">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            disabled={tab.name !== '챌린지'}
            className={`
              relative flex-shrink-0 px-6 py-4 text-[15px] font-semibold transition-all
              ${tab.isActive 
                ? 'text-gray-900' 
                : 'text-gray-400'
              }
              ${tab.name === '챌린지' 
                ? 'cursor-pointer hover:text-gray-700' 
                : 'cursor-not-allowed opacity-50'
              }
            `}
          >
            <span className="relative">
              {tab.name}
              {/* 활성 탭 표시 점 */}
              {tab.hasNotification && tab.isActive && (
                <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 bg-coral-500 rounded-full animate-pulse" />
              )}
            </span>
            
            {/* 활성 탭 하단 라인 */}
            {tab.isActive && (
              <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-gray-900 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
