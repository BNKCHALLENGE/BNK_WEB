'use client';

import { Mission } from '@/types/mission';
import { calculateProgressPercent, formatRemainingTime } from '@/hooks/useMissionTracking';

interface MissionProgress {
  missionId: string;
  timeInZone: number;
  requiredDuration: number;
  distance: number;
  isInZone: boolean;
}

interface MissionTrackingOverlayProps {
  mission: Mission;
  progress: MissionProgress | null;
  onCancel: () => void;
}

export default function MissionTrackingOverlay({ 
  mission, 
  progress, 
  onCancel 
}: MissionTrackingOverlayProps) {
  const percent = calculateProgressPercent(progress);
  const remainingTime = formatRemainingTime(progress);
  const isInZone = progress?.isInZone ?? false;
  const distance = progress?.distance ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 animate-slideUp">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">미션 진행 중</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 미션 정보 */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-1">{mission.title}</h4>
          <p className="text-sm text-gray-500">{mission.locationDetail || mission.location}</p>
        </div>

        {/* 상태 표시 */}
        <div className="text-center mb-6">
          {isInZone ? (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-green-600 font-semibold mb-1">목표 위치 도착!</p>
              <p className="text-sm text-gray-500">해당 위치에서 1분간 대기해주세요</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <p className="text-orange-600 font-semibold mb-1">목표 위치로 이동 중</p>
              <p className="text-sm text-gray-500">
                목표까지 약 {distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`}
              </p>
            </>
          )}
        </div>

        {/* 진행률 바 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">진행률</span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(percent)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 남은 시간 */}
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-gray-900 tracking-tight">{remainingTime}</p>
          <p className="text-sm text-gray-500">남은 시간</p>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-700">
            💡 목표 위치 100m 이내에서 1분간 머물러야 미션이 완료됩니다.
            범위를 벗어나면 시간이 초기화됩니다.
          </p>
        </div>

        {/* 취소 버튼 */}
        <button
          onClick={onCancel}
          className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
        >
          미션 포기
        </button>
      </div>
    </div>
  );
}

