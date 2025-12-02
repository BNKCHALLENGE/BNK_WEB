'use client';

import { Mission } from '@/types/mission';
import Image from 'next/image';

interface MissionCardProps {
  mission: Mission;
  variant?: 'horizontal' | 'vertical';
  onLikeClick?: (missionId: string) => void;
  onCardClick?: () => void;
  showParticipateButton?: boolean;
}

// 하트 아이콘
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill={filled ? '#ef4444' : 'none'} 
    stroke={filled ? '#ef4444' : 'white'} 
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// 코인 아이콘
const CoinIcon = () => (
  <span className="text-xs">🪙</span>
);

export default function MissionCard({ 
  mission, 
  variant = 'vertical',
  onLikeClick,
  onCardClick,
  showParticipateButton = false
}: MissionCardProps) {
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeClick?.(mission.id);
  };
  
  if (variant === 'horizontal') {
    // 가로형 카드 (세로 스크롤 미션 리스트용)
    return (
      <div 
        onClick={onCardClick}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
      >
        <div className="relative w-full h-44 overflow-hidden">
          <Image
            src={mission.imageUrl}
            alt={mission.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* 좋아요 버튼 */}
          <button 
            onClick={handleLikeClick}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg"
          >
            <HeartIcon filled={mission.isLiked} />
          </button>
          
          {/* 카테고리 뱃지 */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
              {mission.category}
            </span>
          </div>
          
          {/* 로고 오버레이 */}
          {mission.title.includes('자이언츠') && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                <span className="text-sm font-black text-red-600 tracking-tight">Giants</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-coral-600 transition-colors line-clamp-1">
            {mission.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {mission.location} ({mission.distance})
              </p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                <CoinIcon />
                <span>{mission.coinReward}코인</span>
              </div>
            </div>
            
            {showParticipateButton && (
              <span className="text-sm text-coral-500 font-semibold group-hover:text-coral-600 transition-colors">
                미션 참여하기 →
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // 세로형 카드 (AI 추천 가로 스크롤용) - 높이 고정
  return (
    <div 
      onClick={onCardClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 h-full flex flex-col"
    >
      <div className="relative w-full h-28 overflow-hidden flex-shrink-0">
        <Image
          src={mission.imageUrl}
          alt={mission.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* 좋아요 버튼 */}
        <button 
          onClick={handleLikeClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg"
        >
          <HeartIcon filled={mission.isLiked} />
        </button>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-coral-600 transition-colors">
          {mission.title}
        </h3>
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">
          {mission.location} ({mission.distance})
        </p>
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-auto">
          <CoinIcon />
          <span>{mission.coinReward}코인</span>
        </div>
      </div>
    </div>
  );
}
