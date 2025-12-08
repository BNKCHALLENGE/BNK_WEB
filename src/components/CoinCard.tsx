'use client';

import Image from 'next/image';

interface CoinCardProps {
  coinBalance: number;
  onViewHistory?: () => void;
}

// 카드 아이콘
const CardPayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

// 눈 아이콘
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function CoinCard({ coinBalance, onViewHistory }: CoinCardProps) {
  return (
    <div className="mx-4 my-4">
      <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 rounded-2xl p-5 text-white shadow-xl shadow-red-500/20">
        {/* 상단 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/db.png" 
              alt="동백코인" 
              width={28} 
              height={28}
              className="object-contain"
            />
            <span className="text-sm text-white/90">총 보유 동백스테이블코인</span>
          </div>
          <button className="text-white/80 hover:text-white transition-colors">
            <CardPayIcon />
          </button>
        </div>

        {/* 코인 금액 */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl font-bold tracking-tight">
            {coinBalance.toLocaleString()}
          </span>
          <span className="text-xl font-medium text-white/90">코인</span>
          <button className="text-white/70 hover:text-white transition-colors ml-1">
            <EyeIcon />
          </button>
        </div>

        {/* 적립 내역 버튼 */}
        <button
          onClick={onViewHistory}
          className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors border border-white/30"
        >
          적립 내역
        </button>
      </div>
    </div>
  );
}
