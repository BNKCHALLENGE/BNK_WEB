'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mission } from '@/types/mission';

interface MissionProgress {
  missionId: string;
  timeInZone: number;
  requiredDuration: number;
  distance: number;
  isInZone: boolean;
}

interface MissionCompletedData {
  missionId: string;
  reward?: number;
  coinBalance?: number;
}

interface UseMissionTrackingReturn {
  isTracking: boolean;
  progress: MissionProgress | null;
  startTracking: (mission: Mission) => void;
  stopTracking: () => void;
}

// React Native WebView 환경인지 확인
const isReactNativeWebView = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).ReactNativeWebView;
};

export function useMissionTracking(
  onComplete?: (data: MissionCompletedData) => void
): UseMissionTrackingReturn {
  const [isTracking, setIsTracking] = useState(false);
  const [progress, setProgress] = useState<MissionProgress | null>(null);

  // 미션 진행 상황 이벤트 리스너
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleProgress = (event: CustomEvent<MissionProgress>) => {
      console.log('Mission progress:', event.detail);
      setProgress(event.detail);
    };

    const handleCompleted = (event: CustomEvent<MissionCompletedData>) => {
      console.log('Mission completed:', event.detail);
      setIsTracking(false);
      setProgress(null);
      onComplete?.(event.detail);
    };

    window.addEventListener('missionProgress', handleProgress as EventListener);
    window.addEventListener('missionCompleted', handleCompleted as EventListener);

    return () => {
      window.removeEventListener('missionProgress', handleProgress as EventListener);
      window.removeEventListener('missionCompleted', handleCompleted as EventListener);
    };
  }, [onComplete]);

  // 미션 추적 시작
  const startTracking = useCallback((mission: Mission) => {
    if (!mission.coordinates) {
      console.error('Mission has no coordinates');
      return;
    }

    setIsTracking(true);
    setProgress(null);

    if (isReactNativeWebView()) {
      // React Native 앱에 추적 시작 요청
      (window as any).startMissionTracking?.(
        mission.id,
        mission.coordinates.lat,
        mission.coordinates.lng,
        60000 // 1분
      );
    } else {
      // 웹 브라우저 환경 - 시뮬레이션 (테스트용)
      console.log('Web browser environment - mission tracking simulated');
      simulateWebTracking(mission);
    }
  }, []);

  // 미션 추적 중지
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setProgress(null);

    if (isReactNativeWebView()) {
      (window as any).stopMissionTracking?.();
    }
  }, []);

  return { isTracking, progress, startTracking, stopTracking };
}

// 웹 브라우저용 시뮬레이션 (테스트용)
function simulateWebTracking(mission: Mission) {
  let timeInZone = 0;
  const requiredDuration = 60000;

  const interval = setInterval(() => {
    timeInZone += 1000;

    const event = new CustomEvent('missionProgress', {
      detail: {
        missionId: mission.id,
        timeInZone,
        requiredDuration,
        distance: 50, // 시뮬레이션된 거리
        isInZone: true,
      },
    });
    window.dispatchEvent(event);

    // 1분 후 완료
    if (timeInZone >= requiredDuration) {
      clearInterval(interval);
      
      const completeEvent = new CustomEvent('missionCompleted', {
        detail: {
          missionId: mission.id,
          reward: mission.coinReward,
          coinBalance: 28146 + mission.coinReward,
        },
      });
      window.dispatchEvent(completeEvent);
    }
  }, 1000);

  // cleanup을 위해 interval ID 저장
  (window as any).__missionTrackingInterval = interval;
}

// 진행률 퍼센트 계산 헬퍼
export function calculateProgressPercent(progress: MissionProgress | null): number {
  if (!progress) return 0;
  return Math.min((progress.timeInZone / progress.requiredDuration) * 100, 100);
}

// 남은 시간 포맷팅 헬퍼
export function formatRemainingTime(progress: MissionProgress | null): string {
  if (!progress) return '1:00';
  const remaining = Math.max(progress.requiredDuration - progress.timeInZone, 0);
  const seconds = Math.ceil(remaining / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}


