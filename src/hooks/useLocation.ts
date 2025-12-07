'use client';

import { useState, useEffect, useCallback } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
}

// React Native WebView 환경인지 확인
const isReactNativeWebView = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).ReactNativeWebView;
};

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 네이티브에서 위치 업데이트 받기
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNativeLocation = (event: CustomEvent<LocationData>) => {
      console.log('Received native location:', event.detail);
      setLocation(event.detail);
      setIsLoading(false);
      setError(null);
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('nativeLocationUpdate', handleNativeLocation as EventListener);

    // 이미 네이티브 위치가 있으면 사용
    if ((window as any).nativeLocation) {
      setLocation((window as any).nativeLocation);
    }

    return () => {
      window.removeEventListener('nativeLocationUpdate', handleNativeLocation as EventListener);
    };
  }, []);

  // 위치 요청 함수
  const requestLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // React Native WebView 환경
    if (isReactNativeWebView()) {
      console.log('Requesting location from React Native');
      (window as any).requestNativeLocation?.();
      
      // 타임아웃 설정
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setError('위치 요청 시간 초과');
        }
      }, 15000);
      return;
    }

    // 일반 웹 브라우저 환경
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setIsLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError(getErrorMessage(err.code));
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      setError('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
      setIsLoading(false);
    }
  }, [isLoading]);

  return { location, error, isLoading, requestLocation };
}

// 에러 메시지 변환
function getErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return '위치 권한이 거부되었습니다.';
    case 2:
      return '위치를 가져올 수 없습니다.';
    case 3:
      return '위치 요청 시간이 초과되었습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}

// 유틸리티: 두 좌표 사이 거리 계산 (km)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

