'use client';

import { Mission, User } from '@/types/mission';
import MissionCard from './MissionCard';

interface AIRecommendSectionProps {
  user: User;
  missions: Mission[];
  onLikeClick?: (missionId: string) => void;
  onMissionClick?: (mission: Mission) => void;
}

// AI 아이콘
const AIIcon = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md text-[10px] text-white font-bold shadow-sm">
    AI
  </span>
);

export default function AIRecommendSection({ 
  user, 
  missions,
  onLikeClick,
  onMissionClick
}: AIRecommendSectionProps) {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-6">
      {/* 섹션 헤더 */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <AIIcon />
          <h2 className="text-lg font-bold text-gray-900">
            추천 미션 <span className="text-coral-500">for {user.name}</span> 님
          </h2>
        </div>
        <p className="text-sm text-gray-500 ml-7">
          고객님의 활동 로그 기반 맞춤형 미션을 확인하세요.
        </p>
      </div>
      
      {/* 미션 카드 가로 스크롤 - 높이 고정 */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 h-52">
          {missions.map((mission) => (
            <div key={mission.id} className="w-40 flex-shrink-0 h-full">
              <MissionCard
                mission={mission}
                variant="vertical"
                onLikeClick={onLikeClick}
                onCardClick={() => onMissionClick?.(mission)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
