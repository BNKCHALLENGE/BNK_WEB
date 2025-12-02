'use client';

import { User } from '@/types/mission';

interface HeaderProps {
  user: User;
}

// 검색 아이콘
const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// 알림 아이콘
const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// 결제 아이콘
const PaymentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

// 메뉴 아이콘
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100/50">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 프로필 및 기본보기 */}
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 - 토끼 캐릭터 스타일 */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center overflow-hidden ring-2 ring-pink-100 shadow-sm">
            <span className="text-2xl transform hover:scale-110 transition-transform">🐰</span>
          </div>
          
          {/* 기본보기 버튼 */}
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 font-semibold transition-all active:scale-95">
            기본보기
          </button>
        </div>

        {/* 오른쪽: 아이콘들 */}
        <div className="flex items-center gap-1">
          {[
            { icon: <SearchIcon />, label: '검색' },
            { icon: <BellIcon />, label: '알림', hasNotification: true },
            { icon: <PaymentIcon />, label: '결제' },
            { icon: <MenuIcon />, label: '메뉴' },
          ].map((item, index) => (
            <button 
              key={index}
              className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all flex flex-col items-center"
            >
              {item.icon}
              <span className="text-[10px] mt-0.5 text-gray-500 font-medium">{item.label}</span>
              {item.hasNotification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
