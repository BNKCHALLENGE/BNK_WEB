'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  lat: number;
  lng: number;
  title?: string;
  className?: string;
}

export default function KakaoMap({ lat, lng, title, className = '' }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const initialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었으면 스킵
    if (initialized.current) return;

    const initializeMap = () => {
      console.log('initializeMap called, mapRef:', mapRef.current);
      
      if (!mapRef.current) {
        console.error('mapRef is null');
        return;
      }

      try {
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 4,
        };

        console.log('Creating map with options:', options);
        const map = new window.kakao.maps.Map(mapRef.current, options);
        console.log('Map created:', map);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 (제목이 있을 경우)
        if (title) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;">${title}</div>`,
          });
          infowindow.open(map, marker);
        }

        // 지도 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        initialized.current = true;
        console.log('Setting status to loaded');
        setStatus('loaded');
      } catch (err) {
        console.error('Map initialization error:', err);
        setStatus('error');
        setErrorMessage('지도 초기화 실패: ' + (err as Error).message);
      }
    };

    const tryLoadMap = () => {
      if (window.kakao && window.kakao.maps) {
        if (typeof window.kakao.maps.load === 'function') {
          window.kakao.maps.load(() => {
            console.log('maps.load callback, calling initializeMap');
            // 약간의 딜레이 후 초기화 (DOM이 준비되도록)
            setTimeout(initializeMap, 100);
          });
        } else {
          setTimeout(initializeMap, 100);
        }
        return true;
      }
      return false;
    };

    // 즉시 시도
    if (!tryLoadMap()) {
      const intervalId = setInterval(() => {
        if (tryLoadMap()) {
          clearInterval(intervalId);
        }
      }, 200);

      // 8초 후 타임아웃
      setTimeout(() => {
        clearInterval(intervalId);
        if (!initialized.current) {
          setStatus('error');
          setErrorMessage('카카오맵 로드 시간 초과');
        }
      }, 8000);
    }
  }, [lat, lng, title]);

  // 에러 상태
  if (status === 'error') {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl ${className}`} style={{ minHeight: '200px' }}>
        <div className="text-center p-4">
          <div className="text-3xl mb-2">🗺️</div>
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <p className="text-xs text-gray-400 mt-1">
            위치: {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ minHeight: '200px' }}>
      {/* 지도 컨테이너 - 항상 렌더링 */}
      <div 
        ref={mapRef} 
        className={`w-full h-full ${className}`}
        style={{ minHeight: '200px' }}
      />
      
      {/* 로딩 오버레이 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-400">지도 로딩중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
