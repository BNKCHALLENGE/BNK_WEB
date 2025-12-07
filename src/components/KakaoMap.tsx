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
  const [debugInfo, setDebugInfo] = useState<string>('초기화 중...');
  const initialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었으면 스킵
    if (initialized.current) return;

    console.log('=== KakaoMap useEffect started ===');
    console.log('API Key exists:', !!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
    
    const initializeMap = () => {
      console.log('initializeMap called');
      setDebugInfo('지도 생성 중...');
      
      if (!mapRef.current) {
        console.error('mapRef is null');
        setDebugInfo('mapRef가 null입니다');
        return;
      }

      try {
        console.log('Creating map at:', lat, lng);
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 4,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        console.log('Map created successfully');

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
        setStatus('loaded');
        console.log('Map loaded successfully');
      } catch (err) {
        console.error('Map initialization error:', err);
        setStatus('error');
        setErrorMessage('지도 초기화 실패: ' + (err as Error).message);
      }
    };

    const checkKakaoSDK = () => {
      const hasKakao = typeof window !== 'undefined' && window.kakao;
      const hasMaps = hasKakao && window.kakao.maps;
      const hasLoad = hasMaps && typeof window.kakao.maps.load === 'function';
      
      console.log('SDK Check - kakao:', hasKakao, 'maps:', hasMaps, 'load:', hasLoad);
      setDebugInfo(`kakao: ${hasKakao}, maps: ${hasMaps}, load: ${hasLoad}`);
      
      return { hasKakao, hasMaps, hasLoad };
    };

    const tryLoadMap = () => {
      const { hasKakao, hasMaps, hasLoad } = checkKakaoSDK();
      
      if (hasMaps) {
        if (hasLoad) {
          console.log('Calling kakao.maps.load()');
          setDebugInfo('maps.load() 호출 중...');
          window.kakao.maps.load(() => {
            console.log('maps.load callback executed');
            setTimeout(initializeMap, 100);
          });
        } else {
          console.log('maps.load not available, initializing directly');
          setDebugInfo('직접 초기화 중...');
          setTimeout(initializeMap, 100);
        }
        return true;
      }
      return false;
    };

    // 즉시 시도
    if (!tryLoadMap()) {
      console.log('SDK not ready, starting polling...');
      setDebugInfo('SDK 로딩 대기 중...');
      
      let attempts = 0;
      const maxAttempts = 40; // 8초 (200ms * 40)
      
      const intervalId = setInterval(() => {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts}`);
        
        if (tryLoadMap()) {
          console.log('SDK loaded after polling');
          clearInterval(intervalId);
        } else if (attempts >= maxAttempts) {
          console.error('SDK load timeout');
          clearInterval(intervalId);
          setStatus('error');
          
          // 더 자세한 에러 메시지
          const { hasKakao, hasMaps } = checkKakaoSDK();
          if (!hasKakao) {
            setErrorMessage('카카오 SDK 로드 실패 - API 키를 확인하세요');
          } else if (!hasMaps) {
            setErrorMessage('카카오맵 API 로드 실패');
          } else {
            setErrorMessage('카카오맵 로드 시간 초과');
          }
        }
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [lat, lng, title]);

  // 에러 상태
  if (status === 'error') {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl ${className}`} style={{ minHeight: '200px' }}>
        <div className="text-center p-4">
          <div className="text-3xl mb-2">🗺️</div>
          <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
          <p className="text-xs text-gray-400 mt-2">
            위치: {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            API 키 설정 및 도메인 등록을 확인하세요
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
            <p className="text-[10px] text-gray-300 mt-1">{debugInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
}
