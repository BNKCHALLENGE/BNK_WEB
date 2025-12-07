'use client';

import { Mission } from '@/types/mission';
import Image from 'next/image';

interface InProgressSectionProps {
  missions: Mission[];
  onMissionClick?: (mission: Mission) => void;
}

export default function InProgressSection({ missions, onMissionClick }: InProgressSectionProps) {
  if (missions.length === 0) return null;

  return (
    <section className="bg-white px-4 py-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">진행중인 챌린지</h2>
      
      {/* 가로 스크롤 */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {missions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => onMissionClick?.(mission)}
              className="w-64 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex overflow-hidden"
            >
              {/* 이미지 */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={mission.imageUrl}
                  alt={mission.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              
              {/* 정보 */}
              <div className="flex-1 p-3 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                  {mission.title}
                </h3>
                <p className="text-xs text-gray-500 mb-1">
                  {mission.distance} 이내
                </p>
                <p className="text-xs font-semibold text-amber-600">
                  보상 {mission.coinReward}코인
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

