'use client';

import { Mission, CategoryLabels } from '@/types/mission';
import KakaoMap from './KakaoMap';

interface MissionDetailProps {
  mission: Mission;
  onBack: () => void;
  onLikeClick?: (missionId: string) => void;
  onParticipate?: (missionId: string) => void;
}

// 뒤로가기 아이콘
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

// 하트 아이콘
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill={filled ? '#ef4444' : 'none'} 
    stroke={filled ? '#ef4444' : '#f87171'} 
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// 코인 아이콘
const CoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" fill="#FCD34D" stroke="#F59E0B" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">₿</text>
  </svg>
);

// 위치 아이콘
const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

// 캘린더 아이콘
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// D-Day 계산
const calculateDDay = (endDate: string): string => {
  const end = new Date(endDate.replace(/\./g, '-'));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return '마감';
};

export default function MissionDetail({ 
  mission, 
  onBack, 
  onLikeClick,
  onParticipate 
}: MissionDetailProps) {
  const dDay = mission.endDate ? calculateDDay(mission.endDate) : '';
  const categoryLabel = CategoryLabels[mission.category] || mission.category;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-coral-500 hover:text-coral-600 transition-colors"
          >
            <BackIcon />
            <span className="text-sm font-medium">뒤로가기</span>
          </button>
          <h1 className="flex-1 text-center text-base font-semibold text-gray-900 pr-16 truncate">
            {mission.title}
          </h1>
        </div>
      </header>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 좋아요 버튼 & 제목 영역 */}
        <div className="flex flex-col items-center pt-8 pb-6 px-4">
          <button 
            onClick={() => onLikeClick?.(mission.id)}
            className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 hover:bg-red-100 transition-colors shadow-sm"
          >
            <HeartIcon filled={mission.isLiked} />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            {mission.title}
          </h2>
          
          <div className="flex items-center gap-2 text-coral-500">
            <CoinIcon />
            <span className="font-semibold">보상 동백 {mission.coinReward}코인</span>
          </div>
        </div>

        {/* 지도 영역 - 카카오맵 */}
        <div className="px-4 mb-6">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            {mission.coordinates ? (
              <KakaoMap 
                lat={mission.coordinates.lat} 
                lng={mission.coordinates.lng}
                title={mission.locationDetail || mission.location}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>위치 정보가 없습니다</span>
              </div>
            )}
          </div>
        </div>

        {/* 인사이트 박스 */}
        {mission.insight && (
          <div className="px-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full" />
                인사이트
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {mission.insight}
              </p>
            </div>
          </div>
        )}

        {/* 미션 정보 */}
        <div className="px-4 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">미션 정보</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <LocationIcon />
              <div>
                <span className="text-sm font-medium text-gray-500 mr-3">장소</span>
                <span className="text-sm text-gray-900">{mission.locationDetail || mission.location}</span>
              </div>
            </div>
            
            {mission.endDate && (
              <div className="flex items-center gap-3">
                <CalendarIcon />
                <div>
                  <span className="text-sm font-medium text-gray-500 mr-3">기간</span>
                  <span className="text-sm text-gray-900">
                    {mission.endDate} 
                    <span className="ml-2 text-coral-500 font-medium">({dDay})</span>
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <span className="text-sm">🏷️</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 mr-3">카테고리</span>
                <span className="text-sm text-gray-900">{categoryLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 인증 방식 */}
        {mission.verificationMethods && mission.verificationMethods.length > 0 && (
          <div className="px-4 mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">인증 방식</h3>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <ul className="space-y-3">
                {mission.verificationMethods.map((method, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => onParticipate?.(mission.id)}
            className="w-full py-4 bg-gradient-to-r from-coral-400 to-coral-500 text-white font-semibold rounded-2xl shadow-lg shadow-coral-500/30 hover:from-coral-500 hover:to-coral-600 active:scale-[0.98] transition-all"
          >
            미션 참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
